import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Key, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Send, AlertTriangle, Sparkles, Check } from 'lucide-react';
import { Participant } from '../../types/tournament';
import { useTournament, generateUsernameFromPlayerName } from '../../store/tournamentStore';
import { PlayerAvatar } from '../common/PlayerAvatar';

interface ClaimAccountModalProps {
  participant: Participant | null;
  onClose: () => void;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const TYPO_DOMAINS: Record<string, string> = {
  'gmai.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmai.co': 'gmail.com',
  'gmai.vn': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'yhaoo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outlook.con': 'outlook.com',
  'iclod.com': 'icloud.com',
  'icloud.con': 'icloud.com',
};

function validateAndCheckTypo(inputEmail: string): { isValid: boolean; suggestion?: string; error?: string } {
  const clean = inputEmail.trim().toLowerCase();
  if (!clean) {
    return { isValid: false, error: 'Vui lòng nhập địa chỉ email!' };
  }

  if (!clean.includes('@')) {
    return { isValid: false, error: 'Email thiếu ký tự "@" (ví dụ: yourname@gmail.com)!' };
  }

  const parts = clean.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { isValid: false, error: 'Định dạng email chưa đúng cấu trúc (ví dụ: yourname@gmail.com)!' };
  }

  const [localPart, domain] = parts;

  // Check known domain typos
  if (TYPO_DOMAINS[domain]) {
    const suggestedEmail = `${localPart}@${TYPO_DOMAINS[domain]}`;
    return {
      isValid: false,
      suggestion: suggestedEmail,
      error: `Có vẻ bạn gõ nhầm tên miền "@${domain}".`,
    };
  }

  if (!domain.includes('.')) {
    return { isValid: false, error: 'Tên miền email thiếu đuôi (ví dụ: .com, .vn)!' };
  }

  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2) {
    return { isValid: false, error: 'Đuôi tên miền email không hợp lệ (ví dụ: .com, .vn)!' };
  }

  if (!EMAIL_REGEX.test(clean)) {
    return { isValid: false, error: 'Địa chỉ email chứa ký tự không hợp lệ!' };
  }

  return { isValid: true };
}

export const ClaimAccountModal: React.FC<ClaimAccountModalProps> = ({ participant, onClose }) => {
  const { claimPlayerAccount } = useTournament();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  if (!participant) return null;

  const username = generateUsernameFromPlayerName(participant.name);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setError(null);
    setSuggestion(null);

    if (val.includes('@') && val.includes('.')) {
      const check = validateAndCheckTypo(val);
      if (check.suggestion) {
        setSuggestion(check.suggestion);
      }
    }
  };

  const handleApplySuggestion = (s: string) => {
    setEmail(s);
    setSuggestion(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    
    // Validate with typo detector
    const check = validateAndCheckTypo(cleanEmail);
    if (!check.isValid) {
      setError(check.error || 'Email không hợp lệ!');
      if (check.suggestion) {
        setSuggestion(check.suggestion);
      }
      return;
    }

    setError(null);
    setSuggestion(null);
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
                    placeholder="ví dụ: yourname@gmail.com"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    disabled={loading}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Hệ thống sẽ kiểm tra và gửi tài khoản bí mật về email này.
                </p>
              </div>

              {/* Typo Auto-Suggestion Alert Box */}
              {suggestion && (
                <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/50 text-xs text-amber-200 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="font-semibold">Phát hiện lỗi gõ sai tên miền:</span>
                  </div>
                  <p className="text-[11px] text-amber-300">
                    Có phải email đúng của bạn là: <strong className="text-white font-mono bg-black/50 px-1.5 py-0.5 rounded">{suggestion}</strong>?
                  </p>
                  <button
                    type="button"
                    onClick={() => handleApplySuggestion(suggestion)}
                    className="w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Bấm Để Tự Động Sửa Thành "{suggestion}"</span>
                  </button>
                </div>
              )}

              {/* General Error Message */}
              {error && !suggestion && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center space-x-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center space-x-1.5 text-cyan-300 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Quy định & Bảo mật:</span>
                </div>
                <p>• Mật khẩu được mã hóa và gửi trực tiếp về email của bạn.</p>
                <p>• Tuyển thủ có quyền <strong>Cấm Tướng (Ban Hero) 1 Lần Duy Nhất</strong> cho mỗi trận đấu.</p>
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
                  disabled={loading || Boolean(suggestion)}
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
                  Thông tin Tên đăng nhập và Mật khẩu đã được gửi an toàn đến hòm thư: <strong className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded border border-white/20">{email}</strong>.
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Vui lòng kiểm tra hộp thư đến (hoặc mục Spam/Quảng cáo) của bạn để lấy mật khẩu đăng nhập.
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
