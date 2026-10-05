import type { Metadata } from "next";
import Link from "next/link";
import { getProjects, publicFileExists } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V4PageHead } from "@/components/v4/V4PageHead";
import { Deployments } from "@/components/v4/home/Sections";
import { ProjectVisual } from "@/components/project/ProjectVisual";
import { v4Href } from "@/components/v4/nav";

export async function generateMetadata({ params }: PageProps<"/v4/[lang]/projeler">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.projects };
}

export default async function Page({ params }: PageProps<"/v4/[lang]/projeler">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const live = getProjects().filter((p) => p.status === "live" && publicFileExists(p.images.desktop));
  return (
    <>
      <V4PageHead path="$ candemsoft projects ls --all" title={dict.projectsPage.title} lead={dict.projectsPage.lead} />
      <section aria-label={dict.projectsPage.label} className="container-site grid gap-6 pt-12 md:grid-cols-2">
        {live.map((p, i) => (
          <Link key={p.slug} href={v4Href(lang, "projects", p.slug)} className="v4-rise group overflow-hidden rounded-xl border border-dev-line bg-dev-surface transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-signal/60">
            <div className="flex items-center gap-2 border-b border-dev-line px-4 py-2 v4-mono text-xs text-dev-muted">
              <span className="v4-pulse size-2 rounded-full bg-dev-str" /> {new URL(p.url).host.replace(/^www\./, "")}
            </div>
            <ProjectVisual
              project={p}
              variant="desktop"
              priority={i === 0}
              pendingLabel={dict.home.visualPending}
              alt={dict.common.shotDesktop.replace("{name}", p.name)}
              sizes="(min-width: 768px) 45vw, 100vw"
              className="rounded-none ring-0"
            />
            <div className="flex items-baseline justify-between gap-4 p-4">
              <span className="text-xl font-semibold group-hover:text-signal">{p.name}</span>
              <span className="v4-mono text-xs text-dev-comment">{p.type[lang]}</span>
            </div>
          </Link>
        ))}
      </section>
      <Deployments lang={lang} dict={dict} />
    </>
  );
}
