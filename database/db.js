import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const STATE_FILE = path.join(DATA_DIR, 'tournament_state.json');
const DB_FILE = path.join(ROOT_DIR, 'database', 'tournament.db');

function ensureStorageDirs() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

ensureStorageDirs();

const db = new DatabaseSync(DB_FILE);
db.exec(`
  CREATE TABLE IF NOT EXISTS tournament_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    payload TEXT NOT NULL,
    updated_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tournament_backups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payload TEXT NOT NULL,
    file_name TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

function pruneOldBackups() {
  try {
    const files = fs.readdirSync(BACKUP_DIR).filter((f) => f.startsWith('state_') && f.endsWith('.json'));
    if (files.length > 30) {
      files.sort();
      for (let i = 0; i < files.length - 30; i += 1) {
        try {
          fs.unlinkSync(path.join(BACKUP_DIR, files[i]));
        } catch {
          // ignore cleanup errors
        }
      }
    }
  } catch {
    // ignore cleanup errors
  }
}

export function saveStateWithBackup(state) {
  ensureStorageDirs();
  const timestamp = Date.now();
  const payload = {
    ...(state || {}),
    updatedAt: timestamp,
  };

  fs.writeFileSync(STATE_FILE, JSON.stringify(payload, null, 2), 'utf-8');

  const dateStr = new Date(timestamp).toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(BACKUP_DIR, `state_${dateStr}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(payload, null, 2), 'utf-8');

  db.prepare(
    `INSERT INTO tournament_state (id, payload, updated_at, created_at)
     VALUES (1, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       payload = excluded.payload,
       updated_at = excluded.updated_at,
       created_at = excluded.created_at`
  ).run(JSON.stringify(payload), timestamp, timestamp);

  db.prepare(
    `INSERT INTO tournament_backups (payload, file_name, created_at)
     VALUES (?, ?, ?)`
  ).run(JSON.stringify(payload), path.basename(backupFile), timestamp);

  pruneOldBackups();
  return timestamp;
}

export function getState() {
  ensureStorageDirs();
  const row = db.prepare('SELECT payload FROM tournament_state WHERE id = 1').get();
  if (row && row.payload) {
    try {
      return JSON.parse(row.payload);
    } catch {
      return null;
    }
  }

  if (fs.existsSync(STATE_FILE)) {
    try {
      const raw = fs.readFileSync(STATE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed) {
        saveStateWithBackup(parsed);
        return parsed;
      }
    } catch {
      // ignore invalid state
    }
  }

  return null;
}

export function restoreFromBackupFile(filePath) {
  ensureStorageDirs();
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  const state = data.state || data;
  saveStateWithBackup(state);
  return state;
}

export function getDatabaseInfo() {
  return {
    dbFile: DB_FILE,
    stateFile: STATE_FILE,
    backupDir: BACKUP_DIR,
  };
}
