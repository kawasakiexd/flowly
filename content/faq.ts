export const faqCopy = {
  eyebrow: "FAQ",
  title: "Questions, answered",
  leadBefore: "Still curious? The ",
  leadLink: "live demo",
  leadAfter: " answers most questions in a few clicks.",
  items: [
    {
      question: "Which store platforms does Flowly support?",
      answer:
        "Shopify and WooCommerce at launch, plus any custom or headless store through our REST API. BigCommerce and Squarespace are next on the roadmap.",
    },
    {
      question: "How long does setup take?",
      answer:
        "Most stores are set up in under five minutes. Flowly imports up to 24 months of history in the background, so you can start exploring right away.",
    },
    {
      question: "Is my store data safe?",
      answer:
        "Flowly only requests read-only access, encrypts data in transit and at rest, and never sells or shares it. You can disconnect your store and delete your data at any time.",
    },
    {
      question: "Do I need to add a tracking script?",
      answer:
        "No. Flowly reads orders and traffic sources from your store platform and analytics integrations, so there is nothing to paste into your theme.",
    },
    {
      question: "Is there a free plan?",
      answer:
        "Yes. Starter is free forever for one store. Paid plans add attribution, alerts, longer history and team features.",
    },
    {
      question: "What happens after I join the waitlist?",
      answer:
        "We invite stores in small batches. You'll get an email when your spot opens, and your founding-member price is locked in from that day.",
    },
    {
      question: "Can I change or cancel my plan later?",
      answer:
        "Any time, from your settings. Upgrades apply immediately; downgrades take effect at the end of your billing period.",
    },
    {
      question: "Is Flowly a real product?",
      answerBefore:
        "No. Flowly is a fictional product built as a portfolio project to show production-quality Next.js work: this landing page, a working waitlist form and an analytics dashboard running on generated data. ",
      answerLink: "Open the live demo",
      answerAfter: " to see it in action.",
    },
  ],
} as const;
