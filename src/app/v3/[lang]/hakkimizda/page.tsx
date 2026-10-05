import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V3PageHead } from "@/components/v3/V3PageHead";
import { V3Team } from "@/components/v3/V3Team";
import { SectionBand } from "@/components/v3/front/Front";

export async function generateMetadata({ params }: PageProps<"/v3/[lang]/hakkimizda">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.about };
}

export default async function Page({ params }: PageProps<"/v3/[lang]/hakkimizda">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const a = dict.about;
  return (
    <article>
      <V3PageHead kicker={a.label} title={a.title} deck={a.lead} />
      <div className="container-site">
        <div className="v3-columns v3-dropcap pt-8 text-[1.1rem] leading-relaxed [&>p]:mb-4">
          <p>
            <strong className="font-[650]">{a.clientTitle}.</strong> {a.clientBody}
          </p>
          <p>
            <strong className="font-[650]">{a.ownTitle}.</strong> {a.ownBody}
          </p>
        </div>
        <SectionBand title={a.principlesLabel} />
        <ol className="grid gap-8 pt-6 md:grid-cols-3 md:divide-x md:divide-news-ink/25">
          {a.principles.map((p, i) => (
            <li key={p.title} className={i > 0 ? "md:pl-8" : ""}>
              <p className="v3-headline text-5xl text-ember">{i + 1}.</p>
              <h3 className="v3-sub mt-2 text-2xl">{p.title}</h3>
              <p className="mt-2 leading-snug">{p.body}</p>
            </li>
          ))}
        </ol>
        <SectionBand id="team" title={dict.teamPage.title} aside={dict.teamPage.lead} />
        <div className="pt-6">
          <V3Team lang={lang} />
        </div>
      </div>
    </article>
  );
}
