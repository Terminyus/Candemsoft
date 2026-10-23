import type { Metadata } from "next";
import Link from "next/link";
import { locales } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { getPost, getPostFaqs, getPostHeadings, getPostSlugs, getPosts, getRelatedPosts, readingMinutes } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { formatDate } from "@/lib/format";
import { resolveLang } from "@/lib/params";
import { CopyLink } from "@/components/v2/CopyLink";
import { PostCover } from "@/components/v2/PostCover";
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
  const t = dict.v2;
  const { slug } = await params;
  const { Post, meta } = await getPost(lang, slug);
  const headings = getPostHeadings(lang, slug);
  const posts = await getPosts(lang);
  const next = posts.length > 1 ? posts[(posts.findIndex((p) => p.slug === slug) + 1) % posts.length] : undefined;
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
      {/* reading progress (scroll-driven; ScrollFallback drives it where that's unsupported) */}
      <div aria-hidden className="v4-progress fixed inset-x-0 top-0 z-50 h-1 bg-signal" />

      <header className="border-b border-ink-950">
        <div className="container-site grid gap-10 pb-12 pt-[clamp(2rem,5vw,4rem)] lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div className="@container min-w-0">
            <Link href={v2Href(lang, "blog")} className="font-mono text-mono-sm text-stone-600 hover:text-ember">
              ← {dict.common.backToBlog}
            </Link>
            <h1 className="v2-display mt-6 text-[clamp(2.25rem,8cqi,5rem)] leading-[1.02]">{meta.title}</h1>
            <p className="mt-6 max-w-2xl text-lead text-stone-600">{meta.description}</p>
            <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink-950 pt-5 font-mono text-mono-sm">
              <span>
                <span className="text-stone-600">{t.blogBy}</span> <span className="font-semibold">{meta.author}</span>
              </span>
              <time dateTime={meta.date}>{formatDate(meta.date, lang)}</time>
              <span>{dict.blogPage.readingTime.replace("{n}", String(readingMinutes(lang, slug)))}</span>
            </p>
          </div>
          <PostCover
            text={meta.cover ?? meta.title.split(/\s+/)[0]!}
            tags={meta.tags}
            className="hidden min-h-80 lg:flex"
          />
        </div>
      </header>

      <div className="container-site grid grid-cols-[minmax(0,1fr)] gap-12 py-(--section-sm) lg:grid-cols-[14rem_minmax(0,1fr)]">
        {headings.length > 1 && (
          <nav aria-labelledby="toc" className="lg:sticky lg:top-28 lg:self-start">
            <p id="toc" className="font-mono text-mono-sm text-stone-600">
              {t.blogToc}
            </p>
            <ol className="mt-4 space-y-1 border-l border-ink-950">
              {headings.map((h, i) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className="-ml-px flex gap-3 border-l-2 border-transparent py-1.5 pl-4 text-sm hover:border-signal hover:text-ember"
                  >
                    <span className="font-mono text-stone-600">{String(i + 1).padStart(2, "0")}</span>
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="v2-prose max-w-[42rem] text-[1.0625rem] leading-[1.75]">
          <Post />
        </div>
      </div>

      <footer className="container-site pb-(--section-sm)">
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-ink-950 py-6 lg:ml-[17rem]">
          <ul className="flex flex-wrap gap-2">
            {meta.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-paper-100 px-3 py-1 font-mono text-mono-sm">
                #{tag}
              </li>
            ))}
          </ul>
          <CopyLink label={t.blogCopy} done={t.blogCopied} title={meta.title} />
        </div>
        {relatedPosts.length > 0 && (
          <aside aria-label={dict.blogPage.relatedPosts ?? "İlgili Yazılar"} className="mt-10 lg:ml-[17rem]">
            <h2 className="v2-heading text-2xl">{dict.blogPage.relatedPosts ?? "İlgili Yazılar"}</h2>
            <ul className="mt-5 grid gap-4 md:grid-cols-3">
              {relatedPosts.map((rel) => (
                <li key={rel.slug} className="rounded-2xl border border-ink-950/20 p-5 hover:border-ink-950">
                  <p className="font-mono text-mono-sm text-stone-600">
                    <time dateTime={rel.date}>{formatDate(rel.date, lang)}</time>
                  </p>
                  <Link href={v2Href(lang, "blog", rel.slug)} className="v2-heading mt-2 block text-lg hover:text-ember">
                    {rel.title}
                  </Link>
                  <p className="mt-2 line-clamp-2 text-sm text-stone-600">{rel.description}</p>
                </li>
              ))}
            </ul>
          </aside>
        )}
        {next && next.slug !== slug && (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:ml-[17rem]">
            <Link
              href={v2Href(lang, "blog", next.slug)}
              className="group rounded-3xl border border-ink-950 p-6 hover:bg-ink-950 hover:text-white"
            >
              <span className="font-mono text-mono-sm text-stone-600 group-hover:text-stone-400">{t.blogNext} →</span>
              <span className="v2-heading mt-2 block text-2xl">{next.title}</span>
            </Link>
          </div>
        )}
      </footer>
    </article>
  );
}
