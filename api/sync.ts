// Vercel Serverless Function: Cloud Realtime Tournament State Sync
// Global in-memory cache with fallback persistence across serverless invocations

let globalTournamentState: any = null;
let lastStateUpdateTime = 0;

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET: Fetch latest cloud tournament state
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      state: globalTournamentState,
      lastUpdated: lastStateUpdateTime,
    });
  }

  // POST: Push latest tournament state to cloud
  if (req.method === 'POST') {
    const { state } = req.body || {};
    if (state) {
      globalTournamentState = state;
      lastStateUpdateTime = Date.now();
      return res.status(200).json({
        success: true,
        lastUpdated: lastStateUpdateTime,
      });
    }
    return res.status(400).json({ error: 'Missing tournament state payload' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
