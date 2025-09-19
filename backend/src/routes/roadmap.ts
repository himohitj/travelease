import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import { generateRoadmapPDF } from '../services/pdfService';
import { AIRecommendationService } from '../services/aiService';

const router = express.Router();

// Create roadmap
router.post('/', [
  body('title').trim().isLength({ min: 3 }),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  body('destinations').isArray({ min: 1 }),
  body('budget').optional().isFloat({ min: 0 })
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

    const { title, description, startDate, endDate, destinations, activities, hotels, transport, budget } = req.body;
    const userId = req.user!.id;

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const roadmap = await prisma.roadmap.create({
      data: {
        userId,
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        destinations,
        activities: activities || [],
        hotels: hotels || [],
        transport: transport || [],
        budget
      }
    });

    res.status(201).json({
      success: true,
      message: 'Roadmap created successfully',
      data: { roadmap }
    });

  } catch (error) {
    logger.error('Create roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create roadmap'
    });
  }
});

// Get user roadmaps
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isIn(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'])
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
    if (status) {
      where.status = status;
    }

    const [roadmaps, total] = await Promise.all([
      prisma.roadmap.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.roadmap.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        roadmaps,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get roadmaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roadmaps'
    });
  }
});

// Get roadmap by ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const roadmap = await prisma.roadmap.findFirst({
      where: {
        id,
        OR: [
          { userId },
          { isPublic: true }
        ]
      }
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    res.json({
      success: true,
      data: { roadmap }
    });

  } catch (error) {
    logger.error('Get roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roadmap'
    });
  }
});

// Update roadmap
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 3 }),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('destinations').optional().isArray(),
  body('budget').optional().isFloat({ min: 0 })
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
    const updateData = req.body;

    // Check if roadmap exists and belongs to user
    const existingRoadmap = await prisma.roadmap.findFirst({
      where: { id, userId }
    });

    if (!existingRoadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    // Validate dates if provided
    if (updateData.startDate && updateData.endDate) {
      if (new Date(updateData.startDate) >= new Date(updateData.endDate)) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
    }

    const roadmap = await prisma.roadmap.update({
      where: { id },
      data: {
        ...updateData,
        startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
        endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Roadmap updated successfully',
      data: { roadmap }
    });

  } catch (error) {
    logger.error('Update roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update roadmap'
    });
  }
});

// Delete roadmap
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const roadmap = await prisma.roadmap.findFirst({
      where: { id, userId }
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    await prisma.roadmap.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Roadmap deleted successfully'
    });

  } catch (error) {
    logger.error('Delete roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete roadmap'
    });
  }
});

// Generate AI-powered roadmap
router.post('/generate', [
  body('preferences').isObject(),
  body('budget').optional().isFloat({ min: 0 }),
  body('duration').isInt({ min: 1, max: 30 }),
  body('startLocation').trim().isLength({ min: 2 })
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

    const { preferences, budget, duration, startLocation } = req.body;
    const userId = req.user!.id;

    // Get user profile for personalization
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true, location: true }
    });

    const aiService = new AIRecommendationService();
    const generatedRoadmap = await aiService.generatePersonalizedRoadmap({
      userId,
      preferences: { ...user?.preferences, ...preferences },
      budget,
      duration,
      startLocation,
      userLocation: user?.location
    });

    res.json({
      success: true,
      message: 'AI roadmap generated successfully',
      data: { roadmap: generatedRoadmap }
    });

  } catch (error) {
    logger.error('Generate AI roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate roadmap'
    });
  }
});

// Download roadmap as PDF
router.get('/:id/download', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const roadmap = await prisma.roadmap.findFirst({
      where: {
        id,
        OR: [
          { userId },
          { isPublic: true }
        ]
      }
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    const pdfBuffer = await generateRoadmapPDF(roadmap);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="roadmap-${roadmap.title}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    logger.error('Download roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download roadmap'
    });
  }
});

export default router;