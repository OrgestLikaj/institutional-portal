/**
 * Emblem placeholder — a neutral crest built from a column motif.
 * Replace with the official logo via `institution.logo` (src/config/institution.ts).
 */
export function Emblem({ className = "h-12 w-12", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const stroke = tone === "dark" ? "#10243A" : "#FFFFFF";
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="30" fill="none" stroke="#B79A60" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="26.5" fill="none" stroke={stroke} strokeWidth="1" opacity="0.35" />
      <path d="M17 25 L32 16 L47 25 Z" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="18" y1="27.5" x2="46" y2="27.5" stroke={stroke} strokeWidth="1.8" />
      {[22, 28, 36, 42].map((x) => (
        <line key={x} x1={x} y1="30.5" x2={x} y2="42.5" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
      ))}
      <line x1="17" y1="45.5" x2="47" y2="45.5" stroke={stroke} strokeWidth="1.8" />
      <line x1="15" y1="48.5" x2="49" y2="48.5" stroke="#B79A60" strokeWidth="1.8" />
    </svg>
  );
}
