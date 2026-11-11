import Link from "next/link";
import Image from "next/image";
import { Emblem } from "./Emblem";

export function Brand({
  homeHref,
  name,
  tagline,
  country,
  logo,
  tone = "dark",
  compact = false,
}: {
  homeHref: string;
  name: string;
  tagline: string;
  country: string;
  logo: string | null;
  tone?: "dark" | "light";
  compact?: boolean;
}) {
  const light = tone === "light";
  return (
    <Link href={homeHref} className="group flex items-center gap-3.5 sm:gap-4" aria-label={name}>
      {logo ? (
        <Image src={logo} alt="" width={56} height={56} className={compact ? "h-10 w-10" : "h-12 w-12 sm:h-14 sm:w-14"} />
      ) : (
        <Emblem tone={tone} className={`${compact ? "h-10 w-10" : "h-12 w-12 sm:h-14 sm:w-14"} shrink-0 transition-[height,width] duration-200`} />
      )}
      <span className="flex flex-col">
        <span className={`text-[0.68rem] font-semibold uppercase tracking-[0.2em] ${light ? "text-gold-300" : "text-gold-700"} ${compact ? "hidden" : "hidden sm:block"}`}>
          {country}
        </span>
        <span className={`font-serif font-semibold leading-tight ${light ? "text-white" : "text-navy-900"} ${compact ? "text-[1.1rem]" : "text-[1.15rem] sm:text-[1.45rem]"}`}>
          {name}
        </span>
        <span className={`text-[0.82rem] leading-snug ${light ? "text-white/70" : "text-ink-muted"} ${compact ? "hidden" : "hidden md:block"}`}>{tagline}</span>
      </span>
    </Link>
  );
}
