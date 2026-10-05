import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V4PageHead } from "@/components/v4/V4PageHead";
import { V4Team } from "@/components/v4/V4Team";

export async function generateMetadata({ params }: PageProps<"/v4/[lang]/ekip">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.team };
}

export default async function Page({ params }: PageProps<"/v4/[lang]/ekip">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <>
      <V4PageHead path="$ ls ./team" title={dict.teamPage.title} lead={dict.teamPage.lead} />
      <div className="container-site pt-12">
        <V4Team lang={lang} />
      </div>
    </>
  );
}
