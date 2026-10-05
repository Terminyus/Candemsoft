import "server-only";
import type { Locale } from "@/i18n/config";

const dictionaries = {
  tr: () => import("@content/locales/tr.json").then((m) => m.default),
  en: () => import("@content/locales/en.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["tr"]>>;

export function getDictionary(lang: Locale): Promise<Dictionary> {
  return dictionaries[lang]();
}
