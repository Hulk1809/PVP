import React from 'react';
import { Trophy, Medal, Crown, Sparkles, Flame, Shield, ArrowRight } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';
import { Participant } from '../../types/tournament';

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
      
      {/* Header Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-gold">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Vinh Danh Đỉnh Phong - {currentBracket.name}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-gold-gradient font-heading">
          {currentBracket.divisionTitle}
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-sans-accent">
          Nơi ghi danh những bậc cường giả xuất sắc nhất đã vượt qua muôn trùng thử thách để bước lên đỉnh cao vinh quang của Đấu La Đại Lục.
        </p>
      </div>

      {/* 3D Podium Display */}
      <div className="relative max-w-4xl mx-auto pt-16 pb-8">
        
        {/* Background Aura Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-cyan-500/5 to-transparent rounded-3xl blur-2xl -z-10" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          
          {/* 🥈 2nd Place: Á Quân (Silver) */}
          <div className="flex flex-col items-center order-2 md:order-1">
            <div className="relative group flex flex-col items-center">
              {/* Avatar & Silver Ring */}
              <div className="relative mb-3">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-slate-400 via-slate-200 to-slate-500 shadow-lg">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                    {runnerUp ? (
                      <img src={runnerUp.avatar} alt={runnerUp.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-slate-600 font-bold text-2xl">?</span>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-1 bg-slate-300 text-slate-950 p-1.5 rounded-full shadow-md">
                  <Medal className="w-5 h-5" />
                </div>
              </div>

              {/* Name & Sect */}
              <div className="text-center">
                <h4 className="text-base font-bold text-slate-200 font-heading">
                  {runnerUp ? runnerUp.name : 'Đang tranh tài...'}
                </h4>
                <p className="text-xs text-slate-400">
                  {runnerUp ? `${runnerUp.sect} • Lv.${runnerUp.soulLevel}` : 'Chờ chung kết'}
                </p>
              </div>
            </div>

            {/* Podium Pillar */}
            <div className="w-full mt-4 h-36 rounded-t-2xl bg-gradient-to-b from-slate-700/80 to-slate-900/90 border-t-2 border-l border-r border-slate-400/50 flex flex-col items-center justify-center shadow-md">
              <span className="text-3xl font-black text-slate-300 font-heading">2</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Á Quân</span>
            </div>
          </div>

          {/* 🥇 1st Place: Quán Quân (Gold - Elevated) */}
          <div className="flex flex-col items-center order-1 md:order-2">
            <div className="relative group flex flex-col items-center -top-6">
              
              {/* Crown Animation */}
              <div className="mb-1 text-amber-400 animate-bounce">
                <Crown className="w-10 h-10 fill-amber-400 filter drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
              </div>

              {/* Avatar & Gold Ring */}
              <div className="relative mb-3">
                <div className="w-32 h-32 rounded-full p-1.5 bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-500 shadow-glow-gold">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                    {champion ? (
                      <img src={champion.avatar} alt={champion.name} className="w-full h-full object-cover scale-105" />
                    ) : (
                      <span className="text-amber-500/60 font-bold text-3xl">?</span>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-1 bg-amber-400 text-slate-950 p-2 rounded-full shadow-glow-gold">
                  <Trophy className="w-6 h-6 fill-slate-950" />
                </div>
              </div>

              {/* Name & Sect */}
              <div className="text-center">
                <h3 className="text-xl font-black text-gold-gradient font-heading">
                  {champion ? champion.name : 'Chưa định đoạt'}
                </h3>
                <p className="text-xs text-amber-300 font-medium mt-0.5">
                  {champion ? `${champion.sect} • ${champion.soulRank}` : 'Chờ trận chung kết'}
                </p>
                {champion && (
                  <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 shadow-glow-gold">
                    {currentBracket.divisionTitle}
                  </span>
                )}
              </div>
            </div>

            {/* Podium Pillar (Tallest) */}
            <div className="w-full h-48 rounded-t-2xl bg-gradient-to-b from-amber-600/80 via-amber-700/60 to-slate-900/90 border-t-2 border-l border-r border-amber-400 shadow-glow-gold flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-amber-300 font-heading">1</span>
              <span className="text-sm font-bold uppercase tracking-widest text-amber-200">Quán Quân</span>
            </div>
          </div>

          {/* 🥉 3rd Place: Quý Quân (Bronze) */}
          <div className="flex flex-col items-center order-3">
            <div className="relative group flex flex-col items-center">
              {/* Avatar & Bronze Ring */}
              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-800 via-amber-600 to-amber-900 shadow-lg">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                    {thirdPlaceWinner ? (
                      <img src={thirdPlaceWinner.avatar} alt={thirdPlaceWinner.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-amber-800 font-bold text-xl">?</span>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-1 bg-amber-700 text-amber-100 p-1.5 rounded-full shadow-md">
                  <Medal className="w-4 h-4" />
                </div>
              </div>

              {/* Name & Sect */}
              <div className="text-center">
                <h4 className="text-sm font-bold text-amber-200 font-heading">
                  {thirdPlaceWinner ? thirdPlaceWinner.name : 'Đang tranh tài...'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {thirdPlaceWinner ? `${thirdPlaceWinner.sect} • Lv.${thirdPlaceWinner.soulLevel}` : 'Chờ tranh hạng ba'}
                </p>
              </div>
            </div>

            {/* Podium Pillar */}
            <div className="w-full mt-4 h-28 rounded-t-2xl bg-gradient-to-b from-amber-900/70 to-slate-900/90 border-t-2 border-l border-r border-amber-600/50 flex flex-col items-center justify-center shadow-md">
              <span className="text-2xl font-black text-amber-500 font-heading">3</span>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Quý Quân</span>
            </div>
          </div>

        </div>

      </div>

      {/* Hall of Fame for All Divisions */}
      <div className="pt-8 border-t border-slate-800">
        <h3 className="text-xl font-bold text-slate-200 font-heading mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>Bảng Danh Dự Các Phân Khúc Giải Đấu</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['bracket-a', 'bracket-b', 'bracket-c'] as const).map((bId) => {
            const br = brackets[bId];
            const bMatches = Object.values(matches).filter((m) => m.bracketId === bId);
            const bFinal = bMatches.find((m) => m.round === br.totalRounds && !m.isThirdPlaceMatch);
            const bChamp = bFinal?.winnerId ? participants[bFinal.winnerId] : null;

            return (
              <div
                key={bId}
                onClick={() => setSelectedBracketId(bId)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  selectedBracketId === bId
                    ? 'bg-slate-900/90 border-amber-500/60 shadow-glow-gold'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {br.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {br.tierName}
                  </span>
                </div>

                <h4 className="mt-2 text-lg font-bold text-white font-heading">
                  {br.divisionTitle}
                </h4>

                <div className="mt-4 flex items-center space-x-3 pt-3 border-t border-slate-800/80">
                  {bChamp ? (
                    <>
                      <img
                        src={bChamp.avatar}
                        alt={bChamp.name}
                        className="w-10 h-10 rounded-full border border-amber-500/60 object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <Crown className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-sm font-bold text-amber-300">{bChamp.name}</span>
                        </div>
                        <p className="text-xs text-slate-400">{bChamp.sect}</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-slate-500 italic py-2 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      <span>Giải đấu đang diễn ra...</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
