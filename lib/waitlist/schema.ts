import * as z from "zod";

import { finalCtaCopy } from "@/content/final-cta";

export const PLATFORMS = [
  "shopify",
  "woocommerce",
  "bigcommerce",
  "custom",
  "other",
] as const;

export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  shopify: "Shopify",
  woocommerce: "WooCommerce",
  bigcommerce: "BigCommerce",
  custom: "Custom or headless",
  other: "Other",
};

export const waitlistFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .max(254, "That email address is too long.")
    .pipe(z.email("Enter a valid email address, like you@yourstore.com.")),
  platform: z
    .enum(PLATFORMS, { error: "Choose a platform from the list." })
    .optional(),
  company: z.string().max(200).optional(),
});

export const waitlistRequestSchema = waitlistFormSchema.extend({
  turnstileToken: z.string().min(1).max(2048),
});

export type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;
export type WaitlistRequest = z.infer<typeof waitlistRequestSchema>;

export type JoinWaitlistResult =
  | { status: "success" }
  | {
      status: "error";
      code:
        "validation" | "captcha" | "rate_limited" | "unavailable" | "server";
      message: string;
      fieldErrors?: Partial<Record<"email" | "platform", string>>;
    };

export function waitlistErrorMessage(
  code: Exclude<JoinWaitlistResult, { status: "success" }>["code"],
  kind?: "ip" | "global",
): string {
  if (code === "captcha") {
    return finalCtaCopy.errors.captcha;
  }
  if (code === "rate_limited") {
    return kind === "global"
      ? finalCtaCopy.errors.rateLimitedGlobal
      : finalCtaCopy.errors.rateLimitedIp;
  }
  if (code === "unavailable") {
    return finalCtaCopy.errors.unavailable;
  }
  return finalCtaCopy.errors.server;
}
