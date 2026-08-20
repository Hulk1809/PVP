import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const STATE_FILE = path.join(DATA_DIR, 'tournament_state.json');
const DATABASE_URL = process.env.DATABASE_URL || '';

function ensureStorageDirs() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

function isUsableState(state) {
  return Boolean(
    state &&
    state.brackets &&
    state.participants &&
    state.matches &&
    Object.keys(state.brackets).length >= 3 &&
    Object.keys(state.participants).length >= 20 &&
    Object.keys(state.matches).length >= 15
  );
}

function readFileState() {
  if (!fs.existsSync(STATE_FILE)) return null;

  try {
    const parsed = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    return isUsableState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

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

let pool = null;

export function getPool() {
  if (!DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
}

export async function initializeDatabase() {
  const activePool = getPool();
  if (!activePool) return false;

  try {
    await activePool.query(`
      CREATE TABLE IF NOT EXISTS tournament_state (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        payload JSONB NOT NULL,
        updated_at BIGINT NOT NULL,
        created_at BIGINT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tournament_backups (
        id SERIAL PRIMARY KEY,
        payload JSONB NOT NULL,
        file_name TEXT NOT NULL,
        created_at BIGINT NOT NULL
      );
    `);
    return true;
  } catch (error) {
    console.warn('[Postgres] init failed:', error.message || error);
    return false;
  }
}

export async function saveStateWithBackup(state) {
  if (!isUsableState(state)) {
    throw new Error('Refusing to persist incomplete tournament state');
  }

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

  const activePool = getPool();
  if (activePool) {
    try {
      await activePool.query(
        `INSERT INTO tournament_state (id, payload, updated_at, created_at)
         VALUES (1, $1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET
           payload = EXCLUDED.payload,
           updated_at = EXCLUDED.updated_at,
           created_at = EXCLUDED.created_at`,
        [payload, timestamp, timestamp]
      )

      await activePool.query(
        `INSERT INTO tournament_backups (payload, file_name, created_at)
         VALUES ($1, $2, $3)`,
        [payload, path.basename(backupFile), timestamp]
      )
    } catch (error) {
      console.warn('[Postgres] save failed; file backup remains authoritative:', error.message || error);
    }
  }

  pruneOldBackups();
  return timestamp;
}

export async function getState() {
  ensureStorageDirs();
  const fileState = readFileState();
  const activePool = getPool();
  if (activePool) {
    try {
      const result = await activePool.query('SELECT payload FROM tournament_state WHERE id = 1');
      const dbState = result.rows && result.rows[0] ? result.rows[0].payload : null;

      if (isUsableState(dbState) && isUsableState(fileState)) {
        const dbUpdatedAt = Number(dbState.updatedAt || 0);
        const fileUpdatedAt = Number(fileState.updatedAt || 0);

        if (fileUpdatedAt > dbUpdatedAt) {
          await activePool.query(
            `UPDATE tournament_state SET payload = $1, updated_at = $2 WHERE id = 1`,
            [fileState, fileUpdatedAt]
          );
          return fileState;
        }

        return dbState;
      }

      if (isUsableState(dbState)) {
        return dbState;
      }

      if (isUsableState(fileState)) {
        await activePool.query(
          `INSERT INTO tournament_state (id, payload, updated_at, created_at)
           VALUES (1, $1, $2, $2)
           ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = EXCLUDED.updated_at`,
          [fileState, Number(fileState.updatedAt || Date.now())]
        );
        return fileState;
      }
    } catch (error) {
      console.warn('[Postgres] getState failed:', error.message || error);
    }
  }

  return fileState;
}

export async function restoreFromBackupFile(filePath) {
  ensureStorageDirs();
  const raw = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '');
  const data = JSON.parse(raw);
  const state = data.state || data;
  await saveStateWithBackup(state);
  return state;
}

export function getDatabaseInfo() {
  return {
    databaseUrlConfigured: Boolean(DATABASE_URL),
    stateFile: STATE_FILE,
    backupDir: BACKUP_DIR,
    databaseKind: DATABASE_URL ? 'postgres' : 'local-file-fallback',
  };
}
