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
    <header className="sticky top-0 z-40 w-full bg-transparent transition-all pointer-events-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pointer-events-auto">
        <div className="flex items-center justify-between h-13 sm:h-16 lg:h-20 gap-2 sm:gap-4">
          
          {/* 1. Left: Brand Title in Authentic Soul Land Platinum Silver */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-slate-300 via-slate-100 to-slate-400 p-0.5 shadow-lg shadow-white/10 flex items-center justify-center backdrop-blur-md">
              <div className="w-full h-full bg-black/70 rounded-[10px] flex items-center justify-center">
                <Swords className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <h1
                  className="text-sm sm:text-base lg:text-lg font-black tracking-wider drop-shadow-md whitespace-nowrap"
                  style={{
                    fontFamily: '"Playfair Display", "Philosopher", serif',
                    fontStyle: 'italic',
                    background: 'linear-gradient(110deg, #94a3b8 0%, #cbd5e1 20%, #ffffff 40%, #f8fafc 55%, #cbd5e1 75%, #64748b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    WebkitTextStroke: '0.4px rgba(255, 255, 255, 0.8)',
                    filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.4))',
                  }}
                >
                  TÔNG MÔN TRANH BÁ
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-slate-200 border border-white/20 backdrop-blur-sm">
                  PVP 2026
                </span>
              </div>
              <p className="hidden xs:block text-[9px] sm:text-[10px] text-slate-300 font-mono tracking-widest drop-shadow">
                SOUL LAND ESPORTS PLATFORM
              </p>
            </div>
          </div>

          {/* 2. Center: Segmented Division Switcher (Transparent Floating Glass) */}
          <nav className="hidden md:flex items-center p-1 rounded-2xl bg-black/35 backdrop-blur-md border border-white/15 shadow-lg">
            {divisionTabs.map((tab) => {
              const isSelected = selectedBracketId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedBracketId(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-slate-200 to-white text-zinc-950 font-black shadow-md shadow-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isSelected
                        ? 'bg-black/20 text-zinc-950 font-bold'
                        : 'bg-white/10 text-slate-300'
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
              className={`p-1.5 sm:p-2 rounded-xl border backdrop-blur-md transition-all ${
                soundEnabled
                  ? 'bg-black/40 text-slate-200 border-white/30 hover:bg-white/10 shadow-sm shadow-white/10'
                  : 'bg-black/30 text-slate-400 border-white/10 hover:text-slate-200 hover:bg-white/10'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Admin Session or Login Button */}
            {isLoggedIn && adminUser ? (
              <div className="flex items-center space-x-1.5 sm:space-x-2 p-1 sm:p-1.5 pr-2 sm:pr-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 shadow-sm">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/10 border border-white/30 flex items-center justify-center text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[11px] font-bold text-white leading-tight font-heading">
                    {adminUser.name}
                  </p>
                  <p className="text-[9px] text-slate-300 font-mono">Quản Trị Viên</p>
                </div>
                <button
                  onClick={logoutAdmin}
                  title="Đăng xuất"
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors ml-0.5 sm:ml-1"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-slate-200 to-white text-zinc-950 hover:from-white hover:to-slate-100 shadow-lg shadow-white/15 active:scale-95 transition-all border border-white/40"
              >
                <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Đăng Nhập</span>
              </button>
            )}

          </div>

        </div>

        {/* Sub-bar: Mobile Division Switcher & Main View Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 py-1 sm:py-1.5">
          
          {/* Mobile Division Selector */}
          <div className="flex md:hidden items-center space-x-1 overflow-x-auto py-0.5 no-scrollbar">
            {divisionTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedBracketId(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap backdrop-blur-md ${
                  selectedBracketId === tab.id
                    ? 'bg-slate-200 text-zinc-950 font-bold shadow-md shadow-white/20'
                    : 'bg-black/35 text-slate-300 border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* View Tabs (Transparent Floating Glass) */}
          <div className="flex items-center space-x-1.5 ml-auto sm:ml-0 bg-black/35 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-lg">
            <button
              onClick={() => setActiveTab('bracket')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'bracket'
                  ? 'bg-white/20 text-white font-bold border border-white/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-slate-200" />
              <span>Nhánh Đấu</span>
            </button>

            <button
              onClick={() => setActiveTab('podium')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'podium'
                  ? 'bg-white/20 text-white font-bold border border-white/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-300" />
              <span>Vinh Danh</span>
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'roster'
                  ? 'bg-white/20 text-white font-bold border border-white/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-cyan-300" />
              <span>Danh Sách Tuyển Thủ</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
