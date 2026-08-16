import React from 'react';

interface PlayerAvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rank?: string;
  className?: string;
}

// Generate consistent modern esports gradient colors based on player name
function getPlayerTheme(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const themes = [
    { bg: 'from-amber-600 to-yellow-800', border: 'border-amber-500/60', text: 'text-amber-300', glow: 'shadow-amber-500/20' },
    { bg: 'from-cyan-600 to-blue-800', border: 'border-cyan-500/60', text: 'text-cyan-300', glow: 'shadow-cyan-500/20' },
    { bg: 'from-emerald-600 to-teal-800', border: 'border-emerald-500/60', text: 'text-emerald-300', glow: 'shadow-emerald-500/20' },
    { bg: 'from-purple-600 to-indigo-800', border: 'border-purple-500/60', text: 'text-purple-300', glow: 'shadow-purple-500/20' },
    { bg: 'from-rose-600 to-red-800', border: 'border-rose-500/60', text: 'text-rose-300', glow: 'shadow-rose-500/20' },
    { bg: 'from-orange-600 to-amber-800', border: 'border-orange-500/60', text: 'text-orange-300', glow: 'shadow-orange-500/20' },
  ];

  const index = Math.abs(hash) % themes.length;
  return themes[index];
}

// Extract gamer display initials (e.g. GOD乄TTT -> TTT or GD)
function getGamerInitials(name: string): string {
  const clean = name.replace(/^GOD[乄x_]/i, '').trim();
  if (clean.length === 0) return 'G';
  if (clean.length <= 3) return clean.toUpperCase();
  return clean.slice(0, 2).toUpperCase();
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  name,
  size = 'md',
  rank,
  className = '',
}) => {
  const theme = getPlayerTheme(name);
  const initials = getGamerInitials(name);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[9px]',
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  return (
    <div
      className={`relative rounded-xl flex items-center justify-center font-black tracking-wider bg-gradient-to-br ${theme.bg} ${theme.border} border shadow-md ${theme.glow} flex-shrink-0 select-none ${sizeClasses[size]} ${className}`}
    >
      {/* Subtle inner grid pattern / highlight */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10 rounded-xl pointer-events-none" />
      
      {/* Clan tag watermark on larger sizes */}
      {(size === 'lg' || size === 'xl') && (
        <span className="absolute top-1 text-[8px] font-mono font-bold text-white/40 tracking-widest uppercase">
          GOD
        </span>
      )}

      {/* Initials / Gamer Tag */}
      <span className="relative z-10 font-heading font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {initials}
      </span>
    </div>
  );
};
