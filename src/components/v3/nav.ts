import type { Locale } from "@/i18n/config";
import { href, v3, type RouteKey } from "@/i18n/routes";
import type { Dictionary } from "@/lib/dictionary";

export const v3NavKeys: RouteKey[] = ["products", "projects", "services", "about", "blog", "contact"];

export function v3Href(lang: Locale, key: RouteKey, ...rest: string[]) {
  return v3(href(lang, key, ...rest));
}

export function v3Nav(lang: Locale, dict: Dictionary) {
  return v3NavKeys.map((key) => ({ key, label: dict.nav[key as Exclude<RouteKey, "home">], href: v3Href(lang, key) }));
}
