import type { Metadata } from "next";
import { locales } from "@/i18n/config";
import { getPost, getPostSlugs, readingMinutes } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { formatDate } from "@/lib/format";
import { resolveLang } from "@/lib/params";
import { V5PageHead } from "@/components/v5/V5PageHead";
import { v5Href } from "@/components/v5/nav";
import { Cta } from "@/components/v5/home/Sections";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getPostSlugs(lang).map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/v5/[lang]/blog/[slug]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  return { title: (await getPost(lang, (await params).slug)).meta.title };
}

export default async function Page({ params }: PageProps<"/v5/[lang]/blog/[slug]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const { slug } = await params;
  const { Post, meta } = await getPost(lang, slug);
  return (
    <article>
      <V5PageHead
        lang={lang}
        dict={dict}
        crumbs={[{ label: dict.nav.blog, href: v5Href(lang, "blog") }]}
        kicker={`${formatDate(meta.date, lang)} · ${dict.blogPage.readingTime.replace("{n}", String(readingMinutes(lang, slug)))}`}
        title={meta.title}
        lead={meta.description}
      />
      <div className="container-site py-(--section)">
        <div className="mx-auto max-w-2xl text-[1.0625rem] leading-[1.75] [&_a]:text-ember [&_li]:marker:text-ember">
          <Post />
        </div>
      </div>
      <Cta lang={lang} dict={dict} />
    </article>
  );
}
