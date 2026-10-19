import type {
  OnceStore,
  RateLimiter,
  WaitlistGuards,
} from "@/lib/rate-limit/types";

function createSlidingLimiter(max: number, windowMs: number): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    async limit(key) {
      const now = Date.now();
      const cutoff = now - windowMs;
      const recent = (hits.get(key) ?? []).filter((time) => time > cutoff);
      if (recent.length >= max) {
        hits.set(key, recent);
        return {
          success: false,
          remaining: 0,
          reset: recent[0]! + windowMs,
        };
      }
      recent.push(now);
      hits.set(key, recent);
      return {
        success: true,
        remaining: max - recent.length,
        reset: now + windowMs,
      };
    },
  };
}

function createFixedLimiter(max: number, windowMs: number): RateLimiter {
  const buckets = new Map<string, { count: number; start: number }>();

  return {
    async limit(key) {
      const now = Date.now();
      const current = buckets.get(key);
      if (!current || now - current.start >= windowMs) {
        buckets.set(key, { count: 1, start: now });
        return {
          success: true,
          remaining: max - 1,
          reset: now + windowMs,
        };
      }
      if (current.count >= max) {
        return {
          success: false,
          remaining: 0,
          reset: current.start + windowMs,
        };
      }
      current.count += 1;
      return {
        success: true,
        remaining: max - current.count,
        reset: current.start + windowMs,
      };
    },
  };
}

function createOnceStore(): OnceStore {
  const values = new Map<string, number>();

  return {
    async setIfAbsent(key, ttlSeconds) {
      const now = Date.now();
      const existing = values.get(key);
      if (existing && existing > now) {
        return false;
      }
      values.set(key, now + ttlSeconds * 1000);
      return true;
    },
    async delete(key) {
      values.delete(key);
    },
  };
}

export function createMemoryGuards(): WaitlistGuards {
  return {
    ip: createSlidingLimiter(5, 10 * 60 * 1000),
    global: createFixedLimiter(40, 24 * 60 * 60 * 1000),
    email: createOnceStore(),
    backend: "memory",
  };
}
