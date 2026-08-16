import React, { useEffect, useState } from 'react';
import { Smartphone, RotateCw, ExternalLink, Copy, Check } from 'lucide-react';

export const RotatePrompt: React.FC = () => {
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  };

  if (!isPortraitMobile) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'radial-gradient(ellipse at center, #1b0d2f 0%, #090a0f 70%, #000 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        textAlign: 'center',
        backdropFilter: 'blur(20px)',
        overflowY: 'auto',
      }}
    >
      <style>{`
        @keyframes phoneRotateAnim {
          0% {
            transform: rotate(0deg) scale(1);
          }
          35% {
            transform: rotate(-90deg) scale(1.08);
          }
          70% {
            transform: rotate(-90deg) scale(1.08);
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
      `}</style>

      {/* Animated Rotating Phone Icon Container */}
      <div
        style={{
          position: 'relative',
          width: '84px',
          height: '84px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(139,92,246,0.25))',
          border: '1.5px solid rgba(251,191,36,0.55)',
          animation: 'rotateGlow 3s infinite ease-in-out',
          marginBottom: '1.2rem',
        }}
      >
        <div style={{ animation: 'phoneRotateAnim 3.5s infinite ease-in-out', transformOrigin: 'center center' }}>
          <Smartphone style={{ width: '42px', height: '42px', color: '#fbbf24' }} />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            background: '#f59e0b',
            borderRadius: '50%',
            padding: '4px',
            boxShadow: '0 0 12px rgba(245,158,11,0.8)',
          }}
        >
          <RotateCw style={{ width: '14px', height: '14px', color: '#090a0f' }} />
        </div>
      </div>

      {/* Title */}
      <h2
        style={{
          fontFamily: '"Montserrat", "Be Vietnam Pro", sans-serif',
          fontSize: 'clamp(1.15rem, 5vw, 1.45rem)',
          fontWeight: 900,
          color: '#fff',
          letterSpacing: '-0.01em',
          marginBottom: '0.4rem',
          textShadow: '0 0 20px rgba(251,191,36,0.5)',
          textTransform: 'uppercase',
          lineHeight: 1.25,
        }}
      >
        Mở Web Ngoài & Xoay Ngang
      </h2>

      {/* Subtitle */}
      <p
        style={{
          fontSize: '0.8rem',
          color: '#94a3b8',
          marginBottom: '1.4rem',
          letterSpacing: '0.15em',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
        }}
      >
        Soul Land Esports • Hướng Dẫn Tối Ưu
      </p>

      {/* Instruction Steps Cards */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '360px',
          width: '100%',
          marginBottom: '1.5rem',
          textAlign: 'left',
        }}
      >
        {/* Step 1 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '12px 14px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#fbbf24',
              flexShrink: 0,
              marginTop: '2px',
            }}
          >
            <ExternalLink style={{ width: '16px', height: '16px' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fef08a', marginBottom: '2px' }}>
              1. Mở bằng Trình Duyệt Ngoài (Chrome / Safari)
            </p>
            <p style={{ fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              Nếu đang mở trong <strong>Zalo / Messenger / TikTok</strong>, hãy bấm biểu tượng <strong style={{ color: '#fbbf24' }}>⋮</strong> hoặc <strong style={{ color: '#fbbf24' }}>⋯</strong> và chọn <strong>"Mở bằng trình duyệt"</strong>.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '12px 14px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(251, 191, 36, 0.25)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#fbbf24',
              flexShrink: 0,
              marginTop: '2px',
            }}
          >
            <RotateCw style={{ width: '16px', height: '16px' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fef08a', marginBottom: '2px' }}>
              2. Xoay Ngang Điện Thoại (16:9)
            </p>
            <p style={{ fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              Mở khóa xoay màn hình và <strong>xoay ngang điện thoại</strong> để xem video hoạt ảnh & sơ đồ giải đấu rộng rãi nhất!
            </p>
          </div>
        </div>
      </div>

      {/* Copy Link Button Helper */}
      <button
        onClick={handleCopyLink}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 22px',
          borderRadius: '12px',
          background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.15)',
          border: copied ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(251, 191, 36, 0.4)',
          color: copied ? '#34d399' : '#fbbf24',
          fontSize: '0.78rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        {copied ? (
          <>
            <Check style={{ width: '14px', height: '14px' }} />
            <span>Đã Sao Chép Link Để Dán Vào Chrome / Safari!</span>
          </>
        ) : (
          <>
            <Copy style={{ width: '14px', height: '14px' }} />
            <span>Sao Chép Link Để Dán Vào Chrome / Safari</span>
          </>
        )}
      </button>
    </div>
  );
};
