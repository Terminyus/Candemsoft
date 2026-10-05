import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { PageIntro } from "@/components/page/PageIntro";

export async function generateMetadata({ params }: PageProps<"/[lang]/gizlilik">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLang(params));
  return { title: dict.nav.privacy };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/gizlilik">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const { default: Body } = await import(`@content/legal/privacy.${lang}.mdx`);
  return (
    <>
      <PageIntro label={dict.privacyPage.label} title={dict.privacyPage.title} />
      <section data-surface="paper" className="py-(--section-sm)">
        <div className="container-site grid-site">
          <div className="col-span-full lg:col-span-7 lg:col-start-3">
            <Body />
          </div>
        </div>
      </section>
    </>
  );
}
