/**
 * All site content lives here. Edit this file to update the portfolio —
 * no component changes needed.
 */

export type ProjectStatus = "Live" | "In Progress" | "Planning" | "Archived";

export interface Project {
  category: string;
  title: string;
  description: string;
  impact?: string;
  tech: string[];
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

export const nav = [
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  badge: "Builder & Bookkeeper • Dubai",
  headline: "Building Tools That Solve Real Problems",
  subheadline:
    "Full-stack developer and bookkeeping specialist for UAE businesses. I build web apps, financial automation, and accounting systems — and keep the books behind them clean, VAT-ready, and audit-friendly.",
  primaryCta: { label: "View Projects", href: "#projects" },
  secondaryCta: { label: "Get in Touch", href: "#contact" },
};

export const projects: Project[] = [
  {
    category: "Financial Tools",
    title: "Personal Finance Tracker",
    description:
      "A full-stack app that imports bank statements, categorizes transactions into a flexible hierarchy, and surfaces financial insights over time.",
    impact: "Automated transaction tracking across 3+ credit cards.",
    tech: ["Next.js", "Express", "SQLite"],
    status: "In Progress",
  },
  {
    category: "Financial Tools",
    title: "Bank Statement Analyzer",
    description:
      "Analyzes UAE credit card statements and categorizes 200+ transactions in under 30 seconds, producing clean PDF summaries.",
    impact: "Reduced manual analysis from 2 hours to 30 seconds.",
    tech: ["Python", "OCR", "ReportLab"],
    status: "Live",
  },
  {
    category: "Web Development",
    title: "The Walls Carpentry Website",
    description:
      "Marketing site for a Dubai carpentry firm with parametric wave animations, a live Instagram Graph API feed, bilingual Arabic/English content, and Cloudflare-served media.",
    tech: ["Next.js", "Instagram API", "Cloudflare", "i18n"],
    status: "Live",
    link: "https://thewalls.ae",
  },
  {
    category: "Business Operations",
    title: "Invoice Reconciliation Tool",
    description:
      "Compares supplier invoices against Zoho Books exports and generates color-coded Excel discrepancy reports for fast month-end review.",
    impact: "Reconciles 100+ invoices monthly across 4 suppliers.",
    tech: ["Python", "Zoho Books", "Excel"],
    status: "Live",
  },
  {
    category: "Business Operations",
    title: "ZeroG Invoices",
    description:
      "Offline-first invoice processing pipeline combining Node.js with Python OCR (pdfplumber + EasyOCR) and local SQLite storage.",
    tech: ["Node.js", "Python", "EasyOCR", "SQLite"],
    status: "Archived",
  },
  {
    category: "Business Operations",
    title: "UAE HR & Payroll System",
    description:
      "Payroll engine built around UAE labour law: gratuity calculation, WPS salary file export, and document expiry alerts for visas and permits.",
    tech: ["UAE Labour Law", "WPS", "Payroll"],
    status: "Planning",
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
      "Statement analyzers, finance trackers, and reporting pipelines that turn messy financial data into clear, actionable numbers.",
  },
  {
    icon: "workflow",
    title: "Business Automation",
    description:
      "Invoice reconciliation, OCR pipelines, payroll logic — automating the repetitive back-office work UAE businesses do by hand.",
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
      "HR/Legal",
      "UAE Compliance",
    ],
  },
];

export const about = {
  heading: "Solve the problem first. Pick the tech second.",
  paragraphs: [
    "I build tailored tools around real UAE business requirements — VAT filing, compliance deadlines, payroll rules, WPS exports. The starting point is never a framework; it's the actual problem a business is losing hours to every week.",
    "The offering is deliberately dual: I develop the software and I keep the books. Working inside Zoho Books daily for real clients means the tools I build come from firsthand knowledge of how UAE bookkeeping actually works — not guesses about it.",
  ],
};

export const contact = {
  heading: "Let's build something useful",
  text: "Whether you need a tool built, books cleaned up, or both — I'm one message away. Based in Dubai, working with businesses across the UAE.",
};
