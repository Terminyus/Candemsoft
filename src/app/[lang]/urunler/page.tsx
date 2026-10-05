import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";

export async function generateMetadata({ params }: PageProps<"/[lang]/urunler">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLang(params));
  return { title: dict.nav.products };
}

export default async function ProductsPage({ params }: PageProps<"/[lang]/urunler">) {
  const dict = await getDictionary(await resolveLang(params));
  return <h1>{dict.nav.products}</h1>;
}
