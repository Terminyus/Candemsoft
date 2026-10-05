import { localeTags, type Locale } from "@/i18n/config";

export function formatDate(date: string, lang: string) {
  return new Intl.DateTimeFormat(localeTags[lang as Locale] ?? "tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(date),
  );
}
