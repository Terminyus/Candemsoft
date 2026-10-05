import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";

export async function generateMetadata({ params }: PageProps<"/[lang]/ekip">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLang(params));
  return { title: dict.nav.team };
}

export default async function TeamPage({ params }: PageProps<"/[lang]/ekip">) {
  const dict = await getDictionary(await resolveLang(params));
  return <h1>{dict.nav.team}</h1>;
}
