import fs from 'node:fs';
import path from 'node:path';
import { restoreFromBackupFile } from './db.js';

const backupDir = path.resolve('d:/PVP/backup');
const files = fs.existsSync(backupDir)
  ? fs.readdirSync(backupDir).filter((f) => f.endsWith('.json')).sort().reverse()
  : [];

if (files.length === 0) {
  console.log('No backup files found in d:/PVP/backup');
  process.exit(0);
}

const file = path.join(backupDir, files[0]);
console.log(`Restoring latest backup from: ${file}`);
const restored = restoreFromBackupFile(file);
console.log(`Restored state with updatedAt: ${restored.updatedAt}`);
console.log(`Participants: ${Object.keys(restored.participants || {}).length}`);
console.log(`Matches: ${Object.keys(restored.matches || {}).length}`);
