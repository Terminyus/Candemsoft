import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/i18n/config";
import { href, type RouteKey } from "@/i18n/routes";
import { getPostSlugs, getProjects } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

const pages: RouteKey[] = ["home", "about", "services", "projects", "products", "team", "blog", "contact", "privacy"];

function entry(route: RouteKey, rest: string[] = [], availableIn: readonly Locale[] = locales): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(availableIn.map((l) => [l, `${siteUrl}${href(l, route, ...rest)}`]));
  return availableIn.map((l) => ({
    url: `${siteUrl}${href(l, route, ...rest)}`,
    alternates: { languages },
    changeFrequency: route === "blog" ? "weekly" : "monthly",
    priority: route === "home" ? 1 : rest.length ? 0.6 : 0.8,
  }));
}

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = [...new Set(locales.flatMap((l) => getPostSlugs(l)))];
  return [
    ...pages.flatMap((p) => entry(p)),
    ...getProjects().flatMap((p) => entry("projects", [p.slug])),
    ...posts.flatMap((slug) => entry("blog", [slug], locales.filter((l) => getPostSlugs(l).includes(slug)))),
  ];
}
