import { IBM_Plex_Sans_Arabic, Manrope, Space_Grotesk } from "next/font/google";

export const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
export const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
/** Arabic pages: one family with real Arabic glyphs for both headings and text. */
export const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});
