import type { Metadata } from "next";
import { locales } from "@/i18n/config";
import { getPost, getPostSlugs, readingMinutes } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { formatDate } from "@/lib/format";
import { resolveLang } from "@/lib/params";
import { V3PageHead } from "@/components/v3/V3PageHead";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getPostSlugs(lang).map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/v3/[lang]/blog/[slug]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  return { title: (await getPost(lang, (await params).slug)).meta.title };
}

export default async function Page({ params }: PageProps<"/v3/[lang]/blog/[slug]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const { slug } = await params;
  const { Post, meta } = await getPost(lang, slug);
  return (
    <article>
      <V3PageHead
        kicker={`${dict.v3.columnTitle} · ${formatDate(meta.date, lang)} · ${dict.blogPage.readingTime.replace("{n}", String(readingMinutes(lang, slug)))}`}
        title={meta.title}
        deck={meta.description}
      />
      <div className="container-site pt-8">
        <div className="v3-dropcap mx-auto max-w-2xl text-[1.1rem] leading-[1.7]">
          <Post />
        </div>
      </div>
    </article>
  );
}
