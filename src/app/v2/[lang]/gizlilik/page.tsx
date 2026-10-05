import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V2PageHead } from "@/components/v2/V2PageHead";

export async function generateMetadata({ params }: PageProps<"/v2/[lang]/gizlilik">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.privacy };
}

export default async function Page({ params }: PageProps<"/v2/[lang]/gizlilik">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const { default: Body } = await import(`@content/legal/privacy.${lang}.mdx`);
  return (
    <>
      <V2PageHead kicker={dict.privacyPage.label} title={dict.privacyPage.title} />
      <div className="container-site py-(--section-sm)">
        <div className="mx-auto max-w-2xl">
          <Body />
        </div>
      </div>
    </>
  );
}
