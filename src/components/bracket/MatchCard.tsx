import React from 'react';
import { Clock, Trophy, Edit3, Crown, RotateCcw, Swords, Sparkles, ShieldX } from 'lucide-react';
import { Match, Participant, UserRole, DivisionTheme } from '../../types/tournament';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { getDivisionTheme } from '../../utils/themeStyles';
import { useTournament, generateUsernameFromPlayerName } from '../../store/tournamentStore';

interface MatchCardProps {
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

export const MatchCard: React.FC<MatchCardProps> = ({
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
  const themeConfig = getDivisionTheme(theme);
  const isCompleted = match.status === 'completed';
  const isBye = match.status === 'bye';
  const isLive = match.status === 'live';

  const timeString = new Date(match.scheduledTime).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isP1Winner = match.winnerId === player1?.id && player1 !== null;
  const isP2Winner = match.winnerId === player2?.id && player2 !== null;

  const isMeP1 = Boolean(
    loggedInPlayer &&
    player1 &&
    (loggedInPlayer.participantId === player1.id ||
      loggedInPlayer.username === (player1.username || generateUsernameFromPlayerName(player1.name)) ||
      generateUsernameFromPlayerName(loggedInPlayer.playerName) === generateUsernameFromPlayerName(player1.name))
  );

  const isMeP2 = Boolean(
    loggedInPlayer &&
    player2 &&
    (loggedInPlayer.participantId === player2.id ||
      loggedInPlayer.username === (player2.username || generateUsernameFromPlayerName(player2.name)) ||
      generateUsernameFromPlayerName(loggedInPlayer.playerName) === generateUsernameFromPlayerName(player2.name))
  );

  return (
    <div
      onClick={() => onOpenMatchDetails(match.id)}
      className={`group relative w-64 sm:w-72 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden border backdrop-blur-xl shadow-lg hover:scale-[1.02] active:scale-[0.99] ${
        isCompleted
          ? `${themeConfig.cardBg} border-white/20 shadow-md`
          : isLive
          ? `${themeConfig.cardBg} border-white/80 ${themeConfig.tabActiveGlow} ring-1 ring-white/50 animate-pulse`
          : isBye
          ? 'bg-black/45 border-white/10 opacity-80'
          : `${themeConfig.cardBg} ${themeConfig.cardBorder} ${themeConfig.cardHoverBorder} hover:bg-black/80`
      }`}
    >
      {/* Corner Metallic Highlights */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/50 pointer-events-none" />
      {/* Top Meta Bar */}
      <div className={`flex items-center justify-between px-2.5 sm:px-3 py-1.5 ${themeConfig.cardTopBarBg} border-b ${themeConfig.cardTopBarBorder} text-[10px] text-zinc-400 gap-1`}>
        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-wrap min-w-0">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="font-mono text-slate-300">{timeString}</span>
          </div>
          <span className="text-slate-500">•</span>
          <span className="font-semibold text-slate-300">
            {match.bestOf === 1 ? 'Bo1' : match.bestOf === 3 ? 'Bo3' : 'Bo5'}
          </span>
          <span className="text-slate-500">•</span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold tracking-tight bg-red-950/70 text-red-300 border border-red-500/40 whitespace-nowrap shadow-sm">
            Ban: Qlinh, Mạc, Hồ Ly
          </span>
        </div>

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          {isCompleted && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-white/15 text-slate-200 border border-white/30">
              FT
            </span>
          )}
          {isLive && (
            <span className={`flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${themeConfig.liveBadgeBg} ${themeConfig.liveBadgeText} ${themeConfig.liveBadgeBorder} animate-pulse shadow-sm`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span> LIVE
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
          isP1Winner ? `${themeConfig.winnerRowBg} font-bold` : isCompleted && !isP1Winner ? 'opacity-40' : ''
        }`}
      >
        <div className="flex items-center space-x-2 min-w-0 flex-1 pr-1.5">
          {player1 ? (
            <>
              <PlayerAvatar name={player1.name} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1">
                  <span className={`text-xs truncate font-medium ${isMeP1 ? 'text-cyan-300 font-bold' : 'text-white'}`}>
                    {player1.name}
                  </span>
                  {isMeP1 && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      Bạn
                    </span>
                  )}
                  {isP1Winner && <Crown className="w-3.5 h-3.5 text-white flex-shrink-0 drop-shadow" />}
                </div>

                <div className="flex items-center space-x-1.5 mt-0.5">
                  <p className="text-[10px] text-slate-400 truncate font-mono">
                    #{player1.seedRank} • Lv.{player1.soulLevel}
                  </p>

                  {/* Player 1 Ban Badge */}
                  {match.player1Ban && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-950/80 text-red-300 border border-red-500/40 truncate max-w-[100px]" title={`Cấm: ${match.player1Ban}`}>
                      🚫 {match.player1Ban}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <span className="text-xs text-slate-500 italic py-1">Chờ người thắng...</span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          {/* Player 1 Ban Action Button */}
          {isMeP1 && player1 && !match.player1Ban && !isCompleted && onOpenPlayerBan && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPlayerBan(match, player1.id, player1.name);
              }}
              title="Cấm tướng cho trận này (1 lần duy nhất)"
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 active:scale-95 transition-all shadow-md shadow-red-600/30 animate-pulse border border-red-400"
            >
              Cấm
            </button>
          )}

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
                ? themeConfig.winnerScoreBg
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
          isP2Winner ? `${themeConfig.winnerRowBg} font-bold` : isCompleted && !isP2Winner ? 'opacity-40' : ''
        }`}
      >
        <div className="flex items-center space-x-2 min-w-0 flex-1 pr-1.5">
          {player2 ? (
            <>
              <PlayerAvatar name={player2.name} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1">
                  <span className={`text-xs truncate font-medium ${isMeP2 ? 'text-cyan-300 font-bold' : 'text-white'}`}>
                    {player2.name}
                  </span>
                  {isMeP2 && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      Bạn
                    </span>
                  )}
                  {isP2Winner && <Crown className="w-3.5 h-3.5 text-white flex-shrink-0 drop-shadow" />}
                </div>

                <div className="flex items-center space-x-1.5 mt-0.5">
                  <p className="text-[10px] text-slate-400 truncate font-mono">
                    #{player2.seedRank} • Lv.{player2.soulLevel}
                  </p>

                  {/* Player 2 Ban Badge */}
                  {match.player2Ban && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-950/80 text-red-300 border border-red-500/40 truncate max-w-[100px]" title={`Cấm: ${match.player2Ban}`}>
                      🚫 {match.player2Ban}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : isBye ? (
            <span className="text-xs text-slate-400 italic py-1">Đặc cách (Không có đối thủ)</span>
          ) : (
            <span className="text-xs text-slate-500 italic py-1">Chờ người thắng...</span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          {/* Player 2 Ban Action Button */}
          {isMeP2 && player2 && !match.player2Ban && !isCompleted && onOpenPlayerBan && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPlayerBan(match, player2.id, player2.name);
              }}
              title="Cấm tướng cho trận này (1 lần duy nhất)"
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 active:scale-95 transition-all shadow-md shadow-red-600/30 animate-pulse border border-red-400"
            >
              Cấm
            </button>
          )}

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
                ? themeConfig.winnerScoreBg
                : 'bg-black/60 text-slate-300 border-white/10'
            }`}
          >
            {match.player2Score}
          </div>
        </div>
      </div>

      {/* Admin Reset Match Option */}
      {userRole === 'admin' && isCompleted && !isBye && (
        <div className="px-3 py-1 bg-black/70 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
          <span>Kết quả đã ghi nhận</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResetMatch(match.id);
            }}
            title="Hủy kết quả & đấu lại"
            className="flex items-center space-x-1 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Hủy</span>
          </button>
        </div>
      )}
    </div>
  );
};
