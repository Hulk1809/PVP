import React from 'react';
import { createPortal } from 'react-dom';
import { X, Trophy, Swords, AlertTriangle, RotateCcw, Crown, ShieldAlert } from 'lucide-react';
import { Match, Participant } from '../../types/tournament';

export type ConfirmActionType = 
  | { type: 'advance'; match: Match; winner: Participant; loser: Participant | null }
  | { type: 'reset'; match: Match; currentWinner: Participant | null };

interface ConfirmWinnerModalProps {
  action: ConfirmActionType | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmWinnerModal: React.FC<ConfirmWinnerModalProps> = ({
  action,
  onClose,
  onConfirm,
}) => {
  if (!action) return null;

  const isAdvance = action.type === 'advance';

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-white/25 shadow-2xl overflow-hidden scale-100">
        
        {/* Glow Accent Top Bar in Platinum Silver / Amber */}
        <div className={`h-1.5 w-full ${isAdvance ? 'bg-gradient-to-r from-slate-300 via-white to-slate-400' : 'bg-gradient-to-r from-red-500 via-slate-200 to-red-600'}`} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/90 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-lg border ${isAdvance ? 'bg-white/15 text-white border-white/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
              {isAdvance ? <Trophy className="w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                {isAdvance ? 'Xác Nhận Kết Quả Trận Đấu' : 'Xác Nhận Hủy Kết Quả'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {action.match.roundName} {action.match.isThirdPlaceMatch ? '(Tranh Hạng Ba)' : ''}
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

        {/* Content */}
        <div className="p-6 space-y-4">
          {isAdvance ? (
            <>
              <p className="text-xs text-slate-300">
                Ban Tổ Chức đang xác nhận kết quả cho trận đấu này. Vui lòng kiểm tra lại đấu thủ chiến thắng:
              </p>

              {/* Winner Highlight Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-white/10 via-white/5 to-transparent border border-white/30 shadow-lg flex items-center space-x-3.5">
                <div className="relative">
                  <img
                    src={action.winner.avatar}
                    alt={action.winner.name}
                    className="w-14 h-14 rounded-full border-2 border-white object-cover bg-zinc-800"
                  />
                  <div className="absolute -top-2 -right-1 text-white">
                    <Crown className="w-4 h-4 fill-white" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-slate-300" /> Đấu Thủ Chiến Thắng
                  </span>
                  <h4 className="text-lg font-black text-white font-heading">
                    {action.winner.name}
                  </h4>
                  <p className="text-xs text-slate-200 font-medium">
                    {action.winner.sect} • Lv.{action.winner.soulLevel}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Võ Hồn: {action.winner.martialSoul}
                  </p>
                </div>
              </div>

              {action.loser && (
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-slate-400 flex items-center justify-between">
                  <span>Dừng bước: <strong className="text-slate-300">{action.loser.name}</strong></span>
                  <span className="text-[11px] text-slate-500">{action.loser.sect}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-white/5 border border-white/15 text-xs text-slate-200 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Đấu thủ thắng sẽ tự động tiến vào vòng tiếp theo. Bạn có thể nhấn <strong>"Hủy kết quả"</strong> hoặc đổi người thắng bất cứ lúc nào nếu bấm nhầm.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 flex items-start space-x-2.5">
                <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  Bạn có chắc chắn muốn hủy kết quả trận đấu này không? Đấu thủ <strong>{action.currentWinner?.name || 'đã thắng'}</strong> sẽ được <strong>rút lại</strong> khỏi nhánh vòng sau và các vòng kế tiếp sẽ hoàn tác về trạng thái chờ.
                </p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              Hủy Bỏ
            </button>

            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 ${
                isAdvance
                  ? 'bg-gradient-to-r from-slate-200 to-white text-zinc-950 hover:from-white hover:to-slate-100 shadow-white/20'
                  : 'bg-red-600 text-white hover:bg-red-500 shadow-red-600/30'
              }`}
            >
              {isAdvance ? (
                <>
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Xác Nhận Người Thắng</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Xác Nhận Hủy Kết Quả</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
