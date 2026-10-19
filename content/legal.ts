export const legalCopy = {
  updated: "Last updated: October 15, 2026",
  notice:
    "This is placeholder text for a fictional product. It is not legal advice and does not describe a real service.",
  privacy: {
    title: "Privacy policy",
    sections: [
      {
        heading: "What we collect",
        body: "When you join the waitlist we receive your email address and, if you choose, your store platform. To prevent abuse we process your IP address and a one-way hash of your email for up to 24 hours.",
      },
      {
        heading: "How we use it",
        body: "Only to send you a single invitation email and, if enabled, a confirmation. We never sell or share your data.",
      },
      {
        heading: "Service providers",
        body: "Vercel (hosting), Cloudflare Turnstile (bot protection), Resend (email delivery) and Upstash (rate limiting) process data on our behalf.",
      },
      {
        heading: "Retention",
        body: "Rate-limit records expire automatically within 24 hours. Waitlist emails are kept until the product launches or you ask us to delete them.",
      },
      {
        heading: "Your rights",
        body: "You can ask us to access or delete your data at any time by writing to hello@flowly.example.",
      },
      {
        heading: "Contact",
        body: "hello@flowly.example",
      },
    ],
  },
  terms: {
    title: "Terms of service",
    sections: [
      {
        heading: "Acceptance of terms",
        body: "By using this site you agree to these terms. If you do not agree, please do not use the demo.",
      },
      {
        heading: "The service",
        body: "Flowly is a demonstration product built as a portfolio project. The dashboard shows generated data, not real store activity, and no paid service is provided.",
      },
      {
        heading: "Acceptable use",
        body: "You may not submit automated waitlist sign-ups or attempt to disrupt the service, including probing, scraping, or overloading the form.",
      },
      {
        heading: "No warranty",
        body: "The site is provided as-is, without warranties of any kind, including fitness for a particular purpose or uninterrupted availability.",
      },
      {
        heading: "Limitation of liability",
        body: "To the fullest extent permitted by law, the author is not liable for any loss or damage arising from your use of this demonstration.",
      },
      {
        heading: "Changes to these terms",
        body: "These terms may be updated from time to time. The date at the top of this page shows when they were last revised.",
      },
      {
        heading: "Contact",
        body: "Questions about these terms can be sent to hello@flowly.example.",
      },
    ],
  },
  notFound: {
    title: "Page not found",
    text: "The page you're looking for doesn't exist or has moved.",
    home: "Back to home",
    demo: "Open the live demo",
  },
} as const;
