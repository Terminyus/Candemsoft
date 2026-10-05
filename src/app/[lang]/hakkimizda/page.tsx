import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";

export async function generateMetadata({ params }: PageProps<"/[lang]/hakkimizda">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLang(params));
  return { title: dict.nav.about };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/hakkimizda">) {
  const dict = await getDictionary(await resolveLang(params));
  return <h1>{dict.nav.about}</h1>;
}
