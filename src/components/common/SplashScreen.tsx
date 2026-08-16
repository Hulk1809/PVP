import React, { useState } from 'react';

interface SplashScreenProps {
  onStartEnter?: () => void;
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStartEnter, onEnter }) => {
  const [isFading, setIsFading] = useState(false);

  const handleEnter = () => {
    setIsFading(true);
    if (onStartEnter) {
      onStartEnter();
    }
    setTimeout(onEnter, 850);
  };

  return (
    <>
      <style>{`
        @keyframes titleFloat {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes glassGlow {
          0%, 100% { 
            box-shadow: 0 0 20px 2px rgba(251,191,36,0.2), 0 0 45px 6px rgba(0,0,0,0.5);
            border-color: rgba(251,191,36,0.35);
          }
          50% { 
            box-shadow: 0 0 35px 5px rgba(251,191,36,0.45), 0 0 60px 10px rgba(0,0,0,0.7);
            border-color: rgba(251,191,36,0.65);
          }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .splash-title { animation: titleFloat 3s ease-in-out infinite, fadeInUp 0.7s 0.1s both; }
        .splash-sub   { animation: fadeInUp 0.7s 0.25s both; }
        .splash-btn   { animation: glassGlow 2.5s ease-in-out infinite, fadeInUp 0.7s 0.4s both; }
      `}</style>

      {/* Cinematic Vignette Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: '11vh',
          background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.92) 100%)',
          backdropFilter: 'blur(1px)',
          opacity: isFading ? 0 : 1,
          transform: isFading ? 'scale(1.08)' : 'scale(1)',
          transition: 'opacity 0.85s cubic-bezier(0.4, 0, 0.2, 1), transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)',
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
          {/* Title */}
          <h1
            className="splash-title"
            style={{
              fontSize: 'clamp(2.2rem, 6.5vw, 3.8rem)',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-0.02em',
              marginBottom: '0.4rem',
              lineHeight: 1.1,
              fontFamily: '"Montserrat","Be Vietnam Pro",sans-serif',
              textShadow: '0 4px 30px rgba(0,0,0,0.95), 0 0 25px rgba(251,191,36,0.35)',
            }}
          >
            TÔNG MÔN TRANH BÁ
          </h1>

          {/* Subtitle */}
          <p
            className="splash-sub"
            style={{
              fontSize: '0.82rem',
              color: '#e2e8f0',
              letterSpacing: '0.28em',
              fontFamily: 'monospace',
              marginBottom: '2.4rem',
              textTransform: 'uppercase',
              textShadow: '0 2px 10px rgba(0,0,0,0.9)',
            }}
          >
            Soul Land Esports Platform • PVP 2026
          </p>

          {/* Transparent Glass "BẮT ĐẦU" Button */}
          <button
            className="splash-btn"
            onClick={handleEnter}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 56px',
              borderRadius: '16px',
              background: 'rgba(0, 0, 0, 0.35)',
              color: '#fbbf24',
              fontSize: '1.1rem',
              fontWeight: 800,
              border: '1.5px solid rgba(251,191,36,0.4)',
              cursor: 'pointer',
              letterSpacing: '0.12em',
              fontFamily: '"Montserrat",sans-serif',
              backdropFilter: 'blur(12px)',
              transition: 'transform 0.2s ease, background 0.2s ease, border-color 0.2s ease, filter 0.2s ease',
              textShadow: '0 0 12px rgba(251,191,36,0.5)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(251,191,36,0.18)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(251,191,36,0.85)';
              (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0, 0, 0, 0.35)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(251,191,36,0.4)';
              (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)';
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            }}
          >
            BẮT ĐẦU
          </button>
        </div>
      </div>
    </>
  );
};
