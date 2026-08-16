// Soul Land Character Sprites & Artwork Library
// High quality standing anime characters from Soul Land (Đấu La Đại Lục)

export interface CharacterSprite {
  id: string;
  name: string;
  title: string;
  martialSoul: string;
  spriteUrl: string;
  auraColor: string;
}

export const SOUL_LAND_HEROES: CharacterSprite[] = [
  {
    id: 'tang-san',
    name: 'Đường Tam',
    title: 'Hải Thần / Tu La Thần',
    martialSoul: 'Hải Thần Tam Xoa Kích',
    spriteUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
    auraColor: '#06b6d4',
  },
  {
    id: 'qian-renxue',
    name: 'Thiên Nhận Tuyết',
    title: 'Thiên Sứ Thần',
    martialSoul: 'Lục Dực Thiên Sứ',
    spriteUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
    auraColor: '#f59e0b',
  },
  {
    id: 'xiao-wu',
    name: 'Tiểu Vũ',
    title: 'Nhu Cốt Đấu La',
    martialSoul: 'Nhu Cốt Thỏ',
    spriteUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80',
    auraColor: '#ec4899',
  },
  {
    id: 'dai-mubai',
    name: 'Đới Mộc Bạch',
    title: 'Bạch Hổ Đấu La',
    martialSoul: 'Tà Mâu Bạch Hổ',
    spriteUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    auraColor: '#3b82f6',
  },
  {
    id: 'zhu-zhuqing',
    name: 'Chu Trúc Thanh',
    title: 'U Minh Đấu La',
    martialSoul: 'U Minh Linh Miêu',
    spriteUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
    auraColor: '#8b5cf6',
  },
  {
    id: 'chen-xin',
    name: 'Kiếm Đạo Trần Tâm',
    title: 'Kiếm Đấu La',
    martialSoul: 'Thất Sát Kiếm',
    spriteUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80',
    auraColor: '#6366f1',
  },
  {
    id: 'bibi-dong',
    name: 'Bỉ Bỉ Đông',
    title: 'La Sát Thần',
    martialSoul: 'Phệ Hồn Đại Xoa Ngao',
    spriteUrl: 'https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=400&auto=format&fit=crop&q=80',
    auraColor: '#a855f7',
  },
  {
    id: 'bo-saixi',
    name: 'Ba Tắc Tây',
    title: 'Hải Thần Đấu La',
    martialSoul: 'Hải Thần Chi Quang',
    spriteUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    auraColor: '#0ea5e9',
  },
  {
    id: 'dugu-bo',
    name: 'Độc Cô Bác',
    title: 'Độc Đấu La',
    martialSoul: 'Bích Lân Xà Hoàng',
    spriteUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&auto=format&fit=crop&q=80',
    auraColor: '#10b981',
  },
  {
    id: 'gu-rong',
    name: 'Cổ Dung',
    title: 'Cốt Đấu La',
    martialSoul: 'Cốt Long',
    spriteUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    auraColor: '#64748b',
  },
  {
    id: 'ning-rongrong',
    name: 'Ninh Vinh Vinh',
    title: 'Cửu Thải Đấu La',
    martialSoul: 'Cửu Bảo Lưu Ly Tháp',
    spriteUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    auraColor: '#06b6d4',
  },
  {
    id: 'oscar',
    name: 'Áo Tư Tạp',
    title: 'Thực Thần Đấu La',
    martialSoul: 'Cửu Hóa Hương Tràng',
    spriteUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    auraColor: '#f97316',
  },
  {
    id: 'ma-hongjun',
    name: 'Mã Hồng Tuấn',
    title: 'Phượng Hoàng Đấu La',
    martialSoul: 'Thập Thủ Hỏa Phượng',
    spriteUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    auraColor: '#ef4444',
  },
];

// Rich stylized vector avatars for Soul Land characters that render crisp at any resolution
export interface CharacterVisual {
  avatarIcon: string;
  silhouette: string;
  ringColor: string;
  themeColor: string;
  roleTitle: string;
}

export const CHARACTER_VISUAL_MAP: Record<string, CharacterVisual> = {
  'Hải Thần Tam Xoa Kích': {
    avatarIcon: '🔱',
    silhouette: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0c4a6e 100%)',
    ringColor: '#38bdf8',
    themeColor: 'from-cyan-500 to-blue-700',
    roleTitle: 'Hải Thần',
  },
  'Tu La Ma Kiếm': {
    avatarIcon: '🗡️',
    silhouette: 'linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #450a0a 100%)',
    ringColor: '#f87171',
    themeColor: 'from-red-600 to-rose-900',
    roleTitle: 'Tu La Thần',
  },
  'Thất Sát Kiếm': {
    avatarIcon: '⚔️',
    silhouette: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 50%, #2e1065 100%)',
    ringColor: '#a78bfa',
    themeColor: 'from-purple-600 to-indigo-900',
    roleTitle: 'Kiếm Đấu La',
  },
  'Lục Dực Thiên Sứ': {
    avatarIcon: '🪽',
    silhouette: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)',
    ringColor: '#fbbf24',
    themeColor: 'from-amber-400 to-yellow-600',
    roleTitle: 'Thiên Sứ Thần',
  },
  'Hạo Thiên Chùy': {
    avatarIcon: '🔨',
    silhouette: 'linear-gradient(135deg, #ea580c 0%, #c2410c 50%, #7c2d12 100%)',
    ringColor: '#fb923c',
    themeColor: 'from-orange-500 to-red-700',
    roleTitle: 'Hạo Thiên Đấu La',
  },
  'Tà Mâu Bạch Hổ': {
    avatarIcon: '🐯',
    silhouette: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e3a8a 100%)',
    ringColor: '#60a5fa',
    themeColor: 'from-blue-500 to-indigo-700',
    roleTitle: 'Bạch Hổ Đấu La',
  },
  'U Minh Linh Miêu': {
    avatarIcon: '🐱',
    silhouette: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 50%, #3b0764 100%)',
    ringColor: '#c084fc',
    themeColor: 'from-fuchsia-600 to-purple-900',
    roleTitle: 'U Minh Đấu La',
  },
  'Thập Thủ Hỏa Phượng Hoàng': {
    avatarIcon: '🔥',
    silhouette: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 50%, #7f1d1d 100%)',
    ringColor: '#f87171',
    themeColor: 'from-rose-500 to-orange-700',
    roleTitle: 'Phượng Hoàng Đấu La',
  },
  'Lam Điện Bá Vương Long': {
    avatarIcon: '⚡',
    silhouette: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 50%, #1e1b4b 100%)',
    ringColor: '#818cf8',
    themeColor: 'from-indigo-500 to-blue-800',
    roleTitle: 'Long Đấu La',
  },
  'Bích Lân Xà Hoàng': {
    avatarIcon: '🐍',
    silhouette: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)',
    ringColor: '#34d399',
    themeColor: 'from-emerald-500 to-teal-800',
    roleTitle: 'Độc Đấu La',
  },
  'Hoang Cổ Thần Cự Nhân': {
    avatarIcon: '🗿',
    silhouette: 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #14532d 100%)',
    ringColor: '#4ade80',
    themeColor: 'from-green-600 to-emerald-900',
    roleTitle: 'Cự Nhân Đấu La',
  },
  'Cốt Long Không Gian': {
    avatarIcon: '🦴',
    silhouette: 'linear-gradient(135deg, #64748b 0%, #475569 50%, #1e293b 100%)',
    ringColor: '#94a3b8',
    themeColor: 'from-slate-500 to-zinc-800',
    roleTitle: 'Cốt Đấu La',
  },
  'Quỷ Mị Huyễn Ảnh': {
    avatarIcon: '👻',
    silhouette: 'linear-gradient(135deg, #334155 0%, #1e293b 50%, #0f172a 100%)',
    ringColor: '#cbd5e1',
    themeColor: 'from-zinc-600 to-slate-900',
    roleTitle: 'Quỷ Đấu La',
  },
  'Cửu Tâm Hải Đường': {
    avatarIcon: '🌸',
    silhouette: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #831843 100%)',
    ringColor: '#f472b6',
    themeColor: 'from-pink-500 to-rose-700',
    roleTitle: 'Hải Đường Hồn Sư',
  },
  'Hoàng Kim Thánh Long': {
    avatarIcon: '🐉',
    silhouette: 'linear-gradient(135deg, #eab308 0%, #ca8a04 50%, #713f12 100%)',
    ringColor: '#fde047',
    themeColor: 'from-yellow-400 to-amber-600',
    roleTitle: 'Thánh Long Đấu La',
  },
  'Tử Thần Liêm Đao': {
    avatarIcon: '☠️',
    silhouette: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #000000 100%)',
    ringColor: '#c084fc',
    themeColor: 'from-purple-900 to-zinc-950',
    roleTitle: 'Tử Thần Hồn Sư',
  },
};

export function getCharacterVisual(name: string, martialSoul: string): CharacterVisual {
  if (CHARACTER_VISUAL_MAP[martialSoul]) {
    return CHARACTER_VISUAL_MAP[martialSoul];
  }

  // Fallback themed by name hash
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const icons = ['⚔️', '🔱', '🐉', '⚡', '🔥', '🪽', '🛡️', '🗡️', '🌪️', '🏹', '💎'];
  const icon = icons[Math.abs(hash) % icons.length];

  const presets = [
    { ringColor: '#38bdf8', themeColor: 'from-cyan-500 to-blue-700', roleTitle: 'Hồn Sư Thần Bí' },
    { ringColor: '#fbbf24', themeColor: 'from-amber-400 to-yellow-700', roleTitle: 'Cường Giả Đấu La' },
    { ringColor: '#f472b6', themeColor: 'from-pink-500 to-rose-700', roleTitle: 'Phong Hào Đấu La' },
    { ringColor: '#34d399', themeColor: 'from-emerald-500 to-teal-700', roleTitle: 'Tinh Anh Hồn Sư' },
    { ringColor: '#c084fc', themeColor: 'from-purple-500 to-indigo-800', roleTitle: 'Ẩn Thế Cao Thủ' },
  ];

  const p = presets[Math.abs(hash) % presets.length];

  return {
    avatarIcon: icon,
    silhouette: `linear-gradient(135deg, ${p.ringColor}22 0%, #18181b 100%)`,
    ringColor: p.ringColor,
    themeColor: p.themeColor,
    roleTitle: p.roleTitle,
  };
}
