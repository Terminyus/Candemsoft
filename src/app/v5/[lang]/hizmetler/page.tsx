import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V5PageHead } from "@/components/v5/V5PageHead";

export async function generateMetadata({ params }: PageProps<"/v5/[lang]/hizmetler">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.services };
}
import { Cta, Solutions, Tech } from "@/components/v5/home/Sections";

export default async function Page({ params }: PageProps<"/v5/[lang]/hizmetler">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <>
      <V5PageHead lang={lang} dict={dict} title={dict.servicesPage.title} lead={dict.servicesPage.lead} />
      <Solutions lang={lang} dict={dict} detailed />
      <div className="border-t border-corp-line">
        <Tech dict={dict} />
      </div>
      <Cta lang={lang} dict={dict} />
    </>
  );
}
