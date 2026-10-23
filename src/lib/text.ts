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
    .filter((w, i, all) => i === 0 || i === all.length - 1) // first name + surname: "Ahmet Can Yüksel" → "AY"
    .map((w) => w[0]!.toLocaleUpperCase("tr"))
    .join("");
}

/** Content strings that start with TODO are placeholders the client still has to fill. */
export function isTodo(value: string | undefined | null): boolean {
  return !value || value.trim().startsWith("TODO");
}

/** URL fragment for a heading: "CSS de kurtarmıyor" → "css-de-kurtarmiyor" (same rule in TOC and MDX). */
export function slugify(text: string): string {
  return normalize(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Plain text of a React children tree (for heading ids built from MDX nodes). */
export function textOf(node: unknown): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (typeof node === "object" && "props" in node) return textOf((node as { props: { children?: unknown } }).props.children);
  return "";
}
