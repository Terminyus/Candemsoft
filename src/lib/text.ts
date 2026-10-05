/** Locale-safe comparison key: "İletişim", "ILETISIM" and "iletisim" all match. */
export function normalize(text: string): string {
  return text
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .trim();
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toLocaleUpperCase("tr"))
    .join("");
}

/** Content strings that start with TODO are placeholders the client still has to fill. */
export function isTodo(value: string | undefined | null): boolean {
  return !value || value.trim().startsWith("TODO");
}
