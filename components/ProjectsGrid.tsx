import { projects } from "@/data/portfolio";
import ProjectCard from "./ProjectCard";
import { SectionHeading, StaggerGroup } from "./motion-primitives";

export default function ProjectsGrid() {
  return (
    <section id="projects" className="mx-auto max-w-content px-5 py-section-sm sm:px-8">
      <SectionHeading
        eyebrow="Featured Projects"
        title="Tools built for real businesses"
        intro="Web apps, financial automation, and back-office tooling — each one built to remove a specific, recurring pain."
      />
      <StaggerGroup className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </StaggerGroup>
    </section>
  );
}
