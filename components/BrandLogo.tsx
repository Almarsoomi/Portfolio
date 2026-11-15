import Image from "next/image";
import { logos, type LogoKey } from "@/data/logos";

/**
 * A client/project logo on a fixed dark tile, so marks drawn for dark
 * backgrounds (The Walls, Care Plus) read the same in light and dark theme.
 */
export default function BrandLogo({
  logo,
  alt = "",
  className = "h-11 w-11",
  padding = "p-1.5",
}: {
  logo: LogoKey;
  alt?: string;
  className?: string;
  padding?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0b0f1a] ${padding} ${className}`}
    >
      <Image src={logos[logo]} alt={alt} unoptimized className="h-full w-full object-contain" />
    </span>
  );
}
