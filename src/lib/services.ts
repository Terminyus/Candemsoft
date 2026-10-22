import fs from "node:fs";
import path from "node:path";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { serviceRouteSlugs } from "@/i18n/routes";

export const serviceKeys = ["web", "mobil", "yapay-zeka", "ui-ux", "danismanlik"] as const;
export type ServiceKey = (typeof serviceKeys)[number];

export const serviceSlugs: Record<ServiceKey, Record<Locale, string>> = serviceRouteSlugs as Record<
  ServiceKey,
  Record<Locale, string>
>;

/** Reverse lookup: maps any localized slug or service key to its canonical ServiceKey */
const slugToKeyMap: Record<string, ServiceKey> = {};
for (const key of serviceKeys) {
  slugToKeyMap[key] = key;
  for (const lang of locales) {
    slugToKeyMap[serviceSlugs[key][lang]] = key;
  }
}

export function resolveServiceKey(slugOrKey: string): ServiceKey | undefined {
  return slugToKeyMap[slugOrKey];
}

/** Returns the canonical public slug for a service key in the given locale */
export function getServiceSlug(keyOrSlug: string, lang: Locale): string {
  const key = resolveServiceKey(keyOrSlug);
  if (!key) return keyOrSlug;
  return serviceSlugs[key][lang] ?? serviceSlugs[key][defaultLocale];
}

/** Validates whether the given slug is the canonical public slug for the specified locale */
export function isValidCanonicalServiceSlug(slug: string, lang: Locale): boolean {
  const key = resolveServiceKey(slug);
  if (!key) return false;
  return serviceSlugs[key][lang] === slug;
}

export type LocalizedText = Record<Locale, string>;

export type ServiceFaqItem = {
  question: LocalizedText;
  answer: LocalizedText;
};

export type ServiceProcessStep = {
  step: string;
  title: LocalizedText;
  description: LocalizedText;
};

export type ServiceDeliverableItem = {
  title: LocalizedText;
  description: LocalizedText;
};

export type ServiceTargetItem = {
  title: LocalizedText;
  description: LocalizedText;
};

export type ServiceDeepDiveSection = {
  heading: LocalizedText;
  paragraphs: Record<Locale, string[]>;
};

export type DetailedService = {
  key: ServiceKey;
  slug: Record<Locale, string>;
  title: LocalizedText;
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
  kicker: LocalizedText;
  lead: LocalizedText;
  targetAudience: {
    title: LocalizedText;
    description: LocalizedText;
    items: ServiceTargetItem[];
  };
  process: {
    title: LocalizedText;
    description: LocalizedText;
    steps: ServiceProcessStep[];
  };
  deliverables: {
    title: LocalizedText;
    description: LocalizedText;
    items: ServiceDeliverableItem[];
  };
  technologies: {
    title: LocalizedText;
    description: LocalizedText;
    items: string[];
  };
  relatedProjects: string[];
  relatedProducts: string[];
  faq: ServiceFaqItem[];
  deepDive: {
    sections: ServiceDeepDiveSection[];
  };
};

const servicesDir = path.join(process.cwd(), "content", "services");

export function getDetailedService(keyOrSlug: string): DetailedService | undefined {
  const key = resolveServiceKey(keyOrSlug);
  if (!key) return undefined;
  const filePath = path.join(servicesDir, `${key}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as DetailedService;
}

/**
 * Returns the detailed service ONLY if the given slug matches the canonical slug for that locale.
 * Cross-locale slugs (e.g. /en/services/web-yazilim) return undefined to prevent duplicate content.
 */
export function getDetailedServiceForLocale(slug: string, lang: Locale): DetailedService | undefined {
  if (!isValidCanonicalServiceSlug(slug, lang)) return undefined;
  return getDetailedService(slug);
}

export function getAllDetailedServices(): DetailedService[] {
  return serviceKeys
    .map((k) => getDetailedService(k))
    .filter((s): s is DetailedService => s !== undefined);
}
