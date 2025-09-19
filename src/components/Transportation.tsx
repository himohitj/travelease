import React, { useState } from 'react';
import { MapPin, Car, Bus, Train, Plane, Clock, IndianRupee, Star } from 'lucide-react';

interface TransportationProps {
  isDarkMode: boolean;
}

interface TransportOption {
  id: string;
  type: 'bus' | 'train' | 'taxi' | 'auto' | 'metro' | 'flight';
  name: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  rating: number;
  nextAvailable: string;
  frequency: string;
  coordinates: { lat: number; lng: number };
}

const Transportation: React.FC<TransportationProps> = ({ isDarkMode }) => {
  const [selectedType, setSelectedType] = useState('all');
  const [searchLocation, setSearchLocation] = useState('');

  const transportOptions: TransportOption[] = [
    {
      id: '1',
      type: 'metro',
      name: 'Delhi Metro',
      from: 'Rajiv Chowk',
      to: 'Connaught Place',
      price: 30,
      duration: '15 min',
      rating: 4.2,
      nextAvailable: '5 min',
      frequency: 'Every 3-5 min',
      coordinates: { lat: 28.6328, lng: 77.2197 }
    },
    {
      id: '2',
      type: 'bus',
      name: 'Mumbai BEST Bus',
      from: 'Colaba',
      to: 'Bandra',
      price: 25,
      duration: '45 min',
      rating: 3.8,
      nextAvailable: '10 min',
      frequency: 'Every 15 min',
      coordinates: { lat: 19.0760, lng: 72.8777 }
    },
    {
      id: '3',
      type: 'taxi',
      name: 'Ola Cab',
      from: 'Your Location',
      to: 'Airport',
      price: 450,
      duration: '35 min',
      rating: 4.3,
      nextAvailable: 'Now',
      frequency: 'On demand',
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    {
      id: '4',
      type: 'auto',
      name: 'Auto Rickshaw',
      from: 'Railway Station',
      to: 'City Center',
      price: 80,
      duration: '20 min',
      rating: 4.0,
      nextAvailable: 'Now',
      frequency: 'On demand',
      coordinates: { lat: 18.5204, lng: 73.8567 }
    },
    {
      id: '5',
      type: 'train',
      name: 'Rajdhani Express',
      from: 'New Delhi',
      to: 'Mumbai Central',
      price: 2500,
      duration: '16 hrs',
      rating: 4.5,
      nextAvailable: '2 hrs',
      frequency: 'Daily',
      coordinates: { lat: 28.6139, lng: 77.2090 }
    },
    {
      id: '6',
      type: 'flight',
      name: 'IndiGo Airlines',
      from: 'Delhi Airport',
      to: 'Bangalore Airport',
      price: 8500,
      duration: '2.5 hrs',
      rating: 4.1,
      nextAvailable: '3 hrs',
      frequency: 'Every 2 hrs',
      coordinates: { lat: 28.5562, lng: 77.1000 }
    }
  ];

  const getTransportIcon = (type: TransportOption['type']) => {
    switch (type) {
      case 'bus':
        return <Bus className="h-6 w-6" />;
      case 'train':
        return <Train className="h-6 w-6" />;
      case 'taxi':
        return <Car className="h-6 w-6" />;
      case 'auto':
        return <Car className="h-6 w-6" />;
      case 'metro':
        return <Train className="h-6 w-6" />;
      case 'flight':
        return <Plane className="h-6 w-6" />;
      default:
        return <Car className="h-6 w-6" />;
    }
  };

  const getTransportColor = (type: TransportOption['type']) => {
    switch (type) {
      case 'bus':
        return 'text-green-600 bg-green-100';
      case 'train':
        return 'text-blue-600 bg-blue-100';
      case 'taxi':
        return 'text-yellow-600 bg-yellow-100';
      case 'auto':
        return 'text-orange-600 bg-orange-100';
      case 'metro':
        return 'text-purple-600 bg-purple-100';
      case 'flight':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredOptions = transportOptions.filter(option => {
    const matchesType = selectedType === 'all' || option.type === selectedType;
    const matchesLocation = searchLocation === '' || 
                           option.from.toLowerCase().includes(searchLocation.toLowerCase()) ||
                           option.to.toLowerCase().includes(searchLocation.toLowerCase());
    return matchesType && matchesLocation;
  });

  const transportTypes = [
    { id: 'all', label: 'All Transport', icon: <Car className="h-4 w-4" /> },
    { id: 'bus', label: 'Bus', icon: <Bus className="h-4 w-4" /> },
    { id: 'train', label: 'Train', icon: <Train className="h-4 w-4" /> },
    { id: 'metro', label: 'Metro', icon: <Train className="h-4 w-4" /> },
    { id: 'taxi', label: 'Taxi', icon: <Car className="h-4 w-4" /> },
    { id: 'auto', label: 'Auto', icon: <Car className="h-4 w-4" /> },
    { id: 'flight', label: 'Flight', icon: <Plane className="h-4 w-4" /> },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 animate-fade-in-up`}>Transportation Options</h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} animate-fade-in-up animation-delay-200`}>
            Find the best local transport options with real-time availability and pricing
          </p>
        </div>

        {/* Search and Filter */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8 animate-fade-in-up animation-delay-400 card-hover`}>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Search Location</label>
              <div className="relative">
                <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  className={`w-full pl-10 pr-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="Enter pickup or destination..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Transport Type</label>
              <select
                className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {transportTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transport Type Tabs */}
          <div className="flex flex-wrap gap-2">
            {transportTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedType === type.id
                    ? 'bg-blue-600 text-white'
                    : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }`}
              >
                {type.icon}
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8 animate-fade-in-up animation-delay-600 card-hover`}>
          <div className={`h-64 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg flex items-center justify-center`}>
            <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <MapPin className="h-12 w-12 mx-auto mb-2 animate-float" />
              <p className="text-lg font-medium">Transport Map</p>
              <p className="text-sm">Google Maps integration showing transport hubs and routes</p>
            </div>
          </div>
        </div>

        {/* Transport Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOptions.map((option) => (
            <div key={option.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 card-hover animate-fade-in-up`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getTransportColor(option.type)}`}>
                  {getTransportIcon(option.type)}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 flex items-center">
                    <IndianRupee className="h-5 w-5" />
                    {option.price}
                  </div>
                  <div className="text-sm text-gray-500">{option.duration}</div>
                </div>
              </div>

              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{option.name}</h3>
              
              <div className="space-y-2 mb-4">
                <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <MapPin className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-sm">From: {option.from}</span>
                </div>
                <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <MapPin className="h-4 w-4 mr-2 text-red-600" />
                  <span className="text-sm">To: {option.to}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{option.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className={`h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Next: {option.nextAvailable}</span>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3 mb-4`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Frequency:</strong> {option.frequency}
                </p>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Book Now
                </button>
                <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105`}>
                  <MapPin className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredOptions.length === 0 && (
          <div className="text-center py-12 animate-fade-in-up">
            <Bus className={`h-16 w-16 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-4 animate-float`} />
            <h3 className={`text-xl font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>No transport options found</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search location or transport type.</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className={`mt-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 animate-fade-in-up card-hover`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className={`p-4 text-center ${isDarkMode ? 'bg-blue-900 hover:bg-blue-800' : 'bg-blue-50 hover:bg-blue-100'} rounded-lg transition-all duration-300 transform hover:scale-105`}>
              <Bus className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bus Routes</span>
            </button>
            <button className={`p-4 text-center ${isDarkMode ? 'bg-green-900 hover:bg-green-800' : 'bg-green-50 hover:bg-green-100'} rounded-lg transition-all duration-300 transform hover:scale-105`}>
              <Train className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Train Schedule</span>
            </button>
            <button className={`p-4 text-center ${isDarkMode ? 'bg-yellow-900 hover:bg-yellow-800' : 'bg-yellow-50 hover:bg-yellow-100'} rounded-lg transition-all duration-300 transform hover:scale-105`}>
              <Car className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Book Taxi</span>
            </button>
            <button className={`p-4 text-center ${isDarkMode ? 'bg-purple-900 hover:bg-purple-800' : 'bg-purple-50 hover:bg-purple-100'} rounded-lg transition-all duration-300 transform hover:scale-105`}>
              <MapPin className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nearby Stops</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transportation;