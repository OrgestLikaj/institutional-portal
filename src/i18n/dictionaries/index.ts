import type { Locale } from "../config";
import sq, { type Dictionary } from "./sq";
import en from "./en";

const dictionaries: Record<Locale, Dictionary> = { sq, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
