import React from 'react';
import { DivisionTheme } from '../../types/tournament';

interface BlueSilverVineConnectorProps {
  hasTopWinner?: boolean;
  hasBottomWinner?: boolean;
  isSingle?: boolean;
  theme?: DivisionTheme;
  topWinnerName?: string;
  bottomWinnerName?: string;
}

export const BlueSilverVineConnector: React.FC<BlueSilverVineConnectorProps> = ({
  hasTopWinner = false,
  hasBottomWinner = false,
  isSingle = false,
  theme = 'ocean',
}) => {
  // Theme Color Configurations for Lam Ngan Thao Vines
  const vinePalette = {
    ocean: {
      baseStem: 'rgba(56, 189, 248, 0.35)',
      activeStem: 'url(#oceanVineGrad)',
      glowColor: '#38bdf8',
      coreGlow: '#e0f2fe',
      leafFill: '#38bdf8',
      leafActiveFill: '#ffffff',
      pulseColor: '#7dd3fc',
    },
    forest: {
      baseStem: 'rgba(52, 211, 153, 0.35)',
      activeStem: 'url(#forestVineGrad)',
      glowColor: '#34d399',
      coreGlow: '#a7f3d0',
      leafFill: '#34d399',
      leafActiveFill: '#ffffff',
      pulseColor: '#6ee7b7',
    },
    village: {
      baseStem: 'rgba(251, 191, 36, 0.35)',
      activeStem: 'url(#villageVineGrad)',
      glowColor: '#fbbf24',
      coreGlow: '#fef08a',
      leafFill: '#fbbf24',
      leafActiveFill: '#ffffff',
      pulseColor: '#fde047',
    },
  }[theme] || {
    baseStem: 'rgba(56, 189, 248, 0.35)',
    activeStem: 'url(#oceanVineGrad)',
    glowColor: '#38bdf8',
    coreGlow: '#e0f2fe',
    leafFill: '#38bdf8',
    leafActiveFill: '#ffffff',
    pulseColor: '#7dd3fc',
  };

  const isAnyWinner = hasTopWinner || hasBottomWinner;

  if (isSingle) {
    // Single straight horizontal vine for odd matches / finals
    return (
      <div className="hidden sm:block absolute top-1/2 -right-10 sm:-right-16 w-10 sm:w-16 h-8 -translate-y-1/2 pointer-events-none select-none z-10">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 64 32" fill="none">
          <defs>
            <linearGradient id="singleVineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={vinePalette.glowColor} stopOpacity="0.8" />
              <stop offset="50%" stopColor={vinePalette.coreGlow} stopOpacity="1" />
              <stop offset="100%" stopColor={vinePalette.glowColor} stopOpacity="0.9" />
            </linearGradient>
            <filter id="vineGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Outer Glow */}
          {hasTopWinner && (
            <path
              d="M 0,16 Q 32,16 64,16"
              stroke={vinePalette.glowColor}
              strokeWidth="6"
              strokeOpacity="0.4"
              filter="url(#vineGlow)"
            />
          )}

          {/* Main Stem Vine */}
          <path
            d="M 0,16 Q 32,16 64,16"
            stroke={hasTopWinner ? 'url(#singleVineGrad)' : vinePalette.baseStem}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Inner Light Pulse Flow */}
          {hasTopWinner && (
            <path
              d="M 0,16 Q 32,16 64,16"
              stroke={vinePalette.coreGlow}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="8 6"
              className="animate-pulse"
            />
          )}

          {/* Leaf 1 */}
          <path
            d="M 28,16 C 26,10 36,9 34,16 C 36,12 28,12 28,16"
            fill={hasTopWinner ? vinePalette.leafActiveFill : vinePalette.leafFill}
            opacity={hasTopWinner ? 0.95 : 0.4}
          />
          {/* Leaf 2 */}
          <path
            d="M 44,16 C 42,22 52,23 50,16 C 52,20 44,20 44,16"
            fill={hasTopWinner ? vinePalette.leafActiveFill : vinePalette.leafFill}
            opacity={hasTopWinner ? 0.95 : 0.4}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="hidden sm:block absolute top-0 -right-10 sm:-right-16 w-10 sm:w-16 h-full pointer-events-none select-none z-10">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 64 100" preserveAspectRatio="none" fill="none">
        <defs>
          <linearGradient id="oceanVineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="75%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="forestVineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#34d399" stopOpacity="1" />
            <stop offset="75%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="villageVineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="75%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0.95" />
          </linearGradient>

          <filter id="vineGlowMulti" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. TOP BRANCH VINE */}
        {/* Glow Layer if winner */}
        {hasTopWinner && (
          <path
            d="M 0,22 C 28,22 36,50 64,50"
            stroke={vinePalette.glowColor}
            strokeWidth="6"
            strokeOpacity="0.35"
            vectorEffect="non-scaling-stroke"
            filter="url(#vineGlowMulti)"
          />
        )}
        {/* Main Stem */}
        <path
          d="M 0,22 C 28,22 36,50 64,50"
          stroke={hasTopWinner ? vinePalette.activeStem : vinePalette.baseStem}
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Inner Light Core Pulse */}
        {hasTopWinner && (
          <path
            d="M 0,22 C 28,22 36,50 64,50"
            stroke={vinePalette.coreGlow}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="6 5"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* 2. BOTTOM BRANCH VINE */}
        {/* Glow Layer if winner */}
        {hasBottomWinner && (
          <path
            d="M 0,78 C 28,78 36,50 64,50"
            stroke={vinePalette.glowColor}
            strokeWidth="6"
            strokeOpacity="0.35"
            vectorEffect="non-scaling-stroke"
            filter="url(#vineGlowMulti)"
          />
        )}
        {/* Main Stem */}
        <path
          d="M 0,78 C 28,78 36,50 64,50"
          stroke={hasBottomWinner ? vinePalette.activeStem : vinePalette.baseStem}
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Inner Light Core Pulse */}
        {hasBottomWinner && (
          <path
            d="M 0,78 C 28,78 36,50 64,50"
            stroke={vinePalette.coreGlow}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="6 5"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* 3. SPIRITUAL LEAF NODES (Lá Lam Ngân Thảo Mọc Dọc Thân Dây Leo) */}
        {/* Leaf 1 on Top Branch */}
        <g transform="translate(18, 22)">
          <path
            d="M 0,0 C -4,-8 8,-9 4,0 C 8,-4 0,-4 0,0"
            fill={hasTopWinner ? vinePalette.leafActiveFill : vinePalette.leafFill}
            opacity={hasTopWinner ? 0.95 : 0.45}
          />
        </g>

        {/* Leaf 2 on Bottom Branch */}
        <g transform="translate(18, 78)">
          <path
            d="M 0,0 C -4,8 8,9 4,0 C 8,4 0,4 0,0"
            fill={hasBottomWinner ? vinePalette.leafActiveFill : vinePalette.leafFill}
            opacity={hasBottomWinner ? 0.95 : 0.45}
          />
        </g>

        {/* Leaf 3 at Convergence Node */}
        <g transform="translate(42, 50)">
          <path
            d="M 0,0 C 2,-7 11,-5 5,0 C 9,-3 2,-2 0,0"
            fill={isAnyWinner ? vinePalette.leafActiveFill : vinePalette.leafFill}
            opacity={isAnyWinner ? 0.95 : 0.45}
          />
          <circle
            cx="0"
            cy="0"
            r="3"
            fill={isAnyWinner ? vinePalette.coreGlow : vinePalette.leafFill}
            opacity={isAnyWinner ? 0.9 : 0.4}
          />
        </g>
      </svg>
    </div>
  );
};
