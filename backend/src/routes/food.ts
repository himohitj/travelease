import express from 'express';
import { query, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import { GooglePlacesService } from '../services/googlePlacesService';
import { prisma } from '../config/database';

const router = express.Router();

// Get restaurants by location and filters
router.get('/', [
  query('lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  query('lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  query('budget').optional().isIn(['budget', 'mid-range', 'expensive']).withMessage('Invalid budget category'),
  query('cuisine').optional().isString().withMessage('Invalid cuisine type'),
  query('rating').optional().isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1-5'),
  query('radius').optional().isInt({ min: 1, max: 20 }).withMessage('Radius must be between 1-20 km')
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

    const { lat, lng, budget, cuisine, rating, radius = 5 } = req.query;
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const minRating = rating ? parseFloat(rating as string) : 0;

    logger.info(`Searching restaurants near ${latitude}, ${longitude}`);

    // Initialize Google Places service
    const googlePlaces = new GooglePlacesService();
    
    // Search for restaurants using Google Places API
    const placesResults = await googlePlaces.searchRestaurants({
      latitude,
      longitude,
      radius: parseInt(radius as string) * 1000, // Convert km to meters
      cuisine: cuisine as string,
      minRating
    });

    // Also get restaurants from our database
    const dbRestaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true,
        rating: { gte: minRating },
        ...(budget && { priceRange: budget.toUpperCase() as any }),
        ...(cuisine && { 
          cuisine: {
            has: cuisine as string
          }
        })
      },
      orderBy: [
        { rating: 'desc' }
      ],
      take: 20
    });

    // Combine and format results
    const combinedResults = [
      ...placesResults.map(place => ({
        id: place.place_id,
        name: place.name,
        rating: place.rating || 0,
        priceLevel: place.price_level || 2,
        location: {
          address: place.vicinity || place.formatted_address,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng
        },
        photos: place.photos?.map(photo => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        ) || [],
        cuisine: extractCuisineFromTypes(place.types || []),
        distance: calculateDistance(latitude, longitude, place.geometry.location.lat, place.geometry.location.lng),
        isOpen: place.opening_hours?.open_now || null,
        openingHours: place.opening_hours?.weekday_text || [],
        source: 'google_places',
        link: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        estimatedCost: estimateCostFromPriceLevel(place.price_level || 2)
      })),
      ...dbRestaurants.map(restaurant => ({
        id: restaurant.id,
        name: restaurant.name,
        rating: restaurant.rating,
        priceLevel: getPriceLevelFromRange(restaurant.priceRange),
        location: {
          address: restaurant.address,
          latitude: restaurant.latitude,
          longitude: restaurant.longitude
        },
        photos: restaurant.images || [],
        cuisine: restaurant.cuisine,
        distance: calculateDistance(latitude, longitude, restaurant.latitude, restaurant.longitude),
        isOpen: null,
        openingHours: restaurant.openingHours ? Object.values(restaurant.openingHours as any) : [],
        source: 'database',
        link: `https://www.google.com/maps/search/${encodeURIComponent(restaurant.name + ' ' + restaurant.address)}`,
        estimatedCost: getEstimatedCostFromRange(restaurant.priceRange),
        contactPhone: restaurant.contactPhone
      }))
    ];

    // Filter by budget if specified
    let filteredResults = combinedResults;
    if (budget) {
      filteredResults = combinedResults.filter(restaurant => {
        if (budget === 'budget') return restaurant.priceLevel <= 2;
        if (budget === 'mid-range') return restaurant.priceLevel === 3;
        if (budget === 'expensive') return restaurant.priceLevel >= 4;
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
        restaurants: filteredResults.slice(0, 25), // Limit to 25 results
        searchLocation: { latitude, longitude },
        filters: { budget, cuisine, rating: minRating, radius },
        totalFound: filteredResults.length,
        recommendations: generateFoodRecommendations(filteredResults.slice(0, 5))
      }
    });

  } catch (error) {
    logger.error('Restaurant search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search restaurants'
    });
  }
});

// Get restaurant details by ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Try to get from database first
    let restaurant = await prisma.restaurant.findUnique({
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
            favorites: true
          }
        }
      }
    });

    if (!restaurant) {
      // Try to get from Google Places API
      const googlePlaces = new GooglePlacesService();
      const placeDetails = await googlePlaces.getPlaceDetails(id);
      
      if (placeDetails) {
        restaurant = {
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
          priceRange: getPriceRangeFromLevel(placeDetails.price_level || 2),
          cuisine: extractCuisineFromTypes(placeDetails.types || []),
          openingHours: placeDetails.opening_hours?.weekday_text || [],
          contactPhone: placeDetails.formatted_phone_number,
          images: placeDetails.photos?.map(photo => 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
          ) || [],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          reviews: [],
          _count: { reviews: 0, favorites: 0 }
        } as any;
      }
    }

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      data: { restaurant }
    });

  } catch (error) {
    logger.error('Get restaurant details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get restaurant details'
    });
  }
});

// Get food recommendations based on user preferences
router.get('/recommendations', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { lat, lng, budget = 'mid-range' } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Location coordinates required'
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);

    // Get user preferences from profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true }
    });

    const preferences = user?.preferences as any || {};
    const preferredCuisines = preferences.cuisines || ['Indian', 'Chinese', 'Continental'];

    // Get personalized recommendations
    const googlePlaces = new GooglePlacesService();
    const recommendations = [];

    for (const cuisine of preferredCuisines.slice(0, 3)) {
      const results = await googlePlaces.searchRestaurants({
        latitude,
        longitude,
        radius: 3000, // 3km radius
        cuisine,
        minRating: 4.0
      });

      recommendations.push(...results.slice(0, 2));
    }

    const formattedRecommendations = recommendations.map(place => ({
      id: place.place_id,
      name: place.name,
      rating: place.rating || 0,
      cuisine: extractCuisineFromTypes(place.types || []),
      distance: calculateDistance(latitude, longitude, place.geometry.location.lat, place.geometry.location.lng),
      estimatedCost: estimateCostFromPriceLevel(place.price_level || 2),
      photos: place.photos?.slice(0, 1).map(photo => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      ) || [],
      reason: `Recommended based on your preference for ${extractCuisineFromTypes(place.types || [])[0]} cuisine`
    }));

    res.json({
      success: true,
      data: {
        recommendations: formattedRecommendations,
        userPreferences: preferredCuisines,
        location: { latitude, longitude }
      }
    });

  } catch (error) {
    logger.error('Get food recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations'
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

function extractCuisineFromTypes(types: string[]): string[] {
  const cuisineMap: { [key: string]: string } = {
    'indian_restaurant': 'Indian',
    'chinese_restaurant': 'Chinese',
    'italian_restaurant': 'Italian',
    'mexican_restaurant': 'Mexican',
    'japanese_restaurant': 'Japanese',
    'thai_restaurant': 'Thai',
    'american_restaurant': 'American',
    'french_restaurant': 'French',
    'mediterranean_restaurant': 'Mediterranean',
    'seafood_restaurant': 'Seafood',
    'vegetarian_restaurant': 'Vegetarian',
    'fast_food_restaurant': 'Fast Food',
    'cafe': 'Cafe',
    'bakery': 'Bakery'
  };

  const cuisines = types.map(type => cuisineMap[type]).filter(Boolean);
  return cuisines.length > 0 ? cuisines : ['Restaurant'];
}

function estimateCostFromPriceLevel(priceLevel: number): number {
  const costs = [200, 400, 800, 1500, 3000];
  return costs[priceLevel - 1] || 800;
}

function getPriceLevelFromRange(priceRange: string): number {
  switch (priceRange) {
    case 'BUDGET': return 2;
    case 'MID_RANGE': return 3;
    case 'EXPENSIVE': return 4;
    default: return 2;
  }
}

function getPriceRangeFromLevel(priceLevel: number): string {
  if (priceLevel <= 2) return 'BUDGET';
  if (priceLevel === 3) return 'MID_RANGE';
  return 'EXPENSIVE';
}

function getEstimatedCostFromRange(priceRange: string): number {
  switch (priceRange) {
    case 'BUDGET': return 300;
    case 'MID_RANGE': return 800;
    case 'EXPENSIVE': return 1500;
    default: return 500;
  }
}

function generateFoodRecommendations(restaurants: any[]): string[] {
  const recommendations = [
    'Try local street food for authentic flavors',
    'Visit highly-rated restaurants during off-peak hours',
    'Ask locals for hidden food gems',
    'Don\'t miss regional specialties',
    'Check restaurant hygiene ratings before dining'
  ];

  return recommendations.slice(0, 3);
}

export default router;