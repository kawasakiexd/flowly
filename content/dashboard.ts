export const dashboardCopy = {
  storeName: "Northwind Goods",
  storeHint: "Demo store",
  banner:
    "You're exploring a live demo with generated data — nothing here is real, so click around.",
  backToSite: "Back to site",
  dismissBanner: "Dismiss demo notice",
  groups: {
    analytics: "Analytics",
    store: "Store",
  },
  nav: {
    overview: "Overview",
    orders: "Orders",
    customers: "Customers",
    products: "Products",
    marketing: "Marketing",
    settings: "Settings",
  },
  soon: "Soon",
  soonTooltip: "Not part of this demo",
  promo: {
    title: "Like what you see?",
    text: "Join the waitlist for early access.",
    cta: "Join waitlist",
  },
  toggleSidebar: "Toggle sidebar",
  utcCaption: "All times in UTC",
  demoMenu: {
    trigger: "Demo data",
    triggerAria: "Demo data scenario",
    label: "Simulate conditions",
    helper: "See how the dashboard handles real-world conditions.",
    items: {
      normal: "Normal",
      slow: "Slow network",
      empty: "Empty store",
      error: "API errors",
    },
  },
  avatar: "Maya Chen · Northwind Goods",
  presets: {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
    "12m": "Last 12 months",
    custom: "Custom range…",
  },
  kpis: {
    revenue: {
      label: "Revenue",
      tooltip:
        "Paid, fulfilled and pending orders. Refunded and cancelled orders are excluded.",
    },
    orders: {
      label: "Orders",
      tooltip: "Orders placed in the period, excluding cancelled orders.",
    },
    aov: {
      label: "Average order value",
      tooltip: "Revenue divided by orders.",
    },
    conversion: {
      label: "Conversion rate",
      tooltip: "Orders divided by sessions.",
    },
  },
  emptyPeriod: "No data for this period",
  emptyChartText: "Try a different date range.",
  widgets: {
    revenue: {
      title: "Revenue",
      description: {
        day: "Daily revenue compared with the previous period",
        week: "Weekly revenue compared with the previous period",
        month: "Monthly revenue compared with the previous period",
      },
    },
    traffic: {
      title: "Traffic sources",
      description: "Sessions by channel",
    },
    orders: {
      title: "Orders",
      description: {
        day: "Orders per day",
        week: "Orders per week",
        month: "Orders per month",
      },
    },
    recent: {
      title: "Recent orders",
      description:
        "Search, filter and sort every order in the selected period.",
      viewAll: "View all orders",
    },
  },
  trafficLabels: {
    organic: "Organic search",
    paid: "Paid ads",
    social: "Social",
    email: "Email",
    direct: "Direct",
  },
  table: {
    searchPlaceholder: "Search orders, customers or emails…",
    searchAria: "Search orders",
    clearSearch: "Clear search",
    status: "Status",
    source: "Source",
    reset: "Reset",
    view: "View",
    viewAria: "Toggle columns",
    emptyPeriodTitle: "No orders in this period",
    emptyPeriodText: "When orders come in, they'll show up here.",
    emptyFiltersTitle: "No orders match your filters",
    emptyFiltersText: "Try a different search or clear the filters.",
    clearFilters: "Clear filters",
    showing: (from: number, to: number, total: number) =>
      `Showing ${from}–${to} of ${total.toLocaleString("en-US")} orders`,
    rowsPerPage: "Rows per page",
    pageOf: (page: number, pages: number) => `Page ${page} of ${pages}`,
    first: "Go to first page",
    previous: "Go to previous page",
    next: "Go to next page",
    last: "Go to last page",
  },
  status: {
    paid: "Paid",
    fulfilled: "Fulfilled",
    pending: "Pending",
    refunded: "Refunded",
    cancelled: "Cancelled",
  },
  error: {
    title: (widget: string) => `Couldn't load ${widget}`,
    simulated:
      "The analytics API didn't respond. This is a simulated error — switch Demo data back to Normal.",
    generic: "Something went wrong while loading this data.",
    retry: "Try again",
    routeTitle: "This page hit a snag",
    routeText:
      "We couldn't load the dashboard. Try again, or head back to the homepage.",
    home: "Back to home",
  },
  ordersPage: {
    title: "Orders",
    description: "Every order in the selected period.",
  },
} as const;
