import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import type { OnceStore, WaitlistGuards } from "@/lib/rate-limit/types";

function createEmailStore(redis: Redis): OnceStore {
  return {
    async setIfAbsent(key, ttlSeconds) {
      const result = await redis.set(key, "1", { nx: true, ex: ttlSeconds });
      return result === "OK";
    },
    async delete(key) {
      await redis.del(key);
    },
  };
}

export function createUpstashGuards(config: {
  url: string;
  token: string;
}): WaitlistGuards {
  const redis = new Redis({ url: config.url, token: config.token });

  return {
    ip: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      prefix: "flowly:wl:ip",
    }),
    global: new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(40, "1 d"),
      prefix: "flowly:wl:all",
    }),
    email: createEmailStore(redis),
    backend: "upstash",
  };
}
