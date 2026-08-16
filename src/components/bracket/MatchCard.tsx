import React from 'react';
import { Clock, Trophy, Edit3, Crown, RotateCcw, Swords, Sparkles } from 'lucide-react';
import { Match, Participant, UserRole } from '../../types/tournament';
import { PlayerAvatar } from '../common/PlayerAvatar';

interface MatchCardProps {
  match: Match;
  player1: Participant | null;
  player2: Participant | null;
  userRole: UserRole;
  onAdvanceWinner: (matchId: string, winnerId: string) => void;
  onResetMatch: (matchId: string) => void;
  onOpenScheduler: (match: Match) => void;
  onOpenMatchDetails: (matchId: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
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

  const timeString = new Date(match.scheduledTime).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isP1Winner = match.winnerId === player1?.id && player1 !== null;
  const isP2Winner = match.winnerId === player2?.id && player2 !== null;

  return (
    <div
      onClick={() => onOpenMatchDetails(match.id)}
      className={`group relative w-64 sm:w-72 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden border ${
        isCompleted
          ? 'bg-zinc-900/90 border-zinc-700/80 shadow-md'
          : isLive
          ? 'bg-zinc-900/95 border-amber-500/80 shadow-lg shadow-amber-500/10'
          : isBye
          ? 'bg-zinc-950/70 border-zinc-800/60 opacity-80'
          : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/90'
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-950/80 border-b border-zinc-800/80 text-[10px] text-zinc-400">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-3 h-3 text-zinc-500" />
          <span className="font-mono">{timeString}</span>
          <span>•</span>
          <span className="font-semibold text-zinc-300">
            {match.bestOf === 1 ? 'Bo1' : match.bestOf === 3 ? 'Bo3' : 'Bo5'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {isCompleted && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              FT
            </span>
          )}
          {isLive && (
            <span className="flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> LIVE
            </span>
          )}
          {isBye && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/30">
              ĐẶC CÁCH
            </span>
          )}

          {userRole === 'admin' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenScheduler(match);
              }}
              title="Chỉnh sửa giờ & tỉ số"
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Contestant 1 Row */}
      <div
        className={`flex items-center justify-between px-3 py-2 border-b border-zinc-800/50 transition-colors ${
          isP1Winner ? 'bg-amber-500/10 font-bold' : isCompleted && !isP1Winner ? 'opacity-40' : ''
        }`}
      >
        <div className="flex items-center space-x-2.5 min-w-0 flex-1 pr-2">
          {player1 ? (
            <>
              <PlayerAvatar name={player1.name} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-white truncate font-medium">
                    {player1.name}
                  </span>
                  {isP1Winner && <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                </div>
                <p className="text-[10px] text-zinc-500 truncate font-mono">
                  #{player1.seedRank} • Lv.{player1.soulLevel}
                </p>
              </div>
            </>
          ) : (
            <span className="text-xs text-zinc-500 italic py-1">Chờ người thắng...</span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          {/* Admin 1-Click Winner Button */}
          {userRole === 'admin' && player1 && player2 && !isCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdvanceWinner(match.id, player1.id);
              }}
              title="Chọn người thắng"
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-sm"
            >
              Thắng
            </button>
          )}

          {/* Score Box */}
          <div
            className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold border ${
              isP1Winner
                ? 'bg-amber-500 text-zinc-950 border-amber-400 font-black'
                : 'bg-zinc-950 text-zinc-300 border-zinc-800'
            }`}
          >
            {match.player1Score}
          </div>
        </div>
      </div>

      {/* Contestant 2 Row */}
      <div
        className={`flex items-center justify-between px-3 py-2 transition-colors ${
          isP2Winner ? 'bg-amber-500/10 font-bold' : isCompleted && !isP2Winner && !isBye ? 'opacity-40' : ''
        }`}
      >
        <div className="flex items-center space-x-2.5 min-w-0 flex-1 pr-2">
          {player2 ? (
            <>
              <PlayerAvatar name={player2.name} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-white truncate font-medium">
                    {player2.name}
                  </span>
                  {isP2Winner && <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                </div>
                <p className="text-[10px] text-zinc-500 truncate font-mono">
                  #{player2.seedRank} • Lv.{player2.soulLevel}
                </p>
              </div>
            </>
          ) : isBye ? (
            <span className="text-[11px] text-purple-400/80 italic py-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Đặc cách (Không có đối thủ)
            </span>
          ) : (
            <span className="text-xs text-zinc-500 italic py-1">Chờ người thắng...</span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          {/* Admin 1-Click Winner Button */}
          {userRole === 'admin' && player1 && player2 && !isCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdvanceWinner(match.id, player2.id);
              }}
              title="Chọn người thắng"
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-sm"
            >
              Thắng
            </button>
          )}

          {/* Score Box */}
          {!isBye && (
            <div
              className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold border ${
                isP2Winner
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 font-black'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800'
              }`}
            >
              {match.player2Score}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Admin Reset Button if completed */}
      {userRole === 'admin' && isCompleted && (
        <div className="px-3 py-1 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between text-[10px]">
          <span className="text-zinc-500">Đã xác nhận</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResetMatch(match.id);
            }}
            className="text-zinc-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-2.5 h-2.5" /> Hủy kết quả
          </button>
        </div>
      )}
    </div>
  );
};
