import React, { useState } from 'react';
import { MapPin, Star, DollarSign, Wifi, Car, Coffee, Dumbbell, Search, Filter } from 'lucide-react';

interface HotelsProps {
  isDarkMode: boolean;
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  amenities: string[];
  description: string;
  coordinates: { lat: number; lng: number };
}

const Hotels: React.FC<HotelsProps> = ({ isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [showMap, setShowMap] = useState(false);

  const hotels: Hotel[] = [
    {
      id: '1',
      name: 'The Taj Mahal Palace',
      location: 'Mumbai, Maharashtra',
      rating: 4.8,
      price: 25000,
      image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['wifi', 'parking', 'restaurant', 'gym', 'spa'],
      description: 'Iconic luxury hotel overlooking the Gateway of India with world-class amenities.',
      coordinates: { lat: 18.9220, lng: 72.8347 }
    },
    {
      id: '2',
      name: 'Hotel Oberoi',
      location: 'New Delhi, Delhi',
      rating: 4.7,
      price: 18000,
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['wifi', 'parking', 'restaurant', 'gym'],
      description: 'Contemporary luxury hotel in the heart of New Delhi with exceptional service.',
      coordinates: { lat: 28.6139, lng: 77.2090 }
    },
    {
      id: '3',
      name: 'ITC Grand Chola',
      location: 'Chennai, Tamil Nadu',
      rating: 4.6,
      price: 15000,
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['wifi', 'parking', 'restaurant', 'gym', 'pool'],
      description: 'Magnificent hotel inspired by South Indian architecture with modern amenities.',
      coordinates: { lat: 13.0827, lng: 80.2707 }
    },
    {
      id: '4',
      name: 'Budget Inn Express',
      location: 'Pune, Maharashtra',
      rating: 4.2,
      price: 5000,
      image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['wifi', 'parking', 'restaurant'],
      description: 'Comfortable budget accommodation with essential amenities for business travelers.',
      coordinates: { lat: 18.5204, lng: 73.8567 }
    },
    {
      id: '5',
      name: 'Leela Palace',
      location: 'Udaipur, Rajasthan',
      rating: 4.9,
      price: 35000,
      image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['wifi', 'parking', 'restaurant', 'gym', 'spa', 'pool'],
      description: 'Opulent palace hotel on Lake Pichola offering royal treatment and breathtaking views.',
      coordinates: { lat: 24.5854, lng: 73.7125 }
    },
    {
      id: '6',
      name: 'Backpacker Hostel',
      location: 'Goa, India',
      rating: 4.0,
      price: 2000,
      image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['wifi', 'shared-kitchen', 'common-area'],
      description: 'Vibrant hostel near the beach perfect for young travelers and backpackers.',
      coordinates: { lat: 15.2993, lng: 74.1240 }
    }
  ];

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'parking':
        return <Car className="h-4 w-4" />;
      case 'restaurant':
        return <Coffee className="h-4 w-4" />;
      case 'gym':
        return <Dumbbell className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getBudgetCategory = (price: number) => {
    if (price <= 5000) return 'budget';
    if (price <= 20000) return 'mid-range';
    return 'luxury';
  };

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBudget = selectedBudget === 'all' || getBudgetCategory(hotel.price) === selectedBudget;
    const matchesRating = selectedRating === 'all' || hotel.rating >= parseFloat(selectedRating);
    
    return matchesSearch && matchesBudget && matchesRating;
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 animate-fade-in-up`}>Nearby Hotels</h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} animate-fade-in-up animation-delay-200`}>
            Find the perfect accommodation that matches your budget and preferences
          </p>
        </div>

        {/* Search and Filters */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8 animate-fade-in-up animation-delay-400 card-hover`}>
          <div className="grid md:grid-cols-4 gap-4 items-end">
            <div className="col-span-2">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Search Hotels</label>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  className={`w-full pl-10 pr-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Budget</label>
              <select
                className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
              >
                <option value="all">All Budgets</option>
                <option value="budget">Budget (₹0-5K)</option>
                <option value="mid-range">Mid-range (₹5K-20K)</option>
                <option value="luxury">Luxury (₹20K+)</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Rating</label>
              <select
                className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing {filteredHotels.length} of {hotels.length} hotels
            </p>
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 transform hover:scale-105"
            >
              <MapPin className="h-4 w-4" />
              <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
            </button>
          </div>
        </div>

        {/* Map Placeholder */}
        {showMap && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8 animate-fade-in-up card-hover`}>
            <div className={`h-64 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg flex items-center justify-center`}>
              <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <MapPin className="h-12 w-12 mx-auto mb-2 animate-float" />
                <p className="text-lg font-medium">Interactive Map</p>
                <p className="text-sm">Google Maps integration would display hotel locations here</p>
              </div>
            </div>
          </div>
        )}

        {/* Hotels Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden card-hover animate-fade-in-up`}>
              <div className="relative">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{hotel.rating}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{hotel.name}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">₹{hotel.price.toLocaleString()}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>per night</div>
                  </div>
                </div>
                
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 flex items-center`}>
                  <MapPin className="h-4 w-4 mr-1" />
                  {hotel.location}
                </p>
                
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>{hotel.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.slice(0, 4).map((amenity, index) => (
                    <div key={index} className={`flex items-center space-x-1 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} px-2 py-1 rounded-full text-xs transition-all duration-300 hover:scale-105`}>
                      {getAmenityIcon(amenity)}
                      <span className="capitalize">{amenity.replace('-', ' ')}</span>
                    </div>
                  ))}
                  {hotel.amenities.length > 4 && (
                    <div className={`${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} px-2 py-1 rounded-full text-xs`}>
                      +{hotel.amenities.length - 4} more
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    View Details
                  </button>
                  <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105`}>
                    <MapPin className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHotels.length === 0 && (
          <div className="text-center py-12 animate-fade-in-up">
            <Search className={`h-16 w-16 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-4 animate-float`} />
            <h3 className={`text-xl font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>No hotels found</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search filters to find more options.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;