import React, { useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Search, Swords, UserPlus, ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';
import { MatchCard } from './MatchCard';
import { ThirdPlaceMatch } from './ThirdPlaceMatch';
import { Match } from '../../types/tournament';
import { ConfirmWinnerModal, ConfirmActionType } from '../common/ConfirmWinnerModal';

interface BracketBoardProps {
  onOpenScheduler: (match: Match) => void;
  onOpenMatchDetails: (matchId: string) => void;
  onOpenAddParticipant?: () => void;
}

export const BracketBoard: React.FC<BracketBoardProps> = ({
  onOpenScheduler,
  onOpenMatchDetails,
  onOpenAddParticipant,
}) => {
  const {
    brackets,
    participants,
    matches,
    selectedBracketId,
    userRole,
    searchQuery,
    setSearchQuery,
    handleAdvanceWinner,
    handleResetMatch,
  } = useTournament();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [confirmAction, setConfirmAction] = useState<ConfirmActionType | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse Drag-To-Scroll states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

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
    setZoomLevel((prev) => Math.min(1.3, Math.max(0.7, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Scroll Navigation Buttons
  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  // Mouse Drag to Pan Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Don't drag if clicking buttons, inputs, or interactive controls
    if (target.closest('button') || target.closest('input') || target.closest('select')) {
      return;
    }
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    containerRef.current.scrollLeft = scrollLeftState - walk;
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
    <div className="relative w-full min-h-[600px] flex flex-col select-none">
      
      {/* Control Bar: Search, Pan/Slide Buttons, Zoom */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Search & Add Player */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Tìm tên thí sinh ING..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-black/35 backdrop-blur-md border border-white/15 text-white placeholder-zinc-400 focus:outline-none focus:border-amber-400 transition-all w-48 sm:w-60 shadow-inner"
            />
          </div>

          {userRole === 'admin' && onOpenAddParticipant && (
            <button
              onClick={onOpenAddParticipant}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 active:scale-95 transition-all border border-amber-400/30"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Thêm Tuyển Thủ (Tự Động Bốc Thăm)</span>
            </button>
          )}
        </div>

        {/* Center/Right: Slide Left/Right Navigation + Zoom Controls */}
        <div className="flex items-center space-x-2 ml-auto">
          
          {/* Pan Hint Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-black/35 backdrop-blur-md border border-white/15 text-[11px] text-zinc-300">
            <MoveHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Nhấn giữ chuột kéo trái / phải để xem các vòng</span>
          </div>

          {/* Quick Slide Navigation Buttons */}
          <div className="flex items-center space-x-1 bg-black/35 backdrop-blur-md p-1 rounded-xl border border-white/15">
            <button
              onClick={handleScrollLeft}
              title="Lướt sang trái (Vòng trước)"
              className="p-1.5 rounded-lg text-zinc-300 hover:text-amber-400 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleScrollRight}
              title="Lướt sang phải (Vòng sau)"
              className="p-1.5 rounded-lg text-zinc-300 hover:text-amber-400 hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-black/35 backdrop-blur-md p-1 rounded-xl border border-white/15">
            <button
              onClick={() => handleZoom(-0.1)}
              title="Thu nhỏ"
              className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="text-[11px] font-mono font-bold text-amber-400 px-2 drop-shadow">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              onClick={() => handleZoom(0.1)}
              title="Phóng to"
              className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetZoom}
              title="Căn giữa / Mặc định"
              className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Main Bracket Interactive Scroll Area with Drag-To-Pan */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`w-full overflow-x-auto overflow-y-hidden py-8 px-4 sm:px-8 transition-colors ${
          isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
      >
        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          className="min-w-max mx-auto transition-transform duration-200 flex flex-col items-center pointer-events-auto"
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
                    <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/45 backdrop-blur-md border border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10">
                      <Swords className="w-3 h-3 text-amber-400" />
                      <span>{roundName}</span>
                    </div>
                    <p className="text-[10px] text-zinc-300 mt-1 font-mono drop-shadow">
                      {roundMatches.length} trận đấu
                    </p>
                  </div>

                  {/* Matches Column */}
                  <div className="flex flex-col justify-around flex-1 space-y-6 sm:space-y-8">
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

                          {/* Clean Right-Angle Bracket Line to Next Round */}
                          {!isLastRound && (
                            <div className="hidden sm:block absolute top-1/2 -right-12 sm:-right-16 w-12 sm:w-16 h-[2px] -translate-y-1/2 pointer-events-none">
                              <div
                                className={`w-full h-full transition-all duration-300 ${
                                  m.winnerId
                                    ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                                    : 'bg-zinc-800'
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
