import { NextResponse, type NextRequest } from "next/server";
import { routes } from "@/i18n/routes";

// Kept self-contained: proxy runs separately from render code.
const en = Object.fromEntries(Object.values(routes).map((r) => [r.en, r.tr])) as Record<string, string>;
const trSegments = new Set<string>(Object.values(routes).map((r) => r.tr).filter(Boolean));

// Rewrites carry the locale as a header so the global 404 (outside [lang]) can localize itself.
function rewrite(request: NextRequest, url: URL, locale: "tr" | "en") {
  const headers = new Headers(request.headers);
  headers.set("x-cs-locale", locale);
  return NextResponse.rewrite(url, { request: { headers } });
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const parts = url.pathname.split("/").filter(Boolean);

  // Metadata images live under the internal /tr|/en tree and are referenced by that path.
  if (/\/(opengraph|twitter)-image/.test(url.pathname)) return NextResponse.next();

  // /tr/... → /... (Turkish is the unprefixed default)
  if (parts[0] === "tr") {
    url.pathname = "/" + parts.slice(1).join("/");
    return NextResponse.redirect(url, 308);
  }

  if (parts[0] === "en") {
    const [, segment, ...rest] = parts;
    if (!segment) {
      url.pathname = "/en";
      return rewrite(request, url, "en");
    }
    // /en/hakkimizda → /en/about (canonical English URL)
    if (trSegments.has(segment) && !(segment in en)) {
      const enSegment = Object.values(routes).find((r) => r.tr === segment)!.en;
      url.pathname = ["", "en", enSegment, ...rest].join("/");
      return NextResponse.redirect(url, 308);
    }
    const internal = en[segment] ?? segment;
    url.pathname = ["", "en", internal, ...rest].join("/");
    return rewrite(request, url, "en");
  }

  url.pathname = "/tr" + (url.pathname === "/" ? "" : url.pathname);
  return rewrite(request, url, "tr");
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|icon|apple-icon|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.[\\w]+$).*)",
  ],
};
