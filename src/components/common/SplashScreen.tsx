import React, { useState } from 'react';
import { Swords } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [isFading, setIsFading] = useState(false);

  const handleEnter = () => {
    setIsFading(true);
    setTimeout(onEnter, 350);
  };

  return (
    <>
      <style>{`
        @keyframes splashFadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes titleFloat {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-6px); }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 20px 2px rgba(251,191,36,0.3), 0 0 50px 8px rgba(251,191,36,0.1); }
          50%     { box-shadow: 0 0 35px 6px rgba(251,191,36,0.6), 0 0 80px 16px rgba(251,191,36,0.2); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .splash-title  { animation: titleFloat 3s ease-in-out infinite, fadeInUp 0.7s 0.1s both; }
        .splash-sub    { animation: fadeInUp 0.7s 0.3s both; }
        .splash-badges { animation: fadeInUp 0.7s 0.5s both; }
        .splash-btn    { animation: glowPulse 2s ease-in-out infinite, fadeInUp 0.7s 0.7s both; }
      `}</style>

      {/* Wrapper */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          overflow: 'hidden',
          animation: isFading ? 'splashFadeOut 0.35s ease forwards' : undefined,
          pointerEvents: isFading ? 'none' : 'auto',
        }}
      >
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src="/assets/bg-video.mp4" type="video/mp4" />
        </video>

        {/* Soft dark gradient at bottom for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)',
            zIndex: 1,
          }}
        />

        {/* Center UI Content */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: '9vh',
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
              borderRadius: '16px',
              background: 'linear-gradient(135deg,#f59e0b,#d97706)',
              marginBottom: '1rem',
              boxShadow: '0 0 30px rgba(245,158,11,0.5)',
              animation: 'fadeInUp 0.7s ease both',
            }}
          >
            <Swords style={{ width: '30px', height: '30px', color: '#0a0a0f' }} />
          </div>

          {/* Title */}
          <h1
            className="splash-title"
            style={{
              fontSize: 'clamp(1.8rem,5vw,3rem)',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-0.02em',
              marginBottom: '0.3rem',
              lineHeight: 1.1,
              fontFamily: '"Montserrat","Be Vietnam Pro",sans-serif',
              textShadow: '0 2px 20px rgba(0,0,0,0.8)',
              textAlign: 'center',
            }}
          >
            TÔNG MÔN TRANH BÁ
          </h1>

          <p
            className="splash-sub"
            style={{
              fontSize: '0.78rem',
              color: '#cbd5e1',
              letterSpacing: '0.25em',
              fontFamily: 'monospace',
              marginBottom: '1.2rem',
              textTransform: 'uppercase',
              textShadow: '0 1px 8px rgba(0,0,0,0.8)',
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
              marginBottom: '1.8rem',
            }}
          >
            {['⚔️ Bảng A', '🌲 Bảng B', '🔥 Bảng C'].map((b) => (
              <span
                key={b}
                style={{
                  padding: '4px 14px',
                  borderRadius: '999px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(245,158,11,0.4)',
                  color: '#fbbf24',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)',
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
              padding: '15px 48px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.9), rgba(217,119,6,0.9))',
              color: '#0a0a0f',
              fontSize: '1.05rem',
              fontWeight: 900,
              border: '1px solid rgba(251,191,36,0.5)',
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
            <Swords style={{ width: '18px', height: '18px' }} />
            VÀO GIẢI ĐẤU
          </button>
        </div>
      </div>
    </>
  );
};
