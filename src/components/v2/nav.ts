import type { Locale } from "@/i18n/config";
import { href, v2, type RouteKey } from "@/i18n/routes";
import type { Dictionary } from "@/lib/dictionary";

export const v2NavKeys: RouteKey[] = ["products", "projects", "services", "about", "blog", "contact"];

export function v2Href(lang: Locale, key: RouteKey, ...rest: string[]) {
  return v2(href(lang, key, ...rest));
}

export function v2Nav(lang: Locale, dict: Dictionary) {
  return v2NavKeys.map((key) => ({ key, label: dict.nav[key as Exclude<RouteKey, "home">], href: v2Href(lang, key) }));
}
