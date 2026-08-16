import React, { useState } from 'react';
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
import { Match, Participant } from './types/tournament';

const MainApp: React.FC = () => {
  const { brackets, selectedBracketId } = useTournament();
  const currentBracket = brackets[selectedBracketId];

  const [activeTab, setActiveTab] = useState<'bracket' | 'roster' | 'podium'>('bracket');

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<string | null>(null);
  const [matchToSchedule, setMatchToSchedule] = useState<Match | null>(null);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [participantToEdit, setParticipantToEdit] = useState<Participant | null>(null);

  const handleOpenAddParticipant = () => {
    setParticipantToEdit(null);
    setIsParticipantModalOpen(true);
  };

  const handleOpenEditParticipant = (p: Participant) => {
    setParticipantToEdit(p);
    setIsParticipantModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      
      {/* Dynamic Background Particle System */}
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
