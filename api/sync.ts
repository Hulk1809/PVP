// Vercel Serverless Function: Cloud Realtime Tournament State Sync
// Backed by persistent cloud database for cross-device synchronization

const CLOUD_OBJECT_ID = 'ff8081819ff5b11001a0100711433810';
const CLOUD_URL = `https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`;

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
    try {
      const response = await fetch(CLOUD_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const json = await response.json();
        return res.status(200).json({
          success: true,
          state: json.data || null,
          lastUpdated: json.data?.updatedAt || Date.now(),
        });
      }
    } catch (err: any) {
      console.error('[CloudSync GET Error]', err);
    }

    return res.status(200).json({ success: true, state: null, lastUpdated: 0 });
  }

  // POST: Push latest tournament state to persistent cloud database
  if (req.method === 'POST') {
    const { state } = req.body || {};
    if (!state) {
      return res.status(400).json({ error: 'Missing tournament state payload' });
    }

    try {
      const payload = {
        name: 'soul_land_pvp_state',
        data: {
          ...state,
          updatedAt: Date.now(),
        },
      };

      const response = await fetch(CLOUD_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return res.status(200).json({
          success: true,
          lastUpdated: payload.data.updatedAt,
        });
      } else {
        const errText = await response.text();
        console.error('[CloudSync PUT Response Error]', errText);
      }
    } catch (err: any) {
      console.error('[CloudSync PUT Error]', err);
    }

    return res.status(500).json({ error: 'Failed to persist cloud state' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
