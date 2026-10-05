import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return <h1>{dict.meta.siteTitle}</h1>;
}
