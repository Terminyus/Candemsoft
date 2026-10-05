import { locales } from "@/i18n/config";
import { getPostSlugs } from "@/lib/content";
import { getPost } from "@/lib/content";
import { renderOg, ogContentType, ogSize } from "@/lib/og";
import { resolveLang } from "@/lib/params";

export const alt = "Candemsoft";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.flatMap((lang) => getPostSlugs(lang).map((slug) => ({ lang, slug })));
}

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const lang = await resolveLang(params);
  const { meta } = await getPost(lang, (await params).slug);
  return renderOg({ label: `blog / ${meta.date}`, title: meta.title });
}
