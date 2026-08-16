import React from 'react';
import { Trophy, Medal, Crown, Sparkles, Swords, ArrowRight } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';
import { Participant } from '../../types/tournament';
import { PlayerAvatar } from '../common/PlayerAvatar';

export const ChampionPodium: React.FC = () => {
  const { brackets, participants, matches, selectedBracketId, setSelectedBracketId } = useTournament();

  const currentBracket = brackets[selectedBracketId];
  if (!currentBracket) return null;

  const bracketMatches = Object.values(matches).filter((m) => m.bracketId === selectedBracketId);
  const finalMatch = bracketMatches.find(
    (m) => m.round === currentBracket.totalRounds && !m.isThirdPlaceMatch
  );
  const thirdPlaceMatch = bracketMatches.find((m) => m.isThirdPlaceMatch);

  // 1st Place (Winner of Final)
  const champion: Participant | null = finalMatch?.winnerId ? participants[finalMatch.winnerId] : null;

  // 2nd Place (Loser of Final)
  let runnerUp: Participant | null = null;
  if (finalMatch && finalMatch.winnerId && finalMatch.player1Id && finalMatch.player2Id) {
    const runnerUpId = finalMatch.winnerId === finalMatch.player1Id ? finalMatch.player2Id : finalMatch.player1Id;
    runnerUp = participants[runnerUpId] || null;
  }

  // 3rd Place (Winner of 3rd Place match)
  const thirdPlaceWinner: Participant | null = thirdPlaceMatch?.winnerId
    ? participants[thirdPlaceMatch.winnerId]
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Vinh Danh Đỉnh Phong • {currentBracket.name}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-gold-gradient font-heading">
          {currentBracket.divisionTitle}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto font-sans">
          Bảng vàng vinh danh những tuyển thủ xuất sắc nhất đã vượt qua các vòng đấu để ghi tên lên đỉnh cao giải đấu.
        </p>
      </div>

      {/* Podium Display */}
      <div className="relative max-w-4xl mx-auto pt-10 pb-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          
          {/* 🥈 2nd Place: Á Quân (Silver) */}
          <div className="flex flex-col items-center order-2 md:order-1">
            <div className="flex flex-col items-center mb-3">
              <div className="relative mb-2">
                {runnerUp ? (
                  <PlayerAvatar name={runnerUp.name} size="lg" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 font-bold text-xl">
                    ?
                  </div>
                )}
                <div className="absolute -bottom-1.5 -right-1.5 bg-zinc-300 text-zinc-950 p-1 rounded-full shadow-md">
                  <Medal className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-sm font-bold text-zinc-200 font-heading">
                  {runnerUp ? runnerUp.name : 'Chờ chung kết'}
                </h4>
                <p className="text-[11px] text-zinc-400 font-mono">
                  {runnerUp ? `Lv.${runnerUp.soulLevel} • ${runnerUp.sect}` : 'Vòng chung kết'}
                </p>
              </div>
            </div>

            {/* Podium Pillar */}
            <div className="w-full h-32 rounded-t-xl bg-zinc-900 border-t-2 border-l border-r border-zinc-500/50 flex flex-col items-center justify-center shadow-md">
              <span className="text-2xl font-black text-zinc-300 font-heading">2</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Á Quân</span>
            </div>
          </div>

          {/* 🥇 1st Place: Quán Quân (Gold - Center & Elevated) */}
          <div className="flex flex-col items-center order-1 md:order-2">
            <div className="flex flex-col items-center mb-3">
              <div className="mb-1 text-amber-400">
                <Crown className="w-6 h-6" />
              </div>

              <div className="relative mb-2">
                {champion ? (
                  <PlayerAvatar name={champion.name} size="xl" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-zinc-900 border-2 border-amber-500/50 flex items-center justify-center text-amber-500/60 font-black text-2xl">
                    ?
                  </div>
                )}
                <div className="absolute -bottom-1.5 -right-1.5 bg-amber-400 text-zinc-950 p-1.5 rounded-full shadow-md">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-base font-black text-amber-300 font-heading">
                  {champion ? champion.name : 'Đang tranh tài'}
                </h4>
                <p className="text-xs text-zinc-300 font-mono">
                  {champion ? `Lv.${champion.soulLevel} • ${champion.sect}` : 'Chờ nhà vô địch'}
                </p>
              </div>
            </div>

            {/* Podium Pillar Gold */}
            <div className="w-full h-44 rounded-t-xl bg-gradient-to-b from-amber-500/20 to-zinc-900 border-t-2 border-l border-r border-amber-400 flex flex-col items-center justify-center shadow-lg shadow-amber-500/10">
              <span className="text-3xl font-black text-amber-400 font-heading">1</span>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">QUÁN QUÂN</span>
            </div>
          </div>

          {/* 🥉 3rd Place: Quý Quân (Bronze) */}
          <div className="flex flex-col items-center order-3">
            <div className="flex flex-col items-center mb-3">
              <div className="relative mb-2">
                {thirdPlaceWinner ? (
                  <PlayerAvatar name={thirdPlaceWinner.name} size="lg" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 font-bold text-xl">
                    ?
                  </div>
                )}
                <div className="absolute -bottom-1.5 -right-1.5 bg-amber-700 text-amber-100 p-1 rounded-full shadow-md">
                  <Medal className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-sm font-bold text-zinc-300 font-heading">
                  {thirdPlaceWinner ? thirdPlaceWinner.name : 'Tranh Hạng 3'}
                </h4>
                <p className="text-[11px] text-zinc-400 font-mono">
                  {thirdPlaceWinner ? `Lv.${thirdPlaceWinner.soulLevel} • ${thirdPlaceWinner.sect}` : 'Chờ tranh hạng Ba'}
                </p>
              </div>
            </div>

            {/* Podium Pillar Bronze */}
            <div className="w-full h-24 rounded-t-xl bg-zinc-900 border-t-2 border-l border-r border-amber-700/50 flex flex-col items-center justify-center shadow-md">
              <span className="text-xl font-black text-amber-600 font-heading">3</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Quý Quân</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
