import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V3PageHead } from "@/components/v3/V3PageHead";
import { V3Team } from "@/components/v3/V3Team";

export async function generateMetadata({ params }: PageProps<"/v3/[lang]/ekip">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.team };
}

export default async function Page({ params }: PageProps<"/v3/[lang]/ekip">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <>
      <V3PageHead kicker={dict.v3.newsroom} title={dict.teamPage.title} deck={dict.teamPage.lead} />
      <div className="container-site pt-8">
        <V3Team lang={lang} />
      </div>
    </>
  );
}
