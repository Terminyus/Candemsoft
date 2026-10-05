import { getDictionary } from "@/lib/dictionary";
import type { Metadata } from "next";
import { resolveLang } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { SelectedWork } from "@/components/home/SelectedWork";
import { ServicesIndex } from "@/components/home/ServicesIndex";
import { ProductsStrip } from "@/components/home/ProductsStrip";
import { ContactBlock } from "@/components/home/ContactBlock";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  // Home keeps the full site title (no "— Candemsoft" template suffix).
  const base = pageMetadata({ lang, route: "home", description: dict.meta.siteDescription });
  const title = dict.meta.siteTitle;
  return { ...base, title: { absolute: title }, openGraph: { ...base.openGraph, title }, twitter: { ...base.twitter, title } };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <>
      <Hero lang={lang} dict={dict} />
      <SelectedWork lang={lang} dict={dict} />
      <ServicesIndex lang={lang} dict={dict} />
      <ProductsStrip lang={lang} dict={dict} />
      <ContactBlock lang={lang} dict={dict} />
    </>
  );
}
