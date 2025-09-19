import React, { useState } from 'react';
import { MapPin, Star, DollarSign, Clock, Search, Filter, Navigation, Phone } from 'lucide-react';

interface FoodFinderProps {
  isDarkMode: boolean;
}

interface FoodPlace {
  id: string;
  name: string;
  type: 'restaurant' | 'street-food' | 'cafe' | 'dhaba';
  cuisine: string;
  rating: number;
  priceRange: 'budget' | 'mid-range' | 'expensive';
  distance: number;
  estimatedPrice: number;
  image: string;
  address: string;
  phone: string;
  openHours: string;
  specialties: string[];
  coordinates: { lat: number; lng: number };
}

const FoodFinder: React.FC<FoodFinderProps> = ({ isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [showMap, setShowMap] = useState(false);

  const foodPlaces: FoodPlace[] = [
    {
      id: '1',
      name: 'Sharma Ji Ka Dhaba',
      type: 'dhaba',
      cuisine: 'North Indian',
      rating: 4.5,
      priceRange: 'budget',
      distance: 0.5,
      estimatedPrice: 150,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      address: 'Main Market, Connaught Place',
      phone: '+91 98765 43210',
      openHours: '7:00 AM - 11:00 PM',
      specialties: ['Butter Chicken', 'Dal Makhani', 'Naan'],
      coordinates: { lat: 28.6315, lng: 77.2167 }
    },
    {
      id: '2',
      name: 'Street Food Paradise',
      type: 'street-food',
      cuisine: 'Indian Street Food',
      rating: 4.3,
      priceRange: 'budget',
      distance: 0.3,
      estimatedPrice: 80,
      image: 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=800',
      address: 'Chandni Chowk, Old Delhi',
      phone: '+91 87654 32109',
      openHours: '10:00 AM - 10:00 PM',
      specialties: ['Gol Gappe', 'Chaat', 'Samosa'],
      coordinates: { lat: 28.6506, lng: 77.2334 }
    },
    {
      id: '3',
      name: 'The Royal Feast',
      type: 'restaurant',
      cuisine: 'Mughlai',
      rating: 4.7,
      priceRange: 'expensive',
      distance: 1.2,
      estimatedPrice: 800,
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800',
      address: 'Khan Market, New Delhi',
      phone: '+91 76543 21098',
      openHours: '12:00 PM - 11:30 PM',
      specialties: ['Biryani', 'Kebabs', 'Korma'],
      coordinates: { lat: 28.5535, lng: 77.2588 }
    },
    {
      id: '4',
      name: 'Cafe Mocha',
      type: 'cafe',
      cuisine: 'Continental',
      rating: 4.2,
      priceRange: 'mid-range',
      distance: 0.8,
      estimatedPrice: 300,
      image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
      address: 'Select City Walk, Saket',
      phone: '+91 65432 10987',
      openHours: '8:00 AM - 12:00 AM',
      specialties: ['Coffee', 'Pasta', 'Sandwiches'],
      coordinates: { lat: 28.5245, lng: 77.2066 }
    },
    {
      id: '5',
      name: 'Punjabi Tadka',
      type: 'dhaba',
      cuisine: 'Punjabi',
      rating: 4.4,
      priceRange: 'budget',
      distance: 2.1,
      estimatedPrice: 200,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      address: 'GT Road, Gurgaon',
      phone: '+91 54321 09876',
      openHours: '6:00 AM - 12:00 AM',
      specialties: ['Sarson ka Saag', 'Makki ki Roti', 'Lassi'],
      coordinates: { lat: 28.4595, lng: 77.0266 }
    },
    {
      id: '6',
      name: 'South Spice Corner',
      type: 'restaurant',
      cuisine: 'South Indian',
      rating: 4.6,
      priceRange: 'mid-range',
      distance: 1.5,
      estimatedPrice: 250,
      image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800',
      address: 'Lajpat Nagar, New Delhi',
      phone: '+91 43210 98765',
      openHours: '7:00 AM - 10:00 PM',
      specialties: ['Dosa', 'Idli', 'Sambar'],
      coordinates: { lat: 28.5677, lng: 77.2431 }
    }
  ];

  const getTypeIcon = (type: FoodPlace['type']) => {
    switch (type) {
      case 'restaurant':
        return '🍽️';
      case 'street-food':
        return '🍢';
      case 'cafe':
        return '☕';
      case 'dhaba':
        return '🍛';
      default:
        return '🍴';
    }
  };

  const getPriceColor = (priceRange: FoodPlace['priceRange']) => {
    switch (priceRange) {
      case 'budget':
        return 'text-green-600 bg-green-100';
      case 'mid-range':
        return 'text-yellow-600 bg-yellow-100';
      case 'expensive':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredPlaces = foodPlaces.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || place.type === selectedType;
    const matchesBudget = selectedBudget === 'all' || place.priceRange === selectedBudget;
    
    return matchesSearch && matchesType && matchesBudget;
  }).sort((a, b) => a.distance - b.distance);

  const foodTypes = [
    { id: 'all', label: 'All Food', icon: '🍴' },
    { id: 'restaurant', label: 'Restaurants', icon: '🍽️' },
    { id: 'street-food', label: 'Street Food', icon: '🍢' },
    { id: 'cafe', label: 'Cafes', icon: '☕' },
    { id: 'dhaba', label: 'Dhabas', icon: '🍛' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 animate-fade-in-up`}>
            🍽️ Nearby Food Finder
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} animate-fade-in-up animation-delay-200`}>
            Discover the best local food spots based on your budget and taste preferences
          </p>
        </div>

        {/* Search and Filters */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8 animate-fade-in-up animation-delay-400 card-hover`}>
          <div className="grid md:grid-cols-3 gap-4 items-end mb-6">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Search Food</label>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  className={`w-full pl-10 pr-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="Search by name or cuisine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Food Type</label>
              <select
                className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {foodTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Budget</label>
              <select
                className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
              >
                <option value="all">All Budgets</option>
                <option value="budget">Budget (₹50-200)</option>
                <option value="mid-range">Mid-range (₹200-500)</option>
                <option value="expensive">Premium (₹500+)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Found {filteredPlaces.length} food places nearby • Sorted by distance
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
                <p className="text-lg font-medium">Food Places Map</p>
                <p className="text-sm">Interactive map showing nearby restaurants and food stalls</p>
              </div>
            </div>
          </div>
        )}

        {/* Food Places Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div key={place.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden card-hover animate-fade-in-up`}>
              <div className="relative">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <div className="bg-white px-2 py-1 rounded-full flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{place.rating}</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="text-2xl">{getTypeIcon(place.type)}</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full flex items-center space-x-1">
                    <Navigation className="h-3 w-3" />
                    <span className="text-xs">{place.distance} km away</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{place.name}</h3>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">₹{place.estimatedPrice}</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>per person</div>
                  </div>
                </div>

                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-2`}>{place.cuisine}</p>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriceColor(place.priceRange)}`}>
                    {place.priceRange.replace('-', ' ')}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                    <Clock className="h-3 w-3 mr-1" />
                    {place.openHours}
                  </span>
                </div>

                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3 flex items-center`}>
                  <MapPin className="h-4 w-4 mr-1" />
                  {place.address}
                </p>

                <div className="mb-4">
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Specialties:</h4>
                  <div className="flex flex-wrap gap-1">
                    {place.specialties.slice(0, 3).map((specialty, index) => (
                      <span key={index} className={`px-2 py-1 text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full`}>
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    Get Directions
                  </button>
                  <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105`}>
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-center py-12 animate-fade-in-up">
            <Search className={`h-16 w-16 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-4 animate-float`} />
            <h3 className={`text-xl font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>No food places found</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search filters to find more options.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodFinder;