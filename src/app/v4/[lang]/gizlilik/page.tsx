import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V4PageHead } from "@/components/v4/V4PageHead";

export async function generateMetadata({ params }: PageProps<"/v4/[lang]/gizlilik">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.privacy };
}

export default async function Page({ params }: PageProps<"/v4/[lang]/gizlilik">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const { default: Body } = await import(`@content/legal/privacy.${lang}.mdx`);
  return (
    <>
      <V4PageHead path="$ cat PRIVACY.md" title={dict.privacyPage.title} />
      <div className="container-site pt-10">
        <div className="mx-auto max-w-2xl text-dev-text [&_a]:text-dev-key">
          <Body />
        </div>
      </div>
    </>
  );
}
