import React from 'react';
import { Flame, Trophy, Users, CheckCircle2, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';

export const HeroBanner: React.FC = () => {
  const {
    brackets,
    participants,
    matches,
    selectedBracketId,
  } = useTournament();

  const currentBracket = brackets[selectedBracketId];
  if (!currentBracket) return null;

  const bracketParticipants = Object.values(participants).filter((p) => p.bracketId === selectedBracketId);
  const bracketMatches = Object.values(matches).filter((m) => m.bracketId === selectedBracketId);
  const completedMatches = bracketMatches.filter((m) => m.status === 'completed' || m.status === 'bye');

  // Determine champion if final match completed
  const finalMatch = bracketMatches.find((m) => m.round === currentBracket.totalRounds && !m.isThirdPlaceMatch);
  const champion = finalMatch?.winnerId ? participants[finalMatch.winnerId] : null;

  const themeBorderColor =
    currentBracket.theme === 'ocean'
      ? 'border-cyan-500/30'
      : currentBracket.theme === 'forest'
      ? 'border-emerald-500/30'
      : 'border-lime-500/30';

  const themeGlowColor =
    currentBracket.theme === 'ocean'
      ? 'shadow-[0_0_50px_rgba(6,182,212,0.15)]'
      : currentBracket.theme === 'forest'
      ? 'shadow-[0_0_50px_rgba(16,185,129,0.15)]'
      : 'shadow-[0_0_50px_rgba(132,204,22,0.15)]';

  return (
    <div className={`relative w-full overflow-hidden border-b border-slate-800/80 bg-slate-950 ${themeGlowColor} transition-all duration-700 min-h-[340px] flex items-center`}>
      
      {/* 1. Full-Bleed Division Poster Background (Widescreen Artwork) */}
      <div className="absolute inset-0 z-0">
        <img
          key={currentBracket.posterUrl}
          src={currentBracket.posterUrl}
          alt={currentBracket.divisionTitle}
          className="w-full h-full object-cover object-center scale-100 animate-in fade-in duration-700 brightness-[0.55] contrast-125"
        />
        {/* Layered Cinematic Vignettes & Gradients for Crisp Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />
      </div>

      {/* 2. Banner Content Overlay (Wide full-container presentation) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="max-w-3xl space-y-5">
          
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-glow-gold backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              {currentBracket.name}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {currentBracket.tierName}
            </span>

            {champion && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-glow-gold animate-pulse">
                <Trophy className="w-4 h-4" /> Quán Quân: {champion.name}
              </span>
            )}
          </div>

          {/* Division Grand Title & Lore */}
          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] font-heading">
              <span className="text-gold-gradient">{currentBracket.divisionTitle}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans-accent max-w-2xl drop-shadow-md">
              {currentBracket.description}
            </p>
          </div>

          {/* Key Statistics Glassmorphism Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            
            <div className={`bg-slate-950/80 backdrop-blur-md p-3.5 rounded-xl border ${themeBorderColor} shadow-lg hover:border-amber-500/40 transition-all`}>
              <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tổng Đấu Thủ</span>
              </div>
              <div className="mt-1 text-2xl font-black text-white font-heading">
                {bracketParticipants.length} <span className="text-xs text-slate-400 font-normal">hồn sư</span>
              </div>
            </div>

            <div className={`bg-slate-950/80 backdrop-blur-md p-3.5 rounded-xl border ${themeBorderColor} shadow-lg hover:border-amber-500/40 transition-all`}>
              <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tiến Độ</span>
              </div>
              <div className="mt-1 text-2xl font-black text-white font-heading">
                {completedMatches.length}/{bracketMatches.length} <span className="text-xs text-slate-400 font-normal">trận</span>
              </div>
            </div>

            <div className={`bg-slate-950/80 backdrop-blur-md p-3.5 rounded-xl border ${themeBorderColor} shadow-lg hover:border-amber-500/40 transition-all`}>
              <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Số Vòng Đấu</span>
              </div>
              <div className="mt-1 text-2xl font-black text-white font-heading">
                {currentBracket.totalRounds} <span className="text-xs text-slate-400 font-normal">vòng</span>
              </div>
            </div>

            <div className={`bg-slate-950/80 backdrop-blur-md p-3.5 rounded-xl border ${themeBorderColor} shadow-lg hover:border-amber-500/40 transition-all`}>
              <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                <span>Thể Thức</span>
              </div>
              <div className="mt-1 text-base font-bold text-amber-400 font-heading truncate">
                Loại Trực Tiếp
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
