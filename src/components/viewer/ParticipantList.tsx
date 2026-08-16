import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Shield, Swords, Sparkles } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';
import { Participant } from '../../types/tournament';
import { PlayerAvatar } from '../common/PlayerAvatar';

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
    handleDeleteParticipant,
  } = useTournament();

  const [sortBy, setSortBy] = useState<'seed' | 'name' | 'level'>('seed');

  const currentBracket = brackets[selectedBracketId];
  if (!currentBracket) return null;

  // Filter participants
  let list = Object.values(participants).filter((p) => p.bracketId === selectedBracketId);

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
    if (sortBy === 'seed') return (a.seedRank || 999) - (b.seedRank || 999);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'level') return (b.soulLevel || 0) - (a.soulLevel || 0);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              Danh Sách Tuyển Thủ
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {list.length} tuyển thủ
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {currentBracket.name} • {currentBracket.tierName}
          </p>
        </div>

        {/* Add Player button for Admin */}
        {userRole === 'admin' && (
          <button
            onClick={onOpenAddParticipant}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Tuyển Thủ Mới</span>
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
        
        {/* Search */}
        <div className="relative min-w-[240px] flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên ING..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg text-xs bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Sort Pills */}
        <div className="flex items-center space-x-1">
          <span className="text-[11px] text-zinc-500 mr-1.5">Sắp xếp:</span>
          {(
            [
              { key: 'seed', label: 'Hạt Giống' },
              { key: 'name', label: 'Tên A-Z' },
              { key: 'level', label: 'Cấp Độ' },
            ] as const
          ).map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                sortBy === s.key
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

      </div>

      {/* Grid of Players */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {list.map((p) => {
          return (
            <div
              key={p.id}
              className="group relative rounded-xl bg-zinc-900/80 border border-zinc-800/90 hover:border-zinc-700 p-4 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header: Avatar + Name + Seed */}
                <div className="flex items-start space-x-3">
                  <PlayerAvatar name={p.name} size="md" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                        {p.name}
                      </h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                        #{p.seedRank}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {p.sect}
                    </p>
                  </div>
                </div>

                {/* Info Fields */}
                <div className="mt-3 pt-3 border-t border-zinc-800/60 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Võ Hồn:</span>
                    <span className="text-zinc-200 font-medium truncate max-w-[140px]">
                      {p.martialSoul}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Cấp bậc:</span>
                    <span className="text-amber-400 font-mono font-semibold">
                      Lv.{p.soulLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              {userRole === 'admin' && (
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onOpenEditParticipant(p)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteParticipant(p.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
