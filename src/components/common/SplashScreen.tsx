import React, { useEffect, useRef, useState } from 'react';
import { Swords } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
}

type Phase = 'idle' | 'done';

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const idleVideoRef = useRef<HTMLVideoElement>(null);
  const calledRef = useRef(false);
  const finishTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (idleVideoRef.current) {
      idleVideoRef.current.load();
    }

    return () => {
      if (finishTimerRef.current !== null) {
        window.clearTimeout(finishTimerRef.current);
      }
    };
  }, []);

  const finish = () => {
    if (calledRef.current) return;
    calledRef.current = true;
    setPhase('done');
    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
    setTimeout(onEnter, 180);
  };

  const handleEnter = () => {
    if (phase !== 'idle') return;
    finishTimerRef.current = window.setTimeout(finish, 80);
  };

  return (
    <>
      <style>{`
        @keyframes splashFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes titleFloat {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 24px 4px rgba(251,191,36,0.35), 0 0 60px 10px rgba(251,191,36,0.1); }
          50% { box-shadow: 0 0 44px 8px rgba(251,191,36,0.65), 0 0 100px 20px rgba(251,191,36,0.25); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes hintPulse {
          0%,100% { transform: translateY(0); opacity: 0.92; }
          50% { transform: translateY(-2px); opacity: 1; }
        }
        .splash-title { animation: titleFloat 3s ease-in-out infinite, fadeInUp 0.7s 0.1s both; }
        .splash-sub { animation: fadeInUp 0.7s 0.3s both; }
        .splash-badges { animation: fadeInUp 0.7s 0.5s both; }
        .splash-btn { animation: glowPulse 2s ease-in-out infinite, fadeInUp 0.7s 0.7s both; }
        .splash-hint { animation: hintPulse 1.8s ease-in-out infinite; }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          overflow: 'hidden',
          background: '#050608',
          animation: phase === 'done' ? 'splashFadeOut 0.35s ease forwards' : undefined,
          pointerEvents: phase === 'done' ? 'none' : 'auto',
        }}
      >
        <video
          ref={idleVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/poster_a.jpg"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.03)',
            zIndex: 0,
            filter: 'saturate(0.95) contrast(1.08) brightness(0.74)',
          }}
        >
          <source src="/assets/bg-video.mp4" type="video/mp4" />
        </video>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.18) 100%)',
            pointerEvents: 'none',
          }}
        />

        {phase === 'idle' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 5,
              background: 'linear-gradient(to top, rgba(0,0,0,0.24) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.02) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: '8vh',
            }}
          >
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
                boxShadow: '0 0 22px rgba(245,158,11,0.35)',
                animation: 'fadeInUp 0.7s ease both',
              }}
            >
              <Swords style={{ width: '30px', height: '30px', color: '#0a0a0f' }} />
            </div>

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
              className="splash-sub splash-hint"
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

            <div
              className="splash-badges"
              style={{
                display: 'inline-flex',
                gap: '8px',
                marginBottom: '1.8rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {['⚔️ Bảng A', '🌲 Bảng B', '🔥 Bảng C'].map((b) => (
                <span
                  key={b}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: 'rgba(245,158,11,0.15)',
                    border: '1px solid rgba(245,158,11,0.4)',
                    color: '#fbbf24',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {b}
                </span>
              ))}
            </div>

            <button
              className="splash-btn"
              onClick={handleEnter}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px 46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                color: '#0a0a0f',
                fontSize: '1.05rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.06em',
                fontFamily: '"Montserrat",sans-serif',
                transition: 'transform 0.12s, filter 0.15s',
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
              BẮT ĐẦU
            </button>
          </div>
        )}
      </div>
    </>
  );
};
