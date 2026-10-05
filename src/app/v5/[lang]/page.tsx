import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { Blog, Cta, Hero, Products, Shelf, Solutions, Team, Tech, Why, Work } from "@/components/v5/home/Sections";

export default async function V5Home({ params }: PageProps<"/v5/[lang]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <>
      <Hero lang={lang} dict={dict} />
      <Shelf lang={lang} dict={dict} />
      <Solutions lang={lang} dict={dict} />
      <Products lang={lang} dict={dict} />
      <Work lang={lang} dict={dict} />
      <Why lang={lang} dict={dict} />
      <Tech dict={dict} />
      <Team lang={lang} dict={dict} limit={4} />
      <Blog lang={lang} dict={dict} />
      <Cta lang={lang} dict={dict} />
    </>
  );
}
