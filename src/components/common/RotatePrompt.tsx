import React, { useEffect, useState } from 'react';
import { Smartphone, RotateCw } from 'lucide-react';

export const RotatePrompt: React.FC = () => {
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if mobile device and in portrait mode
      const isMobile = window.innerWidth <= 900;
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsPortraitMobile(isMobile && isPortrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation, { passive: true });
    window.addEventListener('orientationchange', checkOrientation, { passive: true });

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortraitMobile) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'radial-gradient(ellipse at center, #1a0f2e 0%, #090a0f 70%, #000 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        backdropFilter: 'blur(16px)',
      }}
    >
      <style>{`
        @keyframes phoneRotateAnim {
          0% {
            transform: rotate(0deg) scale(1);
          }
          35% {
            transform: rotate(-90deg) scale(1.1);
          }
          70% {
            transform: rotate(-90deg) scale(1.1);
          }
          100% {
            transform: rotate(0deg) scale(1);
          }
        }
        @keyframes rotateGlow {
          0%, 100% {
            box-shadow: 0 0 25px rgba(251, 191, 36, 0.3), 0 0 60px rgba(245, 158, 11, 0.15);
          }
          50% {
            box-shadow: 0 0 50px rgba(251, 191, 36, 0.7), 0 0 100px rgba(234, 88, 12, 0.35);
          }
        }
        @keyframes textBreathe {
          0%, 100% { opacity: 0.9; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>

      {/* Animated Rotating Phone Icon Container */}
      <div
        style={{
          position: 'relative',
          width: '100px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(139,92,246,0.2))',
          border: '1.5px solid rgba(251,191,36,0.5)',
          animation: 'rotateGlow 3s infinite ease-in-out',
          marginBottom: '2rem',
        }}
      >
        <div style={{ animation: 'phoneRotateAnim 3.5s infinite ease-in-out', transformOrigin: 'center center' }}>
          <Smartphone style={{ width: '48px', height: '48px', color: '#fbbf24' }} />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '-6px',
            right: '-6px',
            background: '#f59e0b',
            borderRadius: '50%',
            padding: '4px',
            boxShadow: '0 0 12px rgba(245,158,11,0.8)',
          }}
        >
          <RotateCw style={{ width: '16px', height: '16px', color: '#090a0f' }} />
        </div>
      </div>

      {/* Title */}
      <h2
        style={{
          fontFamily: '"Montserrat", "Be Vietnam Pro", sans-serif',
          fontSize: '1.4rem',
          fontWeight: 900,
          color: '#fff',
          letterSpacing: '-0.01em',
          marginBottom: '0.6rem',
          textShadow: '0 0 20px rgba(251,191,36,0.5)',
          textTransform: 'uppercase',
          animation: 'textBreathe 3s infinite ease-in-out',
        }}
      >
        Vui Lòng Xoay Ngang Điện Thoại
      </h2>

      {/* Subtitle description */}
      <p
        style={{
          fontSize: '0.85rem',
          color: '#cbd5e1',
          maxWidth: '320px',
          lineHeight: 1.6,
          marginBottom: '1.5rem',
        }}
      >
        Để trải nghiệm đấu trường <strong style={{ color: '#fbbf24' }}>Đấu La Đại Lục</strong> và sơ đồ giải đấu với góc nhìn điện ảnh tối ưu nhất.
      </p>

      {/* Visual orientation hint badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          borderRadius: '999px',
          background: 'rgba(251,191,36,0.12)',
          border: '1px solid rgba(251,191,36,0.3)',
          color: '#fbbf24',
          fontSize: '0.75rem',
          fontWeight: 700,
          fontFamily: 'monospace',
          letterSpacing: '0.1em',
        }}
      >
        <span>🔄 LANDSCAPE MODE (16:9)</span>
      </div>
    </div>
  );
};
