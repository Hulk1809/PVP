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

  // Background Audio Ref
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  // Background Video Ref for guaranteed Mobile Autoplay Recovery
  const bgVideoRef = useRef<HTMLVideoElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const safePlayVideo = () => {
    const v = bgVideoRef.current;
    if (!v) return;
    if (!v.paused) return; // Already playing smoothly, do NOT interrupt
    if (playPromiseRef.current) return; // A play request is already in progress

    v.defaultMuted = true;
    v.muted = true;
    try {
      const promise = v.play();
      if (promise !== undefined) {
        playPromiseRef.current = promise;
        promise
          .then(() => {
            playPromiseRef.current = null;
          })
          .catch(() => {
            playPromiseRef.current = null;
          });
      }
    } catch {
      playPromiseRef.current = null;
    }
  };

  useEffect(() => {
    safePlayVideo();

    // Unlock playback on first user gesture once
    const handleFirstGesture = () => {
      safePlayVideo();
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('click', handleFirstGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
    };
  }, []);

  // Sync background music with soundEnabled & entry state
  useEffect(() => {
    if (!bgAudioRef.current) return;
    if (soundEnabled && (isEntering || hasEntered)) {
      bgAudioRef.current.play().catch(() => {});
    } else {
      bgAudioRef.current.pause();
    }
  }, [soundEnabled, isEntering, hasEntered]);

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
    safePlayVideo();
    if (soundEnabled && bgAudioRef.current) {
      bgAudioRef.current.play().catch(() => {});
    }
  };

  // When splash overlay finishes fading out
  const handleSplashFinishEnter = () => {
    setHasEntered(true);
    safePlayVideo();
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
      
      {/* Native Direct Background Music Player using videoplayback.weba */}
      <audio
        ref={bgAudioRef}
        loop
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src="/assets/videoplayback.weba" type="audio/webm" />
        <source src="/assets/bg-music.weba" type="audio/webm" />
        <source src="/assets/bg-music.mp3" type="audio/mpeg" />
      </audio>

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
          safePlayVideo();
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
