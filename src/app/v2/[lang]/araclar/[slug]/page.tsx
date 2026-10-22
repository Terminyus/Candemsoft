import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { getProductByProject } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLd,
  mergeJsonLd,
  pageMetadata,
  siteUrl,
  webApplicationJsonLd,
} from "@/lib/seo";
import {
  getToolForLocale,
  getToolSlug,
  toolKeys,
} from "@/lib/tools";
import { V2PageHead } from "@/components/v2/V2PageHead";
import { v2Href } from "@/components/v2/nav";
import { CaseConverterTool } from "@/components/tools/CaseConverterTool";
import { TextCounterTool } from "@/components/tools/TextCounterTool";
import { SlugGeneratorTool } from "@/components/tools/SlugGeneratorTool";

export const dynamicParams = false;

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    toolKeys.map((k) => ({
      lang,
      slug: getToolSlug(k, lang),
    })),
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const tool = getToolForLocale(slug, lang);
  if (!tool) return {};
  return pageMetadata({
    lang,
    route: "tools",
    rest: [tool.key],
    title: tool.metaTitle[lang],
    description: tool.metaDescription[lang],
  });
}

function breadcrumbLabel(lang: Locale, key: "home" | "tools"): string {
  if (key === "home") {
    if (lang === "tr") return "Ana Sayfa";
    if (lang === "es") return "Inicio";
    return "Home";
  }
  if (lang === "tr") return "Araçlar";
  if (lang === "es") return "Herramientas";
  return "Tools";
}

export default async function ToolDetailPage({ params }: Props) {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const tool = getToolForLocale(slug, lang);
  if (!tool) notFound();

  const dict = await getDictionary(lang);
  const toolUrl = `${siteUrl}${href(lang, "tools", tool.key)}`;
  const homeUrl = `${siteUrl}${href(lang, "home")}`;
  const toolsUrl = `${siteUrl}${href(lang, "tools")}`;

  const candemkeyProduct = getProductByProject("candemkey");
  const orpigoProduct = getProductByProject("orpigo");

  const breadcrumbs = [
    { name: breadcrumbLabel(lang, "home"), url: homeUrl },
    { name: breadcrumbLabel(lang, "tools"), url: toolsUrl },
    { name: tool.title[lang], url: toolUrl },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          mergeJsonLd(
            webApplicationJsonLd(
              lang,
              tool.title[lang],
              tool.metaDescription[lang],
              toolUrl,
            ),
            faqJsonLd(
              tool.faq.map((f) => ({
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
            <Link href={v2Href(lang, "tools")} className="hover:text-ink-950">
              {breadcrumbLabel(lang, "tools")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink-950 font-medium" aria-current="page">
            {tool.title[lang]}
          </li>
        </ol>
      </nav>

      {/* Header with single H1 */}
      <V2PageHead
        kicker={`${dict.toolsPage.label} / ${tool.kicker[lang]}`}
        title={tool.title[lang]}
        lead={tool.lead[lang]}
      />

      {/* Interactive Tool Container */}
      <section aria-label={tool.title[lang]} className="container-site pb-14">
        {tool.key === "metin-buyuk-kucuk-harf" && <CaseConverterTool lang={lang} />}
        {tool.key === "kelime-karakter-sayaci" && <TextCounterTool lang={lang} />}
        {tool.key === "slug-ascii-donusturucu" && <SlugGeneratorTool lang={lang} />}
      </section>

      {/* In-depth 400+ Words Article Section */}
      <section
        aria-labelledby="article-heading"
        className="container-site border-t border-ink-950 py-(--section-sm)"
      >
        <div className="max-w-3xl">
          <span className="font-mono text-mono-sm font-semibold uppercase tracking-wider text-signal">
            {lang === "tr"
              ? "Teknik Kılavuz ve İpuçları"
              : lang === "es"
                ? "Guía Técnica y Consejos"
                : "Technical Guide & Insights"}
          </span>
          <h2
            id="article-heading"
            className="v2-heading mt-2 text-[clamp(1.75rem,1.2rem+2vw,2.75rem)]"
          >
            {tool.article.title[lang]}
          </h2>

          <div className="mt-8 space-y-10 text-stone-700 leading-relaxed text-base md:text-lg">
            {tool.article.sections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-4">
                <h3 className="v2-heading text-xl md:text-2xl font-bold text-ink-950 pt-2">
                  {section.heading[lang]}
                </h3>
                {section.paragraphs[lang].map((pText, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {pText}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product & Blog Links Section */}
      <section
        aria-labelledby="related-heading"
        className="container-site border-t border-ink-950 py-(--section-sm)"
      >
        <div className="max-w-2xl">
          <span className="font-mono text-mono-sm font-semibold uppercase tracking-wider text-signal">
            {lang === "tr"
              ? "İlgili Ürün ve Rehberlerimiz"
              : lang === "es"
                ? "Productos y Guías Relacionados"
                : "Related Products & Guides"}
          </span>
          <h2
            id="related-heading"
            className="v2-heading mt-2 text-[clamp(1.75rem,1.2rem+2vw,2.75rem)]"
          >
            {lang === "tr"
              ? "Daha Fazla Mühendislik Çözümü"
              : lang === "es"
                ? "Más Soluciones de Ingeniería"
                : "Explore Our Software Solutions"}
          </h2>
          <p className="mt-3 text-lead text-stone-600">
            {lang === "tr"
              ? "Türkçe dil desteği, yapay zekâ entegrasyonu ve dijital metin işleme vizyonumuzla geliştirdiğimiz ürünler ve teknik yazılarımız."
              : lang === "es"
                ? "Descubra nuestros productos internos y análisis técnicos sobre localización, IA y desarrollo web."
                : "Discover our in-house products and engineering deep dives covering Turkish localization, AI, and web optimization."}
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Blog Post Link */}
          <Link
            href={v2Href(lang, "blog", tool.relatedBlogSlug)}
            className="group rounded-2xl border border-ink-950 p-6 transition-all hover:bg-stone-50 hover:shadow-md"
          >
            <div className="flex items-center justify-between font-mono text-mono-sm text-stone-500">
              <span>{lang === "tr" ? "Blog Rehberi" : lang === "es" ? "Artículo" : "Blog Article"}</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
            <h3 className="v2-heading mt-3 text-xl font-bold group-hover:text-ember">
              {lang === "tr"
                ? "Türkçe Büyük İ ve I Kuralları Rehberi"
                : lang === "es"
                  ? "Guía de Mayúsculas en Turco: İ e ı"
                  : "Turkish Uppercase & Dotless I Guide"}
            </h3>
            <p className="mt-2 text-sm text-stone-600 line-clamp-3">
              {lang === "tr"
                ? "Web sitelerinde toUpperCase ve CSS text-transform kullanımında Türkçe karakterlerin bozulma nedenleri ve kalıcı çözümleri."
                : lang === "es"
                  ? "Por qué fallan las mayúsculas en turco y cómo resolver problemas de localización en frontend y bases de datos."
                  : "Why standard casing fails on Turkish dotted and dotless letters, with concrete JavaScript and database solutions."}
            </p>
          </Link>

          {/* Candemkey Link */}
          {candemkeyProduct && (
            <Link
              href={v2Href(lang, "products", "candemkey")}
              className="group rounded-2xl border border-ink-950 p-6 transition-all hover:bg-stone-50 hover:shadow-md"
            >
              <div className="flex items-center justify-between font-mono text-mono-sm text-stone-500">
                <span>{lang === "tr" ? "Yapay Zekâ Klavyesi" : lang === "es" ? "Teclado IA" : "AI Keyboard"}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
              <h3 className="v2-heading mt-3 text-xl font-bold group-hover:text-ember">
                Candemkey
              </h3>
              <p className="mt-2 text-sm text-stone-600 line-clamp-3">
                {candemkeyProduct.description[lang]}
              </p>
            </Link>
          )}

          {/* Orpigo Link */}
          {orpigoProduct && (
            <Link
              href={v2Href(lang, "products", "orpigo")}
              className="group rounded-2xl border border-ink-950 p-6 transition-all hover:bg-stone-50 hover:shadow-md"
            >
              <div className="flex items-center justify-between font-mono text-mono-sm text-stone-500">
                <span>{lang === "tr" ? "Hızlı Okuma Uygulaması" : lang === "es" ? "Lectura Rápida" : "Speed Reading"}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
              <h3 className="v2-heading mt-3 text-xl font-bold group-hover:text-ember">
                Orpigo
              </h3>
              <p className="mt-2 text-sm text-stone-600 line-clamp-3">
                {orpigoProduct.description[lang]}
              </p>
            </Link>
          )}
        </div>
      </section>

      {/* FAQ Section (Sıkça Sorulan Sorular) */}
      <section
        aria-labelledby="faq-heading"
        className="container-site border-t border-ink-950 py-(--section-sm)"
      >
        <div className="max-w-2xl">
          <span className="font-mono text-mono-sm font-semibold uppercase tracking-wider text-signal">
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
          {tool.faq.map((item, idx) => (
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
      <section aria-labelledby="cta-heading" className="container-site py-(--section)">
        <div className="rounded-3xl bg-ink-950 text-white p-8 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 id="cta-heading" className="v2-display text-[clamp(2rem,1.5rem+3vw,3.5rem)] text-white">
              {lang === "tr"
                ? "Projenizi birlikte hayata geçirelim"
                : lang === "es"
                  ? "Hablemos de su próximo proyecto"
                  : "Let's build your next digital platform"}
            </h2>
            <p className="mt-4 text-stone-300 text-lead">
              {lang === "tr"
                ? "İstanbul merkezli yazılım ekibimizle web, mobil ve yapay zekâ odaklı projelerinizi görüşün."
                : lang === "es"
                  ? "Contáctenos para evaluar arquitectura, integraciones de IA o desarrollo de software a medida."
                  : "Connect with our Istanbul-based engineering team to engineer fast, resilient web and mobile applications."}
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
