import express from 'express';
import { body, query, validationResult } from 'express-validator';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Submit hidden gem
router.post('/', upload.array('images', 5), [
  body('name').trim().isLength({ min: 3 }),
  body('description').trim().isLength({ min: 10 }),
  body('address').trim().isLength({ min: 5 }),
  body('city').trim().isLength({ min: 2 }),
  body('state').trim().isLength({ min: 2 }),
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 }),
  body('category').trim().isLength({ min: 2 })
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

    const {
      name,
      description,
      address,
      city,
      state,
      country = 'India',
      latitude,
      longitude,
      category,
      tips,
      bestTime,
      difficulty
    } = req.body;

    const userId = req.user!.id;
    const files = req.files as Express.Multer.File[];

    // Upload images to Cloudinary
    const imageUrls: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: 'travelease/hidden-gems',
                transformation: [
                  { width: 800, height: 600, crop: 'fill' },
                  { quality: 'auto' }
                ]
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(file.buffer);
          }) as any;

          imageUrls.push(result.secure_url);
        } catch (uploadError) {
          logger.error('Image upload error:', uploadError);
        }
      }
    }

    // Create hidden gem
    const hiddenGem = await prisma.hiddenGem.create({
      data: {
        userId,
        name,
        description,
        address,
        city,
        state,
        country,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        category,
        images: imageUrls,
        tips: tips ? (Array.isArray(tips) ? tips : [tips]) : [],
        bestTime,
        difficulty
      }
    });

    // Award points for submission
    await prisma.rewardTransaction.create({
      data: {
        userId,
        type: 'EARNED',
        points: 50,
        description: 'Hidden gem submission',
        referenceId: hiddenGem.id
      }
    });

    // Update user points
    await prisma.user.update({
      where: { id: userId },
      data: {
        rewardPoints: { increment: 50 },
        totalEarned: { increment: 50 }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Hidden gem submitted successfully! You earned 50 points.',
      data: { hiddenGem }
    });

  } catch (error) {
    logger.error('Submit hidden gem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit hidden gem'
    });
  }
});

// Get hidden gems
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().trim(),
  query('city').optional().trim(),
  query('state').optional().trim(),
  query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED'])
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
    const limit = parseInt(req.query.limit as string) || 10;
    const { category, city, state, status } = req.query;

    const where: any = {};

    // Only show approved gems to regular users, all to admins
    if (req.user!.role === 'USER') {
      where.status = 'APPROVED';
      where.isPublic = true;
    } else if (status) {
      where.status = status;
    }

    if (category) where.category = category;
    if (city) where.city = { contains: city as string, mode: 'insensitive' };
    if (state) where.state = { contains: state as string, mode: 'insensitive' };

    const [hiddenGems, total] = await Promise.all([
      prisma.hiddenGem.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true
            }
          },
          _count: {
            select: {
              reviews: true,
              favorites: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.hiddenGem.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        hiddenGems,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get hidden gems error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hidden gems'
    });
  }
});

// Get user's hidden gems
router.get('/my-gems', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED'])
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
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const userId = req.user!.id;

    const where: any = { userId };
    if (status) where.status = status;

    const [hiddenGems, total] = await Promise.all([
      prisma.hiddenGem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.hiddenGem.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        hiddenGems,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get user hidden gems error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your hidden gems'
    });
  }
});

// Get hidden gem by ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const hiddenGem = await prisma.hiddenGem.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            reviews: true,
            favorites: true
          }
        }
      }
    });

    if (!hiddenGem) {
      return res.status(404).json({
        success: false,
        message: 'Hidden gem not found'
      });
    }

    // Check if user can view this gem
    if (hiddenGem.status !== 'APPROVED' && 
        hiddenGem.userId !== req.user!.id && 
        req.user!.role === 'USER') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { hiddenGem }
    });

  } catch (error) {
    logger.error('Get hidden gem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hidden gem'
    });
  }
});

// Update hidden gem (only by owner or admin)
router.put('/:id', upload.array('images', 5), [
  body('name').optional().trim().isLength({ min: 3 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('category').optional().trim().isLength({ min: 2 })
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

    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check if gem exists and user has permission
    const existingGem = await prisma.hiddenGem.findUnique({
      where: { id }
    });

    if (!existingGem) {
      return res.status(404).json({
        success: false,
        message: 'Hidden gem not found'
      });
    }

    if (existingGem.userId !== userId && userRole === 'USER') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updateData: any = { ...req.body };
    const files = req.files as Express.Multer.File[];

    // Handle new image uploads
    if (files && files.length > 0) {
      const imageUrls: string[] = [];
      for (const file of files) {
        try {
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: 'travelease/hidden-gems',
                transformation: [
                  { width: 800, height: 600, crop: 'fill' },
                  { quality: 'auto' }
                ]
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(file.buffer);
          }) as any;

          imageUrls.push(result.secure_url);
        } catch (uploadError) {
          logger.error('Image upload error:', uploadError);
        }
      }

      if (imageUrls.length > 0) {
        updateData.images = [...existingGem.images, ...imageUrls];
      }
    }

    // Convert coordinates to float if provided
    if (updateData.latitude) updateData.latitude = parseFloat(updateData.latitude);
    if (updateData.longitude) updateData.longitude = parseFloat(updateData.longitude);

    // Handle tips array
    if (updateData.tips && !Array.isArray(updateData.tips)) {
      updateData.tips = [updateData.tips];
    }

    const hiddenGem = await prisma.hiddenGem.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Hidden gem updated successfully',
      data: { hiddenGem }
    });

  } catch (error) {
    logger.error('Update hidden gem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hidden gem'
    });
  }
});

// Delete hidden gem
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const hiddenGem = await prisma.hiddenGem.findUnique({
      where: { id }
    });

    if (!hiddenGem) {
      return res.status(404).json({
        success: false,
        message: 'Hidden gem not found'
      });
    }

    if (hiddenGem.userId !== userId && userRole === 'USER') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete associated images from Cloudinary
    for (const imageUrl of hiddenGem.images) {
      try {
        const publicId = imageUrl.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`travelease/hidden-gems/${publicId}`);
        }
      } catch (deleteError) {
        logger.error('Image deletion error:', deleteError);
      }
    }

    await prisma.hiddenGem.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Hidden gem deleted successfully'
    });

  } catch (error) {
    logger.error('Delete hidden gem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hidden gem'
    });
  }
});

// Toggle favorite
router.post('/:id/favorite', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if gem exists
    const hiddenGem = await prisma.hiddenGem.findUnique({
      where: { id }
    });

    if (!hiddenGem) {
      return res.status(404).json({
        success: false,
        message: 'Hidden gem not found'
      });
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_entityId_entityType: {
          userId,
          entityId: id,
          entityType: 'HIDDEN_GEM'
        }
      }
    });

    if (existingFavorite) {
      // Remove favorite
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });

      res.json({
        success: true,
        message: 'Removed from favorites',
        data: { isFavorited: false }
      });
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: {
          userId,
          entityId: id,
          entityType: 'HIDDEN_GEM'
        }
      });

      res.json({
        success: true,
        message: 'Added to favorites',
        data: { isFavorited: true }
      });
    }

  } catch (error) {
    logger.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle favorite'
    });
  }
});

export default router;