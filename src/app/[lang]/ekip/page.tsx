import type { Metadata } from "next";
import Image from "next/image";
import { getTeam, publicFileExists } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/page/PageIntro";
import { Monogram } from "@/components/ui/Monogram";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { asset } from "@/lib/static";
import { cn } from "@/components/ui/cn";

export async function generateMetadata({ params }: PageProps<"/[lang]/ekip">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, route: "team", title: dict.nav.team, description: dict.teamPage.lead });
}

export default async function TeamPage({ params }: PageProps<"/[lang]/ekip">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.teamPage;
  const team = getTeam();
  const pending = team.some((m) => m.placeholder);

  return (
    <>
      <PageIntro label={t.label} title={t.title} lead={t.lead} />
      <section data-surface="paper" aria-labelledby="page-title" className="py-(--section-sm)">
        <div className="container-site">
          {pending && (
            <p className="mb-8 border-l-2 border-signal pl-4 font-mono text-mono-sm text-stone-600">{t.placeholderNote}</p>
          )}
          <ul className="grid-site gap-y-12">
            {team.map((m, i) => (
              // Every third card drops down a row-step on desktop so the grid reads as people, not a table.
              <li key={`${m.name}-${i}`} className={cn("col-span-2 lg:col-span-3", i % 4 === 1 && "lg:mt-16", i % 4 === 3 && "lg:mt-8")}>
                {m.photo && publicFileExists(m.photo) ? (
                  <div className="relative aspect-[4/5] overflow-hidden bg-paper-200">
                    <Image src={asset(m.photo)} alt={m.name} fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover grayscale" />
                  </div>
                ) : (
                  <Monogram name={m.name} index={i} />
                )}
                <h2 className="mt-4 font-display text-h3 font-extrabold">{m.name}</h2>
                <MonoLabel as="p" className="mt-1">
                  {m.role[lang]}
                </MonoLabel>
                {m.bio[lang] && <p className="mt-3 text-stone-600">{m.bio[lang]}</p>}
                {(m.links.linkedin || m.links.github) && (
                  <p className="mt-3 flex gap-4 font-mono text-mono-sm">
                    {m.links.linkedin && (
                      <a href={m.links.linkedin} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-ember">
                        LinkedIn ↗
                      </a>
                    )}
                    {m.links.github && (
                      <a href={m.links.github} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-ember">
                        GitHub ↗
                      </a>
                    )}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
