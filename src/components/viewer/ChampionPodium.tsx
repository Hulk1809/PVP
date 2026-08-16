import React from 'react';
import { Trophy, Medal, Crown, Sparkles, Swords } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';
import { Participant } from '../../types/tournament';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { getDivisionTheme } from '../../utils/themeStyles';

export const ChampionPodium: React.FC = () => {
  const { brackets, participants, matches, selectedBracketId } = useTournament();

  const currentBracket = brackets[selectedBracketId];
  if (!currentBracket) return null;

  const themeConfig = getDivisionTheme(currentBracket.theme);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header with Division Theme Aesthetics */}
      <div className="text-center space-y-2.5">
        <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${themeConfig.roundBadgeBg} ${themeConfig.roundBadgeBorder} ${themeConfig.roundBadgeText} ${themeConfig.roundBadgeShadow} backdrop-blur-md border shadow-md`}>
          <Trophy className="w-4 h-4 text-current" />
          <span>Vinh Danh Đỉnh Phong • {currentBracket.name}</span>
        </div>
        
        <div className="relative inline-block my-1">
          <h2
            className="text-3xl sm:text-5xl font-black font-heading tracking-wider inline-block select-none"
            style={{
              fontFamily: '"Playfair Display", "Cinzel Decorative", serif',
              fontStyle: 'italic',
              backgroundImage: themeConfig.titleGradient,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            {currentBracket.divisionTitle}
          </h2>
        </div>
        
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-sans drop-shadow">
          {themeConfig.elementName} • Bảng vàng vinh danh những hồn sư xuất sắc nhất đã vượt qua các ải tử chiến để ghi tên lên đỉnh cao Thần vị.
        </p>
      </div>

      {/* Podium Display (Themed for each Division) */}
      <div className="relative max-w-4xl mx-auto pt-6 pb-4">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          
          {/* 🥈 2nd Place: Á Quân (Polished Chrome Silver) */}
          <div className="flex flex-col items-center order-2 md:order-1">
            <div className="flex flex-col items-center mb-3">
              <div className="relative mb-2">
                {runnerUp ? (
                  <PlayerAvatar name={runnerUp.name} size="lg" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center text-slate-400 font-bold text-xl">
                    ?
                  </div>
                )}
                <div className="absolute -bottom-1.5 -right-1.5 bg-slate-200 text-zinc-950 p-1 rounded-full shadow-md">
                  <Medal className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-sm font-bold text-slate-100 font-heading">
                  {runnerUp ? runnerUp.name : 'Chờ chung kết'}
                </h4>
                <p className="text-[11px] text-slate-300 font-mono">
                  {runnerUp ? `Lv.${runnerUp.soulLevel} • ${runnerUp.sect}` : 'Vòng chung kết'}
                </p>
              </div>
            </div>

            {/* Podium Pillar Silver */}
            <div className="w-full h-32 rounded-t-xl bg-gradient-to-b from-white/15 via-slate-900/90 to-black/90 border-t-2 border-l border-r border-slate-300 flex flex-col items-center justify-center shadow-lg backdrop-blur-md">
              <span className="text-2xl font-black text-slate-200 font-heading drop-shadow">2</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Á Quân</span>
            </div>
          </div>

          {/* 🥇 1st Place: Quán Quân (Radiant Champion Pillar - Elevated Center) */}
          <div className="flex flex-col items-center order-1 md:order-2">
            <div className="flex flex-col items-center mb-3">
              <div className="mb-1 text-white" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.9))' }}>
                <Crown className="w-7 h-7" />
              </div>

              <div className="relative mb-2">
                {champion ? (
                  <PlayerAvatar name={champion.name} size="xl" />
                ) : (
                  <div className={`w-20 h-20 rounded-xl bg-black/70 border-2 ${themeConfig.cardBorder} backdrop-blur-md flex items-center justify-center text-slate-200 font-black text-2xl shadow-lg ${themeConfig.roundBadgeShadow}`}>
                    ?
                  </div>
                )}
                <div className="absolute -bottom-1.5 -right-1.5 bg-gradient-to-r from-slate-200 to-white text-zinc-950 p-1.5 rounded-full shadow-lg shadow-white/30">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-base font-black text-white font-heading drop-shadow-md">
                  {champion ? champion.name : 'Đang tranh tài'}
                </h4>
                <p className="text-xs text-slate-200 font-mono">
                  {champion ? `Lv.${champion.soulLevel} • ${champion.sect}` : 'Chờ nhà vô địch'}
                </p>
              </div>
            </div>

            {/* Podium Pillar Themed */}
            <div className={`w-full h-44 rounded-t-xl bg-gradient-to-b from-white/30 via-slate-800/90 to-black/95 border-t-2 border-l border-r border-white flex flex-col items-center justify-center shadow-2xl ${themeConfig.roundBadgeShadow} backdrop-blur-md`}>
              <span className="text-3xl font-black text-white font-heading drop-shadow(0 0 16px rgba(255,255,255,0.9))">1</span>
              <span className="text-xs font-black uppercase tracking-widest text-white mt-0.5 drop-shadow">QUÁN QUÂN</span>
              <span className="text-[9px] font-bold text-slate-300 font-mono tracking-wider">{themeConfig.title.toUpperCase()}</span>
            </div>
          </div>

          {/* 🥉 3rd Place: Quý Quân (Titanium Silver) */}
          <div className="flex flex-col items-center order-3">
            <div className="flex flex-col items-center mb-3">
              <div className="relative mb-2">
                {thirdPlaceWinner ? (
                  <PlayerAvatar name={thirdPlaceWinner.name} size="lg" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center text-slate-400 font-bold text-xl">
                    ?
                  </div>
                )}
                <div className="absolute -bottom-1.5 -right-1.5 bg-slate-400 text-zinc-950 p-1 rounded-full shadow-md">
                  <Medal className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-sm font-bold text-slate-200 font-heading">
                  {thirdPlaceWinner ? thirdPlaceWinner.name : 'Tranh Hạng 3'}
                </h4>
                <p className="text-[11px] text-slate-400 font-mono">
                  {thirdPlaceWinner ? `Lv.${thirdPlaceWinner.soulLevel} • ${thirdPlaceWinner.sect}` : 'Chờ tranh hạng Ba'}
                </p>
              </div>
            </div>

            {/* Podium Pillar Titanium */}
            <div className="w-full h-24 rounded-t-xl bg-gradient-to-b from-white/10 via-slate-900/90 to-black/90 border-t-2 border-l border-r border-slate-400/60 flex flex-col items-center justify-center shadow-md backdrop-blur-md">
              <span className="text-xl font-black text-slate-300 font-heading drop-shadow">3</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Quý Quân</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
