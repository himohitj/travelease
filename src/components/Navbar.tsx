import React, { useState } from 'react';
import { Menu, X, User, Moon, Sun } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onAuthOpen: (type: 'login' | 'signup') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, onSectionChange, onAuthOpen, isDarkMode, onToggleDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'hotels', label: 'Nearby Hotels' },
    { id: 'food-finder', label: 'Food Finder' },
    { id: 'transportation', label: 'Transportation' },
    { id: 'hidden-gems', label: 'Hidden Gems' },
    { id: 'rewards', label: 'Rewards' },
  ];

  return (
    <nav className={`${isDarkMode ? 'bg-gray-900 shadow-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-50 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => onSectionChange('home')}>
            <Logo size="md" className="group-hover:scale-110 transition-transform duration-300" />
            <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} group-hover:text-blue-600 transition-colors duration-300`}>TravelEase</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 transform ${
                  activeSection === item.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : `${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 transform ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => onAuthOpen('login')}
              className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 transform`}
            >
              Login
            </button>
            <button
              onClick={() => onAuthOpen('signup')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 transform hover:shadow-lg"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} p-2 transition-all duration-300 hover:scale-110 transform`}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={`md:hidden ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t transition-all duration-300`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-base font-medium transition-all duration-300 hover:scale-105 transform ${
                    activeSection === item.id
                      ? `text-blue-600 ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`
                      : `${isDarkMode ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 pb-2 border-t">
                <button
                  onClick={() => {
                    onToggleDarkMode();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-base font-medium ${isDarkMode ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'} transition-all duration-300`}
                >
                  {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
                <button
                  onClick={() => {
                    onAuthOpen('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-base font-medium ${isDarkMode ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'} transition-all duration-300`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onAuthOpen('signup');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg mt-2 transition-all duration-300 hover:scale-105 transform"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;