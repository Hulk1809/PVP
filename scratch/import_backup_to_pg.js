import fs from 'node:fs';
import { Client } from 'pg';

const backupPath = 'd:/PVP/backup/ec2_tournament_state_2026-08-19.json';
const connectionString = 'postgresql://postgres:postgres@localhost:5432/soul_land_pvp';

async function main() {
  const raw = fs.readFileSync(backupPath, 'utf8').replace(/^\uFEFF/, '');
  const state = JSON.parse(raw);
  const client = new Client({ connectionString });

  try {
    await client.connect();

    await client.query(`
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

    const now = Date.now();
    await client.query(
      `INSERT INTO tournament_state (id, payload, updated_at, created_at)
       VALUES (1, $1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET
         payload = EXCLUDED.payload,
         updated_at = EXCLUDED.updated_at,
         created_at = EXCLUDED.created_at`,
      [state, now, now]
    );

    await client.query(
      `INSERT INTO tournament_backups (payload, file_name, created_at)
       VALUES ($1, $2, $3)`,
      [state, 'ec2_tournament_state_2026-08-19.json', now]
    );

    const row = (await client.query('SELECT payload FROM tournament_state WHERE id = 1')).rows[0];
    const payload = row && row.payload ? row.payload : {};

    console.log('participant_count', Object.keys(payload.participants || {}).length);
    console.log('match_count', Object.keys(payload.matches || {}).length);
    console.log('updatedAt', payload.updatedAt || null);
    console.log('backup_count', (await client.query('SELECT COUNT(*)::int AS n FROM tournament_backups')).rows[0].n);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
