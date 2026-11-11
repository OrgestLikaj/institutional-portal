import "./globals.css";

/**
 * The <html> element is rendered by app/[locale]/layout.tsx so that `lang`
 * matches the active language. This root layout only passes children through.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
