// Real-time Cloud Sync Engine for Soul Land PVP Tournament
// Backed by persistent cloud database for seamless cross-device synchronization

const CLOUD_OBJECT_ID = 'ff8081819ff5b11001a0100711433810';
const DIRECT_CLOUD_URL = `https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`;

interface CloudSyncPayload {
  brackets: any;
  participants: any;
  matches: any;
  playerAccounts: any;
  updatedAt: number;
}

type SyncCallback = (data: CloudSyncPayload) => void;

class CloudSyncEngine {
  private listeners: Set<SyncCallback> = new Set();
  private lastKnownTimestamp = 0;
  private isPushing = false;
  private pollInterval: any = null;

  constructor() {
    this.startPolling();
    this.setupWindowListeners();
  }

  // Subscribe to cloud state updates
  public onUpdate(callback: SyncCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Push state update to cloud
  public async pushState(payload: Omit<CloudSyncPayload, 'updatedAt'>) {
    if (this.isPushing) return;
    this.isPushing = true;

    const data: CloudSyncPayload = {
      ...payload,
      updatedAt: Date.now(),
    };

    this.lastKnownTimestamp = data.updatedAt;

    try {
      // 1. Try Vercel Serverless Function
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: data }),
      });

      if (!res.ok) {
        throw new Error('Serverless sync failed, trying direct fallback');
      }
    } catch (err) {
      // 2. Direct Cloud Fallback
      try {
        await fetch(DIRECT_CLOUD_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          },
          body: JSON.stringify({
            name: 'soul_land_pvp_state',
            data,
          }),
        });
      } catch (e) {
        console.warn('[CloudSync] Fallback push error:', e);
      }
    } finally {
      this.isPushing = false;
    }
  }

  // Fetch latest state from cloud
  public async fetchLatestState(): Promise<CloudSyncPayload | null> {
    let cloudData: CloudSyncPayload | null = null;

    try {
      // 1. Try Vercel Serverless Function
      const res = await fetch('/api/sync', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.state) {
          cloudData = json.state;
        }
      }
    } catch (err) {}

    // 2. Direct Cloud Fallback if needed
    if (!cloudData) {
      try {
        const res = await fetch(DIRECT_CLOUD_URL, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            Accept: 'application/json',
          },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            cloudData = json.data;
          }
        }
      } catch (err) {}
    }

    if (cloudData && cloudData.updatedAt && cloudData.updatedAt > this.lastKnownTimestamp) {
      this.lastKnownTimestamp = cloudData.updatedAt;
      this.notifyListeners(cloudData);
      return cloudData;
    }

    return null;
  }

  private notifyListeners(data: CloudSyncPayload) {
    this.listeners.forEach((fn) => {
      try {
        fn(data);
      } catch (e) {
        console.error('[CloudSync] Listener error:', e);
      }
    });
  }

  // Fast polling (every 2.5 seconds) to ensure all devices stay in sync
  private startPolling() {
    if (typeof window === 'undefined') return;
    if (this.pollInterval) clearInterval(this.pollInterval);

    // Initial fetch immediately
    setTimeout(() => this.fetchLatestState(), 100);

    this.pollInterval = setInterval(() => {
      this.fetchLatestState();
    }, 2500);
  }

  // Instant refresh when user switches tab or unlocks screen
  private setupWindowListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('focus', () => {
      this.fetchLatestState();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.fetchLatestState();
      }
    });
  }
}

export const cloudSync = new CloudSyncEngine();
