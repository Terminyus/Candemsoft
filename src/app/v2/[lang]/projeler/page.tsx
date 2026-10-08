import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { ProjectVisual } from "@/components/project/ProjectVisual";
import { V2PageHead } from "@/components/v2/V2PageHead";
import { v2Href } from "@/components/v2/nav";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/v2/[lang]/projeler">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, route: "projects", title: dict.nav.projects, description: dict.meta.siteDescription });
}

export default async function Page({ params }: PageProps<"/v2/[lang]/projeler">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const projects = getProjects();
  const live = projects.filter((p) => p.status === "live");
  const offline = projects.filter((p) => p.status === "offline");
  return (
    <>
      <V2PageHead kicker={dict.projectsPage.label} title={dict.projectsPage.title} lead={dict.projectsPage.lead} />
      <section className="container-site py-(--section-sm)">
        <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {live.map((p, i) => (
            <li key={p.slug} className="group relative">
              <ProjectVisual
                project={p}
                variant="desktop"
                pendingLabel={dict.home.visualPending}
                alt={dict.common.shotDesktop.replace("{name}", p.name)}
                sizes="(min-width: 768px) 45vw, 100vw"
                priority={i === 0}
                className="rounded-2xl ring-1 ring-ink-950"
              />
              <div className="mt-4 flex items-start justify-between gap-4 border-b border-ink-950 pb-4">
                <div>
                  <h2 className="v2-heading text-2xl">
                    <Link href={v2Href(lang, "projects", p.slug)} className="after:absolute after:inset-0 group-hover:text-ember">
                      {p.name}
                    </Link>
                  </h2>
                  <p className="mt-1 font-mono text-mono-sm text-stone-600">
                    {p.type[lang]} · {p.sector[lang]}
                  </p>
                </div>
                {p.ownProduct && (
                  <span className="shrink-0 rounded-full bg-signal px-3 py-1 font-mono text-mono-sm text-ink-950">{dict.projectsPage.ownProduct}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
        {offline.length > 0 && (
          <ul className="mt-16 border-t border-ink-950">
            {offline.map((p) => (
              <li key={p.slug} className="relative flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-950/20 py-4">
                <Link href={v2Href(lang, "projects", p.slug)} className="v2-heading text-xl after:absolute after:inset-0 hover:text-ember">
                  {p.name}
                </Link>
                <span className="font-mono text-mono-sm text-stone-600">
                  {p.type[lang]} · {dict.v2.clientsOffline}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
