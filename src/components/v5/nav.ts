import type { Locale } from "@/i18n/config";
import { href, v5, type RouteKey } from "@/i18n/routes";
import type { Dictionary } from "@/lib/dictionary";

export const v5NavKeys: RouteKey[] = ["about", "services", "products", "projects", "blog", "contact"];

export function v5Href(lang: Locale, key: RouteKey, ...rest: string[]) {
  return v5(href(lang, key, ...rest));
}

export function v5Nav(lang: Locale, dict: Dictionary) {
  return v5NavKeys.map((key) => ({ key, label: dict.nav[key as Exclude<RouteKey, "home">], href: v5Href(lang, key) }));
}
