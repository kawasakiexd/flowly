import "server-only";

import { Resend } from "resend";

import { getEmailConfig, isProduction } from "@/lib/env";
import { getSiteUrl } from "@/lib/site";
import type { Platform } from "@/lib/waitlist/schema";
import { PLATFORM_LABELS } from "@/lib/waitlist/schema";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function stripLineBreaks(value: string): string {
  return value.replace(/[\r\n]+/g, " ");
}

export function renderOwnerNotification(data: {
  email: string;
  platform?: Platform;
  time: string;
  country: string | null;
  environment: string;
}): { subject: string; html: string; text: string } {
  const platform = data.platform
    ? PLATFORM_LABELS[data.platform]
    : "not provided";
  const country = data.country ?? "unknown";
  const email = escapeHtml(data.email);

  return {
    subject: stripLineBreaks(`New Flowly waitlist sign-up: ${data.email}`),
    text: [
      `Email: ${data.email}`,
      `Platform: ${platform}`,
      `Time: ${data.time}`,
      `Country: ${country}`,
      `Environment: ${data.environment}`,
    ].join("\n"),
    html: `<p>New Flowly waitlist sign-up.</p>
<ul>
<li>Email: ${email}</li>
<li>Platform: ${escapeHtml(platform)}</li>
<li>Time: ${escapeHtml(data.time)}</li>
<li>Country: ${escapeHtml(country)}</li>
<li>Environment: ${escapeHtml(data.environment)}</li>
</ul>`,
  };
}

export function renderConfirmation(data: { email: string; siteUrl: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const siteHost = new URL(data.siteUrl).host;
  const demoUrl = `${data.siteUrl}/dashboard`;
  const email = escapeHtml(data.email);

  return {
    subject: "You're on the Flowly waitlist",
    text: `Thanks for joining the Flowly waitlist. We invite stores in small batches and will email you at ${data.email} when your spot opens. Your founding-member price is locked in. Want a preview? Explore the live demo: ${demoUrl}

You're receiving this because ${data.email} joined the waitlist at ${siteHost}. If that wasn't you, you can ignore this email — we won't contact you again. Flowly is a fictional product built for a portfolio.`,
    html: `<p style="display:none;max-height:0;overflow:hidden">We'll let you know when your spot opens.</p>
<p>Thanks for joining the Flowly waitlist. We invite stores in small batches and will email you at ${email} when your spot opens. Your founding-member price is locked in.</p>
<p>Want a preview? Explore the live demo: <a href="${escapeHtml(demoUrl)}">${escapeHtml(demoUrl)}</a></p>
<p style="color:#6b7280;font-size:12px">You're receiving this because ${email} joined the waitlist at ${escapeHtml(siteHost)}. If that wasn't you, you can ignore this email — we won't contact you again. Flowly is a fictional product built for a portfolio.</p>`,
  };
}

async function sendEmail({
  to,
  subject,
  html,
  text,
  idempotencyKey,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
}): Promise<boolean> {
  const config = getEmailConfig();
  if (!config.apiKey) {
    console.info("[email:dev]", { to, subject, text, idempotencyKey });
    return true;
  }

  const resend = new Resend(config.apiKey);
  const { error } = await resend.emails.send(
    {
      from: config.from,
      to,
      subject,
      html,
      text,
    },
    { idempotencyKey },
  );

  if (error) {
    console.error("[waitlist] resend send failed", error.name);
    return false;
  }
  return true;
}

export async function sendOwnerNotification(data: {
  email: string;
  platform?: Platform;
  time: string;
  country: string | null;
  emailHash: string;
}): Promise<boolean> {
  const config = getEmailConfig();
  const rendered = renderOwnerNotification({
    ...data,
    environment: process.env.VERCEL_ENV ?? "development",
  });

  if (!config.notifyTo) {
    if (config.apiKey && isProduction) {
      console.error("[waitlist] WAITLIST_NOTIFY_EMAIL is not set");
      return false;
    }
    console.info("[email:dev]", { to: "(unset)", ...rendered });
    return true;
  }

  return sendEmail({
    to: config.notifyTo,
    ...rendered,
    idempotencyKey: `waitlist-owner/${data.emailHash}`,
  });
}

export async function sendConfirmation(data: {
  email: string;
  emailHash: string;
}): Promise<void> {
  const config = getEmailConfig();
  if (!config.confirmationEnabled) {
    return;
  }

  const rendered = renderConfirmation({
    email: data.email,
    siteUrl: getSiteUrl(),
  });

  await sendEmail({
    to: data.email,
    ...rendered,
    idempotencyKey: `waitlist-confirm/${data.emailHash}`,
  });
}
