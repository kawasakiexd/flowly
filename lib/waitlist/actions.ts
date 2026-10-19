"use server";

import { after } from "next/server";

import { getTurnstileConfig } from "@/lib/env";
import { sha256 } from "@/lib/hash";
import { getWaitlistGuards } from "@/lib/rate-limit";
import { getClientIp, getCountry } from "@/lib/request";
import { sendConfirmation, sendOwnerNotification } from "@/lib/waitlist/emails";
import {
  type JoinWaitlistResult,
  waitlistErrorMessage,
  waitlistRequestSchema,
} from "@/lib/waitlist/schema";
import { verifyTurnstile } from "@/lib/waitlist/turnstile";

function fieldErrorsFromZod(
  issues: { path: PropertyKey[]; message: string }[],
): Partial<Record<"email" | "platform", string>> {
  const fieldErrors: Partial<Record<"email" | "platform", string>> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "");
    if (key === "email" || key === "platform") {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

export async function joinWaitlist(
  input: unknown,
): Promise<JoinWaitlistResult> {
  try {
    const parsed = waitlistRequestSchema.safeParse(input);
    if (!parsed.success) {
      return {
        status: "error",
        code: "validation",
        message: "Enter a valid email address, like you@yourstore.com.",
        fieldErrors: fieldErrorsFromZod(parsed.error.issues),
      };
    }

    const data = parsed.data;
    if (data.company?.trim()) {
      return { status: "success" };
    }

    const turnstile = getTurnstileConfig();
    if (!turnstile) {
      return {
        status: "error",
        code: "unavailable",
        message: waitlistErrorMessage("unavailable"),
      };
    }

    const ip = await getClientIp();
    const guards = getWaitlistGuards();
    const ipLimit = await guards.ip.limit(sha256(ip));
    if (!ipLimit.success) {
      return {
        status: "error",
        code: "rate_limited",
        message: waitlistErrorMessage("rate_limited", "ip"),
      };
    }

    const captcha = await verifyTurnstile({
      token: data.turnstileToken,
      ip,
      expectedAction: "waitlist",
      secretKey: turnstile.secretKey,
      mode: turnstile.mode,
    });
    if (!captcha.ok) {
      console.error("[waitlist] turnstile verify failed", captcha.codes);
      return {
        status: "error",
        code: "captcha",
        message: waitlistErrorMessage("captcha"),
      };
    }

    const globalLimit = await guards.global.limit("all");
    if (!globalLimit.success) {
      return {
        status: "error",
        code: "rate_limited",
        message: waitlistErrorMessage("rate_limited", "global"),
      };
    }

    const emailHash = sha256(data.email.toLowerCase());
    const emailKey = `flowly:wl:email:${emailHash}`;
    const firstSeen = await guards.email.setIfAbsent(emailKey, 86400);
    if (!firstSeen) {
      return { status: "success" };
    }

    const sent = await sendOwnerNotification({
      email: data.email,
      platform: data.platform,
      time: new Date().toISOString(),
      country: await getCountry(),
      emailHash,
    });
    if (!sent) {
      await guards.email.delete(emailKey);
      return {
        status: "error",
        code: "server",
        message: waitlistErrorMessage("server"),
      };
    }

    after(() => {
      void sendConfirmation({ email: data.email, emailHash });
    });

    return { status: "success" };
  } catch (error) {
    console.error("[waitlist] unexpected", error);
    return {
      status: "error",
      code: "server",
      message: waitlistErrorMessage("server"),
    };
  }
}
