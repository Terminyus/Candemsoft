import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { Hero } from "@/components/home/Hero";
import { SelectedWork } from "@/components/home/SelectedWork";
import { ServicesIndex } from "@/components/home/ServicesIndex";
import { ProductsStrip } from "@/components/home/ProductsStrip";
import { ContactBlock } from "@/components/home/ContactBlock";

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
