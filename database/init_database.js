import fs from 'node:fs';
import path from 'node:path';
import { getDatabaseInfo, saveStateWithBackup, getState } from './db.js';

const root = path.resolve('d:/PVP');
const backupDir = path.join(root, 'backup');
const backupFiles = fs.existsSync(backupDir)
  ? fs.readdirSync(backupDir).filter((f) => f.endsWith('.json')).sort().reverse()
  : [];

console.log('Database info:');
console.log(getDatabaseInfo());

if (backupFiles.length > 0) {
  const latestBackup = path.join(backupDir, backupFiles[0]);
  const raw = fs.readFileSync(latestBackup, 'utf8');
  const normalized = raw.replace(/^\uFEFF/, '');
  const data = JSON.parse(normalized);
  const state = data.state || data;
  saveStateWithBackup(state);
  console.log(`Restored newest backup into SQLite: ${latestBackup}`);
  const current = getState();
  console.log(`Current participants: ${Object.keys(current?.participants || {}).length}`);
  console.log(`Current matches: ${Object.keys(current?.matches || {}).length}`);
} else {
  console.log('No backup file found. Database initialized empty.');
}
