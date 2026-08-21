import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import {
  saveStateWithBackup as saveStateToDatabase,
  getState as readStateFromDatabase,
  initializeDatabase,
} from './database/postgres.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ensure data directory and backup directory exist on EC2 disk
const DATA_DIR = path.join(__dirname, 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const STATE_FILE = path.join(DATA_DIR, 'tournament_state.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function saveStateWithBackup(state) {
  try {
    return await saveStateToDatabase(state);
  } catch (e) {
    console.error('[Server] Error saving state and backup:', e);
    throw e;
  }
}

async function readStateFromDisk() {
  try {
    const dbState = await readStateFromDatabase();
    if (dbState) return dbState;
  } catch (e) {
    console.warn('[Server] DB state unavailable, trying file fallback:', e.message || e);
  }

  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = fs.readFileSync(STATE_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading state file:', e);
  }

  return null;
}

// Nodemailer Gmail Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'voquocthang1809@gmail.com',
    pass: 'tilv lzjg qghn ndkf',
  },
});

// 1. API: Send Account Email to Contestant
app.post('/api/send-account', async (req, res) => {
  const { email, playerName, username, password, bracketName } = req.body || {};

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Thiếu thông tin email hoặc tài khoản' });
  }

  const mailOptions = {
    from: '"Tông Môn Tranh Bá - Đấu La Đại Lục" <voquocthang1809@gmail.com>',
    to: email,
    subject: `⚔️ [TÔNG MÔN TRANH BÁ] Tài Khoản Tuyển Thủ: ${playerName || username}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #090d16; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; overflow: hidden; color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 24px; text-align: center; border-bottom: 2px solid #38bdf8;">
          <h1 style="margin: 0; font-size: 22px; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">⚔️ TÔNG MÔN TRANH BÁ ⚔️</h1>
          <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 12px; letter-spacing: 1px;">ĐẤU LA ĐẠI LỤC PVP PLATFORM 2026</p>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 15px; color: #cbd5e1; margin-top: 0;">Xin chào Hồn Sư <strong>${playerName || username}</strong>,</p>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
            Ban Tổ Chức giải đấu <strong>Tông Môn Tranh Bá</strong> xin gửi đến bạn thông tin tài khoản đăng nhập để tham gia thi đấu và thực hiện quyền <strong>CẤM TƯỚNG (BAN HERO)</strong> cho các trận đấu của bạn:
          </p>
          <div style="background: #131b2e; border: 1px solid #38bdf8; border-radius: 12px; padding: 18px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 13px; width: 140px;">Tên Tuyển Thủ:</td>
                <td style="padding: 6px 0; color: #38bdf8; font-size: 14px; font-weight: bold;">${playerName || username}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 13px;">Bảng Đấu:</td>
                <td style="padding: 6px 0; color: #f8fafc; font-size: 13px;">${bracketName || 'Giải Đấu Chính'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 13px;">Tên Đăng Nhập:</td>
                <td style="padding: 6px 0; color: #ffffff; font-size: 15px; font-family: monospace; font-weight: bold; background: rgba(255,255,255,0.08); padding: 4px 8px; border-radius: 6px; display: inline-block;">${username}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; font-size: 13px;">Mật Khẩu:</td>
                <td style="padding: 6px 0; color: #facc15; font-size: 15px; font-family: monospace; font-weight: bold; background: rgba(255,255,255,0.08); padding: 4px 8px; border-radius: 6px; display: inline-block;">${password}</td>
              </tr>
            </table>
          </div>
          <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; color: #fca5a5; font-size: 12px; font-weight: bold;">⚠️ QUY ĐỊNH CẤM TƯỚNG QUAN TRỌNG:</p>
            <ul style="margin: 6px 0 0 0; padding-left: 20px; color: #fca5a5; font-size: 12px; line-height: 1.5;">
              <li>Bạn chỉ có quyền Cấm Tướng tại trận đấu của chính mình ở bảng đấu bạn tham gia.</li>
              <li>Nếu giành chiến thắng và đi tiếp, bạn sẽ tiếp tục được quyền Cấm Tướng ở vòng sau.</li>
              <li><strong>Mỗi trận đấu bạn chỉ được thực hiện Cấm Tướng 1 LẦN DUY NHẤT và KHÔNG ĐƯỢC CHỈNH SỬA sau khi đã gửi.</strong></li>
            </ul>
          </div>
        </div>
        <div style="background: #050811; padding: 14px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 11px; color: #64748b;">
          Email tự động được gửi từ Hệ Thống Giải Đấu Đấu La Đại Lục. Vui lòng bảo mật mật khẩu của bạn.
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);

    // 1. Save to data/tournament_accounts.json
    try {
      const ACCOUNTS_FILE = path.join(DATA_DIR, 'tournament_accounts.json');
      let accs = {};
      if (fs.existsSync(ACCOUNTS_FILE)) {
        accs = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf-8'));
      }
      const newAcc = {
        playerName: playerName || username,
        username,
        password,
        email,
        bracketName: bracketName || 'Giải Đấu Chính',
        claimedAt: new Date().toISOString(),
      };
      accs[username] = newAcc;
      fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accs, null, 2), 'utf-8');

      const state = (await readStateFromDisk()) || {};
      if (!state.playerAccounts) state.playerAccounts = {};
      state.playerAccounts[username] = newAcc;

      if (state.participants) {
        const norm = (s) => (s || '').toLowerCase().replace('god乄', '').replace('god.', '').replace('god-', '').replace('god', '').replace(/\s+/g, '').trim();
        const targetNorm = norm(playerName || username);
        for (const pId in state.participants) {
          const p = state.participants[pId];
          if (norm(p.name) === targetNorm || norm(p.username) === targetNorm || p.username === username) {
            p.claimed = true;
            p.username = username;
            p.email = email;
            break;
          }
        }
      }
      await saveStateWithBackup(state);
    } catch (saveErr) {
      console.error('Error saving account to disk:', saveErr);
    }

    return res.status(200).json({ success: true, message: 'Đã gửi tài khoản về email thành công' });
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return res.status(500).json({ error: error.message || 'Không thể gửi email' });
  }
});

// 2. ATOMIC API: Submit Player Hero Ban (Guaranteed Immediate Server-Side Persistence)
app.post('/api/ban', async (req, res) => {
  const { matchId, playerId, banHero } = req.body || {};
  if (!matchId || !playerId || !banHero) {
    return res.status(400).json({ error: 'Thiếu matchId, playerId hoặc banHero' });
  }

  try {
    const state = await readStateFromDisk();
    if (!state) {
      return res.status(500).json({ error: 'Server state not initialized' });
    }
    if (!state.matches || !state.matches[matchId]) {
      return res.status(404).json({ error: 'Không tìm thấy trận đấu' });
    }

    const match = state.matches[matchId];
    const cleanBan = String(banHero).trim();
    const now = new Date().toISOString();

    if (match.player1Id === playerId) {
      if (match.player1Ban) {
        return res.status(400).json({ error: 'Bạn đã cấm tướng cho trận này rồi!' });
      }
      match.player1Ban = cleanBan;
      match.player1BanTime = now;
    } else if (match.player2Id === playerId) {
      if (match.player2Ban) {
        return res.status(400).json({ error: 'Bạn đã cấm tướng cho trận này rồi!' });
      }
      match.player2Ban = cleanBan;
      match.player2BanTime = now;
    } else {
      return res.status(403).json({ error: 'Bạn không thuộc danh sách thi đấu của trận này!' });
    }

    const lastUpdated = await saveStateWithBackup(state);
    console.log(`[BAN SUCCESS] Match ${matchId}: Player ${playerId} banned "${cleanBan}" at ${now}`);
    return res.status(200).json({ success: true, match, lastUpdated });
  } catch (e) {
    console.error('[BAN ERROR]', e);
    return res.status(500).json({ error: 'Lỗi ghi nhận cấm tướng trên server' });
  }
});

// 2b. ATOMIC API: Reset / Clear a Ban (Guaranteed Immediate Server-Side Persistence)
app.post('/api/ban/reset', async (req, res) => {
  const { matchId, playerSlot } = req.body || {};
  if (!matchId) {
    return res.status(400).json({ error: 'Thiếu matchId' });
  }

  try {
    const state = await readStateFromDisk();
    if (!state || !state.matches || !state.matches[matchId]) {
      return res.status(404).json({ error: 'Không tìm thấy trận đấu' });
    }

    const match = state.matches[matchId];
    if (playerSlot === 1 || playerSlot === 'p1' || playerSlot === 'all') {
      delete match.player1Ban;
      delete match.player1BanTime;
    }
    if (playerSlot === 2 || playerSlot === 'p2' || playerSlot === 'all' || !playerSlot) {
      delete match.player2Ban;
      delete match.player2BanTime;
    }

    const lastUpdated = await saveStateWithBackup(state);
    console.log(`[BAN RESET] Reset ban for match ${matchId}`);
    return res.status(200).json({ success: true, match, lastUpdated });
  } catch (e) {
    console.error('[BAN RESET ERROR]', e);
    return res.status(500).json({ error: 'Lỗi xóa cấm tướng trên server' });
  }
});

// 3. API: Real-time Cloud State Sync with Intelligent Server-Side Merge Protection
app.get('/api/sync', async (req, res) => {
  try {
    const state = await readStateFromDisk();
    if (state) {
      return res.status(200).json({ success: true, state, lastUpdated: state.updatedAt || Date.now() });
    }
  } catch (e) {
    console.error('Error reading state file:', e);
  }
  return res.status(200).json({ success: true, state: null, lastUpdated: 0 });
});

app.post('/api/sync', async (req, res) => {
  const { state: incomingState } = req.body || {};
  if (!incomingState) {
    return res.status(400).json({ error: 'Missing state payload' });
  }

  try {
    let finalState = incomingState;

    const existingState = await readStateFromDisk();
    if (existingState) {
      // SERVER-SIDE MERGE PROTECTION:
      // 1. Never allow a client to wipe out existing bans or claimed accounts!
      // 2. Never allow an out-of-sync client to revert a completed match to scheduled!
      // 3. Preserve advanced players in subsequent rounds!
      const mergedMatches = { ...(existingState.matches || {}), ...(incomingState.matches || {}) };
      if (existingState.matches) {
        for (const [mId, exM] of Object.entries(existingState.matches)) {
          const inM = mergedMatches[mId];
          if (inM) {
            // Preserve existing player1Ban if client omitted it
            if (exM.player1Ban && !inM.player1Ban) {
              inM.player1Ban = exM.player1Ban;
              inM.player1BanTime = exM.player1BanTime;
            }
            // Preserve existing player2Ban if client omitted it
            if (exM.player2Ban && !inM.player2Ban) {
              inM.player2Ban = exM.player2Ban;
              inM.player2BanTime = exM.player2BanTime;
            }
            // Preserve completed match results if incoming client still thinks it is scheduled
            if (exM.status === 'completed' && exM.winnerId && inM.status === 'scheduled' && !inM.winnerId) {
              inM.status = exM.status;
              inM.winnerId = exM.winnerId;
              inM.player1Score = exM.player1Score;
              inM.player2Score = exM.player2Score;
            }
            // Preserve advanced player slots in later rounds if client sent null
            if (exM.player1Id && !inM.player1Id) {
              inM.player1Id = exM.player1Id;
            }
            if (exM.player2Id && !inM.player2Id) {
              inM.player2Id = exM.player2Id;
            }
          }
        }
      }

      const mergedAccounts = {
        ...(existingState.playerAccounts || {}),
        ...(incomingState.playerAccounts || {}),
      };

      const mergedParticipants = {
        ...(existingState.participants || {}),
        ...(incomingState.participants || {}),
      };
      if (existingState.participants) {
        for (const [pId, exP] of Object.entries(existingState.participants)) {
          const inP = mergedParticipants[pId];
          if (inP && exP.claimed && !inP.claimed) {
            inP.claimed = true;
            inP.email = exP.email;
            inP.username = exP.username;
          }
        }
      }

      finalState = {
        ...incomingState,
        brackets: incomingState.brackets || existingState.brackets,
        participants: mergedParticipants,
        matches: mergedMatches,
        playerAccounts: mergedAccounts,
        lotusWheelWinners: incomingState.lotusWheelWinners || existingState.lotusWheelWinners || [],
      };
    }

    const lastUpdated = await saveStateWithBackup(finalState);
    return res.status(200).json({ success: true, lastUpdated });
  } catch (e) {
    console.error('Error saving state file:', e);
    return res.status(500).json({ error: 'Failed to write state file' });
  }
});

// 3. Serve Frontend Static Build
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// 4. SPA Fallback (Compatible with Express 5)
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

async function startServer() {
  try {
    const initialized = await initializeDatabase();
    console.log(initialized ? '[Server] PostgreSQL tables ready' : '[Server] PostgreSQL unavailable, using file fallback');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`====================================================`);
      console.log(`🏆 SOUL LAND PVP TOURNAMENT SERVER RUNNING ON AWS EC2`);
      console.log(`🚀 Port: ${PORT}`);
      console.log(`🌐 Local Access: http://localhost:${PORT}`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('[Server] Failed to initialize database:', error);
    process.exit(1);
  }
}

startServer();
