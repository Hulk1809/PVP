import React, { useRef, useState, useEffect } from 'react';
import { Swords } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
}

type Phase = 'loop' | 'action' | 'flash' | 'done';

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [phase, setPhase] = useState<Phase>('loop');
  const loopRef = useRef<HTMLVideoElement>(null);
  const actionRef = useRef<HTMLVideoElement>(null);
  const calledRef = useRef(false);
  const flashTriggeredRef = useRef(false);
  const finishTimerRef = useRef<number | null>(null);

  // Preload the action video silently so it's ready
  useEffect(() => {
    if (loopRef.current) {
      loopRef.current.load();
    }
    if (actionRef.current) {
      actionRef.current.load();
    }

    return () => {
      if (finishTimerRef.current !== null) {
        window.clearTimeout(finishTimerRef.current);
      }
    };
  }, []);

  const handleEnter = () => {
    if (phase !== 'loop') return;

    flashTriggeredRef.current = false;
    setPhase('action');

    if (loopRef.current) {
      loopRef.current.pause();
    }

    const vid = actionRef.current;
    if (!vid) { finish(); return; }

    vid.currentTime = 0;
    vid.play().catch(() => {});

    // Trigger impact flash near the end of the action clip.
    const onTimeUpdate = () => {
      if (flashTriggeredRef.current) return;
      if (!vid.duration || Number.isNaN(vid.duration)) return;

      const impactMoment = Math.max(vid.duration - 0.9, vid.duration * 0.86);
      if (vid.currentTime >= impactMoment) {
        flashTriggeredRef.current = true;
        setPhase('flash');
        finishTimerRef.current = window.setTimeout(finish, 650);
      }
    };

    // Listen for video end as a fallback.
    const onEnded = () => {
      if (!flashTriggeredRef.current) {
        flashTriggeredRef.current = true;
        setPhase('flash');
        finishTimerRef.current = window.setTimeout(finish, 650);
      }
    };

    vid.addEventListener('timeupdate', onTimeUpdate);
    vid.addEventListener('ended', onEnded);

    // Safety fallback: if the clip stalls, force the transition.
    finishTimerRef.current = window.setTimeout(() => {
      if (!calledRef.current) {
        vid.removeEventListener('timeupdate', onTimeUpdate);
        vid.removeEventListener('ended', onEnded);
        finish();
      }
    }, 20000);
  };

  const finish = () => {
    if (calledRef.current) return;
    calledRef.current = true;
    setPhase('done');
    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
    setTimeout(onEnter, 400);
  };

  return (
    <>
      <style>{`
        @keyframes splashFadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes flashIn {
          0%   { opacity: 0; }
          25%  { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes titleFloat {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-6px); }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 24px 4px rgba(251,191,36,0.35), 0 0 60px 10px rgba(251,191,36,0.1); }
          50%     { box-shadow: 0 0 44px 8px rgba(251,191,36,0.65), 0 0 100px 20px rgba(251,191,36,0.25); }
        }
        @keyframes sceneShake {
          0%,100% { transform: translate3d(0,0,0) scale(1.04); }
          10% { transform: translate3d(-2px, 1px, 0) scale(1.045); }
          20% { transform: translate3d(3px, -2px, 0) scale(1.05); }
          30% { transform: translate3d(-4px, 2px, 0) scale(1.052); }
          40% { transform: translate3d(4px, -1px, 0) scale(1.056); }
          50% { transform: translate3d(-2px, 2px, 0) scale(1.06); }
          60% { transform: translate3d(2px, -2px, 0) scale(1.058); }
          70% { transform: translate3d(-1px, 1px, 0) scale(1.055); }
          80% { transform: translate3d(1px, -1px, 0) scale(1.05); }
          90% { transform: translate3d(0, 0, 0) scale(1.045); }
        }
        @keyframes impactGlow {
          0% { opacity: 0; transform: scale(0.95); }
          25% { opacity: 1; transform: scale(1); }
          100% { opacity: 0.85; transform: scale(1.04); }
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes hintPulse {
          0%,100% { transform: translateY(0); opacity: 0.92; }
          50% { transform: translateY(-2px); opacity: 1; }
        }
        .splash-title  { animation: titleFloat 3s ease-in-out infinite, fadeInUp 0.7s 0.1s both; }
        .splash-sub    { animation: fadeInUp 0.7s 0.3s both; }
        .splash-badges { animation: fadeInUp 0.7s 0.5s both; }
        .splash-btn    { animation: glowPulse 2s ease-in-out infinite, fadeInUp 0.7s 0.7s both; }
        .splash-hint   { animation: hintPulse 1.8s ease-in-out infinite; }
      `}</style>

      {/* === OUTER WRAPPER — fades out when done === */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        overflow: 'hidden',
        animation: phase === 'done' ? 'splashFadeOut 0.4s ease forwards' : undefined,
        pointerEvents: phase === 'done' ? 'none' : 'auto',
      }}>

        {/* ─── VIDEO 1: LOOP (idle stance) ─── */}
        <video
          ref={loopRef}
          autoPlay muted loop playsInline preload="auto"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: phase === 'loop' ? 1 : 0,
            transform: 'scale(1.04)',
            transition: 'opacity 0.2s, transform 0.25s',
            zIndex: 0,
          }}
        >
          <source src="/assets/splash-loop.mp4" type="video/mp4" />
        </video>

        {/* ─── VIDEO 2: ACTION (fly & clash) ─── */}
        <video
          ref={actionRef}
          muted playsInline preload="auto"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: phase === 'action' || phase === 'flash' || phase === 'done' ? 1 : 0,
            transform: phase === 'action' || phase === 'flash' ? 'scale(1.06)' : 'scale(1.02)',
            animation: phase === 'action' ? 'sceneShake 1.3s ease-out both' : undefined,
            transition: 'opacity 0.18s, transform 0.2s, filter 0.2s',
            zIndex: 1,
          }}
        >
          <source src="/assets/splash-action.mp4" type="video/mp4" />
        </video>

        {/* ─── WHITE FLASH on impact ─── */}
        {phase === 'flash' && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(255,244,214,0.96) 18%, rgba(251,191,36,0.65) 42%, rgba(0,0,0,0) 74%)',
            animation: 'impactGlow 0.65s ease forwards',
            zIndex: 10,
            mixBlendMode: 'screen',
          }} />
        )}

        {/* ─── DARK OVERLAY + UI (only during loop phase) ─── */}
        {phase === 'loop' && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end',
            paddingBottom: '8vh',
          }}>

            {/* Logo icon */}
            <div style={{
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              width:'64px', height:'64px', borderRadius:'16px',
              background:'linear-gradient(135deg,#f59e0b,#d97706)',
              marginBottom:'1rem',
              boxShadow:'0 0 30px rgba(245,158,11,0.5)',
              animation:'fadeInUp 0.7s ease both',
            }}>
              <Swords style={{ width:'30px', height:'30px', color:'#0a0a0f' }} />
            </div>

            {/* Title */}
            <h1 className="splash-title" style={{
              fontSize: 'clamp(1.8rem,5vw,3rem)',
              fontWeight: 900, color: '#fff',
              letterSpacing: '-0.02em',
              marginBottom: '0.3rem', lineHeight: 1.1,
              fontFamily: '"Montserrat","Be Vietnam Pro",sans-serif',
              textShadow: '0 2px 20px rgba(0,0,0,0.8)',
              textAlign: 'center',
            }}>
              TÔNG MÔN TRANH BÁ
            </h1>

            <p className="splash-sub splash-hint" style={{
              fontSize: '0.78rem', color: '#cbd5e1',
              letterSpacing: '0.25em', fontFamily: 'monospace',
              marginBottom: '1.2rem', textTransform: 'uppercase',
              textShadow: '0 1px 8px rgba(0,0,0,0.8)',
            }}>
              Soul Land Esports Platform • PVP 2026
            </p>

            {/* Division badges */}
            <div className="splash-badges" style={{
              display:'inline-flex', gap:'8px', marginBottom:'1.8rem',
            }}>
              {['⚔️ Bảng A','🌲 Bảng B','🔥 Bảng C'].map((b) => (
                <span key={b} style={{
                  padding:'4px 12px', borderRadius:'999px',
                  background:'rgba(245,158,11,0.15)',
                  border:'1px solid rgba(245,158,11,0.4)',
                  color:'#fbbf24', fontSize:'0.72rem', fontWeight:600,
                  backdropFilter:'blur(4px)',
                }}>{b}</span>
              ))}
            </div>

            {/* CTA Button */}
            <button
              className="splash-btn"
              onClick={handleEnter}
              style={{
                display:'inline-flex', alignItems:'center', gap:'10px',
                padding:'15px 46px', borderRadius:'14px',
                background:'linear-gradient(135deg,#f59e0b,#d97706)',
                color:'#0a0a0f', fontSize:'1.05rem', fontWeight:800,
                border:'none', cursor:'pointer',
                letterSpacing:'0.06em',
                fontFamily:'"Montserrat",sans-serif',
                transition:'transform 0.12s, filter 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.15)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)';
              }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            >
              <Swords style={{ width:'18px', height:'18px' }} />
              BẮT ĐẦU
            </button>

          </div>
        )}

      </div>
    </>
  );
};
