import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, readingMinutes } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V4PageHead } from "@/components/v4/V4PageHead";
import { v4Href } from "@/components/v4/nav";

export async function generateMetadata({ params }: PageProps<"/v4/[lang]/blog">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.blog };
}

export default async function Page({ params }: PageProps<"/v4/[lang]/blog">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const posts = await getPosts(lang);
  return (
    <>
      <V4PageHead path="~/candemsoft/blog/*.mdx" title={dict.blogPage.title} lead={dict.blogPage.lead} />
      <ol className="container-site space-y-4 pt-12">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={v4Href(lang, "blog", p.slug)} className="v4-rise group block rounded-xl border border-dev-line bg-dev-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-signal/60">
              <p className="v4-mono text-xs text-dev-comment">
                {p.slug}.mdx · <time dateTime={p.date}>{p.date}</time> · {dict.blogPage.readingTime.replace("{n}", String(readingMinutes(lang, p.slug)))}
              </p>
              <h2 className="v4-title mt-2 text-3xl group-hover:text-signal">{p.title}</h2>
              <p className="mt-2 text-dev-muted">{p.description}</p>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
