import type { Metadata } from "next";
import { locales } from "@/i18n/config";
import { getPost, getPostSlugs } from "@/lib/content";
import { resolveLang } from "@/lib/params";

export function generateStaticParams() {
  return locales.flatMap((lang) => getPostSlugs(lang).map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { meta } = await getPost(lang, (await params).slug);
  return { title: meta.title, description: meta.description };
}

export default async function PostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const lang = await resolveLang(params);
  const { Post, meta } = await getPost(lang, (await params).slug);
  return (
    <article>
      <h1>{meta.title}</h1>
      <Post />
    </article>
  );
}
