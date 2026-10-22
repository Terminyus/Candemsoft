import fs from "node:fs";
import path from "node:path";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { toolRouteSlugs } from "@/i18n/routes";

// Re-export all pure string algorithms and text analysis types
export * from "./text-tools";

export const toolKeys = [
  "metin-buyuk-kucuk-harf",
  "kelime-karakter-sayaci",
  "slug-ascii-donusturucu",
] as const;

export type ToolKey = (typeof toolKeys)[number];

export const toolSlugs: Record<ToolKey, Record<Locale, string>> = toolRouteSlugs as Record<
  ToolKey,
  Record<Locale, string>
>;

/** Reverse lookup: maps any localized slug or tool key to its canonical ToolKey */
const slugToKeyMap: Record<string, ToolKey> = {};
for (const key of toolKeys) {
  slugToKeyMap[key] = key;
  for (const lang of locales) {
    slugToKeyMap[toolSlugs[key][lang]] = key;
  }
}

export function resolveToolKey(slugOrKey: string): ToolKey | undefined {
  return slugToKeyMap[slugOrKey];
}

/** Returns the canonical public slug for a tool key in the given locale */
export function getToolSlug(keyOrSlug: string, lang: Locale): string {
  const key = resolveToolKey(keyOrSlug);
  if (!key) return keyOrSlug;
  return toolSlugs[key][lang] ?? toolSlugs[key][defaultLocale];
}

/** Validates whether the given slug is the canonical public slug for the specified locale */
export function isValidCanonicalToolSlug(slug: string, lang: Locale): boolean {
  const key = resolveToolKey(slug);
  if (!key) return false;
  return toolSlugs[key][lang] === slug;
}

/* -------------------------------------------------------------------------- */
/* Tool Content Types & Data Loader                                           */
/* -------------------------------------------------------------------------- */

export type LocalizedText = Record<Locale, string>;

export type ToolFaqItem = {
  question: LocalizedText;
  answer: LocalizedText;
};

export type ToolArticleSection = {
  heading: LocalizedText;
  paragraphs: Record<Locale, string[]>;
};

export type ToolData = {
  key: ToolKey;
  slug: Record<Locale, string>;
  title: LocalizedText;
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
  kicker: LocalizedText;
  lead: LocalizedText;
  article: {
    title: LocalizedText;
    sections: ToolArticleSection[];
  };
  faq: ToolFaqItem[];
  relatedProducts: string[];
  relatedBlogSlug: string;
};

const toolsDir = path.join(process.cwd(), "content", "tools");

export function getTool(keyOrSlug: string): ToolData | undefined {
  const key = resolveToolKey(keyOrSlug);
  if (!key) return undefined;
  const filePath = path.join(toolsDir, `${key}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as ToolData;
}

export function getToolForLocale(slug: string, lang: Locale): ToolData | undefined {
  if (!isValidCanonicalToolSlug(slug, lang)) return undefined;
  return getTool(slug);
}

export function getAllTools(): ToolData[] {
  return toolKeys
    .map((k) => getTool(k))
    .filter((t): t is ToolData => t !== undefined);
}
