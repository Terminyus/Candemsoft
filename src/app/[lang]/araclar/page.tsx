import type { Metadata } from "next";
import Link from "next/link";
import { locales } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { breadcrumbJsonLd, jsonLd, pageBreadcrumbs, pageMetadata } from "@/lib/seo";
import { toolKeys, getToolSlug } from "@/lib/tools";
import { PageIntro } from "@/components/page/PageIntro";
import { MonoLabel } from "@/components/ui/MonoLabel";

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

const toolSummaries: Record<string, { title: Record<string, string>; summary: Record<string, string> }> = {
  "metin-buyuk-kucuk-harf": {
    title: {
      tr: "Türkçe Büyük/Küçük Harf Dönüştürücü",
      en: "Turkish Case Converter",
      es: "Convertidor de Mayúsculas y Minúsculas",
    },
    summary: {
      tr: "Türkçe İ/ı kurallarına tam uyumlu büyük harf, küçük harf, baş harfler büyük ve cümle düzeni dönüştürücüsü.",
      en: "Accurately transform Turkish text into UPPERCASE, lowercase, Title Case, or Sentence case.",
      es: "Convierta texto en turco respetando las reglas de las letras İ e ı.",
    },
  },
  "kelime-karakter-sayaci": {
    title: {
      tr: "Kelime ve Karakter Sayacı",
      en: "Word & Character Counter",
      es: "Contador de Palabras y Caracteres",
    },
    summary: {
      tr: "Boşluklu ve boşluksuz karakter, kelime, cümle ve paragraf sayısı hesaplayıcı.",
      en: "Real-time character, word, sentence, and paragraph counter with reading time estimation.",
      es: "Calcula en tiempo real caracteres, palabras, oraciones y párrafos.",
    },
  },
  "slug-ascii-donusturucu": {
    title: {
      tr: "Türkçe Karakter ASCII ve Slug Üretici",
      en: "Turkish ASCII & Slug Generator",
      es: "Generador de Slug y ASCII",
    },
    summary: {
      tr: "Türkçe karakterleri ASCII'ye dönüştürerek SEO uyumlu temiz URL slug yapıları oluşturun.",
      en: "Convert Turkish characters to safe ASCII equivalents for clean URLs.",
      es: "Transforme caracteres turcos en ASCII seguro para generar slugs limpios.",
    },
  },
};

export default async function ClassicToolsPage({ params }: Props) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.toolsPage;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(pageBreadcrumbs(lang, "tools")))}
      />
      <PageIntro
        label={t.label}
        title={t.title}
        lead={t.lead}
      />
      <div className="container-site py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {toolKeys.map((key) => {
            const item = toolSummaries[key];
            const toolSlug = getToolSlug(key, lang);
            return (
              <Link
                key={key}
                href={href(lang, "tools", toolSlug)}
                className="group rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:border-ink-950 hover:shadow-md"
              >
                <MonoLabel className="text-signal font-semibold">
                  {key}
                </MonoLabel>
                <h2 className="mt-3 text-xl font-bold group-hover:text-ember">
                  {item.title[lang]}
                </h2>
                <p className="mt-2 text-sm text-stone-600">
                  {item.summary[lang]}
                </p>
                <span className="mt-4 inline-block font-mono text-mono-sm font-semibold text-ink-950 group-hover:underline">
                  {t.openTool} →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
