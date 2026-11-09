import type { ReactNode } from "react";
import RootDocument from "@/components/RootDocument";
import { pageMetadata } from "@/data/meta";
import "../globals.css";

export const metadata = pageMetadata("en", "home");

export default function Layout({ children }: { children: ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
