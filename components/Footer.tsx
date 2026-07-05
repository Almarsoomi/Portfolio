import { site } from "@/data/portfolio";

export default function Footer() {
  return (
    <footer className="border-t border-edge">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-ink-faint sm:flex-row sm:px-8">
        <p>
          © {new Date().getFullYear()} {site.name}. Built in Dubai.
        </p>
        <p className="font-display tracking-tight">{site.role}</p>
      </div>
    </footer>
  );
}
