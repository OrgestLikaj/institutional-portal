import "./globals.css";
import Link from "next/link";

/** Fallback 404 for paths outside the locale tree (rare: the proxy prefixes a locale on every page route). */
export default function RootNotFound() {
  return (
    <html lang="sq">
      <body className="flex min-h-screen items-center justify-center bg-paper p-6 font-sans">
        <div className="max-w-md text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold-700">404</p>
          <h1 className="mt-3 text-3xl">Faqja nuk u gjet · Page not found</h1>
          <p className="mt-6 flex justify-center gap-4">
            <Link href="/sq" className="btn-primary">
              Shqip
            </Link>
            <Link href="/en" className="btn-outline">
              English
            </Link>
          </p>
        </div>
      </body>
    </html>
  );
}
