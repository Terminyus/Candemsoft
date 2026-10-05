import type { Metadata } from "next";
import { locales } from "@/i18n/config";
import { getPost, getPostSlugs, readingMinutes } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { formatDate } from "@/lib/format";
import { resolveLang } from "@/lib/params";
import { V2PageHead } from "@/components/v2/V2PageHead";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getPostSlugs(lang).map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/v2/[lang]/blog/[slug]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  return { title: (await getPost(lang, (await params).slug)).meta.title };
}

export default async function Page({ params }: PageProps<"/v2/[lang]/blog/[slug]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const { slug } = await params;
  const { Post, meta } = await getPost(lang, slug);
  return (
    <article>
      <V2PageHead
        kicker={`${formatDate(meta.date, lang)} · ${dict.blogPage.readingTime.replace("{n}", String(readingMinutes(lang, slug)))}`}
        title={meta.title}
        lead={meta.description}
      />
      <div className="container-site py-(--section-sm)">
        <div className="mx-auto max-w-2xl text-[1.0625rem] leading-[1.75]">
          <Post />
        </div>
      </div>
    </article>
  );
}
