import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldAlert, Swords, CheckCircle2, AlertTriangle, Sparkles, ShieldX } from 'lucide-react';
import { Match } from '../../types/tournament';
import { useTournament } from '../../store/tournamentStore';

interface PlayerBanModalProps {
  match: Match | null;
  playerId: string;
  playerName: string;
  onClose: () => void;
}

const POPULAR_BANS = [
  'Độc Cô Bác',
  'Bạch Trầm Hương',
  'Đới Mộc Bạch',
  'Áo Tư Tạp',
  'Mã Hồng Tuấn',
  'Ninh Vinh Vinh',
  'Liễu Nhị Long',
  'Thiên Nhận Tuyết',
  'Bỉ Bỉ Đông',
  'Ba Tắc Tây',
  'Đường Thần',
  'Thiên Đạo Lưu',
  'Quỷ Mị',
  'Cúc Đấu La',
  'Phong Tiếu Thiên',
  'Hỏa Vũ',
];

export const PlayerBanModal: React.FC<PlayerBanModalProps> = ({
  match,
  playerId,
  playerName,
  onClose,
}) => {
  const { submitPlayerBan } = useTournament();
  const [selectedHero, setSelectedHero] = useState('');
  const [customHero, setCustomHero] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!match) return null;

  const targetHero = customHero.trim() || selectedHero;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetHero) {
      setError('Vui lòng chọn hoặc nhập tên tướng muốn cấm!');
      return;
    }

    const res = submitPlayerBan(match.id, playerId, targetHero);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Không thể cấm tướng.');
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-red-500/40 shadow-2xl overflow-hidden scale-100">
        
        {/* Glow Accent Top Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-amber-400 to-red-600" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/90 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
              <ShieldX className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Cấm Tướng Thi Đấu (Ban Hero)
              </h3>
              <p className="text-[11px] text-slate-400">
                Tuyển thủ: <strong className="text-white">{playerName}</strong> • {match.roundName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Warning Banner */}
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-start space-x-2.5">
            <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-[11px] leading-relaxed">
              <p className="font-bold text-red-300">⚠️ QUY ĐỊNH CẤM TƯỚNG NGHIÊM NGẶT:</p>
              <p>Bạn chỉ được cấm <strong>1 lần duy nhất</strong> cho trận đấu này. Sau khi xác nhận gửi, hệ thống sẽ <strong>khóa vĩnh viễn và không thể chỉnh sửa</strong>.</p>
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Chọn Nhanh Tướng Cấm Phổ Biến:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
              {POPULAR_BANS.map((hero) => {
                const isSelected = selectedHero === hero && !customHero;
                return (
                  <button
                    key={hero}
                    type="button"
                    onClick={() => {
                      setSelectedHero(hero);
                      setCustomHero('');
                      setError(null);
                    }}
                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold transition-all border text-left truncate ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-400 shadow-md shadow-red-600/30'
                        : 'bg-zinc-900/80 text-slate-300 border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    {hero}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Hoặc Nhập Tên Tướng Khác Muốn Cấm:
            </label>
            <input
              type="text"
              placeholder="Nhập tên hồn sư / võ hồn..."
              value={customHero}
              onChange={(e) => {
                setCustomHero(e.target.value);
                if (e.target.value) setSelectedHero('');
                setError(null);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all"
            />
          </div>

          {/* Selection Preview */}
          {targetHero && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/15 flex items-center justify-between text-xs">
              <span className="text-slate-400">Tướng bạn sẽ cấm:</span>
              <span className="font-bold text-base text-red-400 bg-red-950/60 px-3 py-1 rounded-lg border border-red-500/40">
                🚫 {targetHero}
              </span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={!targetHero}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white shadow-lg shadow-red-600/30 hover:from-red-500 hover:to-red-600 active:scale-95 transition-all disabled:opacity-50"
            >
              <ShieldX className="w-4 h-4" />
              <span>Xác Nhận Cấm Tướng (Khóa)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
