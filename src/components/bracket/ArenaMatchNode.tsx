import React from 'react';
import { Search, Trophy, Crown, Sparkles, Clock, Swords, ShieldCheck, RotateCcw } from 'lucide-react';
import { Match, Participant, UserRole } from '../../types/tournament';
import { getCharacterVisual } from '../../assets/characters/soulLandSprites';

interface ArenaMatchNodeProps {
  match: Match;
  player1: Participant | null;
  player2: Participant | null;
  userRole: UserRole;
  onAdvanceWinner: (matchId: string, winnerId: string) => void;
  onResetMatch: (matchId: string) => void;
  onOpenScheduler: (match: Match) => void;
  onOpenMatchDetails: (matchId: string) => void;
}

export const ArenaMatchNode: React.FC<ArenaMatchNodeProps> = ({
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

  const visual1 = player1 ? getCharacterVisual(player1.name, player1.martialSoul) : null;
  const visual2 = player2 ? getCharacterVisual(player2.name, player2.martialSoul) : null;

  const timeString = new Date(match.scheduledTime).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      onClick={() => onOpenMatchDetails(match.id)}
      className="group relative flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-[1.02]"
    >
      
      {/* 1. Top Match Status & Info Badge */}
      <div className="mb-2 flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-zinc-950/90 border border-amber-500/40 text-[10px] shadow-lg">
        <span className="font-mono text-zinc-400">{timeString}</span>
        <span className="text-zinc-600">•</span>
        <span className="font-bold text-amber-400">
          {match.bestOf === 1 ? 'Bo1' : match.bestOf === 3 ? 'Bo3' : 'Bo5'}
        </span>
        {isLive && (
          <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-600 text-white animate-pulse">
            LIVE
          </span>
        )}
        {isCompleted && (
          <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-600/80 text-emerald-100">
            KẾT THÚC
          </span>
        )}
      </div>

      {/* 2. Main Match Arena: Two Battle Pedestals Facing Each Other or Stacked */}
      <div className="relative flex flex-col space-y-4">
        
        {/* ======================================================== */}
        {/* PEDESTAL 1: Contestant 1 */}
        {/* ======================================================== */}
        <div
          className={`relative w-72 sm:w-80 rounded-2xl transition-all duration-300 p-3 ${
            isP1Winner
              ? 'bg-gradient-to-b from-amber-950/80 via-zinc-900/90 to-zinc-950 border-2 border-amber-400/90 shadow-[0_0_25px_rgba(245,158,11,0.35)]'
              : isCompleted && !isP1Winner
              ? 'bg-zinc-950/80 border border-zinc-800/80 opacity-60 grayscale-[30%]'
              : 'bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 border border-amber-500/30 hover:border-amber-400/60 shadow-xl'
          }`}
        >
          {/* Standing Character Visual & Name Tag */}
          <div className="flex items-center space-x-3">
            
            {/* 3D Battle Standing Sprite / Avatar */}
            <div className="relative flex-shrink-0">
              {player1 && visual1 ? (
                <div className="relative flex flex-col items-center">
                  
                  {/* Standing Hero Visual Box */}
                  <div
                    className={`relative w-16 h-20 rounded-xl overflow-hidden flex flex-col items-center justify-end p-1 border-2 shadow-lg ${
                      isP1Winner
                        ? 'border-amber-400 bg-gradient-to-b from-amber-500/30 to-zinc-950'
                        : 'border-zinc-700 bg-gradient-to-b from-zinc-800/80 to-zinc-950'
                    }`}
                  >
                    {/* Martial Aura Halo */}
                    <div
                      className="absolute inset-0 opacity-40 blur-sm pointer-events-none"
                      style={{ background: visual1.ringColor }}
                    />

                    {/* Martial Icon Symbol */}
                    <span className="text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-0.5 animate-bounce">
                      {visual1.avatarIcon}
                    </span>

                    {/* Character Tag */}
                    <span className="text-[9px] font-bold text-white bg-black/70 px-1 rounded uppercase tracking-wider">
                      {visual1.roleTitle}
                    </span>

                    {isP1Winner && (
                      <Crown className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 drop-shadow-md" />
                    )}
                  </div>

                  {/* 3D Pedestal Base Under Feet */}
                  <div className="w-18 h-2.5 -mt-1 rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 border border-amber-400/80 shadow-md shadow-amber-500/50" />
                </div>
              ) : (
                <div className="w-16 h-20 rounded-xl bg-zinc-950 border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 text-xs italic">
                  Chờ
                </div>
              )}
            </div>

            {/* Nametag & Stats Banner (Style Game 3Q) */}
            <div className="min-w-0 flex-1">
              {player1 ? (
                <div>
                  {/* Top line: Clan / Server */}
                  <div className="flex items-center justify-between text-[10px] text-amber-400/90 font-mono">
                    <span className="truncate">GOD • Tông Môn</span>
                    <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                      #{player1.seedRank}
                    </span>
                  </div>

                  {/* Main Line: Name */}
                  <h4 className="text-sm font-black text-white truncate tracking-wide font-heading mt-0.5 group-hover:text-amber-300 transition-colors">
                    {player1.name}
                  </h4>

                  {/* Sub Line: Martial Soul & Level */}
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-300 truncate max-w-[130px] font-medium">
                      {player1.martialSoul}
                    </span>
                    <span className="font-mono font-bold text-amber-400 text-[10px]">
                      Lv.{player1.soulLevel}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-zinc-500 italic">Chờ tuyển thủ thắng vòng trước...</span>
              )}
            </div>

          </div>

          {/* Pedestal Bottom Score / Control Bar */}
          <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-400">
              {player1 ? `${player1.winRate}% Tỉ lệ thắng` : 'Chờ bắt cặp'}
            </span>

            <div className="flex items-center space-x-2">
              {/* Admin Advance Winner */}
              {userRole === 'admin' && player1 && player2 && !isCompleted && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdvanceWinner(match.id, player1.id);
                  }}
                  className="px-2.5 py-1 rounded text-[10px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/30 active:scale-95 transition-all"
                >
                  ⚔️ Thắng
                </button>
              )}

              {/* Pedestal Metallic Score Plaque */}
              <div
                className={`px-3 py-0.5 rounded-lg font-mono text-xs font-black border flex items-center justify-center shadow-md ${
                  isP1Winner
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 border-amber-300 scale-105'
                    : 'bg-zinc-950 text-amber-400 border-zinc-800'
                }`}
              >
                {match.player1Score}
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* PEDESTAL 2: Contestant 2 or BYE */}
        {/* ======================================================== */}
        <div
          className={`relative w-72 sm:w-80 rounded-2xl transition-all duration-300 p-3 ${
            isP2Winner
              ? 'bg-gradient-to-b from-amber-950/80 via-zinc-900/90 to-zinc-950 border-2 border-amber-400/90 shadow-[0_0_25px_rgba(245,158,11,0.35)]'
              : isCompleted && !isP2Winner && !isBye
              ? 'bg-zinc-950/80 border border-zinc-800/80 opacity-60 grayscale-[30%]'
              : isBye
              ? 'bg-purple-950/30 border border-purple-500/40 shadow-md shadow-purple-500/10'
              : 'bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 border border-amber-500/30 hover:border-amber-400/60 shadow-xl'
          }`}
        >
          {/* Standing Character Visual & Name Tag */}
          <div className="flex items-center space-x-3">
            
            {/* 3D Battle Standing Sprite / Avatar */}
            <div className="relative flex-shrink-0">
              {player2 && visual2 ? (
                <div className="relative flex flex-col items-center">
                  
                  {/* Standing Hero Visual Box */}
                  <div
                    className={`relative w-16 h-20 rounded-xl overflow-hidden flex flex-col items-center justify-end p-1 border-2 shadow-lg ${
                      isP2Winner
                        ? 'border-amber-400 bg-gradient-to-b from-amber-500/30 to-zinc-950'
                        : 'border-zinc-700 bg-gradient-to-b from-zinc-800/80 to-zinc-950'
                    }`}
                  >
                    {/* Martial Aura Halo */}
                    <div
                      className="absolute inset-0 opacity-40 blur-sm pointer-events-none"
                      style={{ background: visual2.ringColor }}
                    />

                    {/* Martial Icon Symbol */}
                    <span className="text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-0.5 animate-bounce">
                      {visual2.avatarIcon}
                    </span>

                    {/* Character Tag */}
                    <span className="text-[9px] font-bold text-white bg-black/70 px-1 rounded uppercase tracking-wider">
                      {visual2.roleTitle}
                    </span>

                    {isP2Winner && (
                      <Crown className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 drop-shadow-md" />
                    )}
                  </div>

                  {/* 3D Pedestal Base Under Feet */}
                  <div className="w-18 h-2.5 -mt-1 rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 border border-amber-400/80 shadow-md shadow-amber-500/50" />
                </div>
              ) : isBye ? (
                <div className="w-16 h-20 rounded-xl bg-purple-950/60 border border-purple-500/50 flex flex-col items-center justify-center text-purple-300 p-1 text-center shadow-md">
                  <Sparkles className="w-5 h-5 text-purple-400 mb-1 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">ĐẶC CÁCH</span>
                </div>
              ) : (
                <div className="w-16 h-20 rounded-xl bg-zinc-950 border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 text-xs italic">
                  Chờ
                </div>
              )}
            </div>

            {/* Nametag & Stats Banner */}
            <div className="min-w-0 flex-1">
              {player2 ? (
                <div>
                  {/* Top line: Clan / Server */}
                  <div className="flex items-center justify-between text-[10px] text-amber-400/90 font-mono">
                    <span className="truncate">GOD • Tông Môn</span>
                    <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                      #{player2.seedRank}
                    </span>
                  </div>

                  {/* Main Line: Name */}
                  <h4 className="text-sm font-black text-white truncate tracking-wide font-heading mt-0.5 group-hover:text-amber-300 transition-colors">
                    {player2.name}
                  </h4>

                  {/* Sub Line: Martial Soul & Level */}
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-300 truncate max-w-[130px] font-medium">
                      {player2.martialSoul}
                    </span>
                    <span className="font-mono font-bold text-amber-400 text-[10px]">
                      Lv.{player2.soulLevel}
                    </span>
                  </div>
                </div>
              ) : isBye ? (
                <div className="py-1">
                  <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Không có đối thủ (Bye)
                  </h4>
                  <p className="text-[10px] text-purple-400/70 mt-0.5">
                    Đấu thủ đối diện tiến thẳng vòng sau
                  </p>
                </div>
              ) : (
                <span className="text-xs text-zinc-500 italic">Chờ tuyển thủ thắng vòng trước...</span>
              )}
            </div>

          </div>

          {/* Pedestal Bottom Score / Control Bar */}
          {!isBye && (
            <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400">
                {player2 ? `${player2.winRate}% Tỉ lệ thắng` : 'Chờ bắt cặp'}
              </span>

              <div className="flex items-center space-x-2">
                {/* Admin Advance Winner */}
                {userRole === 'admin' && player1 && player2 && !isCompleted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdvanceWinner(match.id, player2.id);
                    }}
                    className="px-2.5 py-1 rounded text-[10px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/30 active:scale-95 transition-all"
                  >
                    ⚔️ Thắng
                  </button>
                )}

                {/* Pedestal Metallic Score Plaque */}
                <div
                  className={`px-3 py-0.5 rounded-lg font-mono text-xs font-black border flex items-center justify-center shadow-md ${
                    isP2Winner
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 border-amber-300 scale-105'
                      : 'bg-zinc-950 text-amber-400 border-zinc-800'
                  }`}
                >
                  {match.player2Score}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Admin Undo Button if completed */}
      {userRole === 'admin' && isCompleted && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onResetMatch(match.id);
          }}
          className="mt-2 text-[10px] text-zinc-400 hover:text-rose-400 flex items-center gap-1 bg-zinc-900/90 px-2 py-0.5 rounded-full border border-zinc-800 transition-colors shadow-sm"
        >
          <RotateCcw className="w-2.5 h-2.5" /> Hủy kết quả
        </button>
      )}

    </div>
  );
};
