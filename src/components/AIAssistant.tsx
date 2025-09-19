import React from 'react';

interface AIAssistantLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AIAssistantLogo: React.FC<AIAssistantLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Main Circle */}
        <circle cx="50" cy="50" r="45" fill="url(#aiGradient)" stroke="#4F46E5" strokeWidth="2" />
        
        {/* Inner Circle */}
        <circle cx="50" cy="50" r="35" fill="url(#innerGradient)" />
        
        {/* Eyes */}
        <circle cx="42" cy="42" r="4" fill="#4F46E5" />
        <circle cx="58" cy="42" r="4" fill="#4F46E5" />
        <circle cx="43" cy="41" r="1.5" fill="white" />
        <circle cx="59" cy="41" r="1.5" fill="white" />
        
        {/* Smile */}
        <path d="M40 58 Q50 68 60 58" stroke="#4F46E5" strokeWidth="3" fill="none" strokeLinecap="round" />
        
        {/* Neural Network Pattern */}
        <g stroke="#6366F1" strokeWidth="1" fill="none" opacity="0.6">
          <circle cx="30" cy="30" r="2" fill="#6366F1" />
          <circle cx="70" cy="30" r="2" fill="#6366F1" />
          <circle cx="30" cy="70" r="2" fill="#6366F1" />
          <circle cx="70" cy="70" r="2" fill="#6366F1" />
          <line x1="30" y1="30" x2="50" y2="50" />
          <line x1="70" y1="30" x2="50" y2="50" />
          <line x1="30" y1="70" x2="50" y2="50" />
          <line x1="70" y1="70" x2="50" y2="50" />
        </g>
        
        {/* Pulse Animation Rings */}
        <circle cx="50" cy="50" r="40" fill="none" stroke="#4F46E5" strokeWidth="1" opacity="0.3">
          <animate attributeName="r" values="35;45;35" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        
        <defs>
          <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0E7FF" />
            <stop offset="100%" stopColor="#C7D2FE" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default AIAssistantLogo;