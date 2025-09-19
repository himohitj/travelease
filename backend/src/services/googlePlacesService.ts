import axios from 'axios';
import { logger } from '../utils/logger';

interface PlaceSearchParams {
  latitude: number;
  longitude: number;
  radius: number;
  budget?: string;
  minRating?: number;
  cuisine?: string;
}

export class GooglePlacesService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    if (!this.apiKey) {
      logger.warn('Google Maps API key not configured');
    }
  }

  async searchHotels(params: PlaceSearchParams) {
    try {
      const { latitude, longitude, radius, minRating = 0 } = params;

      const response = await axios.get(`${this.baseUrl}/nearbysearch/json`, {
        params: {
          location: `${latitude},${longitude}`,
          radius,
          type: 'lodging',
          key: this.apiKey
        }
      });

      if (response.data.status !== 'OK') {
        logger.error('Google Places API error:', response.data.status);
        return [];
      }

      // Filter by rating if specified
      let results = response.data.results;
      if (minRating > 0) {
        results = results.filter((place: any) => (place.rating || 0) >= minRating);
      }

      return results;

    } catch (error) {
      logger.error('Google Places hotel search error:', error);
      return [];
    }
  }

  async searchRestaurants(params: PlaceSearchParams) {
    try {
      const { latitude, longitude, radius, minRating = 0, cuisine } = params;

      let type = 'restaurant';
      if (cuisine) {
        // Map cuisine to Google Places types
        const cuisineTypes: { [key: string]: string } = {
          'indian': 'indian_restaurant',
          'chinese': 'chinese_restaurant',
          'italian': 'italian_restaurant',
          'mexican': 'mexican_restaurant',
          'japanese': 'japanese_restaurant',
          'thai': 'thai_restaurant',
          'fast food': 'fast_food_restaurant',
          'cafe': 'cafe',
          'bakery': 'bakery'
        };
        type = cuisineTypes[cuisine.toLowerCase()] || 'restaurant';
      }

      const response = await axios.get(`${this.baseUrl}/nearbysearch/json`, {
        params: {
          location: `${latitude},${longitude}`,
          radius,
          type,
          key: this.apiKey
        }
      });

      if (response.data.status !== 'OK') {
        logger.error('Google Places API error:', response.data.status);
        return [];
      }

      // Filter by rating if specified
      let results = response.data.results;
      if (minRating > 0) {
        results = results.filter((place: any) => (place.rating || 0) >= minRating);
      }

      return results;

    } catch (error) {
      logger.error('Google Places restaurant search error:', error);
      return [];
    }
  }

  async getPlaceDetails(placeId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/details/json`, {
        params: {
          place_id: placeId,
          fields: 'name,rating,formatted_phone_number,formatted_address,geometry,photos,price_level,opening_hours,website,reviews,types,address_components,editorial_summary',
          key: this.apiKey
        }
      });

      if (response.data.status !== 'OK') {
        logger.error('Google Places details API error:', response.data.status);
        return null;
      }

      return response.data.result;

    } catch (error) {
      logger.error('Google Places details error:', error);
      return null;
    }
  }

  async searchNearbyPlaces(latitude: number, longitude: number, type: string, radius = 5000) {
    try {
      const response = await axios.get(`${this.baseUrl}/nearbysearch/json`, {
        params: {
          location: `${latitude},${longitude}`,
          radius,
          type,
          key: this.apiKey
        }
      });

      if (response.data.status !== 'OK') {
        logger.error('Google Places nearby search API error:', response.data.status);
        return [];
      }

      return response.data.results;

    } catch (error) {
      logger.error('Google Places nearby search error:', error);
      return [];
    }
  }

  async textSearch(query: string, location?: { lat: number; lng: number }) {
    try {
      const params: any = {
        query,
        key: this.apiKey
      };

      if (location) {
        params.location = `${location.lat},${location.lng}`;
        params.radius = 50000; // 50km radius
      }

      const response = await axios.get(`${this.baseUrl}/textsearch/json`, {
        params
      });

      if (response.data.status !== 'OK') {
        logger.error('Google Places text search API error:', response.data.status);
        return [];
      }

      return response.data.results;

    } catch (error) {
      logger.error('Google Places text search error:', error);
      return [];
    }
  }
}