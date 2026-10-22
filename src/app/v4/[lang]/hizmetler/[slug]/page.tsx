import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { getDetailedServiceForLocale, getServiceSlug, serviceKeys } from "@/lib/services";
import { v4Href } from "@/components/v4/nav";

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
    <div className="container-site py-12">
      <header className="border-b border-ink-950 pb-8">
        <span className="font-mono text-xs text-signal uppercase tracking-wider">{service.kicker[lang]}</span>
        <h1 className="mt-2 text-4xl font-bold">{service.title[lang]}</h1>
        <p className="mt-4 max-w-2xl text-stone-600">{service.lead[lang]}</p>
      </header>

      <section className="py-8 border-b border-ink-950/20">
        <h2 className="text-2xl font-bold">{service.targetAudience.title[lang]}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {service.targetAudience.items.map((it, idx) => (
            <div key={idx} className="border border-ink-950/20 p-4 rounded">
              <h3 className="font-bold">{it.title[lang]}</h3>
              <p className="mt-1 text-sm text-stone-600">{it.description[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8 border-b border-ink-950/20">
        <h2 className="text-2xl font-bold">{service.process.title[lang]}</h2>
        <ol className="mt-4 space-y-4">
          {service.process.steps.map((st) => (
            <li key={st.step} className="border-l-2 border-signal pl-4 py-1">
              <strong className="block font-bold">{st.step}. {st.title[lang]}</strong>
              <p className="text-sm text-stone-600">{st.description[lang]}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="py-8 border-b border-ink-950/20">
        <h2 className="text-2xl font-bold">{service.technologies.title[lang]}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {service.technologies.items.map((t) => (
            <span key={t} className="rounded border border-ink-950 px-3 py-1 font-mono text-sm">
              {t}
            </span>
          ))}
        </div>
      </section>

      <div className="mt-8 flex justify-between">
        <Link href={v4Href(lang, "services")} className="font-mono text-sm underline">
          ← {dict.servicesPage.title}
        </Link>
        <Link href={v4Href(lang, "contact")} className="rounded bg-ink-950 px-4 py-2 text-white font-mono text-sm">
          {dict.v2.ctaButton}
        </Link>
      </div>
    </div>
  );
}
