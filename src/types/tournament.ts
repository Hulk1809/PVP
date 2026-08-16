export type BracketId = 'bracket-a' | 'bracket-b' | 'bracket-c';

export type DivisionTheme = 'ocean' | 'forest' | 'village';

export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'bye';

export type UserRole = 'viewer' | 'admin';

export interface Bracket {
  id: BracketId;
  name: string;
  divisionTitle: string;
  tierName: string;
  theme: DivisionTheme;
  posterUrl: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  status: 'pending' | 'in_progress' | 'completed';
  totalRounds: number;
}

export interface Participant {
  id: string;
  bracketId: BracketId;
  name: string;
  sect: string;
  martialSoul: string;
  soulRank: string;
  soulLevel: number;
  avatar: string;
  seedRank?: number;
  wins: number;
  losses: number;
  winRate: number;
  bio?: string;
  isGhost?: boolean; // For Byes representation
}

export interface Match {
  id: string;
  bracketId: BracketId;
  round: number;
  roundName: string;
  matchIndex: number;
  player1Id: string | null;
  player2Id: string | null;
  player1Score: number;
  player2Score: number;
  winnerId: string | null;
  nextMatchId: string | null;
  loserNextMatchId: string | null;
  isThirdPlaceMatch?: boolean;
  scheduledTime: string;
  status: MatchStatus;
  bestOf: number; // 1, 3, or 5
  refereeNote?: string;
}

export interface SectInfo {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  icon: string;
}

export interface RoundInfo {
  round: number;
  name: string;
  matches: Match[];
}

export interface TournamentStoreState {
  brackets: Record<BracketId, Bracket>;
  participants: Record<string, Participant>;
  matches: Record<string, Match>;
  selectedBracketId: BracketId;
  userRole: UserRole;
  soundEnabled: boolean;
  searchQuery: string;
  selectedSectFilter: string;
  selectedMatchId: string | null;
  isSimulating: boolean;
}
