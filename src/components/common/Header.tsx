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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#090a0f]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* 1. Left: Brand Title */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Swords className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white font-heading">
                  TÔNG MÔN TRANH BÁ
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  PVP 2026
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 font-mono tracking-wider">
                SOUL LAND ESPORTS PLATFORM
              </p>
            </div>
          </div>

          {/* 2. Center: Segmented Division Switcher */}
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-zinc-900/90 border border-zinc-800/80">
            {divisionTabs.map((tab) => {
              const isSelected = selectedBracketId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedBracketId(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isSelected
                        ? 'bg-black/20 text-zinc-950'
                        : 'bg-zinc-800 text-zinc-400'
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
              className={`p-2 rounded-xl border transition-all ${
                soundEnabled
                  ? 'bg-zinc-900 text-amber-400 border-zinc-700 hover:bg-zinc-800'
                  : 'bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:text-zinc-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Admin Session or Login Button */}
            {isLoggedIn && adminUser ? (
              <div className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-xl bg-zinc-900 border border-zinc-700 shadow-sm">
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
                  className="p-1 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng Nhập</span>
              </button>
            )}

          </div>

        </div>

        {/* Sub-bar: Mobile Division Switcher & Main View Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 py-2.5 border-t border-zinc-800/60">
          
          {/* Mobile Division Selector */}
          <div className="flex md:hidden items-center space-x-1 overflow-x-auto py-1">
            {divisionTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedBracketId(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                  selectedBracketId === tab.id
                    ? 'bg-amber-500 text-zinc-950 font-bold'
                    : 'bg-zinc-900 text-zinc-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* View Tabs */}
          <div className="flex items-center space-x-1.5 ml-auto sm:ml-0">
            <button
              onClick={() => setActiveTab('bracket')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'bracket'
                  ? 'bg-zinc-800 text-white font-bold border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>Nhánh Đấu</span>
            </button>

            <button
              onClick={() => setActiveTab('podium')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'podium'
                  ? 'bg-zinc-800 text-white font-bold border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>Vinh Danh</span>
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'roster'
                  ? 'bg-zinc-800 text-white font-bold border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
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
