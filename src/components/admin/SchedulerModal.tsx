import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Trophy, Save, Shield } from 'lucide-react';
import { Match, MatchStatus } from '../../types/tournament';
import { useTournament } from '../../store/tournamentStore';

interface SchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
}

export const SchedulerModal: React.FC<SchedulerModalProps> = ({
  isOpen,
  onClose,
  match,
}) => {
  const { participants, handleUpdateMatchDetails, handleAdvanceWinner } = useTournament();

  const [scheduledTime, setScheduledTime] = useState('');
  const [bestOf, setBestOf] = useState<number>(3);
  const [status, setStatus] = useState<MatchStatus>('scheduled');
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [refereeNote, setRefereeNote] = useState('');

  useEffect(() => {
    if (match) {
      // Format ISO string to datetime-local value (YYYY-MM-DDTHH:mm)
      try {
        const d = new Date(match.scheduledTime);
        const iso = d.toISOString().slice(0, 16);
        setScheduledTime(iso);
      } catch {
        setScheduledTime('');
      }
      setBestOf(match.bestOf || 3);
      setStatus(match.status);
      setP1Score(match.player1Score || 0);
      setP2Score(match.player2Score || 0);
      setRefereeNote(match.refereeNote || '');
    }
  }, [match, isOpen]);

  if (!isOpen || !match) return null;

  const p1 = match.player1Id ? participants[match.player1Id] : null;
  const p2 = match.player2Id ? participants[match.player2Id] : null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateMatchDetails(match.id, {
      scheduledTime: new Date(scheduledTime).toISOString(),
      bestOf: Number(bestOf),
      status,
      player1Score: Number(p1Score),
      player2Score: Number(p2Score),
      refereeNote: refereeNote.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white font-heading">
              Điều Hành Trận Đấu & Xếp Lịch
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Match Round Banner */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-amber-400 font-heading">{match.roundName}</span>
            <span className="text-slate-400">
              {p1 ? p1.name : 'Chờ T1'} <span className="text-amber-500 font-bold">VS</span> {p2 ? p2.name : 'Chờ T2'}
            </span>
          </div>

          {/* Scheduled Date Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Thời Gian Thi Đấu (Date-Time Picker)</span>
            </label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500/60 transition-all cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Format Bo */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Thể Thức Thi Đấu
              </label>
              <select
                value={bestOf}
                onChange={(e) => setBestOf(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500/60 transition-all cursor-pointer"
              >
                <option value={1}>Bo1 (Chạm 1 Thắng)</option>
                <option value={3}>Bo3 (Chạm 2 Thắng)</option>
                <option value={5}>Bo5 (Chạm 3 Thắng)</option>
              </select>
            </div>

            {/* Match Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Trạng Thái Trận
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MatchStatus)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500/60 transition-all cursor-pointer"
              >
                <option value="scheduled">Sắp Thi Đấu (Scheduled)</option>
                <option value="live">Đang Diễn Ra (Live)</option>
                <option value="completed">Đã Hoàn Thành (Completed)</option>
                <option value="bye">Đặc Cách (Bye)</option>
              </select>
            </div>
          </div>

          {/* Scores Adjustment */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
              Tỉ Số Hiện Tại
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 truncate">
                  {p1 ? p1.name : 'Tuyển thủ 1'}
                </label>
                <input
                  type="number"
                  min="0"
                  max={bestOf}
                  value={p1Score}
                  onChange={(e) => setP1Score(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg text-sm font-bold bg-slate-950 border border-slate-800 text-amber-400 focus:outline-none focus:border-amber-500/60 text-center"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 truncate">
                  {p2 ? p2.name : 'Tuyển thủ 2'}
                </label>
                <input
                  type="number"
                  min="0"
                  max={bestOf}
                  value={p2Score}
                  onChange={(e) => setP2Score(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg text-sm font-bold bg-slate-950 border border-slate-800 text-cyan-400 focus:outline-none focus:border-cyan-500/60 text-center"
                />
              </div>
            </div>
          </div>

          {/* Referee Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Ghi Chú Của Trọng Tài</span>
            </label>
            <textarea
              rows={2}
              placeholder="VD: Trận đấu tạm hoãn do sự cố mạng, thí sinh đổi võ hồn..."
              value={refereeNote}
              onChange={(e) => setRefereeNote(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500/60 transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Hủy
            </button>

            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-glow-gold transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Cập Nhật Trận Đấu</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
