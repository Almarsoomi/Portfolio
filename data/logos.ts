import type { StaticImageData } from "next/image";
import prestatement from "@/assets/logos/prestatement.svg";
import myboatlog from "@/assets/logos/myboatlog.svg";
import careplus from "@/assets/logos/careplus.svg";
import thewalls from "@/assets/logos/thewalls.webp";
import buildit from "@/assets/logos/buildit.svg";

/**
 * Brand marks for clients and projects, taken from each site's own repo.
 * Static imports so the GitHub Pages basePath is applied automatically.
 * Add a key here (and the file in assets/logos) to give a client a logo.
 */
export const logos = { prestatement, myboatlog, careplus, thewalls, buildit } satisfies Record<
  string,
  StaticImageData
>;

export type LogoKey = keyof typeof logos;
