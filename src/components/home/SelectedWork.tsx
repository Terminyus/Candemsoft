import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";
import type { Dictionary } from "@/lib/dictionary";
import { getProjects, type Project } from "@/lib/content";
import { ButtonLink } from "@/components/ui/Button";
import { Index, MonoLabel } from "@/components/ui/MonoLabel";
import { Tag } from "@/components/ui/Tag";
import { ProjectVisual } from "@/components/project/ProjectVisual";

/*
 * An even 2×2 grid: every card is the same size and built the same way, so the
 * screenshots are what differ. Desktop shot with the phone overlapping its corner,
 * then one aligned caption row.
 */
function WorkCard({ project, n, lang, dict }: { project: Project; n: number; lang: Locale; dict: Dictionary }) {
  return (
    <article className="group relative flex flex-col">
      <div className="relative pb-8 pr-6 sm:pr-10">
        <div className="transition-transform duration-(--duration-3) ease-(--ease-out) group-hover:-translate-y-1">
          <ProjectVisual
            project={project}
            variant="desktop"
            pendingLabel={dict.home.visualPending}
            alt={dict.common.shotDesktop.replace("{name}", project.name)}
            sizes="(min-width: 1024px) 44vw, 100vw"
          />
        </div>
        <div className="absolute bottom-0 right-0 w-[24%] max-w-36 transition-transform duration-(--duration-3) ease-(--ease-out) group-hover:-translate-y-2">
          <ProjectVisual
            project={project}
            variant="mobile"
            pendingLabel={dict.home.visualPending}
            alt={dict.common.shotMobile.replace("{name}", project.name)}
            sizes="150px"
            className="rounded-lg shadow-[0_20px_40px_-18px_rgba(14,13,11,0.55)] ring-4 ring-ink-950"
          />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 border-t border-paper-200 pt-4">
        <Index n={n} />
        <div>
          <h3 className="font-display text-h3 font-semibold">
            <Link href={href(lang, "projects", project.slug)} className="after:absolute after:inset-0">
              {project.name}
            </Link>
          </h3>
          <MonoLabel as="p" className="mt-1">
            {project.type[lang]} · {project.sector[lang]}
          </MonoLabel>
          {project.ownProduct && (
            <Tag tone="signal" className="mt-3 sm:hidden">
              {dict.projectsPage.ownProduct}
            </Tag>
          )}
        </div>
        {project.ownProduct && (
          <Tag tone="signal" className="hidden sm:inline-flex">
            {dict.projectsPage.ownProduct}
          </Tag>
        )}
      </div>
    </article>
  );
}

export function SelectedWork({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const all = getProjects();
  const featured = all.filter((p) => p.featured && p.status === "live").slice(0, 4);
  return (
    <section data-surface="paper" aria-labelledby="work-title" className="py-(--section)">
      <div className="container-site">
        <div className="grid-site items-end gap-y-6">
          <div className="col-span-full flex flex-col gap-4 lg:col-span-6">
            <MonoLabel as="p">{dict.home.workLabel}</MonoLabel>
            <h2 id="work-title" className="text-h2">
              {dict.home.workTitle}
            </h2>
          </div>
          <p className="col-span-full text-stone-600 lg:col-span-4 lg:col-start-9">{dict.home.workBody}</p>
        </div>

        <div className="mt-12 grid gap-x-(--gap) gap-y-16 md:grid-cols-2 lg:gap-x-16">
          {featured.map((project, i) => (
            <WorkCard key={project.slug} project={project} n={i + 1} lang={lang} dict={dict} />
          ))}
        </div>

        <div className="mt-14 flex justify-end">
          <ButtonLink href={href(lang, "projects")} variant="outline">
            {dict.common.allProjects} ({all.length})
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
