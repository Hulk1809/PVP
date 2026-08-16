import React from 'react';
import { Trophy, Users, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';

export const HeroBanner: React.FC = () => {
  const { brackets, participants, matches, selectedBracketId } = useTournament();

  const currentBracket = brackets[selectedBracketId];
  if (!currentBracket) return null;

  const bracketParticipants = Object.values(participants).filter((p) => p.bracketId === selectedBracketId);
  const bracketMatches = Object.values(matches).filter((m) => m.bracketId === selectedBracketId);
  const completedMatches = bracketMatches.filter((m) => m.status === 'completed' || m.status === 'bye');

  const finalMatch = bracketMatches.find((m) => m.round === currentBracket.totalRounds && !m.isThirdPlaceMatch);
  const champion = finalMatch?.winnerId ? participants[finalMatch.winnerId] : null;

  return (
    <div className="relative w-full overflow-hidden border-b border-zinc-800/80 bg-[#090a0f] min-h-[260px] flex items-center">
      
      {/* Background with Dark Subtle Atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          key={currentBracket.posterUrl}
          src={currentBracket.posterUrl}
          alt={currentBracket.divisionTitle}
          className="w-full h-full object-cover object-center brightness-[0.35] contrast-125 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-[#07080b]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080b] via-[#07080b]/90 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-3xl space-y-4">
          
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {currentBracket.name}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-900/80 text-zinc-300 border border-zinc-700">
              Hạng: {currentBracket.tierName}
            </span>
            {champion && (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-zinc-950 shadow-md">
                <Trophy className="w-3.5 h-3.5" /> Quán Quân: {champion.name}
              </span>
            )}
          </div>

          {/* Championship Title */}
          <div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-heading">
              <span className="text-gold-gradient">{currentBracket.divisionTitle}</span>
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans max-w-2xl">
              {currentBracket.description}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-2xl">
            
            <div className="bg-zinc-900/80 backdrop-blur-md p-2.5 rounded-xl border border-zinc-800 flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-zinc-800/80 text-cyan-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 font-medium">Tuyển Thủ</p>
                <p className="text-base font-bold text-white font-heading leading-tight">
                  {bracketParticipants.length} <span className="text-[10px] font-normal text-zinc-500">người</span>
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-md p-2.5 rounded-xl border border-zinc-800 flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-zinc-800/80 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 font-medium">Tiến Độ</p>
                <p className="text-base font-bold text-white font-heading leading-tight">
                  {completedMatches.length}/{bracketMatches.length} <span className="text-[10px] font-normal text-zinc-500">trận</span>
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-md p-2.5 rounded-xl border border-zinc-800 flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-zinc-800/80 text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 font-medium">Số Vòng</p>
                <p className="text-base font-bold text-white font-heading leading-tight">
                  {currentBracket.totalRounds} <span className="text-[10px] font-normal text-zinc-500">vòng</span>
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-md p-2.5 rounded-xl border border-zinc-800 flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-zinc-800/80 text-yellow-400">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 font-medium">Thể Thức</p>
                <p className="text-xs font-bold text-amber-400 font-heading leading-tight">
                  Loại Trực Tiếp
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
