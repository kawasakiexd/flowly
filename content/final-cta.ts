export const finalCtaCopy = {
  eyebrow: "Early access",
  title: "Be first in line when Flowly opens",
  lead: "Join 1,240 store owners on the waitlist. We'll send one email when your spot is ready — no spam, ever.",
  bullets: [
    "Founding-member pricing, locked in for life",
    "Priority onboarding with our team",
    "Cancel or unsubscribe with one click",
  ],
  form: {
    emailLabel: "Work email",
    emailPlaceholder: "you@yourstore.com",
    platformLabel: "Store platform (optional)",
    platformPlaceholder: "Select your platform",
    honeypotLabel: "Company (leave empty)",
    submit: "Join the waitlist",
    submitting: "Joining…",
    verifying: "Verifying you're human…",
    consentBefore: "By joining, you agree to our ",
    consentLink: "Privacy Policy",
    consentAfter: ". Unsubscribe with one click.",
    widgetFailed:
      "The verification widget didn't load. Disable content blockers for this page, then ",
    tryAgain: "Try again",
  },
  success: {
    heading: "You're on the list!",
    textBefore: "We'll email ",
    textAfter:
      " as soon as your spot opens. In the meantime, take the live demo for a spin.",
    demoCta: "Explore the live demo",
    reset: "Use a different email",
  },
  errors: {
    captcha: "We couldn't verify that you're human. Please try again.",
    rateLimitedIp:
      "Too many attempts. Please wait a few minutes and try again.",
    rateLimitedGlobal:
      "We're getting a lot of sign-ups right now. Please try again tomorrow.",
    unavailable:
      "The waitlist is temporarily unavailable. Please try again later.",
    server: "Something went wrong on our side. Please try again.",
    network:
      "We couldn't reach the server. Check your connection and try again.",
  },
} as const;
