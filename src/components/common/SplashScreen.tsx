import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onStartEnter?: () => void;
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStartEnter, onEnter }) => {
  const [isFading, setIsFading] = useState(false);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number; size: number; delay: number; dur: number }[]>([]);

  useEffect(() => {
    // Generate floating soul energy sparks around title
    const pts = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: 25 + Math.random() * 50,
      y: 30 + Math.random() * 40,
      size: Math.random() * 3 + 1.5,
      delay: Math.random() * 3,
      dur: Math.random() * 2 + 2,
    }));
    setSparks(pts);
  }, []);

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
        /* Soul Land Platinum Silver Title Floating & Breathing Aura */
        @keyframes soulLandTitleFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
            filter: drop-shadow(0 0 16px rgba(255, 255, 255, 0.85))
                    drop-shadow(0 0 40px rgba(148, 163, 184, 0.6))
                    drop-shadow(0 12px 24px rgba(0, 0, 0, 0.95));
          }
          50% {
            transform: translateY(-6px) scale(1.02);
            filter: drop-shadow(0 0 28px rgba(255, 255, 255, 1))
                    drop-shadow(0 0 65px rgba(203, 213, 225, 0.85))
                    drop-shadow(0 0 95px rgba(148, 163, 184, 0.5))
                    drop-shadow(0 16px 30px rgba(0, 0, 0, 1));
          }
        }

        /* Continuous Platinum Sword Blade Glint Sweep */
        @keyframes silverGlintSweep {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        /* Soul Power Electric Pulse */
        @keyframes electricPulse {
          0%, 100% {
            opacity: 0.5;
            transform: scaleX(1);
          }
          50% {
            opacity: 1;
            transform: scaleX(1.15);
          }
        }

        /* Floating Silver Spark Embers */
        @keyframes sparkRise {
          0% {
            transform: translateY(0px) scale(0.6);
            opacity: 0;
          }
          30% {
            opacity: 0.9;
          }
          80% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-45px) scale(1.2);
            opacity: 0;
          }
        }

        /* Glass Button Pulse */
        @keyframes glassButtonGlow {
          0%, 100% { 
            box-shadow: 0 0 18px 2px rgba(255, 255, 255, 0.2), 0 0 40px 6px rgba(0,0,0,0.5);
            border-color: rgba(255, 255, 255, 0.4);
          }
          50% { 
            box-shadow: 0 0 32px 5px rgba(255, 255, 255, 0.55), 0 0 55px 10px rgba(203, 213, 225, 0.3);
            border-color: rgba(255, 255, 255, 0.85);
          }
        }

        @keyframes fadeInUpCinematic {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .soul-land-cinematic-title {
          font-family: 'Playfair Display', 'Cinzel Decorative', 'Philosopher', serif;
          font-weight: 900;
          font-style: italic;
          background: linear-gradient(
            110deg,
            #64748b 0%,
            #94a3b8 15%,
            #cbd5e1 30%,
            #ffffff 45%,
            #f8fafc 55%,
            #cbd5e1 70%,
            #94a3b8 85%,
            #475569 100%
          );
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          -webkit-text-stroke: 1.2px rgba(255, 255, 255, 0.95);
          animation: silverGlintSweep 4.5s linear infinite, soulLandTitleFloat 3.8s ease-in-out infinite, fadeInUpCinematic 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .soul-land-wing-line {
          animation: electricPulse 3.2s ease-in-out infinite, fadeInUpCinematic 0.8s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .soul-land-sub-text {
          animation: fadeInUpCinematic 0.85s 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .soul-land-btn {
          animation: glassButtonGlow 2.5s ease-in-out infinite, fadeInUpCinematic 0.85s 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      {/* Cinematic Vignette Overlay (Always vertically centered on all devices) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.92) 100%)',
          backdropFilter: 'blur(1px)',
          opacity: isFading ? 0 : 1,
          transform: isFading ? 'scale(1.08)' : 'scale(1)',
          transition: 'opacity 0.85s cubic-bezier(0.4, 0, 0.2, 1), transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: isFading ? 'none' : 'auto',
          overflow: 'hidden',
        }}
      >
        {/* Floating Soul Energy Sparks */}
        {sparks.map((s) => (
          <div
            key={s.id}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: `0 0 ${s.size * 3}px ${s.size}px rgba(255,255,255,0.9)`,
              animation: `sparkRise ${s.dur}s ${s.delay}s ease-in-out infinite`,
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        ))}

        {/* Center UI Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0.5rem 1rem',
            maxWidth: '900px',
            width: '100%',
          }}
        >
          {/* Top Movie Header Wing Badge */}
          <div
            className="soul-land-wing-line"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '0.4rem',
              width: '100%',
              maxWidth: '420px',
            }}
          >
            <div style={{ flex: 1, height: '1.5px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9))' }} />
            <span style={{ color: '#ffffff', fontSize: '0.8rem', textShadow: '0 0 10px rgba(255,255,255,0.9)' }}>❖</span>
            <span
              style={{
                color: '#f8fafc',
                fontSize: 'clamp(0.72rem, 1.5vw, 0.85rem)',
                fontWeight: 900,
                letterSpacing: '0.22em',
                fontFamily: '"Playfair Display", "Philosopher", "Cormorant Garamond", serif',
                fontStyle: 'italic',
                textTransform: 'uppercase',
                textShadow: '0 0 14px rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              斗罗大陆 • ĐẤU LA ĐẠI LỤC
            </span>
            <span style={{ color: '#ffffff', fontSize: '0.8rem', textShadow: '0 0 10px rgba(255,255,255,0.9)' }}>❖</span>
            <div style={{ flex: 1, height: '1.5px', background: 'linear-gradient(90deg, rgba(255,255,255,0.9), transparent)' }} />
          </div>

          {/* Cinematic Epic Movie Title: TÔNG MÔN TRANH BÁ (Platinum Silver) */}
          <h1
            className="soul-land-cinematic-title"
            style={{
              fontSize: 'clamp(1.6rem, 5.8vw, 3.8rem)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              marginBottom: '0.35rem',
              lineHeight: 1.15,
              textTransform: 'uppercase',
              userSelect: 'none',
              padding: '0 8px',
              whiteSpace: 'nowrap',
            }}
          >
            TÔNG MÔN TRANH BÁ
          </h1>

          {/* Tagline Subtitle */}
          <p
            className="soul-land-sub-text"
            style={{
              fontSize: 'clamp(0.68rem, 1.5vw, 0.82rem)',
              color: '#f8fafc',
              letterSpacing: '0.28em',
              fontFamily: 'monospace',
              marginBottom: '1.4rem',
              textTransform: 'uppercase',
              textShadow: '0 2px 12px rgba(0,0,0,0.95), 0 0 10px rgba(255,255,255,0.5)',
              fontWeight: 700,
            }}
          >
            SOUL LAND ESPORTS PLATFORM • PVP 2026
          </p>

          {/* Transparent Glass "BẮT ĐẦU" Button */}
          <button
            className="soul-land-btn"
            onClick={handleEnter}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 52px',
              borderRadius: '16px',
              background: 'rgba(0, 0, 0, 0.45)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 900,
              border: '1.5px solid rgba(255, 255, 255, 0.45)',
              cursor: 'pointer',
              letterSpacing: '0.16em',
              fontFamily: '"Montserrat", sans-serif',
              backdropFilter: 'blur(14px)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              textShadow: '0 0 14px rgba(255,255,255,0.8)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = 'scale(1.06) translateY(-2px)';
              btn.style.background = 'rgba(255,255,255,0.2)';
              btn.style.borderColor = 'rgba(255,255,255,0.95)';
              btn.style.boxShadow = '0 0 35px rgba(255,255,255,0.7), 0 12px 35px rgba(0,0,0,0.6)';
              btn.style.filter = 'brightness(1.2)';
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = 'scale(1) translateY(0px)';
              btn.style.background = 'rgba(0, 0, 0, 0.45)';
              btn.style.borderColor = 'rgba(255,255,255,0.45)';
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
