import React, { useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Search, Filter, Swords } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';
import { MatchCard } from './MatchCard';
import { ThirdPlaceMatch } from './ThirdPlaceMatch';
import { Match } from '../../types/tournament';
import { DEFAULT_SECTS } from '../../engine/defaultData';
import { ConfirmWinnerModal, ConfirmActionType } from '../common/ConfirmWinnerModal';

interface BracketBoardProps {
  onOpenScheduler: (match: Match) => void;
  onOpenMatchDetails: (matchId: string) => void;
}

export const BracketBoard: React.FC<BracketBoardProps> = ({
  onOpenScheduler,
  onOpenMatchDetails,
}) => {
  const {
    brackets,
    participants,
    matches,
    selectedBracketId,
    userRole,
    searchQuery,
    setSearchQuery,
    selectedSectFilter,
    setSelectedSectFilter,
    handleAdvanceWinner,
    handleResetMatch,
  } = useTournament();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [confirmAction, setConfirmAction] = useState<ConfirmActionType | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentBracket = brackets[selectedBracketId];
  if (!currentBracket) return null;

  // Filter matches belonging to this bracket
  const bracketMatches = Object.values(matches).filter(
    (m) => m.bracketId === selectedBracketId && !m.isThirdPlaceMatch
  );

  const thirdPlaceMatch = Object.values(matches).find(
    (m) => m.bracketId === selectedBracketId && m.isThirdPlaceMatch
  ) || null;

  // Group matches by round
  const roundsMap: Record<number, Match[]> = {};
  bracketMatches.forEach((m) => {
    if (!roundsMap[m.round]) roundsMap[m.round] = [];
    roundsMap[m.round].push(m);
  });

  // Sort matches in each round by matchIndex
  Object.keys(roundsMap).forEach((r) => {
    roundsMap[Number(r)].sort((a, b) => a.matchIndex - b.matchIndex);
  });

  const sortedRounds = Object.keys(roundsMap)
    .map(Number)
    .sort((a, b) => a - b);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(1.4, Math.max(0.65, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Intercept advance with confirmation modal
  const handleRequestAdvance = (matchId: string, winnerId: string) => {
    const targetMatch = matches[matchId];
    if (!targetMatch) return;
    const winner = participants[winnerId];
    if (!winner) return;
    const loserId = targetMatch.player1Id === winnerId ? targetMatch.player2Id : targetMatch.player1Id;
    const loser = loserId ? participants[loserId] : null;

    setConfirmAction({
      type: 'advance',
      match: targetMatch,
      winner,
      loser,
    });
  };

  // Intercept reset with confirmation modal
  const handleRequestReset = (matchId: string) => {
    const targetMatch = matches[matchId];
    if (!targetMatch) return;
    const currentWinner = targetMatch.winnerId ? participants[targetMatch.winnerId] : null;

    setConfirmAction({
      type: 'reset',
      match: targetMatch,
      currentWinner,
    });
  };

  const handleExecuteConfirmedAction = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'advance') {
      handleAdvanceWinner(confirmAction.match.id, confirmAction.winner.id);
    } else if (confirmAction.type === 'reset') {
      handleResetMatch(confirmAction.match.id);
    }
    setConfirmAction(null);
  };

  return (
    <div className="relative w-full min-h-[600px] flex flex-col">
      
      {/* Control Bar: Filters, Search, Zoom */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex flex-wrap items-center justify-between gap-3">
        
        {/* Search & Sect Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên thí sinh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all w-44 sm:w-56"
            />
          </div>

          {/* Sect Filter */}
          <div className="relative">
            <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedSectFilter}
              onChange={(e) => setSelectedSectFilter(e.target.value)}
              className="pl-8 pr-8 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500/60 transition-all appearance-none cursor-pointer"
            >
              <option value="all">Tất Cả Tông Môn</option>
              {Object.values(DEFAULT_SECTS).map((sect) => (
                <option key={sect.id} value={sect.name}>
                  {sect.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 ml-auto">
          <button
            onClick={() => handleZoom(-0.1)}
            title="Thu nhỏ"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-mono font-bold text-amber-400 px-1.5">
            {Math.round(zoomLevel * 100)}%
          </span>

          <button
            onClick={() => handleZoom(0.1)}
            title="Phóng to"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetZoom}
            title="Căn giữa / Mặc định"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main Bracket Interactive Scroll Area */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto overflow-y-hidden py-8 px-4 sm:px-8 cursor-grab active:cursor-grabbing"
      >
        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          className="min-w-max mx-auto transition-transform duration-200 flex flex-col items-center"
        >
          {/* Rounds Container */}
          <div className="flex items-stretch space-x-12 sm:space-x-16 justify-center">
            {sortedRounds.map((roundNumber, rIdx) => {
              const roundMatches = roundsMap[roundNumber];
              const roundName = roundMatches[0]?.roundName || `Vòng ${roundNumber}`;
              const isLastRound = rIdx === sortedRounds.length - 1;

              return (
                <div key={roundNumber} className="flex flex-col items-center">
                  
                  {/* Round Column Header */}
                  <div className="mb-6 text-center">
                    <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-amber-400 shadow-md">
                      <Swords className="w-3 h-3 text-amber-400" />
                      <span>{roundName}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      {roundMatches.length} trận đấu
                    </p>
                  </div>

                  {/* Matches Column */}
                  <div className="flex flex-col justify-around flex-1 space-y-8">
                    {roundMatches.map((m) => {
                      const p1 = m.player1Id ? participants[m.player1Id] : null;
                      const p2 = m.player2Id ? participants[m.player2Id] : null;

                      const isHighlighted =
                        searchQuery.trim() !== '' &&
                        ((p1 && p1.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (p2 && p2.name.toLowerCase().includes(searchQuery.toLowerCase())));

                      return (
                        <div
                          key={m.id}
                          className={`relative transition-all duration-300 ${
                            isHighlighted ? 'scale-105 ring-2 ring-amber-400 rounded-xl' : ''
                          }`}
                        >
                          <MatchCard
                            match={m}
                            player1={p1}
                            player2={p2}
                            userRole={userRole}
                            onAdvanceWinner={handleRequestAdvance}
                            onResetMatch={handleRequestReset}
                            onOpenScheduler={onOpenScheduler}
                            onOpenMatchDetails={onOpenMatchDetails}
                          />

                          {/* Dynamic SVG Branch Lines to Next Round */}
                          {!isLastRound && (
                            <div className="hidden sm:block absolute top-1/2 -right-12 sm:-right-16 w-12 sm:w-16 h-0.5 -translate-y-1/2 pointer-events-none">
                              <div
                                className={`w-full h-full transition-all duration-500 ${
                                  m.winnerId
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-500/40 shadow-glow-gold'
                                    : 'bg-slate-800'
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

          {/* 3rd Place Match at the Bottom */}
          {thirdPlaceMatch && (
            <ThirdPlaceMatch
              match={thirdPlaceMatch}
              player1={thirdPlaceMatch.player1Id ? participants[thirdPlaceMatch.player1Id] : null}
              player2={thirdPlaceMatch.player2Id ? participants[thirdPlaceMatch.player2Id] : null}
              userRole={userRole}
              onAdvanceWinner={handleRequestAdvance}
              onResetMatch={handleRequestReset}
              onOpenScheduler={onOpenScheduler}
              onOpenMatchDetails={onOpenMatchDetails}
            />
          )}

        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmWinnerModal
        action={confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleExecuteConfirmedAction}
      />

    </div>
  );
};
