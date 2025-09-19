import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import { YatraSathiAI } from '../services/yatraSathiAI';
import { generateItineraryPDF } from '../services/pdfService';
import { uploadToS3 } from '../services/s3Service';

const router = express.Router();

// Generate AI-powered itinerary
router.post('/', [
  body('budget').isInt({ min: 1000 }).withMessage('Budget must be at least ₹1000'),
  body('days').isInt({ min: 1, max: 30 }).withMessage('Days must be between 1-30'),
  body('destination').trim().isLength({ min: 2 }).withMessage('Destination is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('language').optional().isIn(['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati']).withMessage('Unsupported language')
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

    const { budget, days, destination, startDate, language = 'English' } = req.body;
    const userId = req.user?.id;

    logger.info(`Generating itinerary for ${destination}, ${days} days, budget: ₹${budget}`);

    // Initialize Yatra Sathi AI
    const yatraSathi = new YatraSathiAI();
    
    // Generate AI-powered itinerary
    const aiPlan = await yatraSathi.generateItinerary({
      budget,
      days,
      destination,
      startDate: new Date(startDate),
      language,
      userId
    });

    // Save itinerary to database
    const itinerary = await prisma.itinerary.create({
      data: {
        destination,
        budget,
        days,
        startDate: new Date(startDate),
        language,
        plan: aiPlan,
        userId
      }
    });

    // Generate PDF
    const pdfBuffer = await generateItineraryPDF(itinerary);
    
    // Upload PDF to S3 (or save locally)
    let pdfUrl = null;
    try {
      if (process.env.AWS_BUCKET_NAME) {
        pdfUrl = await uploadToS3(pdfBuffer, `itineraries/${itinerary.id}.pdf`, 'application/pdf');
      } else {
        // Save locally for development
        const fs = require('fs');
        const path = require('path');
        const uploadsDir = path.join(process.cwd(), 'uploads', 'itineraries');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const localPath = path.join(uploadsDir, `${itinerary.id}.pdf`);
        fs.writeFileSync(localPath, pdfBuffer);
        pdfUrl = `/uploads/itineraries/${itinerary.id}.pdf`;
      }

      // Update itinerary with PDF URL
      await prisma.itinerary.update({
        where: { id: itinerary.id },
        data: { pdfUrl }
      });
    } catch (pdfError) {
      logger.error('PDF upload error:', pdfError);
    }

    res.json({
      success: true,
      message: `Yatra Sathi has created your perfect ${days}-day ${destination} itinerary!`,
      data: {
        itinerary: {
          ...itinerary,
          pdfUrl
        }
      }
    });

  } catch (error) {
    logger.error('Generate itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate itinerary. Yatra Sathi will try again!'
    });
  }
});

// Get user's itineraries
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    
    const itineraries = await prisma.itinerary.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { itineraries }
    });

  } catch (error) {
    logger.error('Get itineraries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch itineraries'
    });
  }
});

// Get specific itinerary
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const itinerary = await prisma.itinerary.findFirst({
      where: { 
        id,
        userId 
      }
    });

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found'
      });
    }

    res.json({
      success: true,
      data: { itinerary }
    });

  } catch (error) {
    logger.error('Get itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch itinerary'
    });
  }
});

// Download itinerary PDF
router.get('/:id/download', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const itinerary = await prisma.itinerary.findFirst({
      where: { 
        id,
        userId 
      }
    });

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found'
      });
    }

    if (itinerary.pdfUrl) {
      // Redirect to existing PDF
      res.redirect(itinerary.pdfUrl);
    } else {
      // Generate new PDF
      const pdfBuffer = await generateItineraryPDF(itinerary);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="itinerary-${itinerary.destination}-${itinerary.days}days.pdf"`);
      res.send(pdfBuffer);
    }

  } catch (error) {
    logger.error('Download itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download itinerary'
    });
  }
});

export default router;