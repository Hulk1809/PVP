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
        background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 70%, #000 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        textAlign: 'center',
        backdropFilter: 'blur(24px)',
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
            box-shadow: 0 0 25px rgba(255, 255, 255, 0.25), 0 0 60px rgba(148, 163, 184, 0.15);
          }
          50% {
            box-shadow: 0 0 45px rgba(255, 255, 255, 0.6), 0 0 90px rgba(226, 232, 240, 0.3);
          }
        }
      `}</style>

      {/* Animated Rotating Phone Icon Container in Platinum Silver */}
      <div
        style={{
          position: 'relative',
          width: '84px',
          height: '84px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(148,163,184,0.15))',
          border: '1.5px solid rgba(255,255,255,0.6)',
          animation: 'rotateGlow 3s infinite ease-in-out',
          marginBottom: '1.2rem',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ animation: 'phoneRotateAnim 3.5s infinite ease-in-out', transformOrigin: 'center center' }}>
          <Smartphone style={{ width: '42px', height: '42px', color: '#ffffff' }} />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            background: '#ffffff',
            borderRadius: '50%',
            padding: '4px',
            boxShadow: '0 0 12px rgba(255,255,255,0.9)',
          }}
        >
          <RotateCw style={{ width: '14px', height: '14px', color: '#020617' }} />
        </div>
      </div>

      {/* Title in Platinum Silver Calligraphy */}
      <h2
        style={{
          fontFamily: '"Playfair Display", "Be Vietnam Pro", serif',
          fontSize: 'clamp(1.15rem, 5vw, 1.45rem)',
          fontWeight: 900,
          fontStyle: 'italic',
          background: 'linear-gradient(110deg, #94a3b8 0%, #cbd5e1 20%, #ffffff 40%, #f8fafc 55%, #cbd5e1 75%, #64748b 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.4rem',
          textTransform: 'uppercase',
          lineHeight: 1.25,
          display: 'inline-block',
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
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              flexShrink: 0,
              marginTop: '2px',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <ExternalLink style={{ width: '16px', height: '16px' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', marginBottom: '2px' }}>
              1. Mở bằng Trình Duyệt Ngoài (Chrome / Safari)
            </p>
            <p style={{ fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              Nếu đang mở trong <strong>Zalo / Messenger / TikTok</strong>, hãy bấm biểu tượng <strong style={{ color: '#ffffff' }}>⋮</strong> hoặc <strong style={{ color: '#ffffff' }}>⋯</strong> và chọn <strong>"Mở bằng trình duyệt"</strong>.
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
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              flexShrink: 0,
              marginTop: '2px',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <RotateCw style={{ width: '16px', height: '16px' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', marginBottom: '2px' }}>
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
          background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.15)',
          border: copied ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.4)',
          color: copied ? '#34d399' : '#ffffff',
          fontSize: '0.78rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(10px)',
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
