import { skills } from "@/data/portfolio";
import { SectionHeading, StaggerGroup, StaggerItem } from "./motion-primitives";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-content px-5 py-section-sm sm:px-8">
      <SectionHeading
        eyebrow="Skills"
        title="The stack behind the work"
      />
      <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {skills.map((col) => (
          <StaggerItem key={col.title} className="h-full">
            <div className="h-full rounded-2xl border border-edge bg-surface-raised/50 p-6 shadow-card">
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2.5 text-sm text-ink-muted">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
