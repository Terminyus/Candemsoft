import { defaultLocale, type Locale } from "./config";
import { isStaticExport, v2Root } from "@/lib/static";

/**
 * Route keys map to a URL segment per locale. The filesystem uses the
 * Turkish segment (src/app/[lang]/<tr-segment>); proxy.ts rewrites the
 * English/Spanish segment to it. Turkish URLs carry no locale prefix.
 */
export const routes = {
  home: { tr: "", en: "", es: "" },
  about: { tr: "hakkimizda", en: "about", es: "sobre-nosotros" },
  services: { tr: "hizmetler", en: "services", es: "servicios" },
  projects: { tr: "projeler", en: "projects", es: "proyectos" },
  products: { tr: "urunler", en: "products", es: "productos" },
  team: { tr: "ekip", en: "team", es: "equipo" },
  blog: { tr: "blog", en: "blog", es: "blog" },
  contact: { tr: "iletisim", en: "contact", es: "contacto" },
  privacy: { tr: "gizlilik", en: "privacy", es: "privacidad" },
  tools: { tr: "araclar", en: "tools", es: "herramientas" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

export const serviceRouteSlugs: Record<string, Record<Locale, string>> = {
  web: { tr: "web-yazilim", en: "web-development", es: "desarrollo-web" },
  mobil: { tr: "mobil-uygulama", en: "mobile-apps", es: "desarrollo-movil" },
  "yapay-zeka": { tr: "yapay-zeka", en: "artificial-intelligence", es: "inteligencia-artificial" },
  "ui-ux": { tr: "ui-ux-tasarim", en: "ui-ux-design", es: "diseno-ui-ux" },
  danismanlik: { tr: "danismanlik", en: "consulting", es: "consultoria" },
};

export const toolRouteSlugs: Record<string, Record<Locale, string>> = {
  "metin-buyuk-kucuk-harf": {
    tr: "buyuk-kucuk-harf-donusturucu",
    en: "case-converter",
    es: "convertidor-mayusculas-minusculas",
  },
  "kelime-karakter-sayaci": {
    tr: "kelime-karakter-sayaci",
    en: "word-character-counter",
    es: "contador-palabras-caracteres",
  },
  "slug-ascii-donusturucu": {
    tr: "slug-ascii-donusturucu",
    en: "slug-generator",
    es: "generador-slug",
  },
};

export function resolveServiceSlug(slug: string, targetLang: Locale): string {
  if (slug in serviceRouteSlugs) return serviceRouteSlugs[slug][targetLang];
  for (const map of Object.values(serviceRouteSlugs)) {
    if (Object.values(map).includes(slug)) return map[targetLang];
  }
  return slug;
}

export function resolveToolSlug(slug: string, targetLang: Locale): string {
  if (slug in toolRouteSlugs) return toolRouteSlugs[slug][targetLang];
  for (const map of Object.values(toolRouteSlugs)) {
    if (Object.values(map).includes(slug)) return map[targetLang];
  }
  return slug;
}

/** Public URL for a route, e.g. href("en", "projects", "proox") → "/en/projects/proox". */
export function href(lang: Locale, key: RouteKey, ...rest: string[]): string {
  const resolvedRest =
    key === "services" && rest.length > 0
      ? [resolveServiceSlug(rest[0], lang), ...rest.slice(1)]
      : key === "tools" && rest.length > 0
      ? [resolveToolSlug(rest[0], lang), ...rest.slice(1)]
      : rest;
  // Static export: no proxy to rewrite, so link straight to the internal path (/tr/projeler).
  if (isStaticExport && !v2Root) return "/" + [lang, routes[key].tr, ...resolvedRest].filter(Boolean).join("/");
  const parts = [routes[key][lang], ...resolvedRest].filter(Boolean);
  const prefix = lang === defaultLocale ? "" : `/${lang}`;
  const path = `${prefix}/${parts.join("/")}`;
  // v2 at the site root: URLs carry a trailing slash (matches the canonical/hreflang Next emits with trailingSlash: true,
  // so internal links, sitemap and canonical all agree; nginx 301s the slash-less form).
  if (v2Root) return path.length > 1 && !path.endsWith("/") ? `${path}/` : path || "/";
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

/** URL inside the alternative "Vitrin" design (/v2). */
export function v2(path: string): string {
  if (v2Root) return path;
  return path === "/" ? "/v2" : `/v2${path}`;
}

/** URL inside the alternative "Gazete" design (/v3). */
export function v3(path: string): string {
  return path === "/" ? "/v3" : `/v3${path}`;
}

/** URL inside the alternative "Derleme" design (/v4). */
export function v4(path: string): string {
  return path === "/" ? "/v4" : `/v4${path}`;
}

/** URL inside the alternative "Kurumsal" design (/v5). */
export function v5(path: string): string {
  return path === "/" ? "/v5" : `/v5${path}`;
}
