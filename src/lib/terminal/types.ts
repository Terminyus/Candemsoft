import type { Locale } from "@/i18n/config";

export type TermLink = { label: string; href: string; desc?: string; external?: boolean; command?: string };

export type TermLine =
  | { kind: "input"; text: string }
  | { kind: "text"; text: string; tone?: "muted" | "ok" | "error" }
  | { kind: "links"; heading?: string; items: TermLink[] };

export type TermAction =
  | { type: "navigate"; href: string }
  | { type: "external"; href: string }
  | { type: "location"; href: string }
  | { type: "clear" };

export type TermResult = { lines: TermLine[]; action?: TermAction };

export type TermStrings = {
  user: string;
  helpIntro: string;
  helpMore: string;
  more: { cmd: string; desc: string }[];
  notFound: string;
  didYouMean: string;
  going: string;
  opening: string;
  noMatch: string;
  needArg: string;
  whoami: string;
  sudo: string;
  projectsHeading: string;
  productsHeading: string;
  servicesHeading: string;
  offline: string;
};

export type TermData = {
  lang: Locale;
  /** Current page in every locale (filled in on the client from the current path). */
  langHrefs: Record<Locale, string>;
  routes: { key: string; aliases: string[]; label: string; desc: string; href: string; command: string }[];
  projects: { slug: string; name: string; href: string; live: boolean }[];
  products: { slug: string; name: string; href: string }[];
  services: { slug: string; aliases: string[]; title: string; summary: string; href: string }[];
  contact: { email: string; phone: string; phoneHref: string; whatsapp: string; contactHref: string };
  strings: TermStrings;
};
