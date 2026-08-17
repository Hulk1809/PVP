import React, { useState } from 'react';
import { X, Swords, Crown, Trophy, Clock, ThumbsUp, RotateCcw } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';
import { ConfirmWinnerModal, ConfirmActionType } from '../common/ConfirmWinnerModal';
import { PlayerAvatar } from '../common/PlayerAvatar';

interface MatchDetailModalProps {
  matchId: string | null;
  onClose: () => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({ matchId, onClose }) => {
  const { matches, participants, userRole, handleAdvanceWinner, handleResetMatch } = useTournament();
  const [votedPlayer, setVotedPlayer] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmActionType | null>(null);

  if (!matchId || !matches[matchId]) return null;

  const match = matches[matchId];
  const p1 = match.player1Id ? participants[match.player1Id] : null;
  const p2 = match.player2Id ? participants[match.player2Id] : null;

  const formattedTime = new Date(match.scheduledTime).toLocaleString('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const handleVote = (pId: string) => {
    if (votedPlayer) return;
    setVotedPlayer(pId);
  };

  const handleRequestAdvance = (winnerId: string) => {
    const winner = participants[winnerId];
    if (!winner) return;
    const loserId = match.player1Id === winnerId ? match.player2Id : match.player1Id;
    const loser = loserId ? participants[loserId] : null;

    setConfirmAction({
      type: 'advance',
      match,
      winner,
      loser,
    });
  };

  const handleRequestReset = () => {
    const currentWinner = match.winnerId ? participants[match.winnerId] : null;
    setConfirmAction({
      type: 'reset',
      match,
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
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/90 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Swords className="w-5 h-5 text-slate-200" />
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                {match.roundName} {match.isThirdPlaceMatch ? '(Tranh Hạng Ba)' : ''}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* Match Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-black/60 border border-white/15 text-xs">
              <div className="flex items-center space-x-2 text-slate-300 flex-wrap gap-2">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-slate-300" />
                  <span>Thời gian: {formattedTime}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-950/70 text-red-300 border border-red-500/40">
                  Cấm tướng (Ban): Qlinh, Mạc, Hồ Ly
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded bg-white/10 text-slate-200 font-mono border border-white/10">
                  {match.bestOf === 1 ? 'Bo1' : match.bestOf === 3 ? 'Bo3' : 'Bo5'}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded font-semibold ${
                    match.status === 'completed'
                      ? 'bg-white/20 text-slate-100 border border-white/40'
                      : match.status === 'live'
                      ? 'bg-white/25 text-white border border-white/50 animate-pulse shadow-sm'
                      : 'bg-black/50 text-slate-400 border border-white/10'
                  }`}
                >
                  {match.status === 'completed'
                    ? 'Đã kết thúc'
                    : match.status === 'live'
                    ? 'Đang diễn ra'
                    : match.status === 'bye'
                    ? 'Đặc cách'
                    : 'Chưa thi đấu'}
                </span>
              </div>
            </div>

            {/* Score & VS Banner */}
            <div className="flex items-center justify-around py-4 px-6 rounded-2xl bg-black/65 border border-white/15 backdrop-blur-md">
              <div className="text-center">
                <p className="text-3xl font-black text-white font-mono">{match.player1Score}</p>
                <p className="text-xs text-slate-300 mt-1">{p1?.name || 'Đang chờ'}</p>
              </div>

              <div className="px-4 py-1.5 rounded-full bg-white/15 text-white border border-white/30 font-bold text-xs shadow-sm">
                VS
              </div>

              <div className="text-center">
                <p className="text-3xl font-black text-white font-mono">{match.player2Score}</p>
                <p className="text-xs text-slate-300 mt-1">{p2?.name || 'Đang chờ'}</p>
              </div>
            </div>

            {/* Contestants Compare Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Player 1 Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  match.winnerId === p1?.id
                    ? 'bg-white/15 border-white/60 shadow-lg shadow-white/10'
                    : 'bg-black/50 border-white/15'
                }`}
              >
                {p1 ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <PlayerAvatar name={p1.name} size="md" />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-sm font-bold text-white font-heading">{p1.name}</h4>
                          {match.winnerId === p1.id && <Crown className="w-4 h-4 text-white drop-shadow" />}
                        </div>
                        <p className="text-xs text-slate-300">{p1.sect}</p>
                        <p className="text-[11px] text-slate-400 font-mono">Hạt giống #{p1.seedRank}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-200 pt-2 border-t border-white/10">
                      <p><span className="text-slate-400">Võ Hồn:</span> {p1.martialSoul}</p>
                      <p><span className="text-slate-400">Cấp bậc:</span> Lv.{p1.soulLevel} ({p1.soulRank})</p>
                    </div>

                    {/* Fan Prediction Vote Button */}
                    <button
                      onClick={() => handleVote(p1.id)}
                      className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all ${
                        votedPlayer === p1.id
                          ? 'bg-gradient-to-r from-slate-200 to-white text-zinc-950 font-bold border-white shadow-sm'
                          : 'bg-black/60 text-slate-300 hover:bg-white/10 border-white/15'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{votedPlayer === p1.id ? 'Bạn đã dự đoán thắng' : 'Dự đoán thắng'}</span>
                    </button>

                    {/* Admin Select / Change Winner Button */}
                    {userRole === 'admin' && p2 && match.winnerId !== p1.id && (
                      <button
                        onClick={() => handleRequestAdvance(p1.id)}
                        className="w-full py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-slate-200 to-white text-zinc-950 hover:from-white hover:to-slate-100 flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all border border-white/30"
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>{match.status === 'completed' ? `Đổi Người Thắng: ${p1.name}` : `Xác nhận ${p1.name} Thắng`}</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 italic text-xs">
                    Chưa xác định tuyển thủ 1
                  </div>
                )}
              </div>

              {/* Player 2 Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  match.winnerId === p2?.id
                    ? 'bg-white/15 border-white/60 shadow-lg shadow-white/10'
                    : 'bg-black/50 border-white/15'
                }`}
              >
                {p2 ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <PlayerAvatar name={p2.name} size="md" />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-sm font-bold text-white font-heading">{p2.name}</h4>
                          {match.winnerId === p2.id && <Crown className="w-4 h-4 text-white drop-shadow" />}
                        </div>
                        <p className="text-xs text-slate-300">{p2.sect}</p>
                        <p className="text-[11px] text-slate-400 font-mono">Hạt giống #{p2.seedRank}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-200 pt-2 border-t border-white/10">
                      <p><span className="text-slate-400">Võ Hồn:</span> {p2.martialSoul}</p>
                      <p><span className="text-slate-400">Cấp bậc:</span> Lv.{p2.soulLevel} ({p2.soulRank})</p>
                    </div>

                    {/* Fan Prediction Vote Button */}
                    <button
                      onClick={() => handleVote(p2.id)}
                      className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all ${
                        votedPlayer === p2.id
                          ? 'bg-gradient-to-r from-slate-200 to-white text-zinc-950 font-bold border-white shadow-sm'
                          : 'bg-black/60 text-slate-300 hover:bg-white/10 border-white/15'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{votedPlayer === p2.id ? 'Bạn đã dự đoán thắng' : 'Dự đoán thắng'}</span>
                    </button>

                    {/* Admin Select / Change Winner Button */}
                    {userRole === 'admin' && p1 && match.winnerId !== p2.id && (
                      <button
                        onClick={() => handleRequestAdvance(p2.id)}
                        className="w-full py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-slate-200 to-white text-zinc-950 hover:from-white hover:to-slate-100 flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all border border-white/30"
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>{match.status === 'completed' ? `Đổi Người Thắng: ${p2.name}` : `Xác nhận ${p2.name} Thắng`}</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 italic text-xs">
                    Chưa xác định tuyển thủ 2
                  </div>
                )}
              </div>

            </div>

            {/* Admin Reset Button */}
            {userRole === 'admin' && match.status === 'completed' && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleRequestReset}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 flex items-center space-x-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Hủy Kết Quả Trận Này (Hoàn Tác Nhánh)</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      <ConfirmWinnerModal
        action={confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleExecuteConfirmedAction}
      />
    </>
  );
};
