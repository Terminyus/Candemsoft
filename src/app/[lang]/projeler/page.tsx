import type { Metadata } from "next";
import Link from "next/link";
import { href } from "@/i18n/routes";
import { getProjects } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";

export async function generateMetadata({ params }: PageProps<"/[lang]/projeler">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLang(params));
  return { title: dict.nav.projects };
}

export default async function ProjectsPage({ params }: PageProps<"/[lang]/projeler">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <>
      <h1>{dict.nav.projects}</h1>
      <ul>
        {getProjects().map((p) => (
          <li key={p.slug}>
            <Link href={href(lang, "projects", p.slug)}>{p.name}</Link> — {p.type[lang]}
          </li>
        ))}
      </ul>
    </>
  );
}
