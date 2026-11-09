/**
 * All site content lives here. Edit this file to update the portfolio —
 * no component changes needed.
 */

export type ProjectStatus = "Live" | "In Progress" | "Planning" | "Archived";

/** Keys of the animated mini-demos in components/demos. */
export type ProjectDemo = "prestatement" | "myboatlog" | "careplus" | "thewalls" | "metaleast";

/** Drives the project's icon; independent of the (translated) category text. */
export type ProjectKind = "finance" | "web" | "ops";

export interface Project {
  kind: ProjectKind;
  /** Optional animated demo shown in the card's visual panel. */
  demo?: ProjectDemo;
  category: string;
  title: string;
  description: string;
  impact?: string;
  status: ProjectStatus;
  link?: string;
}

export interface WorkCategory {
  icon: "globe" | "wallet" | "workflow";
  title: string;
  description: string;
}

export interface IndustryCard {
  icon: "factory" | "store" | "waves";
  industry: string;
  client: string;
  points: string[];
}

export interface SkillColumn {
  title: string;
  skills: string[];
}

export const site = {
  name: "Ahmed",
  logo: "Ahmed.",
  role: "Builder & Bookkeeper • Dubai",
  title: "Ahmed — Builder & Bookkeeper in Dubai",
  description:
    "Dubai-based developer building practical business tools — web apps, financial automation, and accounting systems for UAE businesses. Zoho Books bookkeeping specialist.",
  url: "https://almarsoomi.github.io/Portfolio",
  email: "almarsoomi96@gmail.com",
  github: "https://github.com/almarsoomi",
};

export type PathKey = "build" | "books";

export interface NavItem {
  label: string;
  href: string;
}

/** Per-path navigation. Each path lives on its own page (/build, /books). */
export const navByPath: Record<PathKey, NavItem[]> = {
  build: [
    { label: "Projects", href: "#projects" },
    { label: "What I Do", href: "#work" },
    { label: "Skills", href: "#skills" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  books: [
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "Finance Tools", href: "#tools" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
};

/**
 * The homepage "fork": visitors pick the path that matches why they came.
 * Order here is the order the two doors appear in (left/top first).
 */
export const gateway = {
  greeting: "Hi, I'm Ahmed",
  question: "What brings you here?",
  hint: "Pick a path — you can switch anytime.",
  paths: {
    build: {
      href: "/build",
      index: "01",
      eyebrow: "Build",
      title: "Websites & Tools",
      description:
        "Fast websites, web apps and automation that remove the busywork from your business.",
      chips: ["Websites", "Web apps", "Automation"],
      cta: "Show me the work",
      switchLabel: "Need bookkeeping?",
    },
    books: {
      href: "/books",
      index: "02",
      eyebrow: "Books",
      title: "Accounting & Bookkeeping",
      description:
        "Clean, VAT-ready books in Zoho Books — reconciled monthly, so you always know your numbers.",
      chips: ["Zoho Books", "UAE VAT", "Corporate Tax"],
      cta: "Sort my books",
      switchLabel: "Need a website?",
    },
  } satisfies Record<PathKey, unknown>,
};

export const hero = {
  badge: "Builder & Bookkeeper • Dubai",
  greeting: "Hi, I'm Ahmed",
  headline: "Building Tools That Solve Real Problems",
  // Lead-in + the words the typewriter cycles through after it.
  lead: "I build",
  typewriter: ["web apps.", "financial tools.", "automation.", "clean books."],
  subheadline:
    "Full-stack developer and bookkeeping specialist for UAE businesses. I build web apps, financial automation, and accounting systems — and keep the books behind them clean, VAT-ready, and audit-friendly.",
  primaryCta: { label: "View Projects", href: "#projects" },
  secondaryCta: { label: "Get in Touch", href: "#contact" },
};

/** Hero for the bookkeeping path — same shape as `hero`. */
export const booksHero: typeof hero = {
  badge: "Zoho Books Specialist • Dubai",
  greeting: "Hi, I'm Ahmed",
  headline: "Books You Can Trust",
  lead: "I keep",
  typewriter: ["books clean.", "VAT on time.", "accounts reconciled.", "audits calm."],
  subheadline:
    "Bookkeeping and accounting for UAE businesses, done inside Zoho Books. Monthly reconciliations, VAT filing support and Corporate Tax readiness — so you spend your time running the business, not chasing receipts.",
  primaryCta: { label: "See Services", href: "#services" },
  secondaryCta: { label: "Get in Touch", href: "#contact" },
};

export const projects: Project[] = [
  {
    kind: "finance",
    category: "Financial Tools",
    title: "PreStatement",
    description:
      "See your UAE credit card bill build in real time from the SMS alerts your bank already sends, then check it line by line against the statement when it arrives.",
    impact: "Know your bill before the bank sends it — and catch every mismatch.",
    demo: "prestatement",
    status: "Live",
    link: "https://prestatement.com",
  },
  {
    kind: "web",
    category: "Web Development",
    title: "MyBoatLog",
    description:
      "Mobile-first marine management app: logbook, inventory, maintenance tracking, and crew management for boat owners and operators.",
    impact: "Every hour, every part, every service — tracked from the phone in your pocket.",
    demo: "myboatlog",
    status: "Live",
    link: "https://myboatlog.app",
  },
  {
    kind: "web",
    category: "Web Development",
    title: "Care Plus Auto Repairing Website",
    description:
      "Website for a Dubai car repair and paint workshop covering denting & painting, electrical, and mechanical services, with online and WhatsApp booking.",
    impact: "Customers book a repair in seconds — the workshop gets it straight on WhatsApp.",
    demo: "careplus",
    status: "Live",
    link: "https://careplusauto.com",
  },
  {
    kind: "web",
    category: "Web Development",
    title: "The Walls Carpentry Website",
    description:
      "Premium website for a Dubai carpentry and joinery firm, with animated wave design, a live Instagram feed, and full Arabic/English content.",
    impact: "A premium bilingual site that turns visitors into quote requests.",
    status: "Live",
    demo: "thewalls",
    link: "https://thewalls.ae",
  },
  {
    kind: "web",
    category: "Web Development",
    title: "Metal East Records",
    description:
      "A virtual record store for Dubai's Metal East Records: walk into the shop, flip through the crates, pull out a record and play it on the shop turntable.",
    impact: "Turns a local record shop into an experience people can visit from anywhere.",
    demo: "metaleast",
    status: "Live",
    link: "https://metal-east-records.vercel.app",
  },
  {
    kind: "web",
    category: "Web Development",
    title: "Build It Contracting",
    description:
      "Website for Build It, a Dubai building contracting company. A coming-soon page is live while the full site is being built.",
    status: "In Progress",
    link: "https://builditdxb.ae",
  },
  {
    kind: "ops",
    category: "Business Operations",
    title: "ZeroG Invoices",
    description:
      "Invoice processing tool that reads supplier invoices automatically — scanned or PDF — and turns them into clean, organised records, even offline.",
    status: "In Progress",
  },
];

export const workCategories: WorkCategory[] = [
  {
    icon: "globe",
    title: "Web Development",
    description:
      "Fast, modern websites and web apps — from bilingual marketing sites to full-stack products, built with Next.js and deployed globally.",
  },
  {
    icon: "wallet",
    title: "Financial Tools",
    description:
      "Fintech apps like PreStatement and reporting pipelines that turn messy financial data into clear, actionable numbers.",
  },
  {
    icon: "workflow",
    title: "Business Automation",
    description:
      "Invoice processing, OCR pipelines, online booking and maintenance tracking — automating the repetitive work UAE businesses do by hand.",
  },
];

export const accounting = {
  heading: "Accounting & Bookkeeping Services",
  intro:
    "Professional bookkeeping and accounting services for UAE businesses. Specialized in Zoho Books with hands-on experience across manufacturing, retail, and services — aligned with UAE VAT and Corporate Tax requirements.",
  industries: [
    {
      icon: "factory",
      industry: "Manufacturing",
      client: "The Walls Carpentry L.L.C. (Dubai)",
      points: [
        "Project cost allocation",
        "POC revenue recognition",
        "Supplier bills",
        "Monthly financial reporting",
      ],
    },
    {
      icon: "store",
      industry: "Retail",
      client: "Metal East Record Store",
      points: [
        "Inventory-based bookkeeping",
        "Supplier invoice reconciliation",
        "Multi-vendor purchase tracking",
      ],
    },
    {
      icon: "waves",
      industry: "Services",
      client: "H&S Water Sports",
      points: [
        "Service revenue bookkeeping",
        "Expense tracking",
        "Operational accounting",
      ],
    },
  ] as IndustryCard[],
  handles: [
    "Zoho Books setup & data import",
    "Monthly bookkeeping & bank reconciliation",
    "UAE VAT (5%) filing support",
    "Corporate Tax readiness",
    "Supplier invoice reconciliation",
    "Financial reporting & insights",
  ],
  cta: { label: "Discuss Your Books", href: "#contact" },
};

export const skills: SkillColumn[] = [
  {
    title: "Frontend",
    skills: ["React", "Next.js", "Tailwind", "Figma"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "Python", "Supabase", "SQLite"],
  },
  {
    title: "Platforms",
    skills: ["Vercel", "Cloudflare", "cPanel", "GitHub", "Zoho Books"],
  },
  {
    title: "Domains",
    skills: [
      "Web Dev",
      "Fintech",
      "Accounting & Bookkeeping",
      "Bilingual AR/EN",
      "UAE Compliance",
    ],
  },
];

export const about = {
  heading: "Solve the problem first. Pick the tech second.",
  paragraphs: [
    "I build tailored tools around real UAE business requirements — VAT filing, compliance deadlines, bilingual customers, bookings and maintenance schedules. The starting point is never a framework; it's the actual problem a business is losing hours to every week.",
    "The offering is deliberately dual: I develop the software and I keep the books. Working inside Zoho Books daily for real clients means the tools I build come from firsthand knowledge of how UAE bookkeeping actually works — not guesses about it.",
  ],
};

/** How a bookkeeping engagement runs, step by step. */
export const process = {
  heading: "From messy to month-end ready",
  intro:
    "A simple, repeatable rhythm. You send documents; I keep everything reconciled, filed and reported.",
  steps: [
    {
      title: "Review & setup",
      text: "I review your current books, set up or clean up Zoho Books, and import opening balances and history.",
    },
    {
      title: "Monthly bookkeeping",
      text: "Sales, bills and expenses recorded; every bank and card account reconciled to the statement.",
    },
    {
      title: "VAT & compliance",
      text: "VAT returns prepared on schedule, Corporate Tax records kept ready — no last-minute scramble.",
    },
    {
      title: "Reports & insight",
      text: "Clear monthly P&L, balance sheet and cash view, with a short note on what the numbers mean.",
    },
  ],
};

/** Finance tools I've built — shown on the bookkeeping path as proof of depth. */
export const financeToolTitles = ["PreStatement", "ZeroG Invoices"];

export const contact = {
  heading: "Let's build something useful",
  text: "Whether you need a tool built, books cleaned up, or both — I'm one message away. Based in Dubai, working with businesses across the UAE.",
};

export const booksContact = {
  heading: "Let's get your books in order",
  text: "Tell me about your business and where your books are today. I'll reply with a clear plan and a fixed monthly quote — no jargon.",
};

export const crossover = {
  build: {
    text: "Also need your books kept? I'm a Zoho Books bookkeeper too.",
    label: "See bookkeeping",
    href: "/books",
  },
  books: {
    text: "I also build the software — websites, web apps and finance tools.",
    label: "See the dev work",
    href: "/build",
  },
} satisfies Record<PathKey, { text: string; label: string; href: string }>;

/** Interface text used by components (labels, buttons, section headings). */
export const ui = {
  langName: "English",
  otherLangName: "العربية",
  otherLangShort: "ع",
  switchLangLabel: "Switch to Arabic",
  portraitAlt: "Ahmed",
  emailLabel: "Email Ahmed",
  githubLabel: "GitHub (opens in a new tab)",
  lastVisited: "Last visited",
  or: "or",
  nav: {
    main: "Main navigation",
    backToStart: "Back to start — choose a path",
    backToStartText: "Back to start",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mobileMenu: "Mobile menu",
    switchPrefix: "Switch to",
    switchTo: { build: "Bookkeeping", books: "Web Dev" } as Record<PathKey, string>,
  },
  status: {
    Live: "Live",
    "In Progress": "In Progress",
    Planning: "Planning",
    Archived: "Archived",
  } as Record<ProjectStatus, string>,
  liveDemo: "Live demo",
  liveDemoPlaying: "Live demo playing",
  prevProject: "Previous project",
  nextProject: "Next project",
  visit: "Visit the website",
  opensNewTab: "opens in a new tab",
  scrollTop: "Scroll back to top",
  step: "Step",
  footer: "Built in Dubai.",
  sections: {
    projects: {
      eyebrow: "Featured Projects",
      title: "Tools built for real businesses",
      intro:
        "Web apps, financial automation, and back-office tooling — each one built to remove a specific, recurring pain.",
    },
    work: { eyebrow: "What I Do", title: "Three kinds of work, one goal" },
    skills: { eyebrow: "Skills", title: "The stack behind the work" },
    about: { eyebrow: "About / Approach" },
    accounting: { eyebrow: "UAE Bookkeeping Specialist", handles: "What I handle" },
    process: { eyebrow: "How It Works" },
    tools: {
      eyebrow: "Beyond Bookkeeping",
      title: "A bookkeeper who builds finance tools",
      intro:
        "Working in the books every day shows me where the hours go. So I build software to win them back.",
    },
    testimonials: {
      eyebrow: "Clients",
      title: "Businesses I work with",
      trustedBy: "Trusted by businesses across the UAE",
    },
  },
  speed: {
    loadedIn: "Loaded in",
    seconds: "s",
    cached: "from cache",
    title: "How long this page took to load on your device",
  },
};
