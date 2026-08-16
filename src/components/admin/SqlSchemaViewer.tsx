import React, { useState } from 'react';
import { Database, Copy, Check, Shield, Download, Upload, RefreshCw, FileCode } from 'lucide-react';
import { useTournament } from '../../store/tournamentStore';

const SUPABASE_SCHEMA_SQL = `-- ====================================================================
-- NỀN TẢNG QUẢN LÝ GIẢI ĐẤU "TÔNG MÔN TRANH BÁ" - SOUL LAND
-- PostgreSQL Schema & Row Level Security (RLS) Policies for Supabase
-- ====================================================================

-- 1. Kích hoạt tiện ích mở rộng UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Bảng Bảng Đấu (Brackets)
CREATE TABLE IF NOT EXISTS public.brackets (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    division_title VARCHAR(255) NOT NULL,
    tier_name VARCHAR(100) NOT NULL,
    theme VARCHAR(50) NOT NULL,
    poster_url TEXT,
    description TEXT,
    primary_color VARCHAR(20),
    accent_color VARCHAR(20),
    status VARCHAR(50) DEFAULT 'in_progress',
    total_rounds INT NOT NULL DEFAULT 4,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng Tuyển Thủ / Tông Môn (Participants)
CREATE TABLE IF NOT EXISTS public.participants (
    id VARCHAR(50) PRIMARY KEY,
    bracket_id VARCHAR(50) REFERENCES public.brackets(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sect VARCHAR(255) NOT NULL,
    martial_soul VARCHAR(255) NOT NULL,
    soul_rank VARCHAR(255) NOT NULL,
    soul_level INT NOT NULL DEFAULT 50,
    avatar TEXT,
    seed_rank INT,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    win_rate NUMERIC(5,2) DEFAULT 0.0,
    bio TEXT,
    is_ghost BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bảng Trận Đấu (Matches) với khóa ngoại tự tham chiếu
CREATE TABLE IF NOT EXISTS public.matches (
    id VARCHAR(100) PRIMARY KEY,
    bracket_id VARCHAR(50) REFERENCES public.brackets(id) ON DELETE CASCADE,
    round INT NOT NULL,
    round_name VARCHAR(100) NOT NULL,
    match_index INT NOT NULL,
    player1_id VARCHAR(50) REFERENCES public.participants(id) ON DELETE SET NULL,
    player2_id VARCHAR(50) REFERENCES public.participants(id) ON DELETE SET NULL,
    player1_score INT DEFAULT 0,
    player2_score INT DEFAULT 0,
    winner_id VARCHAR(50) REFERENCES public.participants(id) ON DELETE SET NULL,
    next_match_id VARCHAR(100) REFERENCES public.matches(id) ON DELETE SET NULL,
    loser_next_match_id VARCHAR(100) REFERENCES public.matches(id) ON DELETE SET NULL,
    is_third_place_match BOOLEAN DEFAULT FALSE,
    scheduled_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled',
    best_of INT DEFAULT 3,
    referee_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- CHÍNH SÁCH BẢO MẬT CẤP DÒNG (ROW LEVEL SECURITY - RLS)
-- ====================================================================

-- Kích hoạt RLS trên tất cả các bảng
ALTER TABLE public.brackets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- 1. Quyền Xem Công Khai (Viewer Portal - PERMISSIVE SELECT)
CREATE POLICY "Public Read Brackets" ON public.brackets
    FOR SELECT USING (true);

CREATE POLICY "Public Read Participants" ON public.participants
    FOR SELECT USING (true);

CREATE POLICY "Public Read Matches" ON public.matches
    FOR SELECT USING (true);

-- 2. Quyền Quản Trị Viên (Admin Portal - 1-Click Advance, Update, Insert)
CREATE POLICY "Admin Modify Brackets" ON public.brackets
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'tournament_admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'tournament_admin');

CREATE POLICY "Admin Modify Participants" ON public.participants
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'tournament_admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'tournament_admin');

CREATE POLICY "Admin Modify Matches" ON public.matches
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'tournament_admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'tournament_admin');

-- 3. Kích hoạt Supabase Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.participants;
`;

export const SqlSchemaViewer: React.FC = () => {
  const { exportDataJSON, importDataJSON, handleResetAllData } = useTournament();
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const data = exportDataJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soul_land_tournament_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          setImportStatus('Nhập dữ liệu thành công!');
        } else {
          setImportStatus('Lỗi cấu trúc tệp JSON!');
        }
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-6 h-6 text-cyan-400" />
            <h3 className="text-2xl font-bold text-white font-heading">
              Kiến Trúc Dữ Liệu & Supabase PostgreSQL
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans-accent">
            Lược đồ cơ sở dữ liệu quan hệ tự tham chiếu và Chính sách bảo mật cấp dòng (RLS) theo tài liệu kiến trúc.
          </p>
        </div>

        {/* Data Backup & Restore Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Sao Lưu JSON</span>
          </button>

          <label className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-all cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Khôi Phục JSON</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleResetAllData}
            title="Khôi phục toàn bộ dữ liệu mẫu mặc định"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-950/50 border border-red-900/60 hover:bg-red-900/60 text-red-300 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Dữ Liệu</span>
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-300">
          {importStatus}
        </div>
      )}

      {/* SQL Code Box with Copy */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>supabase_schema.sql</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-glow-gold"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã Sao Chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao Chép SQL</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 sm:p-6 text-xs font-mono text-cyan-300 bg-slate-950/90 overflow-x-auto leading-relaxed max-h-[500px]">
          {SUPABASE_SCHEMA_SQL}
        </pre>
      </div>

      {/* Architecture Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-amber-300 font-heading">
            <Database className="w-4 h-4 text-amber-400" />
            <span>next_match_id Tự Tham Chiếu</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Mỗi trận đấu trỏ tới trận đấu kế tiếp ở vòng sau. Khi 1-click chọn người thắng, Server Action tự động đẩy ID thí sinh vào vị trí tương ứng (T1 hoặc T2) mà không cần cấu hình thủ công.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-cyan-300 font-heading">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>loser_next_match_id Tranh Hạng 3</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Dành riêng cho 2 trận Bán kết để đẩy 2 tuyển thủ dừng bước xuống trận Tranh Hạng Ba, đảm bảo cơ cấu giải thưởng Quán quân, Á quân và Quý quân hoàn chỉnh.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-emerald-300 font-heading">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Bảo Mật Cấp Dòng (RLS)</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Phân tách tuyệt đối giữa Khán giả (quyền SELECT công khai không cần đăng nhập) và Ban tổ chức (yêu cầu JWT authenticated vai trò tournament_admin để sửa kết quả).
          </p>
        </div>
      </div>

    </div>
  );
};
