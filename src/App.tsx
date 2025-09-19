import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Home from './components/Home';
import Roadmap from './components/Roadmap';
import Hotels from './components/Hotels';
import Transportation from './components/Transportation';
import HiddenGems from './components/HiddenGems';
import FoodFinder from './components/FoodFinder';
import RewardSystem from './components/RewardSystem';
import AITravelAssistant from './components/AITravelAssistant';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: 'login' | 'signup' }>({
    isOpen: false,
    type: 'login'
  });

  const handleAuthOpen = (type: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, type });
  };

  const handleAuthClose = () => {
    setAuthModal({ isOpen: false, type: 'login' });
  };

  const handleAuthSwitchType = () => {
    setAuthModal(prev => ({
      ...prev,
      type: prev.type === 'login' ? 'signup' : 'login'
    }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return <Home isDarkMode={isDarkMode} />;
      case 'roadmap':
        return <Roadmap isDarkMode={isDarkMode} />;
      case 'hotels':
        return <Hotels isDarkMode={isDarkMode} />;
      case 'transportation':
        return <Transportation isDarkMode={isDarkMode} />;
      case 'hidden-gems':
        return <HiddenGems isDarkMode={isDarkMode} />;
      case 'food-finder':
        return <FoodFinder isDarkMode={isDarkMode} />;
      case 'rewards':
        return <RewardSystem isDarkMode={isDarkMode} />;
      default:
        return <Home isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onAuthOpen={handleAuthOpen}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      
      <main>
        {renderActiveSection()}
      </main>

      <AuthModal
        isOpen={authModal.isOpen}
        type={authModal.type}
        onClose={handleAuthClose}
        onSwitchType={handleAuthSwitchType}
      />

      <AITravelAssistant isDarkMode={isDarkMode} />
    </div>
  );
}

export default App;