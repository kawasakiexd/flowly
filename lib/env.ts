import "server-only";

import * as z from "zod";

import { ConfigError } from "@/lib/errors";
import { getSiteUrl } from "@/lib/site";

export { getSiteUrl };

const envSchema = z.object({
  VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
  VERCEL: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM: z.string().optional(),
  WAITLIST_NOTIFY_EMAIL: z.string().optional(),
  WAITLIST_CONFIRMATION_ENABLED: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  KV_REST_API_URL: z.string().optional(),
  KV_REST_API_TOKEN: z.string().optional(),
  DASHBOARD_DATA_SOURCE: z.enum(["mock", "shopcore"]).optional(),
  SHOPCORE_API_URL: z.string().optional(),
  SHOPCORE_API_KEY: z.string().optional(),
  MOCK_LATENCY_MS: z.string().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

let cached: AppEnv | undefined;

function readEnv(): AppEnv {
  if (cached) {
    return cached;
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new ConfigError(
      `Invalid environment variables: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`,
    );
  }

  cached = parsed.data;
  return cached;
}

export const isProduction = process.env.VERCEL_ENV === "production";

const TEST_TURNSTILE_SITE_KEY = "1x00000000000000000000AA";
const TEST_TURNSTILE_SECRET_KEY = "1x0000000000000000000000000000000AA";

export function getTurnstileConfig(): {
  siteKey: string;
  secretKey: string;
  mode: "live" | "test";
} | null {
  const env = readEnv();
  const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const secretKey = env.TURNSTILE_SECRET_KEY;

  if (siteKey && secretKey) {
    const usesTestKeys =
      siteKey === TEST_TURNSTILE_SITE_KEY ||
      secretKey === TEST_TURNSTILE_SECRET_KEY;
    return {
      siteKey,
      secretKey,
      mode: isProduction && !usesTestKeys ? "live" : "test",
    };
  }

  if (isProduction) {
    return null;
  }

  return {
    siteKey: TEST_TURNSTILE_SITE_KEY,
    secretKey: TEST_TURNSTILE_SECRET_KEY,
    mode: "test",
  };
}

export function getEmailConfig(): {
  apiKey: string | null;
  from: string;
  notifyTo: string | null;
  confirmationEnabled: boolean;
} {
  const env = readEnv();
  return {
    apiKey: env.RESEND_API_KEY ?? null,
    from: env.RESEND_FROM ?? "Flowly <onboarding@resend.dev>",
    notifyTo: env.WAITLIST_NOTIFY_EMAIL ?? null,
    confirmationEnabled: env.WAITLIST_CONFIRMATION_ENABLED === "true",
  };
}

export function getRedisConfig(): { url: string; token: string } | null {
  const env = readEnv();
  const url = env.UPSTASH_REDIS_REST_URL ?? env.KV_REST_API_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN ?? env.KV_REST_API_TOKEN;
  if (!url || !token) {
    return null;
  }
  return { url, token };
}

export function getDataSourceConfig():
  | { kind: "mock"; latencyMs: number }
  | { kind: "shopcore"; baseUrl: string; apiKey: string | null } {
  const env = readEnv();
  const kind = env.DASHBOARD_DATA_SOURCE ?? "mock";

  if (kind === "shopcore") {
    const baseUrl = env.SHOPCORE_API_URL;
    if (!baseUrl) {
      throw new ConfigError(
        "DASHBOARD_DATA_SOURCE=shopcore requires SHOPCORE_API_URL.",
      );
    }
    return {
      kind: "shopcore",
      baseUrl,
      apiKey: env.SHOPCORE_API_KEY ?? null,
    };
  }

  const latencyMs =
    env.MOCK_LATENCY_MS === undefined || env.MOCK_LATENCY_MS === ""
      ? 0
      : Number(env.MOCK_LATENCY_MS);

  if (!Number.isInteger(latencyMs) || latencyMs < 0) {
    throw new ConfigError("MOCK_LATENCY_MS must be an integer ≥ 0.");
  }

  return { kind: "mock", latencyMs };
}
