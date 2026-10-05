import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V5PageHead } from "@/components/v5/V5PageHead";

export async function generateMetadata({ params }: PageProps<"/v5/[lang]/hakkimizda">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.about };
}
import { Cta, Team, Why } from "@/components/v5/home/Sections";

export default async function Page({ params }: PageProps<"/v5/[lang]/hakkimizda">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const a = dict.about;
  return (
    <>
      <V5PageHead lang={lang} dict={dict} title={a.title} lead={a.lead} />
      <div className="container-site grid gap-6 py-(--section) md:grid-cols-2">
        {[
          { t: a.clientTitle, b: a.clientBody },
          { t: a.ownTitle, b: a.ownBody },
        ].map((x, i) => (
          <section key={x.t} className="v4-rise rounded-2xl border border-corp-line p-8">
            <span className="font-mono text-sm text-ember">0{i + 1}</span>
            <h2 className="v5-title mt-2 text-3xl">{x.t}</h2>
            <p className="mt-3 text-lg text-corp-muted">{x.b}</p>
          </section>
        ))}
      </div>
      <Why lang={lang} dict={dict} />
      <Team lang={lang} dict={dict} />
      <div className="pt-(--section)">
        <Cta lang={lang} dict={dict} />
      </div>
    </>
  );
}
