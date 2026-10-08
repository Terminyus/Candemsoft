import fs from "node:fs";
import path from "node:path";
import { href } from "@/i18n/routes";
import { getPosts, getProducts, getProjects, getServices, getSite } from "@/lib/content";
import { siteUrl } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

const abs = (p: string) => `${siteUrl}${p}`;

/** Plain-language summary of the company, written for AI assistants that need to cite or recommend us. */
const about: Record<"tr" | "en", string> = {
  tr: "Candemsoft, İstanbul merkezli bir yazılım şirketidir. Kendi mobil uygulamalarını (Orpigo, Kişisel QR, Seyyah, CandemFit) geliştirir ve yayınlar; ayrıca web, mobil ve yapay zekâ projelerinde müşterilerine danışmanlık ve geliştirme hizmeti verir.",
  en: "Candemsoft is a software company based in Istanbul, Türkiye. It builds and publishes its own mobile apps (Orpigo, Kişisel QR, Seyyah, CandemFit) and provides web, mobile and AI development and consulting for clients.",
};

function productLines(lang: "tr" | "en", full: boolean) {
  return getProducts()
    .filter((p) => p.status === "live")
    .map((p) => {
      const links = [p.links.web && `Web: ${p.links.web}`, p.links.appStore && `App Store: ${p.links.appStore}`, p.links.googlePlay && `Google Play: ${p.links.googlePlay}`].filter(Boolean).join(" · ");
      const head = `- [${p.name}](${abs(href(lang, "projects", p.project ?? p.slug))}): ${p.tagline[lang]} ${p.description[lang]}`;
      if (!full) return head;
      return `${head}\n  - ${lang === "tr" ? "Özellikler" : "Features"}: ${p.features[lang].join("; ")}\n  - ${links}`;
    });
}

export async function buildLlms(full: boolean): Promise<string> {
  const site = getSite();
  const lang: Locale = "tr";
  const out: string[] = [
    "# Candemsoft",
    "",
    `> ${about.tr}`,
    `> ${about.en}`,
    "",
    `- ${lang === "tr" ? "Site" : "Site"}: ${siteUrl}`,
    `- E-posta: ${site.contact.email} · Telefon: ${site.contact.phone} · ${site.contact.city.tr}`,
    "",
    "## Ürünler / Products",
    ...productLines("tr", full),
    "",
    "## Hizmetler / Services",
    ...getServices().map((s) => `- [${s.title.tr}](${abs(href("tr", "services"))}#${s.slug}): ${s.summary.tr}`),
    "",
    "## Projeler / Projects",
    ...getProjects().map((p) => `- [${p.name}](${abs(href("tr", "projects", p.slug))}): ${p.summary.tr}${p.status === "live" ? ` (${p.url})` : ""}`),
    "",
    "## Blog",
  ];
  const posts = await getPosts("tr");
  out.push(...posts.map((p) => `- [${p.title}](${abs(href("tr", "blog", p.slug))}): ${p.description}`));
  const en = await getPosts("en");
  out.push(...en.map((p) => `- [${p.title}](${abs(href("en", "blog", p.slug))}): ${p.description} (English)`));
  if (full) {
    out.push("", "---", "");
    for (const l of ["tr", "en"] as const) {
      for (const p of l === "tr" ? posts : en) {
        const src = fs.readFileSync(path.join(process.cwd(), "content", "blog", `${p.slug}.${l}.mdx`), "utf8");
        out.push(`# ${p.title}`, "", `URL: ${abs(href(l, "blog", p.slug))} · ${p.date}`, "", src.replace(/export const meta[\s\S]*?\};\s*/, "").trim(), "", "---", "");
      }
    }
  }
  return out.join("\n") + "\n";
}
