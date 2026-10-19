import "server-only";

import { getRedisConfig, isProduction } from "@/lib/env";
import { createMemoryGuards } from "@/lib/rate-limit/memory";
import type { WaitlistGuards } from "@/lib/rate-limit/types";
import { createUpstashGuards } from "@/lib/rate-limit/upstash";

let cached: WaitlistGuards | undefined;
let warned = false;

export function getWaitlistGuards(): WaitlistGuards {
  if (cached) {
    return cached;
  }

  const redis = getRedisConfig();
  if (redis) {
    cached = createUpstashGuards(redis);
    return cached;
  }

  if (isProduction && !warned) {
    warned = true;
    console.warn(
      "[waitlist] Redis is not configured; using in-memory rate limits. This does not protect multi-instance deployments.",
    );
  }

  cached = createMemoryGuards();
  return cached;
}
