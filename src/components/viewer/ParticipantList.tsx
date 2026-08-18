import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search, UserPlus, Trophy, Shield, Swords, Sparkles, Filter, Edit2, Trash2, Key, CheckCircle2, RotateCcw, Zap, Eye, Copy, Check, X } from 'lucide-react';
import { useTournament, generateUsernameFromPlayerName } from '../../store/tournamentStore';
import { Participant } from '../../types/tournament';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { getDivisionTheme } from '../../utils/themeStyles';
import { ClaimAccountModal } from './ClaimAccountModal';

interface ParticipantListProps {
  onOpenAddParticipant?: () => void;
  onOpenEditParticipant: (participant: Participant) => void;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  onOpenAddParticipant,
  onOpenEditParticipant,
}) => {
  const {
    brackets,
    participants,
    playerAccounts,
    selectedBracketId,
    userRole,
    loggedInPlayer,
    handleDeleteParticipant,
    handleResetPlayerAccount,
    handleAdminQuickCreateAccount,
  } = useTournament();

  const [search, setSearch] = useState('');
  const [selectedSect, setSelectedSect] = useState('all');
  const [sortBy, setSortBy] = useState<'seed' | 'name' | 'level'>('seed');
  const [claimingPlayer, setClaimingPlayer] = useState<Participant | null>(null);

  // Admin View/Copy Account Modal state
  const [adminViewingAccount, setAdminViewingAccount] = useState<{
    participant: Participant;
    username: string;
    password: string;
    email?: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const currentBracket = brackets[selectedBracketId];
  if (!currentBracket) return null;

  const themeConfig = getDivisionTheme(currentBracket.theme);

  // Get unique sects for filtering in this bracket
  const currentParticipants = Object.values(participants).filter(
    (p) => p.bracketId === selectedBracketId && !p.isGhost
  );

  const availableSects = useMemo(() => {
    const s = new Set<string>();
    currentParticipants.forEach((p) => s.add(p.sect));
    return Array.from(s);
  }, [currentParticipants]);

  // Filter and sort
  const list = useMemo(() => {
    return currentParticipants
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.martialSoul.toLowerCase().includes(search.toLowerCase());
        const matchesSect = selectedSect === 'all' || p.sect === selectedSect;
        return matchesSearch && matchesSect;
      })
      .sort((a, b) => {
        if (sortBy === 'seed') return (a.seedRank || 99) - (b.seedRank || 99);
        if (sortBy === 'level') return b.soulLevel - a.soulLevel;
        return a.name.localeCompare(b.name);
      });
  }, [currentParticipants, search, selectedSect, sortBy]);

  const handleCopyText = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAdminQuickCreate = (p: Participant) => {
    const res = handleAdminQuickCreateAccount(p.id);
    if (res.success) {
      setAdminViewingAccount({
        participant: p,
        username: res.username,
        password: res.password,
        email: `${res.username}@pvp.tournament`,
      });
    }
  };

  const handleAdminViewExisting = (p: Participant) => {
    const username = p.username || generateUsernameFromPlayerName(p.name);
    const acc = playerAccounts[username];
    setAdminViewingAccount({
      participant: p,
      username: username,
      password: acc ? acc.password : '****** (Đã cấp qua email)',
      email: acc ? acc.email : p.email,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h2
              className="text-2xl sm:text-3xl font-black font-heading tracking-wider"
              style={{
                fontFamily: '"Playfair Display", "Cinzel Decorative", serif',
                fontStyle: 'italic',
                backgroundImage: themeConfig.titleGradient,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Danh Sách Tuyển Thủ
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-white/10 text-slate-300 border border-white/15">
              {list.length} tuyển thủ
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            {currentBracket.name} • {currentBracket.tierName}
          </p>
        </div>

        {userRole === 'admin' && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                // Generate Markdown table with real passwords
                let md = '# 🏆 DANH SÁCH TÀI KHOẢN TUYỂN THỦ THỰC TẾ (KHỚP 100% EMAIL ĐÃ GỬI)\n\n';
                md += '## 👑 TÀI KHOẢN ADMIN\n';
                md += '| Tài Khoản | Mật Khẩu | Vai Trò |\n| :--- | :--- | :--- |\n| `parker` | `parker123` | Parker (Ban Tổ Chức) |\n| `nguyen` | `nguyen123` | Nguyễn (Trọng Tài) |\n| `hieu` | `hieu123` | Hiếu (Kỹ Thuật) |\n\n---\n\n';

                (['bracket-a', 'bracket-b', 'bracket-c'] as const).forEach((bId) => {
                  const br = brackets[bId];
                  if (!br) return;
                  const bParts = Object.values(participants).filter((p) => p.bracketId === bId && !p.isGhost);
                  md += `## 🔱 ${br.name.toUpperCase()} (${bParts.length} Tuyển Thủ)\n\n`;
                  md += '| STT | Hạt Giống | Tên Tuyển Thủ | Tông Môn | Võ Hồn | Cấp | Tên Đăng Nhập | Mật Khẩu Đã Gửi |\n';
                  md += '| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n';
                  bParts
                    .sort((a, b) => (a.seedRank || 99) - (b.seedRank || 99))
                    .forEach((p, idx) => {
                      const u = p.username || generateUsernameFromPlayerName(p.name);
                      const acc = playerAccounts[u];
                      const pass = acc ? acc.password : '(Chưa nhận email)';
                      md += `| ${idx + 1} | #${p.seedRank} | **${p.name}** | ${p.sect} | ${p.martialSoul} | Lv.${p.soulLevel} | \`${u}\` | \`${pass}\` |\n`;
                    });
                  md += '\n---\n\n';
                });

                const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `DANH_SACH_TAI_KHOAN_THUC_TE_${Date.now()}.md`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition-all shadow-sm active:scale-95"
              title="Xuất danh sách tài khoản & mật khẩu thực tế đã gửi qua email"
            >
              <Copy className="w-4 h-4" />
              <span>Xuất File TK/MK Gửi Mail (.md)</span>
            </button>

            {onOpenAddParticipant && (
              <button
                onClick={onOpenAddParticipant}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-zinc-950 hover:bg-slate-200 transition-all shadow-md shadow-white/10 active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>Thêm Tuyển Thủ Mới</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-black/45 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
        
        {/* Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên ING, võ hồn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white/40 transition-colors"
          />
        </div>

        {/* Sect Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedSect('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedSect === 'all'
                ? 'bg-white/20 text-white border border-white/30 font-bold'
                : 'text-slate-400 hover:text-white bg-black/40 border border-white/10'
            }`}
          >
            Tất cả tông môn
          </button>
          {availableSects.map((sect) => (
            <button
              key={sect}
              onClick={() => setSelectedSect(sect)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedSect === sect
                  ? 'bg-white/20 text-white border border-white/30 font-bold'
                  : 'text-slate-400 hover:text-white bg-black/40 border border-white/10'
              }`}
            >
              {sect}
            </button>
          ))}
        </div>

        {/* Sort Pills */}
        <div className="flex items-center space-x-1 flex-shrink-0 text-xs text-slate-400">
          <span className="mr-1">Sắp xếp:</span>
          {[
            { id: 'seed', label: 'Hạt Giống' },
            { id: 'name', label: 'Tên A-Z' },
            { id: 'level', label: 'Cấp Độ' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id as any)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sortBy === s.id
                  ? 'bg-white text-zinc-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white bg-black/30'
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
          const hasAccount = Boolean(p.claimed);

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

                {/* Account Claim Status & Actions Section */}
                <div className="mt-3 pt-2.5 border-t border-white/10">
                  
                  {/* ADMIN VIEW */}
                  {userRole === 'admin' ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-mono">@{username}</span>
                        {hasAccount ? (
                          <span className="flex items-center space-x-1 text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Đã kích hoạt</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">Chưa tạo tài khoản</span>
                        )}
                      </div>

                      {/* Admin Quick Action Buttons */}
                      <div className="flex items-center justify-between gap-1.5 pt-1">
                        {hasAccount ? (
                          <>
                            <button
                              onClick={() => handleAdminViewExisting(p)}
                              className="flex-1 flex items-center justify-center space-x-1 text-[10px] font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 py-1.5 rounded-lg border border-cyan-500/40 transition-all shadow-sm active:scale-95"
                              title="Xem tài khoản & mật khẩu của tuyển thủ"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Xem TK/MK</span>
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Bạn có chắc muốn HỦY & CẤP LẠI tài khoản cho tuyển thủ "${p.name}" không?`)) {
                                  handleResetPlayerAccount(p.id);
                                }
                              }}
                              className="px-2 py-1.5 rounded-lg text-amber-300 hover:text-amber-200 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 transition-colors text-[10px] flex items-center space-x-1 font-semibold"
                              title="Hủy tài khoản cũ để tạo lại"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Cấp lại</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleAdminQuickCreate(p)}
                              className="flex-1 flex items-center justify-center space-x-1 text-[10px] font-bold text-amber-300 bg-amber-950/70 hover:bg-amber-900/90 py-1.5 rounded-lg border border-amber-500/50 hover:border-amber-400 transition-all shadow-sm active:scale-95 animate-pulse"
                              title="Tạo nhanh TK/MK để copy gửi Zalo/Facebook"
                            >
                              <Zap className="w-3 h-3 text-amber-300" />
                              <span>Tạo TK Nhanh</span>
                            </button>

                            <button
                              onClick={() => setClaimingPlayer(p)}
                              className="px-2.5 py-1.5 rounded-lg text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 transition-colors text-[10px] flex items-center space-x-1 font-semibold"
                              title="Gửi tài khoản về Email của tuyển thủ"
                            >
                              <Key className="w-3 h-3" />
                              <span>Gửi Mail</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* PLAYER / VIEWER VIEW */
                    <div className="flex items-center justify-between">
                      {loggedInPlayer ? (
                        p.id === loggedInPlayer.participantId ? (
                          <div className="flex items-center space-x-1 text-[10px] text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-400/40 shadow-sm shadow-cyan-500/20">
                            <CheckCircle2 className="w-3 h-3 text-cyan-300" />
                            <span>Tài khoản của bạn</span>
                          </div>
                        ) : hasAccount ? (
                          <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/30 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Đã kích hoạt</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Chưa kích hoạt</span>
                        )
                      ) : hasAccount ? (
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
                  )}

                </div>
              </div>

              {/* Admin Edit/Delete Actions */}
              {userRole === 'admin' && (
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-end space-x-2">
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

      {/* Claim Account Modal (Email Dispatch) */}
      {claimingPlayer && (
        <ClaimAccountModal
          participant={claimingPlayer}
          onClose={() => setClaimingPlayer(null)}
        />
      )}

      {/* ADMIN VIEW / COPY ACCOUNT MODAL */}
      {adminViewingAccount &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-md bg-gradient-to-b from-zinc-900 via-black to-zinc-950 border border-amber-500/50 rounded-2xl p-6 shadow-2xl shadow-amber-500/20">
              
              {/* Close Button */}
              <button
                onClick={() => setAdminViewingAccount(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center space-x-3 border-b border-white/10 pb-4 mb-4">
                <PlayerAvatar name={adminViewingAccount.participant.name} size="md" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">
                      {adminViewingAccount.participant.name}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                      Tài Khoản Tuyển Thủ
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {adminViewingAccount.participant.sect} • Lv.{adminViewingAccount.participant.soulLevel}
                  </p>
                </div>
              </div>

              {/* Account Credentials Display */}
              <div className="space-y-3 bg-black/60 p-4 rounded-xl border border-white/15">
                
                {/* Username Row */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Tên Đăng Nhập (Username)
                  </label>
                  <div className="flex items-center justify-between bg-zinc-950/90 px-3 py-2 rounded-lg border border-white/10">
                    <span className="font-mono text-sm font-bold text-cyan-300 select-all">
                      {adminViewingAccount.username}
                    </span>
                    <button
                      onClick={() => handleCopyText(adminViewingAccount.username, 'username')}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Sao chép tên đăng nhập"
                    >
                      {copiedField === 'username' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Row */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Mật Khẩu (Password)
                  </label>
                  <div className="flex items-center justify-between bg-zinc-950/90 px-3 py-2 rounded-lg border border-white/10">
                    <span className="font-mono text-sm font-bold text-amber-300 select-all">
                      {adminViewingAccount.password}
                    </span>
                    <button
                      onClick={() => handleCopyText(adminViewingAccount.password, 'password')}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Sao chép mật khẩu"
                    >
                      {copiedField === 'password' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {adminViewingAccount.email && (
                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Email liên kết:</span>
                    <span className="text-slate-300 font-mono truncate max-w-[200px]">
                      {adminViewingAccount.email}
                    </span>
                  </div>
                )}
              </div>

              {/* Copy Full Message Button for Zalo / FB */}
              <button
                onClick={() => {
                  const message = `🏆 THÔNG TIN TÀI KHOẢN THI ĐẤU ĐẤU LA ĐẠI LỤC 🏆\n👤 Tuyển thủ: ${adminViewingAccount.participant.name}\n🔑 Tên đăng nhập: ${adminViewingAccount.username}\n🔒 Mật khẩu: ${adminViewingAccount.password}\n🌐 Link thi đấu: https://pvp-rho.vercel.app`;
                  handleCopyText(message, 'all');
                }}
                className="w-full mt-4 flex items-center justify-center space-x-2 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-amber-500/25"
              >
                {copiedField === 'all' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Đã sao chép toàn bộ thông tin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Sao Chép Toàn Bộ (Gửi Zalo / Messenger)</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center mt-2.5">
                Bạn có thể gửi thông tin này cho tuyển thủ để họ đăng nhập và cấm tướng trực tiếp.
              </p>

            </div>
          </div>,
          document.body
        )}

    </div>
  );
};
