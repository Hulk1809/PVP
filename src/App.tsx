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

  // Load YouTube IFrame API once — triggered AFTER user clicks splash (hasEntered)
  useEffect(() => {
    if (!hasEntered) return; // Wait for user interaction first
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
            // Play immediately since user already interacted via splash screen
            if (soundEnabled) {
              event.target.playVideo();
            }
            pendingPlayRef.current = false;
          },
        },
      });
    };
  }, [hasEntered]);

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

  // When user enters from splash, start music if sound is enabled
  const handleSplashEnter = () => {
    setHasEntered(true);
  };

  if (!hasEntered) {
    return <SplashScreen onEnter={handleSplashEnter} />;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      
      {/* Hidden YouTube Background Music Player */}
      <div
        id="yt-bg-player"
        style={{ position: 'fixed', bottom: '-9999px', left: '-9999px', width: '1px', height: '1px', pointerEvents: 'none', zIndex: -1 }}
        aria-hidden="true"
      />

      {/* Fullscreen Background Video — muted, looping, seamless */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <source src="/assets/bg-video.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay to keep UI readable over video */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.58)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Soul Power Particle System on top of video */}
      <ParticleCanvas theme={currentBracket?.theme || 'ocean'} />


      {/* Top Header with Login Modal Trigger */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col">
        {/* Hero Banner with active division art */}
        <HeroBanner />

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
