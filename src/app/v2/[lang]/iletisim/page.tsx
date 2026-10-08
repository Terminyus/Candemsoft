import type { Metadata } from "next";
import { getSite } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { ContactForm } from "@/components/contact/ContactForm";
import { V2PageHead } from "@/components/v2/V2PageHead";
import { v2Href } from "@/components/v2/nav";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/v2/[lang]/iletisim">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, route: "contact", title: dict.nav.contact, description: dict.meta.siteDescription });
}

export default async function Page({ params }: PageProps<"/v2/[lang]/iletisim">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.contactPage;
  const { contact } = getSite();
  const direct = [
    { k: "E-mail", v: contact.email, h: `mailto:${contact.email}` },
    { k: t.phoneLabel, v: contact.phone, h: `tel:${contact.phoneHref}` },
    { k: "WhatsApp", v: "wa.me/905349334631 ↗", h: contact.whatsapp },
    { k: t.locationLabel, v: contact.city[lang] },
  ];
  return (
    <>
      <V2PageHead kicker={t.label} title={t.title} lead={t.lead} />
      <section className="container-site grid gap-14 py-(--section-sm) lg:grid-cols-[1fr_1.4fr]">
        <dl className="self-start rounded-3xl bg-signal p-6 sm:p-8">
          {direct.map((d) => (
            <div key={d.k} className="border-b border-ink-950/20 py-4 first:pt-0 last:border-0 last:pb-0">
              <dt className="font-mono text-mono-sm">{d.k}</dt>
              <dd className="v2-heading mt-1 break-all text-xl">
                {d.h ? (
                  <a href={d.h} className="hover:underline" {...(d.h.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {d.v}
                  </a>
                ) : (
                  d.v
                )}
              </dd>
            </div>
          ))}
        </dl>
        <ContactForm labels={t.form} locale={lang} email={contact.email} privacyHref={v2Href(lang, "privacy")} />
      </section>
    </>
  );
}
