import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V5PageHead } from "@/components/v5/V5PageHead";

export async function generateMetadata({ params }: PageProps<"/v5/[lang]/gizlilik">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.privacy };
}

export default async function Page({ params }: PageProps<"/v5/[lang]/gizlilik">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const { default: Body } = await import(`@content/legal/privacy.${lang}.mdx`);
  return (
    <>
      <V5PageHead lang={lang} dict={dict} title={dict.privacyPage.title} />
      <div className="container-site py-(--section)">
        <div className="mx-auto max-w-2xl [&_a]:text-ember">
          <Body />
        </div>
      </div>
    </>
  );
}
