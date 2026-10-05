import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, readingMinutes } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { formatDate } from "@/lib/format";
import { resolveLang } from "@/lib/params";
import { V3PageHead } from "@/components/v3/V3PageHead";
import { v3Href } from "@/components/v3/nav";

export async function generateMetadata({ params }: PageProps<"/v3/[lang]/blog">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).v3.columnTitle };
}

export default async function Page({ params }: PageProps<"/v3/[lang]/blog">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const posts = await getPosts(lang);
  return (
    <>
      <V3PageHead kicker={dict.v3.columnTitle} title={dict.blogPage.title} deck={dict.blogPage.lead} />
      <ol className="container-site">
        {posts.map((p) => (
          <li key={p.slug} className="grid gap-3 border-b border-news-ink py-8 md:grid-cols-[12rem_1fr]">
            <p className="v3-kicker text-news-gray">
              <time dateTime={p.date}>{formatDate(p.date, lang)}</time>
              <br />
              {dict.blogPage.readingTime.replace("{n}", String(readingMinutes(lang, p.slug)))}
            </p>
            <div>
              <h2 className="v3-headline text-[clamp(1.75rem,1.3rem+2vw,3rem)]">
                <Link href={v3Href(lang, "blog", p.slug)} className="hover:text-ember">
                  {p.title}
                </Link>
              </h2>
              <p className="mt-2 max-w-2xl text-lg italic">{p.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
