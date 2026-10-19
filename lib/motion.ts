export const durations = {
  fast: 0.15,
  base: 0.2,
  slow: 0.4,
  slower: 0.6,
} as const;

export const easeOutQuint = [0.22, 1, 0.36, 1] as const;

export const spring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
};

export const revealVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};
