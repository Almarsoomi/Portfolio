import type { ReactNode } from "react";
import { arabic, body, display } from "@/app/fonts";
import type { Lang } from "@/data/content";
import { LangProvider } from "./i18n";
import CustomCursor from "./CustomCursor";
import SmoothScroll from "./SmoothScroll";
import ScrollToTop from "./ScrollToTop";
import { THEME_INIT_SCRIPT } from "./ThemeToggle";

/** <html> shell shared by the English and Arabic root layouts. */
export default function RootDocument({ lang, children }: { lang: Lang; children: ReactNode }) {
  const fonts = `${display.variable} ${body.variable} ${lang === "ar" ? arabic.variable : ""}`;
  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className={fonts} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <LangProvider lang={lang}>
          <SmoothScroll />
          <CustomCursor />
          {children}
          <ScrollToTop />
        </LangProvider>
      </body>
    </html>
  );
}
