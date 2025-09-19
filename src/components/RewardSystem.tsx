import React, { useState } from 'react';
import { Plus, Gift, Smartphone, ShoppingBag, Star, MapPin, Camera, Trophy, Coins } from 'lucide-react';

interface RewardSystemProps {
  isDarkMode: boolean;
}

interface HiddenGem {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  submittedBy: string;
  points: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

interface Reward {
  id: string;
  type: 'voucher' | 'recharge';
  title: string;
  description: string;
  pointsRequired: number;
  value: number;
  provider: string;
  icon: string;
  category: string;
}

const RewardSystem: React.FC<RewardSystemProps> = ({ isDarkMode }) => {
  const [userPoints, setUserPoints] = useState(1250);
  const [showAddGem, setShowAddGem] = useState(false);
  const [activeTab, setActiveTab] = useState<'add' | 'rewards' | 'history'>('add');
  
  const [newGem, setNewGem] = useState({
    name: '',
    location: '',
    description: '',
    image: ''
  });

  const [submittedGems] = useState<HiddenGem[]>([
    {
      id: '1',
      name: 'Secret Waterfall',
      location: 'Rishikesh, Uttarakhand',
      description: 'A hidden waterfall behind the main temple, perfect for meditation',
      image: 'https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=400',
      submittedBy: 'You',
      points: 100,
      status: 'approved',
      submittedDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sunrise Point',
      location: 'Manali, Himachal Pradesh',
      description: 'Best sunrise view point known only to locals',
      image: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=400',
      submittedBy: 'You',
      points: 150,
      status: 'pending',
      submittedDate: '2024-01-20'
    }
  ]);

  const rewards: Reward[] = [
    {
      id: '1',
      type: 'voucher',
      title: 'Amazon Shopping Voucher',
      description: '₹500 Amazon gift card for online shopping',
      pointsRequired: 500,
      value: 500,
      provider: 'Amazon',
      icon: '🛒',
      category: 'Shopping'
    },
    {
      id: '2',
      type: 'recharge',
      title: 'Jio Mobile Recharge',
      description: '₹200 mobile recharge for Jio users',
      pointsRequired: 200,
      value: 200,
      provider: 'Jio',
      icon: '📱',
      category: 'Mobile'
    },
    {
      id: '3',
      type: 'recharge',
      title: 'Airtel Mobile Recharge',
      description: '₹300 mobile recharge for Airtel users',
      pointsRequired: 300,
      value: 300,
      provider: 'Airtel',
      icon: '📞',
      category: 'Mobile'
    },
    {
      id: '4',
      type: 'voucher',
      title: 'Flipkart Shopping Voucher',
      description: '₹1000 Flipkart gift card',
      pointsRequired: 1000,
      value: 1000,
      provider: 'Flipkart',
      icon: '🛍️',
      category: 'Shopping'
    },
    {
      id: '5',
      type: 'recharge',
      title: 'Vi Mobile Recharge',
      description: '₹250 mobile recharge for Vi users',
      pointsRequired: 250,
      value: 250,
      provider: 'Vi',
      icon: '📲',
      category: 'Mobile'
    },
    {
      id: '6',
      type: 'voucher',
      title: 'Swiggy Food Voucher',
      description: '₹300 food delivery voucher',
      pointsRequired: 300,
      value: 300,
      provider: 'Swiggy',
      icon: '🍔',
      category: 'Food'
    }
  ];

  const handleSubmitGem = () => {
    if (newGem.name && newGem.location && newGem.description) {
      // In real app, this would submit to backend
      console.log('Submitting gem:', newGem);
      setNewGem({ name: '', location: '', description: '', image: '' });
      setShowAddGem(false);
      // Award points for submission
      setUserPoints(prev => prev + 50);
    }
  };

  const handleRedeemReward = (reward: Reward) => {
    if (userPoints >= reward.pointsRequired) {
      setUserPoints(prev => prev - reward.pointsRequired);
      // In real app, this would process the redemption
      console.log('Redeeming reward:', reward);
      alert(`Successfully redeemed ${reward.title}! Check your email for details.`);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 animate-fade-in-up`}>
            🎁 Hidden Gems Reward System
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} animate-fade-in-up animation-delay-200`}>
            Discover hidden spots, earn points, and redeem amazing rewards!
          </p>
        </div>

        {/* Points Display */}
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-purple-900 to-blue-900' : 'bg-gradient-to-r from-purple-600 to-blue-600'} rounded-lg p-6 mb-8 text-white animate-fade-in-up animation-delay-400`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Coins className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userPoints} Points</h2>
                <p className="text-purple-200">Your current reward balance</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-200 mb-1">Next Milestone</div>
              <div className="text-lg font-semibold">1500 Points</div>
              <div className="w-32 bg-white bg-opacity-20 rounded-full h-2 mt-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${(userPoints / 1500) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg mb-8 animate-fade-in-up animation-delay-600`}>
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                activeTab === 'add'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : `${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`
              }`}
            >
              <Plus className="h-5 w-5 mx-auto mb-1" />
              Add Hidden Gem
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                activeTab === 'rewards'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : `${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`
              }`}
            >
              <Gift className="h-5 w-5 mx-auto mb-1" />
              Redeem Rewards
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                activeTab === 'history'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : `${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`
              }`}
            >
              <Trophy className="h-5 w-5 mx-auto mb-1" />
              My Submissions
            </button>
          </div>
        </div>

        {/* Add Hidden Gem Tab */}
        {activeTab === 'add' && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 animate-fade-in-up`}>
            <div className="mb-6">
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                Share a Hidden Gem
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Found a beautiful unexplored spot? Share it with fellow travelers and earn points!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Place Name *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="e.g., Secret Waterfall"
                  value={newGem.name}
                  onChange={(e) => setNewGem({ ...newGem, name: e.target.value })}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Location *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="e.g., Rishikesh, Uttarakhand"
                  value={newGem.location}
                  onChange={(e) => setNewGem({ ...newGem, location: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Description *
              </label>
              <textarea
                rows={4}
                className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                placeholder="Describe what makes this place special, how to reach there, best time to visit..."
                value={newGem.description}
                onChange={(e) => setNewGem({ ...newGem, description: e.target.value })}
              />
            </div>

            <div className="mt-4">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Photo URL (Optional)
              </label>
              <input
                type="url"
                className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                placeholder="https://example.com/photo.jpg"
                value={newGem.image}
                onChange={(e) => setNewGem({ ...newGem, image: e.target.value })}
              />
            </div>

            <div className={`mt-6 p-4 ${isDarkMode ? 'bg-blue-900 bg-opacity-50' : 'bg-blue-50'} rounded-lg`}>
              <h4 className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} mb-2`}>
                🎯 Earn Points for Sharing!
              </h4>
              <ul className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'} space-y-1`}>
                <li>• Submit a hidden gem: <strong>50 points</strong></li>
                <li>• Approved submission: <strong>Additional 100 points</strong></li>
                <li>• Popular submission (10+ likes): <strong>Bonus 50 points</strong></li>
              </ul>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleSubmitGem}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Submit Hidden Gem (+50 Points)
              </button>
              <button
                onClick={() => setNewGem({ name: '', location: '', description: '', image: '' })}
                className={`${isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-gray-300 hover:bg-gray-400 text-gray-700'} px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105`}
              >
                Clear Form
              </button>
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div key={reward.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 card-hover animate-fade-in-up`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{reward.icon}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reward.type === 'voucher' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {reward.category}
                    </div>
                  </div>

                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                    {reward.title}
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>
                    {reward.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {reward.pointsRequired} Points
                      </span>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      ₹{reward.value}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRedeemReward(reward)}
                    disabled={userPoints < reward.pointsRequired}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                      userPoints >= reward.pointsRequired
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-lg'
                        : `${isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500'} cursor-not-allowed`
                    }`}
                  >
                    {userPoints >= reward.pointsRequired ? 'Redeem Now' : 'Insufficient Points'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {submittedGems.map((gem) => (
              <div key={gem.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 card-hover animate-fade-in-up`}>
                <div className="flex items-start space-x-4">
                  <img
                    src={gem.image}
                    alt={gem.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {gem.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          gem.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : gem.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {gem.status.charAt(0).toUpperCase() + gem.status.slice(1)}
                        </span>
                        <div className="flex items-center space-x-1 text-yellow-600">
                          <Coins className="h-4 w-4" />
                          <span className="font-medium">+{gem.points}</span>
                        </div>
                      </div>
                    </div>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 flex items-center`}>
                      <MapPin className="h-4 w-4 mr-1" />
                      {gem.location}
                    </p>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-2`}>
                      {gem.description}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Submitted on {new Date(gem.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardSystem;