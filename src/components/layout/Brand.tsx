import Link from "next/link";
import { Emblem } from "./Emblem";

/**
 * Horizontal logo lockup as defined in the visual identity guideline:
 * icon · vertical divider · three-line name in Open Sans Bold.
 * The guideline's clear space (2x) is kept by the surrounding padding; the
 * mark is never recoloured, stretched or placed over busy imagery.
 */
export function Brand({
  homeHref,
  name,
  lines,
  logo,
  tone = "dark",
  compact = false,
  iconOnlyOnMobile = false,
}: {
  homeHref: string;
  /** Full official name — used as the accessible label */
  name: string;
  lines: string[];
  logo: string | null;
  tone?: "dark" | "light";
  compact?: boolean;
  /** Use the guideline's icon-only variant below the sm breakpoint (narrow headers) */
  iconOnlyOnMobile?: boolean;
}) {
  const textVisibility = iconOnlyOnMobile ? "hidden sm:flex" : "flex";
  const light = tone === "light";
  const iconSize = compact ? "h-10 w-10" : "h-12 w-12 sm:h-[3.6rem] sm:w-[3.6rem]";
  return (
    <Link href={homeHref} className="group flex items-center gap-3 sm:gap-3.5" aria-label={name}>
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- small SVG mark, no optimisation needed
        <img src={logo} alt="" className={`${iconSize} shrink-0 object-contain transition-[height,width] duration-200`} />
      ) : (
        <Emblem tone={tone} className={`${iconSize} shrink-0`} />
      )}
      <span aria-hidden="true" className={`${textVisibility} w-[2px] self-stretch ${light ? "bg-white" : "bg-ink"} ${compact ? "my-1" : "my-0.5"}`} />
      <span className={`${textVisibility} flex-col font-bold leading-[1.28] ${light ? "text-white" : "text-ink"} ${compact ? "text-[0.72rem]" : "text-[0.72rem] sm:text-[0.86rem]"}`}>
        {lines.map((line) => (
          <span key={line} className="whitespace-nowrap">
            {line}
          </span>
        ))}
      </span>
    </Link>
  );
}
