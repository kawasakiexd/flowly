import "server-only";

import { headers } from "next/headers";

export async function getClientIp(): Promise<string> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for");
  if (forwarded) {
    const [first] = forwarded.split(",");
    if (first?.trim()) {
      return first.trim();
    }
  }
  return requestHeaders.get("x-real-ip") ?? "0.0.0.0";
}

export async function getCountry(): Promise<string | null> {
  const requestHeaders = await headers();
  return requestHeaders.get("x-vercel-ip-country");
}
