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
        /* Soul Land Cinematic Title Floating & Breathing */
        @keyframes soulLandFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
            filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.7))
                    drop-shadow(0 0 45px rgba(245, 158, 11, 0.45))
                    drop-shadow(0 12px 28px rgba(0, 0, 0, 0.95));
          }
          50% {
            transform: translateY(-8px) scale(1.02);
            filter: drop-shadow(0 0 32px rgba(251, 191, 36, 0.95))
                    drop-shadow(0 0 70px rgba(234, 88, 12, 0.6))
                    drop-shadow(0 16px 35px rgba(0, 0, 0, 1));
          }
        }

        /* Continuous Metallic Gold Light Ray Sweep */
        @keyframes goldShineSweep {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        /* Soul Power Flare Pulse */
        @keyframes soulFlarePulse {
          0%, 100% {
            opacity: 0.6;
            transform: scaleX(1);
          }
          50% {
            opacity: 1;
            transform: scaleX(1.15);
          }
        }

        /* Glass Button Glow Pulse */
        @keyframes glassGlow {
          0%, 100% { 
            box-shadow: 0 0 20px 2px rgba(251,191,36,0.2), 0 0 45px 6px rgba(0,0,0,0.5);
            border-color: rgba(251,191,36,0.35);
          }
          50% { 
            box-shadow: 0 0 35px 5px rgba(251,191,36,0.5), 0 0 65px 12px rgba(234,88,12,0.3);
            border-color: rgba(251,191,36,0.75);
          }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .soul-land-title {
          background: linear-gradient(
            110deg,
            #d97706 0%,
            #fbbf24 18%,
            #ffffff 35%,
            #fef08a 42%,
            #f59e0b 55%,
            #ffffff 70%,
            #f59e0b 85%,
            #b45309 100%
          );
          background-size: 240% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: goldShineSweep 4.5s linear infinite, soulLandFloat 3.6s ease-in-out infinite, fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .soul-land-sub {
          animation: fadeInUp 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .soul-land-flair {
          animation: soulFlarePulse 3s ease-in-out infinite, fadeInUp 0.8s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .splash-btn {
          animation: glassGlow 2.5s ease-in-out infinite, fadeInUp 0.8s 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
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
            padding: '1.5rem',
            maxWidth: '900px',
            width: '100%',
          }}
        >
          {/* Top Soul Land Divine Line Flair */}
          <div
            className="soul-land-flair"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '0.6rem',
              width: '100%',
              maxWidth: '450px',
            }}
          >
            <div style={{ flex: 1, height: '1.5px', background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.85))' }} />
            <span style={{ color: '#fbbf24', fontSize: '0.85rem', textShadow: '0 0 10px rgba(251,191,36,0.9)' }}>✦</span>
            <span style={{ color: '#fef08a', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.3em', fontFamily: 'monospace', textTransform: 'uppercase', textShadow: '0 0 12px rgba(251,191,36,0.6)' }}>
              ĐẤU LA ĐẠI LỤC
            </span>
            <span style={{ color: '#fbbf24', fontSize: '0.85rem', textShadow: '0 0 10px rgba(251,191,36,0.9)' }}>✦</span>
            <div style={{ flex: 1, height: '1.5px', background: 'linear-gradient(90deg, rgba(251,191,36,0.85), transparent)' }} />
          </div>

          {/* Cinematic Epic Soul Land Title */}
          <h1
            className="soul-land-title"
            style={{
              fontSize: 'clamp(2.5rem, 7.5vw, 4.6rem)',
              fontWeight: 950,
              letterSpacing: '0.04em',
              marginBottom: '0.5rem',
              lineHeight: 1.1,
              fontFamily: '"Montserrat", "Cinzel", "Be Vietnam Pro", sans-serif',
              textTransform: 'uppercase',
              userSelect: 'none',
              padding: '0 10px',
            }}
          >
            TÔNG MÔN TRANH BÁ
          </h1>

          {/* Subtitle */}
          <p
            className="soul-land-sub"
            style={{
              fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
              color: '#f1f5f9',
              letterSpacing: '0.32em',
              fontFamily: 'monospace',
              marginBottom: '2.6rem',
              textTransform: 'uppercase',
              textShadow: '0 2px 14px rgba(0,0,0,0.95), 0 0 12px rgba(251,191,36,0.35)',
              fontWeight: 600,
            }}
          >
            SOUL LAND ESPORTS PLATFORM • PVP 2026
          </p>

          {/* Transparent Glass "BẮT ĐẦU" Button */}
          <button
            className="splash-btn"
            onClick={handleEnter}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 60px',
              borderRadius: '18px',
              background: 'rgba(0, 0, 0, 0.4)',
              color: '#fbbf24',
              fontSize: '1.15rem',
              fontWeight: 900,
              border: '1.5px solid rgba(251,191,36,0.45)',
              cursor: 'pointer',
              letterSpacing: '0.16em',
              fontFamily: '"Montserrat", sans-serif',
              backdropFilter: 'blur(14px)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              textShadow: '0 0 14px rgba(251,191,36,0.6)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = 'scale(1.06) translateY(-2px)';
              btn.style.background = 'rgba(251,191,36,0.2)';
              btn.style.borderColor = 'rgba(251,191,36,0.95)';
              btn.style.boxShadow = '0 0 35px rgba(251,191,36,0.6), 0 12px 35px rgba(0,0,0,0.6)';
              btn.style.filter = 'brightness(1.2)';
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = 'scale(1) translateY(0px)';
              btn.style.background = 'rgba(0, 0, 0, 0.4)';
              btn.style.borderColor = 'rgba(251,191,36,0.45)';
              btn.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
              btn.style.filter = 'brightness(1)';
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
