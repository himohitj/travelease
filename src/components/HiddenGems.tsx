import React, { useState } from 'react';
import { MapPin, Star, Camera, Clock, Users, Heart, Eye, Search } from 'lucide-react';

interface HiddenGemsProps {
  isDarkMode: boolean;
}

interface Destination {
  id: string;
  name: string;
  location: string;
  category: 'popular' | 'hidden' | 'adventure' | 'cultural' | 'nature';
  rating: number;
  image: string;
  description: string;
  bestTime: string;
  estimatedTime: string;
  crowdLevel: 'Low' | 'Medium' | 'High';
  tips: string[];
  coordinates: { lat: number; lng: number };
  isLiked: boolean;
}

const HiddenGems: React.FC<HiddenGemsProps> = ({ isDarkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([
    {
      id: '1',
      name: 'Hampi Ruins',
      location: 'Karnataka, India',
      category: 'cultural',
      rating: 4.7,
      image: 'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Ancient ruins of the Vijayanagara Empire with stunning boulder landscapes and historical temples.',
      bestTime: 'October to March',
      estimatedTime: '2-3 days',
      crowdLevel: 'Medium',
      tips: ['Visit early morning for golden hour photos', 'Rent a bicycle to explore efficiently', 'Stay in Hampi Bazaar for authentic experience'],
      coordinates: { lat: 15.3350, lng: 76.4600 },
      isLiked: false
    },
    {
      id: '2',
      name: 'Valley of Flowers',
      location: 'Uttarakhand, India',
      category: 'hidden',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'A hidden paradise filled with rare alpine flowers, snow-capped peaks, and pristine meadows.',
      bestTime: 'July to September',
      estimatedTime: '4-5 days',
      crowdLevel: 'Low',
      tips: ['Trek during flower blooming season', 'Carry rain gear and warm clothes', 'Book permits in advance'],
      coordinates: { lat: 30.7268, lng: 79.6045 },
      isLiked: true
    },
    {
      id: '3',
      name: 'Taj Mahal',
      location: 'Agra, India',
      category: 'popular',
      rating: 4.6,
      image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Iconic white marble mausoleum and UNESCO World Heritage Site, symbol of eternal love.',
      bestTime: 'October to March',
      estimatedTime: '1 day',
      crowdLevel: 'High',
      tips: ['Visit at sunrise for fewer crowds', 'Book tickets online in advance', 'Hire a certified guide for historical insights'],
      coordinates: { lat: 27.1751, lng: 78.0421 },
      isLiked: false
    },
    {
      id: '4',
      name: 'Spiti Valley',
      location: 'Himachal Pradesh, India',
      category: 'adventure',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'High-altitude cold desert with ancient monasteries, dramatic landscapes, and Tibetan culture.',
      bestTime: 'May to October',
      estimatedTime: '7-10 days',
      crowdLevel: 'Low',
      tips: ['Acclimatize properly to high altitude', 'Carry sufficient cash and medicines', 'Check road conditions before traveling'],
      coordinates: { lat: 32.2460, lng: 78.0413 },
      isLiked: true
    },
    {
      id: '5',
      name: 'Khajjiar',
      location: 'Himachal Pradesh, India',
      category: 'nature',
      rating: 4.4,
      image: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Mini Switzerland of India with lush green meadows, dense forests, and serene lake.',
      bestTime: 'March to June',
      estimatedTime: '2-3 days',
      crowdLevel: 'Medium',
      tips: ['Try paragliding for aerial views', 'Visit the ancient Khajji Nag Temple', 'Enjoy horseback riding in the meadows'],
      coordinates: { lat: 32.5499, lng: 76.0447 },
      isLiked: false
    },
    {
      id: '6',
      name: 'Majuli Island',
      location: 'Assam, India',
      category: 'hidden',
      rating: 4.3,
      image: 'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'World\'s largest river island with unique Assamese culture, traditional crafts, and migratory birds.',
      bestTime: 'October to April',
      estimatedTime: '2-3 days',
      crowdLevel: 'Low',
      tips: ['Stay in traditional bamboo huts', 'Visit the ancient Satras (monasteries)', 'Experience local pottery making'],
      coordinates: { lat: 27.0238, lng: 94.2152 },
      isLiked: true
    }
  ]);

  const categories = [
    { id: 'all', label: 'All Places', icon: <MapPin className="h-4 w-4" /> },
    { id: 'popular', label: 'Popular', icon: <Star className="h-4 w-4" /> },
    { id: 'hidden', label: 'Hidden Gems', icon: <Eye className="h-4 w-4" /> },
    { id: 'adventure', label: 'Adventure', icon: <Camera className="h-4 w-4" /> },
    { id: 'cultural', label: 'Cultural', icon: <Users className="h-4 w-4" /> },
    { id: 'nature', label: 'Nature', icon: <Heart className="h-4 w-4" /> },
  ];

  const getCrowdLevelColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleLike = (id: string) => {
    setDestinations(prev => prev.map(dest => 
      dest.id === id ? { ...dest, isLiked: !dest.isLiked } : dest
    ));
  };

  const filteredDestinations = destinations.filter(destination => {
    const matchesCategory = selectedCategory === 'all' || destination.category === selectedCategory;
    const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         destination.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 animate-fade-in-up`}>Hidden Gems & Tourist Spots</h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} animate-fade-in-up animation-delay-200`}>
            Discover breathtaking destinations, from world-famous landmarks to secret local treasures
          </p>
        </div>

        {/* Search and Categories */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8 animate-fade-in-up animation-delay-400 card-hover`}>
          <div className="mb-6">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                className={`w-full pl-10 pr-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }`}
              >
                {category.icon}
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <div key={destination.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden card-hover animate-fade-in-up`}>
              <div className="relative">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <div className="bg-white px-2 py-1 rounded-full flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{destination.rating}</span>
                  </div>
                  <button
                    onClick={() => toggleLike(destination.id)}
                    className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      destination.isLiked
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${destination.isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    destination.category === 'hidden' ? 'bg-purple-100 text-purple-800' :
                    destination.category === 'popular' ? 'bg-blue-100 text-blue-800' :
                    destination.category === 'adventure' ? 'bg-orange-100 text-orange-800' :
                    destination.category === 'cultural' ? 'bg-green-100 text-green-800' :
                    'bg-teal-100 text-teal-800'
                  }`}>
                    {destination.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3">
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-1`}>{destination.name}</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} flex items-center`}>
                    <MapPin className="h-4 w-4 mr-1" />
                    {destination.location}
                  </p>
                </div>

                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 leading-relaxed`}>{destination.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-2 rounded-lg`}>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Best Time</div>
                    <div className="text-sm font-medium">{destination.bestTime}</div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-2 rounded-lg`}>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Duration</div>
                    <div className="text-sm font-medium flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {destination.estimatedTime}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className={`h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Crowd Level:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCrowdLevelColor(destination.crowdLevel)}`}>
                      {destination.crowdLevel}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Travel Tips:</h4>
                  <div className="space-y-1">
                    {destination.tips.slice(0, 2).map((tip, index) => (
                      <p key={index} className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} flex items-start`}>
                        <span className={`inline-block w-1 h-1 ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} rounded-full mt-2 mr-2 flex-shrink-0`}></span>
                        {tip}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    Explore
                  </button>
                  <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105`}>
                    <MapPin className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-12 animate-fade-in-up">
            <Search className={`h-16 w-16 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-4 animate-float`} />
            <h3 className={`text-xl font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>No destinations found</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search or category filter.</p>
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-center text-white animate-fade-in-up card-hover">
          <h2 className="text-3xl font-bold mb-4 animate-fade-in-up">Discover Your Next Adventure</h2>
          <p className="text-xl mb-6 text-purple-100 animate-fade-in-up animation-delay-200">
            Share hidden gems and earn reward points! Get vouchers and mobile recharges.
          </p>
          <button 
            onClick={() => window.location.hash = 'rewards'}
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl animate-bounce-subtle animate-fade-in-up animation-delay-400"
          >
            🎁 Earn Rewards Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HiddenGems;