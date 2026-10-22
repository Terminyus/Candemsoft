import type { Metadata } from "next";
import Link from "next/link";
import { locales } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { getPost, getPostFaqs, getPostSlugs, getRelatedPosts, readingMinutes } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
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
  const title = meta.metaTitle ?? `${meta.title} | Candemsoft`;
  const base = pageMetadata({ lang, route: "blog", rest: [slug], title, description: meta.description, image: meta.image, availableIn, type: "article" });
  return { ...base, openGraph: { ...base.openGraph, type: "article", publishedTime: meta.date, authors: [meta.author] } };
}

export default async function PostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
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
      <header data-surface="ink">
        <div className="container-site grid-site gap-y-8 pb-(--section-sm) pt-[clamp(3rem,6vw,6rem)]">
          <nav className="col-span-full" aria-label="breadcrumb">
            <Link href={href(lang, "blog")} className="font-mono text-mono-sm text-stone-400 hover:text-paper-100">
              ← {dict.common.backToBlog}
            </Link>
          </nav>
          <h1 className="col-span-full font-display-tight text-h1 font-extrabold lg:col-span-10">{meta.title}</h1>
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

            {meta.tags && meta.tags.length > 0 && (
              <div className="mt-12 border-t border-ink-950/20 pt-6">
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
                <h2 className="font-display text-h3 font-bold mb-6">
                  {dict.blogPage.relatedPosts ?? "İlgili Yazılar"}
                </h2>
                <div className="grid gap-6">
                  {relatedPosts.map((rel) => (
                    <div key={rel.slug} className="group rounded-xl border border-paper-200 bg-paper-50 p-5 transition-colors hover:border-ink-950">
                      <p className="font-mono text-mono-sm text-stone-500 mb-1">
                        <time dateTime={rel.date}>{formatDate(rel.date, lang)}</time> ·{" "}
                        {dict.blogPage.readingTime.replace("{n}", String(readingMinutes(lang, rel.slug)))}
                      </p>
                      <h3 className="text-h4 font-bold group-hover:text-ember">
                        <Link href={href(lang, "blog", rel.slug)} className="hover:underline">
                          {rel.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-stone-600 line-clamp-2">{rel.description}</p>
                    </div>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
