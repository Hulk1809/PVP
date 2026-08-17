// Real-time Cloud Sync Engine for Soul Land PVP Tournament
// Syncs tournament matches, banned heroes, scores, and participant accounts
// across all devices, browsers, and guest viewers in real-time.

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
  private ws: WebSocket | null = null;
  private pollInterval: any = null;
  private channelName = 'soul_land_pvp_2026';

  constructor() {
    this.initWebSocket();
    this.startPolling();
    this.setupWindowListeners();
  }

  // Subscribe to cloud state updates
  public onUpdate(callback: SyncCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Push state update to cloud serverless backend & WebSocket
  public async pushState(payload: Omit<CloudSyncPayload, 'updatedAt'>) {
    if (this.isPushing) return;
    this.isPushing = true;

    const data: CloudSyncPayload = {
      ...payload,
      updatedAt: Date.now(),
    };

    this.lastKnownTimestamp = data.updatedAt;

    try {
      // 1. Broadcast via WebSocket for instant sub-second sync across live peers
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(
          JSON.stringify({
            event: 'TOURNAMENT_SYNC',
            data,
          })
        );
      }

      // 2. Persist to Vercel Serverless Sync endpoint
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: data }),
      });
    } catch (err) {
      console.warn('[CloudSync] Failed to push to cloud:', err);
    } finally {
      this.isPushing = false;
    }
  }

  // Fetch latest state from cloud
  public async fetchLatestState(): Promise<CloudSyncPayload | null> {
    try {
      const res = await fetch('/api/sync', { cache: 'no-store' });
      if (!res.ok) return null;
      const json = await res.json();
      if (json.success && json.state && json.state.updatedAt > this.lastKnownTimestamp) {
        this.lastKnownTimestamp = json.state.updatedAt;
        this.notifyListeners(json.state);
        return json.state;
      }
    } catch (err) {
      // Silent catch on offline/network hiccup
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

  // WebSocket Real-time Connection
  private initWebSocket() {
    if (typeof window === 'undefined') return;

    try {
      // Free public PieSocket channel for instant cross-device broadcast
      const apiKey = 'VCpxALAvXuFXAmuzLjeKyAbqPftqzLPapaGAKtSm';
      const wsUrl = `wss://free.blr2.piesocket.com/v3/${this.channelName}?api_key=${apiKey}&notify_self=0`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.event === 'TOURNAMENT_SYNC' && parsed.data) {
            const data: CloudSyncPayload = parsed.data;
            if (data.updatedAt > this.lastKnownTimestamp) {
              this.lastKnownTimestamp = data.updatedAt;
              this.notifyListeners(data);
            }
          }
        } catch (e) {}
      };

      this.ws.onclose = () => {
        // Auto-reconnect after 5 seconds
        setTimeout(() => this.initWebSocket(), 5000);
      };

      this.ws.onerror = () => {
        // Fallback gracefully to HTTP polling
      };
    } catch (e) {}
  }

  // Regular HTTP polling (every 3.5s) to guarantee all guests/viewers stay 100% updated
  private startPolling() {
    if (typeof window === 'undefined') return;
    if (this.pollInterval) clearInterval(this.pollInterval);

    this.pollInterval = setInterval(() => {
      this.fetchLatestState();
    }, 3500);
  }

  // Instant refresh when user switches back to tab or focuses screen
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
