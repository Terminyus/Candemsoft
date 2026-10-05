import type { Locale } from "@/i18n/config";
import { href, v4, type RouteKey } from "@/i18n/routes";
import type { Dictionary } from "@/lib/dictionary";

export const v4NavKeys: RouteKey[] = ["products", "projects", "services", "about", "blog", "contact"];

export function v4Href(lang: Locale, key: RouteKey, ...rest: string[]) {
  return v4(href(lang, key, ...rest));
}

export function v4Nav(lang: Locale, dict: Dictionary) {
  return v4NavKeys.map((key) => ({ key, label: dict.nav[key as Exclude<RouteKey, "home">], href: v4Href(lang, key) }));
}
