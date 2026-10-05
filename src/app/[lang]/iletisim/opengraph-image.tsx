import { locales } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { renderOg, ogContentType, ogSize } from "@/lib/og";
import { resolveLang } from "@/lib/params";

export const alt = "Candemsoft";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const dict = await getDictionary(await resolveLang(params));
  return renderOg({ label: dict.contactPage.label, title: dict.contactPage.title });
}
