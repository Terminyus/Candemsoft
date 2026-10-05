import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { getProject, getProjects } from "@/lib/content";
import { resolveLang } from "@/lib/params";

export function generateStaticParams() {
  return locales.flatMap((lang) => getProjects().map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projeler/[slug]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const project = getProject((await params).slug);
  return project ? { title: project.name, description: project.summary[lang] } : {};
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projeler/[slug]">) {
  const lang = await resolveLang(params);
  const project = getProject((await params).slug);
  if (!project) notFound();
  return (
    <>
      <h1>{project.name}</h1>
      <p>{project.summary[lang]}</p>
    </>
  );
}
