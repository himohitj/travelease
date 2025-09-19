import React from 'react';
import { MapPin, Users, Star, Clock } from 'lucide-react';

interface HomeProps {
  isDarkMode: boolean;
}

const Home: React.FC<HomeProps> = ({ isDarkMode }) => {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: 'Smart Trip Planning',
      description: 'Create personalized roadmaps and discover the best routes to your favorite destinations.',
    },
    {
      icon: <Users className="h-8 w-8 text-teal-600" />,
      title: 'Local Insights',
      description: 'Get recommendations from locals and fellow travelers for authentic experiences.',
    },
    {
      icon: <Star className="h-8 w-8 text-orange-600" />,
      title: 'Curated Experiences',
      description: 'Discover hidden gems and popular attractions with detailed guides and reviews.',
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: 'Real-time Updates',
      description: 'Stay informed with live updates on hotels, transportation, and local events.',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Happy Travelers' },
    { number: '1000+', label: 'Destinations' },
    { number: '25K+', label: 'Hotel Partners' },
    { number: '4.9', label: 'Average Rating' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-teal-600">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="animate-fade-in-up">Explore the World with</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse"> Confidence</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in-up animation-delay-300">
            Your ultimate travel companion for discovering destinations, planning routes, 
            and creating unforgettable memories around the globe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-bounce-subtle">
              Start Planning
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              Explore Destinations
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 animate-fade-in-up`}>
              Why Choose TravelEase?
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto animate-fade-in-up animation-delay-200`}>
              We combine cutting-edge technology with local expertise to provide you with the most 
              comprehensive travel planning experience available.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center group transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex justify-center group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{feature.title}</h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-white animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="text-4xl md:text-5xl font-bold mb-2 hover:scale-110 transition-transform duration-300 cursor-default">{stat.number}</div>
                <div className="text-blue-200 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-20 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 animate-fade-in-up`}>
              How TravelEase Works
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto animate-fade-in-up animation-delay-200`}>
              Planning your perfect trip is easier than ever with our step-by-step approach
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in-up animation-delay-300 group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Choose Your Destination</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Browse our curated list of destinations or search for your dream location with detailed insights and recommendations.
              </p>
            </div>
            <div className="text-center animate-fade-in-up animation-delay-500 group">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Plan Your Route</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Create a personalized roadmap with our intelligent planning tools, including hotels, transport, and attractions.
              </p>
            </div>
            <div className="text-center animate-fade-in-up animation-delay-700 group">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Explore & Enjoy</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Follow your customized itinerary and discover both popular attractions and hidden gems along the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-600 animate-gradient-x">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in-up">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 animate-fade-in-up animation-delay-300">
            Join thousands of travelers who trust TravelEase for their journey planning needs.
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl animate-bounce-subtle animate-fade-in-up animation-delay-600">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;