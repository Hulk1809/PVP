// Soul Land Heroes, Combat Poses, Spirit Rings, and Combat Power Library

export interface SoulLandHero {
  id: string;
  name: string;
  combatPose: string; // SVG / Visual representation
  spiritRings: string[]; // Ring color hexes (from inner to outer)
  weaponIcon: string;
  auraColor: string;
  combatPower: string;
  serverTag: string;
}

// 5 Spirit Ring Color Tiers:
// White (10yr), Yellow (100yr), Purple (1000yr), Black (10,000yr), Red (100,000yr), Gold (Million yr / God)
export const RING_TIERS = {
  white: '#f8fafc',
  yellow: '#eab308',
  purple: '#a855f7',
  black: '#1e293b',
  red: '#ef4444',
  gold: '#fbbf24',
  cyan: '#06b6d4',
};

export const CHARACTER_COMBAT_ARCHETYPES = [
  {
    martialSoul: 'Hải Thần Tam Xoa Kích',
    heroName: 'Hải Thần Đường Tam',
    weapon: '🔱',
    aura: '#06b6d4',
    rings: [RING_TIERS.yellow, RING_TIERS.purple, RING_TIERS.black, RING_TIERS.red, RING_TIERS.gold],
    powerMultiplier: 250,
  },
  {
    martialSoul: 'Tu La Ma Kiếm',
    heroName: 'Tu La Thần Đường Thần',
    weapon: '🗡️',
    aura: '#dc2626',
    rings: [RING_TIERS.purple, RING_TIERS.black, RING_TIERS.black, RING_TIERS.red, RING_TIERS.red],
    powerMultiplier: 245,
  },
  {
    martialSoul: 'Lục Dực Thiên Sứ',
    heroName: 'Thiên Sứ Thần Thiên Nhận Tuyết',
    weapon: '🪽',
    aura: '#f59e0b',
    rings: [RING_TIERS.yellow, RING_TIERS.purple, RING_TIERS.black, RING_TIERS.black, RING_TIERS.gold],
    powerMultiplier: 240,
  },
  {
    martialSoul: 'Thất Sát Kiếm',
    heroName: 'Kiếm Đạo Trần Tâm',
    weapon: '⚔️',
    aura: '#8b5cf6',
    rings: [RING_TIERS.yellow, RING_TIERS.purple, RING_TIERS.black, RING_TIERS.black, RING_TIERS.red],
    powerMultiplier: 235,
  },
  {
    martialSoul: 'Hạo Thiên Chùy',
    heroName: 'Hạo Thiên Đấu La Đường Hạo',
    weapon: '🔨',
    aura: '#ea580c',
    rings: [RING_TIERS.yellow, RING_TIERS.purple, RING_TIERS.black, RING_TIERS.black, RING_TIERS.red],
    powerMultiplier: 230,
  },
  {
    martialSoul: 'Tà Mâu Bạch Hổ',
    heroName: 'Bạch Hổ Đới Mộc Bạch',
    weapon: '🐯',
    aura: '#3b82f6',
    rings: [RING_TIERS.yellow, RING_TIERS.yellow, RING_TIERS.purple, RING_TIERS.black, RING_TIERS.black],
    powerMultiplier: 210,
  },
  {
    martialSoul: 'U Minh Linh Miêu',
    heroName: 'U Minh Chu Trúc Thanh',
    weapon: '🐱',
    aura: '#a855f7',
    rings: [RING_TIERS.yellow, RING_TIERS.yellow, RING_TIERS.purple, RING_TIERS.black, RING_TIERS.black],
    powerMultiplier: 205,
  },
  {
    martialSoul: 'Thập Thủ Hỏa Phượng Hoàng',
    heroName: 'Phượng Hoàng Mã Hồng Tuấn',
    weapon: '🔥',
    aura: '#ef4444',
    rings: [RING_TIERS.yellow, RING_TIERS.purple, RING_TIERS.black, RING_TIERS.black, RING_TIERS.red],
    powerMultiplier: 215,
  },
  {
    martialSoul: 'Bích Lân Xà Hoàng',
    heroName: 'Độc Đấu La Độc Cô Bác',
    weapon: '🐍',
    aura: '#10b981',
    rings: [RING_TIERS.yellow, RING_TIERS.purple, RING_TIERS.black, RING_TIERS.black, RING_TIERS.black],
    powerMultiplier: 195,
  },
  {
    martialSoul: 'Cốt Long Không Gian',
    heroName: 'Cốt Đấu La Cổ Dung',
    weapon: '🦴',
    aura: '#64748b',
    rings: [RING_TIERS.yellow, RING_TIERS.purple, RING_TIERS.black, RING_TIERS.black, RING_TIERS.black],
    powerMultiplier: 190,
  },
  {
    martialSoul: 'Hoàng Kim Thánh Long',
    heroName: 'Thánh Long Liễu Nhị Long',
    weapon: '🐉',
    aura: '#eab308',
    rings: [RING_TIERS.yellow, RING_TIERS.purple, RING_TIERS.black, RING_TIERS.red, RING_TIERS.gold],
    powerMultiplier: 220,
  },
  {
    martialSoul: 'Tử Thần Liêm Đao',
    heroName: 'La Sát Thần Bỉ Bỉ Đông',
    weapon: '☠️',
    aura: '#9333ea',
    rings: [RING_TIERS.purple, RING_TIERS.black, RING_TIERS.black, RING_TIERS.red, RING_TIERS.gold],
    powerMultiplier: 240,
  },
];

export function getHeroInfo(name: string, martialSoul: string, soulLevel: number = 80, seedRank: number = 1): SoulLandHero {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);

  // Match archetype or pick by hash
  const archetype = CHARACTER_COMBAT_ARCHETYPES.find((a) => a.martialSoul === martialSoul) ||
    CHARACTER_COMBAT_ARCHETYPES[absHash % CHARACTER_COMBAT_ARCHETYPES.length];

  // Calculate combat power like game 3Q (e.g. 19900M, 20200M, 7800M)
  const basePower = soulLevel * (archetype.powerMultiplier || 200) + (15 - Math.min(seedRank, 15)) * 400 + (absHash % 1500);
  const combatPower = `${basePower}M`;

  // Server tag e.g. Z1474-Z1.. or GOD-S1
  const serverTag = `Z${1000 + (absHash % 8999)}-Z1..`;

  return {
    id: `hero-${name}`,
    name,
    combatPose: archetype.heroName,
    spiritRings: archetype.rings,
    weaponIcon: archetype.weapon,
    auraColor: archetype.aura,
    combatPower,
    serverTag,
  };
}
