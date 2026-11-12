import type { PathKey } from "./portfolio";
import type { LogoKey } from "./logos";

/**
 * Client testimonials. ONLY add real quotes that clients have agreed to share.
 * The section shows the client strip until this list has entries.
 *
 * Example (fill in and uncomment):
 * {
 *   quote: "Ahmed rebuilt our website and bookings now come straight to WhatsApp.",
 *   name: "Full Name",
 *   role: "Owner",
 *   company: "Care Plus Auto Repairing",
 *   paths: ["build"],
 * },
 */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Which path pages show it. */
  paths: PathKey[];
}

export const testimonials: Testimonial[] = [];

/** Businesses I've worked with — shown as a moving strip on each path. */
export const clients: { name: string; logo?: LogoKey; paths: PathKey[] }[] = [
  { name: "The Walls Carpentry", logo: "thewalls", paths: ["build", "books"] },
  { name: "Metal East Records", paths: ["build", "books"] },
  { name: "Care Plus Auto Repairing", logo: "careplus", paths: ["build"] },
  { name: "Build It Contracting", logo: "buildit", paths: ["build"] },
  { name: "H&S Water Sports", paths: ["books"] },
];
