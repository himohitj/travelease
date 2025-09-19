import express from 'express';
import { query, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import { GooglePlacesService } from '../services/googlePlacesService';
import { prisma } from '../config/database';

const router = express.Router();

// Get hotels by location and filters
router.get('/', [
  query('lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  query('lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  query('budget').optional().isIn(['budget', 'mid-range', 'luxury']).withMessage('Invalid budget category'),
  query('rating').optional().isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1-5'),
  query('radius').optional().isInt({ min: 1, max: 50 }).withMessage('Radius must be between 1-50 km')
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

    const { lat, lng, budget, rating, radius = 10 } = req.query;
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const minRating = rating ? parseFloat(rating as string) : 0;

    logger.info(`Searching hotels near ${latitude}, ${longitude}`);

    // Initialize Google Places service
    const googlePlaces = new GooglePlacesService();
    
    // Search for hotels using Google Places API
    const placesResults = await googlePlaces.searchHotels({
      latitude,
      longitude,
      radius: parseInt(radius as string) * 1000, // Convert km to meters
      budget: budget as string,
      minRating
    });

    // Also get hotels from our database
    const dbHotels = await prisma.hotel.findMany({
      where: {
        isActive: true,
        rating: { gte: minRating }
      },
      orderBy: [
        { rating: 'desc' },
        { pricePerNight: 'asc' }
      ],
      take: 20
    });

    // Combine and format results
    const combinedResults = [
      ...placesResults.map(place => ({
        id: place.place_id,
        name: place.name,
        rating: place.rating || 0,
        priceLevel: place.price_level || 1,
        location: {
          address: place.vicinity || place.formatted_address,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng
        },
        photos: place.photos?.map(photo => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        ) || [],
        link: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        source: 'google_places',
        distance: calculateDistance(latitude, longitude, place.geometry.location.lat, place.geometry.location.lng),
        amenities: place.types || [],
        isOpen: place.opening_hours?.open_now || null
      })),
      ...dbHotels.map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        rating: hotel.rating,
        priceLevel: getPriceLevel(hotel.pricePerNight),
        location: {
          address: hotel.address,
          latitude: hotel.latitude,
          longitude: hotel.longitude
        },
        photos: hotel.images || [],
        link: hotel.website || `https://www.google.com/maps/search/${encodeURIComponent(hotel.name + ' ' + hotel.address)}`,
        source: 'database',
        distance: calculateDistance(latitude, longitude, hotel.latitude, hotel.longitude),
        amenities: hotel.amenities || [],
        pricePerNight: hotel.pricePerNight,
        contactPhone: hotel.contactPhone,
        contactEmail: hotel.contactEmail
      }))
    ];

    // Filter by budget if specified
    let filteredResults = combinedResults;
    if (budget) {
      filteredResults = combinedResults.filter(hotel => {
        if (budget === 'budget') return hotel.priceLevel <= 2;
        if (budget === 'mid-range') return hotel.priceLevel === 3;
        if (budget === 'luxury') return hotel.priceLevel >= 4;
        return true;
      });
    }

    // Sort by rating and distance
    filteredResults.sort((a, b) => {
      if (Math.abs(a.rating - b.rating) > 0.1) {
        return b.rating - a.rating; // Higher rating first
      }
      return a.distance - b.distance; // Closer distance first
    });

    res.json({
      success: true,
      data: {
        hotels: filteredResults.slice(0, 20), // Limit to 20 results
        searchLocation: { latitude, longitude },
        filters: { budget, rating: minRating, radius },
        totalFound: filteredResults.length
      }
    });

  } catch (error) {
    logger.error('Hotel search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search hotels'
    });
  }
});

// Get hotel details by ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Try to get from database first
    let hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
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
            favorites: true,
            bookings: true
          }
        }
      }
    });

    if (!hotel) {
      // Try to get from Google Places API
      const googlePlaces = new GooglePlacesService();
      const placeDetails = await googlePlaces.getPlaceDetails(id);
      
      if (placeDetails) {
        hotel = {
          id: placeDetails.place_id,
          name: placeDetails.name,
          description: placeDetails.editorial_summary?.overview || '',
          address: placeDetails.formatted_address,
          city: placeDetails.address_components?.find(c => c.types.includes('locality'))?.long_name || '',
          state: placeDetails.address_components?.find(c => c.types.includes('administrative_area_level_1'))?.long_name || '',
          country: placeDetails.address_components?.find(c => c.types.includes('country'))?.long_name || 'India',
          latitude: placeDetails.geometry.location.lat,
          longitude: placeDetails.geometry.location.lng,
          rating: placeDetails.rating || 0,
          pricePerNight: estimatePriceFromLevel(placeDetails.price_level || 2),
          amenities: placeDetails.types || [],
          images: placeDetails.photos?.map(photo => 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
          ) || [],
          contactPhone: placeDetails.formatted_phone_number,
          contactEmail: null,
          website: placeDetails.website,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          reviews: [],
          _count: { reviews: 0, favorites: 0, bookings: 0 }
        } as any;
      }
    }

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      data: { hotel }
    });

  } catch (error) {
    logger.error('Get hotel details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get hotel details'
    });
  }
});

// Helper functions
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function getPriceLevel(pricePerNight: number): number {
  if (pricePerNight <= 2000) return 1;
  if (pricePerNight <= 4000) return 2;
  if (pricePerNight <= 8000) return 3;
  if (pricePerNight <= 15000) return 4;
  return 5;
}

function estimatePriceFromLevel(priceLevel: number): number {
  const prices = [1000, 2000, 4000, 8000, 15000];
  return prices[priceLevel - 1] || 4000;
}

export default router;