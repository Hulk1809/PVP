import React from 'react';
import { Medal } from 'lucide-react';
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
    <div className="mt-10 pt-6 border-t border-zinc-800/80 flex flex-col items-center">
      <div className="flex items-center space-x-2 mb-2">
        <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <Medal className="w-4 h-4" />
        </div>
        <h4 className="text-sm font-bold tracking-wider text-amber-400 font-heading uppercase">
          Trận Tranh Hạng Ba (Huy Chương Đồng)
        </h4>
      </div>

      <p className="text-xs text-zinc-400 mb-4 text-center max-w-md">
        Hai đấu thủ dừng bước tại vòng Bán Kết sẽ tự động tranh tài ở trận đấu này.
      </p>

      <div className="p-1 rounded-2xl bg-zinc-900 border border-amber-500/30 shadow-lg shadow-amber-500/5">
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
