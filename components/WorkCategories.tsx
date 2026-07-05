import { Globe, Wallet, Workflow } from "lucide-react";
import { workCategories, type WorkCategory } from "@/data/portfolio";
import { SectionHeading, StaggerGroup, StaggerItem } from "./motion-primitives";

const icons: Record<WorkCategory["icon"], typeof Globe> = {
  globe: Globe,
  wallet: Wallet,
  workflow: Workflow,
};

export default function WorkCategories() {
  return (
    <section className="mx-auto max-w-content px-5 py-section-sm sm:px-8">
      <SectionHeading
        eyebrow="What I Do"
        title="Three kinds of work, one goal"
      />
      <StaggerGroup className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        {workCategories.map((cat) => {
          const Icon = icons[cat.icon];
          return (
            <StaggerItem key={cat.title} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-edge bg-surface-raised/50 p-6 shadow-card transition-colors duration-300 hover:border-accent/40 sm:p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-accent/25 bg-accent/10">
                  <Icon aria-hidden className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                  {cat.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                  {cat.description}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
