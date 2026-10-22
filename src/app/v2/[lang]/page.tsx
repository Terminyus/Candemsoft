import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V2Hero } from "@/components/v2/home/V2Hero";
import { AboutBand, RoomsIntro, ServicesGrid } from "@/components/v2/home/V2Sections";
import { ProductRooms } from "@/components/v2/rooms/ProductRooms";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: PageProps<"/v2/[lang]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, route: "home", title: dict.meta.homeTitle, description: dict.meta.homeDescription });
}

export default async function V2Home({ params }: PageProps<"/v2/[lang]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <>
      <V2Hero lang={lang} dict={dict} />
      <RoomsIntro dict={dict} />
      <ProductRooms lang={lang} dict={dict} />
      <ServicesGrid lang={lang} dict={dict} />
      <AboutBand lang={lang} dict={dict} />
    </>
  );
}
