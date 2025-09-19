import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import { sendEmail } from '../services/emailService';

const router = express.Router();

// Available rewards configuration
const AVAILABLE_REWARDS = [
  {
    id: 'amazon-500',
    type: 'voucher',
    title: 'Amazon Shopping Voucher',
    description: '₹500 Amazon gift card for online shopping',
    pointsRequired: 500,
    value: 500,
    provider: 'Amazon',
    category: 'Shopping'
  },
  {
    id: 'jio-200',
    type: 'recharge',
    title: 'Jio Mobile Recharge',
    description: '₹200 mobile recharge for Jio users',
    pointsRequired: 200,
    value: 200,
    provider: 'Jio',
    category: 'Mobile'
  },
  {
    id: 'airtel-300',
    type: 'recharge',
    title: 'Airtel Mobile Recharge',
    description: '₹300 mobile recharge for Airtel users',
    pointsRequired: 300,
    value: 300,
    provider: 'Airtel',
    category: 'Mobile'
  },
  {
    id: 'flipkart-1000',
    type: 'voucher',
    title: 'Flipkart Shopping Voucher',
    description: '₹1000 Flipkart gift card',
    pointsRequired: 1000,
    value: 1000,
    provider: 'Flipkart',
    category: 'Shopping'
  },
  {
    id: 'vi-250',
    type: 'recharge',
    title: 'Vi Mobile Recharge',
    description: '₹250 mobile recharge for Vi users',
    pointsRequired: 250,
    value: 250,
    provider: 'Vi',
    category: 'Mobile'
  },
  {
    id: 'swiggy-300',
    type: 'voucher',
    title: 'Swiggy Food Voucher',
    description: '₹300 food delivery voucher',
    pointsRequired: 300,
    value: 300,
    provider: 'Swiggy',
    category: 'Food'
  }
];

// Get user reward points and transactions
router.get('/balance', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        rewardPoints: true,
        totalEarned: true,
        totalRedeemed: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get recent transactions
    const recentTransactions = await prisma.rewardTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json({
      success: true,
      data: {
        balance: user.rewardPoints,
        totalEarned: user.totalEarned,
        totalRedeemed: user.totalRedeemed,
        recentTransactions
      }
    });

  } catch (error) {
    logger.error('Get reward balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reward balance'
    });
  }
});

// Get available rewards
router.get('/available', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    // Get user's current points
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { rewardPoints: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add availability status to rewards
    const rewardsWithAvailability = AVAILABLE_REWARDS.map(reward => ({
      ...reward,
      isAvailable: user.rewardPoints >= reward.pointsRequired
    }));

    res.json({
      success: true,
      data: {
        rewards: rewardsWithAvailability,
        userPoints: user.rewardPoints
      }
    });

  } catch (error) {
    logger.error('Get available rewards error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available rewards'
    });
  }
});

// Redeem reward
router.post('/redeem', [
  body('rewardId').notEmpty().trim(),
  body('phone').optional().isMobilePhone('any'),
  body('email').optional().isEmail()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { rewardId, phone, email } = req.body;
    const userId = req.user!.id;

    // Find the reward
    const reward = AVAILABLE_REWARDS.find(r => r.id === rewardId);
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Reward not found'
      });
    }

    // Get user's current points
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        rewardPoints: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has enough points
    if (user.rewardPoints < reward.pointsRequired) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient reward points'
      });
    }

    // For mobile recharges, phone number is required
    if (reward.type === 'recharge' && !phone && !user.phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required for mobile recharge'
      });
    }

    // Create reward transaction
    const transaction = await prisma.rewardTransaction.create({
      data: {
        userId,
        type: 'REDEEMED',
        points: -reward.pointsRequired,
        description: `Redeemed: ${reward.title}`,
        referenceId: reward.id,
        metadata: {
          rewardDetails: reward,
          phone: phone || user.phone,
          email: email || user.email
        }
      }
    });

    // Update user points
    await prisma.user.update({
      where: { id: userId },
      data: {
        rewardPoints: { decrement: reward.pointsRequired },
        totalRedeemed: { increment: reward.pointsRequired }
      }
    });

    // Process the reward (in production, integrate with actual providers)
    await processRewardRedemption(reward, {
      userId,
      phone: phone || user.phone,
      email: email || user.email,
      transactionId: transaction.id
    });

    // Send confirmation email
    await sendEmail({
      to: email || user.email,
      subject: 'Reward Redeemed Successfully - TravelEase',
      template: 'reward-redemption',
      data: {
        firstName: user.firstName,
        rewardTitle: reward.title,
        rewardValue: reward.value,
        transactionId: transaction.id
      }
    });

    res.json({
      success: true,
      message: 'Reward redeemed successfully! Check your email for details.',
      data: {
        transaction,
        remainingPoints: user.rewardPoints - reward.pointsRequired
      }
    });

  } catch (error) {
    logger.error('Redeem reward error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to redeem reward'
    });
  }
});

// Get reward transactions history
router.get('/transactions', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('type').optional().isIn(['EARNED', 'REDEEMED', 'BONUS', 'PENALTY'])
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const type = req.query.type as string;
    const userId = req.user!.id;

    const where: any = { userId };
    if (type) where.type = type;

    const [transactions, total] = await Promise.all([
      prisma.rewardTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.rewardTransaction.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get reward transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reward transactions'
    });
  }
});

// Award points (internal function, can be called by other services)
export const awardPoints = async (
  userId: string,
  points: number,
  description: string,
  referenceId?: string
) => {
  try {
    // Create transaction
    await prisma.rewardTransaction.create({
      data: {
        userId,
        type: 'EARNED',
        points,
        description,
        referenceId
      }
    });

    // Update user points
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        rewardPoints: { increment: points },
        totalEarned: { increment: points }
      },
      select: {
        firstName: true,
        email: true,
        rewardPoints: true
      }
    });

    // Send notification email
    await sendEmail({
      to: updatedUser.email,
      subject: 'You earned reward points! - TravelEase',
      template: 'reward-notification',
      data: {
        firstName: updatedUser.firstName,
        points,
        reason: description,
        totalPoints: updatedUser.rewardPoints
      }
    });

    logger.info(`Awarded ${points} points to user ${userId} for: ${description}`);

  } catch (error) {
    logger.error('Award points error:', error);
    throw error;
  }
};

// Process reward redemption (integrate with actual providers in production)
const processRewardRedemption = async (reward: any, details: any) => {
  try {
    // This is where you would integrate with actual reward providers
    // For now, we'll just log the redemption
    
    logger.info('Processing reward redemption:', {
      rewardId: reward.id,
      rewardType: reward.type,
      provider: reward.provider,
      value: reward.value,
      userId: details.userId,
      transactionId: details.transactionId
    });

    // In production, you would:
    // 1. For mobile recharges: Call telecom provider APIs
    // 2. For vouchers: Generate voucher codes via partner APIs
    // 3. Handle success/failure responses
    // 4. Update transaction status accordingly

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      voucherCode: reward.type === 'voucher' ? generateVoucherCode() : null,
      rechargeStatus: reward.type === 'recharge' ? 'completed' : null
    };

  } catch (error) {
    logger.error('Process reward redemption error:', error);
    throw error;
  }
};

// Generate voucher code (placeholder)
const generateVoucherCode = (): string => {
  return 'TE' + Math.random().toString(36).substr(2, 8).toUpperCase();
};

export default router;