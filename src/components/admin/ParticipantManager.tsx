import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Sparkles, Wand2 } from 'lucide-react';
import { Participant, BracketId } from '../../types/tournament';
import { DEFAULT_SECTS } from '../../engine/defaultData';
import { useTournament } from '../../store/tournamentStore';

interface ParticipantManagerProps {
  isOpen: boolean;
  onClose: () => void;
  participantToEdit?: Participant | null;
}

export const ParticipantManager: React.FC<ParticipantManagerProps> = ({
  isOpen,
  onClose,
  participantToEdit,
}) => {
  const { selectedBracketId, handleAddParticipant, handleUpdateParticipant, participants } = useTournament();

  const [name, setName] = useState('');
  const [sect, setSect] = useState('Đường Môn');
  const [martialSoul, setMartialSoul] = useState('');
  const [soulRank, setSoulRank] = useState('Cấp 90 (Phong Hào Đấu La)');
  const [soulLevel, setSoulLevel] = useState(90);
  const [seedRank, setSeedRank] = useState<number>(1);
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (participantToEdit) {
      setName(participantToEdit.name);
      setSect(participantToEdit.sect);
      setMartialSoul(participantToEdit.martialSoul);
      setSoulRank(participantToEdit.soulRank);
      setSoulLevel(participantToEdit.soulLevel);
      setSeedRank(participantToEdit.seedRank || 1);
      setBio(participantToEdit.bio || '');
    } else {
      // Calculate default seed
      const currentList = Object.values(participants).filter((p) => p.bracketId === selectedBracketId);
      setName('');
      setMartialSoul('');
      setSeedRank(currentList.length + 1);
      setBio('');
    }
  }, [participantToEdit, isOpen, selectedBracketId, participants]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !martialSoul.trim()) return;

    if (participantToEdit) {
      handleUpdateParticipant({
        ...participantToEdit,
        name: name.trim(),
        sect,
        martialSoul: martialSoul.trim(),
        soulRank,
        soulLevel: Number(soulLevel),
        seedRank: Number(seedRank),
        bio: bio.trim(),
      });
    } else {
      const newParticipant: Participant = {
        id: `p-${Date.now()}`,
        bracketId: selectedBracketId,
        name: name.trim(),
        sect,
        martialSoul: martialSoul.trim(),
        soulRank,
        soulLevel: Number(soulLevel),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}&backgroundColor=0284c7`,
        seedRank: Number(seedRank),
        wins: 0,
        losses: 0,
        winRate: 100,
        bio: bio.trim(),
      };
      handleAddParticipant(newParticipant);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white font-heading">
              {participantToEdit ? 'Chỉnh Sửa Hồn Sư' : 'Thêm Hồn Sư Mới'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tên Hồn Sư / Tông Chủ <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Đường Tam, Kiếm Đấu La,..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500/60 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tông Môn / Học Viện
              </label>
              <select
                value={sect}
                onChange={(e) => setSect(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500/60 transition-all cursor-pointer"
              >
                {Object.values(DEFAULT_SECTS).map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Thứ Hạng Hạt Giống (Seed)
              </label>
              <input
                type="number"
                min="1"
                max="64"
                value={seedRank}
                onChange={(e) => setSeedRank(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500/60 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Võ Hồn Sở Hữu <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Lam Ngân Hoàng, Hạo Thiên Chùy, Thất Sát Kiếm,..."
              value={martialSoul}
              onChange={(e) => setMartialSoul(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500/60 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cấp Độ Hồn Lực (1-100)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={soulLevel}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSoulLevel(val);
                  if (val >= 99) setSoulRank(`Cấp ${val} (Thần Cấp)`);
                  else if (val >= 90) setSoulRank(`Cấp ${val} (Phong Hào Đấu La)`);
                  else if (val >= 80) setSoulRank(`Cấp ${val} (Hồn Đấu La)`);
                  else if (val >= 70) setSoulRank(`Cấp ${val} (Hồn Thánh)`);
                  else setSoulRank(`Cấp ${val} (Hồn Sư)`);
                }}
                className="w-full px-3 py-2 rounded-lg text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500/60 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Danh Xưng Cấp Bậc
              </label>
              <input
                type="text"
                value={soulRank}
                onChange={(e) => setSoulRank(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500/60 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tiểu Sử & Tuyệt Học
            </label>
            <textarea
              rows={2}
              placeholder="Mô tả phong cách chiến đấu, võ hồn tuyệt kỹ..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500/60 transition-all resize-none"
            />
          </div>

          {/* Note regarding auto shuffle */}
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Tự động bốc thăm:</strong> Sau khi bạn nhấn nút <strong>"Lưu & Xếp Ngẫu Nhiên"</strong>, đấu thủ mới sẽ được lưu và hệ thống sẽ lập tức bốc thăm xếp ngẫu nhiên lại các cặp đấu trên nhánh đấu.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Hủy
            </button>

            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-yellow-300 shadow-glow-gold transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{participantToEdit ? 'Lưu Thay Đổi' : 'Lưu & Tự Động Xếp Ngẫu Nhiên'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
