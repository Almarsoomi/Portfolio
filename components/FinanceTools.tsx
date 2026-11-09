import { financeToolTitles, projects } from "@/data/portfolio";
import { SectionHeading, StaggerGroup } from "./motion-primitives";
import ProjectCard from "./ProjectCard";

/** On the bookkeeping path: the finance software I've built, as proof of depth. */
export default function FinanceTools() {
  const tools = projects.filter((p) => financeToolTitles.includes(p.title));
  return (
    <section id="tools" className="mx-auto max-w-content px-5 py-section-sm sm:px-8">
      <SectionHeading
        eyebrow="Beyond Bookkeeping"
        title="A bookkeeper who builds finance tools"
        intro="Working in the books every day shows me where the hours go. So I build software to win them back."
      />
      <StaggerGroup className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {tools.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </StaggerGroup>
    </section>
  );
}
