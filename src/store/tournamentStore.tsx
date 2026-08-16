import React, { createContext, useContext, useEffect, useState, useOptimistic, useTransition, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Bracket, BracketId, Match, Participant, UserRole } from '../types/tournament';
import { getInitialTournamentData } from '../engine/defaultData';
import { advanceWinner, generateTournamentBracket, resetMatch, simulateMatchOutcome } from '../engine/bracketEngine';
import { soundEngine } from '../engine/soundEngine';

const STORAGE_KEY = 'soul_land_pvp_tournament_v2';
const BROADCAST_CHANNEL_NAME = 'soul_land_pvp_sync_channel';

interface TournamentContextType {
  brackets: Record<BracketId, Bracket>;
  participants: Record<string, Participant>;
  matches: Record<string, Match>;
  selectedBracketId: BracketId;
  userRole: UserRole;
  isLoggedIn: boolean;
  adminUser: { name: string; username: string } | null;
  soundEnabled: boolean;
  searchQuery: string;
  selectedSectFilter: string;
  selectedMatchId: string | null;
  isSimulating: boolean;

  // Actions
  setSelectedBracketId: (id: BracketId) => void;
  setUserRole: (role: UserRole) => void;
  loginAdmin: (username: string, pass: string) => { success: boolean; message?: string };
  logoutAdmin: () => void;
  toggleSound: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedSectFilter: (sect: string) => void;
  setSelectedMatchId: (id: string | null) => void;
  handleAdvanceWinner: (matchId: string, winnerId: string, scores?: { p1Score: number; p2Score: number }) => void;
  handleResetMatch: (matchId: string) => void;
  handleRegenerateBracket: (bracketId: BracketId) => void;
  handleShuffleBracket: (bracketId: BracketId) => void;
  handleAddParticipant: (participant: Participant) => void;
  handleUpdateParticipant: (participant: Participant) => void;
  handleDeleteParticipant: (id: string) => void;
  handleUpdateMatchDetails: (matchId: string, updates: Partial<Match>) => void;
  handleSimulateNextStep: (bracketId?: BracketId) => void;
  handleSimulateAll: (bracketId?: BracketId) => Promise<void>;
  handleResetAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const TournamentContext = createContext<TournamentContextType | null>(null);

const ADMIN_SESSION_KEY = 'soul_land_admin_session_v1';

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brackets, setBrackets] = useState<Record<BracketId, Bracket>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.brackets) return parsed.brackets;
      } catch {}
    }
    return getInitialTournamentData().brackets;
  });

  const [participants, setParticipants] = useState<Record<string, Participant>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.participants) return parsed.participants;
      } catch {}
    }
    return getInitialTournamentData().participants;
  });

  const [matches, setMatches] = useState<Record<string, Match>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.matches) return parsed.matches;
      } catch {}
    }
    return getInitialTournamentData().matches;
  });

  const [selectedBracketId, setSelectedBracketIdState] = useState<BracketId>('bracket-a');
  
  // Admin auth state (session persisted in localStorage)
  const [adminUser, setAdminUser] = useState<{ name: string; username: string } | null>(() => {
    const saved = localStorage.getItem(ADMIN_SESSION_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(ADMIN_SESSION_KEY));
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    return localStorage.getItem(ADMIN_SESSION_KEY) ? 'admin' : 'viewer';
  });

  const loginAdmin = (username: string, pass: string): { success: boolean; message?: string } => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    const validAccounts: Record<string, { pass: string; name: string }> = {
      'parker': { pass: 'parker123', name: 'Parker (BTC)' },
      'nguyen': { pass: 'nguyen123', name: 'Nguyễn (Trọng Tài)' },
      'hieu': { pass: 'hieu123', name: 'Hiếu (Kỹ Thuật)' },
    };

    if (validAccounts[cleanUser] && validAccounts[cleanUser].pass === cleanPass) {
      const user = {
        name: validAccounts[cleanUser].name,
        username: cleanUser,
      };
      setAdminUser(user);
      setIsLoggedIn(true);
      setUserRole('admin');
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
      soundEngine.playGong();
      return { success: true };
    }

    return {
      success: false,
      message: 'Tài khoản hoặc mật khẩu không chính xác!',
    };
  };

  const logoutAdmin = () => {
    soundEngine.playClick();
    setAdminUser(null);
    setIsLoggedIn(false);
    setUserRole('viewer');
    localStorage.removeItem(ADMIN_SESSION_KEY);
  };
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSectFilter, setSelectedSectFilter] = useState<string>('all');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Sync state to LocalStorage
  const persistState = useCallback((b: typeof brackets, p: typeof participants, m: typeof matches) => {
    try {
      const data = { brackets: b, participants: p, matches: m };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      // Broadcast to other tabs
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        channel.postMessage({ type: 'STATE_UPDATE', payload: data });
        channel.close();
      }
    } catch {}
  }, []);

  // Listen to BroadcastChannel for real-time cross-tab updates (Supabase Realtime mimic)
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event.data?.type === 'STATE_UPDATE') {
        const { brackets: b, participants: p, matches: m } = event.data.payload;
        if (b) setBrackets(b);
        if (p) setParticipants(p);
        if (m) setMatches(m);
      }
    };
    return () => {
      channel.close();
    };
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setEnabled(next);
    if (next) soundEngine.playClick();
  };

  const setSelectedBracketId = (id: BracketId) => {
    setSelectedBracketIdState(id);
    soundEngine.playGong();
  };

  // 1-Click Advance Winner with Optimistic update and particle victory
  const handleAdvanceWinner = (matchId: string, winnerId: string, scores?: { p1Score: number; p2Score: number }) => {
    soundEngine.playAdvanceStrike();
    const updated = advanceWinner(matches, matchId, winnerId, scores);
    setMatches(updated);
    persistState(brackets, participants, updated);

    // Check if this was the Grand Final
    const match = updated[matchId];
    if (match && match.round === brackets[match.bracketId]?.totalRounds && !match.isThirdPlaceMatch) {
      soundEngine.playVictoryFanfare();
      // Trigger gold confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#FCD34D', '#38BDF8', '#EC4899', '#10B981'],
        });
      } catch {}
    }
  };

  const handleResetMatch = (matchId: string) => {
    soundEngine.playClick();
    const updated = resetMatch(matches, matchId);
    setMatches(updated);
    persistState(brackets, participants, updated);
  };

  const handleRegenerateBracket = (bId: BracketId) => {
    soundEngine.playGong();
    const bParticipants = Object.values(participants).filter(p => p.bracketId === bId);
    const newBracketMatches = generateTournamentBracket(bId, bParticipants, true);

    // Keep other bracket matches intact
    const updatedMatches = { ...matches };
    Object.keys(updatedMatches).forEach(k => {
      if (updatedMatches[k].bracketId === bId) {
        delete updatedMatches[k];
      }
    });

    Object.assign(updatedMatches, newBracketMatches);
    setMatches(updatedMatches);
    persistState(brackets, participants, updatedMatches);
  };

  const handleShuffleBracket = (bId: BracketId) => {
    soundEngine.playGong();
    const bParticipants = Object.values(participants).filter(p => p.bracketId === bId);
    // Randomize bracket pairings
    const newBracketMatches = generateTournamentBracket(bId, bParticipants, true);

    const updatedMatches = { ...matches };
    Object.keys(updatedMatches).forEach(k => {
      if (updatedMatches[k].bracketId === bId) {
        delete updatedMatches[k];
      }
    });

    Object.assign(updatedMatches, newBracketMatches);
    setMatches(updatedMatches);
    persistState(brackets, participants, updatedMatches);
  };

  const handleAddParticipant = (p: Participant) => {
    soundEngine.playGong();
    const nextP = { ...participants, [p.id]: p };
    setParticipants(nextP);
    // Regenerate and randomly shuffle affected bracket automatically
    const bParticipants = Object.values(nextP).filter(x => x.bracketId === p.bracketId);
    const newMatches = generateTournamentBracket(p.bracketId, bParticipants, true);
    const nextMatches = { ...matches };
    Object.keys(nextMatches).forEach(k => {
      if (nextMatches[k].bracketId === p.bracketId) delete nextMatches[k];
    });
    Object.assign(nextMatches, newMatches);
    setMatches(nextMatches);
    persistState(brackets, nextP, nextMatches);
  };

  const handleUpdateParticipant = (p: Participant) => {
    soundEngine.playClick();
    const nextP = { ...participants, [p.id]: p };
    setParticipants(nextP);
    persistState(brackets, nextP, matches);
  };

  const handleDeleteParticipant = (id: string) => {
    soundEngine.playClick();
    const target = participants[id];
    if (!target) return;
    const bId = target.bracketId;
    const nextP = { ...participants };
    delete nextP[id];
    setParticipants(nextP);

    const bParticipants = Object.values(nextP).filter(x => x.bracketId === bId);
    const newMatches = generateTournamentBracket(bId, bParticipants, true);
    const nextMatches = { ...matches };
    Object.keys(nextMatches).forEach(k => {
      if (nextMatches[k].bracketId === bId) delete nextMatches[k];
    });
    Object.assign(nextMatches, newMatches);
    setMatches(nextMatches);
    persistState(brackets, nextP, nextMatches);
  };

  const handleUpdateMatchDetails = (matchId: string, updates: Partial<Match>) => {
    soundEngine.playClick();
    const match = matches[matchId];
    if (!match) return;
    const updatedMatch = { ...match, ...updates };
    const nextMatches = { ...matches, [matchId]: updatedMatch };
    setMatches(nextMatches);
    persistState(brackets, participants, nextMatches);
  };

  // Simulate next pending match with both participants ready
  const handleSimulateNextStep = (targetBracketId: BracketId = selectedBracketId) => {
    const readyMatches = Object.values(matches).filter(
      m => m.bracketId === targetBracketId &&
           m.status === 'scheduled' &&
           m.player1Id &&
           m.player2Id
    );

    if (readyMatches.length === 0) return;

    // Pick first match by round
    readyMatches.sort((a, b) => a.round - b.round || a.matchIndex - b.matchIndex);
    const target = readyMatches[0];

    const outcome = simulateMatchOutcome(target, participants);
    if (outcome) {
      handleAdvanceWinner(target.id, outcome.winnerId, {
        p1Score: outcome.p1Score,
        p2Score: outcome.p2Score,
      });
    }
  };

  // Auto simulate entire tournament
  const handleSimulateAll = async (targetBracketId: BracketId = selectedBracketId) => {
    setIsSimulating(true);
    let current = { ...matches };

    for (let round = 1; round <= 6; round++) {
      const pending = Object.values(current).filter(
        m => m.bracketId === targetBracketId &&
             m.status === 'scheduled' &&
             m.player1Id &&
             m.player2Id
      );

      if (pending.length === 0) break;

      for (const m of pending) {
        const outcome = simulateMatchOutcome(m, participants);
        if (outcome) {
          current = advanceWinner(current, m.id, outcome.winnerId, {
            p1Score: outcome.p1Score,
            p2Score: outcome.p2Score,
          });
        }
      }
      setMatches({ ...current });
      await new Promise(r => setTimeout(r, 400));
    }

    persistState(brackets, participants, current);
    setIsSimulating(false);
    soundEngine.playVictoryFanfare();
  };

  const handleResetAllData = () => {
    soundEngine.playGong();
    localStorage.removeItem(STORAGE_KEY);
    const initial = getInitialTournamentData();
    setBrackets(initial.brackets);
    setParticipants(initial.participants);
    setMatches(initial.matches);
    persistState(initial.brackets, initial.participants, initial.matches);
  };

  const exportDataJSON = (): string => {
    return JSON.stringify({ brackets, participants, matches }, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.brackets && data.participants && data.matches) {
        setBrackets(data.brackets);
        setParticipants(data.participants);
        setMatches(data.matches);
        persistState(data.brackets, data.participants, data.matches);
        soundEngine.playGong();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <TournamentContext.Provider
      value={{
        brackets,
        participants,
        matches,
        selectedBracketId,
        userRole,
        isLoggedIn,
        adminUser,
        soundEnabled,
        searchQuery,
        selectedSectFilter,
        selectedMatchId,
        isSimulating,
        setSelectedBracketId,
        setUserRole,
        loginAdmin,
        logoutAdmin,
        toggleSound,
        setSearchQuery,
        setSelectedSectFilter,
        setSelectedMatchId,
        handleAdvanceWinner,
        handleResetMatch,
        handleRegenerateBracket,
        handleShuffleBracket,
        handleAddParticipant,
        handleUpdateParticipant,
        handleDeleteParticipant,
        handleUpdateMatchDetails,
        handleSimulateNextStep,
        handleSimulateAll,
        handleResetAllData,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
