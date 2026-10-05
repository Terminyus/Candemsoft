import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V4PageHead } from "@/components/v4/V4PageHead";
import { ProductGrid } from "@/components/v4/home/Sections";

export async function generateMetadata({ params }: PageProps<"/v4/[lang]/urunler">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.products };
}

export default async function Page({ params }: PageProps<"/v4/[lang]/urunler">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <>
      <V4PageHead path="~/candemsoft/apps" title={dict.productsPage.title} lead={dict.productsPage.lead} />
      <ProductGrid lang={lang} dict={dict} detailed />
    </>
  );
}
