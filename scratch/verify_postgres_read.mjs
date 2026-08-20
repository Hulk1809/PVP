import 'dotenv/config';
import { initializeDatabase, getState } from '../database/postgres.js';

const run = async () => {
  await initializeDatabase();
  const state = await getState();
  console.log('db_state_loaded', !!state);
  console.log('participants', Object.keys(state?.participants || {}).length);
  console.log('matches', Object.keys(state?.matches || {}).length);
  console.log('has_ban_data', !!(state?.matches && Object.values(state.matches).some((match) => match.player1Ban || match.player2Ban)));
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
