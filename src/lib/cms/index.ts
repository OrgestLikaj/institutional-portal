import "server-only";
import { cache } from "react";
import { mockProvider } from "./mock";
import { wordpressProvider } from "./wordpress";
import type { CmsProvider } from "./types";

/**
 * Content entry point used by every page.
 *
 *   CMS_SOURCE=mock       (default) bilingual demo content from src/data/mock
 *   CMS_SOURCE=wordpress  headless WordPress via REST (see docs/WORDPRESS.md)
 *
 * Switching source requires no change in pages or components.
 */
const source = process.env.CMS_SOURCE === "wordpress" ? "wordpress" : "mock";
const provider: CmsProvider = source === "wordpress" ? wordpressProvider : mockProvider;

/** Request-level de-duplication: layout + page asking for the same data hit the source once. */
export const cms = {
  ...provider,
  getSiteSettings: cache(provider.getSiteSettings.bind(provider)),
  getNavigation: cache(provider.getNavigation.bind(provider)),
} satisfies CmsProvider;

export const cmsSource = source;
export type * from "./types";
