import React, { useEffect, useState, useRef } from 'react';
import { Swords } from 'lucide-react';

type Phase = 'idle' | 'rushing' | 'impact' | 'fadeout';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number; color: string }[]>([]);
  const doneRef = useRef(false);

  useEffect(() => {
    const pts = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      color: ['rgba(251,191,36,0.9)', 'rgba(139,92,246,0.8)', 'rgba(6,182,212,0.7)', 'rgba(236,72,153,0.8)'][i % 4],
    }));
    setParticles(pts);
  }, []);

  const handleEnter = () => {
    if (phase !== 'idle') return;

    // Phase 1: Rush toward center
    setPhase('rushing');

    // Phase 2: Impact flash after 700ms
    setTimeout(() => {
      setPhase('impact');
    }, 700);

    // Phase 3: Fade out after impact
    setTimeout(() => {
      setPhase('fadeout');
    }, 1100);

    // Phase 4: Call onEnter to show main app
    setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onEnter();
      }
    }, 1700);
  };

  const isIdle = phase === 'idle';
  const isRushing = phase === 'rushing';
  const isImpact = phase === 'impact';
  const isFadeout = phase === 'fadeout';

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0)    scale(1);   opacity: 0.7; }
          50%  { transform: translateY(-18px) scale(1.1); opacity: 1; }
          100% { transform: translateY(0)    scale(1);   opacity: 0.7; }
        }
        @keyframes idleFloat {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes idleFloatR {
          0%, 100% { transform: translateY(0px) scaleX(-1) rotate(1deg); }
          50%       { transform: translateY(-10px) scaleX(-1) rotate(-1deg); }
        }
        @keyframes auraBreath {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 0.9; transform: scale(1.08); }
        }
        @keyframes titlePulse {
          0%, 100% { text-shadow: 0 0 20px rgba(251,191,36,0.4), 0 0 60px rgba(251,191,36,0.1); }
          50%       { text-shadow: 0 0 40px rgba(251,191,36,0.8), 0 0 100px rgba(251,191,36,0.3); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rushLeft {
          0%   { transform: translateX(0) scaleX(1); }
          100% { transform: translateX(calc(50vw - 80px)) scaleX(1); }
        }
        @keyframes rushRight {
          0%   { transform: translateX(0) scaleX(-1); }
          100% { transform: translateX(calc(-50vw + 80px)) scaleX(-1); }
        }
        @keyframes shockwave {
          0%   { transform: translate(-50%, -50%) scale(0);   opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(6);   opacity: 0; }
        }
        @keyframes shockwave2 {
          0%   { transform: translate(-50%, -50%) scale(0);   opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(4.5); opacity: 0; }
        }
        @keyframes impactFlash {
          0%   { opacity: 0; }
          20%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes sparkBurst {
          0%   { transform: translate(-50%, -50%) scale(0) rotate(0deg);   opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(3) rotate(180deg); opacity: 0; }
        }
        @keyframes splashFadeOut {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes btnGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(251,191,36,0.3), 0 0 60px rgba(251,191,36,0.1); }
          50%       { box-shadow: 0 0 40px rgba(251,191,36,0.6), 0 0 100px rgba(251,191,36,0.25); }
        }
      `}</style>

      {/* Full-screen container */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(ellipse at 50% 30%, #150828 0%, #07060f 55%, #000 100%)',
          overflow: 'hidden',
          animation: isFadeout ? 'splashFadeOut 0.6s ease forwards' : undefined,
          pointerEvents: isFadeout ? 'none' : 'auto',
        }}
      >
        {/* Ambient particles */}
        {particles.map((p) => (
          <div key={p.id} style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.size}px`, height: `${p.size}px`, borderRadius: '50%',
            background: p.color,
            animation: `floatUp ${2.5 + p.delay}s ${p.delay * 0.4}s ease-in-out infinite`,
            filter: 'blur(0.5px)',
            boxShadow: `0 0 ${p.size * 3}px ${p.size}px ${p.color}`,
            opacity: isImpact ? 0 : 1, transition: 'opacity 0.2s',
          }} />
        ))}

        {/* Top/Bottom accent lines */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#f59e0b,transparent)' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#7c3aed,transparent)' }} />

        {/* ── LEFT CHARACTER: Đường Tam ── */}
        <div style={{
          position: 'absolute',
          left: '5%', bottom: '0',
          width: 'min(35vw, 320px)', height: 'min(70vh, 600px)',
          zIndex: 10,
          animation: isRushing || isImpact
            ? 'rushLeft 0.65s cubic-bezier(0.4,0,1,1) forwards'
            : 'idleFloat 3s ease-in-out infinite',
          transformOrigin: 'center bottom',
        }}>
          {/* Blue aura glow behind */}
          <div style={{
            position: 'absolute', inset: '-15%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.35) 0%, rgba(59,130,246,0.15) 50%, transparent 70%)',
            animation: 'auraBreath 2s ease-in-out infinite',
            filter: 'blur(8px)',
          }} />
          <img
            src="/assets/tang-san.jpg"
            alt="Đường Tam"
            style={{
              width: '100%', height: '100%',
              objectFit: 'contain', objectPosition: 'bottom',
              mixBlendMode: 'lighten',
              filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.6)) drop-shadow(0 0 8px rgba(59,130,246,0.8))',
              opacity: isImpact ? 0 : 1,
              transition: 'opacity 0.15s',
            }}
          />
          {/* Name label */}
          {isIdle && (
            <div style={{
              position:'absolute', bottom:'-2rem', left:'50%', transform:'translateX(-50%)',
              whiteSpace:'nowrap', color:'#60a5fa', fontSize:'0.8rem', fontWeight:700,
              letterSpacing:'0.15em', fontFamily:'monospace',
              textShadow:'0 0 10px rgba(96,165,250,0.8)',
              animation:'fadeInUp 0.6s 1s both',
            }}>⚔ ĐƯỜNG TAM</div>
          )}
        </div>

        {/* ── RIGHT CHARACTER: Tiểu Ổ (Xiao Wu) ── */}
        <div style={{
          position: 'absolute',
          right: '5%', bottom: '0',
          width: 'min(35vw, 320px)', height: 'min(70vh, 600px)',
          zIndex: 10,
          animation: isRushing || isImpact
            ? 'rushRight 0.65s cubic-bezier(0.4,0,1,1) forwards'
            : 'idleFloatR 3.2s 0.5s ease-in-out infinite',
          transformOrigin: 'center bottom',
          transform: !isRushing && !isImpact ? 'scaleX(-1)' : undefined,
        }}>
          {/* Pink aura glow behind */}
          <div style={{
            position: 'absolute', inset: '-15%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.35) 0%, rgba(251,191,36,0.15) 50%, transparent 70%)',
            animation: 'auraBreath 2.4s 0.8s ease-in-out infinite',
            filter: 'blur(8px)',
          }} />
          <img
            src="/assets/xiao-wu.jpg"
            alt="Tiểu Ổ"
            style={{
              width: '100%', height: '100%',
              objectFit: 'contain', objectPosition: 'bottom',
              mixBlendMode: 'lighten',
              filter: 'drop-shadow(0 0 20px rgba(236,72,153,0.6)) drop-shadow(0 0 8px rgba(251,191,36,0.7))',
              opacity: isImpact ? 0 : 1,
              transition: 'opacity 0.15s',
            }}
          />
          {/* Name label */}
          {isIdle && (
            <div style={{
              position:'absolute', bottom:'-2rem', left:'50%', transform:'translateX(-50%) scaleX(-1)',
              whiteSpace:'nowrap', color:'#f9a8d4', fontSize:'0.8rem', fontWeight:700,
              letterSpacing:'0.15em', fontFamily:'monospace',
              textShadow:'0 0 10px rgba(249,168,212,0.8)',
              animation:'fadeInUp 0.6s 1.2s both',
            }}>TIỂU Ổ ⚔</div>
          )}
        </div>

        {/* ── IMPACT EFFECTS ── */}
        {(isImpact || isFadeout) && (
          <>
            {/* Blinding white flash */}
            <div style={{
              position:'absolute', inset:0,
              background:'radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(251,191,36,0.8) 30%, rgba(139,92,246,0.4) 60%, transparent 80%)',
              animation:'impactFlash 0.6s ease forwards',
              zIndex: 20,
            }} />
            {/* Shockwave ring 1 */}
            <div style={{
              position:'absolute', top:'45%', left:'50%',
              width:'80px', height:'80px',
              borderRadius:'50%',
              border:'4px solid rgba(251,191,36,0.9)',
              animation:'shockwave 0.8s ease-out forwards',
              zIndex: 21,
            }} />
            {/* Shockwave ring 2 */}
            <div style={{
              position:'absolute', top:'45%', left:'50%',
              width:'60px', height:'60px',
              borderRadius:'50%',
              border:'6px solid rgba(255,255,255,0.7)',
              animation:'shockwave2 0.6s 0.1s ease-out forwards',
              zIndex: 21,
            }} />
            {/* Star burst */}
            <div style={{
              position:'absolute', top:'45%', left:'50%',
              width:'200px', height:'200px',
              background:'conic-gradient(from 0deg, rgba(251,191,36,0.8), transparent, rgba(6,182,212,0.8), transparent, rgba(236,72,153,0.8), transparent, rgba(251,191,36,0.8))',
              borderRadius:'50%',
              animation:'sparkBurst 0.7s ease-out forwards',
              zIndex: 22,
            }} />
          </>
        )}

        {/* ── CENTER CONTENT (title + button) ── */}
        <div style={{
          position:'relative', zIndex:15,
          textAlign:'center',
          padding:'1rem',
          opacity: (isRushing || isImpact) ? 0 : 1,
          transition: 'opacity 0.3s',
          pointerEvents: phase !== 'idle' ? 'none' : 'auto',
          marginTop: '-8vh',
        }}>
          {/* Logo icon */}
          <div style={{
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            width:'72px', height:'72px', borderRadius:'18px',
            background:'linear-gradient(135deg,#f59e0b,#d97706)',
            marginBottom:'1.2rem',
            boxShadow:'0 0 40px rgba(245,158,11,0.5)',
            animation:'fadeInUp 0.7s ease both',
          }}>
            <Swords style={{ width:'34px', height:'34px', color:'#0a0a0f' }} />
          </div>

          {/* Title */}
          <h1 style={{
            fontSize:'clamp(2rem,6vw,3.2rem)', fontWeight:900, color:'#fff',
            letterSpacing:'-0.02em', marginBottom:'0.4rem', lineHeight:1.1,
            fontFamily:'"Montserrat","Be Vietnam Pro",sans-serif',
            animation:'titlePulse 2s ease-in-out infinite, fadeInUp 0.7s 0.1s both',
          }}>
            TÔNG MÔN TRANH BÁ
          </h1>

          <p style={{
            fontSize:'0.8rem', color:'#94a3b8', letterSpacing:'0.25em',
            fontFamily:'monospace', marginBottom:'1.2rem', textTransform:'uppercase',
            animation:'fadeInUp 0.7s 0.25s both',
          }}>
            Soul Land Esports Platform • PVP 2026
          </p>

          {/* Division badges */}
          <div style={{
            display:'inline-flex', gap:'8px', marginBottom:'2rem',
            animation:'fadeInUp 0.7s 0.4s both', opacity:0,
          }}>
            {['⚔️ Bảng A','🌲 Bảng B','🔥 Bảng C'].map((b)=>(
              <span key={b} style={{
                padding:'4px 12px', borderRadius:'999px',
                background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.35)',
                color:'#fbbf24', fontSize:'0.72rem', fontWeight:600,
              }}>{b}</span>
            ))}
          </div>

          {/* CTA Button */}
          <div style={{ animation:'fadeInUp 0.7s 0.6s both', opacity:0 }}>
            <button
              onClick={handleEnter}
              disabled={phase !== 'idle'}
              style={{
                display:'inline-flex', alignItems:'center', gap:'10px',
                padding:'15px 44px', borderRadius:'14px',
                background:'linear-gradient(135deg,#f59e0b,#d97706)',
                color:'#0a0a0f', fontSize:'1.05rem', fontWeight:800,
                border:'none', cursor:'pointer',
                letterSpacing:'0.06em',
                fontFamily:'"Montserrat",sans-serif',
                animation:'btnGlow 2s ease-in-out infinite',
                transition:'transform 0.15s ease, filter 0.2s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform='scale(1.05)'; (e.currentTarget as HTMLButtonElement).style.filter='brightness(1.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform='scale(1)'; (e.currentTarget as HTMLButtonElement).style.filter='brightness(1)'; }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform='scale(0.97)'; }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform='scale(1)'; }}
            >
              <Swords style={{ width:'18px', height:'18px' }} />
              BẮT ĐẦU
            </button>
          </div>
        </div>

      </div>
    </>
  );
};
