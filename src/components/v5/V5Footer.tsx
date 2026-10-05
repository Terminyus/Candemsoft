import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getProducts, getServices, getSite } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { Logo } from "@/components/ui/Logo";
import { OtherDesigns } from "@/components/v3/OtherDesigns";
import { v5Href } from "./nav";

export function V5Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.v5;
  const { contact } = getSite();
  const cols = [
    {
      title: t.footerCompany,
      links: (["about", "team", "projects", "blog"] as const).map((k) => ({ l: dict.nav[k], h: v5Href(lang, k) })),
    },
    { title: t.footerSolutions, links: getServices().map((s) => ({ l: s.title[lang], h: `${v5Href(lang, "services")}#${s.slug}` })) },
    { title: t.footerProducts, links: getProducts().map((p) => ({ l: p.name, h: `${v5Href(lang, "products")}#${p.slug}` })) },
  ];
  return (
    <footer className="bg-corp-ink text-white">
      <div className="container-site grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-white/70">{t.footerAbout}</p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="text-sm font-semibold text-white">{c.title}</h2>
            <ul className="mt-4 space-y-2.5 text-white/70">
              {c.links.map((x) => (
                <li key={x.h}>
                  <Link href={x.h} className="hover:text-white">
                    {x.l}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <h2 className="text-sm font-semibold">{t.footerContact}</h2>
          <ul className="mt-4 space-y-2.5 text-white/70">
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-white">
                {contact.email}
              </a>
            </li>
            <li>
              <a href={`tel:${contact.phoneHref}`} className="hover:text-white">
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp ↗
              </a>
            </li>
            <li>{contact.city[lang]}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-wrap items-center justify-between gap-4 py-5 text-sm text-white/60">
          <span>
            © {new Date().getFullYear()} Candemsoft · {dict.footer.rights} ·{" "}
            <Link href={v5Href(lang, "privacy")} className="underline underline-offset-4 hover:text-white">
              {dict.nav.privacy}
            </Link>
          </span>
          <span className="[&_a]:text-white [&_p]:font-[inherit] [&_p]:text-sm [&_p]:tracking-normal">
            <OtherDesigns lang={lang} current="v5" t={dict.v3} />
          </span>
        </div>
      </div>
    </footer>
  );
}
