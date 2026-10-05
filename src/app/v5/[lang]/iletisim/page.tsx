import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V5PageHead } from "@/components/v5/V5PageHead";

export async function generateMetadata({ params }: PageProps<"/v5/[lang]/iletisim">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.contact };
}
import { getSite } from "@/lib/content";
import { ContactForm } from "@/components/contact/ContactForm";
import { v5Href } from "@/components/v5/nav";

export default async function Page({ params }: PageProps<"/v5/[lang]/iletisim">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.contactPage;
  const { contact } = getSite();
  const rows = [
    { k: t.form.email, v: contact.email, href: `mailto:${contact.email}` },
    { k: t.form.phone, v: contact.phone, href: `tel:${contact.phoneHref}` },
    { k: "WhatsApp", v: "wa.me/905349334631", href: contact.whatsapp, ext: true },
    { k: dict.v5.location, v: contact.city[lang] },
  ];
  return (
    <>
      <V5PageHead lang={lang} dict={dict} title={t.title} lead={t.lead} />
      <div className="container-site grid gap-10 py-(--section) lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <aside className="self-start rounded-2xl bg-corp-ink p-7 text-white">
          <h2 className="text-xl font-bold">{dict.v5.footerContact}</h2>
          <dl className="mt-5 space-y-4">
            {rows.map((r) => (
              <div key={r.k}>
                <dt className="text-sm text-white/65">{r.k}</dt>
                <dd className="mt-0.5 text-lg font-semibold">
                  {r.href ? (
                    <a href={r.href} {...(r.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="underline decoration-white/40 underline-offset-4 hover:decoration-signal">
                      {r.v}
                    </a>
                  ) : (
                    r.v
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
        <div className="rounded-2xl border border-corp-line p-6 sm:p-8">
          <ContactForm labels={t.form} locale={lang} email={contact.email} privacyHref={v5Href(lang, "privacy")} />
        </div>
      </div>
    </>
  );
}
