import express from 'express';
import { query, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import { GoogleDirectionsService } from '../services/googleDirectionsService';
import { TransportAPIService } from '../services/transportAPIService';

const router = express.Router();

// Get transport options between origin and destination
router.get('/', [
  query('origin').notEmpty().withMessage('Origin is required'),
  query('destination').notEmpty().withMessage('Destination is required'),
  query('mode').optional().isIn(['cab', 'auto', 'metro', 'train', 'bus', 'all']).withMessage('Invalid transport mode')
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

    const { origin, destination, mode = 'all' } = req.query;
    
    logger.info(`Searching transport from ${origin} to ${destination}, mode: ${mode}`);

    const googleDirections = new GoogleDirectionsService();
    const transportAPI = new TransportAPIService();

    const results: any[] = [];

    // Get Google Directions for basic route info
    const routeInfo = await googleDirections.getDirections(
      origin as string,
      destination as string
    );

    if (!routeInfo) {
      return res.status(400).json({
        success: false,
        message: 'Could not find route between specified locations'
      });
    }

    const distance = routeInfo.distance;
    const duration = routeInfo.duration;

    // Get different transport options based on mode
    if (mode === 'all' || mode === 'cab') {
      // Cab options (Ola, Uber, Rapido)
      const cabOptions = await transportAPI.getCabOptions(origin as string, destination as string, distance);
      results.push(...cabOptions);
    }

    if (mode === 'all' || mode === 'auto') {
      // Auto rickshaw options
      const autoOptions = await transportAPI.getAutoOptions(origin as string, destination as string, distance);
      results.push(...autoOptions);
    }

    if (mode === 'all' || mode === 'metro') {
      // Metro options
      const metroOptions = await transportAPI.getMetroOptions(origin as string, destination as string);
      results.push(...metroOptions);
    }

    if (mode === 'all' || mode === 'train') {
      // Train options
      const trainOptions = await transportAPI.getTrainOptions(origin as string, destination as string);
      results.push(...trainOptions);
    }

    if (mode === 'all' || mode === 'bus') {
      // Bus options
      const busOptions = await transportAPI.getBusOptions(origin as string, destination as string);
      results.push(...busOptions);
    }

    // Sort by cost and convenience
    results.sort((a, b) => {
      // Prioritize by availability, then by cost
      if (a.available && !b.available) return -1;
      if (!a.available && b.available) return 1;
      return a.estimatedCost - b.estimatedCost;
    });

    res.json({
      success: true,
      data: {
        route: {
          origin: origin as string,
          destination: destination as string,
          distance: distance,
          estimatedDuration: duration
        },
        transportOptions: results,
        recommendations: generateTransportRecommendations(results, distance)
      }
    });

  } catch (error) {
    logger.error('Transport search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search transport options'
    });
  }
});

// Get real-time transport availability
router.get('/availability', [
  query('lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  query('lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  query('type').optional().isIn(['cab', 'auto', 'metro', 'bus']).withMessage('Invalid transport type')
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

    const { lat, lng, type = 'all' } = req.query;
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);

    const transportAPI = new TransportAPIService();
    const availability = await transportAPI.getNearbyTransport(latitude, longitude, type as string);

    res.json({
      success: true,
      data: {
        location: { latitude, longitude },
        availability,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Transport availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transport availability'
    });
  }
});

// Get transport pricing estimates
router.get('/pricing', [
  query('origin').notEmpty().withMessage('Origin is required'),
  query('destination').notEmpty().withMessage('Destination is required'),
  query('type').isIn(['cab', 'auto']).withMessage('Transport type required (cab/auto)')
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

    const { origin, destination, type } = req.query;

    const googleDirections = new GoogleDirectionsService();
    const routeInfo = await googleDirections.getDirections(
      origin as string,
      destination as string
    );

    if (!routeInfo) {
      return res.status(400).json({
        success: false,
        message: 'Could not calculate route'
      });
    }

    const transportAPI = new TransportAPIService();
    const pricing = await transportAPI.getPricingEstimates(
      origin as string,
      destination as string,
      type as string,
      routeInfo.distance
    );

    res.json({
      success: true,
      data: {
        route: routeInfo,
        pricing,
        estimatedTime: routeInfo.duration
      }
    });

  } catch (error) {
    logger.error('Transport pricing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pricing estimates'
    });
  }
});

// Book transport (placeholder for future integration)
router.post('/book', [
  query('provider').notEmpty().withMessage('Provider is required'),
  query('origin').notEmpty().withMessage('Origin is required'),
  query('destination').notEmpty().withMessage('Destination is required'),
  query('type').isIn(['cab', 'auto']).withMessage('Transport type required')
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

    const { provider, origin, destination, type } = req.body;
    const userId = req.user?.id;

    // This would integrate with actual booking APIs in production
    logger.info(`Booking ${type} from ${provider} for user ${userId}`);

    // For now, return a mock booking response
    const booking = {
      id: `BK${Date.now()}`,
      provider,
      type,
      origin,
      destination,
      status: 'confirmed',
      estimatedArrival: '5-10 minutes',
      driverInfo: {
        name: 'Driver Name',
        phone: '+91-XXXXXXXXXX',
        vehicleNumber: 'XX-XX-XXXX'
      },
      fare: calculateFare(type, 5), // 5km example
      bookingTime: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Transport booked successfully!',
      data: { booking }
    });

  } catch (error) {
    logger.error('Transport booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book transport'
    });
  }
});

// Helper functions
function generateTransportRecommendations(options: any[], distance: number): string[] {
  const recommendations = [];

  if (distance < 2) {
    recommendations.push('For short distances, auto rickshaw is most convenient');
  } else if (distance < 10) {
    recommendations.push('Cab services offer good value for medium distances');
  } else {
    recommendations.push('Consider train or bus for longer distances');
  }

  const cheapestOption = options.reduce((min, option) => 
    option.estimatedCost < min.estimatedCost ? option : min, options[0]);
  
  if (cheapestOption) {
    recommendations.push(`${cheapestOption.provider} offers the most economical option`);
  }

  recommendations.push('Book in advance during peak hours for better rates');

  return recommendations.slice(0, 3);
}

function calculateFare(type: string, distance: number): number {
  const rates = {
    cab: { base: 50, perKm: 12 },
    auto: { base: 25, perKm: 8 }
  };

  const rate = rates[type as keyof typeof rates] || rates.cab;
  return rate.base + (distance * rate.perKm);
}

export default router;