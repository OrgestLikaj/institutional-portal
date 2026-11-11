"use client";

import { createContext, useContext } from "react";
import { MotionConfig } from "framer-motion";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/sq";

type I18nValue = { locale: Locale; t: Dictionary };

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ locale, dictionary, children }: { locale: Locale; dictionary: Dictionary; children: React.ReactNode }) {
  return (
    <I18nContext.Provider value={{ locale, t: dictionary }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </I18nContext.Provider>
  );
}

/** Access the active locale and dictionary from client components. */
export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}
