import { BracketId, Match, MatchStatus, Participant } from '../types/tournament';

export interface BracketDimensions {
  totalRounds: number;
  bracketSize: number;
  byesCount: number;
  firstRoundMatches: number;
}

export function calculateBracketDimensions(participantCount: number): BracketDimensions {
  if (participantCount < 2) {
    return { totalRounds: 1, bracketSize: 2, byesCount: 0, firstRoundMatches: 1 };
  }
  const totalRounds = Math.ceil(Math.log2(participantCount));
  const bracketSize = Math.pow(2, totalRounds);
  const byesCount = bracketSize - participantCount;
  const firstRoundMatches = bracketSize / 2;

  return { totalRounds, bracketSize, byesCount, firstRoundMatches };
}

export function getRoundName(round: number, totalRounds: number, isThirdPlace?: boolean): string {
  if (isThirdPlace) return 'Trận Tranh Hạng Ba';
  if (round === totalRounds) return 'Chung Kết Đỉnh Cao';
  if (round === totalRounds - 1 && totalRounds > 1) return 'Vòng Bán Kết';
  if (round === totalRounds - 2 && totalRounds > 2) return 'Vòng Tứ Kết';
  if (round === totalRounds - 3 && totalRounds > 3) return 'Vòng 1/8 (Vòng 16)';
  if (round === totalRounds - 4 && totalRounds > 4) return 'Vòng 1/16 (Vòng 32)';
  return `Vòng ${round} (Sơ Loại)`;
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Standard tournament seeding generator: 1 vs 16, 8 vs 9, 4 vs 13, 5 vs 12, 2 vs 15, 7 vs 10, 3 vs 14, 6 vs 11
function getSeededPairings(bracketSize: number): number[] {
  let seeds = [1, 2];
  while (seeds.length < bracketSize) {
    const nextSeeds: number[] = [];
    const currentMax = seeds.length * 2 + 1;
    for (const s of seeds) {
      nextSeeds.push(s);
      nextSeeds.push(currentMax - s);
    }
    seeds = nextSeeds;
  }
  return seeds;
}

/**
 * Generate full tree of matches for single-elimination tournament with Byes and 3rd Place Match.
 */
export function generateTournamentBracket(
  bracketId: BracketId,
  participants: Participant[],
  randomize: boolean = false
): Record<string, Match> {
  const count = participants.length;
  if (count < 2) return {};

  const { totalRounds, bracketSize } = calculateBracketDimensions(count);
  const matches: Record<string, Match> = {};

  // Sort or shuffle participants based on randomize flag
  const processedParticipants = randomize
    ? shuffleArray(participants)
    : [...participants].sort((a, b) => (a.seedRank || 999) - (b.seedRank || 999));

  // Map seeds to participant slots using standard international seeding
  const seedSlots = getSeededPairings(bracketSize);
  const slotToPlayerMap: (Participant | null)[] = new Array(bracketSize).fill(null);

  for (let i = 0; i < bracketSize; i++) {
    const seed = seedSlots[i];
    if (seed <= count) {
      slotToPlayerMap[i] = processedParticipants[seed - 1] || null;
    } else {
      slotToPlayerMap[i] = null; // Bye
    }
  }

  // Pre-create match IDs for all rounds
  const roundMatchIds: string[][] = [];
  for (let r = 1; r <= totalRounds; r++) {
    const matchesInRound = Math.pow(2, totalRounds - r);
    const ids: string[] = [];
    for (let m = 0; m < matchesInRound; m++) {
      ids.push(`${bracketId}-r${r}-m${m}`);
    }
    roundMatchIds.push(ids);
  }

  const thirdPlaceMatchId = `${bracketId}-third-place`;

  // Create matches round by round
  for (let r = 1; r <= totalRounds; r++) {
    const matchesInRound = Math.pow(2, totalRounds - r);
    const isFinalRound = r === totalRounds;
    const isSemiFinalRound = r === totalRounds - 1 && totalRounds > 1;

    for (let m = 0; m < matchesInRound; m++) {
      const matchId = roundMatchIds[r - 1][m];
      const nextMatchId = !isFinalRound ? roundMatchIds[r][Math.floor(m / 2)] : null;
      const loserNextMatchId = isSemiFinalRound ? thirdPlaceMatchId : null;

      let p1Id: string | null = null;
      let p2Id: string | null = null;
      let winnerId: string | null = null;
      let status: MatchStatus = 'scheduled';

      if (r === 1) {
        const slot1 = m * 2;
        const slot2 = m * 2 + 1;
        const p1 = slotToPlayerMap[slot1];
        const p2 = slotToPlayerMap[slot2];

        p1Id = p1 ? p1.id : null;
        p2Id = p2 ? p2.id : null;

        // Auto-advance Byes in Round 1
        if (p1 && !p2) {
          winnerId = p1.id;
          status = 'bye';
        } else if (!p1 && p2) {
          winnerId = p2.id;
          status = 'bye';
        }
      }

      // Format schedule time
      const today = new Date();
      today.setHours(14 + (r - 1) * 2, m * 30, 0, 0);

      const match: Match = {
        id: matchId,
        bracketId,
        round: r,
        roundName: getRoundName(r, totalRounds),
        matchIndex: m,
        player1Id: p1Id,
        player2Id: p2Id,
        player1Score: 0,
        player2Score: 0,
        winnerId,
        nextMatchId,
        loserNextMatchId,
        scheduledTime: today.toISOString(),
        status,
        bestOf: isFinalRound ? 5 : isSemiFinalRound ? 3 : 3,
        refereeNote: status === 'bye' ? 'Đặc cách tiến thẳng vòng sau (Bye)' : undefined,
      };

      matches[matchId] = match;
    }
  }

  // Create 3rd Place Match if totalRounds >= 2
  if (totalRounds >= 2) {
    const finalDate = new Date();
    finalDate.setHours(18, 0, 0, 0);

    matches[thirdPlaceMatchId] = {
      id: thirdPlaceMatchId,
      bracketId,
      round: totalRounds,
      roundName: 'Trận Tranh Hạng Ba',
      matchIndex: 99,
      player1Id: null,
      player2Id: null,
      player1Score: 0,
      player2Score: 0,
      winnerId: null,
      nextMatchId: null,
      loserNextMatchId: null,
      isThirdPlaceMatch: true,
      scheduledTime: finalDate.toISOString(),
      status: 'scheduled',
      bestOf: 3,
      refereeNote: 'Tranh giải Ba giữa 2 đấu thủ dừng bước tại Bán Kết',
    };
  }

  // Propagate Bye winners to Round 2
  const totalFirstRoundMatches = bracketSize / 2;
  for (let m = 0; m < totalFirstRoundMatches; m++) {
    const r1Match = matches[roundMatchIds[0][m]];
    if (r1Match && r1Match.status === 'bye' && r1Match.winnerId && r1Match.nextMatchId) {
      const nextMatch = matches[r1Match.nextMatchId];
      if (nextMatch) {
        if (m % 2 === 0) {
          nextMatch.player1Id = r1Match.winnerId;
        } else {
          nextMatch.player2Id = r1Match.winnerId;
        }
      }
    }
  }

  return matches;
}

/**
 * Advance Winner: Advances winner, handles downstream cascades and overrides.
 */
export function advanceWinner(
  currentMatches: Record<string, Match>,
  matchId: string,
  winnerId: string,
  scores?: { p1Score: number; p2Score: number }
): Record<string, Match> {
  let matches = JSON.parse(JSON.stringify(currentMatches)) as Record<string, Match>;
  const match = matches[matchId];
  if (!match) return currentMatches;

  if (match.player1Id !== winnerId && match.player2Id !== winnerId) {
    return currentMatches;
  }

  const previousWinner = match.winnerId;

  // If winner changed from a previous result, first reset downstream
  if (previousWinner && previousWinner !== winnerId) {
    matches = resetMatch(matches, matchId);
  }

  const currentMatch = matches[matchId];
  const loserId = currentMatch.player1Id === winnerId ? currentMatch.player2Id : currentMatch.player1Id;

  // Update current match
  currentMatch.winnerId = winnerId;
  currentMatch.status = 'completed';
  if (scores) {
    currentMatch.player1Score = scores.p1Score;
    currentMatch.player2Score = scores.p2Score;
  } else {
    const targetWins = Math.ceil(currentMatch.bestOf / 2);
    if (currentMatch.player1Id === winnerId) {
      currentMatch.player1Score = targetWins;
      currentMatch.player2Score = Math.max(0, targetWins - 1);
    } else {
      currentMatch.player2Score = targetWins;
      currentMatch.player1Score = Math.max(0, targetWins - 1);
    }
  }

  // 1. Advance Winner to next_match_id
  if (currentMatch.nextMatchId && matches[currentMatch.nextMatchId]) {
    const nextMatch = matches[currentMatch.nextMatchId];
    if (currentMatch.matchIndex % 2 === 0) {
      nextMatch.player1Id = winnerId;
    } else {
      nextMatch.player2Id = winnerId;
    }
  }

  // 2. Route Loser to loser_next_match_id (Semi-Final -> 3rd Place Match)
  if (currentMatch.loserNextMatchId && matches[currentMatch.loserNextMatchId] && loserId) {
    const thirdMatch = matches[currentMatch.loserNextMatchId];
    if (currentMatch.matchIndex === 0) {
      thirdMatch.player1Id = loserId;
    } else {
      thirdMatch.player2Id = loserId;
    }
  }

  return matches;
}

/**
 * Reset a match result and recursively rollback downstream brackets (both winner and loser tracks)
 */
export function resetMatch(
  currentMatches: Record<string, Match>,
  matchId: string
): Record<string, Match> {
  let matches = JSON.parse(JSON.stringify(currentMatches)) as Record<string, Match>;
  const match = matches[matchId];
  if (!match) return currentMatches;

  const previousWinner = match.winnerId;
  const previousLoser = match.player1Id === previousWinner ? match.player2Id : match.player1Id;

  match.winnerId = null;
  match.status = 'scheduled';
  match.player1Score = 0;
  match.player2Score = 0;

  // 1. Clear downstream winner trail
  if (match.nextMatchId && matches[match.nextMatchId] && previousWinner) {
    const nextMatch = matches[match.nextMatchId];
    if (nextMatch.player1Id === previousWinner) nextMatch.player1Id = null;
    if (nextMatch.player2Id === previousWinner) nextMatch.player2Id = null;

    // Recursively reset downstream if it was completed
    if (nextMatch.winnerId) {
      matches = resetMatch(matches, nextMatch.id);
    }
  }

  // 2. Clear downstream loser trail (3rd place match)
  if (match.loserNextMatchId && matches[match.loserNextMatchId] && previousLoser) {
    const thirdMatch = matches[match.loserNextMatchId];
    if (thirdMatch.player1Id === previousLoser) thirdMatch.player1Id = null;
    if (thirdMatch.player2Id === previousLoser) thirdMatch.player2Id = null;

    // Recursively reset 3rd place match if it was completed
    if (thirdMatch.winnerId) {
      matches = resetMatch(matches, thirdMatch.id);
    }
  }

  return matches;
}

/**
 * Simulate single match outcome based on participant stats
 */
export function simulateMatchOutcome(
  match: Match,
  participants: Record<string, Participant>
): { winnerId: string; p1Score: number; p2Score: number } | null {
  if (!match.player1Id || !match.player2Id) return null;

  const p1 = participants[match.player1Id];
  const p2 = participants[match.player2Id];
  if (!p1 || !p2) return null;

  const p1Power = (p1.soulLevel || 50) * 0.7 + (p1.winRate || 50) * 0.3 + (Math.random() * 20 - 10);
  const p2Power = (p2.soulLevel || 50) * 0.7 + (p2.winRate || 50) * 0.3 + (Math.random() * 20 - 10);

  const targetWins = Math.ceil(match.bestOf / 2);
  const isP1Winner = p1Power >= p2Power;

  const winnerId = isP1Winner ? p1.id : p2.id;
  const loserScore = Math.floor(Math.random() * targetWins);

  return {
    winnerId,
    p1Score: isP1Winner ? targetWins : loserScore,
    p2Score: isP1Winner ? loserScore : targetWins,
  };
}
