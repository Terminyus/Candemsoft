import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { Front } from "@/components/v3/front/Front";

export default async function V3Home({ params }: PageProps<"/v3/[lang]">) {
  const lang = await resolveLang(params);
  return <Front lang={lang} dict={await getDictionary(lang)} />;
}
