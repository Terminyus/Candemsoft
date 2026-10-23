import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, readingMinutes } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { formatDate } from "@/lib/format";
import { resolveLang } from "@/lib/params";
import { PostCover } from "@/components/v2/PostCover";
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
  const t = dict.v2;
  const [latest, ...rest] = await getPosts(lang);
  const minutes = (slug: string) => dict.blogPage.readingTime.replace("{n}", String(readingMinutes(lang, slug)));
  const cover = (p: { cover?: string; title: string }) => p.cover ?? p.title.split(/\s+/)[0]!;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(pageBreadcrumbs(lang, "blog")))}
      />
      <V2PageHead kicker={dict.blogPage.label} title={dict.blogPage.title} lead={dict.blogPage.lead} />

      {latest && (
        <section aria-labelledby="latest" className="container-site py-(--section-sm)">
          <p className="font-mono text-mono-sm text-stone-600">{t.blogLatest}</p>
          {/* the newest post as a poster: cover on one side, the pitch on the other */}
          <article className="group relative mt-4 grid overflow-hidden rounded-[2rem] border border-ink-950 lg:grid-cols-[1fr_1.1fr]">
            <PostCover
              text={cover(latest)}
              tags={latest.tags}
              className="min-h-72 rounded-none transition-transform duration-500 group-hover:scale-[1.015] lg:min-h-[30rem]"
            />
            <div className="flex flex-col p-6 sm:p-10">
              <p className="font-mono text-mono-sm text-stone-600">
                <time dateTime={latest.date}>{formatDate(latest.date, lang)}</time> · {minutes(latest.slug)}
              </p>
              <h2 id="latest" className="v2-display mt-4 text-[clamp(2rem,1.3rem+2.6vw,3.75rem)] leading-[1.02]">
                <Link
                  href={v2Href(lang, "blog", latest.slug)}
                  className="after:absolute after:inset-0 group-hover:text-ember"
                >
                  {latest.title}
                </Link>
              </h2>
              <p className="mt-5 max-w-xl text-lead text-stone-600">{latest.description}</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-10">
                <p className="text-sm">
                  <span className="text-stone-600">{t.blogBy}</span>{" "}
                  <span className="font-semibold">{latest.author}</span>
                </p>
                <span className="inline-flex min-h-12 items-center gap-3 rounded-full bg-ink-950 px-6 font-archivo font-semibold text-white transition-colors group-hover:bg-signal group-hover:text-ink-950">
                  {t.blogRead}{" "}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </div>
          </article>
        </section>
      )}

      {rest.length > 0 && (
        <section aria-labelledby="more" className="container-site pb-(--section-sm)">
          <h2 id="more" className="font-mono text-mono-sm text-stone-600">
            {t.blogMore}
          </h2>
          <ul className="mt-4 grid gap-5 md:grid-cols-2">
            {rest.map((p) => (
              <li key={p.slug}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink-950">
                  <PostCover text={cover(p)} tags={p.tags} size="sm" className="h-48 rounded-none" />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-mono text-mono-sm text-stone-600">
                      <time dateTime={p.date}>{formatDate(p.date, lang)}</time> · {minutes(p.slug)}
                    </p>
                    <h3 className="v2-heading mt-3 text-2xl group-hover:text-ember">
                      <Link href={v2Href(lang, "blog", p.slug)} className="after:absolute after:inset-0">
                        {p.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-stone-600">{p.description}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
