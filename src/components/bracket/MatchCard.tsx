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
      className={`group relative w-64 sm:w-72 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden border backdrop-blur-md ${
        isCompleted
          ? 'bg-black/65 border-white/20 shadow-md'
          : isLive
          ? 'bg-black/80 border-white/60 shadow-lg shadow-white/15'
          : isBye
          ? 'bg-black/45 border-white/10 opacity-80'
          : 'bg-black/55 border-white/15 hover:border-white/40 hover:bg-black/75'
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-black/60 border-b border-white/10 text-[10px] text-zinc-400">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-3 h-3 text-slate-400" />
          <span className="font-mono">{timeString}</span>
          <span>•</span>
          <span className="font-semibold text-slate-300">
            {match.bestOf === 1 ? 'Bo1' : match.bestOf === 3 ? 'Bo3' : 'Bo5'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {isCompleted && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-white/15 text-slate-200 border border-white/30">
              FT
            </span>
          )}
          {isLive && (
            <span className="flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-white/20 text-white border border-white/40 animate-pulse shadow-sm shadow-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span> LIVE
            </span>
          )}
          {isBye && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-white/10 text-slate-300 border border-white/20">
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
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Contestant 1 Row */}
      <div
        className={`flex items-center justify-between px-3 py-2 border-b border-white/10 transition-colors ${
          isP1Winner ? 'bg-white/15 font-bold' : isCompleted && !isP1Winner ? 'opacity-40' : ''
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
                  {isP1Winner && <Crown className="w-3.5 h-3.5 text-white flex-shrink-0 drop-shadow" />}
                </div>
                <p className="text-[10px] text-slate-400 truncate font-mono">
                  #{player1.seedRank} • Lv.{player1.soulLevel}
                </p>
              </div>
            </>
          ) : (
            <span className="text-xs text-slate-500 italic py-1">Chờ người thắng...</span>
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
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-slate-200 to-white text-zinc-950 hover:from-white hover:to-slate-100 active:scale-95 transition-all shadow-sm"
            >
              Thắng
            </button>
          )}

          {/* Score Box */}
          <div
            className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold border ${
              isP1Winner
                ? 'bg-gradient-to-br from-slate-200 to-white text-zinc-950 border-white shadow-sm shadow-white/30'
                : 'bg-black/60 text-slate-300 border-white/10'
            }`}
          >
            {match.player1Score}
          </div>
        </div>
      </div>

      {/* Contestant 2 Row */}
      <div
        className={`flex items-center justify-between px-3 py-2 transition-colors ${
          isP2Winner ? 'bg-white/15 font-bold' : isCompleted && !isP2Winner ? 'opacity-40' : ''
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
                  {isP2Winner && <Crown className="w-3.5 h-3.5 text-white flex-shrink-0 drop-shadow" />}
                </div>
                <p className="text-[10px] text-slate-400 truncate font-mono">
                  #{player2.seedRank} • Lv.{player2.soulLevel}
                </p>
              </div>
            </>
          ) : isBye ? (
            <span className="text-xs text-slate-400 italic py-1">Đặc cách (Không có đối thủ)</span>
          ) : (
            <span className="text-xs text-slate-500 italic py-1">Chờ người thắng...</span>
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
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-slate-200 to-white text-zinc-950 hover:from-white hover:to-slate-100 active:scale-95 transition-all shadow-sm"
            >
              Thắng
            </button>
          )}

          {/* Score Box */}
          <div
            className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold border ${
              isP2Winner
                ? 'bg-gradient-to-br from-slate-200 to-white text-zinc-950 border-white shadow-sm shadow-white/30'
                : 'bg-black/60 text-slate-300 border-white/10'
            }`}
          >
            {match.player2Score}
          </div>
        </div>
      </div>

      {/* Admin Reset Button if completed */}
      {userRole === 'admin' && isCompleted && !isBye && (
        <div className="px-3 py-1 bg-black/80 border-t border-white/10 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResetMatch(match.id);
            }}
            className="flex items-center space-x-1 text-[10px] text-slate-400 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Hủy kết quả</span>
          </button>
        </div>
      )}
    </div>
  );
};
