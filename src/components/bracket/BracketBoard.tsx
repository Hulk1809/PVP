import React, { useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Search, Swords, UserPlus, ChevronLeft, ChevronRight, MoveHorizontal, Flame, Trophy, Clock } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';
import { FloatingPlatformNode } from './FloatingPlatformNode';
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

  // Dynamic Countdown Timer (13:39:11)
  const [countdownTime, setCountdownTime] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 13,
    minutes: 39,
    seconds: 11,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownTime((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    setZoomLevel((prev) => Math.min(1.3, Math.max(0.65, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Scroll Navigation Buttons
  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -420, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 420, behavior: 'smooth' });
    }
  };

  // Mouse Drag to Pan Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
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
    const walk = (x - startX) * 1.5;
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

  const formatCountdownStr = () => {
    const h = String(countdownTime.hours).padStart(2, '0');
    const m = String(countdownTime.minutes).padStart(2, '0');
    const s = String(countdownTime.seconds).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="relative w-full min-h-[700px] flex flex-col select-none arena-sunset-bg">
      
      {/* ======================================================== */}
      {/* 👑 Top Center Calligraphy & Countdown Header (Style 3Q) */}
      {/* ======================================================== */}
      <div className="relative w-full pt-6 pb-2 flex flex-col items-center justify-center text-center">
        
        {/* Calligraphy Championship Title */}
        <div className="flex items-center space-x-2">
          <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
          <h2 className="text-xl sm:text-2xl font-black text-gold-gradient uppercase tracking-widest font-heading drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]">
            HẢI THẦN TRANH BÁ • ĐANG DIỄN RA
          </h2>
          <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
        </div>

        {/* Ancient Countdown Clock */}
        <div className="mt-1 flex items-center space-x-2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-950/80 via-zinc-950/90 to-amber-950/80 border border-amber-500/60 shadow-lg shadow-amber-500/20">
          <Clock className="w-4 h-4 text-yellow-400" />
          <span className="text-xs sm:text-sm font-black font-mono tracking-widest text-yellow-300">
            Countdown {formatCountdownStr()}
          </span>
        </div>

      </div>

      {/* Control Bar: Search, Pan/Slide Buttons, Zoom */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-2 pb-2 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Search & Add Player */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
            <input
              type="text"
              placeholder="Tìm kiếm danh tướng ING..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg text-xs bg-zinc-950/80 border border-amber-500/30 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all w-48 sm:w-60"
            />
          </div>

          {userRole === 'admin' && onOpenAddParticipant && (
            <button
              onClick={onOpenAddParticipant}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/30 active:scale-95 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Thêm Tuyển Thủ (Tự Động Bốc Thăm)</span>
            </button>
          )}
        </div>

        {/* Center/Right: Slide Left/Right Navigation + Zoom Controls */}
        <div className="flex items-center space-x-2 ml-auto">
          
          {/* Pan Hint Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-zinc-950/80 border border-amber-500/20 text-[11px] text-zinc-300">
            <MoveHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Nhấn giữ chuột kéo trái / phải để xem lôi đài</span>
          </div>

          {/* Quick Slide Navigation Buttons */}
          <div className="flex items-center space-x-1 bg-zinc-950/80 p-1 rounded-xl border border-amber-500/30 shadow-sm">
            <button
              onClick={handleScrollLeft}
              title="Lướt sang trái (Vòng trước)"
              className="p-1.5 rounded-lg text-amber-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleScrollRight}
              title="Lướt sang phải (Vòng sau)"
              className="p-1.5 rounded-lg text-amber-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-zinc-950/80 p-1 rounded-xl border border-amber-500/30 shadow-sm">
            <button
              onClick={() => handleZoom(-0.1)}
              title="Thu nhỏ"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="text-[11px] font-mono font-bold text-amber-400 px-2">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              onClick={() => handleZoom(0.1)}
              title="Phóng to"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetZoom}
              title="Căn giữa / Mặc định"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Main 2.5D Floating Platforms Scroll Area with Drag-To-Pan */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`w-full overflow-x-auto overflow-y-hidden py-10 px-4 sm:px-10 transition-colors ${
          isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
      >
        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          className="min-w-max mx-auto transition-transform duration-200 flex flex-col items-center pointer-events-auto"
        >
          {/* Arena Rounds Container */}
          <div className="flex items-stretch space-x-20 sm:space-x-28 justify-center">
            {sortedRounds.map((roundNumber, rIdx) => {
              const roundMatches = roundsMap[roundNumber];
              const roundName = roundMatches[0]?.roundName || `Vòng ${roundNumber}`;
              const isLastRound = rIdx === sortedRounds.length - 1;

              return (
                <div key={roundNumber} className="flex flex-col items-center">
                  
                  {/* Arena Round Header Plaque */}
                  <div className="mb-6 text-center">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-gradient-to-r from-amber-600/30 via-zinc-950 to-amber-600/30 border-2 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                      <Swords className="w-3.5 h-3.5 text-amber-400" />
                      <span>{roundName}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1 font-mono">
                      {roundMatches.length} Lôi Đài
                    </p>
                  </div>

                  {/* Arena Matches Column */}
                  <div className="flex flex-col justify-around flex-1 space-y-12 sm:space-y-16">
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
                            isHighlighted ? 'scale-105 ring-4 ring-amber-400 rounded-3xl' : ''
                          }`}
                        >
                          <FloatingPlatformNode
                            match={m}
                            player1={p1}
                            player2={p2}
                            userRole={userRole}
                            onAdvanceWinner={handleRequestAdvance}
                            onResetMatch={handleRequestReset}
                            onOpenScheduler={onOpenScheduler}
                            onOpenMatchDetails={onOpenMatchDetails}
                          />

                          {/* Golden Chi Bridge to Next Round Stage */}
                          {!isLastRound && (
                            <div className="hidden sm:block absolute top-1/2 -right-20 sm:-right-28 w-20 sm:w-28 h-1 -translate-y-1/2 pointer-events-none">
                              <div
                                className={`w-full h-full rounded-full transition-all duration-500 ${
                                  m.winnerId ? 'chi-bridge-active' : 'chi-bridge-inactive'
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
