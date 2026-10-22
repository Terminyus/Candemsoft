import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { getDetailedServiceForLocale, getServiceSlug, serviceKeys } from "@/lib/services";
import { V3PageHead } from "@/components/v3/V3PageHead";
import { v3Href } from "@/components/v3/nav";

export const dynamicParams = false;

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    serviceKeys.map((k) => ({
      lang,
      slug: getServiceSlug(k, lang),
    })),
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const service = getDetailedServiceForLocale(slug, lang);
  return service ? { title: service.metaTitle[lang] } : {};
}

export default async function Page({
  params,
}: Props) {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const service = getDetailedServiceForLocale(slug, lang);
  if (!service) notFound();

  const dict = await getDictionary(lang);

  return (
    <article className="container-site pt-8 pb-16">
      <V3PageHead
        kicker={`${dict.servicesPage.label} / ${service.kicker[lang]}`}
        title={service.title[lang]}
        deck={service.lead[lang]}
      />
      <div className="mt-8 space-y-12">
        <section>
          <h2 className="v3-headline text-3xl font-bold border-b-2 border-news-ink pb-2">
            {service.targetAudience.title[lang]}
          </h2>
          <p className="mt-4 text-news-gray text-lg">{service.targetAudience.description[lang]}</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {service.targetAudience.items.map((it, idx) => (
              <div key={idx} className="border border-news-ink p-4">
                <h3 className="font-bold text-lg">{it.title[lang]}</h3>
                <p className="mt-2 text-sm text-news-gray">{it.description[lang]}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="v3-headline text-3xl font-bold border-b-2 border-news-ink pb-2">
            {service.process.title[lang]}
          </h2>
          <ol className="mt-6 space-y-4">
            {service.process.steps.map((st) => (
              <li key={st.step} className="border-t border-news-gray/30 pt-3">
                <span className="font-mono text-signal font-bold mr-2">{st.step}.</span>
                <strong className="text-lg">{st.title[lang]}</strong>
                <p className="mt-1 text-news-gray text-sm">{st.description[lang]}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="v3-headline text-3xl font-bold border-b-2 border-news-ink pb-2">
            {service.technologies.title[lang]}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {service.technologies.items.map((t) => (
              <li key={t} className="border border-news-ink px-3 py-1 text-sm font-mono">
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="v3-headline text-3xl font-bold border-b-2 border-news-ink pb-2">
            FAQ
          </h2>
          <dl className="mt-6 space-y-4">
            {service.faq.map((f, idx) => (
              <div key={idx} className="border-t border-news-gray/30 pt-3">
                <dt className="font-bold text-lg">{f.question[lang]}</dt>
                <dd className="mt-1 text-news-gray">{f.answer[lang]}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-10 border-t-2 border-news-ink pt-6 flex justify-between items-center">
          <Link href={v3Href(lang, "services")} className="v3-kicker hover:text-signal">
            ← {dict.servicesPage.title}
          </Link>
          <Link href={v3Href(lang, "contact")} className="v3-kicker bg-news-ink text-news-paper px-6 py-3 hover:bg-signal hover:text-news-ink">
            {dict.v2.ctaButton} →
          </Link>
        </div>
      </div>
    </article>
  );
}
