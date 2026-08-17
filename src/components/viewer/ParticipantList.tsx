import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Shield, Swords, Sparkles, Key, CheckCircle2, RotateCcw } from 'lucide-react';
import { useTournament, generateUsernameFromPlayerName } from '../../store/tournamentStore';
import { Participant } from '../../types/tournament';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { ClaimAccountModal } from './ClaimAccountModal';

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
    loggedInPlayer,
    searchQuery,
    setSearchQuery,
    handleDeleteParticipant,
    handleResetPlayerAccount,
  } = useTournament();

  const [sortBy, setSortBy] = useState<'seed' | 'name' | 'level'>('seed');
  const [claimingPlayer, setClaimingPlayer] = useState<Participant | null>(null);

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
            <h3
              className="text-xl sm:text-2xl font-black tracking-wider"
              style={{
                fontFamily: '"Playfair Display", "Cinzel", serif',
                fontStyle: 'italic',
                background: 'linear-gradient(110deg, #94a3b8 0%, #cbd5e1 20%, #ffffff 40%, #f8fafc 55%, #cbd5e1 75%, #64748b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Danh Sách Tuyển Thủ
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-slate-200 border border-white/20 backdrop-blur-md">
              {list.length} tuyển thủ
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {currentBracket.name} • {currentBracket.tierName}
          </p>
        </div>

        {/* Add Player button for Admin */}
        {userRole === 'admin' && (
          <button
            onClick={onOpenAddParticipant}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-slate-200 to-white text-zinc-950 hover:from-white hover:to-slate-100 shadow-md shadow-white/15 active:scale-95 transition-all border border-white/30"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Tuyển Thủ Mới</span>
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-black/45 backdrop-blur-md border border-white/15">
        
        {/* Search */}
        <div className="relative min-w-[240px] flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên ING..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg text-xs bg-black/60 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-white shadow-inner"
          />
        </div>

        {/* Sort Pills */}
        <div className="flex items-center space-x-1">
          <span className="text-[11px] text-slate-400 mr-1.5">Sắp xếp:</span>
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
                  ? 'bg-gradient-to-r from-slate-200 to-white text-zinc-950 font-bold shadow-sm'
                  : 'bg-black/40 text-slate-300 hover:text-white border border-white/10'
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
          const username = p.username || generateUsernameFromPlayerName(p.name);
          return (
            <div
              key={p.id}
              className="group relative rounded-2xl bg-gradient-to-b from-zinc-900/80 via-black/70 to-zinc-950/90 backdrop-blur-xl border border-white/15 hover:border-cyan-400/50 p-4 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-cyan-500/20 hover:scale-[1.02] overflow-hidden"
            >
              {/* Corner Metallic Highlights */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40 pointer-events-none" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/40 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/40 pointer-events-none" />

              <div>
                {/* Header: Avatar + Name + Seed */}
                <div className="flex items-start space-x-3">
                  <PlayerAvatar name={p.name} size="md" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-slate-200 transition-colors">
                        {p.name}
                      </h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/60 text-slate-300 border border-white/15">
                        #{p.seedRank}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 truncate mt-0.5 font-sans">
                      {p.sect}
                    </p>
                  </div>
                </div>

                {/* Info Fields */}
                <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Võ Hồn:</span>
                    <span className="text-slate-100 font-medium truncate max-w-[140px]">
                      {p.martialSoul}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Cấp bậc:</span>
                    <span className="text-slate-100 font-mono font-semibold">
                      Lv.{p.soulLevel}
                    </span>
                  </div>
                </div>

                {/* Account Claim Status Section */}
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                  {loggedInPlayer ? (
                    p.id === loggedInPlayer.participantId ? (
                      <div className="flex items-center space-x-1 text-[10px] text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-400/40 shadow-sm shadow-cyan-500/20">
                        <CheckCircle2 className="w-3 h-3 text-cyan-300" />
                        <span>Tài khoản của bạn</span>
                      </div>
                    ) : p.claimed ? (
                      <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/30 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Đã kích hoạt</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">Chưa kích hoạt</span>
                    )
                  ) : p.claimed ? (
                    <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Đã có tài khoản</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setClaimingPlayer(p)}
                      className="flex items-center space-x-1 text-[10px] font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 px-2.5 py-1 rounded-lg border border-cyan-500/40 hover:border-cyan-400 transition-all shadow-sm active:scale-95"
                    >
                      <Key className="w-3 h-3 text-cyan-300" />
                      <span>Nhận Tài Khoản</span>
                    </button>
                  )}

                  <span className="text-[10px] text-slate-500 font-mono" title="Tên đăng nhập">
                    @{username}
                  </span>
                </div>
              </div>

              {/* Admin Actions */}
              {userRole === 'admin' && (
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-end space-x-2">
                  {p.claimed && (
                    <button
                      onClick={() => {
                        if (confirm(`Bạn có muốn HỦY và CẤP LẠI tài khoản cho tuyển thủ "${p.name}" (nếu họ nhập sai email) không?`)) {
                          handleResetPlayerAccount(p.id);
                        }
                      }}
                      title="Cấp lại tài khoản (Reset khi nhập sai email)"
                      className="px-2 py-1 rounded-lg text-amber-300 hover:text-amber-200 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 transition-colors text-[10px] flex items-center space-x-1 font-semibold"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Cấp lại TK</span>
                    </button>
                  )}
                  <button
                    onClick={() => onOpenEditParticipant(p)}
                    title="Chỉnh sửa tuyển thủ"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Bạn có chắc muốn xóa tuyển thủ "${p.name}" không?`)) {
                        handleDeleteParticipant(p.id);
                      }
                    }}
                    title="Xóa tuyển thủ"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {list.length === 0 && (
        <div className="text-center py-16 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
          <p className="text-sm text-slate-400">Không tìm thấy tuyển thủ nào phù hợp</p>
        </div>
      )}

      {/* Claim Account Modal */}
      {claimingPlayer && (
        <ClaimAccountModal
          participant={claimingPlayer}
          onClose={() => setClaimingPlayer(null)}
        />
      )}

    </div>
  );
};
