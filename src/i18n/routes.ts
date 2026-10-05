import { defaultLocale, type Locale } from "./config";
import { isStaticExport } from "@/lib/static";

/**
 * Route keys map to a URL segment per locale. The filesystem uses the
 * Turkish segment (src/app/[lang]/<tr-segment>); proxy.ts rewrites the
 * English segment to it. Turkish URLs carry no locale prefix.
 */
export const routes = {
  home: { tr: "", en: "" },
  about: { tr: "hakkimizda", en: "about" },
  services: { tr: "hizmetler", en: "services" },
  projects: { tr: "projeler", en: "projects" },
  products: { tr: "urunler", en: "products" },
  team: { tr: "ekip", en: "team" },
  blog: { tr: "blog", en: "blog" },
  contact: { tr: "iletisim", en: "contact" },
  privacy: { tr: "gizlilik", en: "privacy" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

/** Public URL for a route, e.g. href("en", "projects", "proox") → "/en/projects/proox". */
export function href(lang: Locale, key: RouteKey, ...rest: string[]): string {
  // Static export: no proxy to rewrite, so link straight to the internal path (/tr/projeler).
  if (isStaticExport) return "/" + [lang, routes[key].tr, ...rest].filter(Boolean).join("/");
  const parts = [routes[key][lang], ...rest].filter(Boolean);
  const prefix = lang === defaultLocale ? "" : `/${lang}`;
  const path = `${prefix}/${parts.join("/")}`;
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path || "/";
}

function findKeyBySegment(segment: string, lang: Locale): RouteKey | undefined {
  return (Object.keys(routes) as RouteKey[]).find((k) => routes[k][lang] === segment && segment !== "");
}

/** Internal (filesystem) segment for a public English segment. */
export function toInternalSegment(segment: string, lang: Locale): string | undefined {
  const key = findKeyBySegment(segment, lang);
  return key ? routes[key].tr : undefined;
}

/** Translate a public pathname from one locale to another, keeping slugs. */
export function switchLocalePath(pathname: string, from: Locale, to: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  if (from !== defaultLocale && parts[0] === from) parts.shift();
  const [first, ...rest] = parts;
  if (!first) return href(to, "home");
  const key = findKeyBySegment(first, from);
  return key ? href(to, key, ...rest) : href(to, "home");
}

/**
 * Public URL from the internal segments below [lang] (what useSelectedLayoutSegments returns).
 * Unlike usePathname, these are identical during static prerender and in the browser, because
 * proxy.ts rewrites public URLs to internal ones.
 */
export function pathFromSegments(lang: Locale, segments: string[]): string {
  const [first, ...rest] = segments.filter((s) => !s.startsWith("("));
  if (!first) return href(lang, "home");
  const key = (Object.keys(routes) as RouteKey[]).find((k) => routes[k].tr === first);
  return key ? href(lang, key, ...rest) : href(lang, "home");
}
