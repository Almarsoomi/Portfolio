import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProjectsGrid from "@/components/ProjectsGrid";
import WorkCategories from "@/components/WorkCategories";
import Accounting from "@/components/Accounting";
import Skills from "@/components/Skills";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProjectsGrid />
        <WorkCategories />
        <Accounting />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
