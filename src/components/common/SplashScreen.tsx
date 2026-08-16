import React, { useEffect, useState } from 'react';
import { Swords } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [visible, setVisible] = useState(true);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate random floating particles
    const pts = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 4,
    }));
    setParticles(pts);
  }, []);

  const handleEnter = () => {
    setVisible(false);
    // Small delay for fade-out animation to finish
    setTimeout(onEnter, 600);
  };

  if (!visible) {
    return (
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'black',
          animation: 'splashFadeOut 0.6s ease forwards',
          pointerEvents: 'none',
        }}
      />
    );
  }

  return (
    <>
      <style>{`
        @keyframes splashFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes floatUp {
          0% { transform: translateY(0px) scale(1); opacity: 0.7; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 1; }
          100% { transform: translateY(0px) scale(1); opacity: 0.7; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px 4px rgba(251,191,36,0.3), 0 0 60px 10px rgba(251,191,36,0.1); }
          50% { box-shadow: 0 0 40px 8px rgba(251,191,36,0.6), 0 0 100px 20px rgba(251,191,36,0.2); }
        }
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(251,191,36,0.5), 0 0 40px rgba(251,191,36,0.2); }
          50% { text-shadow: 0 0 40px rgba(251,191,36,0.9), 0 0 80px rgba(251,191,36,0.4); }
        }
        @keyframes swordSpin {
          0% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
          100% { transform: rotate(-10deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .splash-title { animation: titleGlow 2s ease-in-out infinite, fadeInUp 0.8s ease forwards; }
        .splash-sword { animation: swordSpin 3s ease-in-out infinite; }
        .splash-btn { animation: pulseGlow 2s ease-in-out infinite; }
        .splash-sub { animation: fadeInUp 0.8s 0.3s ease both; }
        .splash-badge { animation: fadeInUp 0.8s 0.6s ease both; opacity: 0; }
        .splash-btn-wrap { animation: fadeInUp 0.8s 0.9s ease both; opacity: 0; }
        .splash-hint { animation: fadeInUp 0.8s 1.2s ease both; opacity: 0; }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, #090a0f 60%, #000 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Floating Soul Power Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              background: p.id % 3 === 0
                ? 'rgba(251,191,36,0.8)'
                : p.id % 3 === 1
                ? 'rgba(139,92,246,0.7)'
                : 'rgba(6,182,212,0.6)',
              animation: `floatUp ${2 + p.delay}s ${p.delay}s ease-in-out infinite`,
              filter: 'blur(0.5px)',
              boxShadow: `0 0 ${p.size * 2}px ${p.size}px rgba(251,191,36,0.3)`,
            }}
          />
        ))}

        {/* Top decorative line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #7c3aed, transparent)' }} />

        {/* Main Content */}
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '600px' }}>

          {/* Sword Icon */}
          <div
            className="splash-sword"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              marginBottom: '1.5rem',
              boxShadow: '0 0 40px rgba(245,158,11,0.5)',
            }}
          >
            <Swords style={{ width: '40px', height: '40px', color: '#0a0a0f' }} />
          </div>

          {/* Title */}
          <h1
            className="splash-title"
            style={{
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-0.02em',
              marginBottom: '0.5rem',
              fontFamily: '"Montserrat", "Be Vietnam Pro", sans-serif',
            }}
          >
            TÔNG MÔN TRANH BÁ
          </h1>

          {/* Subtitle */}
          <p
            className="splash-sub"
            style={{
              fontSize: '0.85rem',
              color: '#94a3b8',
              letterSpacing: '0.3em',
              fontFamily: 'monospace',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}
          >
            Soul Land Esports Platform • PVP 2026
          </p>

          {/* Badge */}
          <div
            className="splash-badge"
            style={{
              display: 'inline-flex',
              gap: '8px',
              marginBottom: '2.5rem',
            }}
          >
            {['⚔️ Bảng A', '🌲 Bảng B', '🔥 Bảng C'].map((b) => (
              <span
                key={b}
                style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  color: '#fbbf24',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {b}
              </span>
            ))}
          </div>

          {/* Enter Button */}
          <div className="splash-btn-wrap">
            <button
              onClick={handleEnter}
              className="splash-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 48px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#0a0a0f',
                fontSize: '1.1rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'transform 0.1s ease, filter 0.2s ease',
                fontFamily: '"Montserrat", sans-serif',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.15)'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
              onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            >
              <Swords style={{ width: '20px', height: '20px' }} />
              VÀO GIẢI ĐẤU
            </button>
          </div>

          {/* Music hint */}
          <p
            className="splash-hint"
            style={{
              marginTop: '1.5rem',
              fontSize: '0.75rem',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>🎵</span>
            <span>Nhạc nền sẽ tự động phát khi vào giải đấu</span>
          </p>
        </div>
      </div>
    </>
  );
};
