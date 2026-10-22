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
import { V2PageHead } from "@/components/v2/V2PageHead";
import { v2Href } from "@/components/v2/nav";

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

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="container-site pt-6 pb-2">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-mono-sm text-stone-500">
          <li>
            <Link href={v2Href(lang, "home")} className="hover:text-ink-950">
              {breadcrumbLabel(lang, "home")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={v2Href(lang, "services")}
              className="hover:text-ink-950"
            >
              {breadcrumbLabel(lang, "services")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink-950 font-medium" aria-current="page">
            {service.title[lang]}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <V2PageHead
        kicker={`${dict.servicesPage.label} / ${service.kicker[lang]}`}
        title={service.title[lang]}
        lead={service.lead[lang]}
      />

      {/* Target Audience (Kimlere Uygun?) */}
      <section
        aria-labelledby="audience-heading"
        className="container-site py-(--section-sm) border-b border-ink-950"
      >
        <div className="max-w-2xl">
          <span className="font-mono text-mono-sm text-signal font-semibold uppercase tracking-wider">
            {lang === "tr"
              ? "Hedef Kitle & İhtiyaçlar"
              : lang === "es"
                ? "Audiencia y Necesidades"
                : "Target & Use Cases"}
          </span>
          <h2
            id="audience-heading"
            className="v2-heading mt-2 text-[clamp(1.75rem,1.2rem+2vw,2.75rem)]"
          >
            {service.targetAudience.title[lang]}
          </h2>
          <p className="mt-3 text-lead text-stone-600">
            {service.targetAudience.description[lang]}
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {service.targetAudience.items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-ink-950 p-6 flex flex-col justify-between bg-stone-50"
            >
              <div>
                <span className="v2-display text-2xl text-signal">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="v2-heading mt-3 text-lg font-bold">
                  {item.title[lang]}
                </h3>
                <p className="mt-2 text-stone-600 text-sm leading-relaxed">
                  {item.description[lang]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process (Nasıl Çalışıyoruz?) */}
      <section
        aria-labelledby="process-heading"
        className="container-site py-(--section-sm) border-b border-ink-950"
      >
        <div className="max-w-2xl">
          <span className="font-mono text-mono-sm text-signal font-semibold uppercase tracking-wider">
            {lang === "tr"
              ? "Uçtan Uca Süreç"
              : lang === "es"
                ? "Proceso de Trabajo"
                : "Work Process"}
          </span>
          <h2
            id="process-heading"
            className="v2-heading mt-2 text-[clamp(1.75rem,1.2rem+2vw,2.75rem)]"
          >
            {service.process.title[lang]}
          </h2>
          <p className="mt-3 text-lead text-stone-600">
            {service.process.description[lang]}
          </p>
        </div>
        <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {service.process.steps.map((st) => (
            <li
              key={st.step}
              className="border-t border-ink-950 pt-5 flex flex-col"
            >
              <span className="v2-display text-5xl text-signal">{st.step}</span>
              <h3 className="v2-heading mt-3 text-xl font-bold">
                {st.title[lang]}
              </h3>
              <p className="mt-2 text-stone-600 text-sm leading-relaxed">
                {st.description[lang]}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Deliverables (Neler Teslim Ediyoruz?) */}
      <section
        aria-labelledby="deliverables-heading"
        className="container-site py-(--section-sm) border-b border-ink-950"
      >
        <div className="max-w-2xl">
          <span className="font-mono text-mono-sm text-signal font-semibold uppercase tracking-wider">
            {lang === "tr"
              ? "Somut Çıktılar"
              : lang === "es"
                ? "Entregables Concretos"
                : "Deliverables"}
          </span>
          <h2
            id="deliverables-heading"
            className="v2-heading mt-2 text-[clamp(1.75rem,1.2rem+2vw,2.75rem)]"
          >
            {service.deliverables.title[lang]}
          </h2>
          <p className="mt-3 text-lead text-stone-600">
            {service.deliverables.description[lang]}
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {service.deliverables.items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-ink-950/20 bg-stone-50 p-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-signal text-xl font-bold">✓</span>
                <h3 className="v2-heading text-lg font-bold">
                  {item.title[lang]}
                </h3>
              </div>
              <p className="mt-3 text-stone-600 text-sm leading-relaxed">
                {item.description[lang]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technologies (Teknoloji Yığını) */}
      <section
        aria-labelledby="technologies-heading"
        className="container-site py-(--section-sm) border-b border-ink-950"
      >
        <div className="max-w-2xl">
          <span className="font-mono text-mono-sm text-signal font-semibold uppercase tracking-wider">
            {dict.servicesPage.stackLabel}
          </span>
          <h2
            id="technologies-heading"
            className="v2-heading mt-2 text-[clamp(1.75rem,1.2rem+2vw,2.75rem)]"
          >
            {service.technologies.title[lang]}
          </h2>
          <p className="mt-3 text-lead text-stone-600">
            {service.technologies.description[lang]}
          </p>
        </div>
        <ul className="mt-6 flex flex-wrap gap-3">
          {service.technologies.items.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-ink-950 px-5 py-2 v2-heading text-base md:text-lg bg-white"
            >
              {tech}
            </li>
          ))}
        </ul>
      </section>

      {/* Deep Dive (Teknik ve Mimari Derinlik) */}
      <section
        aria-labelledby="deepdive-heading"
        className="container-site py-(--section-sm) border-b border-ink-950"
      >
        <div className="max-w-3xl space-y-12">
          <h2
            id="deepdive-heading"
            className="v2-display text-[clamp(2rem,1.4rem+2.5vw,3.25rem)] text-ink-950"
          >
            {lang === "tr"
              ? "Mimari Standartlarımız ve Teknik İlkelerimiz"
              : lang === "es"
                ? "Nuestros Estándares de Arquitectura y Principios Técnicos"
                : "Our Architecture Standards & Technical Principles"}
          </h2>
          {service.deepDive.sections.map((sec, idx) => (
            <article key={idx} className="space-y-4">
              <h3 className="v2-heading text-2xl font-bold text-ink-950">
                {sec.heading[lang]}
              </h3>
              {sec.paragraphs[lang].map((pText, pIdx) => (
                <p
                  key={pIdx}
                  className="text-stone-700 leading-relaxed text-base md:text-lg"
                >
                  {pText}
                </p>
              ))}
            </article>
          ))}
        </div>
      </section>

      {/* Related Products & Projects (Kendi Ürünlerimiz ve Projelerimiz) */}
      {(relatedProjectsList.length > 0 || relatedProductsList.length > 0) && (
        <section
          aria-labelledby="related-heading"
          className="container-site py-(--section-sm) border-b border-ink-950"
        >
          <div className="max-w-2xl">
            <span className="font-mono text-mono-sm text-signal font-semibold uppercase tracking-wider">
              {lang === "tr"
                ? "Deneyim ve Referanslar"
                : lang === "es"
                  ? "Experiencia y Casos Reales"
                  : "Experience & Track Record"}
            </span>
            <h2
              id="related-heading"
              className="v2-heading mt-2 text-[clamp(1.75rem,1.2rem+2vw,2.75rem)]"
            >
              {lang === "tr"
                ? "İlgili Ürünlerimiz ve Projelerimiz"
                : lang === "es"
                  ? "Nuestros Productos y Proyectos Relacionados"
                  : "Our Related Products & Projects"}
            </h2>
            <p className="mt-3 text-lead text-stone-600">
              {lang === "tr"
                ? "Aynı mühendislik ve mimari titizliği kendi geliştirdiğimiz ürünlerde ve müşteri projelerimizde uyguluyoruz."
                : lang === "es"
                  ? "Aplicamos el mismo rigor de ingeniería y arquitectura en nuestros propios productos y en los proyectos de nuestros clientes."
                  : "We apply the same engineering rigor to our own in-house products and client systems."}
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProjectsList.map((p) => (
              <Link
                key={p.slug}
                href={v2Href(lang, "projects", p.slug)}
                className="group rounded-2xl border border-ink-950 p-6 transition-all hover:bg-stone-50 hover:shadow-md"
              >
                <div className="flex items-center justify-between text-mono-sm font-mono text-stone-500">
                  <span>{p.type[lang]}</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
                <h3 className="v2-heading mt-3 text-xl font-bold group-hover:text-ember">
                  {p.name}
                </h3>
                <p className="mt-2 text-sm text-stone-600 line-clamp-2">
                  {p.summary[lang]}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ (Sıkça Sorulan Sorular) */}
      <section
        aria-labelledby="faq-heading"
        className="container-site py-(--section-sm) border-b border-ink-950"
      >
        <div className="max-w-2xl">
          <span className="font-mono text-mono-sm text-signal font-semibold uppercase tracking-wider">
            {lang === "tr"
              ? "Merak Edilenler"
              : lang === "es"
                ? "Preguntas Frecuentes"
                : "FAQ"}
          </span>
          <h2
            id="faq-heading"
            className="v2-heading mt-2 text-[clamp(1.75rem,1.2rem+2vw,2.75rem)]"
          >
            {lang === "tr"
              ? "Sıkça Sorulan Sorular"
              : lang === "es"
                ? "Preguntas Frecuentes"
                : "Frequently Asked Questions"}
          </h2>
        </div>
        <dl className="mt-8 divide-y divide-ink-950/20">
          {service.faq.map((item, idx) => (
            <div key={idx} className="py-6">
              <dt className="v2-heading text-lg md:text-xl font-bold text-ink-950">
                {item.question[lang]}
              </dt>
              <dd className="mt-3 text-stone-600 leading-relaxed text-base">
                {item.answer[lang]}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CTA Section */}
      <section
        aria-labelledby="cta-heading"
        className="container-site py-(--section)"
      >
        <div className="rounded-3xl bg-ink-950 text-white p-8 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2
              id="cta-heading"
              className="v2-display text-[clamp(2rem,1.5rem+3vw,3.5rem)] text-white"
            >
              {lang === "tr"
                ? "Projenizi birlikte konuşalım"
                : lang === "es"
                  ? "Hablemos de su proyecto"
                  : "Let's discuss your project"}
            </h2>
            <p className="mt-4 text-stone-300 text-lead">
              {lang === "tr"
                ? "İhtiyaçlarınızı, mimari gereksinimlerinizi ve takvimi değerlendirelim. İstanbul merkezli ekibimizle hemen iletişime geçin."
                : lang === "es"
                  ? "Evaluemos sus necesidades, requisitos de arquitectura y cronograma. Póngase en contacto con nuestro equipo con sede en Estambul."
                  : "Let's evaluate your requirements, architectural needs, and roadmap. Contact our Istanbul-based engineering team today."}
            </p>
          </div>
          <Link
            href={v2Href(lang, "contact")}
            className="inline-flex shrink-0 min-h-14 items-center gap-3 rounded-full bg-signal px-8 font-archivo text-lg font-semibold text-ink-950 transition-colors hover:bg-white"
          >
            {dict.v2.ctaButton} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
