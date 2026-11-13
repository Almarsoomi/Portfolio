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
  question: "How can I help you?",
  hint: "Two services, one person: websites and accounting. Pick what you need.",
  paths: {
    build: {
      href: "/build",
      eyebrow: "Web development",
      title: "I need a website or app",
      description:
        "Fast websites, web apps and automation that take the busywork off your business.",
      chips: ["Websites", "Web apps", "Automation"],
      cta: "See websites & apps",
      switchLabel: "Need bookkeeping?",
    },
    books: {
      href: "/books",
      eyebrow: "Accounting & bookkeeping",
      title: "I need an accountant or bookkeeper",
      description:
        "Clean, VAT-ready books in Zoho Books, reconciled monthly so you always know your numbers.",
      chips: ["Bookkeeping", "UAE VAT", "Corporate Tax", "Zoho Books"],
      cta: "See accounting services",
      switchLabel: "Need a website?",
    },
  } satisfies Record<PathKey, unknown>,
};

export const hero = {
  badge: "Web Developer • Dubai",
  greeting: "Hi, I'm Ahmed",
  headline: "Building Tools That Solve Real Problems",
  // Lead-in + the words the typewriter cycles through after it.
  lead: "I build",
  typewriter: ["websites.", "web apps.", "automation.", "AI tools."],
  subheadline:
    "Full-stack developer for UAE businesses. I build fast websites, web apps, automation and AI-powered tools that take the busywork off your team — bilingual, mobile-first and built to grow with you.",
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
    title: "Automation & AI Tools",
    description:
      "AI-powered tools, invoice processing, document reading, online booking and maintenance tracking — automating the repetitive work UAE businesses do by hand.",
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
    skills: ["Vercel", "Cloudflare", "cPanel", "GitHub"],
  },
  {
    title: "Domains",
    skills: [
      "Websites",
      "Web apps",
      "Automation",
      "AI tools",
      "Bilingual AR/EN",
    ],
  },
];

export const about = {
  heading: "Solve the problem first. Pick the tech second.",
  paragraphs: [
    "I build tailored websites and tools around real UAE business needs — bilingual customers, online bookings, invoices that pile up, schedules kept on paper. The starting point is never a framework; it's the actual problem a business is losing hours to every week.",
    "Every project ships fast, works on the phone first, and speaks Arabic and English. Where AI genuinely saves time — reading documents, answering routine questions, sorting data — I build it in; where it doesn't, I keep things simple.",
  ],
};

/** About section on the bookkeeping path — same shape as `about`. */
export const booksAbout: typeof about = {
  heading: "Accurate books. No surprises at month-end.",
  paragraphs: [
    "I keep the books for UAE businesses inside Zoho Books — recording sales, bills and expenses, reconciling every bank and card account, and keeping VAT and Corporate Tax records ready before they are due.",
    "My clients span manufacturing, retail and services, so I know how project costing, inventory and service revenue each need to be handled. You get clear monthly reports and a straight answer whenever you ask what the numbers mean.",
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

export const contact = {
  heading: "Let's build something useful",
  text: "Tap through a few quick questions — no typing until the end. I'll reply with a clear plan and a quote. Based in Dubai, working with businesses across the UAE.",
};

export const booksContact = {
  heading: "Let's get your books in order",
  text: "Tell me about your business in a few taps. I'll reply with a clear plan and a fixed monthly quote — no jargon.",
};

/** Icons available to the contact form's option cards. */
export type FormIcon =
  | "globe"
  | "dashboard"
  | "calendar"
  | "cart"
  | "bot"
  | "sparkles"
  | "rocket"
  | "refresh"
  | "puzzle"
  | "book"
  | "settings"
  | "percent"
  | "landmark"
  | "eraser"
  | "chart"
  | "store"
  | "factory"
  | "briefcase"
  | "hardhat"
  | "utensils"
  | "shapes"
  | "bookcheck"
  | "laptop"
  | "sheet"
  | "receipt"
  | "zap"
  | "clock"
  | "compass";

export interface FormOption {
  id: string;
  label: string;
  /** Options with an icon render as cards; without, as compact chips. */
  icon?: FormIcon;
  hint?: string;
}

export interface FormGroup {
  id: string;
  /** Shown above the options when a step has more than one group. */
  label?: string;
  /** Short name used in the brief and in the email ("Budget"). */
  summary: string;
  multi?: boolean;
  optional?: boolean;
  options: FormOption[];
}

export interface FormStep {
  title: string;
  subtitle: string;
  groups: FormGroup[];
}

/** The tap-through contact form: one set of questions per path. */
export const contactForm = {
  ui: {
    step: "Step",
    of: "of",
    back: "Back",
    next: "Next",
    backToSummary: "Back to summary",
    goToStep: "Jump to a step",
    send: "Send request",
    sending: "Sending…",
    optional: "optional",
    pickOne: "Pick one",
    pickAny: "Pick any that apply",
    brief: "Your brief",
    briefEmpty: "Your answers will appear here as you tap.",
    edit: "Edit",
    detailsTitle: "Where should I reply?",
    detailsSubtitle: "Last step — leave an email or WhatsApp number, whichever suits you.",
    name: "Your name",
    namePh: "e.g. Ahmed Ibrahim",
    company: "Company",
    companyPh: "Business name",
    email: "Email",
    emailPh: "you@company.com",
    whatsapp: "WhatsApp",
    whatsappPh: "50 123 4567",
    countryCode: "Country code",
    searchCountry: "Search country or code",
    noCountry: "No country found",
    didYouMean: "Did you mean",
    questionMark: "?",
    useSuggestion: "Yes, fix it",
    keepMine: "No, it's correct",
    preferred: "Best way to reach you",
    preferredOptions: { email: "Email", whatsapp: "WhatsApp", either: "Either" },
    message: "Anything else?",
    messagePh: "A link to your current site, a deadline, an idea… (optional)",
    errors: {
      name: "Please add your name.",
      contact: "Add an email or a WhatsApp number so I can reply.",
      email: "That email doesn't look right.",
      whatsapp: "That number doesn't look right for {country}. Check the country code and number.",
    },
    privacy: "Only used to reply to you. No newsletters, ever.",
    successTitle: "Request sent",
    successText: "Thanks, {name}! I'll get back to you within one working day.",
    successCopy: "A copy is on its way to your inbox.",
    reference: "Reference",
    errorTitle: "That didn't go through",
    errorText: "Something went wrong while sending. Please try again in a moment.",
    retry: "Try again",
    startOver: "Start a new request",
    hoursNote: "Replies within one working day",
    emailSubject: "New request",
  },
  build: {
    label: "Website / Web app",
    steps: [
      {
        title: "What are we building?",
        subtitle: "Pick the closest — we can fine-tune it together.",
        groups: [
          {
            id: "type",
            summary: "Project",
            options: [
              { id: "website", label: "Business website", icon: "globe", hint: "Show who you are, win enquiries" },
              { id: "webapp", label: "Web app or portal", icon: "dashboard", hint: "Logins, dashboards, data" },
              { id: "booking", label: "Booking system", icon: "calendar", hint: "Customers book online" },
              { id: "store", label: "Online store", icon: "cart", hint: "Sell products online" },
              { id: "automation", label: "Automation / AI tool", icon: "bot", hint: "Stop doing it by hand" },
              { id: "other", label: "Something else", icon: "sparkles", hint: "Tell me at the end" },
            ],
          },
        ],
      },
      {
        title: "Where are you starting from?",
        subtitle: "And the must-haves, if you already know them.",
        groups: [
          {
            id: "stage",
            label: "Starting point",
            summary: "Starting point",
            options: [
              { id: "new", label: "Brand new", icon: "rocket" },
              { id: "redesign", label: "Redesign what I have", icon: "refresh" },
              { id: "extend", label: "Add to what I have", icon: "puzzle" },
            ],
          },
          {
            id: "features",
            label: "Must-haves",
            summary: "Must-haves",
            multi: true,
            optional: true,
            options: [
              { id: "bilingual", label: "Arabic + English" },
              { id: "whatsapp", label: "WhatsApp" },
              { id: "booking", label: "Online booking" },
              { id: "payments", label: "Payments" },
              { id: "admin", label: "Admin dashboard" },
              { id: "ai", label: "AI features" },
              { id: "seo", label: "SEO" },
            ],
          },
        ],
      },
      {
        title: "Budget & timing",
        subtitle: "A rough idea is perfect — it helps me suggest the right scope.",
        groups: [
          {
            id: "budget",
            label: "Budget (AED)",
            summary: "Budget",
            options: [
              { id: "u5", label: "Under 5,000" },
              { id: "5-15", label: "5,000 – 15,000" },
              { id: "15-30", label: "15,000 – 30,000" },
              { id: "30+", label: "30,000+" },
              { id: "unsure", label: "Not sure yet" },
            ],
          },
          {
            id: "timeline",
            label: "Timeline",
            summary: "Timeline",
            options: [
              { id: "asap", label: "As soon as possible" },
              { id: "month", label: "Within a month" },
              { id: "quarter", label: "1–3 months" },
              { id: "flexible", label: "Flexible" },
            ],
          },
        ],
      },
    ] as FormStep[],
  },
  books: {
    label: "Bookkeeping",
    steps: [
      {
        title: "What do you need help with?",
        subtitle: "Pick everything that applies.",
        groups: [
          {
            id: "services",
            summary: "Services",
            multi: true,
            options: [
              { id: "monthly", label: "Monthly bookkeeping", icon: "book", hint: "Recorded & reconciled" },
              { id: "zoho", label: "Zoho Books setup", icon: "settings", hint: "Setup or migration" },
              { id: "vat", label: "VAT returns", icon: "percent", hint: "Registration & filing" },
              { id: "ct", label: "Corporate Tax readiness", icon: "landmark", hint: "Records in order" },
              { id: "cleanup", label: "Catch-up & clean-up", icon: "eraser", hint: "Fix the backlog" },
              { id: "reports", label: "Reports & insight", icon: "chart", hint: "P&L, cash, balance sheet" },
            ],
          },
        ],
      },
      {
        title: "Tell me about your business",
        subtitle: "So I know which accounts and reports matter to you.",
        groups: [
          {
            id: "industry",
            label: "Industry",
            summary: "Industry",
            options: [
              { id: "retail", label: "Trading & retail", icon: "store" },
              { id: "manufacturing", label: "Manufacturing", icon: "factory" },
              { id: "services", label: "Services", icon: "briefcase" },
              { id: "contracting", label: "Contracting", icon: "hardhat" },
              { id: "food", label: "Food & hospitality", icon: "utensils" },
              { id: "other", label: "Other", icon: "shapes" },
            ],
          },
          {
            id: "volume",
            label: "Transactions per month",
            summary: "Volume",
            options: [
              { id: "u100", label: "Under 100" },
              { id: "100-500", label: "100 – 500" },
              { id: "500+", label: "500+" },
              { id: "unsure", label: "Not sure" },
            ],
          },
        ],
      },
      {
        title: "Where are your books today?",
        subtitle: "No judgement — shoeboxes of receipts are welcome.",
        groups: [
          {
            id: "current",
            label: "Current setup",
            summary: "Books today",
            options: [
              { id: "zoho", label: "Zoho Books", icon: "bookcheck" },
              { id: "software", label: "Other software", icon: "laptop", hint: "QuickBooks, Xero, Tally…" },
              { id: "excel", label: "Excel / spreadsheets", icon: "sheet" },
              { id: "none", label: "Receipts & statements", icon: "receipt", hint: "Not started yet" },
            ],
          },
          {
            id: "start",
            label: "When would you like to start?",
            summary: "Start",
            options: [
              { id: "now", label: "Right away", icon: "zap" },
              { id: "next", label: "Next month", icon: "clock" },
              { id: "exploring", label: "Just exploring", icon: "compass" },
            ],
          },
        ],
      },
    ] as FormStep[],
  },
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
  lastVisited: "Last visited",
  or: "or",
  themeLabel: "Switch between light and dark theme",
  availability: {
    open: {
      build: "Available for new projects",
      books: "Taking on new clients",
    } as Record<PathKey, string>,
    busy: "Fully booked right now",
  },
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
  footerRole: {
    build: "Web Developer • Dubai",
    books: "Zoho Books Bookkeeper • Dubai",
  } as Record<PathKey, string>,
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
