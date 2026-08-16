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
import { ShieldCheck, Sparkles } from 'lucide-react';

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

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/90 backdrop-blur-md py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Supabase Realtime Channel: <span className="text-emerald-400 font-semibold">CONNECTED</span>
            </span>
          </div>

          <div className="flex items-center space-x-1 text-slate-400">
            <span>Tông Môn Tranh Bá • Soul Land: Awakening World eSports Engine</span>
          </div>

          <div className="flex items-center space-x-3 text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> RLS Protected
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Vibe Coding 2026
            </span>
          </div>
        </div>
      </footer>

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
