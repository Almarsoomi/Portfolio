import type { Metadata } from "next";
import PathShell from "@/components/PathShell";
import Hero from "@/components/Hero";
import PinnedProjects from "@/components/PinnedProjects";
import WorkCategories from "@/components/WorkCategories";
import Skills from "@/components/Skills";
import About from "@/components/About";
import Crossover from "@/components/Crossover";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Ahmed — Websites, Web Apps & Business Tools in Dubai",
  description:
    "Websites, web apps and automation for UAE businesses — built with Next.js and deployed globally.",
};

export default function BuildPage() {
  return (
    <PathShell path="build">
      <Hero />
      <PinnedProjects />
      <WorkCategories />
      <Skills />
      <About />
      <Crossover path="build" />
      <Contact />
    </PathShell>
  );
}
