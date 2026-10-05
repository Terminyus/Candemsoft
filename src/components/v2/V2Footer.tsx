import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getSite } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { Logo } from "@/components/ui/Logo";
import { ClassicLink } from "./ClassicLink";
import { v2Href, v2Nav } from "./nav";

export function V2Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { contact } = getSite();
  const t = dict.v2;
  return (
    <footer>
      <section aria-labelledby="v2-cta" className="bg-signal text-ink-950">
        <div className="container-site grid gap-10 py-(--section) lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 id="v2-cta" className="v2-display max-w-[14ch] text-[clamp(2.75rem,1.5rem+5.5vw,7rem)]">
            {t.ctaTitle}
          </h2>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <Link
              href={v2Href(lang, "contact")}
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
        <div className="container-site grid gap-10 py-14 md:grid-cols-[1fr_auto_auto] md:gap-16">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-stone-400">{dict.meta.siteDescription}</p>
          </div>
          <ul className="space-y-2 font-archivo">
            {v2Nav(lang, dict).map((i) => (
              <li key={i.key}>
                <Link href={i.href} className="text-stone-400 hover:text-signal">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-2 font-archivo text-stone-400">
            <li>
              <a href={`tel:${contact.phoneHref}`} className="whitespace-nowrap hover:text-signal">
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-signal">
                WhatsApp ↗
              </a>
            </li>
            <li>{contact.city[lang]}</li>
          </ul>
        </div>
        <div className="container-site flex flex-wrap items-center justify-between gap-4 border-t border-ink-800 py-6 font-mono text-mono-sm text-stone-400">
          <span>
            © {new Date().getFullYear()} Candemsoft · {dict.footer.rights} ·{" "}
            <Link href={v2Href(lang, "privacy")} className="underline underline-offset-4 hover:text-paper-100">
              {dict.nav.privacy}
            </Link>
          </span>
          <span>
            {t.switchDesignHint}{" "}
            <ClassicLink lang={lang} className="text-paper-100 underline underline-offset-4 hover:text-signal">
              {t.switchDesign} →
            </ClassicLink>
          </span>
        </div>
      </div>
    </footer>
  );
}
