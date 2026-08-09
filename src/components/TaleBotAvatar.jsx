import React from 'react';

export default function TaleBotAvatar({
  size = 80,
  angle = 0,
  ledColor = '#10B981',
  hasWings = false,
  hasArms = false,
  isDancing = false
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `rotate(${angle}deg)`,
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative'
      }}
      className={isDancing ? 'animated-robot' : ''}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0px 8px 16px rgba(255, 150, 0, 0.4))' }}
      >
        {/* Direction Nose Pointer (Front Blue Arrow) */}
        <polygon points="60,6 52,18 68,18" fill="#00A3FF" stroke="#FFFFFF" strokeWidth="2" />

        {/* Outer Shadow & Base Wheels */}
        <rect x="25" y="96" width="16" height="14" rx="6" fill="#D97706" />
        <rect x="79" y="96" width="16" height="14" rx="6" fill="#D97706" />

        {/* Clip-on Wings (If active) */}
        {hasWings && (
          <g>
            {/* Left Wing */}
            <path d="M 22 55 Q 2 30 10 70 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
            {/* Right Wing */}
            <path d="M 98 55 Q 118 30 110 70 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
          </g>
        )}

        {/* Clip-on Robot Arms (If active) */}
        {hasArms && (
          <g>
            {/* Left Arm */}
            <rect x="8" y="55" width="16" height="12" rx="4" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />
            {/* Right Arm */}
            <rect x="96" y="55" width="16" height="12" rx="4" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />
          </g>
        )}

        {/* TaleBot Pro Cylinder Main Body */}
        <rect x="24" y="20" width="72" height="84" rx="36" fill="url(#bodyGradient)" stroke="#FFFFFF" strokeWidth="4" />

        {/* Top Head LED Light Ring (Hardware LEDs) */}
        <ellipse cx="60" cy="30" rx="24" ry="7" fill={ledColor} style={{ filter: `drop-shadow(0 0 8px ${ledColor})` }} />
        <ellipse cx="60" cy="30" rx="18" ry="4" fill="#FFFFFF" opacity="0.6" />

        {/* Dark Visor Faceplate */}
        <rect x="34" y="44" width="52" height="34" rx="16" fill="#0F172A" stroke="#334155" strokeWidth="2" />

        {/* Glowing Expressive Eyes */}
        <circle cx="48" cy="61" r="7" fill="#00E5FF" style={{ filter: 'drop-shadow(0 0 6px #00E5FF)' }} />
        <circle cx="72" cy="61" r="7" fill="#00E5FF" style={{ filter: 'drop-shadow(0 0 6px #00E5FF)' }} />

        {/* Eye Shine Highlights */}
        <circle cx="50" cy="59" r="2.5" fill="#FFFFFF" />
        <circle cx="74" cy="59" r="2.5" fill="#FFFFFF" />

        {/* Cute Smile Curve */}
        <path d="M 54 72 Q 60 76 66 72" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />

        {/* TaleBot Pro Body Badge Logo */}
        <circle cx="60" cy="89" r="6" fill="#00A3FF" />
        <path d="M 57 89 L 63 89" stroke="#FFFFFF" strokeWidth="2" />

        {/* Definitions for Gradients */}
        <defs>
          <linearGradient id="bodyGradient" x1="24" y1="20" x2="96" y2="104" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD166" />
            <stop offset="0.5" stopColor="#FFB703" />
            <stop offset="1" stopColor="#FB8500" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
