import { DivisionTheme } from '../types/tournament';

export interface DivisionThemeConfig {
  id: DivisionTheme;
  title: string;
  elementName: string;
  cardBorder: string;
  cardBg: string;
  cardHoverBorder: string;
  cardTopBarBg: string;
  cardTopBarBorder: string;
  winnerScoreBg: string;
  winnerRowBg: string;
  liveBadgeBg: string;
  liveBadgeText: string;
  liveBadgeBorder: string;
  roundBadgeBg: string;
  roundBadgeBorder: string;
  roundBadgeText: string;
  roundBadgeShadow: string;
  connectorLineColor: string;
  tabActiveBg: string;
  tabActiveText: string;
  tabActiveBorder: string;
  tabActiveGlow: string;
  titleGradient: string;
  particleColors: string[];
}

export const DIVISION_THEMES: Record<DivisionTheme, DivisionThemeConfig> = {
  ocean: {
    id: 'ocean',
    title: 'Hải Thần Truyền Nhân',
    elementName: 'Lam Ngân Thần Khí • Hải Thần Đảo',
    cardBorder: 'border-cyan-500/30',
    cardHoverBorder: 'hover:border-cyan-300/80',
    cardBg: 'bg-slate-950/75',
    cardTopBarBg: 'bg-sky-950/80',
    cardTopBarBorder: 'border-cyan-500/30',
    winnerScoreBg: 'bg-gradient-to-br from-cyan-200 via-sky-100 to-white text-zinc-950 border-white shadow-md shadow-cyan-400/30',
    winnerRowBg: 'bg-cyan-500/15',
    liveBadgeBg: 'bg-cyan-500/25',
    liveBadgeText: 'text-cyan-200',
    liveBadgeBorder: 'border-cyan-400/50',
    roundBadgeBg: 'bg-sky-950/85',
    roundBadgeBorder: 'border-cyan-400/50',
    roundBadgeText: 'text-cyan-200',
    roundBadgeShadow: 'shadow-cyan-500/25',
    connectorLineColor: 'bg-cyan-400/60',
    tabActiveBg: 'bg-gradient-to-r from-cyan-400 via-sky-300 to-white text-zinc-950 font-black',
    tabActiveText: 'text-zinc-950',
    tabActiveBorder: 'border-cyan-300',
    tabActiveGlow: 'shadow-md shadow-cyan-400/30',
    titleGradient: 'linear-gradient(110deg, #93c5fd 0%, #38bdf8 25%, #ffffff 50%, #7dd3fc 75%, #0284c7 100%)',
    particleColors: ['#ffffff', '#f8fafc', '#e0f2fe', '#bae6fd', '#38bdf8', '#0284c7'],
  },
  forest: {
    id: 'forest',
    title: 'Sâm Lâm Bá Chủ',
    elementName: 'Tinh Đấu Đại Sâm Lâm • Bích Ngân Tiên Thảo',
    cardBorder: 'border-emerald-500/30',
    cardHoverBorder: 'hover:border-emerald-300/80',
    cardBg: 'bg-zinc-950/75',
    cardTopBarBg: 'bg-emerald-950/80',
    cardTopBarBorder: 'border-emerald-500/30',
    winnerScoreBg: 'bg-gradient-to-br from-emerald-200 via-teal-100 to-white text-zinc-950 border-white shadow-md shadow-emerald-400/30',
    winnerRowBg: 'bg-emerald-500/15',
    liveBadgeBg: 'bg-emerald-500/25',
    liveBadgeText: 'text-emerald-200',
    liveBadgeBorder: 'border-emerald-400/50',
    roundBadgeBg: 'bg-emerald-950/85',
    roundBadgeBorder: 'border-emerald-400/50',
    roundBadgeText: 'text-emerald-200',
    roundBadgeShadow: 'shadow-emerald-500/25',
    connectorLineColor: 'bg-emerald-400/60',
    tabActiveBg: 'bg-gradient-to-r from-emerald-400 via-teal-300 to-white text-zinc-950 font-black',
    tabActiveText: 'text-zinc-950',
    tabActiveBorder: 'border-emerald-300',
    tabActiveGlow: 'shadow-md shadow-emerald-400/30',
    titleGradient: 'linear-gradient(110deg, #86efac 0%, #34d399 25%, #ffffff 50%, #6ee7b7 75%, #059669 100%)',
    particleColors: ['#ffffff', '#f8fafc', '#ecfdf5', '#a7f3d0', '#34d399', '#059669'],
  },
  village: {
    id: 'village',
    title: 'Sử Lai Khắc Tân Tinh',
    elementName: 'Thiên Sứ Thánh Quang • Thần Giới Rực Rỡ',
    cardBorder: 'border-amber-500/30',
    cardHoverBorder: 'hover:border-amber-300/80',
    cardBg: 'bg-zinc-950/75',
    cardTopBarBg: 'bg-amber-950/80',
    cardTopBarBorder: 'border-amber-500/30',
    winnerScoreBg: 'bg-gradient-to-br from-amber-200 via-yellow-100 to-white text-zinc-950 border-white shadow-md shadow-amber-400/30',
    winnerRowBg: 'bg-amber-500/15',
    liveBadgeBg: 'bg-amber-500/25',
    liveBadgeText: 'text-amber-200',
    liveBadgeBorder: 'border-amber-400/50',
    roundBadgeBg: 'bg-amber-950/85',
    roundBadgeBorder: 'border-amber-400/50',
    roundBadgeText: 'text-amber-200',
    roundBadgeShadow: 'shadow-amber-500/25',
    connectorLineColor: 'bg-amber-400/60',
    tabActiveBg: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-white text-zinc-950 font-black',
    tabActiveText: 'text-zinc-950',
    tabActiveBorder: 'border-amber-300',
    tabActiveGlow: 'shadow-md shadow-amber-400/30',
    titleGradient: 'linear-gradient(110deg, #fde047 0%, #fbbf24 25%, #ffffff 50%, #fef08a 75%, #d97706 100%)',
    particleColors: ['#ffffff', '#f8fafc', '#fef9c3', '#fde047', '#fbbf24', '#d97706'],
  },
};

export function getDivisionTheme(theme?: DivisionTheme): DivisionThemeConfig {
  if (!theme || !DIVISION_THEMES[theme]) return DIVISION_THEMES.ocean;
  return DIVISION_THEMES[theme];
}
