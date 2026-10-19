import "server-only";

interface VerifyInput {
  token: string;
  ip: string;
  expectedAction: string;
  secretKey: string;
  mode: "live" | "test";
}

export async function verifyTurnstile({
  token,
  ip,
  expectedAction,
  secretKey,
  mode,
}: VerifyInput): Promise<{ ok: true } | { ok: false; codes: string[] }> {
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
          remoteip: ip,
          idempotency_key: crypto.randomUUID(),
        }),
        signal: AbortSignal.timeout(5000),
      },
    );

    const payload = (await response.json()) as {
      success?: boolean;
      action?: string;
      "error-codes"?: string[];
    };

    const actionOk = mode === "test" || payload.action === expectedAction;
    if (payload.success === true && actionOk) {
      return { ok: true };
    }

    return { ok: false, codes: payload["error-codes"] ?? ["failed"] };
  } catch {
    return { ok: false, codes: ["internal-error"] };
  }
}
