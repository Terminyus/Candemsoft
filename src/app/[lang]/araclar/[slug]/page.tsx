import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";
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
import { PageIntro } from "@/components/page/PageIntro";
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

export default async function ClassicToolDetailPage({ params }: Props) {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const tool = getToolForLocale(slug, lang);
  if (!tool) notFound();

  const dict = await getDictionary(lang);
  const toolUrl = `${siteUrl}${href(lang, "tools", tool.key)}`;
  const homeUrl = `${siteUrl}${href(lang, "home")}`;
  const toolsUrl = `${siteUrl}${href(lang, "tools")}`;

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

      <PageIntro
        label={`${dict.toolsPage.label} / ${tool.kicker[lang]}`}
        title={tool.title[lang]}
        lead={tool.lead[lang]}
      />

      <div className="container-site py-10 space-y-12">
        {/* Interactive Tool Component */}
        <section aria-label={tool.title[lang]}>
          {tool.key === "metin-buyuk-kucuk-harf" && <CaseConverterTool lang={lang} />}
          {tool.key === "kelime-karakter-sayaci" && <TextCounterTool lang={lang} />}
          {tool.key === "slug-ascii-donusturucu" && <SlugGeneratorTool lang={lang} />}
        </section>

        {/* 400+ Words Technical Guide */}
        <article className="max-w-3xl space-y-8 border-t border-stone-200 pt-10">
          <h2 className="text-2xl font-bold text-ink-950">
            {tool.article.title[lang]}
          </h2>
          {tool.article.sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-3">
              <h3 className="text-xl font-semibold text-ink-950">
                {section.heading[lang]}
              </h3>
              {section.paragraphs[lang].map((pText, pIdx) => (
                <p key={pIdx} className="text-stone-700 leading-relaxed">
                  {pText}
                </p>
              ))}
            </div>
          ))}
        </article>

        {/* FAQ Section */}
        <section className="border-t border-stone-200 pt-10">
          <h2 className="text-2xl font-bold text-ink-950 mb-6">
            {lang === "tr" ? "Sıkça Sorulan Sorular" : lang === "es" ? "Preguntas Frecuentes" : "Frequently Asked Questions"}
          </h2>
          <dl className="divide-y divide-stone-200">
            {tool.faq.map((item, idx) => (
              <div key={idx} className="py-4">
                <dt className="text-lg font-semibold text-ink-950">
                  {item.question[lang]}
                </dt>
                <dd className="mt-2 text-stone-600 leading-relaxed">
                  {item.answer[lang]}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}
