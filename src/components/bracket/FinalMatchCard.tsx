import React from 'react';
import { Trophy, Clock, Crown, RotateCcw, Swords, Sparkles, ShieldX, Flame, Zap } from 'lucide-react';
import { Match, Participant, UserRole, DivisionTheme } from '../../types/tournament';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { useTournament } from '../../store/tournamentStore';

interface FinalMatchCardProps {
  match: Match;
  player1: Participant | null;
  player2: Participant | null;
  userRole: UserRole;
  theme?: DivisionTheme;
  onAdvanceWinner: (matchId: string, winnerId: string) => void;
  onResetMatch: (matchId: string) => void;
  onOpenScheduler: (match: Match) => void;
  onOpenMatchDetails: (matchId: string) => void;
  onOpenPlayerBan?: (match: Match, playerId: string, playerName: string) => void;
}

export const FinalMatchCard: React.FC<FinalMatchCardProps> = ({
  match,
  player1,
  player2,
  userRole,
  theme = 'ocean',
  onAdvanceWinner,
  onResetMatch,
  onOpenScheduler,
  onOpenMatchDetails,
  onOpenPlayerBan,
}) => {
  const { loggedInPlayer } = useTournament();
  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';

  const timeString = new Date(match.scheduledTime).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isP1Winner = match.winnerId === player1?.id && player1 !== null;
  const isP2Winner = match.winnerId === player2?.id && player2 !== null;

  const isMeP1 = Boolean(loggedInPlayer && player1 && loggedInPlayer.participantId === player1.id);
  const isMeP2 = Boolean(loggedInPlayer && player2 && loggedInPlayer.participantId === player2.id);

  // Theme-specific Soul Land Visual Configurations
  const getThemeConfig = () => {
    switch (theme) {
      case 'forest':
        return {
          title: 'SỬ LAI KHẮC • CHUNG KẾT',
          subTitle: 'Thập Vạn Niên Thần Thú Chi Chiến',
          tagColor: 'from-emerald-400 via-teal-300 to-amber-300',
          borderColor: 'border-emerald-500/60 hover:border-emerald-400',
          glowRing: 'rgba(16, 185, 129, 0.45)',
          outerRingStroke: '#10b981',
          innerRingStroke: '#f59e0b',
          cardBg: 'bg-gradient-to-b from-zinc-950/95 via-emerald-950/40 to-black/95',
          headerBg: 'bg-gradient-to-r from-emerald-950/90 via-teal-900/80 to-emerald-950/90 border-emerald-500/40',
          badgeText: 'text-emerald-300',
          accentGradient: 'from-emerald-500 to-teal-400',
          glowShadow: 'shadow-[0_0_40px_rgba(16,185,129,0.35)]',
        };
      case 'village':
        return {
          title: 'THIÊN SỨ THẦN TRẬN • CHUNG KẾT',
          subTitle: 'Lục Dực Thần Quang Chi Đỉnh',
          tagColor: 'from-amber-300 via-yellow-200 to-rose-400',
          borderColor: 'border-amber-500/70 hover:border-yellow-300',
          glowRing: 'rgba(245, 158, 11, 0.55)',
          outerRingStroke: '#f59e0b',
          innerRingStroke: '#e11d48',
          cardBg: 'bg-gradient-to-b from-zinc-950/95 via-amber-950/40 to-black/95',
          headerBg: 'bg-gradient-to-r from-amber-950/90 via-yellow-900/80 to-amber-950/90 border-amber-500/50',
          badgeText: 'text-amber-300',
          accentGradient: 'from-amber-500 to-yellow-400',
          glowShadow: 'shadow-[0_0_45px_rgba(245,158,11,0.4)]',
        };
      case 'ocean':
      default:
        return {
          title: 'HẢI THẦN ĐẢO • CHUNG KẾT',
          subTitle: 'Tam Xoa Kích • Tối Thượng Quyết Đấu',
          tagColor: 'from-cyan-300 via-sky-200 to-slate-100',
          borderColor: 'border-cyan-400/60 hover:border-cyan-300',
          glowRing: 'rgba(6, 182, 212, 0.45)',
          outerRingStroke: '#06b6d4',
          innerRingStroke: '#e2e8f0',
          cardBg: 'bg-gradient-to-b from-zinc-950/95 via-cyan-950/40 to-black/95',
          headerBg: 'bg-gradient-to-r from-cyan-950/90 via-sky-900/80 to-cyan-950/90 border-cyan-400/40',
          badgeText: 'text-cyan-300',
          accentGradient: 'from-cyan-400 to-sky-300',
          glowShadow: 'shadow-[0_0_40px_rgba(6,182,212,0.35)]',
        };
    }
  };

  const cfg = getThemeConfig();

  return (
    <div className="relative flex items-center justify-center p-6 sm:p-10 select-none">
      
      {/* 1. DUAL 360° ROTATING SOUL ARRAY (PHÁP TRẬN HỒN HOÀN XOAY TRÒN 360 ĐỘ) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
        
        {/* Outer Rotating Soul Ring - Clockwise (24s) */}
        <svg
          className="w-[420px] h-[420px] sm:w-[480px] sm:h-[480px] animate-[spin_24s_linear_infinite] opacity-65"
          viewBox="0 0 400 400"
          fill="none"
        >
          {/* Outer circle with runic dashes */}
          <circle
            cx="200"
            cy="200"
            r="185"
            stroke={cfg.outerRingStroke}
            strokeWidth="1.5"
            strokeDasharray="6 8 16 8"
            opacity="0.8"
          />
          <circle
            cx="200"
            cy="200"
            r="165"
            stroke={cfg.outerRingStroke}
            strokeWidth="1"
            strokeDasharray="3 9"
            opacity="0.5"
          />
          {/* 8 Soul Runes / Star Node Glyphs */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = 200 + 175 * Math.cos(rad);
            const y = 200 + 175 * Math.sin(rad);
            return (
              <g key={i} transform={`translate(${x}, ${y}) rotate(${angle})`}>
                <polygon points="0,-6 6,0 0,6 -6,0" fill={cfg.outerRingStroke} opacity="0.9" />
                <circle cx="0" cy="0" r="2" fill="#ffffff" />
              </g>
            );
          })}
        </svg>

        {/* Inner Counter-Rotating Divine Array - Counter-Clockwise (14s) */}
        <svg
          className="w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] animate-[spin_14s_linear_infinite] [animation-direction:reverse] opacity-60"
          viewBox="0 0 300 300"
          fill="none"
        >
          {/* Geometric Soul Star Array */}
          <circle
            cx="150"
            cy="150"
            r="135"
            stroke={cfg.innerRingStroke}
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.7"
          />
          {/* Hexagram / Star Lines */}
          <polygon
            points="150,20 260,210 40,210"
            stroke={cfg.innerRingStroke}
            strokeWidth="0.8"
            opacity="0.4"
          />
          <polygon
            points="150,280 260,90 40,90"
            stroke={cfg.innerRingStroke}
            strokeWidth="0.8"
            opacity="0.4"
          />
          {/* Inner pulsating core ring */}
          <circle
            cx="150"
            cy="150"
            r="95"
            stroke={cfg.innerRingStroke}
            strokeWidth="1"
            strokeDasharray="8 4"
            opacity="0.6"
          />
        </svg>

        {/* Ambient Pulsating Glow Center */}
        <div
          className="absolute w-72 h-72 rounded-full blur-3xl opacity-30 animate-pulse pointer-events-none"
          style={{ background: cfg.glowRing }}
        />
      </div>

      {/* 2. GRAND FINAL CHAMPIONSHIP CARD */}
      <div
        onClick={() => onOpenMatchDetails(match.id)}
        className={`group relative z-10 w-72 sm:w-80 rounded-2xl cursor-pointer overflow-hidden border-2 ${cfg.borderColor} ${cfg.cardBg} ${cfg.glowShadow} backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.99]`}
      >
        
        {/* Animated Shimmer Light sweep across card */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

        {/* Ornate Corner Talismans */}
        <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-white/80 pointer-events-none" />
        <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-white/80 pointer-events-none" />
        <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-white/80 pointer-events-none" />
        <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-white/80 pointer-events-none" />

        {/* 🏆 GRAND HEADER BANNER */}
        <div className={`px-3 py-2.5 ${cfg.headerBg} border-b text-center relative overflow-hidden`}>
          {/* Header Crown & Title */}
          <div className="flex items-center justify-center space-x-1.5">
            <Trophy className="w-4 h-4 text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-bounce" />
            <h3 className={`text-xs sm:text-sm font-black uppercase tracking-wider font-heading bg-gradient-to-r ${cfg.tagColor} bg-clip-text text-transparent drop-shadow-md`}>
              {cfg.title}
            </h3>
            <Trophy className="w-4 h-4 text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-bounce" />
          </div>

          <p className="text-[10px] text-slate-300/90 font-medium tracking-wide mt-0.5">
            {cfg.subTitle}
          </p>

          {/* Match Meta Badge Bar */}
          <div className="mt-2 pt-1.5 border-t border-white/15 flex items-center justify-between text-[10px] px-1 text-slate-300">
            <div className="flex items-center space-x-1 font-mono">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{timeString}</span>
            </div>

            <div className="flex items-center space-x-1">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm">
                Bo5 • Đỉnh Phong
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold tracking-tight bg-red-950/80 text-red-300 border border-red-500/50">
                Ban: Qlinh, Mạc, Hồ Ly
              </span>
            </div>

            {userRole === 'admin' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenScheduler(match);
                }}
                title="Sửa giờ trận chung kết"
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/20 transition-colors"
              >
                <Clock className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* ⚔️ CONTESTANT 1 ROW */}
        <div
          className={`relative flex items-center justify-between px-3.5 py-3 border-b border-white/10 transition-colors ${
            isP1Winner
              ? 'bg-gradient-to-r from-amber-500/25 via-white/10 to-transparent'
              : 'hover:bg-white/5'
          }`}
        >
          {player1 ? (
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="relative">
                <PlayerAvatar name={player1.name} size="md" />
                {isP1Winner && (
                  <Crown className="w-4 h-4 text-amber-300 absolute -top-2.5 -right-1 drop-shadow-[0_0_6px_rgba(245,158,11,1)] animate-pulse" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1.5">
                  <span
                    className={`text-xs sm:text-sm font-bold truncate font-heading ${
                      isP1Winner
                        ? 'text-amber-300 font-extrabold drop-shadow'
                        : isMeP1
                        ? 'text-cyan-300'
                        : 'text-white'
                    }`}
                  >
                    {player1.name}
                  </span>
                  {isMeP1 && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      Bạn
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                  <span>{player1.sect}</span>
                  <span>•</span>
                  <span>Lv.{player1.soulLevel}</span>
                </div>

                {/* Banned hero tag */}
                {match.player1Ban && (
                  <div className="mt-1 inline-flex items-center space-x-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-950/70 text-red-300 border border-red-500/40">
                    <span>🚫 Cấm:</span>
                    <strong className="text-red-200">{match.player1Ban}</strong>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 py-1 text-slate-500 italic text-xs">
              <Swords className="w-3.5 h-3.5 opacity-40" />
              <span>Chờ anh hùng tiến vào chung kết...</span>
            </div>
          )}

          {/* Action buttons & Score */}
          <div className="flex items-center space-x-2 flex-shrink-0 pl-2">
            {/* Player Ban Button */}
            {isMeP1 && player1 && !match.player1Ban && !isCompleted && onOpenPlayerBan && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPlayerBan(match, player1.id, player1.name);
                }}
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 active:scale-95 transition-all shadow-md shadow-red-600/40 animate-pulse border border-red-400 flex items-center space-x-1"
              >
                <ShieldX className="w-3 h-3" />
                <span>Cấm</span>
              </button>
            )}

            {/* Admin 1-Click Winner */}
            {userRole === 'admin' && player1 && player2 && !isCompleted && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdvanceWinner(match.id, player1.id);
                }}
                title={`Xác nhận ${player1.name} Vô Địch`}
                className="p-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-300 text-zinc-950 hover:brightness-110 active:scale-90 transition-all shadow-md shadow-amber-500/30"
              >
                <Trophy className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Score */}
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-sm font-black border transition-all ${
                isP1Winner
                  ? 'bg-gradient-to-b from-amber-400 to-yellow-500 text-zinc-950 border-amber-300 shadow-md shadow-amber-500/40'
                  : 'bg-black/60 text-slate-300 border-white/10'
              }`}
            >
              {match.player1Score}
            </span>
          </div>
        </div>

        {/* ⚔️ CONTESTANT 2 ROW */}
        <div
          className={`relative flex items-center justify-between px-3.5 py-3 transition-colors ${
            isP2Winner
              ? 'bg-gradient-to-r from-amber-500/25 via-white/10 to-transparent'
              : 'hover:bg-white/5'
          }`}
        >
          {player2 ? (
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="relative">
                <PlayerAvatar name={player2.name} size="md" />
                {isP2Winner && (
                  <Crown className="w-4 h-4 text-amber-300 absolute -top-2.5 -right-1 drop-shadow-[0_0_6px_rgba(245,158,11,1)] animate-pulse" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1.5">
                  <span
                    className={`text-xs sm:text-sm font-bold truncate font-heading ${
                      isP2Winner
                        ? 'text-amber-300 font-extrabold drop-shadow'
                        : isMeP2
                        ? 'text-cyan-300'
                        : 'text-white'
                    }`}
                  >
                    {player2.name}
                  </span>
                  {isMeP2 && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      Bạn
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                  <span>{player2.sect}</span>
                  <span>•</span>
                  <span>Lv.{player2.soulLevel}</span>
                </div>

                {/* Banned hero tag */}
                {match.player2Ban && (
                  <div className="mt-1 inline-flex items-center space-x-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-950/70 text-red-300 border border-red-500/40">
                    <span>🚫 Cấm:</span>
                    <strong className="text-red-200">{match.player2Ban}</strong>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 py-1 text-slate-500 italic text-xs">
              <Swords className="w-3.5 h-3.5 opacity-40" />
              <span>Chờ anh hùng tiến vào chung kết...</span>
            </div>
          )}

          {/* Action buttons & Score */}
          <div className="flex items-center space-x-2 flex-shrink-0 pl-2">
            {/* Player Ban Button */}
            {isMeP2 && player2 && !match.player2Ban && !isCompleted && onOpenPlayerBan && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPlayerBan(match, player2.id, player2.name);
                }}
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 active:scale-95 transition-all shadow-md shadow-red-600/40 animate-pulse border border-red-400 flex items-center space-x-1"
              >
                <ShieldX className="w-3 h-3" />
                <span>Cấm</span>
              </button>
            )}

            {/* Admin 1-Click Winner */}
            {userRole === 'admin' && player1 && player2 && !isCompleted && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdvanceWinner(match.id, player2.id);
                }}
                title={`Xác nhận ${player2.name} Vô Địch`}
                className="p-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-300 text-zinc-950 hover:brightness-110 active:scale-90 transition-all shadow-md shadow-amber-500/30"
              >
                <Trophy className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Score */}
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-sm font-black border transition-all ${
                isP2Winner
                  ? 'bg-gradient-to-b from-amber-400 to-yellow-500 text-zinc-950 border-amber-300 shadow-md shadow-amber-500/40'
                  : 'bg-black/60 text-slate-300 border-white/10'
              }`}
            >
              {match.player2Score}
            </span>
          </div>
        </div>

        {/* 👑 CHAMPIONSHIP WINNER BANNER (When match completed) */}
        {isCompleted && match.winnerId && (
          <div className="px-3 py-1.5 bg-gradient-to-r from-amber-500/30 via-yellow-400/20 to-amber-500/30 border-t border-amber-400/40 flex items-center justify-between text-[11px] font-bold text-amber-200">
            <div className="flex items-center space-x-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
              <span>TÂN VƯƠNG ĐẤU LA:</span>
              <strong className="text-white font-heading">{player1?.id === match.winnerId ? player1?.name : player2?.name}</strong>
            </div>

            {userRole === 'admin' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResetMatch(match.id);
                }}
                title="Hủy kết quả chung kết"
                className="p-1 rounded text-rose-300 hover:bg-rose-950/60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
