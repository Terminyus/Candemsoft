import type { Metadata } from "next";
import { locales } from "@/i18n/config";
import { getPost, getPostSlugs, readingMinutes } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V4PageHead } from "@/components/v4/V4PageHead";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getPostSlugs(lang).map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/v4/[lang]/blog/[slug]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  return { title: (await getPost(lang, (await params).slug)).meta.title };
}

export default async function Page({ params }: PageProps<"/v4/[lang]/blog/[slug]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const { slug } = await params;
  const { Post, meta } = await getPost(lang, slug);
  return (
    <article>
      <V4PageHead path={`$ cat blog/${slug}.mdx · ${dict.blogPage.readingTime.replace("{n}", String(readingMinutes(lang, slug)))}`} title={meta.title} lead={meta.description} />
      <div className="container-site pt-10">
        {/* MDX components are styled for light paper; invert their accents for the dark editor. */}
        <div className="mx-auto max-w-2xl text-[1.0625rem] leading-[1.75] text-dev-text [&_code]:bg-dev-surface [&_code]:text-dev-tag [&_li]:marker:text-signal [&_pre]:border-dev-line [&_pre_code]:text-dev-text">
          <Post />
        </div>
      </div>
    </article>
  );
}
