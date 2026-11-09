import PathShell from "@/components/PathShell";
import Hero from "@/components/Hero";
import PinnedProjects from "@/components/PinnedProjects";
import WorkCategories from "@/components/WorkCategories";
import Skills from "@/components/Skills";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Crossover from "@/components/Crossover";
import Contact from "@/components/Contact";

export default function BuildPage() {
  return (
    <PathShell path="build">
      <Hero path="build" />
      <PinnedProjects />
      <WorkCategories />
      <Testimonials path="build" />
      <Skills />
      <About />
      <Crossover path="build" />
      <Contact path="build" />
    </PathShell>
  );
}
