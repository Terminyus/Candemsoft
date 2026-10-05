import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V5PageHead } from "@/components/v5/V5PageHead";

export async function generateMetadata({ params }: PageProps<"/v5/[lang]/urunler">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.products };
}
import { Products } from "@/components/v5/home/Sections";

export default async function Page({ params }: PageProps<"/v5/[lang]/urunler">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <>
      <V5PageHead lang={lang} dict={dict} title={dict.productsPage.title} lead={dict.productsPage.lead} />
      <Products lang={lang} dict={dict} />
    </>
  );
}
