import { getSite } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { CtaTerminal } from "@/components/v4/home/CtaTerminal";
import { Deployments, Hero, Modules, ProductGrid } from "@/components/v4/home/Sections";
import { v4Href } from "@/components/v4/nav";

export default async function V4Home({ params }: PageProps<"/v4/[lang]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const { contact } = getSite();
  return (
    <>
      <Hero lang={lang} dict={dict} />
      <ProductGrid lang={lang} dict={dict} />
      <Deployments lang={lang} dict={dict} />
      <Modules lang={lang} dict={dict} />
      <CtaTerminal prompt={dict.v4.ctaPrompt} title={dict.v4.ctaTitle} button={dict.v4.ctaButton} href={v4Href(lang, "contact")} contact={contact} />
    </>
  );
}
