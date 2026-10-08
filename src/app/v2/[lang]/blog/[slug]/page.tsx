import type { Metadata } from "next";
import { locales } from "@/i18n/config";
import { getPost, getPostSlugs, readingMinutes } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { formatDate } from "@/lib/format";
import { resolveLang } from "@/lib/params";
import { V2PageHead } from "@/components/v2/V2PageHead";
import { articleJsonLd, jsonLd, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getPostSlugs(lang).map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/v2/[lang]/blog/[slug]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const { meta } = await getPost(lang, slug);
  const base = pageMetadata({
    lang,
    route: "blog",
    rest: [slug],
    title: meta.title,
    description: meta.description,
    availableIn: locales.filter((l) => getPostSlugs(l).includes(slug)),
    type: "article",
  });
  return { ...base, openGraph: { ...base.openGraph, type: "article", publishedTime: meta.date, authors: [meta.author] } };
}

export default async function Page({ params }: PageProps<"/v2/[lang]/blog/[slug]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const { slug } = await params;
  const { Post, meta } = await getPost(lang, slug);
  const posting = articleJsonLd(lang, meta);
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(posting)} />
      <V2PageHead
        kicker={`${formatDate(meta.date, lang)} · ${dict.blogPage.readingTime.replace("{n}", String(readingMinutes(lang, slug)))}`}
        title={meta.title}
        lead={meta.description}
      />
      <div className="container-site py-(--section-sm)">
        <div className="mx-auto max-w-2xl text-[1.0625rem] leading-[1.75]">
          <Post />
        </div>
      </div>
    </article>
  );
}
