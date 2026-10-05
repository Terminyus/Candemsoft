import type { Metadata } from "next";
import Link from "next/link";
import { localeTags, locales } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { getPost, getPostSlugs, readingMinutes } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { jsonLd, pageMetadata, siteUrl } from "@/lib/seo";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { formatDate } from "@/lib/format";

// Unknown values are unmatched routes → app/global-not-found.tsx (server-rendered 404).
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getPostSlugs(lang).map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const { meta } = await getPost(lang, slug);
  const availableIn = locales.filter((l) => getPostSlugs(l).includes(slug));
  const base = pageMetadata({ lang, route: "blog", rest: [slug], title: meta.title, description: meta.description, availableIn, type: "article" });
  return { ...base, openGraph: { ...base.openGraph, type: "article", publishedTime: meta.date, authors: [meta.author] } };
}

export default async function PostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const { slug } = await params;
  const { Post, meta } = await getPost(lang, slug);

  const posting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    inLanguage: localeTags[lang],
    author: { "@type": "Organization", name: meta.author, url: siteUrl },
    publisher: { "@id": `${siteUrl}/#organization` },
    mainEntityOfPage: `${siteUrl}${href(lang, "blog", slug)}`,
  };
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(posting)} />
      <header data-surface="ink">
        <div className="container-site grid-site gap-y-8 pb-(--section-sm) pt-[clamp(3rem,6vw,6rem)]">
          <nav className="col-span-full" aria-label="breadcrumb">
            <Link href={href(lang, "blog")} className="font-mono text-mono-sm text-stone-400 hover:text-paper-100">
              ← {dict.common.backToBlog}
            </Link>
          </nav>
          <h1 className="col-span-full font-display-tight text-h1 font-semibold lg:col-span-10">{meta.title}</h1>
          <MonoLabel as="p" className="col-span-full">
            <time dateTime={meta.date}>{formatDate(meta.date, lang)}</time> · {meta.author} ·{" "}
            {dict.blogPage.readingTime.replace("{n}", String(readingMinutes(lang, slug)))}
          </MonoLabel>
        </div>
      </header>
      <div data-surface="paper" className="py-(--section-sm)">
        <div className="container-site grid-site">
          <p className="col-span-full text-lead lg:col-span-7 lg:col-start-3">{meta.description}</p>
          <div className="col-span-full text-[1.0625rem] leading-[1.75] lg:col-span-7 lg:col-start-3">
            <Post />
          </div>
        </div>
      </div>
    </article>
  );
}
