import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Trophy, Flame, Shield, Sparkles } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';
import { Participant } from '../../types/tournament';
import { DEFAULT_SECTS } from '../../engine/defaultData';

interface ParticipantListProps {
  onOpenAddParticipant: () => void;
  onOpenEditParticipant: (participant: Participant) => void;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  onOpenAddParticipant,
  onOpenEditParticipant,
}) => {
  const {
    brackets,
    participants,
    selectedBracketId,
    userRole,
    searchQuery,
    setSearchQuery,
    selectedSectFilter,
    setSelectedSectFilter,
    handleDeleteParticipant,
  } = useTournament();

  const [sortBy, setSortBy] = useState<'random' | 'seed' | 'level' | 'winrate'>('random');
  const [randomSeed, setRandomSeed] = useState<number>(() => Math.random());

  const currentBracket = brackets[selectedBracketId];
  if (!currentBracket) return null;

  // Filter participants
  let list = Object.values(participants).filter((p) => p.bracketId === selectedBracketId);

  if (selectedSectFilter !== 'all') {
    list = list.filter((p) => p.sect === selectedSectFilter);
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.martialSoul.toLowerCase().includes(q) ||
        p.sect.toLowerCase().includes(q)
    );
  }

  // Sort
  list.sort((a, b) => {
    if (sortBy === 'random') {
      // Pseudo-random consistent sort based on ID and seed
      const hashA = (a.id + randomSeed).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const hashB = (b.id + randomSeed).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return hashA - hashB;
    }
    if (sortBy === 'seed') return (a.seedRank || 999) - (b.seedRank || 999);
    if (sortBy === 'level') return (b.soulLevel || 0) - (a.soulLevel || 0);
    if (sortBy === 'winrate') return (b.winRate || 0) - (a.winRate || 0);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-2xl font-bold text-white font-heading">
              Danh Sách Hồn Sư Tham Chiến
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {list.length} thí sinh
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans-accent">
            Phân khúc: {currentBracket.name} - {currentBracket.divisionTitle}
          </p>
        </div>

        {/* Add Player button for Admin */}
        {userRole === 'admin' && (
          <button
            onClick={onOpenAddParticipant}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-glow-gold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Hồn Sư Mới</span>
          </button>
        )}
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên, võ hồn, tông môn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-all"
            />
          </div>

          {/* Sect Filter */}
          <div className="relative">
            <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedSectFilter}
              onChange={(e) => setSelectedSectFilter(e.target.value)}
              className="pl-8 pr-8 py-1.5 rounded-lg text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500/60 transition-all appearance-none cursor-pointer"
            >
              <option value="all">Tất Cả Tông Môn</option>
              {Object.values(DEFAULT_SECTS).map((sect) => (
                <option key={sect.id} value={sect.name}>
                  {sect.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort options */}
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span>Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as any);
              if (e.target.value === 'random') setRandomSeed(Math.random());
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500/60 text-xs cursor-pointer"
          >
            <option value="random">Xếp Ngẫu Nhiên (Bốc Thăm)</option>
            <option value="seed">Hạt giống (#1 - #N)</option>
            <option value="level">Cấp Hồn Lực (Cao - Thấp)</option>
            <option value="winrate">Tỉ Lệ Thắng (Cao - Thấp)</option>
          </select>
        </div>

      </div>

      {/* Grid of Contestants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {list.map((p) => (
          <div
            key={p.id}
            className="group relative p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/90 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top Row: Avatar, Seed, Name */}
            <div>
              <div className="flex items-start justify-between">
                <div className="relative">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-12 h-12 rounded-full border border-slate-700 object-cover bg-slate-800 group-hover:scale-105 transition-transform"
                  />
                  {p.seedRank && (
                    <span className="absolute -bottom-1 -right-1 text-[10px] font-bold px-1.5 rounded-full bg-amber-500 text-slate-950 shadow-glow-gold">
                      #{p.seedRank}
                    </span>
                  )}
                </div>

                <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {p.sect}
                </span>
              </div>

              <div className="mt-3">
                <h4 className="text-base font-bold text-white font-heading group-hover:text-amber-300 transition-colors">
                  {p.name}
                </h4>
                <p className="text-xs text-amber-400 font-medium">
                  {p.martialSoul}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {p.soulRank}
                </p>
              </div>

              {/* Stats Bar */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Tỉ Lệ Thắng</span>
                  <span className="font-bold text-amber-400">{p.winRate}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                    style={{ width: `${p.winRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Thắng: {p.wins} trận</span>
                  <span>Thua: {p.losses} trận</span>
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            {userRole === 'admin' && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end space-x-2">
                <button
                  onClick={() => onOpenEditParticipant(p)}
                  className="p-1.5 rounded bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 transition-colors"
                  title="Chỉnh sửa thông tin"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteParticipant(p.id)}
                  className="p-1.5 rounded bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 transition-colors"
                  title="Xóa thí sinh"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
