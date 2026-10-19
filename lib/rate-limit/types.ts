export interface RateLimiter {
  limit(key: string): Promise<{
    success: boolean;
    remaining: number;
    reset: number;
  }>;
}

export interface OnceStore {
  setIfAbsent(key: string, ttlSeconds: number): Promise<boolean>;
  delete(key: string): Promise<void>;
}

export interface WaitlistGuards {
  ip: RateLimiter;
  global: RateLimiter;
  email: OnceStore;
  backend: "upstash" | "memory";
}
