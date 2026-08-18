// Real-time Cloud Sync Engine for Soul Land PVP Tournament
// Backed by persistent AWS EC2 database for seamless cross-device synchronization

export interface CloudSyncPayload {
  brackets: any;
  participants: any;
  matches: any;
  playerAccounts: any;
  lotusWheelWinners?: any;
  updatedAt: number;
}

type SyncCallback = (data: CloudSyncPayload) => void;

class CloudSyncEngine {
  private listeners: Set<SyncCallback> = new Set();
  private lastKnownTimestamp = 0;
  private isPushing = false;
  private pendingPayload: Omit<CloudSyncPayload, 'updatedAt'> | null = null;
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

  // Push state update to AWS EC2 backend with guaranteed delivery & queueing
  public async pushState(payload: Omit<CloudSyncPayload, 'updatedAt'>) {
    if (this.isPushing) {
      // Save latest payload to be pushed immediately after current in-flight push completes
      this.pendingPayload = payload;
      return;
    }

    this.isPushing = true;
    const data: CloudSyncPayload = {
      ...payload,
      updatedAt: Date.now(),
    };

    // Optimistically update our known timestamp so local poll won't immediately overwrite
    this.lastKnownTimestamp = Math.max(this.lastKnownTimestamp, data.updatedAt);

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: data }),
      });
      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        if (json.lastUpdated) {
          this.lastKnownTimestamp = Math.max(this.lastKnownTimestamp, json.lastUpdated);
        }
      }
    } catch (err) {
      console.warn('[CloudSync] Push sync error:', err);
    } finally {
      this.isPushing = false;
      // If a new update happened while pushing, process it now
      if (this.pendingPayload) {
        const nextPayload = this.pendingPayload;
        this.pendingPayload = null;
        this.pushState(nextPayload);
      }
    }
  }

  // Fetch latest state from AWS EC2 backend
  public async fetchLatestState(): Promise<CloudSyncPayload | null> {
    // If we have an active or pending push from this client, don't pull old state to avoid race conditions
    if (this.isPushing || this.pendingPayload) {
      return null;
    }

    let cloudData: CloudSyncPayload | null = null;

    try {
      const res = await fetch('/api/sync', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.state) {
          cloudData = json.state;
        }
      }
    } catch (err) {
      console.warn('[CloudSync] Fetch sync error:', err);
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

  // Polling every 2.5 seconds to ensure all devices stay in sync
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
