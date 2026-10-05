import type { Metadata } from "next";
import Link from "next/link";
import { href } from "@/i18n/routes";
import { getPosts, readingMinutes } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { PageIntro } from "@/components/page/PageIntro";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLang(params));
  return { title: dict.nav.blog, description: dict.blogPage.lead };
}

export default async function BlogPage({ params }: PageProps<"/[lang]/blog">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.blogPage;
  const posts = await getPosts(lang);

  return (
    <>
      <PageIntro label={t.label} title={t.title} lead={t.lead} />
      <section data-surface="paper" aria-labelledby="page-title" className="py-(--section-sm)">
        <div className="container-site">
          {posts.length === 0 ? (
            <p className="text-stone-600">{t.empty}</p>
          ) : (
            <ol className="border-t border-ink-950">
              {posts.map((p) => (
                <li key={p.slug} className="group relative border-b border-paper-200">
                  <article className="grid-site gap-y-3 py-10">
                    <MonoLabel as="p" className="col-span-full lg:col-span-3">
                      <time dateTime={p.date}>{formatDate(p.date, lang)}</time>
                      <br className="hidden lg:block" />
                      <span className="lg:hidden"> · </span>
                      {t.readingTime.replace("{n}", String(readingMinutes(lang, p.slug)))}
                    </MonoLabel>
                    <div className="col-span-full lg:col-span-7">
                      <h2 className="text-h2 transition-colors group-hover:text-ember">
                        <Link href={href(lang, "blog", p.slug)} className="after:absolute after:inset-0">
                          {p.title}
                        </Link>
                      </h2>
                      <p className="mt-4 max-w-2xl text-stone-600">{p.description}</p>
                    </div>
                    <span aria-hidden className="col-span-full hidden self-start justify-self-end font-display text-h2 transition-transform duration-(--duration-2) group-hover:translate-x-2 lg:col-span-2 lg:block">
                      →
                    </span>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
