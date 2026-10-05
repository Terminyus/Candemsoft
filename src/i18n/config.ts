export const locales = ["tr", "en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeNames: Record<Locale, string> = { tr: "Türkçe", en: "English", es: "Español" };

/** BCP 47 tags for Intl, <html lang> alternatives and structured data. */
export const localeTags: Record<Locale, string> = { tr: "tr-TR", en: "en-GB", es: "es-ES" };
