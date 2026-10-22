import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import {
  getDetailedServiceForLocale,
  getServiceSlug,
  serviceKeys,
} from "@/lib/services";
import { v5Href } from "@/components/v5/nav";

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
    <div className="container-site py-16">
      <header className="border-b border-ink-950/20 pb-8">
        <span className="font-mono text-xs text-signal font-semibold uppercase tracking-wider">{service.kicker[lang]}</span>
        <h1 className="mt-3 text-4xl font-extrabold">{service.title[lang]}</h1>
        <p className="mt-4 max-w-3xl text-lg text-stone-600">{service.lead[lang]}</p>
      </header>

      <section className="py-10 border-b border-ink-950/10">
        <h2 className="text-2xl font-bold">{service.targetAudience.title[lang]}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {service.targetAudience.items.map((it, idx) => (
            <div key={idx} className="rounded-xl border border-stone-200 bg-stone-50 p-6">
              <h3 className="font-bold text-lg">{it.title[lang]}</h3>
              <p className="mt-2 text-sm text-stone-600">{it.description[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 border-b border-ink-950/10">
        <h2 className="text-2xl font-bold">{service.process.title[lang]}</h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {service.process.steps.map((st) => (
            <li key={st.step} className="rounded-xl border border-stone-200 p-6">
              <span className="text-2xl font-bold text-signal">{st.step}</span>
              <h3 className="mt-2 font-bold text-lg">{st.title[lang]}</h3>
              <p className="mt-2 text-sm text-stone-600">{st.description[lang]}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="py-10 border-b border-ink-950/10">
        <h2 className="text-2xl font-bold">{service.technologies.title[lang]}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {service.technologies.items.map((t) => (
            <li key={t} className="rounded-full bg-stone-100 px-4 py-2 font-mono text-sm">
              {t}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 flex items-center justify-between">
        <Link href={v5Href(lang, "services")} className="text-sm font-semibold underline">
          ← {dict.servicesPage.title}
        </Link>
        <Link href={v5Href(lang, "contact")} className="rounded-full bg-ink-950 px-6 py-3 font-semibold text-white">
          {dict.v2.ctaButton} →
        </Link>
      </div>
    </div>
  );
}
