import React, { useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Search, Swords, UserPlus, ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';
import { MatchCard } from './MatchCard';
import { FinalMatchCard } from './FinalMatchCard';
import { ThirdPlaceMatch } from './ThirdPlaceMatch';
import { BlueSilverVineConnector } from './BlueSilverVineConnector';
import { PlayerBanModal } from './PlayerBanModal';
import { Match } from '../../types/tournament';
import { ConfirmWinnerModal, ConfirmActionType } from '../common/ConfirmWinnerModal';
import { getDivisionTheme } from '../../utils/themeStyles';

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
    handleShuffleBracket,
  } = useTournament();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [confirmAction, setConfirmAction] = useState<ConfirmActionType | null>(null);
  const [banningModalData, setBanningModalData] = useState<{ match: Match; playerId: string; playerName: string } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleOpenPlayerBan = (m: Match, pId: string, pName: string) => {
    setBanningModalData({ match: m, playerId: pId, playerName: pName });
  };

  // Mouse Drag-To-Scroll states (2D Pan X and Y)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [scrollTopState, setScrollTopState] = useState(0);

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

  // Mouse Drag to Pan Handlers (2D Pan: X & Y)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Don't drag if clicking buttons, inputs, or interactive controls
    if (target.closest('button') || target.closest('input') || target.closest('select')) {
      return;
    }
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setStartY(e.pageY - containerRef.current.offsetTop);
    setScrollLeftState(containerRef.current.scrollLeft);
    setScrollTopState(containerRef.current.scrollTop);
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
    const y = e.pageY - containerRef.current.offsetTop;
    const walkX = (x - startX) * 1.5; // Horizontal drag sensitivity
    const walkY = (y - startY) * 1.5; // Vertical drag sensitivity
    containerRef.current.scrollLeft = scrollLeftState - walkX;
    containerRef.current.scrollTop = scrollTopState - walkY;
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
      <div className="max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 pt-1 sm:pt-3 pb-1 flex flex-wrap items-center justify-between gap-1.5 sm:gap-3">
        
        {/* Left: Search & Add Player */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Tìm tên thí sinh ING..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2.5 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs bg-black/35 backdrop-blur-md border border-white/15 text-white placeholder-zinc-400 focus:outline-none focus:border-slate-300 transition-all w-36 sm:w-60 shadow-inner"
            />
          </div>

          {userRole === 'admin' && onOpenAddParticipant && (
            <button
              onClick={onOpenAddParticipant}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold bg-gradient-to-r from-slate-200 to-white text-zinc-950 hover:from-white hover:to-slate-100 shadow-md shadow-white/15 active:scale-95 transition-all border border-white/40"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Thêm Tuyển Thủ</span>
            </button>
          )}
        </div>

        {/* Center/Right: Slide Left/Right Navigation + Zoom Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 ml-auto">
          
          {/* Pan Hint Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-black/35 backdrop-blur-md border border-white/15 text-[11px] text-zinc-300">
            <MoveHorizontal className="w-3.5 h-3.5 text-slate-200" />
            <span>Nhấn giữ chuột kéo trái / phải để xem các vòng</span>
          </div>

          {/* Quick Slide Navigation Buttons */}
          <div className="flex items-center space-x-0.5 sm:space-x-1 bg-black/35 backdrop-blur-md p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-white/15">
            <button
              onClick={handleScrollLeft}
              title="Lướt sang trái (Vòng trước)"
              className="p-1 sm:p-1.5 rounded-md sm:rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handleScrollRight}
              title="Lướt sang phải (Vòng sau)"
              className="p-1 sm:p-1.5 rounded-md sm:rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-0.5 sm:space-x-1 bg-black/35 backdrop-blur-md p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-white/15">
            <button
              onClick={() => handleZoom(-0.1)}
              title="Thu nhỏ"
              className="p-1 sm:p-1.5 rounded-md sm:rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-200 px-1.5 drop-shadow">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              onClick={() => handleZoom(0.1)}
              title="Phóng to"
              className="p-1 sm:p-1.5 rounded-md sm:rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={handleResetZoom}
              title="Căn giữa / Mặc định"
              className="p-1 sm:p-1.5 rounded-md sm:rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Main Bracket Interactive Scroll Area with 2D Drag-To-Pan */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`w-full overflow-auto flex-1 min-h-[calc(100vh-140px)] pb-16 pt-2 sm:py-6 px-2 sm:px-8 transition-colors ${
          isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
      >
        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          className="min-w-max mx-auto transition-transform duration-200 flex flex-col items-center pointer-events-auto"
        >
          {/* Rounds Container */}
          <div className="flex items-stretch space-x-8 sm:space-x-16 justify-center">
            {sortedRounds.map((roundNumber, rIdx) => {
              const roundMatches = roundsMap[roundNumber];
              const roundName = roundMatches[0]?.roundName || `Vòng ${roundNumber}`;
              const isLastRound = rIdx === sortedRounds.length - 1;
              const themeConfig = getDivisionTheme(currentBracket.theme);

              return (
                <div key={roundNumber} className="flex flex-col items-center">
                  
                  {/* Round Column Header styled by division theme */}
                  <div className="mb-2 sm:mb-5 text-center">
                    <div className={`inline-flex items-center space-x-1.5 px-3.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider ${themeConfig.roundBadgeBg} ${themeConfig.roundBadgeBorder} ${themeConfig.roundBadgeText} ${themeConfig.roundBadgeShadow} backdrop-blur-md border shadow-md`}>
                      <Swords className="w-3 h-3 text-current" />
                      <span>{roundName}</span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-zinc-300 mt-0.5 font-mono drop-shadow">
                      {roundMatches.length} trận đấu
                    </p>
                  </div>

                  {/* Matches Column with Mathematically Aligned Blue Silver Grass Vines */}
                  <div className="flex flex-col flex-1">
                    {(() => {
                      const BASE_SLOT = 284; // Exact slot height for 1 Round 1 pair (2 cards + spacing)

                      // 1. FINAL ROUND
                      if (isLastRound) {
                        const m = roundMatches[0];
                        if (!m) return null;
                        const p1 = m.player1Id ? participants[m.player1Id] : null;
                        const p2 = m.player2Id ? participants[m.player2Id] : null;
                        const isHighlighted =
                          searchQuery.trim() !== '' &&
                          ((p1 && p1.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (p2 && p2.name.toLowerCase().includes(searchQuery.toLowerCase())));

                        const slotHeight = BASE_SLOT * Math.pow(2, Math.max(0, rIdx - 1));

                        return (
                          <div
                            key={m.id}
                            style={{ height: `${slotHeight}px` }}
                            className="flex items-center justify-center"
                          >
                            <div
                              className={`relative transition-all duration-300 ${
                                isHighlighted ? 'scale-105 ring-2 ring-white/80 rounded-xl' : ''
                              }`}
                            >
                              <FinalMatchCard
                                match={m}
                                player1={p1}
                                player2={p2}
                                userRole={userRole}
                                theme={currentBracket.theme}
                                onAdvanceWinner={handleRequestAdvance}
                                onResetMatch={handleRequestReset}
                                onOpenScheduler={onOpenScheduler}
                                onOpenMatchDetails={onOpenMatchDetails}
                                onOpenPlayerBan={handleOpenPlayerBan}
                              />
                            </div>
                          </div>
                        );
                      }

                      // 2. ROUND 1 (rIdx === 0)
                      if (rIdx === 0) {
                        const pairs: [Match, Match | undefined][] = [];
                        for (let i = 0; i < roundMatches.length; i += 2) {
                          pairs.push([roundMatches[i], roundMatches[i + 1]]);
                        }

                        return pairs.map(([mTop, mBottom]) => {
                          const p1Top = mTop.player1Id ? participants[mTop.player1Id] : null;
                          const p2Top = mTop.player2Id ? participants[mTop.player2Id] : null;
                          const isTopHighlighted =
                            searchQuery.trim() !== '' &&
                            ((p1Top && p1Top.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                              (p2Top && p2Top.name.toLowerCase().includes(searchQuery.toLowerCase())));

                          const p1Bottom = mBottom?.player1Id ? participants[mBottom.player1Id] : null;
                          const p2Bottom = mBottom?.player2Id ? participants[mBottom.player2Id] : null;
                          const isBottomHighlighted =
                            Boolean(mBottom) &&
                            searchQuery.trim() !== '' &&
                            ((p1Bottom && p1Bottom.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                              (p2Bottom && p2Bottom.name.toLowerCase().includes(searchQuery.toLowerCase())));

                          return (
                            <div
                              key={mTop.id}
                              style={{ height: `${BASE_SLOT}px` }}
                              className="relative flex flex-col justify-between py-3"
                            >
                              {/* Top Match in Round 1 */}
                              <div
                                className={`relative transition-all duration-300 ${
                                  isTopHighlighted ? 'scale-105 ring-2 ring-white/80 rounded-xl' : ''
                                }`}
                              >
                                <MatchCard
                                  match={mTop}
                                  player1={p1Top}
                                  player2={p2Top}
                                  userRole={userRole}
                                  theme={currentBracket.theme}
                                  onAdvanceWinner={handleRequestAdvance}
                                  onResetMatch={handleRequestReset}
                                  onOpenScheduler={onOpenScheduler}
                                  onOpenMatchDetails={onOpenMatchDetails}
                                  onOpenPlayerBan={handleOpenPlayerBan}
                                />
                              </div>

                              {/* Bottom Match in Round 1 */}
                              {mBottom && (
                                <div
                                  className={`relative transition-all duration-300 ${
                                    isBottomHighlighted ? 'scale-105 ring-2 ring-white/80 rounded-xl' : ''
                                  }`}
                                >
                                  <MatchCard
                                    match={mBottom}
                                    player1={p1Bottom}
                                    player2={p2Bottom}
                                    userRole={userRole}
                                    theme={currentBracket.theme}
                                    onAdvanceWinner={handleRequestAdvance}
                                    onResetMatch={handleRequestReset}
                                    onOpenScheduler={onOpenScheduler}
                                    onOpenMatchDetails={onOpenMatchDetails}
                                    onOpenPlayerBan={handleOpenPlayerBan}
                                  />
                                </div>
                              )}

                              {/* Dây Lam Ngân Thảo Chuẩn Xác 100% */}
                              <BlueSilverVineConnector
                                hasTopWinner={Boolean(mTop.winnerId)}
                                hasBottomWinner={Boolean(mBottom?.winnerId)}
                                isSingle={!mBottom}
                                theme={currentBracket.theme}
                                yTop={64}
                                yBottom={220}
                                totalHeight={BASE_SLOT}
                              />
                            </div>
                          );
                        });
                      }

                      // 3. INTERMEDIATE ROUNDS (rIdx >= 1)
                      const slotHeight = BASE_SLOT * Math.pow(2, rIdx - 1);
                      const pairHeight = slotHeight * 2;

                      const pairs: [Match, Match | undefined][] = [];
                      for (let i = 0; i < roundMatches.length; i += 2) {
                        pairs.push([roundMatches[i], roundMatches[i + 1]]);
                      }

                      return pairs.map(([mTop, mBottom]) => {
                        const p1Top = mTop.player1Id ? participants[mTop.player1Id] : null;
                        const p2Top = mTop.player2Id ? participants[mTop.player2Id] : null;
                        const isTopHighlighted =
                          searchQuery.trim() !== '' &&
                          ((p1Top && p1Top.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (p2Top && p2Top.name.toLowerCase().includes(searchQuery.toLowerCase())));

                        const p1Bottom = mBottom?.player1Id ? participants[mBottom.player1Id] : null;
                        const p2Bottom = mBottom?.player2Id ? participants[mBottom.player2Id] : null;
                        const isBottomHighlighted =
                          Boolean(mBottom) &&
                          searchQuery.trim() !== '' &&
                          ((p1Bottom && p1Bottom.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (p2Bottom && p2Bottom.name.toLowerCase().includes(searchQuery.toLowerCase())));

                        const yTop = slotHeight / 2;
                        const yBottom = slotHeight + slotHeight / 2;

                        return (
                          <div
                            key={mTop.id}
                            style={{ height: `${pairHeight}px` }}
                            className="relative flex flex-col justify-between"
                          >
                            {/* Top Match Cell */}
                            <div
                              style={{ height: `${slotHeight}px` }}
                              className="flex items-center justify-center"
                            >
                              <div
                                className={`relative transition-all duration-300 ${
                                  isTopHighlighted ? 'scale-105 ring-2 ring-white/80 rounded-xl' : ''
                                }`}
                              >
                                <MatchCard
                                  match={mTop}
                                  player1={p1Top}
                                  player2={p2Top}
                                  userRole={userRole}
                                  theme={currentBracket.theme}
                                  onAdvanceWinner={handleRequestAdvance}
                                  onResetMatch={handleRequestReset}
                                  onOpenScheduler={onOpenScheduler}
                                  onOpenMatchDetails={onOpenMatchDetails}
                                  onOpenPlayerBan={handleOpenPlayerBan}
                                />
                              </div>
                            </div>

                            {/* Bottom Match Cell */}
                            {mBottom && (
                              <div
                                style={{ height: `${slotHeight}px` }}
                                className="flex items-center justify-center"
                              >
                                <div
                                  className={`relative transition-all duration-300 ${
                                    isBottomHighlighted ? 'scale-105 ring-2 ring-white/80 rounded-xl' : ''
                                  }`}
                                >
                                  <MatchCard
                                    match={mBottom}
                                    player1={p1Bottom}
                                    player2={p2Bottom}
                                    userRole={userRole}
                                    theme={currentBracket.theme}
                                    onAdvanceWinner={handleRequestAdvance}
                                    onResetMatch={handleRequestReset}
                                    onOpenScheduler={onOpenScheduler}
                                    onOpenMatchDetails={onOpenMatchDetails}
                                    onOpenPlayerBan={handleOpenPlayerBan}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Dây Lam Ngân Thảo Nối Chính Xác Tâm Trận Kế Tiếp */}
                            <BlueSilverVineConnector
                              hasTopWinner={Boolean(mTop.winnerId)}
                              hasBottomWinner={Boolean(mBottom?.winnerId)}
                              isSingle={!mBottom}
                              theme={currentBracket.theme}
                              yTop={yTop}
                              yBottom={yBottom}
                              totalHeight={pairHeight}
                            />
                          </div>
                        );
                      });
                    })()}
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
              onOpenPlayerBan={handleOpenPlayerBan}
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

      {/* Player Ban Hero Modal */}
      {banningModalData && (
        <PlayerBanModal
          match={banningModalData.match}
          playerId={banningModalData.playerId}
          playerName={banningModalData.playerName}
          onClose={() => setBanningModalData(null)}
        />
      )}

    </div>
  );
};
