import * as en from "./portfolio";
import * as ar from "./portfolio.ar";

export type Lang = "en" | "ar";
export type Content = typeof en;

export const LANGS: Lang[] = ["en", "ar"];
export const content: Record<Lang, Content> = { en, ar: { ...en, ...ar } };

/** Prefix a site path with the language: "/books" → "/ar/books". */
export function localHref(lang: Lang, path: string): string {
  if (lang === "en") return path;
  return path === "/" ? "/ar" : `/ar${path}`;
}

/** The same page in the other language (pathname without basePath). */
export function switchLangPath(pathname: string, to: Lang): string {
  const bare = pathname.replace(/^\/ar(?=\/|$)/, "") || "/";
  return localHref(to, bare);
}
