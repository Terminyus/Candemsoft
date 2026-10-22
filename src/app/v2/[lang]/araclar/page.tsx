import type { Metadata } from "next";
import Link from "next/link";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { breadcrumbJsonLd, jsonLd, pageBreadcrumbs, pageMetadata } from "@/lib/seo";
import { toolKeys, getToolSlug } from "@/lib/tools";
import { V2PageHead } from "@/components/v2/V2PageHead";
import { v2Href } from "@/components/v2/nav";

export const dynamicParams = false;

type Props = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return pageMetadata({
    lang,
    route: "tools",
    title: dict.meta.toolsTitle,
    description: dict.meta.toolsDescription,
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

const toolSummaries: Record<string, { title: Record<Locale, string>; summary: Record<Locale, string>; badge: Record<Locale, string> }> = {
  "metin-buyuk-kucuk-harf": {
    title: {
      tr: "Türkçe Büyük/Küçük Harf Dönüştürücü",
      en: "Turkish Case Converter (İ/ı Compliant)",
      es: "Convertidor de Mayúsculas y Minúsculas en Turco",
    },
    summary: {
      tr: "Türkçe İ-ı ve I-i kurallarını harfiyen uygulayarak metinleri BÜYÜK HARF, küçük harf, Baş Harfleri Büyüt veya Cümle düzenine dönüştürün.",
      en: "Accurately transform Turkish text into UPPERCASE, lowercase, Title Case, or Sentence case while preserving dotted İ and dotless I rules.",
      es: "Convierta texto en turco respetando estrictamente las reglas de las letras İ e ı en mayúsculas, minúsculas y tipo oración.",
    },
    badge: {
      tr: "İ/ı Uyumlu",
      en: "İ/ı Compatible",
      es: "Compatible con İ/ı",
    },
  },
  "kelime-karakter-sayaci": {
    title: {
      tr: "Kelime ve Karakter Sayacı",
      en: "Word & Character Counter",
      es: "Contador de Palabras y Caracteres",
    },
    summary: {
      tr: "Toplam karakter, boşluksuz karakter, kelime, cümle ve paragraf sayılarını gerçek zamanlı hesaplayın. Tahmini okuma süresini ve harf dağılımını görün.",
      en: "Real-time character, word, sentence, and paragraph counter with reading time estimation and Turkish character breakdown.",
      es: "Calcula en tiempo real caracteres con y sin espacios, palabras, oraciones, párrafos y tiempo estimado de lectura.",
    },
    badge: {
      tr: "Anlık Analiz",
      en: "Live Metrics",
      es: "Métricas en Vivo",
    },
  },
  "slug-ascii-donusturucu": {
    title: {
      tr: "Türkçe Karakter ASCII ve Slug Üretici",
      en: "Turkish Character to ASCII Slug Generator",
      es: "Generador de Slug y ASCII para Turco",
    },
    summary: {
      tr: "Türkçe karakterleri (ç, ğ, ı, ö, ş, ü, İ) güvenli ASCII harflerine çevirerek SEO uyumlu, temiz ve standart URL slug yapıları üretin.",
      en: "Convert Turkish special characters into safe ASCII equivalents to create clean, search engine friendly URL slugs effortlessly.",
      es: "Transforme caracteres especiales turcos en ASCII seguro para generar slugs de URL limpios y optimizados para SEO.",
    },
    badge: {
      tr: "SEO Uyumlu",
      en: "SEO Ready",
      es: "Listo para SEO",
    },
  },
};

export default async function ToolsHubPage({ params }: Props) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(pageBreadcrumbs(lang, "tools")))}
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
          <li className="text-ink-950 font-medium" aria-current="page">
            {breadcrumbLabel(lang, "tools")}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <V2PageHead
        kicker={dict.toolsPage.label}
        title={dict.toolsPage.title}
        lead={dict.toolsPage.lead}
      />

      {/* Privacy Notice Banner */}
      <section className="container-site pb-8">
        <div className="rounded-2xl border border-ink-950/20 bg-stone-50 p-4 font-mono text-mono-sm text-stone-600 sm:p-5 flex items-center gap-3">
          <span className="text-signal text-lg" aria-hidden="true">🔒</span>
          <span>{dict.toolsPage.privacyNotice}</span>
        </div>
      </section>

      {/* Tools List */}
      <section aria-label={dict.toolsPage.title} className="container-site pb-16">
        <ol className="divide-y divide-ink-950">
          {toolKeys.map((key, i) => {
            const item = toolSummaries[key];
            const toolSlug = getToolSlug(key, lang);
            return (
              <li
                key={key}
                id={key}
                className="grid scroll-mt-(--header-h) gap-6 py-12 md:grid-cols-[6rem_1fr_auto] md:items-center"
              >
                <span className="v2-display text-5xl font-bold text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-stone-100 px-3 py-1 font-mono text-xs font-semibold text-stone-700">
                      {item.badge[lang]}
                    </span>
                  </div>
                  <h2 className="v2-heading mt-3 text-2xl font-bold text-ink-950 sm:text-3xl">
                    <Link
                      href={v2Href(lang, "tools", toolSlug)}
                      className="hover:text-ember transition-colors"
                    >
                      {item.title[lang]}
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-2xl text-lead text-stone-600">
                    {item.summary[lang]}
                  </p>
                </div>
                <div className="pt-2 md:pt-0">
                  <Link
                    href={v2Href(lang, "tools", toolSlug)}
                    className="inline-flex min-h-12 items-center gap-3 rounded-full border border-ink-950 bg-ink-950 px-6 font-archivo text-sm font-semibold text-white transition-colors hover:bg-signal hover:text-ink-950"
                  >
                    {dict.toolsPage.openTool} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Bottom CTA */}
      <section aria-labelledby="tools-cta" className="container-site py-(--section)">
        <div className="rounded-3xl bg-ink-950 text-white p-8 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 id="tools-cta" className="v2-display text-[clamp(2rem,1.5rem+3vw,3.5rem)] text-white">
              {lang === "tr"
                ? "Özel bir yazılım çözümü mü arıyorsunuz?"
                : lang === "es"
                  ? "¿Busca una solución de software a medida?"
                  : "Looking for a custom software solution?"}
            </h2>
            <p className="mt-4 text-stone-300 text-lead">
              {lang === "tr"
                ? "Türkçe dil desteği, yapay zekâ entegrasyonu veya özel web/mobil uygulama ihtiyaçlarınız için ekibimizle görüşün."
                : lang === "es"
                  ? "Consulte con nuestro equipo sobre soporte lingüístico, integraciones de IA o desarrollo de software a medida."
                  : "Talk to our engineering team about locale-aware architectures, AI keyboard features, or custom app platforms."}
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
