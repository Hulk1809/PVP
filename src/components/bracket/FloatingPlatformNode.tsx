import React from 'react';
import { Search, Trophy, Crown, Sparkles, Swords, RotateCcw } from 'lucide-react';
import { Match, Participant, UserRole } from '../../types/tournament';
import { getHeroInfo } from '../../assets/characters/soulLandHeroes';

interface FloatingPlatformNodeProps {
  match: Match;
  player1: Participant | null;
  player2: Participant | null;
  userRole: UserRole;
  onAdvanceWinner: (matchId: string, winnerId: string) => void;
  onResetMatch: (matchId: string) => void;
  onOpenScheduler: (match: Match) => void;
  onOpenMatchDetails: (matchId: string) => void;
}

export const FloatingPlatformNode: React.FC<FloatingPlatformNodeProps> = ({
  match,
  player1,
  player2,
  userRole,
  onAdvanceWinner,
  onResetMatch,
  onOpenScheduler,
  onOpenMatchDetails,
}) => {
  const isCompleted = match.status === 'completed';
  const isBye = match.status === 'bye';
  const isLive = match.status === 'live';

  const isP1Winner = match.winnerId === player1?.id && player1 !== null;
  const isP2Winner = match.winnerId === player2?.id && player2 !== null;

  const hero1 = player1 ? getHeroInfo(player1.name, player1.martialSoul, player1.soulLevel, player1.seedRank) : null;
  const hero2 = player2 ? getHeroInfo(player2.name, player2.martialSoul, player2.soulLevel, player2.seedRank) : null;

  return (
    <div className="relative flex flex-col items-center select-none py-2">
      
      {/* 2 Floating Platforms for the 2 Contestants in the Match */}
      <div className="flex flex-col space-y-12 sm:space-y-16">
        
        {/* ======================================================== */}
        {/* 🌟 PLATFORM 1: Contestant 1 */}
        {/* ======================================================== */}
        <div className="relative flex flex-col items-center">
          
          {/* Nametag & Combat Power Banner (Style Game 3Q) */}
          <div className="relative z-20 -mb-2 flex items-center space-x-2 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/60 rounded-xl px-3 py-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.8)] min-w-[200px] justify-between">
            <div className="text-left">
              <p className="text-[10px] text-amber-400 font-mono tracking-wider">
                {hero1?.serverTag || 'Z1522-Z1..'}
              </p>
              <h4 className="text-xs font-black text-white truncate max-w-[130px] font-heading">
                {player1 ? player1.name : 'Đang Chờ...'}
              </h4>
              <p className="text-[10px] font-mono font-bold text-yellow-400">
                {hero1 ? hero1.combatPower : '---'}
              </p>
            </div>

            {/* Circular Search / Inspect Button */}
            <button
              onClick={() => onOpenMatchDetails(match.id)}
              title="Soi thông số võ hồn"
              className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-300 flex items-center justify-center text-zinc-950 shadow-md hover:scale-110 active:scale-95 transition-transform"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Standing Character on Floating Pedestal */}
          <div className="relative flex flex-col items-center mt-1">
            
            {/* Character Sprite & Pose */}
            <div className="relative z-10 w-24 h-28 flex flex-col items-center justify-end pb-2">
              {player1 && hero1 ? (
                <div className={`relative flex flex-col items-center transition-all ${isP1Winner ? 'scale-110 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]' : isCompleted ? 'opacity-50 grayscale-[40%]' : ''}`}>
                  
                  {/* Floating Weapon / Martial Soul Sprite */}
                  <div className="relative mb-1 text-3xl animate-bounce drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
                    {hero1.weaponIcon}
                  </div>

                  {/* Character Title & Crown */}
                  <div className="flex items-center space-x-1 bg-black/80 px-2 py-0.5 rounded-full border border-amber-500/40 text-[9px] font-bold text-amber-300">
                    <span>{hero1.combatPose}</span>
                    {isP1Winner && <Crown className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                  </div>

                  {/* Concentric Glowing Spirit Rings (Hồn Hoàn Dưới Chân) */}
                  <div className="relative mt-1 w-20 h-5 flex items-center justify-center">
                    {/* Ring 1 (Outer - Red/Gold) */}
                    <div className="absolute inset-0 rounded-full border-2 border-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-spin" style={{ animationDuration: '8s' }} />
                    {/* Ring 2 (Middle - Purple/Black) */}
                    <div className="absolute inset-1 rounded-full border-2 border-purple-500/80 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
                    {/* Ring 3 (Inner - Gold Soul Power) */}
                    <div className="absolute inset-2 rounded-full border border-amber-400 bg-amber-400/20 shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
                  </div>

                </div>
              ) : (
                <div className="w-16 h-20 rounded-xl bg-zinc-950/60 border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 text-xs italic">
                  Trống
                </div>
              )}
            </div>

            {/* 3D Isometric Floating Pedestal (Bệ Đá Lục Giác Lơ Lửng) */}
            <div className="relative w-48 sm:w-56 -mt-3">
              {/* Top Pedestal Bevel */}
              <div className="h-7 w-full rounded-t-[100%] bg-gradient-to-r from-amber-700 via-amber-400 to-amber-800 border-t-2 border-x-2 border-amber-300 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center">
                <div className="w-full h-full rounded-t-[100%] bg-gradient-to-b from-red-950 via-zinc-950 to-zinc-950 flex items-center justify-center">
                  <div className="w-3/4 h-1.5 rounded-full bg-amber-500/40 blur-xs" />
                </div>
              </div>

              {/* Bottom Stone Base */}
              <div className="h-4 w-full bg-gradient-to-b from-stone-800 via-stone-900 to-zinc-950 border-x border-b border-amber-600/50 rounded-b-xl shadow-2xl flex items-center justify-center">
                <div className="w-1/2 h-0.5 bg-amber-500/30 rounded" />
              </div>

              {/* Score Plaque Tag (Gắn Ở Thành Trước Bệ Đá) */}
              <div className="absolute left-1/2 -bottom-3.5 -translate-x-1/2 z-20 flex items-center space-x-1.5">
                <div className={`px-4 py-0.5 rounded-full font-mono text-xs font-black border-2 flex items-center justify-center shadow-lg ${
                  isP1Winner
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 border-amber-300 scale-105'
                    : 'bg-gradient-to-r from-red-950 to-zinc-950 text-amber-400 border-amber-500/60'
                }`}>
                  {isCompleted ? `${match.player1Score} : ${match.player2Score}` : 'Bo3'}
                </div>

                {/* Admin 1-Click Winner Button */}
                {userRole === 'admin' && player1 && player2 && !isCompleted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdvanceWinner(match.id, player1.id);
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-md"
                  >
                    Thắng
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* 🌟 PLATFORM 2: Contestant 2 or BYE */}
        {/* ======================================================== */}
        <div className="relative flex flex-col items-center">
          
          {/* Nametag & Combat Power Banner */}
          <div className="relative z-20 -mb-2 flex items-center space-x-2 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/60 rounded-xl px-3 py-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.8)] min-w-[200px] justify-between">
            <div className="text-left">
              <p className="text-[10px] text-amber-400 font-mono tracking-wider">
                {hero2?.serverTag || (isBye ? 'ĐẶC CÁCH' : 'Z1474-Z1..')}
              </p>
              <h4 className="text-xs font-black text-white truncate max-w-[130px] font-heading">
                {player2 ? player2.name : isBye ? 'Không Có Đối Thủ' : 'Đang Chờ...'}
              </h4>
              <p className="text-[10px] font-mono font-bold text-yellow-400">
                {hero2 ? hero2.combatPower : isBye ? 'Tự Động Đi Tiếp' : '---'}
              </p>
            </div>

            {/* Circular Search / Inspect Button */}
            {!isBye && (
              <button
                onClick={() => onOpenMatchDetails(match.id)}
                title="Soi thông số võ hồn"
                className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-300 flex items-center justify-center text-zinc-950 shadow-md hover:scale-110 active:scale-95 transition-transform"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Standing Character on Floating Pedestal */}
          <div className="relative flex flex-col items-center mt-1">
            
            {/* Character Sprite & Pose */}
            <div className="relative z-10 w-24 h-28 flex flex-col items-center justify-end pb-2">
              {player2 && hero2 ? (
                <div className={`relative flex flex-col items-center transition-all ${isP2Winner ? 'scale-110 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]' : isCompleted ? 'opacity-50 grayscale-[40%]' : ''}`}>
                  
                  {/* Floating Weapon / Martial Soul Sprite */}
                  <div className="relative mb-1 text-3xl animate-bounce drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
                    {hero2.weaponIcon}
                  </div>

                  {/* Character Title & Crown */}
                  <div className="flex items-center space-x-1 bg-black/80 px-2 py-0.5 rounded-full border border-amber-500/40 text-[9px] font-bold text-amber-300">
                    <span>{hero2.combatPose}</span>
                    {isP2Winner && <Crown className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                  </div>

                  {/* Concentric Glowing Spirit Rings (Hồn Hoàn Dưới Chân) */}
                  <div className="relative mt-1 w-20 h-5 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-purple-500/80 shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-spin" style={{ animationDuration: '8s' }} />
                    <div className="absolute inset-1 rounded-full border-2 border-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
                    <div className="absolute inset-2 rounded-full border border-amber-400 bg-amber-400/20 shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
                  </div>

                </div>
              ) : isBye ? (
                <div className="w-16 h-20 rounded-xl bg-purple-950/40 border border-purple-500/40 flex flex-col items-center justify-center text-purple-300 p-1 text-center">
                  <Sparkles className="w-5 h-5 text-purple-400 mb-1 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="text-[9px] font-bold uppercase">ĐẶC CÁCH</span>
                </div>
              ) : (
                <div className="w-16 h-20 rounded-xl bg-zinc-950/60 border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 text-xs italic">
                  Trống
                </div>
              )}
            </div>

            {/* 3D Isometric Floating Pedestal */}
            <div className="relative w-48 sm:w-56 -mt-3">
              <div className="h-7 w-full rounded-t-[100%] bg-gradient-to-r from-amber-700 via-amber-400 to-amber-800 border-t-2 border-x-2 border-amber-300 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center">
                <div className="w-full h-full rounded-t-[100%] bg-gradient-to-b from-red-950 via-zinc-950 to-zinc-950 flex items-center justify-center">
                  <div className="w-3/4 h-1.5 rounded-full bg-amber-500/40 blur-xs" />
                </div>
              </div>

              <div className="h-4 w-full bg-gradient-to-b from-stone-800 via-stone-900 to-zinc-950 border-x border-b border-amber-600/50 rounded-b-xl shadow-2xl flex items-center justify-center">
                <div className="w-1/2 h-0.5 bg-amber-500/30 rounded" />
              </div>

              {/* Score Plaque Tag */}
              {!isBye && (
                <div className="absolute left-1/2 -bottom-3.5 -translate-x-1/2 z-20 flex items-center space-x-1.5">
                  <div className={`px-4 py-0.5 rounded-full font-mono text-xs font-black border-2 flex items-center justify-center shadow-lg ${
                    isP2Winner
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 border-amber-300 scale-105'
                      : 'bg-gradient-to-r from-red-950 to-zinc-950 text-amber-400 border-amber-500/60'
                  }`}>
                    {isCompleted ? `${match.player2Score} : ${match.player1Score}` : 'Bo3'}
                  </div>

                  {/* Admin 1-Click Winner Button */}
                  {userRole === 'admin' && player1 && player2 && !isCompleted && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAdvanceWinner(match.id, player2.id);
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-md"
                    >
                      Thắng
                    </button>
                  )}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Admin Undo Button */}
      {userRole === 'admin' && isCompleted && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onResetMatch(match.id);
          }}
          className="mt-6 text-[10px] text-zinc-400 hover:text-rose-400 flex items-center gap-1 bg-zinc-900/90 px-3 py-1 rounded-full border border-amber-500/40 transition-colors shadow-lg"
        >
          <RotateCcw className="w-3 h-3" /> Hủy kết quả
        </button>
      )}

    </div>
  );
};
