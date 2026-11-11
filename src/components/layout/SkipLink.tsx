export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="sr-only z-[100] bg-gold-500 px-4 py-3 font-semibold text-brand-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      {label}
    </a>
  );
}
