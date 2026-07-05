import { about } from "@/data/portfolio";
import { Reveal, SectionHeading } from "./motion-primitives";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-content px-5 py-section-sm sm:px-8">
      <SectionHeading eyebrow="About / Approach" title={about.heading} />
      <Reveal className="max-w-2xl space-y-5">
        {about.paragraphs.map((p) => (
          <p key={p.slice(0, 32)} className="text-base leading-relaxed text-ink-muted sm:text-lg">
            {p}
          </p>
        ))}
      </Reveal>
    </section>
  );
}
