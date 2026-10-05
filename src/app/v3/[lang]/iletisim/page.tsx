import type { Metadata } from "next";
import { getSite } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { ContactForm } from "@/components/contact/ContactForm";
import { V3PageHead } from "@/components/v3/V3PageHead";
import { v3Href } from "@/components/v3/nav";

export async function generateMetadata({ params }: PageProps<"/v3/[lang]/iletisim">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).v3.lettersTitle };
}

export default async function Page({ params }: PageProps<"/v3/[lang]/iletisim">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.contactPage;
  const { contact } = getSite();
  return (
    <>
      <V3PageHead kicker={dict.v3.lettersTitle} title={t.title} deck={t.lead} />
      <div className="container-site grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <aside className="self-start border-2 border-news-ink p-5">
          <dl className="space-y-4">
            <div>
              <dt className="v3-kicker text-news-gray">E-mail</dt>
              <dd className="v3-sub text-xl">
                <a href={`mailto:${contact.email}`} className="hover:text-ember">
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="v3-kicker text-news-gray">{t.phoneLabel}</dt>
              <dd className="v3-sub text-xl">
                <a href={`tel:${contact.phoneHref}`} className="hover:text-ember">
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="v3-kicker text-news-gray">WhatsApp</dt>
              <dd className="v3-sub text-xl">
                <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-ember">
                  wa.me/905349334631 ↗
                </a>
              </dd>
            </div>
            <div>
              <dt className="v3-kicker text-news-gray">{t.locationLabel}</dt>
              <dd className="v3-sub text-xl">{contact.city[lang]}</dd>
            </div>
          </dl>
        </aside>
        <ContactForm labels={t.form} locale={lang} email={contact.email} privacyHref={v3Href(lang, "privacy")} />
      </div>
    </>
  );
}
