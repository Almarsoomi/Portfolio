"use client";

import { createContext, useContext, type ReactNode } from "react";
import { content, localHref, type Lang } from "@/data/content";

const LangContext = createContext<Lang>("en");

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang(): Lang {
  return useContext(LangContext);
}

/** All site content in the current language. */
export function useContent() {
  return content[useLang()];
}

/** Language-aware path for <Link href>. */
export function useLocalHref() {
  const lang = useLang();
  return (path: string) => localHref(lang, path);
}
