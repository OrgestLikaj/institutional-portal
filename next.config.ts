import type { NextConfig } from "next";

/**
 * Remote image hosts. When WordPress is connected, its media host is added
 * automatically from WORDPRESS_API_URL so next/image can optimise CMS images.
 */
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
if (process.env.WORDPRESS_API_URL) {
  try {
    const { protocol, hostname } = new URL(process.env.WORDPRESS_API_URL);
    remotePatterns.push({ protocol: protocol.replace(":", "") as "http" | "https", hostname });
  } catch {
    // invalid URL: ignore, the CMS layer reports the configuration error
  }
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/**
 * Static export (GitHub Pages preview): NEXT_PUBLIC_STATIC_EXPORT=true.
 * The Pages workflow also removes src/proxy.ts, src/app/api and the catch-all
 * route before building, since a static host cannot run them.
 */
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(isStaticExport
    ? { output: "export" as const, basePath, trailingSlash: true, images: { unoptimized: true } }
    : {
        images: { remotePatterns, formats: ["image/avif", "image/webp"] },
        async headers() {
          return [{ source: "/(.*)", headers: securityHeaders }];
        },
      }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
