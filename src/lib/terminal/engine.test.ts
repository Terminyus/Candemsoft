import { test } from "node:test";
import assert from "node:assert/strict";
import { complete, run } from "./engine";
import type { TermData } from "./types";

const data: TermData = {
  lang: "tr",
  langHrefs: { tr: "/", en: "/en", es: "/es" },
  routes: [
    { key: "home", command: "~", aliases: ["Ana sayfa"], label: "Ana sayfa", desc: "", href: "/" },
    { key: "projects", command: "projeler", aliases: ["projeler", "projects", "Projeler"], label: "Projeler", desc: "", href: "/projeler" },
    { key: "services", command: "hizmetler", aliases: ["hizmetler", "services"], label: "Hizmetler", desc: "", href: "/hizmetler" },
    { key: "contact", command: "iletisim", aliases: ["iletisim", "contact", "İletişim"], label: "İletişim", desc: "", href: "/iletisim" },
  ],
  projects: [{ slug: "kredi-turbo", name: "Kredi Turbo", href: "/projeler/kredi-turbo", live: true }],
  products: [{ slug: "seyyah", name: "Seyyah", href: "/urunler#seyyah" }],
  services: [{ slug: "yapay-zeka", aliases: ["yapay-zeka", "ai"], title: "Yapay zekâ", summary: "…", href: "/hizmetler#yapay-zeka" }],
  contact: { email: "info@candemsoft.com", phone: "+90", phoneHref: "+90", whatsapp: "https://wa.me/1", contactHref: "/iletisim" },
  strings: {
    user: "u", helpIntro: "", helpMore: "", more: [], notFound: "komut bulunamadı: {cmd}", didYouMean: "?",
    going: "→ {target}", opening: "", noMatch: "eşleşme yok: {arg}", needArg: "{usage}", whoami: "", sudo: "",
    projectsHeading: "", productsHeading: "", servicesHeading: "", offline: "",
  },
};

const nav = (input: string) => {
  const a = run(data, input).action;
  return a?.type === "navigate" ? a.href : undefined;
};

test("Turkish characters and case do not matter", () => {
  for (const input of ["iletişim", "iletisim", "İLETİŞİM", "ILETISIM", "  İletişim  "]) assert.equal(nav(input), "/iletisim");
});

test("English aliases work on the Turkish site", () => {
  assert.equal(nav("projects"), "/projeler");
  assert.equal(nav("cd contact"), "/iletisim");
  assert.equal(nav("cd ~"), "/");
});

test("Spanish verbs work", () => {
  assert.equal(nav("abrir kredi"), "/projeler/kredi-turbo");
  assert.equal(run(data, "ayuda").lines.length, 2);
  assert.equal(run(data, "limpiar").action?.type, "clear");
});

test("open matches projects and products by slug, name or prefix", () => {
  assert.equal(nav("open kredi-turbo"), "/projeler/kredi-turbo");
  assert.equal(nav("aç Kredi Turbo"), "/projeler/kredi-turbo");
  assert.equal(nav("open kredi"), "/projeler/kredi-turbo");
  assert.equal(nav("open seyyah"), "/urunler#seyyah");
});

test("cat accepts service aliases", () => {
  assert.equal(run(data, "cat ai").lines[0]?.kind, "text");
  assert.match(JSON.stringify(run(data, "cat yapay-zekâ").lines), /Yapay zekâ/);
});

test("typos get a suggestion, gibberish does not", () => {
  const typo = run(data, "projelr").lines;
  assert.equal(typo.length, 2);
  assert.match(JSON.stringify(typo[1]), /projeler/);
  assert.equal(run(data, "xqzwv").lines.length, 1);
});

test("completion suggests commands and arguments", () => {
  assert.ok(complete(data, "pro").includes("projeler"));
  assert.deepEqual(complete(data, "open kre"), ["open kredi-turbo"]);
  assert.deepEqual(complete(data, "lang e"), ["lang en", "lang es"]);
});

test("utility commands", () => {
  assert.equal(run(data, "clear").action?.type, "clear");
  assert.equal(run(data, "mail").action?.type, "location");
  assert.equal(run(data, "whatsapp").action?.type, "external");
  assert.deepEqual(run(data, "lang en").action, { type: "location", href: "/en" });
  assert.deepEqual(run(data, "idioma es").action, { type: "location", href: "/es" });
});
