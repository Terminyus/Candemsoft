import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V5PageHead } from "@/components/v5/V5PageHead";

export async function generateMetadata({ params }: PageProps<"/v5/[lang]/blog">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.blog };
}
import Link from "next/link";
import { getPosts, readingMinutes } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { v5Href } from "@/components/v5/nav";

export default async function Page({ params }: PageProps<"/v5/[lang]/blog">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const posts = await getPosts(lang);
  return (
    <>
      <V5PageHead lang={lang} dict={dict} title={dict.blogPage.title} lead={dict.blogPage.lead} />
      <ol className="container-site grid gap-6 py-(--section) md:grid-cols-2">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={v5Href(lang, "blog", p.slug)} className="v4-rise group flex h-full flex-col rounded-2xl border border-corp-line p-7 transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(16,24,40,0.3)]">
              <p className="text-sm text-corp-muted">
                <time dateTime={p.date}>{formatDate(p.date, lang)}</time> · {dict.blogPage.readingTime.replace("{n}", String(readingMinutes(lang, p.slug)))}
              </p>
              <h2 className="mt-3 text-2xl font-bold group-hover:text-ember">{p.title}</h2>
              <p className="mt-2 text-corp-muted">{p.description}</p>
              <span className="mt-auto pt-5 text-sm font-semibold text-ember">{dict.common.readMore} →</span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
