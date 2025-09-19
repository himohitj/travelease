import axios from 'axios';
import { logger } from '../utils/logger';

export class GoogleDirectionsService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    if (!this.apiKey) {
      logger.warn('Google Maps API key not configured');
    }
  }

  async getDirections(origin: string, destination: string, mode: string = 'driving') {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          origin,
          destination,
          mode, // driving, walking, bicycling, transit
          key: this.apiKey,
          alternatives: true,
          avoid: 'tolls' // Optional: avoid tolls
        }
      });

      if (response.data.status !== 'OK') {
        logger.error('Google Directions API error:', response.data.status);
        return null;
      }

      const route = response.data.routes[0];
      if (!route) {
        return null;
      }

      const leg = route.legs[0];
      
      return {
        distance: leg.distance.value / 1000, // Convert to kilometers
        duration: leg.duration.value / 60, // Convert to minutes
        distanceText: leg.distance.text,
        durationText: leg.duration.text,
        startAddress: leg.start_address,
        endAddress: leg.end_address,
        steps: leg.steps.map((step: any) => ({
          instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
          distance: step.distance.text,
          duration: step.duration.text,
          maneuver: step.maneuver
        })),
        polyline: route.overview_polyline.points,
        bounds: route.bounds,
        alternatives: response.data.routes.slice(1).map((altRoute: any) => ({
          distance: altRoute.legs[0].distance.value / 1000,
          duration: altRoute.legs[0].duration.value / 60,
          distanceText: altRoute.legs[0].distance.text,
          durationText: altRoute.legs[0].duration.text,
          summary: altRoute.summary
        }))
      };

    } catch (error) {
      logger.error('Google Directions API error:', error);
      return null;
    }
  }

  async getTransitDirections(origin: string, destination: string, departureTime?: Date) {
    try {
      const params: any = {
        origin,
        destination,
        mode: 'transit',
        key: this.apiKey,
        alternatives: true
      };

      if (departureTime) {
        params.departure_time = Math.floor(departureTime.getTime() / 1000);
      }

      const response = await axios.get(this.baseUrl, { params });

      if (response.data.status !== 'OK') {
        logger.error('Google Transit Directions API error:', response.data.status);
        return null;
      }

      const routes = response.data.routes.map((route: any) => {
        const leg = route.legs[0];
        
        return {
          distance: leg.distance.value / 1000,
          duration: leg.duration.value / 60,
          distanceText: leg.distance.text,
          durationText: leg.duration.text,
          startAddress: leg.start_address,
          endAddress: leg.end_address,
          departureTime: leg.departure_time,
          arrivalTime: leg.arrival_time,
          transitSteps: leg.steps
            .filter((step: any) => step.travel_mode === 'TRANSIT')
            .map((step: any) => ({
              mode: step.transit_details.line.vehicle.type,
              lineName: step.transit_details.line.name,
              shortName: step.transit_details.line.short_name,
              departureStop: step.transit_details.departure_stop.name,
              arrivalStop: step.transit_details.arrival_stop.name,
              departureTime: step.transit_details.departure_time.text,
              arrivalTime: step.transit_details.arrival_time.text,
              numStops: step.transit_details.num_stops,
              duration: step.duration.text,
              instructions: step.html_instructions.replace(/<[^>]*>/g, '')
            })),
          fare: route.fare ? {
            currency: route.fare.currency,
            value: route.fare.value,
            text: route.fare.text
          } : null
        };
      });

      return routes;

    } catch (error) {
      logger.error('Google Transit Directions API error:', error);
      return null;
    }
  }

  async getDistanceMatrix(origins: string[], destinations: string[], mode: string = 'driving') {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
          origins: origins.join('|'),
          destinations: destinations.join('|'),
          mode,
          key: this.apiKey,
          units: 'metric'
        }
      });

      if (response.data.status !== 'OK') {
        logger.error('Google Distance Matrix API error:', response.data.status);
        return null;
      }

      return response.data;

    } catch (error) {
      logger.error('Google Distance Matrix API error:', error);
      return null;
    }
  }
}