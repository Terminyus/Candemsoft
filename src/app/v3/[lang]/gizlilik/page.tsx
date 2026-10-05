import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V3PageHead } from "@/components/v3/V3PageHead";

export async function generateMetadata({ params }: PageProps<"/v3/[lang]/gizlilik">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.privacy };
}

export default async function Page({ params }: PageProps<"/v3/[lang]/gizlilik">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const { default: Body } = await import(`@content/legal/privacy.${lang}.mdx`);
  return (
    <>
      <V3PageHead kicker={dict.privacyPage.label} title={dict.privacyPage.title} />
      <div className="container-site pt-8">
        <div className="mx-auto max-w-2xl text-[1.05rem] leading-[1.7]">
          <Body />
        </div>
      </div>
    </>
  );
}
