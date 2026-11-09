"use client";

import { useContent } from "./i18n";
import { SectionHeading, StaggerGroup } from "./motion-primitives";
import ProjectCard from "./ProjectCard";

/** On the bookkeeping path: the finance software I've built, as proof of depth. */
export default function FinanceTools() {
  const { financeToolTitles, projects, ui } = useContent();
  const tools = projects.filter((p) => financeToolTitles.includes(p.title));
  return (
    <section id="tools" className="mx-auto max-w-content px-5 py-section-sm sm:px-8">
      <SectionHeading
        eyebrow={ui.sections.tools.eyebrow}
        title={ui.sections.tools.title}
        intro={ui.sections.tools.intro}
      />
      <StaggerGroup className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {tools.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </StaggerGroup>
    </section>
  );
}
