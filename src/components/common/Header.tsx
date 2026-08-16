import React from 'react';
import { Swords, Volume2, VolumeX, Trophy, Users, LogIn, LogOut, ShieldCheck, Flame } from 'lucide-react';
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

  const divisionTabs: { id: BracketId; label: string; badge: string }[] = [
    {
      id: 'bracket-a',
      label: 'Bảng A',
      badge: 'Tối Thượng > 50',
    },
    {
      id: 'bracket-b',
      label: 'Bảng B',
      badge: 'Tối Thượng < 10',
    },
    {
      id: 'bracket-c',
      label: 'Bảng C',
      badge: 'Rực Rỡ',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/25 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* 1. Left: Brand Title */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/80 to-amber-700/80 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center backdrop-blur-md">
              <div className="w-full h-full bg-black/60 rounded-[10px] flex items-center justify-center">
                <Swords className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white font-heading drop-shadow-md">
                  TÔNG MÔN TRANH BÁ
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-sm">
                  PVP 2026
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-zinc-300 font-mono tracking-wider drop-shadow">
                SOUL LAND ESPORTS PLATFORM
              </p>
            </div>
          </div>

          {/* 2. Center: Segmented Division Switcher */}
          <nav className="hidden md:flex items-center p-1 rounded-2xl bg-black/30 backdrop-blur-md border border-white/15 shadow-inner">
            {divisionTabs.map((tab) => {
              const isSelected = selectedBracketId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedBracketId(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-black shadow-md shadow-amber-500/30'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isSelected
                        ? 'bg-black/20 text-zinc-950 font-bold'
                        : 'bg-white/10 text-zinc-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* 3. Right: Sound & Admin Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
                soundEnabled
                  ? 'bg-black/40 text-amber-400 border-amber-500/40 hover:bg-white/10 shadow-sm shadow-amber-500/20'
                  : 'bg-black/30 text-zinc-400 border-white/10 hover:text-zinc-200 hover:bg-white/10'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Admin Session or Login Button */}
            {isLoggedIn && adminUser ? (
              <div className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-amber-500/30 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[11px] font-bold text-white leading-tight font-heading">
                    {adminUser.name}
                  </p>
                  <p className="text-[9px] text-amber-400 font-mono">Quản Trị Viên</p>
                </div>
                <button
                  onClick={logoutAdmin}
                  title="Đăng xuất"
                  className="p-1 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/10 transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/25 active:scale-95 transition-all border border-amber-400/30"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng Nhập</span>
              </button>
            )}

          </div>

        </div>

        {/* Sub-bar: Mobile Division Switcher & Main View Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 py-2 border-t border-white/10">
          
          {/* Mobile Division Selector */}
          <div className="flex md:hidden items-center space-x-1 overflow-x-auto py-1">
            {divisionTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedBracketId(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap backdrop-blur-md ${
                  selectedBracketId === tab.id
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/30'
                    : 'bg-black/30 text-zinc-300 border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* View Tabs */}
          <div className="flex items-center space-x-1.5 ml-auto sm:ml-0 bg-black/25 backdrop-blur-md p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('bracket')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'bracket'
                  ? 'bg-white/15 text-amber-300 font-bold border border-amber-400/40 shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>Nhánh Đấu</span>
            </button>

            <button
              onClick={() => setActiveTab('podium')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'podium'
                  ? 'bg-white/15 text-amber-300 font-bold border border-amber-400/40 shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>Vinh Danh</span>
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'roster'
                  ? 'bg-white/15 text-amber-300 font-bold border border-amber-400/40 shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Danh Sách Tuyển Thủ</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
