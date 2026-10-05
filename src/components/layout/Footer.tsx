import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/lib/dictionary";
import { getSite } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { MonoLabel } from "@/components/ui/MonoLabel";
import type { NavItem } from "./Header";

export function Footer({ lang, dict, items }: { lang: Locale; dict: Dictionary; items: NavItem[] }) {
  const site = getSite();
  const { contact } = site;
  const year = new Date().getFullYear();
  return (
    <footer data-surface="ink" className="border-t border-ink-800 pb-8 pt-(--section-sm)">
      <div className="container-site">
        <div className="grid-site gap-y-12">
          <div className="col-span-full lg:col-span-7">
            <MonoLabel as="p">{dict.footer.lead}</MonoLabel>
            <a
              href={`mailto:${contact.email}`}
              className="mt-4 inline-block break-all font-display text-h2 font-semibold transition-colors duration-(--duration-1) hover:text-signal"
            >
              {contact.email}
            </a>
          </div>

          <div className="col-span-2 lg:col-span-2 lg:col-start-9">
            <MonoLabel as="p">{dict.footer.sitemap}</MonoLabel>
            <ul className="mt-4 space-y-2">
              {items.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="text-stone-400 transition-colors hover:text-paper-100">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-2">
            <MonoLabel as="p">{dict.footer.reach}</MonoLabel>
            <ul className="mt-4 space-y-2">
              <li>
                <a href={`tel:${contact.phoneHref}`} className="whitespace-nowrap text-stone-400 transition-colors hover:text-paper-100">
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 transition-colors hover:text-paper-100"
                >
                  WhatsApp ↗
                </a>
              </li>
              <li className="text-stone-400">{contact.city[lang]}</li>
            </ul>
          </div>
        </div>

        <div className="mt-(--section-sm) flex flex-wrap items-end justify-between gap-6 border-t border-ink-800 pt-6">
          <Logo className="h-6 md:h-6" />
          <p className="font-mono text-mono-sm text-stone-400">
            © {year} Candemsoft · {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
