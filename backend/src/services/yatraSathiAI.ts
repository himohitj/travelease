import { logger } from '../utils/logger';
import { GooglePlacesService } from './googlePlacesService';

interface ItineraryInput {
  budget: number;
  days: number;
  destination: string;
  startDate: Date;
  language: string;
  userId?: string;
}

interface DayPlan {
  day: number;
  date: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  accommodation: Accommodation;
  meals: Meal[];
  transport: Transport[];
  totalCost: number;
}

interface Activity {
  time: string;
  name: string;
  description: string;
  location: string;
  cost: number;
  duration: string;
  tips: string[];
}

interface Accommodation {
  name: string;
  type: string;
  location: string;
  cost: number;
  rating: number;
  amenities: string[];
}

interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  location: string;
  cost: number;
  cuisine: string;
  rating: number;
}

interface Transport {
  from: string;
  to: string;
  mode: string;
  cost: number;
  duration: string;
  provider?: string;
}

export class YatraSathiAI {
  private googlePlaces: GooglePlacesService;

  constructor() {
    this.googlePlaces = new GooglePlacesService();
  }

  async generateItinerary(input: ItineraryInput) {
    try {
      logger.info(`Yatra Sathi generating itinerary for ${input.destination}`);

      // Get destination information
      const destinationInfo = await this.getDestinationInfo(input.destination);
      
      // Calculate budget distribution
      const budgetDistribution = this.calculateBudgetDistribution(input.budget, input.days);
      
      // Generate day-wise plan
      const dayPlans = await this.generateDayPlans(input, budgetDistribution, destinationInfo);
      
      // Generate summary and tips
      const summary = this.generateSummary(input, dayPlans);
      
      return {
        metadata: {
          destination: input.destination,
          days: input.days,
          budget: input.budget,
          language: input.language,
          generatedBy: 'Yatra Sathi AI',
          generatedAt: new Date().toISOString()
        },
        summary,
        dayPlans,
        totalEstimatedCost: dayPlans.reduce((sum, day) => sum + day.totalCost, 0),
        budgetBreakdown: budgetDistribution,
        tips: this.getDestinationTips(input.destination, input.language),
        emergencyContacts: this.getEmergencyContacts(input.destination),
        weatherInfo: await this.getWeatherInfo(input.destination, input.startDate),
        localInfo: this.getLocalInfo(input.destination, input.language)
      };

    } catch (error) {
      logger.error('Yatra Sathi AI error:', error);
      throw new Error('Yatra Sathi encountered an error while planning your trip');
    }
  }

  private async getDestinationInfo(destination: string) {
    // In production, this would use Google Places API
    const destinationData = {
      'Goa': {
        type: 'Beach Destination',
        bestTime: 'November to March',
        climate: 'Tropical',
        currency: 'INR',
        language: 'English, Hindi, Konkani',
        attractions: ['Baga Beach', 'Calangute Beach', 'Old Goa Churches', 'Dudhsagar Falls'],
        activities: ['Beach activities', 'Water sports', 'Heritage tours', 'Nightlife'],
        avgHotelCost: { budget: 1500, midRange: 3500, luxury: 8000 },
        avgMealCost: { budget: 300, midRange: 800, luxury: 1500 },
        transportCost: { local: 200, intercity: 500 }
      },
      'Kerala': {
        type: 'Backwater & Hill Station',
        bestTime: 'October to March',
        climate: 'Tropical',
        currency: 'INR',
        language: 'English, Hindi, Malayalam',
        attractions: ['Alleppey Backwaters', 'Munnar Hills', 'Kochi Fort', 'Thekkady Wildlife'],
        activities: ['Houseboat cruise', 'Tea plantation tours', 'Ayurvedic treatments', 'Wildlife safari'],
        avgHotelCost: { budget: 1200, midRange: 3000, luxury: 7000 },
        avgMealCost: { budget: 250, midRange: 600, luxury: 1200 },
        transportCost: { local: 150, intercity: 400 }
      },
      'Rajasthan': {
        type: 'Heritage & Desert',
        bestTime: 'October to March',
        climate: 'Arid',
        currency: 'INR',
        language: 'English, Hindi, Rajasthani',
        attractions: ['Jaipur City Palace', 'Udaipur Lake Palace', 'Jaisalmer Fort', 'Thar Desert'],
        activities: ['Palace tours', 'Camel safari', 'Cultural shows', 'Desert camping'],
        avgHotelCost: { budget: 1800, midRange: 4000, luxury: 10000 },
        avgMealCost: { budget: 400, midRange: 900, luxury: 1800 },
        transportCost: { local: 300, intercity: 600 }
      }
    };

    return destinationData[destination as keyof typeof destinationData] || destinationData['Goa'];
  }

  private calculateBudgetDistribution(totalBudget: number, days: number) {
    return {
      accommodation: Math.floor(totalBudget * 0.35), // 35%
      food: Math.floor(totalBudget * 0.25), // 25%
      transport: Math.floor(totalBudget * 0.20), // 20%
      activities: Math.floor(totalBudget * 0.15), // 15%
      miscellaneous: Math.floor(totalBudget * 0.05) // 5%
    };
  }

  private async generateDayPlans(input: ItineraryInput, budget: any, destinationInfo: any): Promise<DayPlan[]> {
    const dayPlans: DayPlan[] = [];
    const dailyBudget = input.budget / input.days;

    for (let day = 1; day <= input.days; day++) {
      const currentDate = new Date(input.startDate);
      currentDate.setDate(currentDate.getDate() + day - 1);

      const dayPlan: DayPlan = {
        day,
        date: currentDate.toISOString().split('T')[0],
        morning: await this.generateActivities('morning', day, input.destination, dailyBudget * 0.3),
        afternoon: await this.generateActivities('afternoon', day, input.destination, dailyBudget * 0.4),
        evening: await this.generateActivities('evening', day, input.destination, dailyBudget * 0.3),
        accommodation: this.generateAccommodation(day, input.destination, budget.accommodation / input.days),
        meals: this.generateMeals(day, input.destination, budget.food / input.days),
        transport: this.generateTransport(day, input.destination, budget.transport / input.days),
        totalCost: dailyBudget
      };

      dayPlans.push(dayPlan);
    }

    return dayPlans;
  }

  private async generateActivities(timeOfDay: string, day: number, destination: string, budget: number): Promise<Activity[]> {
    // This would integrate with Google Places API in production
    const activities = {
      'Goa': {
        morning: [
          { name: 'Beach Walk at Baga', description: 'Peaceful morning walk along the pristine beach', location: 'Baga Beach', cost: 0, duration: '1 hour' },
          { name: 'Dolphin Spotting', description: 'Boat trip to spot dolphins in the Arabian Sea', location: 'Sinquerim Beach', cost: 500, duration: '2 hours' }
        ],
        afternoon: [
          { name: 'Old Goa Churches Tour', description: 'Visit historic churches and learn about Portuguese heritage', location: 'Old Goa', cost: 200, duration: '3 hours' },
          { name: 'Spice Plantation Visit', description: 'Guided tour of organic spice plantation with lunch', location: 'Ponda', cost: 800, duration: '4 hours' }
        ],
        evening: [
          { name: 'Sunset at Anjuna Beach', description: 'Watch beautiful sunset with beach shacks', location: 'Anjuna Beach', cost: 300, duration: '2 hours' },
          { name: 'Night Market Shopping', description: 'Explore local handicrafts and souvenirs', location: 'Arpora Saturday Night Market', cost: 500, duration: '3 hours' }
        ]
      }
    };

    const destActivities = activities[destination as keyof typeof activities] || activities['Goa'];
    const timeActivities = destActivities[timeOfDay as keyof typeof destActivities] || [];
    
    return timeActivities.map(activity => ({
      time: this.getTimeSlot(timeOfDay),
      ...activity,
      tips: this.generateActivityTips(activity.name)
    }));
  }

  private generateAccommodation(day: number, destination: string, budget: number): Accommodation {
    const accommodations = {
      budget: {
        name: 'Backpacker Hostel',
        type: 'Hostel',
        cost: Math.min(budget, 1500),
        rating: 4.0,
        amenities: ['WiFi', 'AC', 'Breakfast']
      },
      midRange: {
        name: 'Comfort Inn',
        type: 'Hotel',
        cost: Math.min(budget, 3500),
        rating: 4.2,
        amenities: ['WiFi', 'AC', 'Pool', 'Restaurant']
      },
      luxury: {
        name: 'Beach Resort',
        type: 'Resort',
        cost: Math.min(budget, 8000),
        rating: 4.8,
        amenities: ['WiFi', 'AC', 'Pool', 'Spa', 'Beach Access']
      }
    };

    const category = budget <= 2000 ? 'budget' : budget <= 5000 ? 'midRange' : 'luxury';
    return {
      ...accommodations[category],
      location: `${destination} City Center`
    };
  }

  private generateMeals(day: number, destination: string, budget: number): Meal[] {
    return [
      {
        type: 'breakfast',
        name: 'Local Breakfast',
        location: 'Hotel/Local Cafe',
        cost: budget * 0.2,
        cuisine: 'Local',
        rating: 4.0
      },
      {
        type: 'lunch',
        name: 'Traditional Thali',
        location: 'Local Restaurant',
        cost: budget * 0.4,
        cuisine: 'Regional',
        rating: 4.3
      },
      {
        type: 'dinner',
        name: 'Seafood Special',
        location: 'Beachside Restaurant',
        cost: budget * 0.4,
        cuisine: 'Seafood',
        rating: 4.5
      }
    ];
  }

  private generateTransport(day: number, destination: string, budget: number): Transport[] {
    return [
      {
        from: 'Hotel',
        to: 'Tourist Spots',
        mode: 'Taxi/Auto',
        cost: budget * 0.6,
        duration: '30 mins',
        provider: 'Local Taxi'
      },
      {
        from: 'Tourist Spots',
        to: 'Hotel',
        mode: 'Taxi/Auto',
        cost: budget * 0.4,
        duration: '30 mins',
        provider: 'Local Taxi'
      }
    ];
  }

  private generateSummary(input: ItineraryInput, dayPlans: DayPlan[]) {
    const messages = {
      English: `Welcome to your personalized ${input.days}-day ${input.destination} adventure! Yatra Sathi has crafted this itinerary based on your ₹${input.budget.toLocaleString()} budget, ensuring you experience the best of ${input.destination} while staying within your means.`,
      Hindi: `आपके व्यक्तिगत ${input.days}-दिन के ${input.destination} साहसिक यात्रा में आपका स्वागत है! यात्रा साथी ने आपके ₹${input.budget.toLocaleString()} बजट के आधार पर यह यात्रा कार्यक्रम तैयार किया है।`
    };

    return messages[input.language as keyof typeof messages] || messages.English;
  }

  private getDestinationTips(destination: string, language: string): string[] {
    const tips = {
      English: [
        'Carry sunscreen and stay hydrated',
        'Respect local customs and traditions',
        'Try local cuisine for authentic experience',
        'Keep emergency contacts handy',
        'Bargain politely at local markets'
      ],
      Hindi: [
        'सनस्क्रीन लगाएं और पानी पिएं',
        'स्थानीय रीति-रिवाजों का सम्मान करें',
        'प्रामाणिक अनुभव के लिए स्थानीय भोजन आज़माएं',
        'आपातकालीन संपर्क नंबर रखें',
        'स्थानीय बाज़ारों में विनम्रता से मोल-भाव करें'
      ]
    };

    return tips[language as keyof typeof tips] || tips.English;
  }

  private getEmergencyContacts(destination: string) {
    return {
      police: '100',
      ambulance: '108',
      fire: '101',
      touristHelpline: '1363',
      localPolice: '+91-832-2420016' // Example for Goa
    };
  }

  private async getWeatherInfo(destination: string, startDate: Date) {
    // In production, integrate with weather API
    return {
      temperature: '25-32°C',
      humidity: '70-80%',
      rainfall: 'Low',
      recommendation: 'Perfect weather for sightseeing!'
    };
  }

  private getLocalInfo(destination: string, language: string) {
    const info = {
      English: {
        currency: 'Indian Rupee (₹)',
        timeZone: 'IST (UTC+5:30)',
        electricity: '230V, 50Hz',
        tipping: '10-15% at restaurants',
        bargaining: 'Common in local markets'
      },
      Hindi: {
        currency: 'भारतीय रुपया (₹)',
        timeZone: 'IST (UTC+5:30)',
        electricity: '230V, 50Hz',
        tipping: 'रेस्टोरेंट में 10-15%',
        bargaining: 'स्थानीय बाज़ारों में आम'
      }
    };

    return info[language as keyof typeof info] || info.English;
  }

  private getTimeSlot(timeOfDay: string): string {
    const slots = {
      morning: '09:00 AM',
      afternoon: '02:00 PM',
      evening: '06:00 PM'
    };
    return slots[timeOfDay as keyof typeof slots] || '12:00 PM';
  }

  private generateActivityTips(activityName: string): string[] {
    return [
      'Book in advance during peak season',
      'Carry water and snacks',
      'Wear comfortable shoes'
    ];
  }
}