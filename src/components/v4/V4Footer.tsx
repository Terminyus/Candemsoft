import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getSite } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { getHead } from "@/lib/build-info";
import { formatDate } from "@/lib/format";
import { Logo } from "@/components/ui/Logo";
import { OtherDesigns } from "@/components/v3/OtherDesigns";
import { v4Href, v4Nav } from "./nav";

export function V4Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { contact } = getSite();
  const head = getHead();
  return (
    <footer className="mt-(--section) border-t border-dev-line">
      <div className="container-site grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-dev-muted">{dict.meta.siteDescription}</p>
        </div>
        <ul className="space-y-2 v4-mono text-sm">
          {v4Nav(lang, dict).map((i) => (
            <li key={i.key}>
              <Link href={i.href} className="text-dev-muted hover:text-signal">
                ./{i.label.toLocaleLowerCase(lang)}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="space-y-2 v4-mono text-sm text-dev-muted">
          <li>
            <a href={`mailto:${contact.email}`} className="hover:text-signal">
              {contact.email}
            </a>
          </li>
          <li>
            <a href={`tel:${contact.phoneHref}`} className="hover:text-signal">
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
      <div className="container-site flex flex-wrap items-center justify-between gap-4 border-t border-dev-line py-5 v4-mono text-xs text-dev-comment">
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2 rounded-full bg-dev-str" />
          {dict.v4.builtAt}: {head.date ? formatDate(head.date, lang) : "—"}
          {head.hash && <span className="text-dev-tag">#{head.hash}</span>}
          <span>·</span>
          <Link href={v4Href(lang, "privacy")} className="underline underline-offset-4 hover:text-signal">
            {dict.nav.privacy}
          </Link>
        </span>
        <span className="[&_a]:text-dev-text [&_p]:font-[inherit] [&_p]:text-xs [&_p]:tracking-normal">
          <OtherDesigns lang={lang} label={dict.v3.otherDesigns} classic={dict.v3.classic} vitrin={dict.v3.vitrin} />
        </span>
      </div>
    </footer>
  );
}
