import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Shield, Lock, User, KeyRound, Sparkles, Eye, EyeOff, AlertCircle, Swords } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAdmin, loginPlayer } = useTournament();

  const [loginType, setLoginType] = useState<'player' | 'admin'>('player');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    let res: { success: boolean; message?: string };

    if (loginType === 'admin') {
      res = loginAdmin(username, password);
    } else {
      res = loginPlayer(username, password);
    }

    setIsSubmitting(false);

    if (res.success) {
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setError(res.message || 'Tài khoản hoặc mật khẩu không chính xác!');
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-white/20 shadow-2xl overflow-hidden scale-100">
        
        {/* Glow Top Accent */}
        <div className={`h-1.5 w-full ${loginType === 'admin' ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600' : 'bg-gradient-to-r from-cyan-400 via-sky-300 to-white'}`} />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/90 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-lg border ${loginType === 'admin' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'}`}>
              {loginType === 'admin' ? <Shield className="w-5 h-5" /> : <Swords className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                {loginType === 'admin' ? 'Đăng Nhập Ban Tổ Chức' : 'Đăng Nhập Tuyển Thủ'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {loginType === 'admin' ? 'Xác thực quyền quản trị giải đấu' : 'Cấm Tướng & quản lý trận thi đấu'}
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

        {/* Role Switcher Tabs */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-black/60 border border-white/15">
            <button
              type="button"
              onClick={() => {
                setLoginType('player');
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                loginType === 'player'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-sky-500/30 text-cyan-200 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Tuyển Thủ (Hồn Sư)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginType('admin');
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                loginType === 'admin'
                  ? 'bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-200 border border-amber-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Ban Tổ Chức (Admin)</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-300 flex items-start space-x-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {loginType === 'admin' ? 'Tên Tài Khoản Quản Trị' : 'Tên Đăng Nhập Tuyển Thủ (User)'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                placeholder={loginType === 'admin' ? 'parker / nguyen / hieu' : 'ví dụ: tea, ttt, theanh...'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono"
              />
            </div>
            {loginType === 'player' && (
              <p className="text-[10px] text-slate-400 mt-1">
                Chưa có tài khoản? Vào mục <strong>"Danh Sách Tuyển Thủ"</strong> để nhận tài khoản qua Email.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Mật Khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-900/90 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2 ${
              loginType === 'admin'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 hover:from-amber-400 hover:to-amber-500 shadow-glow-gold'
                : 'bg-gradient-to-r from-cyan-400 via-sky-300 to-white text-zinc-950 hover:opacity-95 shadow-glow-cyan'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>{loginType === 'admin' ? 'Xác Thực Quyền BTC' : 'Đăng Nhập Tuyển Thủ'}</span>
          </button>
        </form>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
