import React, { useId } from 'react';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  showText?: boolean;
}

export function Logo({ className = '', iconSize = 40, textSize = 'text-[26px]', showText = true }: LogoProps) {
  const idBase = useId().replace(/:/g, '');
  const gradId = `leftArmGrad-${idBase}`;
  const shadowId = `dropShadow-${idBase}`;

  return (
    <div className={`flex items-center gap-3 shrink-0 ${className}`}>
      {/* Icon Container with gradient background */}
      <div 
        className="rounded-xl flex items-center justify-center relative overflow-hidden shadow-sm"
        style={{ 
          width: iconSize, 
          height: iconSize,
          background: 'linear-gradient(135deg, #E6781E 0%, #C23927 50%, #4A0E0E 100%)' 
        }}
      >
        <svg viewBox="0 0 32 32" fill="none" style={{ width: iconSize * 0.65, height: iconSize * 0.65 }} className="relative z-10">
          <defs>
            <linearGradient id={gradId} x1="4" y1="6" x2="20" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="-1" dy="0" stdDeviation="1" floodOpacity="0.2" />
            </filter>
          </defs>
          {/* Left Arm */}
          <path d="M 4 6 L 12 6 L 20 26 L 12 26 Z" fill={`url(#${gradId})`} />
          {/* Right Arm */}
          <path d="M 28 6 L 20 6 L 12 26 L 20 26 Z" fill="#FFFFFF" filter={`url(#${shadowId})`} />
        </svg>
      </div>
      
      {/* Text */}
      {showText && (
        <span className={`${textSize} font-black tracking-tighter text-[#1F1F1F]`}>
          VedaAI
        </span>
      )}
    </div>
  );
}
