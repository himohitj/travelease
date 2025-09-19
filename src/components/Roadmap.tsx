import React, { useState } from 'react';
import { Plus, MapPin, Calendar, Clock, Star, Trash2 } from 'lucide-react';

interface RoadmapProps {
  isDarkMode: boolean;
}

interface RoadmapItem {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  type: 'destination' | 'hotel' | 'activity' | 'transport';
  notes: string;
}

const Roadmap: React.FC<RoadmapProps> = ({ isDarkMode }) => {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([
    {
      id: '1',
      title: 'Arrive at Mumbai Airport',
      location: 'Chhatrapati Shivaji International Airport',
      date: '2024-03-15',
      time: '10:00',
      type: 'transport',
      notes: 'Flight AI 127'
    },
    {
      id: '2',
      title: 'Check-in at The Taj Mahal Palace',
      location: 'Apollo Bunder, Colaba, Mumbai',
      date: '2024-03-15',
      time: '14:00',
      type: 'hotel',
      notes: 'Luxury suite with sea view'
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<RoadmapItem>>({
    title: '',
    location: '',
    date: '',
    time: '',
    type: 'destination',
    notes: ''
  });

  const addRoadmapItem = () => {
    if (newItem.title && newItem.location && newItem.date) {
      const item: RoadmapItem = {
        id: Date.now().toString(),
        title: newItem.title || '',
        location: newItem.location || '',
        date: newItem.date || '',
        time: newItem.time || '12:00',
        type: newItem.type as RoadmapItem['type'] || 'destination',
        notes: newItem.notes || ''
      };
      setRoadmapItems([...roadmapItems, item]);
      setNewItem({ title: '', location: '', date: '', time: '', type: 'destination', notes: '' });
      setShowAddForm(false);
    }
  };

  const removeItem = (id: string) => {
    setRoadmapItems(roadmapItems.filter(item => item.id !== id));
  };

  const getTypeIcon = (type: RoadmapItem['type']) => {
    switch (type) {
      case 'destination':
        return <MapPin className="h-5 w-5 text-blue-600" />;
      case 'hotel':
        return <Star className="h-5 w-5 text-purple-600" />;
      case 'activity':
        return <Calendar className="h-5 w-5 text-green-600" />;
      case 'transport':
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return <MapPin className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: RoadmapItem['type']) => {
    switch (type) {
      case 'destination':
        return 'border-blue-600 bg-blue-50';
      case 'hotel':
        return 'border-purple-600 bg-purple-50';
      case 'activity':
        return 'border-green-600 bg-green-50';
      case 'transport':
        return 'border-orange-600 bg-orange-50';
      default:
        return 'border-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 animate-fade-in-up`}>Travel Roadmap</h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} animate-fade-in-up animation-delay-200`}>
            Create and customize your perfect travel itinerary with detailed planning
          </p>
        </div>

        {/* Add New Item Button */}
        <div className="mb-8 text-center animate-fade-in-up animation-delay-400">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center space-x-2 animate-pulse-glow"
          >
            <Plus className="h-5 w-5 animate-bounce-subtle" />
            <span>Add to Roadmap</span>
          </button>
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8 animate-fade-in-up card-hover`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Add New Item</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Title</label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="e.g., Visit Red Fort"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Location</label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="e.g., Delhi, India"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Date</label>
                <input
                  type="date"
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  value={newItem.date}
                  onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Time</label>
                <input
                  type="time"
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  value={newItem.time}
                  onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Type</label>
                <select
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value as RoadmapItem['type'] })}
                >
                  <option value="destination">Destination</option>
                  <option value="hotel">Hotel</option>
                  <option value="activity">Activity</option>
                  <option value="transport">Transport</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Notes</label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="Additional details"
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={addRoadmapItem}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Add Item
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className={`${isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-gray-300 hover:bg-gray-400 text-gray-700'} px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Roadmap Timeline */}
        <div className="space-y-6">
          {roadmapItems
            .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
            .map((item, index) => (
              <div key={item.id} className="relative animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Timeline Line */}
                {index < roadmapItems.length - 1 && (
                  <div className={`absolute left-8 top-16 w-0.5 h-16 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} hidden md:block`} />
                )}
                
                <div className={`border-l-4 ${getTypeColor(item.type)} rounded-lg shadow-lg card-hover ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} rounded-full capitalize`}>
                              {item.type}
                            </span>
                          </div>
                          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 flex items-center`}>
                            <MapPin className="h-4 w-4 mr-1" />
                            {item.location}
                          </p>
                          <div className="flex items-center space-x-4 mb-2">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                              <Clock className="h-4 w-4 mr-1" />
                              {item.time}
                            </span>
                          </div>
                          {item.notes && (
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>{item.notes}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-all duration-300 transform hover:scale-110"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {roadmapItems.length === 0 && (
          <div className="text-center py-12 animate-fade-in-up">
            <MapPin className={`h-16 w-16 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-4 animate-float`} />
            <h3 className={`text-xl font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>No roadmap items yet</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Start adding destinations, hotels, and activities to create your travel plan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roadmap;