import React, { useState, useEffect, useRef } from 'react';
import { TournamentProvider, useTournament } from './store/tournamentStore';
import { ParticleCanvas } from './components/common/ParticleCanvas';
import { Header } from './components/common/Header';
import { HeroBanner } from './components/common/HeroBanner';
import { BracketBoard } from './components/bracket/BracketBoard';
import { ChampionPodium } from './components/viewer/ChampionPodium';
import { ParticipantList } from './components/viewer/ParticipantList';
import { MatchDetailModal } from './components/viewer/MatchDetailModal';
import { SchedulerModal } from './components/admin/SchedulerModal';
import { ParticipantManager } from './components/admin/ParticipantManager';
import { LoginModal } from './components/common/LoginModal';
import { SplashScreen } from './components/common/SplashScreen';
import { RotatePrompt } from './components/common/RotatePrompt';
import { Match, Participant } from './types/tournament';

// YouTube video ID from: https://youtu.be/vYRvqbxaW8U
const YT_VIDEO_ID = 'vYRvqbxaW8U';

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: { playVideo: () => void; pauseVideo: () => void } }) => void;
          };
        }
      ) => {
        playVideo: () => void;
        pauseVideo: () => void;
        destroy: () => void;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}


const MainApp: React.FC = () => {
  const { brackets, selectedBracketId, soundEnabled } = useTournament();
  const [hasEntered, setHasEntered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const currentBracket = brackets[selectedBracketId];

  const [activeTab, setActiveTab] = useState<'bracket' | 'roster' | 'podium'>('bracket');

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<string | null>(null);
  const [matchToSchedule, setMatchToSchedule] = useState<Match | null>(null);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [participantToEdit, setParticipantToEdit] = useState<Participant | null>(null);

  // YouTube Player ref
  const ytPlayerRef = useRef<{ playVideo: () => void; pauseVideo: () => void; destroy: () => void } | null>(null);
  const ytReadyRef = useRef(false);
  const pendingPlayRef = useRef(false);

  // Background Video Ref for guaranteed Mobile Autoplay Recovery
  const bgVideoRef = useRef<HTMLVideoElement | null>(null);

  const forcePlayVideo = () => {
    const v = bgVideoRef.current;
    if (v) {
      v.defaultMuted = true;
      v.muted = true;
      v.play().catch(() => {});
    }
  };

  useEffect(() => {
    forcePlayVideo();

    // Auto-resume video on first touch/pointerdown anywhere on screen
    window.addEventListener('touchstart', forcePlayVideo, { passive: true });
    window.addEventListener('pointerdown', forcePlayVideo, { passive: true });
    window.addEventListener('click', forcePlayVideo, { passive: true });

    return () => {
      window.removeEventListener('touchstart', forcePlayVideo);
      window.removeEventListener('pointerdown', forcePlayVideo);
      window.removeEventListener('click', forcePlayVideo);
    };
  }, []);

  // Load YouTube IFrame API once — triggered AFTER user clicks splash (isEntering)
  useEffect(() => {
    if (!isEntering && !hasEntered) return; // Wait for user interaction first
    if (document.getElementById('yt-iframe-api')) return;
    const tag = document.createElement('script');
    tag.id = 'yt-iframe-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      ytPlayerRef.current = new window.YT.Player('yt-bg-player', {
        videoId: YT_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: YT_VIDEO_ID,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          mute: 0,
        },
        events: {
          onReady: (event) => {
            ytReadyRef.current = true;
            if (soundEnabled) {
              event.target.playVideo();
            }
            pendingPlayRef.current = false;
          },
        },
      });
    };
  }, [isEntering, hasEntered]);

  // Sync play/pause with soundEnabled
  useEffect(() => {
    if (!ytReadyRef.current || !ytPlayerRef.current) {
      if (soundEnabled) pendingPlayRef.current = true;
      return;
    }
    if (soundEnabled) {
      ytPlayerRef.current.playVideo();
    } else {
      ytPlayerRef.current.pauseVideo();
    }
  }, [soundEnabled]);

  const handleOpenAddParticipant = () => {
    setParticipantToEdit(null);
    setIsParticipantModalOpen(true);
  };

  const handleOpenEditParticipant = (p: Participant) => {
    setParticipantToEdit(p);
    setIsParticipantModalOpen(true);
  };

  // When user begins entry from splash
  const handleSplashStartEnter = () => {
    setIsEntering(true);
  };

  // When splash overlay finishes fading out
  const handleSplashFinishEnter = () => {
    setHasEntered(true);
  };

  const isUIVisible = isEntering || hasEntered;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black overflow-x-hidden">
      
      {/* Mobile Orientation Lock Prompt: Ask user to rotate phone to landscape for optimal experience */}
      <RotatePrompt />

      {/* Splash Screen Vignette Overlay (fades away smoothly while video continues) */}
      {!hasEntered && (
        <SplashScreen
          onStartEnter={handleSplashStartEnter}
          onEnter={handleSplashFinishEnter}
        />
      )}
      
      {/* Hidden YouTube Background Music Player */}
      <div
        id="yt-bg-player"
        style={{ position: 'fixed', bottom: '-9999px', left: '-9999px', width: '1px', height: '1px', pointerEvents: 'none', zIndex: -1 }}
        aria-hidden="true"
      />

      {/* Fullscreen Background Video — Hardware Accelerated 60FPS Mobile Stream */}
      <video
        ref={bgVideoRef}
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        onLoadedData={(e) => {
          e.currentTarget.defaultMuted = true;
          e.currentTarget.muted = true;
          e.currentTarget.play().catch(() => {});
        }}
        onCanPlay={(e) => {
          e.currentTarget.play().catch(() => {});
        }}
        onSuspend={(e) => {
          e.currentTarget.play().catch(() => {});
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          minHeight: '100%',
          minWidth: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          zIndex: 0,
          pointerEvents: 'none',
          transform: 'translate3d(0,0,0)',
          WebkitTransform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform',
        }}
      >
        <source src="/assets/bg-video.mp4" type="video/mp4" />
      </video>

      {/* Dark subtle overlay to keep UI readable over video */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100dvh',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.38) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
          transform: 'translate3d(0,0,0)',
        }}
      />

      {/* Soul Power Particle System on top of video */}
      <ParticleCanvas theme={currentBracket?.theme || 'ocean'} />

      {/* Top Header — Slides in smoothly from TOP */}
      <div
        style={{
          transform: isUIVisible ? 'translateY(0)' : 'translateY(-120%)',
          opacity: isUIVisible ? 1 : 0,
          transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.75s ease',
          zIndex: 40,
        }}
      >
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
        />
      </div>

      {/* Main Content Area — Slides & scales in smoothly from SURROUNDING / BOTTOM */}
      <main
        className="relative z-10 flex-1 flex flex-col pt-2"
        style={{
          transform: isUIVisible ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.96)',
          opacity: isUIVisible ? 1 : 0,
          transition: 'transform 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, opacity 0.85s ease 0.1s',
          pointerEvents: isUIVisible ? 'auto' : 'none',
        }}
      >
        {/* Tab Content */}
        {activeTab === 'bracket' && (
          <BracketBoard
            onOpenScheduler={(m) => setMatchToSchedule(m)}
            onOpenMatchDetails={(mId) => setSelectedMatchForDetail(mId)}
            onOpenAddParticipant={handleOpenAddParticipant}
          />
        )}

        {activeTab === 'podium' && <ChampionPodium />}

        {activeTab === 'roster' && (
          <ParticipantList
            onOpenAddParticipant={handleOpenAddParticipant}
            onOpenEditParticipant={handleOpenEditParticipant}
          />
        )}
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <MatchDetailModal
        matchId={selectedMatchForDetail}
        onClose={() => setSelectedMatchForDetail(null)}
      />

      <SchedulerModal
        isOpen={Boolean(matchToSchedule)}
        onClose={() => setMatchToSchedule(null)}
        match={matchToSchedule}
      />

      <ParticipantManager
        isOpen={isParticipantModalOpen}
        onClose={() => setIsParticipantModalOpen(false)}
        participantToEdit={participantToEdit}
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TournamentProvider>
      <MainApp />
    </TournamentProvider>
  );
};

export default App;
