import React from 'react';
import { Swords, Volume2, VolumeX, Trophy, Users, LogIn, LogOut, ShieldCheck, Flame, Sparkles, Bell } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';
import { BracketId, DivisionTheme } from '../../types/tournament';
import { getDivisionTheme } from '../../utils/themeStyles';

interface HeaderProps {
  activeTab: 'bracket' | 'roster' | 'podium' | 'lotusWheel';
  setActiveTab: (tab: 'bracket' | 'roster' | 'podium' | 'lotusWheel') => void;
  onOpenLoginModal: () => void;
  onOpenAnnouncement?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenLoginModal, onOpenAnnouncement }) => {
  const {
    selectedBracketId,
    setSelectedBracketId,
    isLoggedIn,
    adminUser,
    logoutAdmin,
    loggedInPlayer,
    logoutPlayer,
    soundEnabled,
    toggleSound,
  } = useTournament();

  const divisionTabs: { id: BracketId; label: string; badge: string; theme: DivisionTheme }[] = [
    {
      id: 'bracket-a',
      label: 'Bảng A',
      badge: 'Tối Thượng > 50',
      theme: 'ocean',
    },
    {
      id: 'bracket-b',
      label: 'Bảng B',
      badge: 'Tối Thượng < 10',
      theme: 'forest',
    },
    {
      id: 'bracket-c',
      label: 'Bảng C',
      badge: 'Rực Rỡ',
      theme: 'village',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent transition-all pointer-events-none">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pointer-events-auto">
        <div className="flex items-center justify-between h-10 sm:h-14 lg:h-18 gap-1.5 sm:gap-4">
          
          {/* 1. Left: Brand Title in Authentic Soul Land Platinum Silver */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-slate-300 via-slate-100 to-slate-400 p-0.5 shadow-lg shadow-white/10 flex items-center justify-center backdrop-blur-md">
              <div className="w-full h-full bg-black/70 rounded-[6px] sm:rounded-[10px] flex items-center justify-center">
                <Swords className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-200" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <h1
                  className="text-xs sm:text-base lg:text-lg font-black tracking-wider drop-shadow-md whitespace-nowrap"
                  style={{
                    fontFamily: '"Playfair Display", "Philosopher", serif',
                    fontStyle: 'italic',
                    background: 'linear-gradient(110deg, #94a3b8 0%, #cbd5e1 20%, #ffffff 40%, #f8fafc 55%, #cbd5e1 75%, #64748b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    WebkitTextStroke: '0.3px rgba(255, 255, 255, 0.8)',
                    filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.4))',
                  }}
                >
                  TÔNG MÔN TRANH BÁ
                </h1>
                <span className="hidden md:inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-white/10 text-slate-200 border border-white/20 backdrop-blur-sm">
                  PVP 2026
                </span>
              </div>
              <p className="hidden sm:block text-[9px] text-slate-300 font-mono tracking-widest drop-shadow">
                SOUL LAND ESPORTS PLATFORM
              </p>
            </div>
          </div>

          {/* 2. Center: Segmented Division Switcher (Transparent Floating Glass) */}
          <nav className="flex items-center p-0.5 sm:p-1 rounded-xl sm:rounded-2xl bg-black/35 backdrop-blur-md border border-white/15 shadow-lg">
            {divisionTabs.map((tab) => {
              const isSelected = selectedBracketId === tab.id;
              const tabTheme = getDivisionTheme(tab.theme);
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedBracketId(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
                    isSelected
                      ? `${tabTheme.tabActiveBg} ${tabTheme.tabActiveGlow} shadow-md`
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`hidden sm:inline text-[10px] px-1.5 py-0.2 rounded font-mono ${
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
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            
            {/* Announcement Bell Button */}
            {onOpenAnnouncement && (
              <button
                onClick={onOpenAnnouncement}
                title="Thông Báo Mùa Giải"
                className="relative p-1 sm:p-2 rounded-lg sm:rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 backdrop-blur-md transition-all shadow-sm"
              >
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full" />
              </button>
            )}

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              className={`p-1 sm:p-2 rounded-lg sm:rounded-xl border backdrop-blur-md transition-all ${
                soundEnabled
                  ? 'bg-black/40 text-slate-200 border-white/30 hover:bg-white/10 shadow-sm shadow-white/10'
                  : 'bg-black/30 text-slate-400 border-white/10 hover:text-slate-200 hover:bg-white/10'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Session (Admin or Player) or Login Button */}
            {isLoggedIn && adminUser ? (
              <div className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-1.5 pr-2 sm:pr-2.5 rounded-lg sm:rounded-xl bg-black/40 backdrop-blur-md border border-amber-500/30 shadow-sm">
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-[11px] font-bold text-white leading-tight font-heading">
                    {adminUser.name}
                  </p>
                  <p className="text-[9px] text-amber-300 font-mono">Ban Tổ Chức</p>
                </div>
                <button
                  onClick={logoutAdmin}
                  title="Đăng xuất"
                  className="p-1 rounded-md sm:rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors ml-0.5 sm:ml-1"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : isLoggedIn && loggedInPlayer ? (
              <div className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-1.5 pr-2 sm:pr-2.5 rounded-lg sm:rounded-xl bg-black/40 backdrop-blur-md border border-cyan-500/40 shadow-sm shadow-cyan-500/20">
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Swords className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-[11px] font-bold text-white leading-tight font-heading">
                    {loggedInPlayer.playerName}
                  </p>
                  <p className="text-[9px] text-cyan-300 font-mono">Tuyển Thủ (@{loggedInPlayer.username})</p>
                </div>
                <button
                  onClick={logoutPlayer}
                  title="Đăng xuất"
                  className="p-1 rounded-md sm:rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors ml-0.5 sm:ml-1"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold bg-gradient-to-r from-slate-200 to-white text-zinc-950 hover:from-white hover:to-slate-100 shadow-lg shadow-white/15 active:scale-95 transition-all border border-white/40"
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
            {divisionTabs.map((tab) => {
              const isSelected = selectedBracketId === tab.id;
              const tabTheme = getDivisionTheme(tab.theme);
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedBracketId(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap backdrop-blur-md transition-all ${
                    isSelected
                      ? `${tabTheme.tabActiveBg} ${tabTheme.tabActiveGlow} shadow-md`
                      : 'bg-black/35 text-slate-300 border border-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* View Tabs (Transparent Floating Glass) */}
          <div className="flex flex-wrap items-center gap-1.5 ml-auto sm:ml-0 bg-black/35 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-lg">
            <button
              onClick={() => setActiveTab('bracket')}
              className={`flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
              className={`flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'podium'
                  ? 'bg-white/20 text-white font-bold border border-white/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-slate-200" />
              <span>Vinh Danh</span>
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'roster'
                  ? 'bg-white/20 text-white font-bold border border-white/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-slate-200" />
              <span>Danh Sách Tuyển Thủ</span>
            </button>

            {/* Vòng Quay Tôn Hoa Sen Tab */}
            <button
              onClick={() => setActiveTab('lotusWheel')}
              className={`flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'lotusWheel'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 shadow-md shadow-amber-500/30 border border-amber-300 font-black'
                  : 'text-amber-300 hover:text-white hover:bg-amber-500/10 border border-amber-500/30'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'lotusWheel' ? 'text-zinc-950 animate-spin' : 'text-amber-400'}`} style={{ animationDuration: '4s' }} />
              <span>Vòng Quay Tôn Hoa Sen</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};

