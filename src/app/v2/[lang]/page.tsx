import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V2Hero } from "@/components/v2/home/V2Hero";
import { AboutBand, ClientWork, RoomsIntro, ServicesGrid } from "@/components/v2/home/V2Sections";
import { ProductRooms } from "@/components/v2/rooms/ProductRooms";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: PageProps<"/v2/[lang]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  // No `title` here: the layout's default title applies (an explicit undefined would erase it).
  const meta = pageMetadata({ lang, route: "home", description: dict.meta.siteDescription });
  delete meta.title;
  return meta;
}

export default async function V2Home({ params }: PageProps<"/v2/[lang]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <>
      <V2Hero lang={lang} dict={dict} />
      <RoomsIntro dict={dict} />
      <ProductRooms lang={lang} dict={dict} />
      <ClientWork lang={lang} dict={dict} />
      <ServicesGrid lang={lang} dict={dict} />
      <AboutBand lang={lang} dict={dict} />
    </>
  );
}
