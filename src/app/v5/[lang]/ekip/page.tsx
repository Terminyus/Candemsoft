import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V5PageHead } from "@/components/v5/V5PageHead";
import { v5Href } from "@/components/v5/nav";

export async function generateMetadata({ params }: PageProps<"/v5/[lang]/ekip">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.team };
}
import Image from "next/image";
import { getTeam, publicFileExists } from "@/lib/content";
import { asset } from "@/lib/static";
import { initials } from "@/lib/text";

export default async function Page({ params }: PageProps<"/v5/[lang]/ekip">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <>
      <V5PageHead lang={lang} dict={dict} crumbs={[{ label: dict.nav.about, href: v5Href(lang, "about") }]} title={dict.teamPage.title} lead={dict.teamPage.lead} />
      <ul className="container-site grid grid-cols-2 gap-5 py-(--section) sm:grid-cols-3 lg:grid-cols-4">
        {getTeam().map((m, i) => (
          <li key={`${m.name}-${i}`} className="v4-rise rounded-2xl border border-corp-line p-6 text-center">
            <span className="relative mx-auto grid size-24 place-items-center overflow-hidden rounded-full bg-corp-soft text-2xl font-bold text-ember">
              {m.photo && publicFileExists(m.photo) ? <Image src={asset(m.photo)} alt={m.name} fill sizes="96px" className="object-cover" /> : initials(m.name)}
            </span>
            <p className="mt-4 font-bold">{m.name}</p>
            <p className="text-sm text-corp-muted">{m.role[lang]}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
