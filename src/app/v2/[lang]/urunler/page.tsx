import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V2PageHead } from "@/components/v2/V2PageHead";
import { ProductRooms } from "@/components/v2/rooms/ProductRooms";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/v2/[lang]/urunler">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, route: "products", title: dict.nav.products, description: dict.meta.siteDescription });
}

export default async function Page({ params }: PageProps<"/v2/[lang]/urunler">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <>
      <V2PageHead kicker={dict.v2.roomsKicker} title={dict.productsPage.title} lead={dict.productsPage.lead} />
      <ProductRooms lang={lang} dict={dict} level={2} />
    </>
  );
}
