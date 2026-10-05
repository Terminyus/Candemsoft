import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";

export async function generateMetadata({ params }: PageProps<"/[lang]/hizmetler">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLang(params));
  return { title: dict.nav.services };
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/hizmetler">) {
  const dict = await getDictionary(await resolveLang(params));
  return <h1>{dict.nav.services}</h1>;
}
