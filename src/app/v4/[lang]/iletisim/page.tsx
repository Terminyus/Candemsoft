import type { Metadata } from "next";
import { getSite } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { ContactForm } from "@/components/contact/ContactForm";
import { V4PageHead } from "@/components/v4/V4PageHead";
import { v4Href } from "@/components/v4/nav";

export async function generateMetadata({ params }: PageProps<"/v4/[lang]/iletisim">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.contact };
}

export default async function Page({ params }: PageProps<"/v4/[lang]/iletisim">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.contactPage;
  const { contact } = getSite();
  return (
    <>
      <V4PageHead path="$ candemsoft contact --new" title={t.title} lead={t.lead} />
      <div className="container-site grid gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <pre className="self-start overflow-x-auto rounded-xl border border-dev-line bg-dev-surface p-5 v4-mono text-sm leading-relaxed">
          <span className="text-dev-key">const</span> <span className="text-dev-fn">contact</span> = {"{"}
          {"\n  "}email: <a href={`mailto:${contact.email}`} className="text-dev-str underline decoration-dev-str/50 underline-offset-4 hover:decoration-dev-str">&quot;{contact.email}&quot;</a>,
          {"\n  "}phone: <a href={`tel:${contact.phoneHref}`} className="text-dev-str underline decoration-dev-str/50 underline-offset-4 hover:decoration-dev-str">&quot;{contact.phone}&quot;</a>,
          {"\n  "}whatsapp: <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="text-dev-str underline decoration-dev-str/50 underline-offset-4 hover:decoration-dev-str">&quot;wa.me/905349334631&quot;</a>,
          {"\n  "}city: <span className="text-dev-str">&quot;{contact.city[lang]}&quot;</span>,
          {"\n}"};
        </pre>
        {/* The shared form is styled for light surfaces: give it a light card here. */}
        <div className="rounded-xl bg-paper-100 p-6 text-ink-950 sm:p-8">
          <ContactForm labels={t.form} locale={lang} email={contact.email} privacyHref={v4Href(lang, "privacy")} />
        </div>
      </div>
    </>
  );
}
