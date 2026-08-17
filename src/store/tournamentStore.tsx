import React, { createContext, useContext, useEffect, useState, useOptimistic, useTransition, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Bracket, BracketId, Match, Participant, UserRole, PlayerAccount } from '../types/tournament';
import { getInitialTournamentData } from '../engine/defaultData';
import { advanceWinner, generateTournamentBracket, resetMatch, simulateMatchOutcome } from '../engine/bracketEngine';
import { soundEngine } from '../engine/soundEngine';
import { cloudSync } from '../engine/cloudSyncEngine';

const STORAGE_KEY = 'soul_land_pvp_tournament_v12';
const BROADCAST_CHANNEL_NAME = 'soul_land_pvp_sync_channel';
const ADMIN_SESSION_KEY = 'soul_land_admin_session_v1';
const PLAYER_SESSION_KEY = 'soul_land_player_session_v1';

function isValidTournamentPayload(data: any): data is {
  brackets: Record<BracketId, Bracket>;
  participants: Record<string, Participant>;
  matches: Record<string, Match>;
  playerAccounts: Record<string, PlayerAccount>;
} {
  if (!data) return false;
  const matchCount = Object.keys(data.matches || {}).length;
  const participantCount = Object.keys(data.participants || {}).length;
  const bracketCount = Object.keys(data.brackets || {}).length;
  return matchCount >= 15 && participantCount >= 20 && bracketCount >= 3;
}

export function generateUsernameFromPlayerName(name: string): string {
  let clean = name
    .replace(/^GOD[乄乂\.\s\-_]*/i, '') // Remove GOD乄 or GOD. prefix
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove Vietnamese diacritics
    .replace(/[^a-zA-Z0-9]/g, '') // Keep alphanumerics only
    .toLowerCase()
    .trim();
  
  if (!clean || clean.length < 2) {
    clean = name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'tuyenthu';
  }
  return clean;
}
export const PASSWORD_SUFFIXES = [
  'mayman',
  'top1',
  'top2',
  'top3',
  'vodich',
  'venhi',
  'veque',
  'deptrai',
  'badao',
  'batbai',
  'votri',
  'quangthan',
  'haithan',
  'tulamakiem',
  'longthan',
  'chienthan',
  'kiemtien',
  'tuthandao',
  'tuyettrieu',
  'tranhba',
  'honsu99',
  'phongthan',
  'sieucap',
  'thanma',
  'phuonghoang',
  'bachtieu',
  'tamxoa',
  'hoathu',
  'mahoang',
  'chiensi',
  'docco',
  'bachthieu',
];

export function generateRandomPasswordForUser(username: string): string {
  const randomIndex = Math.floor(Math.random() * PASSWORD_SUFFIXES.length);
  const suffix = PASSWORD_SUFFIXES[randomIndex];
  return `${username}${suffix}`;
}

interface TournamentContextType {
  brackets: Record<BracketId, Bracket>;
  participants: Record<string, Participant>;
  matches: Record<string, Match>;
  playerAccounts: Record<string, PlayerAccount>;
  selectedBracketId: BracketId;
  userRole: UserRole;
  isLoggedIn: boolean;
  adminUser: { name: string; username: string } | null;
  loggedInPlayer: PlayerAccount | null;
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
  loginPlayer: (username: string, pass: string) => { success: boolean; message?: string };
  logoutPlayer: () => void;
  claimPlayerAccount: (
    participantId: string,
    email: string
  ) => Promise<{ success: boolean; username: string; password: string; message?: string }>;
  submitPlayerBan: (
    matchId: string,
    playerId: string,
    banHero: string
  ) => { success: boolean; message?: string };
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
  handleResetPlayerAccount: (participantId: string) => void;
  handleAdminQuickCreateAccount: (participantId: string) => { success: boolean; username: string; password: string; message?: string };
  handleUpdateMatchDetails: (matchId: string, updates: Partial<Match>) => void;
  handleSimulateNextStep: (bracketId?: BracketId) => void;
  handleSimulateAll: (bracketId?: BracketId) => Promise<void>;
  handleResetAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const TournamentContext = createContext<TournamentContextType | null>(null);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brackets, setBrackets] = useState<Record<BracketId, Bracket>>(() => {
    const defaultBrackets = getInitialTournamentData().brackets;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.brackets && Object.keys(parsed.brackets).length >= 3) {
          return { ...defaultBrackets, ...parsed.brackets };
        }
      } catch {}
    }
    return defaultBrackets;
  });

  const [participants, setParticipants] = useState<Record<string, Participant>>(() => {
    const defaultParts = getInitialTournamentData().participants;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.participants && Object.keys(parsed.participants).length >= 30) {
          return { ...defaultParts, ...parsed.participants };
        }
      } catch {}
    }
    return defaultParts;
  });

  const [matches, setMatches] = useState<Record<string, Match>>(() => {
    const defaultData = getInitialTournamentData();
    let initialMatches: Record<string, Match> = { ...defaultData.matches };

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.matches && Object.keys(parsed.matches).length >= 30) {
          initialMatches = { ...defaultData.matches, ...parsed.matches };
        }
      } catch {}
    }

    // Auto-migrate: All regular rounds -> Bo1, Finals & 3rd Place -> Bo3
    const initialBrackets = defaultData.brackets;
    const migrated: Record<string, Match> = {};
    for (const [id, m] of Object.entries(initialMatches)) {
      const br = initialBrackets[m.bracketId];
      const totalRounds = br ? br.totalRounds : 3;
      const isFinal = m.round === totalRounds && !m.isThirdPlaceMatch;
      const isThird = Boolean(m.isThirdPlaceMatch);
      migrated[id] = {
        ...m,
        bestOf: isFinal || isThird ? 3 : 1,
      };
    }
    return migrated;
  });

  const [playerAccounts, setPlayerAccounts] = useState<Record<string, PlayerAccount>>(() => {
    const defaultAccounts = getInitialTournamentData().playerAccounts || {};
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.playerAccounts) {
          return { ...defaultAccounts, ...parsed.playerAccounts };
        }
      } catch {}
    }
    return defaultAccounts;
  });

  const [selectedBracketId, setSelectedBracketIdState] = useState<BracketId>('bracket-a');
  
  // Admin auth state
  const [adminUser, setAdminUser] = useState<{ name: string; username: string } | null>(() => {
    const saved = localStorage.getItem(ADMIN_SESSION_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  // Player auth state
  const [loggedInPlayer, setLoggedInPlayer] = useState<PlayerAccount | null>(() => {
    const saved = localStorage.getItem(PLAYER_SESSION_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem(PLAYER_SESSION_KEY));
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    if (localStorage.getItem(ADMIN_SESSION_KEY)) return 'admin';
    if (localStorage.getItem(PLAYER_SESSION_KEY)) return 'player';
    return 'viewer';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSectFilter, setSelectedSectFilter] = useState<string>('all');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Sync state to LocalStorage, BroadcastChannel, and Cloud Backend
  const persistState = useCallback((
    b: typeof brackets,
    p: typeof participants,
    m: typeof matches,
    accs: typeof playerAccounts = playerAccounts
  ) => {
    try {
      const data = { brackets: b, participants: p, matches: m, playerAccounts: accs };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      // 1. Broadcast to other tabs on same device
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        channel.postMessage({ type: 'STATE_UPDATE', payload: data });
        channel.close();
      }

      // 2. Push to Cloud Backend & WebSockets for cross-device realtime sync
      cloudSync.pushState(data);
    } catch {}
  }, [playerAccounts]);

  // Listen to BroadcastChannel and CloudSync for real-time cross-device updates
  useEffect(() => {
    // 1. Initial Cloud Fetch & Auto-Seed
    cloudSync.fetchLatestState().then((cloudData) => {
      const defaultData = getInitialTournamentData();
      if (isValidTournamentPayload(cloudData)) {
        if (cloudData.brackets) setBrackets(cloudData.brackets);
        if (cloudData.matches) setMatches(cloudData.matches);

        // Merge accounts so default 24 accounts are ALWAYS preserved and merged with any new cloud accounts
        const mergedAccounts = {
          ...(defaultData.playerAccounts || {}),
          ...(cloudData.playerAccounts || {}),
        };
        setPlayerAccounts(mergedAccounts);

        // Merge participants and mark claimed
        if (cloudData.participants) {
          const mergedParts = { ...cloudData.participants };
          for (const p of Object.values(mergedParts) as Participant[]) {
            const u = p.username || generateUsernameFromPlayerName(p.name);
            if (mergedAccounts[u]) {
              p.claimed = true;
              p.username = u;
              p.email = mergedAccounts[u].email;
            }
          }
          setParticipants(mergedParts);
        }
      } else {
        // Cloud data is empty or invalid -> Seed cloud with complete initial tournament dataset
        cloudSync.pushState({
          brackets: defaultData.brackets,
          participants: defaultData.participants,
          matches: defaultData.matches,
          playerAccounts: defaultData.playerAccounts || {},
        });
      }
    });

    // 2. Subscribe to Real-time Cloud updates (WebSockets + Polling)
    const unsubscribeCloud = cloudSync.onUpdate((cloudData) => {
      if (isValidTournamentPayload(cloudData)) {
        const defaultData = getInitialTournamentData();
        if (cloudData.brackets) setBrackets(cloudData.brackets);
        if (cloudData.matches) setMatches(cloudData.matches);

        const mergedAccounts = {
          ...(defaultData.playerAccounts || {}),
          ...(cloudData.playerAccounts || {}),
        };
        setPlayerAccounts(mergedAccounts);

        if (cloudData.participants) {
          const mergedParts = { ...cloudData.participants };
          for (const p of Object.values(mergedParts) as Participant[]) {
            const u = p.username || generateUsernameFromPlayerName(p.name);
            if (mergedAccounts[u]) {
              p.claimed = true;
              p.username = u;
              p.email = mergedAccounts[u].email;
            }
          }
          setParticipants(mergedParts);
        }

        // Update local storage cache
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
        } catch {}
      }
    });

    // 3. Listen to local BroadcastChannel for same-device tabs
    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type === 'STATE_UPDATE') {
          const { brackets: b, participants: p, matches: m, playerAccounts: accs } = event.data.payload;
          if (b) setBrackets(b);
          if (p) setParticipants(p);
          if (m) setMatches(m);
          if (accs) setPlayerAccounts(accs);
        }
      };
    }

    return () => {
      unsubscribeCloud();
      if (channel) channel.close();
    };
  }, []);

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
      setLoggedInPlayer(null);
      localStorage.removeItem(PLAYER_SESSION_KEY);
      setIsLoggedIn(true);
      setUserRole('admin');
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
      soundEngine.playGong();
      return { success: true };
    }

    return {
      success: false,
      message: 'Tài khoản hoặc mật khẩu Ban Quản Trị không chính xác!',
    };
  };

  const logoutAdmin = () => {
    soundEngine.playClick();
    setAdminUser(null);
    setIsLoggedIn(false);
    setUserRole('viewer');
    localStorage.removeItem(ADMIN_SESSION_KEY);
  };

  const loginPlayer = (username: string, pass: string): { success: boolean; message?: string } => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    let account = playerAccounts[cleanUser];
    if (!account) {
      const defAcc = getInitialTournamentData().playerAccounts?.[cleanUser];
      if (defAcc) account = defAcc;
    }

    if (account && account.password === cleanPass) {
      // Resolve participantId if missing
      let resolvedId = account.participantId;
      if (!resolvedId) {
        const found = Object.values(participants).find(
          (p) => p.username === cleanUser || generateUsernameFromPlayerName(p.name) === cleanUser
        );
        if (found) resolvedId = found.id;
      }

      const activeAccount: PlayerAccount = {
        ...account,
        participantId: resolvedId,
      };

      setLoggedInPlayer(activeAccount);
      setAdminUser(null);
      localStorage.removeItem(ADMIN_SESSION_KEY);
      setIsLoggedIn(true);
      setUserRole('player');
      localStorage.setItem(PLAYER_SESSION_KEY, JSON.stringify(activeAccount));
      soundEngine.playGong();
      return { success: true };
    }

    return {
      success: false,
      message: 'Tài khoản hoặc mật khẩu tuyển thủ không chính xác! Vui lòng kiểm tra lại email.',
    };
  };

  const logoutPlayer = () => {
    soundEngine.playClick();
    setLoggedInPlayer(null);
    setIsLoggedIn(false);
    setUserRole('viewer');
    localStorage.removeItem(PLAYER_SESSION_KEY);
  };

  // Claim account for a participant
  const claimPlayerAccount = async (
    participantId: string,
    email: string
  ): Promise<{ success: boolean; username: string; password: string; message?: string }> => {
    const targetPlayer = participants[participantId];
    if (!targetPlayer) {
      return { success: false, username: '', password: '', message: 'Không tìm thấy tuyển thủ' };
    }

    const cleanUsername = generateUsernameFromPlayerName(targetPlayer.name);
    
    // Check if account already created for this username
    let password = playerAccounts[cleanUsername]?.password;
    if (!password) {
      password = generateRandomPasswordForUser(cleanUsername);
    }

    const newAccount: PlayerAccount = {
      id: `acc-${participantId}`,
      participantId,
      playerName: targetPlayer.name,
      username: cleanUsername,
      password,
      email: email.trim(),
      claimedAt: new Date().toISOString(),
    };

    // Update state
    const updatedAccounts = {
      ...playerAccounts,
      [cleanUsername]: newAccount,
    };

    const updatedParticipants = {
      ...participants,
      [participantId]: {
        ...targetPlayer,
        claimed: true,
        email: email.trim(),
        username: cleanUsername,
      },
    };

    setPlayerAccounts(updatedAccounts);
    setParticipants(updatedParticipants);
    persistState(brackets, updatedParticipants, matches, updatedAccounts);

    // Send email via Serverless API (voquocthang1809@gmail.com)
    try {
      const response = await fetch('/api/send-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          playerName: targetPlayer.name,
          username: cleanUsername,
          password,
          bracketName: brackets[targetPlayer.bracketId]?.name || 'Tông Môn Tranh Bá',
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.warn('API send-account warning:', data.error);
      }
    } catch (err) {
      console.error('Không thể gọi API gửi email:', err);
    }

    soundEngine.playVictoryFanfare();
    return {
      success: true,
      username: cleanUsername,
      password,
      message: `Đã cấp tài khoản thành công và gửi thông tin về email ${email}!`,
    };
  };

  // Submit 1-time player ban for a match
  const submitPlayerBan = (
    matchId: string,
    playerId: string,
    banHero: string
  ): { success: boolean; message?: string } => {
    const match = matches[matchId];
    if (!match) {
      return { success: false, message: 'Không tìm thấy trận đấu' };
    }

    const cleanBan = banHero.trim();
    if (!cleanBan) {
      return { success: false, message: 'Vui lòng nhập tên tướng muốn cấm' };
    }

    const updated = { ...matches };
    const targetMatch = { ...match };

    if (targetMatch.player1Id === playerId) {
      if (targetMatch.player1Ban) {
        return { success: false, message: 'Bạn đã cấm tướng cho trận này rồi, không thể chỉnh sửa!' };
      }
      targetMatch.player1Ban = cleanBan;
      targetMatch.player1BanTime = new Date().toISOString();
    } else if (targetMatch.player2Id === playerId) {
      if (targetMatch.player2Ban) {
        return { success: false, message: 'Bạn đã cấm tướng cho trận này rồi, không thể chỉnh sửa!' };
      }
      targetMatch.player2Ban = cleanBan;
      targetMatch.player2BanTime = new Date().toISOString();
    } else {
      return { success: false, message: 'Bạn không thuộc danh sách thi đấu của trận này!' };
    }

    updated[matchId] = targetMatch;
    setMatches(updated);
    persistState(brackets, participants, updated);
    soundEngine.playAdvanceStrike();

    return { success: true, message: `Đã cấm tướng "${cleanBan}" thành công!` };
  };

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
    handleRegenerateBracket(bId);
  };

  const handleAddParticipant = (p: Participant) => {
    soundEngine.playClick();
    const updatedParticipants = { ...participants, [p.id]: p };
    setParticipants(updatedParticipants);

    // Automatically generate bracket matches including the new participant
    const bParticipants = Object.values(updatedParticipants).filter(x => x.bracketId === p.bracketId && !x.isGhost);
    const newBracketMatches = generateTournamentBracket(p.bracketId, bParticipants, false);

    const updatedMatches = { ...matches };
    Object.keys(updatedMatches).forEach(k => {
      if (updatedMatches[k].bracketId === p.bracketId) {
        delete updatedMatches[k];
      }
    });

    Object.assign(updatedMatches, newBracketMatches);
    setMatches(updatedMatches);
    persistState(brackets, updatedParticipants, updatedMatches);
  };

  const handleUpdateParticipant = (p: Participant) => {
    soundEngine.playClick();
    const updated = { ...participants, [p.id]: p };
    setParticipants(updated);
    persistState(brackets, updated, matches);
  };

  const handleDeleteParticipant = (id: string) => {
    soundEngine.playClick();
    const updated = { ...participants };
    delete updated[id];
    setParticipants(updated);
    persistState(brackets, updated, matches);
  };

  const handleResetPlayerAccount = (participantId: string) => {
    soundEngine.playClick();
    const targetPlayer = participants[participantId];
    if (!targetPlayer) return;
    const cleanUsername = generateUsernameFromPlayerName(targetPlayer.name);

    const updatedAccounts = { ...playerAccounts };
    delete updatedAccounts[cleanUsername];

    const updatedParticipants = {
      ...participants,
      [participantId]: {
        ...targetPlayer,
        claimed: false,
        email: undefined,
        username: undefined,
      },
    };

    setPlayerAccounts(updatedAccounts);
    setParticipants(updatedParticipants);
    persistState(brackets, updatedParticipants, matches, updatedAccounts);
  };

  const handleAdminQuickCreateAccount = (
    participantId: string
  ): { success: boolean; username: string; password: string; message?: string } => {
    soundEngine.playGong();
    const targetPlayer = participants[participantId];
    if (!targetPlayer) {
      return { success: false, username: '', password: '', message: 'Không tìm thấy tuyển thủ' };
    }

    const cleanUsername = generateUsernameFromPlayerName(targetPlayer.name);
    const password = generateRandomPasswordForUser(cleanUsername);
    const assignedEmail = `${cleanUsername}@pvp.tournament`;

    const newAccount: PlayerAccount = {
      id: `acc-${targetPlayer.id}`,
      participantId: targetPlayer.id,
      playerName: targetPlayer.name,
      username: cleanUsername,
      password,
      email: assignedEmail,
      claimedAt: new Date().toISOString(),
    };

    const updatedAccounts = {
      ...playerAccounts,
      [cleanUsername]: newAccount,
    };

    const updatedParticipants = {
      ...participants,
      [participantId]: {
        ...targetPlayer,
        claimed: true,
        email: assignedEmail,
        username: cleanUsername,
      },
    };

    setPlayerAccounts(updatedAccounts);
    setParticipants(updatedParticipants);
    persistState(brackets, updatedParticipants, matches, updatedAccounts);

    return {
      success: true,
      username: cleanUsername,
      password,
    };
  };

  const handleUpdateMatchDetails = (matchId: string, updates: Partial<Match>) => {
    soundEngine.playClick();
    const match = matches[matchId];
    if (!match) return;
    const updatedMatch = { ...match, ...updates };
    const updated = { ...matches, [matchId]: updatedMatch };
    setMatches(updated);
    persistState(brackets, participants, updated);
  };

  const handleSimulateNextStep = (bId?: BracketId) => {
    const targetBracketId = bId || selectedBracketId;
    soundEngine.playClick();
    const bMatches = Object.values(matches)
      .filter(m => m.bracketId === targetBracketId && m.status === 'scheduled')
      .sort((a, b) => a.round - b.round || a.matchIndex - b.matchIndex);

    if (bMatches.length === 0) return;

    const nextMatch = bMatches[0];
    const outcome = simulateMatchOutcome(nextMatch, participants);
    if (!outcome) return;

    handleAdvanceWinner(nextMatch.id, outcome.winnerId, {
      p1Score: outcome.p1Score,
      p2Score: outcome.p2Score,
    });
  };

  const handleSimulateAll = async (bId?: BracketId) => {
    const targetBracketId = bId || selectedBracketId;
    setIsSimulating(true);
    soundEngine.playGong();

    let current = { ...matches };
    const totalRounds = brackets[targetBracketId]?.totalRounds || 4;

    for (let r = 1; r <= totalRounds; r++) {
      const pending = Object.values(current).filter(
        m => m.bracketId === targetBracketId && m.round === r && m.status === 'scheduled'
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
    localStorage.removeItem(PLAYER_SESSION_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    const initial = getInitialTournamentData();
    setBrackets(initial.brackets);
    setParticipants(initial.participants);
    setMatches(initial.matches);
    setPlayerAccounts({});
    setAdminUser(null);
    setLoggedInPlayer(null);
    setUserRole('viewer');
    setIsLoggedIn(false);
    persistState(initial.brackets, initial.participants, initial.matches, {});
  };

  const exportDataJSON = (): string => {
    return JSON.stringify({ brackets, participants, matches, playerAccounts }, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.brackets && data.participants && data.matches) {
        setBrackets(data.brackets);
        setParticipants(data.participants);
        setMatches(data.matches);
        if (data.playerAccounts) setPlayerAccounts(data.playerAccounts);
        persistState(data.brackets, data.participants, data.matches, data.playerAccounts || {});
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
        playerAccounts,
        selectedBracketId,
        userRole,
        isLoggedIn,
        adminUser,
        loggedInPlayer,
        soundEnabled,
        searchQuery,
        selectedSectFilter,
        selectedMatchId,
        isSimulating,
        setSelectedBracketId,
        setUserRole,
        loginAdmin,
        logoutAdmin,
        loginPlayer,
        logoutPlayer,
        claimPlayerAccount,
        submitPlayerBan,
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
        handleResetPlayerAccount,
        handleAdminQuickCreateAccount,
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
