import type { Metadata } from "next";
import PathShell from "@/components/PathShell";
import Hero from "@/components/Hero";
import Accounting from "@/components/Accounting";
import Process from "@/components/Process";
import FinanceTools from "@/components/FinanceTools";
import About from "@/components/About";
import Crossover from "@/components/Crossover";
import Contact from "@/components/Contact";
import { booksContact, booksHero } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Ahmed — Zoho Books Bookkeeping & Accounting in Dubai",
  description:
    "Monthly bookkeeping, bank reconciliation, UAE VAT filing support and Corporate Tax readiness in Zoho Books.",
};

export default function BooksPage() {
  return (
    <PathShell path="books">
      <Hero content={booksHero} />
      <Accounting />
      <Process />
      <FinanceTools />
      <About />
      <Crossover path="books" />
      <Contact heading={booksContact.heading} text={booksContact.text} />
    </PathShell>
  );
}
