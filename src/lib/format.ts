export function formatDate(date: string, lang: string) {
  return new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(date),
  );
}
