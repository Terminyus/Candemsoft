import { locales } from "@/i18n/config";
import { getProjects } from "@/lib/content";
import { getProject } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { renderOg, ogContentType, ogSize } from "@/lib/og";
import { resolveLang } from "@/lib/params";

export const alt = "Candemsoft";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.flatMap((lang) => getProjects().map((p) => ({ lang, slug: p.slug })));
}

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const project = getProject((await params).slug);
  if (!project) return renderOg({ label: dict.projectsPage.label, title: dict.projectsPage.title });
  return renderOg({
    label: `${dict.projectsPage.label} / ${project.type[lang]}`,
    title: project.name,
    footer: project.status === "live" ? new URL(project.url).host.replace(/^www\./, "") : undefined,
  });
}
