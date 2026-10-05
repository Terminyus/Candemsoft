import type { Metadata } from "next";
import Link from "next/link";
import { getProjects, publicFileExists } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { Halftone } from "@/components/v3/Halftone";
import { V3PageHead } from "@/components/v3/V3PageHead";
import { SectionBand } from "@/components/v3/front/Front";
import { v3Href } from "@/components/v3/nav";

export async function generateMetadata({ params }: PageProps<"/v3/[lang]/projeler">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.projects };
}

export default async function Page({ params }: PageProps<"/v3/[lang]/projeler">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.v3;
  const all = getProjects();
  const live = all.filter((p) => p.status === "live");
  const offline = all.filter((p) => p.status === "offline");
  return (
    <>
      <V3PageHead kicker={dict.projectsPage.label} title={dict.projectsPage.title} deck={dict.projectsPage.lead} />
      <div className="container-site">
        <div className="grid gap-x-8 gap-y-10 pt-8 md:grid-cols-2 lg:grid-cols-3">
          {live.map((p, i) => (
            <article key={p.slug} aria-labelledby={`h-${p.slug}`} className="border-t-2 border-news-ink pt-3">
              <p className="v3-kicker text-ember">
                {p.ownProduct ? dict.projectsPage.ownProduct : p.sector[lang]} · {p.type[lang]}
              </p>
              <h2 id={`h-${p.slug}`} className="v3-headline mt-1 text-3xl">
                <Link href={v3Href(lang, "projects", p.slug)} className="hover:text-ember">
                  {p.name}
                </Link>
              </h2>
              {publicFileExists(p.images.desktop) && (
                <Link href={v3Href(lang, "projects", p.slug)} className="mt-3 block" tabIndex={-1} aria-hidden>
                  <Halftone src={p.images.desktop} alt="" sizes="(min-width: 1024px) 28vw, (min-width: 768px) 45vw, 100vw" priority={i === 0} />
                </Link>
              )}
              <p className="mt-3 leading-snug">{p.summary[lang]}</p>
            </article>
          ))}
        </div>
        <SectionBand title={t.archiveTitle} aside={t.archiveNote} />
        <ul className="divide-y divide-news-ink/20">
          {offline.map((p) => (
            <li key={p.slug} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
              <Link href={v3Href(lang, "projects", p.slug)} className="v3-sub text-xl hover:text-ember">
                {p.name}
              </Link>
              <span className="italic text-news-gray">
                {p.type[lang]} · {p.sector[lang]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
