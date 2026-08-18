import React, { useEffect, useState } from 'react';
import { X, Calendar, Swords, Flame, Sparkles, Bell } from 'lucide-react';

interface TournamentAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TournamentAnnouncementModal: React.FC<TournamentAnnouncementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimateIn(true), 20);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-4 transition-all duration-300 ${
        animateIn
          ? 'bg-black/75 backdrop-blur-md opacity-100'
          : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-[460px] max-h-[88vh] sm:max-h-[85vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-zinc-900/95 via-black/95 to-zinc-950/95 border border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)] p-4.5 sm:p-6 text-white transition-all duration-300 transform ${
          animateIn ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
        }`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(245,158,11,0.3) transparent',
        }}
      >
        {/* Decorative Soul Power Glow Elements */}
        <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none" />

        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-all duration-200"
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Header Badge & Title */}
        <div className="flex flex-col items-center text-center mb-3.5 sm:mb-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
            <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>Thông Báo Giải Đấu</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 drop-shadow-md">
            TÔNG MÔN TRANH BÁ
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-1.5" />
        </div>

        {/* Main Content Body */}
        <div className="space-y-2.5 sm:space-y-3.5">
          {/* Card 1: Thời gian bắt đầu */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-zinc-900/60 to-amber-950/40 border border-amber-500/30 flex items-center space-x-3 shadow-inner">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0 text-amber-400 shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-zinc-400 font-medium">Lịch Khởi Tranh Mùa Giải</p>
              <p className="text-sm sm:text-base font-bold text-amber-200 font-sans tracking-wide">
                Thứ Sáu, ngày 21 tháng 8
              </p>
            </div>
          </div>

          {/* Card 2: Lời dặn dò tập luyện */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-900/70 border border-white/10 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-300">
              <Swords className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-slate-200 leading-snug">
                Các tuyển thủ hãy tập luyện thật kỹ lưỡng nhé!
              </p>
            </div>
          </div>

          {/* Card 3: Lời chúc thi đấu bùng nổ */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-red-950/40 via-zinc-900/60 to-red-950/40 border border-red-500/30 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 text-red-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-amber-100 leading-snug">
                Chúc các tuyển thủ có một mùa giải PVP bùng nổ!
              </p>
            </div>
          </div>
        </div>

        {/* Footer Action Button */}
        <div className="mt-4 sm:mt-5 pt-3 border-t border-white/10 flex justify-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Đã Hiểu • Tiếp Tục</span>
          </button>
        </div>
      </div>
    </div>
  );
};
