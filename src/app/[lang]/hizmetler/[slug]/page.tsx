import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { getProductByProject, getProjects } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLd,
  mergeJsonLd,
  pageMetadata,
  serviceJsonLd,
  siteUrl,
} from "@/lib/seo";
import {
  getDetailedServiceForLocale,
  getServiceSlug,
  serviceKeys,
} from "@/lib/services";
import { PageIntro } from "@/components/page/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";

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
  if (!service) return {};
  return pageMetadata({
    lang,
    route: "services",
    rest: [service.key],
    title: service.metaTitle[lang],
    description: service.metaDescription[lang],
  });
}

function breadcrumbLabel(lang: Locale, key: "home" | "services"): string {
  if (key === "home") {
    if (lang === "tr") return "Ana Sayfa";
    if (lang === "es") return "Inicio";
    return "Home";
  }
  if (lang === "tr") return "Hizmetler";
  if (lang === "es") return "Servicios";
  return "Services";
}

export default async function Page({
  params,
}: Props) {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const service = getDetailedServiceForLocale(slug, lang);
  if (!service) notFound();

  const dict = await getDictionary(lang);
  const serviceUrl = `${siteUrl}${href(lang, "services", service.key)}`;
  const homeUrl = `${siteUrl}${href(lang, "home")}`;
  const servicesUrl = `${siteUrl}${href(lang, "services")}`;

  const relatedProjectsList = getProjects().filter(
    (p) =>
      service.relatedProjects.includes(p.slug) ||
      p.services.includes(service.key),
  );

  const relatedProductsList = (service.relatedProducts || [])
    .map((prodSlug) => getProductByProject(prodSlug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const breadcrumbs = [
    { name: breadcrumbLabel(lang, "home"), url: homeUrl },
    { name: breadcrumbLabel(lang, "services"), url: servicesUrl },
    { name: service.title[lang], url: serviceUrl },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          mergeJsonLd(
            serviceJsonLd(
              lang,
              service.title[lang],
              service.metaDescription[lang],
              serviceUrl,
            ),
            faqJsonLd(
              service.faq.map((f) => ({
                question: f.question[lang],
                answer: f.answer[lang],
              })),
            ),
            breadcrumbJsonLd(breadcrumbs),
          ),
        )}
      />

      <div className="container-site pt-6 pb-2">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-mono-sm text-stone-400">
            <li>
              <Link href={href(lang, "home")} className="hover:text-paper-100">
                {breadcrumbLabel(lang, "home")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={href(lang, "services")} className="hover:text-paper-100">
                {breadcrumbLabel(lang, "services")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-paper-100" aria-current="page">
              {service.title[lang]}
            </li>
          </ol>
        </nav>
      </div>

      <PageIntro
        label={`${dict.servicesPage.label} / ${service.kicker[lang]}`}
        title={service.title[lang]}
        lead={service.lead[lang]}
      />

      {/* Target Audience */}
      <section
        data-surface="paper"
        aria-labelledby="audience-heading"
        className="border-b border-paper-200 py-(--section-sm)"
      >
        <div className="container-site grid-site gap-y-8">
          <div className="col-span-full lg:col-span-4">
            <MonoLabel as="p">
              {lang === "tr" ? "HEDEF KİTLE" : lang === "es" ? "AUDIENCIA" : "TARGET"}
            </MonoLabel>
            <h2 id="audience-heading" className="mt-3 text-h2">
              {service.targetAudience.title[lang]}
            </h2>
            <p className="mt-4 text-lead text-stone-600">
              {service.targetAudience.description[lang]}
            </p>
          </div>
          <div className="col-span-full lg:col-span-8 grid gap-6 sm:grid-cols-2">
            {service.targetAudience.items.map((item, idx) => (
              <div key={idx} className="border border-paper-200 p-6">
                <span className="font-mono text-mono-sm text-signal">0{idx + 1}</span>
                <h3 className="mt-2 text-xl font-bold">{item.title[lang]}</h3>
                <p className="mt-2 text-sm text-stone-600">{item.description[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section
        data-surface="paper"
        aria-labelledby="process-heading"
        className="border-b border-paper-200 py-(--section-sm)"
      >
        <div className="container-site grid-site gap-y-8">
          <div className="col-span-full lg:col-span-4">
            <MonoLabel as="p">
              {lang === "tr" ? "SÜREÇ" : lang === "es" ? "PROCESO" : "PROCESS"}
            </MonoLabel>
            <h2 id="process-heading" className="mt-3 text-h2">
              {service.process.title[lang]}
            </h2>
            <p className="mt-4 text-lead text-stone-600">
              {service.process.description[lang]}
            </p>
          </div>
          <ol className="col-span-full lg:col-span-8 space-y-6">
            {service.process.steps.map((st) => (
              <li key={st.step} className="border-t border-ink-950 pt-4 grid gap-4 sm:grid-cols-[4rem_1fr]">
                <span className="font-display text-4xl font-extrabold text-signal">{st.step}</span>
                <div>
                  <h3 className="text-xl font-bold">{st.title[lang]}</h3>
                  <p className="mt-2 text-stone-600 text-sm leading-relaxed">{st.description[lang]}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Deliverables */}
      <section
        data-surface="paper"
        aria-labelledby="deliverables-heading"
        className="border-b border-paper-200 py-(--section-sm)"
      >
        <div className="container-site grid-site gap-y-8">
          <div className="col-span-full lg:col-span-4">
            <MonoLabel as="p">
              {lang === "tr" ? "TESLİMATLAR" : lang === "es" ? "ENTREGABLES" : "DELIVERABLES"}
            </MonoLabel>
            <h2 id="deliverables-heading" className="mt-3 text-h2">
              {service.deliverables.title[lang]}
            </h2>
            <p className="mt-4 text-lead text-stone-600">
              {service.deliverables.description[lang]}
            </p>
          </div>
          <div className="col-span-full lg:col-span-8 grid gap-4 sm:grid-cols-2">
            {service.deliverables.items.map((deliv, idx) => (
              <div key={idx} className="border-l-2 border-signal pl-4 py-2">
                <h3 className="font-bold text-lg">{deliv.title[lang]}</h3>
                <p className="mt-1 text-sm text-stone-600">{deliv.description[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive */}
      <section
        data-surface="paper"
        aria-labelledby="deepdive-heading"
        className="border-b border-paper-200 py-(--section-sm)"
      >
        <div className="container-site max-w-4xl space-y-10">
          <h2 id="deepdive-heading" className="text-h2">
            {lang === "tr"
              ? "Mühendislik Standartlarımız ve Teknik İlkeler"
              : lang === "es"
                ? "Nuestros Estándares de Ingeniería y Principios Técnicos"
                : "Engineering Standards & Technical Principles"}
          </h2>
          {service.deepDive.sections.map((sec, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-2xl font-bold">{sec.heading[lang]}</h3>
              {sec.paragraphs[lang].map((p, pIdx) => (
                <p key={pIdx} className="text-stone-700 leading-relaxed text-base md:text-lg">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Technologies */}
      <section data-surface="ink" aria-labelledby="stack-heading" className="py-(--section-sm)">
        <div className="container-site grid-site gap-y-6">
          <MonoLabel as="h2" className="col-span-full">
            <span id="stack-heading">{service.technologies.title[lang]}</span>
          </MonoLabel>
          <ul className="col-span-full flex flex-wrap gap-x-[0.4em] font-display-tight text-h2 font-extrabold">
            {service.technologies.items.map((tech, i, all) => (
              <li key={tech}>
                {tech}
                {i < all.length - 1 && <span className="text-ink-600"> /</span>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related Projects / Products */}
      {(relatedProjectsList.length > 0 || relatedProductsList.length > 0) && (
        <section data-surface="paper" aria-labelledby="related-heading" className="border-b border-paper-200 py-(--section-sm)">
          <div className="container-site grid-site gap-y-6">
            <MonoLabel as="h2" className="col-span-full">
              <span id="related-heading">
                {lang === "tr" ? "İLGİLİ PROJELER VE ÜRÜNLER" : lang === "es" ? "PROYECTOS Y PRODUCTOS" : "PROJECTS & PRODUCTS"}
              </span>
            </MonoLabel>
            <div className="col-span-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjectsList.map((p) => (
                <Link
                  key={p.slug}
                  href={href(lang, "projects", p.slug)}
                  className="border border-paper-200 p-6 transition-colors hover:border-ink-950"
                >
                  <p className="font-mono text-mono-sm text-stone-500">{p.type[lang]}</p>
                  <h3 className="mt-2 text-xl font-bold">{p.name}</h3>
                  <p className="mt-2 text-sm text-stone-600 line-clamp-2">{p.summary[lang]}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section data-surface="paper" aria-labelledby="faq-heading" className="border-b border-paper-200 py-(--section-sm)">
        <div className="container-site max-w-4xl">
          <MonoLabel as="p">
            {lang === "tr" ? "MERAK EDİLENLER" : lang === "es" ? "PREGUNTAS" : "FAQ"}
          </MonoLabel>
          <h2 id="faq-heading" className="mt-3 text-h2">
            {lang === "tr" ? "Sıkça Sorulan Sorular" : lang === "es" ? "Preguntas Frecuentes" : "Frequently Asked Questions"}
          </h2>
          <dl className="mt-8 space-y-6">
            {service.faq.map((item, idx) => (
              <div key={idx} className="border-t border-paper-200 pt-6">
                <dt className="text-xl font-bold">{item.question[lang]}</dt>
                <dd className="mt-3 text-stone-600 leading-relaxed text-base">{item.answer[lang]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section data-surface="ink" aria-labelledby="cta-heading" className="py-(--section)">
        <div className="container-site grid-site gap-y-6">
          <div className="col-span-full lg:col-span-8">
            <h2 id="cta-heading" className="font-display text-[clamp(2.5rem,1.8rem+4vw,5rem)] font-extrabold leading-tight">
              {lang === "tr"
                ? "Projenizi birlikte konuşalım"
                : lang === "es"
                  ? "Hablemos de su proyecto"
                  : "Let's discuss your project"}
            </h2>
            <p className="mt-4 max-w-xl text-lead text-stone-400">
              {lang === "tr"
                ? "İstanbul merkezli yazılım ekibimizle hedeflerinizi değerlendirelim."
                : lang === "es"
                  ? "Evaluemos sus objetivos con nuestro equipo de ingeniería con sede en Estambul."
                  : "Let's evaluate your goals with our Istanbul-based software team."}
            </p>
          </div>
          <div className="col-span-full lg:col-span-4 lg:self-center lg:justify-self-end">
            <ButtonLink href={href(lang, "contact")}>
              {dict.servicesPage.cta}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
