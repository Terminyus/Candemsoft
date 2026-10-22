import type { Metadata } from "next";
import Link from "next/link";
import { locales } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { getPost, getPostFaqs, getPostSlugs, getRelatedPosts, readingMinutes } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { formatDate } from "@/lib/format";
import { resolveLang } from "@/lib/params";
import { V2PageHead } from "@/components/v2/V2PageHead";
import { v2Href } from "@/components/v2/nav";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLd,
  mergeJsonLd,
  pageBreadcrumbs,
  pageMetadata,
  siteUrl,
} from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getPostSlugs(lang).map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/v2/[lang]/blog/[slug]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const { meta } = await getPost(lang, slug);
  const title = meta.metaTitle ?? `${meta.title} | Candemsoft`;
  const base = pageMetadata({
    lang,
    route: "blog",
    rest: [slug],
    title,
    description: meta.description,
    image: meta.image,
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
  const relatedPosts = await getRelatedPosts(lang, slug, 3);
  const postUrl = `${siteUrl}${href(lang, "blog", meta.slug)}`;
  const breadcrumbs = breadcrumbJsonLd(pageBreadcrumbs(lang, "blog", { name: meta.title, url: postUrl }));
  const posting = articleJsonLd(lang, meta, postUrl);
  const faqs = getPostFaqs(lang, slug);
  const faqSchema = faqs.length > 0 ? faqJsonLd(faqs) : null;
  const merged = mergeJsonLd(posting, faqSchema, breadcrumbs);
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(merged)} />
      <V2PageHead
        kicker={`${formatDate(meta.date, lang)} · ${dict.blogPage.readingTime.replace("{n}", String(readingMinutes(lang, slug)))}`}
        title={meta.title}
        lead={meta.description}
      />
      <div className="container-site py-(--section-sm)">
        <div className="mx-auto max-w-2xl text-[1.0625rem] leading-[1.75]">
          <Post />

          {meta.tags && meta.tags.length > 0 && (
            <div className="mt-12 border-t border-ink-950/15 pt-6">
              <p className="font-mono text-xs uppercase tracking-wider text-stone-500 mb-3">
                {dict.blogPage.tags ?? "Etiketler"}
              </p>
              <div className="flex flex-wrap gap-2">
                {meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-ink-950/20 bg-paper-100 px-3 py-1 font-mono text-xs text-stone-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {relatedPosts.length > 0 && (
            <aside aria-label={dict.blogPage.relatedPosts ?? "İlgili Yazılar"} className="mt-16 border-t-2 border-ink-950 pt-10">
              <h2 className="v2-display text-2xl font-bold tracking-tight mb-6">
                {dict.blogPage.relatedPosts ?? "İlgili Yazılar"}
              </h2>
              <div className="grid gap-6">
                {relatedPosts.map((rel) => (
                  <div key={rel.slug} className="group rounded-xl border border-ink-950/10 bg-paper-100/40 p-5 transition-colors hover:border-ink-950/30">
                    <p className="font-mono text-xs text-stone-500 mb-1">
                      <time dateTime={rel.date}>{formatDate(rel.date, lang)}</time> ·{" "}
                      {dict.blogPage.readingTime.replace("{n}", String(readingMinutes(lang, rel.slug)))}
                    </p>
                    <h3 className="text-lg font-semibold leading-snug group-hover:text-ember">
                      <Link href={v2Href(lang, "blog", rel.slug)} className="hover:underline">
                        {rel.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm text-stone-600 line-clamp-2">{rel.description}</p>
                  </div>
                ))}
              </div>
            </aside>
          )}

          <div className="mt-12 text-center">
            <Link
              href={v2Href(lang, "blog")}
              className="inline-flex items-center font-mono text-xs font-semibold uppercase tracking-wider text-ember hover:underline"
            >
              ← {dict.common?.backToBlog ?? "Tüm Yazılar"}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
