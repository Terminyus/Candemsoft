import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getProducts, getServices, getSite } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { Logo } from "@/components/ui/Logo";
import { v2Href, v2Nav } from "./nav";

const networks: [string, string][] = [
  ["instagram.com", "Instagram"],
  ["linkedin.com", "LinkedIn"],
  ["tiktok.com", "TikTok"],
  ["youtube.com", "YouTube"],
  ["github.com", "GitHub"],
];
const networkName = (url: string) => networks.find(([host]) => url.includes(host))?.[1] ?? new URL(url).hostname;

/** Company profiles first, then each product's own profiles. */
function socialLinks() {
  const links = Object.values(getSite().social)
    .filter(Boolean)
    .map((url) => ({ url, label: networkName(url) }));
  for (const p of getProducts()) for (const url of p.social ?? []) links.push({ url, label: `${p.name} · ${networkName(url)}` });
  return links;
}

export function V2Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { contact } = getSite();
  const t = dict.v2;
  const social = socialLinks();
  return (
    <footer className="cv-auto-footer">
      <section aria-labelledby="v2-cta" className="bg-signal text-ink-950">
        <div className="container-site grid gap-10 py-(--section) lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 id="v2-cta" className="v2-display max-w-[14ch] text-[clamp(2.75rem,1.5rem+5.5vw,7rem)]">
            {t.ctaTitle}
          </h2>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <Link
              href={v2Href(lang, "contact")}
              prefetch={false}
              className="inline-flex min-h-14 items-center gap-4 rounded-full bg-ink-950 px-8 font-archivo text-lg font-semibold text-white transition-colors hover:bg-white hover:text-ink-950"
            >
              {t.ctaButton} <span aria-hidden>→</span>
            </Link>
            <a href={`mailto:${contact.email}`} className="font-archivo text-xl font-semibold underline decoration-2 underline-offset-4">
              {contact.email}
            </a>
          </div>
        </div>
      </section>
      <div className="bg-ink-950 text-paper-100">
        <div className="container-site grid gap-10 py-14 md:grid-cols-[1.2fr_auto_auto_auto_auto] md:gap-10 lg:gap-14">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-stone-400">{dict.meta.siteDescription}</p>
          </div>
          <ul className="space-y-2 font-archivo">
            <li className="font-mono text-mono-sm text-stone-300 font-semibold mb-3">
              {dict.nav.services}
            </li>
            {getServices().map((s) => (
              <li key={s.slug}>
                <Link href={v2Href(lang, "services", s.slug)} prefetch={false} className="text-stone-400 hover:text-signal text-sm">
                  {s.title[lang]}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-2 font-archivo">
            <li className="font-mono text-mono-sm text-stone-300 font-semibold mb-3">
              {dict.nav.tools}
            </li>
            <li>
              <Link href={v2Href(lang, "tools", "metin-buyuk-kucuk-harf")} prefetch={false} className="text-stone-400 hover:text-signal text-sm">
                {lang === "tr" ? "Büyük/Küçük Harf" : lang === "es" ? "Mayúsculas/Minúsculas" : "Case Converter"}
              </Link>
            </li>
            <li>
              <Link href={v2Href(lang, "tools", "kelime-karakter-sayaci")} prefetch={false} className="text-stone-400 hover:text-signal text-sm">
                {lang === "tr" ? "Kelime & Karakter Sayacı" : lang === "es" ? "Contador de Palabras" : "Character Counter"}
              </Link>
            </li>
            <li>
              <Link href={v2Href(lang, "tools", "slug-ascii-donusturucu")} prefetch={false} className="text-stone-400 hover:text-signal text-sm">
                {lang === "tr" ? "Slug & ASCII Üretici" : lang === "es" ? "Generador de Slug" : "Slug Generator"}
              </Link>
            </li>
          </ul>
          <ul className="space-y-2 font-archivo">
            <li className="font-mono text-mono-sm text-stone-300 font-semibold mb-3">
              {dict.footer.sitemap}
            </li>
            {v2Nav(lang, dict).map((i) => (
              <li key={i.key}>
                <Link href={i.href} prefetch={false} className="text-stone-400 hover:text-signal text-sm">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-2 font-archivo text-stone-400">
            <li className="font-mono text-mono-sm text-stone-300 font-semibold mb-3">
              {dict.footer.reach}
            </li>
            <li>
              <a href={`tel:${contact.phoneHref}`} className="whitespace-nowrap hover:text-signal text-sm">
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-signal text-sm">
                WhatsApp ↗
              </a>
            </li>
            <li className="text-sm">{contact.city[lang]}</li>
          </ul>
        </div>
        <ul className="container-site flex flex-wrap gap-x-6 gap-y-2 border-t border-ink-800 py-6 font-archivo text-stone-400">
          {social.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noopener noreferrer me" className="hover:text-signal">
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
        <div className="container-site flex flex-wrap items-center justify-between gap-4 border-t border-ink-800 py-6 font-mono text-mono-sm text-stone-400">
          <span>
            © {new Date().getFullYear()} Candemsoft · {dict.footer.rights} ·{" "}
            <Link href={v2Href(lang, "privacy")} prefetch={false} className="underline underline-offset-4 hover:text-paper-100">
              {dict.nav.privacy}
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
