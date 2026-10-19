import "server-only";

import { createHash } from "node:crypto";

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function hashPrefix(value: string, length = 8): string {
  return sha256(value).slice(0, length);
}
