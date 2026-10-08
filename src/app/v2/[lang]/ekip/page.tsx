import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V2PageHead } from "@/components/v2/V2PageHead";
import { V2TeamGrid } from "@/components/v2/V2TeamGrid";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/v2/[lang]/ekip">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, route: "team", title: dict.nav.team, description: dict.meta.siteDescription });
}

export default async function Page({ params }: PageProps<"/v2/[lang]/ekip">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <>
      <V2PageHead kicker={dict.teamPage.label} title={dict.teamPage.title} lead={dict.teamPage.lead} />
      <section className="container-site py-(--section-sm)">
        <V2TeamGrid lang={lang} />
      </section>
    </>
  );
}
