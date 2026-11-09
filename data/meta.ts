import type { Metadata } from "next";
import { content, type Lang } from "./content";

type Page = "home" | "build" | "books";

const PAGE_META: Record<Lang, Record<Exclude<Page, "home">, { title: string; description: string }>> = {
  en: {
    build: {
      title: "Ahmed — Websites, Web Apps & Business Tools in Dubai",
      description:
        "Websites, web apps and automation for UAE businesses — built with Next.js and deployed globally.",
    },
    books: {
      title: "Ahmed — Zoho Books Bookkeeping & Accounting in Dubai",
      description:
        "Monthly bookkeeping, bank reconciliation, UAE VAT filing support and Corporate Tax readiness in Zoho Books.",
    },
  },
  ar: {
    build: {
      title: "أحمد — مواقع وتطبيقات ويب وأدوات أعمال في دبي",
      description: "مواقع وتطبيقات ويب وأتمتة للشركات في الإمارات — مبنية بـ Next.js ومنشورة عالمياً.",
    },
    books: {
      title: "أحمد — مسك الدفاتر والمحاسبة على Zoho Books في دبي",
      description:
        "مسك دفاتر شهري، ومطابقة بنكية، ودعم إقرارات ضريبة القيمة المضافة، وجاهزية لضريبة الشركات على Zoho Books.",
    },
  },
};

export function pageMetadata(lang: Lang, page: Page): Metadata {
  const { site } = content[lang];
  const { title, description } = page === "home" ? site : PAGE_META[lang][page];
  return {
    metadataBase: new URL(site.url),
    title,
    description,
    openGraph: {
      title,
      description,
      url: site.url,
      siteName: site.name,
      locale: lang === "ar" ? "ar_AE" : "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
