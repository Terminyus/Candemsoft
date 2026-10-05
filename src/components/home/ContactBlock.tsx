import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";
import type { Dictionary } from "@/lib/dictionary";
import { getSite } from "@/lib/content";
import { ButtonLink } from "@/components/ui/Button";

/** The one large orange surface on the page (DESIGN.md: orange stays rare). */
export function ContactBlock({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { contact } = getSite();
  return (
    <section aria-labelledby="contact-title" className="bg-signal text-ink-950">
      <div className="container-site grid-site gap-y-8 py-(--section)">
        <p className="col-span-full font-mono text-mono-sm">{dict.home.contactLabel}</p>
        <h2 id="contact-title" className="col-span-full font-display-tight text-h1 font-semibold lg:col-span-9">
          {dict.home.contactTitle}
        </h2>
        <p className="col-span-full text-lead lg:col-span-5 lg:col-start-1">{dict.home.contactBody}</p>
        <div className="col-span-full flex flex-wrap gap-3 lg:col-span-6 lg:col-start-7 lg:justify-end lg:self-end">
          <ButtonLink
            href={href(lang, "contact")}
            variant="outline"
            className="border-ink-950 bg-ink-950 text-paper-100 hover:bg-transparent hover:text-ink-950"
          >
            {dict.home.contactForm}
          </ButtonLink>
          <ButtonLink href={contact.whatsapp} variant="outline" arrow="↗" className="border-ink-950/40 hover:border-ink-950">
            {dict.home.contactWhatsapp}
          </ButtonLink>
          <ButtonLink href={`tel:${contact.phoneHref}`} variant="outline" arrow={false} className="border-ink-950/40 hover:border-ink-950">
            {contact.phone}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
