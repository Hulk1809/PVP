import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Key, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Sparkles, Send, Copy, Check, LogIn } from 'lucide-react';
import { Participant } from '../../types/tournament';
import { useTournament, generateUsernameFromPlayerName } from '../../store/tournamentStore';
import { PlayerAvatar } from '../common/PlayerAvatar';

interface ClaimAccountModalProps {
  participant: Participant | null;
  onClose: () => void;
}

export const ClaimAccountModal: React.FC<ClaimAccountModalProps> = ({ participant, onClose }) => {
  const { claimPlayerAccount, loginPlayer } = useTournament();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    username: string;
    password: string;
    message?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!participant) return null;

  const username = generateUsernameFromPlayerName(participant.name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Vui lòng nhập đúng định dạng email (ví dụ: yourname@gmail.com)!');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await claimPlayerAccount(participant.id, cleanEmail);
      setResult(res);
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi tạo tài khoản.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `Tài khoản: ${result.username}\nMật khẩu: ${result.password}\nTrang web: https://pvp-rho.vercel.app`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAutoLogin = () => {
    if (!result) return;
    loginPlayer(result.username, result.password);
    onClose();
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

          {!result ? (
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
                    placeholder="ví dụ: yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Hệ thống sẽ gửi tài khoản và mật khẩu về email này, đồng thời hiển thị trực tiếp trên màn hình để bạn sao chép.
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
                  <span>Quy định & Quyền lợi:</span>
                </div>
                <p>• Nhận tài khoản để thực hiện <strong>Cấm Tướng (Ban Hero)</strong> ở các trận đấu của bạn.</p>
                <p>• Nếu lỡ nhập nhầm email, bạn vẫn có thể <strong>Sao Chép</strong> hoặc <strong>Đăng Nhập Ngay</strong> trên màn hình.</p>
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
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs space-y-3">
                <div className="flex items-center space-x-2 font-bold text-sm text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Đã Cấp Tài Khoản Thành Công!</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Thông tin đăng nhập đã được gửi tới <strong>{email}</strong>. Bạn hãy lưu lại hoặc đăng nhập ngay:
                </p>

                {/* Credentials Display Box */}
                <div className="p-3 rounded-lg bg-black/70 border border-white/15 space-y-1.5 font-mono text-xs text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tên Đăng Nhập:</span>
                    <strong className="text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">{result.username}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Mật Khẩu:</span>
                    <strong className="text-yellow-300 bg-yellow-950/60 px-2 py-0.5 rounded border border-yellow-500/30">{result.password}</strong>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-white/20"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã Sao Chép!' : 'Sao Chép Thông Tin'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAutoLogin}
                    className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-400 text-zinc-950 text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md hover:opacity-95 transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Đăng Nhập Ngay</span>
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-[10px] text-slate-400">
                💡 <strong>Mẹo:</strong> Nếu nhập sai email hoặc không nhận được thư, hãy nhấn <em>"Sao Chép Thông Tin"</em> ở trên để lưu lại mật khẩu hoặc nhờ Ban Quản Trị hỗ trợ cấp lại tài khoản.
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  Đóng Cửa Sổ
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
