import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Shield Background */}
        <path
          d="M50 5 L85 20 L85 50 Q85 75 50 95 Q15 75 15 50 L15 20 Z"
          fill="url(#shieldGradient)"
          stroke="#2D1B69"
          strokeWidth="2"
        />
        
        {/* Ocean Wave */}
        <path
          d="M20 60 Q35 50 50 60 T80 60 L80 80 Q80 85 75 85 L25 85 Q20 85 20 80 Z"
          fill="url(#waveGradient)"
        />
        
        {/* Palm Tree */}
        <g transform="translate(25, 45)">
          <rect x="0" y="15" width="3" height="25" fill="#8B4513" />
          <path d="M-8 10 Q-5 5 2 8 Q5 12 0 15" fill="#228B22" />
          <path d="M8 10 Q5 5 -2 8 Q-5 12 0 15" fill="#228B22" />
          <path d="M-2 5 Q2 0 6 5 Q8 10 2 12" fill="#228B22" />
        </g>
        
        {/* Surfer Silhouette */}
        <g transform="translate(45, 35)">
          <circle cx="0" cy="0" r="2" fill="#2D1B69" />
          <rect x="-1" y="2" width="2" height="8" fill="#2D1B69" />
          <rect x="-3" y="4" width="6" height="1" fill="#2D1B69" />
          <rect x="-1" y="10" width="1" height="4" fill="#2D1B69" />
          <rect x="0" y="10" width="1" height="4" fill="#2D1B69" />
          <rect x="-8" y="8" width="16" height="2" rx="1" fill="#FF6B35" />
        </g>
        
        {/* Sun */}
        <circle cx="70" cy="25" r="6" fill="#FFD700" />
        <g transform="translate(70, 25)">
          <path d="M0 -10 L0 -8 M7 -7 L6 -6 M10 0 L8 0 M7 7 L6 6 M0 10 L0 8 M-7 7 L-6 6 M-10 0 L-8 0 M-7 -7 L-6 -6" 
                stroke="#FFD700" strokeWidth="1" strokeLinecap="round" />
        </g>
        
        {/* Clouds */}
        <g fill="white" opacity="0.8">
          <ellipse cx="60" cy="20" rx="4" ry="2" />
          <ellipse cx="58" cy="18" rx="3" ry="2" />
          <ellipse cx="62" cy="18" rx="3" ry="2" />
        </g>
        
        {/* Birds */}
        <g stroke="#2D1B69" strokeWidth="1" fill="none">
          <path d="M35 25 Q37 23 39 25" />
          <path d="M40 22 Q42 20 44 22" />
        </g>
        
        {/* Gradients */}
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ECDC4" />
            <stop offset="100%" stopColor="#44A08D" />
          </linearGradient>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00B4DB" />
            <stop offset="100%" stopColor="#0083B0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Logo;