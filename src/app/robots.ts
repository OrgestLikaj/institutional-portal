import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // The prototype stays out of search engines until NEXT_PUBLIC_ALLOW_INDEXING=true
  const allow = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    rules: allow ? [{ userAgent: "*", allow: "/", disallow: ["/api/", "/*/search"] }] : [{ userAgent: "*", disallow: "/" }],
    sitemap: SITE_URL + "/sitemap.xml",
  };
}
