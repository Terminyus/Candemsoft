import "server-only";
import type { Locale } from "@/i18n/config";
import { href, routes, type RouteKey } from "@/i18n/routes";
import { getProducts, getProjects, getServices, getSite } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import type { TermData } from "./types";

const serviceAliases: Record<string, string[]> = {
  web: ["web", "website", "site"],
  mobil: ["mobil", "mobile", "app", "uygulama"],
  "yapay-zeka": ["yapay-zeka", "yapay-zekâ", "ai", "yz", "llm"],
  "ui-ux": ["ui-ux", "ui", "ux", "tasarim", "design"],
  danismanlik: ["danismanlik", "consulting", "danisma"],
};

const navKeys = ["home", "about", "services", "projects", "products", "team", "blog", "contact", "privacy"] as const;

export function getTerminalData(lang: Locale, dict: Dictionary): TermData {
  const { contact } = getSite();
  const t = dict.terminal;
  const cmdDesc = t.cmd as Record<string, string>;
  return {
    lang,
    otherLangHref: href(lang === "tr" ? "en" : "tr", "home"),
    routes: navKeys.map((key: RouteKey) => {
      const label = key === "home" ? dict.nav.home : dict.nav[key as Exclude<RouteKey, "home">];
      return {
        key,
        command: routes[key][lang] || "~",
        // Both languages' segments and labels work everywhere: "projects" on the Turkish site still goes to projects.
        aliases: [routes[key].tr, routes[key].en, label].filter(Boolean),
        label,
        desc: cmdDesc[key] ?? "",
        href: href(lang, key),
      };
    }),
    projects: getProjects().map((p) => ({ slug: p.slug, name: p.name, href: href(lang, "projects", p.slug), live: p.status === "live" })),
    products: getProducts().map((p) => ({ slug: p.slug, name: p.name, href: `${href(lang, "products")}#${p.slug}` })),
    services: getServices().map((s) => ({
      slug: s.slug,
      aliases: serviceAliases[s.slug] ?? [s.slug],
      title: s.title[lang],
      summary: s.summary[lang],
      href: `${href(lang, "services")}#${s.slug}`,
    })),
    contact: { ...contact, contactHref: href(lang, "contact") },
    strings: {
      user: t.user,
      helpIntro: t.helpIntro,
      helpMore: t.helpMore,
      more: t.more,
      notFound: t.notFound,
      didYouMean: t.didYouMean,
      going: t.going,
      opening: t.opening,
      noMatch: t.noMatch,
      needArg: t.needArg,
      whoami: t.whoami,
      sudo: t.sudo,
      projectsHeading: t.projectsHeading,
      productsHeading: t.productsHeading,
      servicesHeading: t.servicesHeading,
      offline: t.offline,
    },
  };
}
