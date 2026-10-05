import { NextResponse, type NextRequest } from "next/server";
import { routes } from "@/i18n/routes";

// Kept self-contained: proxy runs separately from render code.
const prefixed = ["en", "es"] as const;
type Prefixed = (typeof prefixed)[number];
const all = Object.values(routes);
const toInternal = Object.fromEntries(
  prefixed.map((l) => [l, Object.fromEntries(all.map((r) => [r[l], r.tr]))]),
) as Record<Prefixed, Record<string, string>>;
const trSegments = new Set<string>(all.map((r) => r.tr).filter(Boolean));

/** Alternative designs live under their own top-level folder and share the URL scheme. */
const sites = ["v2", "v3"] as const;

// Rewrites carry the locale as a header so the global 404 (outside [lang]) can localize itself.
function rewrite(request: NextRequest, url: URL, locale: string) {
  const headers = new Headers(request.headers);
  headers.set("x-cs-locale", locale);
  return NextResponse.rewrite(url, { request: { headers } });
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  let parts = url.pathname.split("/").filter(Boolean);

  // Metadata images live under the internal /tr|/en|/es tree and are referenced by that path.
  if (/\/(opengraph|twitter)-image/.test(url.pathname)) return NextResponse.next();

  const site = sites.find((s) => s === parts[0]);
  const base = site ? `/${site}` : "";
  if (site) parts = parts.slice(1);
  const join = (...p: string[]) => [base, ...p].join("/").replace(/\/+/g, "/").replace(/(.)\/$/, "$1") || "/";

  // /tr/... → /... (Turkish is the unprefixed default)
  if (parts[0] === "tr") {
    url.pathname = join("", ...parts.slice(1));
    return NextResponse.redirect(url, 308);
  }

  const locale = prefixed.find((l) => l === parts[0]);
  if (locale) {
    const [, segment, ...rest] = parts;
    if (!segment) {
      url.pathname = join("", locale);
      return rewrite(request, url, locale);
    }
    const map = toInternal[locale];
    // /en/hakkimizda → /en/about (canonical localized URL)
    if (!(segment in map) && trSegments.has(segment)) {
      const localized = all.find((r) => r.tr === segment)![locale];
      url.pathname = join("", locale, localized, ...rest);
      return NextResponse.redirect(url, 308);
    }
    url.pathname = join("", locale, map[segment] ?? segment, ...rest);
    return rewrite(request, url, locale);
  }

  url.pathname = join("", "tr", ...parts);
  return rewrite(request, url, "tr");
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|icon|apple-icon|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.[\\w]+$).*)",
  ],
};
