import PathShell from "@/components/PathShell";
import Hero from "@/components/Hero";
import Accounting from "@/components/Accounting";
import Process from "@/components/Process";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export default function BooksPage() {
  return (
    <PathShell path="books">
      <Hero path="books" />
      <Accounting />
      <Process />
      <Testimonials path="books" />
      <About path="books" />
      <Contact path="books" />
    </PathShell>
  );
}
