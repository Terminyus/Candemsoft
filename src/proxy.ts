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

// Rewrites carry the locale as a header so the global 404 (outside [lang]) can localize itself.
function rewrite(request: NextRequest, url: URL, locale: string) {
  const headers = new Headers(request.headers);
  headers.set("x-cs-locale", locale);
  return NextResponse.rewrite(url, { request: { headers } });
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const parts = url.pathname.split("/").filter(Boolean);

  // Metadata images live under the internal /tr|/en|/es tree and are referenced by that path.
  if (/\/(opengraph|twitter)-image/.test(url.pathname)) return NextResponse.next();

  // /tr/... → /... (Turkish is the unprefixed default)
  if (parts[0] === "tr") {
    url.pathname = "/" + parts.slice(1).join("/");
    return NextResponse.redirect(url, 308);
  }

  const locale = prefixed.find((l) => l === parts[0]);
  if (locale) {
    const [, segment, ...rest] = parts;
    if (!segment) {
      url.pathname = `/${locale}`;
      return rewrite(request, url, locale);
    }
    const map = toInternal[locale];
    // /en/hakkimizda → /en/about (canonical localized URL)
    if (!(segment in map) && trSegments.has(segment)) {
      const localized = all.find((r) => r.tr === segment)![locale];
      url.pathname = ["", locale, localized, ...rest].join("/");
      return NextResponse.redirect(url, 308);
    }
    url.pathname = ["", locale, map[segment] ?? segment, ...rest].join("/");
    return rewrite(request, url, locale);
  }

  url.pathname = "/tr" + (url.pathname === "/" ? "" : url.pathname);
  return rewrite(request, url, "tr");
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|icon|apple-icon|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.[\\w]+$).*)",
  ],
};
