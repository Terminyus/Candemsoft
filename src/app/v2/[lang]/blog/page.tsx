import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, readingMinutes } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { formatDate } from "@/lib/format";
import { resolveLang } from "@/lib/params";
import { V2PageHead } from "@/components/v2/V2PageHead";
import { v2Href } from "@/components/v2/nav";
import { breadcrumbJsonLd, jsonLd, pageBreadcrumbs, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/v2/[lang]/blog">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, route: "blog", title: dict.meta.blogTitle, description: dict.meta.blogDescription });
}

export default async function Page({ params }: PageProps<"/v2/[lang]/blog">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const posts = await getPosts(lang);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(pageBreadcrumbs(lang, "blog")))}
      />
      <V2PageHead kicker={dict.blogPage.label} title={dict.blogPage.title} lead={dict.blogPage.lead} />
      <ol className="container-site py-(--section-sm)">
        {posts.map((p) => (
          <li key={p.slug} className="group relative grid gap-3 border-b border-ink-950 py-10 md:grid-cols-[12rem_1fr]">
            <p className="font-mono text-mono-sm text-stone-600">
              <time dateTime={p.date}>{formatDate(p.date, lang)}</time>
              <br />
              {dict.blogPage.readingTime.replace("{n}", String(readingMinutes(lang, p.slug)))}
            </p>
            <div>
              <h2 className="v2-display text-[clamp(1.75rem,1.3rem+2vw,3rem)] group-hover:text-ember">
                <Link href={v2Href(lang, "blog", p.slug)} className="after:absolute after:inset-0">
                  {p.title}
                </Link>
              </h2>
              <p className="mt-3 max-w-2xl text-stone-600">{p.description}</p>
              {p.tags && p.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-ink-950/15 bg-paper-100/50 px-2.5 py-0.5 font-mono text-[0.6875rem] text-stone-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
