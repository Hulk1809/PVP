import React from 'react';
import { Trophy, Clock, CheckCircle2, Flame, Sparkles, Edit2, RotateCcw, Swords, Crown } from 'lucide-react';
import { Match, Participant, UserRole } from '../../types/tournament';

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
  const isReadyToPlay = !isCompleted && !isBye && Boolean(player1 && player2);

  const formattedTime = new Date(match.scheduledTime).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`relative w-72 sm:w-80 rounded-xl transition-all duration-300 group ${
        isCompleted
          ? 'bg-slate-900/90 border border-amber-500/40 shadow-glow-gold'
          : isLive
          ? 'bg-slate-900/90 border-2 border-red-500 shadow-glow-crimson animate-pulse-slow'
          : isBye
          ? 'bg-slate-950/80 border border-purple-500/30'
          : 'bg-slate-900/80 border border-slate-800 hover:border-cyan-500/60 hover:shadow-glow-cyan'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/70 rounded-t-xl border-b border-slate-800/80 text-[11px]">
        <div className="flex items-center space-x-1.5 text-slate-400 font-medium">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{formattedTime}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 font-mono">Bo{match.bestOf}</span>
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-1">
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3 text-amber-400" /> Đã đấu
            </span>
          )}
          {isLive && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-wider animate-pulse">
              <Flame className="w-3 h-3 fill-red-500 text-red-500" /> Trực Tiếp
            </span>
          )}
          {isBye && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-400">
              <Sparkles className="w-3 h-3 text-purple-400" /> Đặc cách
            </span>
          )}
          {!isCompleted && !isLive && !isBye && (
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              {match.roundName}
            </span>
          )}

          {/* Admin Scheduler Button */}
          {userRole === 'admin' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenScheduler(match);
              }}
              title="Chỉnh sửa lịch & thông tin trận"
              className="ml-1.5 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Competitors List */}
      <div
        onClick={() => onOpenMatchDetails(match.id)}
        className="p-2.5 space-y-1.5 cursor-pointer hover:bg-slate-800/30 transition-colors rounded-b-xl"
      >
        {/* Player 1 Row */}
        <div
          className={`flex items-center justify-between p-2 rounded-lg transition-all ${
            match.winnerId && player1 && match.winnerId === player1.id
              ? 'bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/50 shadow-sm'
              : match.winnerId && player1 && match.winnerId !== player1.id
              ? 'opacity-45 bg-slate-950/40'
              : 'bg-slate-950/60 hover:bg-slate-950/90'
          }`}
        >
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            {player1 ? (
              <>
                <div className="relative flex-shrink-0">
                  <img
                    src={player1.avatar}
                    alt={player1.name}
                    className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800 object-cover"
                  />
                  {player1.seedRank && (
                    <span className="absolute -bottom-1 -right-1 text-[9px] font-bold px-1 rounded bg-slate-900 text-amber-300 border border-slate-700">
                      #{player1.seedRank}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-xs font-bold truncate ${
                      match.winnerId === player1.id ? 'text-amber-300 font-heading' : 'text-slate-200'
                    }`}>
                      {player1.name}
                    </span>
                    {match.winnerId === player1.id && (
                      <Crown className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {player1.sect} • Lv.{player1.soulLevel}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 text-slate-500 italic text-xs py-1">
                <div className="w-7 h-7 rounded-full border border-dashed border-slate-800 flex items-center justify-center text-[10px]">
                  ?
                </div>
                <span>Chờ người thắng...</span>
              </div>
            )}
          </div>

          {/* Player 1 Score & Admin 1-Click Advance Button */}
          <div className="flex items-center space-x-2 pl-2">
            {player1 && (
              <span className={`text-sm font-mono font-bold px-2 py-0.5 rounded ${
                match.winnerId === player1.id
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-900 text-slate-300'
              }`}>
                {match.player1Score}
              </span>
            )}

            {userRole === 'admin' && isReadyToPlay && player1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdvanceWinner(match.id, player1.id);
                }}
                title={`Chọn ${player1.name} Thắng (1-Click Advance)`}
                className="px-2 py-1 rounded text-[10px] font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-glow-gold flex items-center gap-1 active:scale-95"
              >
                <Trophy className="w-2.5 h-2.5" /> Thắng
              </button>
            )}
          </div>
        </div>

        {/* Match Divider or VS */}
        <div className="relative flex items-center justify-center my-0.5">
          <div className="w-full border-t border-slate-800/60" />
          <span className="absolute bg-slate-900 px-2 text-[9px] text-slate-500 font-mono">
            VS
          </span>
        </div>

        {/* Player 2 Row */}
        <div
          className={`flex items-center justify-between p-2 rounded-lg transition-all ${
            match.winnerId && player2 && match.winnerId === player2.id
              ? 'bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/50 shadow-sm'
              : match.winnerId && player2 && match.winnerId !== player2.id
              ? 'opacity-45 bg-slate-950/40'
              : 'bg-slate-950/60 hover:bg-slate-950/90'
          }`}
        >
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            {player2 ? (
              <>
                <div className="relative flex-shrink-0">
                  <img
                    src={player2.avatar}
                    alt={player2.name}
                    className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800 object-cover"
                  />
                  {player2.seedRank && (
                    <span className="absolute -bottom-1 -right-1 text-[9px] font-bold px-1 rounded bg-slate-900 text-amber-300 border border-slate-700">
                      #{player2.seedRank}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-xs font-bold truncate ${
                      match.winnerId === player2.id ? 'text-amber-300 font-heading' : 'text-slate-200'
                    }`}>
                      {player2.name}
                    </span>
                    {match.winnerId === player2.id && (
                      <Crown className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {player2.sect} • Lv.{player2.soulLevel}
                  </p>
                </div>
              </>
            ) : isBye ? (
              <div className="flex items-center space-x-2 text-purple-400/80 italic text-xs py-1">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Không có đối thủ (Bye)</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-slate-500 italic text-xs py-1">
                <div className="w-7 h-7 rounded-full border border-dashed border-slate-800 flex items-center justify-center text-[10px]">
                  ?
                </div>
                <span>Chờ người thắng...</span>
              </div>
            )}
          </div>

          {/* Player 2 Score & Admin 1-Click Advance Button */}
          <div className="flex items-center space-x-2 pl-2">
            {player2 && (
              <span className={`text-sm font-mono font-bold px-2 py-0.5 rounded ${
                match.winnerId === player2.id
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-900 text-slate-300'
              }`}>
                {match.player2Score}
              </span>
            )}

            {userRole === 'admin' && isReadyToPlay && player2 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdvanceWinner(match.id, player2.id);
                }}
                title={`Chọn ${player2.name} Thắng (1-Click Advance)`}
                className="px-2 py-1 rounded text-[10px] font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-glow-gold flex items-center gap-1 active:scale-95"
              >
                <Trophy className="w-2.5 h-2.5" /> Thắng
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Reset Action for Admin */}
      {userRole === 'admin' && isCompleted && !isBye && (
        <div className="px-3 py-1 bg-slate-950/90 rounded-b-xl border-t border-slate-800 flex items-center justify-between text-[10px]">
          <span className="text-amber-400/90 font-medium">Trận đã xác nhận kết quả</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResetMatch(match.id);
            }}
            className="flex items-center space-x-1 text-slate-400 hover:text-red-400 transition-colors"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Hủy kết quả</span>
          </button>
        </div>
      )}
    </div>
  );
};
