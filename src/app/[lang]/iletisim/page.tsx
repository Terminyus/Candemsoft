import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";

export async function generateMetadata({ params }: PageProps<"/[lang]/iletisim">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLang(params));
  return { title: dict.nav.contact };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/iletisim">) {
  const dict = await getDictionary(await resolveLang(params));
  return <h1>{dict.nav.contact}</h1>;
}
