import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Trophy,
  Shield,
  Gift,
  RotateCcw,
  Play,
  Lock,
  Unlock,
  CheckCircle2,
  Users,
  Award,
  Crown,
  Swords,
  Flame,
  Volume2,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTournament, getLotusWheelCandidates } from '../../store/tournamentStore';
import { Participant, LotusWheelWinner } from '../../types/tournament';
import { soundEngine } from '../../engine/soundEngine';

// Colors for Lotus Wheel wedges (Soul Land Spiritual Palettes)
const SECTOR_COLORS = [
  { bg: '#0284c7', text: '#ffffff', glow: '#38bdf8' }, // Ocean Blue
  { bg: '#059669', text: '#ffffff', glow: '#34d399' }, // Emerald Forest
  { bg: '#d97706', text: '#ffffff', glow: '#fbbf24' }, // Imperial Amber
  { bg: '#7c3aed', text: '#ffffff', glow: '#a78bfa' }, // Spirit Purple
  { bg: '#e11d48', text: '#ffffff', glow: '#fb7185' }, // Crimson Flame
  { bg: '#0891b2', text: '#ffffff', glow: '#22d3ee' }, // Cyan Sea
  { bg: '#4f46e5', text: '#ffffff', glow: '#818cf8' }, // Indigo Thunder
  { bg: '#ca8a04', text: '#ffffff', glow: '#facc15' }, // Golden Sun
];

const GIFT_TITLES = [
  'Quà Tôn Hoa Sen • Đặc Biệt',
  'Quà Tôn Hoa Sen • May Mắn',
  'Quà Tri Ân Hồn Sư',
  'Bảo Rương Hồn Sư Tông Môn',
  'Hồn Thạch Thượng Phẩm',
  'Quà Khích Lệ Tinh Thần',
];

export const LotusWheelOfFortune: React.FC = () => {
  const {
    brackets,
    participants,
    matches,
    lotusWheelWinners,
    recordLotusWheelWinner,
    resetLotusWheelWinners,
    userRole,
    adminUser,
  } = useTournament();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [currentWinner, setCurrentWinner] = useState<LotusWheelWinner | null>(null);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'candidates' | 'winners' | 'top3'>('candidates');
  const [adminOverrideLock, setAdminOverrideLock] = useState(false);

  const rotationRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const lastSectorRef = useRef<number>(-1);

  // Compute live candidates, top3, drawn winners, and tournament completion status
  const {
    eligibleCandidates,
    top3Winners,
    alreadyDrawnWinners,
    allBracketsCompleted,
    divisionStatus,
  } = getLotusWheelCandidates(brackets, participants, matches, lotusWheelWinners);

  const isAdmin = userRole === 'admin' || Boolean(adminUser);
  const canSpin = (allBracketsCompleted || adminOverrideLock) && eligibleCandidates.length > 0;

  // Draw the Lotus Wheel on Canvas
  const drawWheel = useCallback((angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 15;

    ctx.clearRect(0, 0, width, height);

    const count = eligibleCandidates.length;

    // Outer Glow Ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 6;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.restore();

    // Outer Metallic Border
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();
    ctx.restore();

    if (count === 0) {
      // Empty wheel message
      ctx.save();
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Đã quay hết danh sách!', centerX, centerY);
      ctx.restore();
      return;
    }

    const arcSize = (Math.PI * 2) / count;

    // Draw Sectors
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    for (let i = 0; i < count; i++) {
      const p = eligibleCandidates[i];
      const startAngle = i * arcSize;
      const endAngle = startAngle + arcSize;
      const colorScheme = SECTOR_COLORS[i % SECTOR_COLORS.length];

      // Sector wedge
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = colorScheme.bg;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.stroke();

      // Sector Text & Avatar Icon
      ctx.save();
      const midAngle = startAngle + arcSize / 2;
      ctx.rotate(midAngle);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;

      // Adjust font size based on number of participants
      const fontSize = count > 30 ? 10 : count > 18 ? 12 : 14;
      ctx.font = `bold ${fontSize}px sans-serif`;

      // Truncate player name if too long
      const displayName = p.name.length > 14 ? p.name.substring(0, 13) + '…' : p.name;
      ctx.fillText(displayName, radius - 24, 4);

      // Mini indicator dot / sect initial
      ctx.beginPath();
      ctx.arc(radius - 12, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = colorScheme.glow;
      ctx.fill();

      ctx.restore();
    }
    ctx.restore();

    // Center Golden Lotus Core (Hỗn Độn Thanh Liên)
    ctx.save();
    const coreRadius = count > 20 ? 38 : 44;

    // Outer core glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreRadius + 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.fill();

    // Inner core circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, coreRadius);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(1, '#78350f');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Center Lotus Logo / Text
    ctx.fillStyle = '#09090b';
    ctx.font = '900 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TÔN HOA SEN', centerX, centerY - 6);
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('LUCKY', centerX, centerY + 8);
    ctx.restore();

    // Top Golden Pointer Needle at 12 o'clock (points downwards into wheel)
    ctx.save();
    ctx.translate(centerX, centerY - radius + 2);

    ctx.beginPath();
    ctx.moveTo(0, 18); // Needle tip
    ctx.lineTo(-12, -10);
    ctx.lineTo(12, -10);
    ctx.closePath();

    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#dc2626';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Needle top cap
    ctx.beginPath();
    ctx.arc(0, -10, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }, [eligibleCandidates]);

  // Initial draw & resize listener
  useEffect(() => {
    drawWheel(currentRotation);
  }, [drawWheel, currentRotation]);

  // Handle Wheel Spin
  const spinWheel = () => {
    if (isSpinning || !canSpin || eligibleCandidates.length === 0) return;

    setIsSpinning(true);
    soundEngine.playGong();

    // 1. Pick a truly random winner from eligible pool
    const count = eligibleCandidates.length;
    const winnerIndex = Math.floor(Math.random() * count);
    const chosenParticipant = eligibleCandidates[winnerIndex];

    // 2. Calculate exact angle to land needle (top at 3*PI/2) on the winner's sector
    const arcSize = (Math.PI * 2) / count;
    
    // In Canvas rotation: sector i starts at `angle + i * arcSize` and ends at `angle + (i + 1) * arcSize`.
    // The top pointer is at angle -PI/2 (or 3*PI/2).
    // So the target rotation angle mod 2PI must place winnerIndex at -PI/2.
    const randomOffsetInWedge = (Math.random() * 0.7 + 0.15) * arcSize; // Land safely in the middle of sector
    const targetAngleOnCircle = 3 * Math.PI / 2 - (winnerIndex * arcSize + randomOffsetInWedge);
    
    // Add 6 to 10 full rotations for exciting spinning effect
    const fullSpins = (Math.floor(Math.random() * 4) + 7) * Math.PI * 2;
    const startAngle = rotationRef.current;
    const totalRotationNeeded = fullSpins + ((targetAngleOnCircle - (startAngle % (Math.PI * 2)) + Math.PI * 4) % (Math.PI * 2));
    const targetAngle = startAngle + totalRotationNeeded;

    const duration = 6500; // 6.5s smooth decelerating spin
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Quartic ease out: starts ultra-fast, decelerates smoothly
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentAngle = startAngle + (targetAngle - startAngle) * easeOut;

      rotationRef.current = currentAngle;
      setCurrentRotation(currentAngle);
      drawWheel(currentAngle);

      // Sound tick on each sector passing the pointer
      const normalizedAngle = (3 * Math.PI / 2 - (currentAngle % (Math.PI * 2)) + Math.PI * 4) % (Math.PI * 2);
      const currentSector = Math.floor(normalizedAngle / arcSize);
      if (currentSector !== lastSectorRef.current) {
        lastSectorRef.current = currentSector;
        soundEngine.playWheelTick();
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished!
        setIsSpinning(false);
        soundEngine.playVictoryFanfare();

        // Trigger glorious confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#38bdf8', '#34d399', '#f43f5e', '#a855f7'],
        });

        // Record Winner
        const giftTitle = GIFT_TITLES[lotusWheelWinners.length % GIFT_TITLES.length];
        const newWinner: LotusWheelWinner = {
          id: `lotto-${chosenParticipant.id}-${Date.now()}`,
          participantId: chosenParticipant.id,
          playerName: chosenParticipant.name,
          sect: chosenParticipant.sect,
          bracketId: chosenParticipant.bracketId,
          bracketName: brackets[chosenParticipant.bracketId]?.name || 'Giải Đấu',
          drawnAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          drawnByAdmin: adminUser?.name || 'Ban Tổ Chức',
          giftTitle,
        };

        recordLotusWheelWinner(newWinner);
        setCurrentWinner(newWinner);
        setIsWinnerModalOpen(true);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  // Fast Draw / Instant Pick for Admin
  const fastDraw = () => {
    if (isSpinning || !canSpin || eligibleCandidates.length === 0) return;
    const winnerIndex = Math.floor(Math.random() * eligibleCandidates.length);
    const chosen = eligibleCandidates[winnerIndex];

    const giftTitle = GIFT_TITLES[lotusWheelWinners.length % GIFT_TITLES.length];
    const newWinner: LotusWheelWinner = {
      id: `lotto-${chosen.id}-${Date.now()}`,
      participantId: chosen.id,
      playerName: chosen.name,
      sect: chosen.sect,
      bracketId: chosen.bracketId,
      bracketName: brackets[chosen.bracketId]?.name || 'Giải Đấu',
      drawnAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      drawnByAdmin: adminUser?.name || 'Ban Tổ Chức',
      giftTitle,
    };

    soundEngine.playVictoryFanfare();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });

    recordLotusWheelWinner(newWinner);
    setCurrentWinner(newWinner);
    setIsWinnerModalOpen(true);
  };

  const handleReset = () => {
    if (confirm('Bạn có chắc muốn ĐẶT LẠI toàn bộ danh sách trúng thưởng Vòng Quay Tôn Hoa Sen? Tất cả thí sinh sẽ được khôi phục về danh sách quay.')) {
      resetLotusWheelWinners();
      soundEngine.playGong();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6 space-y-6">
      
      {/* 1. Epic Header Banner: Hỗn Độn Thanh Liên • Vòng Quay Tôn Hoa Sen */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-950/95 to-slate-900/90 border border-amber-500/40 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="text-center md:text-left space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Sự Kiện Đặc Biệt • May Mắn Tông Môn</span>
            </div>

            <h2
              className="text-xl sm:text-3xl lg:text-4xl font-black tracking-wide"
              style={{
                fontFamily: '"Playfair Display", "Philosopher", serif',
                background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 35%, #ffffff 70%, #d97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.4))',
              }}
            >
              VÒNG QUAY TÔN HOA SEN
            </h2>
          </div>

          {/* Live Status Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-slate-200 backdrop-blur-md">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Ứng viên: <strong className="text-cyan-300">{eligibleCandidates.length}</strong></span>
            </div>

            <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-slate-200 backdrop-blur-md">
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Đã trúng: <strong className="text-amber-300">{alreadyDrawnWinners.length}</strong></span>
            </div>

            <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-slate-200 backdrop-blur-md">
              <Crown className="w-4 h-4 text-emerald-400" />
              <span>Miễn trừ Top 3: <strong className="text-emerald-300">{top3Winners.length}</strong></span>
            </div>
          </div>

        </div>

        {/* Tournament Completion Alert / Lock Gate */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {allBracketsCompleted ? (
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Phong ấn đã mở! Cả 3 Bảng Đấu (A, B, C) đã hoàn tất. Vòng quay sẵn sàng khai mở!</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-amber-300 font-medium">
              <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                Vòng quay sẽ chính thức kích hoạt sau khi cả 3 Bảng Đấu hoàn tất trận Chung Kết & Tranh Hạng Ba.
              </span>
            </div>
          )}

          {/* Admin Override Toggle */}
          {isAdmin && !allBracketsCompleted && (
            <button
              onClick={() => setAdminOverrideLock(!adminOverrideLock)}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[11px] font-bold transition-all active:scale-95"
            >
              {adminOverrideLock ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{adminOverrideLock ? 'Đang Mở Khóa Thử Nghiệm' : 'Admin: Mở Khóa Quay Thử'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Lotus Wheel Section (2 Columns: Left = Canvas Wheel, Right = Candidate / Winner Dashboard) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Grand Canvas Wheel & Action Buttons (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-black/45 border border-white/15 backdrop-blur-xl shadow-2xl relative">
          
          {/* Wheel Canvas Container */}
          <div className="relative flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={520}
              height={520}
              className="w-[310px] h-[310px] sm:w-[440px] sm:h-[440px] max-w-full drop-shadow-[0_0_35px_rgba(245,158,11,0.25)] transition-all"
            />
          </div>

          {/* Controls Bar */}
          <div className="w-full mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAdmin ? (
              <>
                <button
                  onClick={spinWheel}
                  disabled={isSpinning || !canSpin || eligibleCandidates.length === 0}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base tracking-wider uppercase flex items-center justify-center space-x-2 transition-all shadow-xl ${
                    isSpinning || !canSpin || eligibleCandidates.length === 0
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-zinc-950 hover:from-amber-400 hover:to-yellow-300 shadow-amber-500/30 active:scale-95 border border-amber-300 ring-2 ring-amber-400/50 animate-pulse'
                  }`}
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>{isSpinning ? 'ĐANG QUAY THƯỞNG...' : 'BẮT ĐẦU QUAY THƯỞNG'}</span>
                </button>

                <button
                  onClick={fastDraw}
                  disabled={isSpinning || !canSpin || eligibleCandidates.length === 0}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/20 text-xs font-bold transition-all active:scale-95 flex items-center justify-center space-x-1.5"
                >
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Bốc Thăm Nhanh</span>
                </button>

                {lotusWheelWinners.length > 0 && (
                  <button
                    onClick={handleReset}
                    disabled={isSpinning}
                    className="w-full sm:w-auto px-3.5 py-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all active:scale-95 flex items-center justify-center space-x-1.5"
                    title="Đặt lại toàn bộ lượt quay"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                )}
              </>
            ) : null}
          </div>

        </div>

        {/* Right Column: Dynamic Candidate / Winner Tabs (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-black/45 border border-white/15 backdrop-blur-xl shadow-2xl min-h-[500px]">
          
          {/* Sub Navigation Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-white/10 mb-4">
            <button
              onClick={() => setActiveSubTab('candidates')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeSubTab === 'candidates'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Trong Vòng ({eligibleCandidates.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('winners')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeSubTab === 'winners'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Đã Trúng ({alreadyDrawnWinners.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('top3')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeSubTab === 'top3'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Top 3 ({top3Winners.length})</span>
            </button>
          </div>

          {/* Sub-tab 1: Eligible Candidates (Active in Wheel) */}
          {activeSubTab === 'candidates' && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
                <span>Danh sách ứng viên còn lại:</span>
                <span className="font-mono text-cyan-300 font-bold">{eligibleCandidates.length} Hồn Sư</span>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[440px] space-y-1.5 pr-1 custom-scrollbar">
                {eligibleCandidates.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    Không còn ứng viên nào trong danh sách.
                  </div>
                ) : (
                  eligibleCandidates.map((p, idx) => {
                    const br = brackets[p.bracketId];
                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 transition-all text-xs"
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <span className="font-mono text-[10px] text-slate-500 w-5 text-right">#{idx + 1}</span>
                          <div className="w-6 h-6 rounded-full bg-slate-700 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white uppercase flex-shrink-0">
                            {p.name.charAt(0)}
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-slate-100 truncate">{p.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{p.sect}</p>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10 flex-shrink-0">
                          {br?.name || p.bracketId}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Sub-tab 2: Already Drawn Winners (Gạch Tên Khỏi Vòng Quay) */}
          {activeSubTab === 'winners' && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
                <span>Hồn Sư đã trúng thưởng (Đã gạch tên):</span>
                <span className="font-mono text-amber-300 font-bold">{lotusWheelWinners.length} Lượt</span>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[440px] space-y-2 pr-1 custom-scrollbar">
                {lotusWheelWinners.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    Chưa có ai trúng thưởng. Hãy bấm "Bắt Đầu Quay Thưởng"!
                  </div>
                ) : (
                  lotusWheelWinners.map((w, idx) => (
                    <div
                      key={w.id}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 flex items-center justify-between text-xs transition-all"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-black text-xs flex-shrink-0">
                          #{idx + 1}
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-amber-200 line-through truncate opacity-75">
                            {w.playerName}
                          </p>
                          <p className="text-[10px] text-amber-400/80 font-mono">
                            🎁 {w.giftTitle || 'Quà Tôn Hoa Sen'} • {w.drawnAt}
                          </p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex-shrink-0">
                        ✓ ĐÃ TRÚNG
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Sub-tab 3: Top 3 Exempt from Wheel */}
          {activeSubTab === 'top3' && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
                <span>Top 3 mỗi bảng (Đã có giải chính, không vào vòng quay):</span>
                <span className="font-mono text-emerald-300 font-bold">{top3Winners.length} Quán/Á/Quý Quân</span>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[440px] space-y-2 pr-1 custom-scrollbar">
                {top3Winners.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    Chưa xác định Top 3 (Các trận Chung Kết & Hạng Ba đang diễn ra).
                  </div>
                ) : (
                  top3Winners.map((p) => {
                    const br = brackets[p.bracketId];
                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center text-emerald-300 font-bold text-xs flex-shrink-0">
                            👑
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-emerald-200 truncate">{p.name}</p>
                            <p className="text-[10px] text-emerald-400/70 truncate">{p.sect}</p>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex-shrink-0">
                          {br?.name} (Top 3)
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 3. Celebration Modal Popup for Lucky Draw Winner */}
      {isWinnerModalOpen && currentWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.5)] text-center space-y-4 animate-scaleUp">
            
            {/* Ambient Lotus Petal Glow */}
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-lg shadow-amber-500/50 flex items-center justify-center animate-bounce">
              <Gift className="w-10 h-10 text-zinc-950" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                🎉 CHÚC MỪNG HỒN SƯ MAY MẮN 🎉
              </span>
              <h3
                className="text-2xl sm:text-3xl font-black text-white tracking-wide"
                style={{
                  fontFamily: '"Playfair Display", "Philosopher", serif',
                  background: 'linear-gradient(135deg, #fef08a, #f59e0b, #ffffff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {currentWinner.playerName}
              </h3>
              <p className="text-xs text-slate-300">
                Tông Môn: <strong className="text-white">{currentWinner.sect}</strong> • {currentWinner.bracketName}
              </p>
            </div>

            {/* Gift Badge */}
            <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-300 text-sm font-bold shadow-inner">
              🎁 {currentWinner.giftTitle || 'Phần Quà Tôn Hoa Sen'}
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              Đã gạch tên khỏi vòng quay • Giờ trúng: {currentWinner.drawnAt}
            </p>

            <button
              onClick={() => setIsWinnerModalOpen(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-sm uppercase tracking-wider hover:from-amber-400 hover:to-yellow-300 shadow-lg shadow-amber-500/30 active:scale-95 transition-all"
            >
              Tiếp Tục Vòng Quay
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
