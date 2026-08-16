import React from 'react';
import { Medal, Sparkles } from 'lucide-react';
import { Match, Participant, UserRole } from '../../types/tournament';
import { MatchCard } from './MatchCard';

interface ThirdPlaceMatchProps {
  match: Match | null;
  player1: Participant | null;
  player2: Participant | null;
  userRole: UserRole;
  onAdvanceWinner: (matchId: string, winnerId: string) => void;
  onResetMatch: (matchId: string) => void;
  onOpenScheduler: (match: Match) => void;
  onOpenMatchDetails: (matchId: string) => void;
}

export const ThirdPlaceMatch: React.FC<ThirdPlaceMatchProps> = ({
  match,
  player1,
  player2,
  userRole,
  onAdvanceWinner,
  onResetMatch,
  onOpenScheduler,
  onOpenMatchDetails,
}) => {
  if (!match) return null;

  return (
    <div className="mt-8 pt-6 border-t border-dashed border-slate-800 flex flex-col items-center">
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1 rounded-md bg-amber-900/40 border border-amber-600/50 text-amber-400">
          <Medal className="w-4 h-4" />
        </div>
        <h4 className="text-sm font-bold tracking-wider text-amber-300 font-heading uppercase flex items-center gap-1.5">
          Trận Tranh Hạng Ba (Quý Quân)
        </h4>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
          loser_next_match_id
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-3 text-center max-w-md">
        Hai đấu thủ dừng bước tại vòng Bán Kết tự động chuyển xuống trận đấu này để tranh đoạt danh hiệu Quý Quân.
      </p>

      <div className="relative p-1 rounded-2xl bg-gradient-to-r from-amber-700/30 via-amber-600/40 to-amber-700/30 border border-amber-500/40 shadow-glow-gold">
        <MatchCard
          match={match}
          player1={player1}
          player2={player2}
          userRole={userRole}
          onAdvanceWinner={onAdvanceWinner}
          onResetMatch={onResetMatch}
          onOpenScheduler={onOpenScheduler}
          onOpenMatchDetails={onOpenMatchDetails}
        />
      </div>
    </div>
  );
};
