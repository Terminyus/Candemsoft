import type { Metadata } from "next";
import { href } from "@/i18n/routes";
import { getSite } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/page/PageIntro";
import { ContactForm } from "@/components/contact/ContactForm";
import { MonoLabel } from "@/components/ui/MonoLabel";

export async function generateMetadata({ params }: PageProps<"/[lang]/iletisim">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, route: "contact", title: dict.nav.contact, description: dict.contactPage.lead });
}

export default async function ContactPage({ params }: PageProps<"/[lang]/iletisim">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.contactPage;
  const { contact } = getSite();
  const direct = [
    { label: "E-posta", value: contact.email, href: `mailto:${contact.email}` },
    { label: t.phoneLabel, value: contact.phone, href: `tel:${contact.phoneHref}` },
    { label: "WhatsApp", value: "wa.me/905349334631 ↗", href: contact.whatsapp, external: true },
    { label: t.locationLabel, value: contact.city[lang] },
  ];

  return (
    <>
      <PageIntro label={t.label} title={t.title} lead={t.lead} />
      <section data-surface="paper" aria-label={t.label} className="py-(--section-sm)">
        <div className="container-site grid-site gap-y-14">
          <aside className="col-span-full lg:col-span-4">
            <MonoLabel as="h2">{t.direct}</MonoLabel>
            <dl className="mt-4 border-t border-ink-950">
              {direct.map((d) => (
                <div key={d.label} className="border-b border-paper-200 py-4">
                  <MonoLabel as="dt">{d.label}</MonoLabel>
                  <dd className="mt-1 font-display text-xl font-semibold">
                    {d.href ? (
                      <a
                        href={d.href}
                        className="break-all transition-colors hover:text-ember"
                        {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {d.value}
                      </a>
                    ) : (
                      d.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
          <div className="col-span-full lg:col-span-7 lg:col-start-6">
            <ContactForm labels={t.form} locale={lang} email={contact.email} privacyHref={href(lang, "privacy")} />
          </div>
        </div>
      </section>
    </>
  );
}
