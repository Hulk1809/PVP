import React, { useState } from 'react';
import { X, Swords, Crown, Trophy, Clock, Sparkles, ThumbsUp, Shield, Flame, RotateCcw } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';
import { ConfirmWinnerModal, ConfirmActionType } from '../common/ConfirmWinnerModal';

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
        <div className="relative w-full max-w-2xl rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Swords className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white font-heading">
                {match.roundName} {match.isThirdPlaceMatch ? '(Tranh Hạng Ba)' : ''}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Match Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Thời gian: {formattedTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {match.bestOf === 1 ? 'Bo1' : match.bestOf === 3 ? 'Bo3' : 'Bo5'}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded font-semibold ${
                    match.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : match.status === 'live'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {match.status === 'completed'
                    ? 'Đã đấu xong'
                    : match.status === 'live'
                    ? 'Đang diễn ra'
                    : match.status === 'bye'
                    ? 'Đặc cách'
                    : 'Chưa thi đấu'}
                </span>
              </div>
            </div>

            {/* Score & VS Banner */}
            <div className="flex items-center justify-around py-4 px-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800">
              <div className="text-center">
                <p className="text-3xl font-black text-white font-mono">{match.player1Score}</p>
                <p className="text-xs text-slate-400 mt-1">{p1?.name || 'Đang chờ'}</p>
              </div>

              <div className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold text-xs">
                VS
              </div>

              <div className="text-center">
                <p className="text-3xl font-black text-white font-mono">{match.player2Score}</p>
                <p className="text-xs text-slate-400 mt-1">{p2?.name || 'Đang chờ'}</p>
              </div>
            </div>

            {/* Contestants Compare Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Player 1 Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  match.winnerId === p1?.id
                    ? 'bg-amber-500/10 border-amber-500/60 shadow-glow-gold'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                {p1 ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={p1.avatar}
                        alt={p1.name}
                        className="w-14 h-14 rounded-full border-2 border-amber-500/50 object-cover bg-slate-800"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-base font-bold text-white font-heading">{p1.name}</h4>
                          {match.winnerId === p1.id && <Crown className="w-4 h-4 text-amber-400" />}
                        </div>
                        <p className="text-xs text-amber-300 font-medium">{p1.sect}</p>
                        <p className="text-[11px] text-slate-400">Hạt giống #{p1.seedRank}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                      <p><span className="text-slate-500">Võ Hồn:</span> {p1.martialSoul}</p>
                      <p><span className="text-slate-500">Hồn Lực:</span> {p1.soulRank}</p>
                      <p><span className="text-slate-500">Tỉ Lệ Thắng:</span> {p1.winRate}% ({p1.wins}T - {p1.losses}B)</p>
                    </div>

                    {p1.bio && (
                      <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded border border-slate-800/80">
                        "{p1.bio}"
                      </p>
                    )}

                    {/* Fan Prediction Vote Button */}
                    <button
                      onClick={() => handleVote(p1.id)}
                      className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all ${
                        votedPlayer === p1.id
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border-slate-800'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{votedPlayer === p1.id ? 'Bạn đã dự đoán thắng' : 'Dự đoán thắng'}</span>
                    </button>

                    {/* Admin Select / Change Winner Button */}
                    {userRole === 'admin' && p2 && match.winnerId !== p1.id && (
                      <button
                        onClick={() => handleRequestAdvance(p1.id)}
                        className="w-full py-2 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-glow-gold flex items-center justify-center space-x-1.5"
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>{match.status === 'completed' ? `Đổi Người Thắng: ${p1.name}` : `Xác nhận ${p1.name} Thắng`}</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 italic text-sm">
                    Chưa xác định tuyển thủ 1
                  </div>
                )}
              </div>

              {/* Player 2 Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  match.winnerId === p2?.id
                    ? 'bg-amber-500/10 border-amber-500/60 shadow-glow-gold'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                {p2 ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={p2.avatar}
                        alt={p2.name}
                        className="w-14 h-14 rounded-full border-2 border-cyan-500/50 object-cover bg-slate-800"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-base font-bold text-white font-heading">{p2.name}</h4>
                          {match.winnerId === p2.id && <Crown className="w-4 h-4 text-amber-400" />}
                        </div>
                        <p className="text-xs text-cyan-300 font-medium">{p2.sect}</p>
                        <p className="text-[11px] text-slate-400">Hạt giống #{p2.seedRank}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                      <p><span className="text-slate-500">Võ Hồn:</span> {p2.martialSoul}</p>
                      <p><span className="text-slate-500">Hồn Lực:</span> {p2.soulRank}</p>
                      <p><span className="text-slate-500">Tỉ Lệ Thắng:</span> {p2.winRate}% ({p2.wins}T - {p2.losses}B)</p>
                    </div>

                    {p2.bio && (
                      <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded border border-slate-800/80">
                        "{p2.bio}"
                      </p>
                    )}

                    {/* Fan Prediction Vote Button */}
                    <button
                      onClick={() => handleVote(p2.id)}
                      className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all ${
                        votedPlayer === p2.id
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border-slate-800'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{votedPlayer === p2.id ? 'Bạn đã dự đoán thắng' : 'Dự đoán thắng'}</span>
                    </button>

                    {/* Admin Select / Change Winner Button */}
                    {userRole === 'admin' && p1 && match.winnerId !== p2.id && (
                      <button
                        onClick={() => handleRequestAdvance(p2.id)}
                        className="w-full py-2 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-glow-gold flex items-center justify-center space-x-1.5"
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>{match.status === 'completed' ? `Đổi Người Thắng: ${p2.name}` : `Xác nhận ${p2.name} Thắng`}</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 italic text-sm">
                    {match.status === 'bye' ? 'Đặc cách (Không có đối thủ)' : 'Chưa xác định tuyển thủ 2'}
                  </div>
                )}
              </div>

            </div>

            {/* Admin Reset Button if match is completed */}
            {userRole === 'admin' && match.status === 'completed' && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Trận đấu đã hoàn thành. Bạn có thể hoàn tác kết quả để điều chỉnh lại.
                </span>
                <button
                  onClick={handleRequestReset}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-500/40 hover:text-white transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Hủy Kết Quả (Hoàn Tác)</span>
                </button>
              </div>
            )}

            {/* Referee Notes */}
            {match.refereeNote && (
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-start space-x-2">
                <Shield className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-300">Ghi chú Trọng tài: </span>
                  <span>{match.refereeNote}</span>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmWinnerModal
        action={confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleExecuteConfirmedAction}
      />
    </>
  );
};
