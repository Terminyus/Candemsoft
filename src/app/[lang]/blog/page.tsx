import type { Metadata } from "next";
import Link from "next/link";
import { href } from "@/i18n/routes";
import { getPosts } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLang(params));
  return { title: dict.nav.blog };
}

export default async function BlogPage({ params }: PageProps<"/[lang]/blog">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const posts = await getPosts(lang);
  return (
    <>
      <h1>{dict.nav.blog}</h1>
      <ul>
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={href(lang, "blog", p.slug)}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
