import React, { useState } from 'react';
import { Swords } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [isFading, setIsFading] = useState(false);

  const handleEnter = () => {
    setIsFading(true);
    setTimeout(onEnter, 800);
  };

  return (
    <>
      <style>{`
        @keyframes titleFloat {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 24px 3px rgba(251,191,36,0.35), 0 0 60px 10px rgba(251,191,36,0.15); }
          50%      { box-shadow: 0 0 40px 6px rgba(251,191,36,0.7), 0 0 90px 18px rgba(251,191,36,0.3); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .splash-title  { animation: titleFloat 3s ease-in-out infinite, fadeInUp 0.7s 0.1s both; }
        .splash-sub    { animation: fadeInUp 0.7s 0.3s both; }
        .splash-badges { animation: fadeInUp 0.7s 0.5s both; }
        .splash-btn    { animation: glowPulse 2s ease-in-out infinite, fadeInUp 0.7s 0.7s both; }
      `}</style>

      {/* Cinematic Vignette Overlay (Dark edges, clear glowing center, seamlessly reveals video) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: '9vh',
          background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.95) 100%)',
          backdropFilter: 'blur(1px)',
          opacity: isFading ? 0 : 1,
          transform: isFading ? 'scale(1.04)' : 'scale(1)',
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: isFading ? 'none' : 'auto',
        }}
      >
        {/* Center UI Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '1rem',
          }}
        >
          {/* Logo icon */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg,#f59e0b,#d97706)',
              marginBottom: '1.2rem',
              boxShadow: '0 0 35px rgba(245,158,11,0.6)',
              animation: 'fadeInUp 0.7s ease both',
            }}
          >
            <Swords style={{ width: '32px', height: '32px', color: '#0a0a0f' }} />
          </div>

          {/* Title */}
          <h1
            className="splash-title"
            style={{
              fontSize: 'clamp(2rem, 6vw, 3.4rem)',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-0.02em',
              marginBottom: '0.4rem',
              lineHeight: 1.1,
              fontFamily: '"Montserrat","Be Vietnam Pro",sans-serif',
              textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 0 20px rgba(251,191,36,0.4)',
            }}
          >
            TÔNG MÔN TRANH BÁ
          </h1>

          <p
            className="splash-sub"
            style={{
              fontSize: '0.8rem',
              color: '#e2e8f0',
              letterSpacing: '0.25em',
              fontFamily: 'monospace',
              marginBottom: '1.4rem',
              textTransform: 'uppercase',
              textShadow: '0 2px 10px rgba(0,0,0,0.9)',
            }}
          >
            Soul Land Esports Platform • PVP 2026
          </p>

          {/* Division badges */}
          <div
            className="splash-badges"
            style={{
              display: 'inline-flex',
              gap: '8px',
              marginBottom: '2rem',
            }}
          >
            {['⚔️ Bảng A', '🌲 Bảng B', '🔥 Bảng C'].map((b) => (
              <span
                key={b}
                style={{
                  padding: '5px 14px',
                  borderRadius: '999px',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(245,158,11,0.45)',
                  color: '#fbbf24',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                }}
              >
                {b}
              </span>
            ))}
          </div>

          {/* Transparent Glass CTA Button */}
          <button
            className="splash-btn"
            onClick={handleEnter}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 52px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.95), rgba(217,119,6,0.95))',
              color: '#0a0a0f',
              fontSize: '1.1rem',
              fontWeight: 900,
              border: '1px solid rgba(251,191,36,0.6)',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              fontFamily: '"Montserrat",sans-serif',
              backdropFilter: 'blur(8px)',
              transition: 'transform 0.15s, filter 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
              (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.15)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)';
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            }}
          >
            <Swords style={{ width: '20px', height: '20px' }} />
            VÀO GIẢI ĐẤU
          </button>
        </div>
      </div>
    </>
  );
};
