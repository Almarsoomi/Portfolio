"use client";

import type { PathKey } from "@/data/portfolio";
import { useContent } from "./i18n";

export default function Footer({ path }: { path: PathKey }) {
  const { site, ui } = useContent();
  return (
    <footer className="border-t border-edge">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-ink-faint sm:flex-row sm:px-8">
        <p>
          © {new Date().getFullYear()} {site.name}. {ui.footer}
        </p>
        <p className="font-display tracking-tight">{ui.footerRole[path]}</p>
      </div>
    </footer>
  );
}
