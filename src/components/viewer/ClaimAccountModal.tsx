import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Key, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import { Participant } from '../../types/tournament';
import { useTournament, generateUsernameFromPlayerName } from '../../store/tournamentStore';
import { PlayerAvatar } from '../common/PlayerAvatar';

interface ClaimAccountModalProps {
  participant: Participant | null;
  onClose: () => void;
}

export const ClaimAccountModal: React.FC<ClaimAccountModalProps> = ({ participant, onClose }) => {
  const { claimPlayerAccount } = useTournament();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!participant) return null;

  const username = generateUsernameFromPlayerName(participant.name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ!');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await claimPlayerAccount(participant.id, cleanEmail);
      if (res.success) {
        setIsSuccess(true);
      } else {
        setError(res.message || 'Không thể tạo tài khoản.');
      }
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi tạo tài khoản.');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-cyan-500/40 shadow-2xl overflow-hidden scale-100">
        
        {/* Glow Accent Top Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-sky-300 to-white" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/90 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Nhận Tài Khoản Tuyển Thủ
              </h3>
              <p className="text-[11px] text-slate-400">
                Cấp quyền đăng nhập & Ban Tướng thi đấu
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
        <div className="p-6 space-y-5">
          {/* Player Info Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-zinc-900/60 to-black/60 border border-cyan-500/30 flex items-center space-x-3.5">
            <PlayerAvatar name={participant.name} size="md" />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white truncate font-heading">
                {participant.name}
              </h4>
              <p className="text-[11px] text-cyan-300">
                {participant.sect} • Lv.{participant.soulLevel}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Tài khoản dự kiến: <strong className="text-white bg-white/10 px-1 py-0.2 rounded">{username}</strong>
              </p>
            </div>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Địa Chỉ Email Nhận Tài Khoản:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="ví dụ: honsu@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Hệ thống sẽ gửi tên đăng nhập và mật khẩu bí mật về email này.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center space-x-1.5 text-cyan-300 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Quyền lợi sau khi nhận tài khoản:</span>
                </div>
                <p>• Đăng nhập để trực tiếp thực hiện <strong>Cấm Tướng (Ban Hero)</strong> ở các trận đấu của bạn.</p>
                <p>• Mật khẩu được bảo mật gửi về email và lưu lại cho các vòng đấu tiếp theo.</p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-white text-zinc-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang Gửi Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Gửi Tài Khoản Về Mail</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs space-y-2.5">
                <div className="flex items-center space-x-2 font-bold text-sm text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Đã Gửi Tài Khoản Về Email Thành Công!</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Thông tin Tên đăng nhập và Mật khẩu đã được gửi đến email: <strong className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded border border-white/20">{email}</strong>.
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam/Quảng cáo) của bạn để lấy mật khẩu đăng nhập.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-slate-200 to-white text-zinc-950 shadow-md hover:bg-white active:scale-95 transition-all"
                >
                  Đã Hiểu & Đóng
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
