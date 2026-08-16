import React from 'react';
import { Swords, Volume2, VolumeX, Shield, Trophy, Users, Sparkles, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';
import { BracketId } from '../../types/tournament';

interface HeaderProps {
  activeTab: 'bracket' | 'roster' | 'podium';
  setActiveTab: (tab: 'bracket' | 'roster' | 'podium') => void;
  onOpenLoginModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenLoginModal }) => {
  const {
    selectedBracketId,
    setSelectedBracketId,
    isLoggedIn,
    adminUser,
    logoutAdmin,
    soundEnabled,
    toggleSound,
  } = useTournament();

  const divisionTabs: { id: BracketId; label: string; badge: string; color: string }[] = [
    {
      id: 'bracket-a',
      label: 'Bảng A: Hải Thần',
      badge: 'Chuyên Nghiệp',
      color: 'border-cyan-500/60 text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/40',
    },
    {
      id: 'bracket-b',
      label: 'Bảng B: Sâm Lâm',
      badge: 'Bán Chuyên',
      color: 'border-emerald-500/60 text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/40',
    },
    {
      id: 'bracket-c',
      label: 'Bảng C: Tân Tinh',
      badge: 'Phong Trào',
      color: 'border-lime-500/60 text-lime-400 bg-lime-950/40 hover:bg-lime-900/40',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('bracket')}>
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-0.5 shadow-glow-gold">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Swords className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-gold-gradient font-heading">
                  TÔNG MÔN TRANH BÁ
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  eSports PvP
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans-accent tracking-wide flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Soul Land: Awakening World
              </p>
            </div>
          </div>

          {/* Division Selector Tabs */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            {divisionTabs.map((tab) => {
              const isSelected = selectedBracketId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedBracketId(tab.id)}
                  className={`relative px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 border ${
                    isSelected
                      ? `${tab.color} shadow-lg ring-1 ring-amber-400/40 font-bold scale-[1.02]`
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${isSelected ? 'bg-black/40 text-slate-200' : 'bg-slate-800 text-slate-400'}`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Controls: Sound & Authentication */}
          <div className="flex items-center space-x-3">
            
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              className={`p-2 rounded-lg border transition-all ${
                soundEnabled
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30 shadow-glow-gold'
                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Authentication Button: Login vs Logged-In Admin Badge */}
            {!isLoggedIn ? (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-glow-gold transition-all duration-200 active:scale-95 border border-amber-400/50"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng Nhập Quản Trị</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 bg-slate-900/95 p-1 rounded-xl border border-amber-500/40 shadow-glow-gold">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-bold text-amber-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{adminUser?.name || 'Ban Tổ Chức'}</span>
                  <span className="sm:hidden">BTC</span>
                </div>
                <button
                  onClick={logoutAdmin}
                  title="Đăng xuất khỏi quyền Ban Tổ Chức"
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/50 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">Đăng Xuất</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Sub Navigation Bar for mobile / Tabs */}
        <div className="flex items-center justify-between pb-3 pt-1 border-t border-slate-800/60 overflow-x-auto gap-2">
          
          {/* Mobile Division Switcher */}
          <div className="flex md:hidden items-center space-x-1.5">
            {divisionTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedBracketId(tab.id)}
                className={`px-2.5 py-1 text-xs rounded-md border font-medium whitespace-nowrap ${
                  selectedBracketId === tab.id
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {tab.badge}
              </button>
            ))}
          </div>

          {/* Section Navigation */}
          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={() => setActiveTab('bracket')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'bracket'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Nhánh Đấu</span>
            </button>

            <button
              onClick={() => setActiveTab('podium')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'podium'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Vinh Danh</span>
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'roster'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Tuyển Thủ</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
