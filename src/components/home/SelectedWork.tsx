import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";
import type { Dictionary } from "@/lib/dictionary";
import { getProjects, type Project } from "@/lib/content";
import { ButtonLink } from "@/components/ui/Button";
import { Index, MonoLabel } from "@/components/ui/MonoLabel";
import { cn } from "@/components/ui/cn";
import { ProjectVisual } from "@/components/project/ProjectVisual";

/*
 * Four slots, deliberately unequal: a wide desktop shot, a tall phone shot
 * pushed down, then the reverse. Real screenshots carry the section.
 */
const slots = [
  { variant: "desktop", cls: "lg:col-span-8 lg:row-start-2", sizes: "(min-width: 1024px) 60vw, 100vw" },
  { variant: "mobile", cls: "col-span-2 md:col-span-3 lg:col-span-3 lg:col-start-10 lg:row-start-2 lg:mt-48", sizes: "(min-width: 1024px) 22vw, 50vw" },
  { variant: "mobile", cls: "col-span-2 md:col-span-3 lg:col-span-3 lg:col-start-2 lg:row-start-3 lg:mt-8", sizes: "(min-width: 1024px) 22vw, 50vw" },
  { variant: "desktop", cls: "lg:col-span-7 lg:col-start-6 lg:row-start-3 lg:mt-56", sizes: "(min-width: 1024px) 52vw, 100vw" },
] as const;

function Caption({ project, n, lang }: { project: Project; n: number; lang: Locale }) {
  return (
    <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-paper-200 pt-3">
      <div>
        <h3 className="font-display text-h3 font-semibold">
          <Link href={href(lang, "projects", project.slug)} className="after:absolute after:inset-0">
            {project.name}
          </Link>
        </h3>
        <MonoLabel as="p" className="mt-1">
          {project.type[lang]} · {project.sector[lang]}
        </MonoLabel>
      </div>
      <Index n={n} className="shrink-0" />
    </div>
  );
}

export function SelectedWork({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const all = getProjects();
  const featured = all.filter((p) => p.featured).slice(0, slots.length);
  return (
    <section data-surface="paper" aria-labelledby="work-title" className="py-(--section)">
      <div className="container-site grid-site gap-y-12">
        <div className="col-span-full flex flex-col gap-4 lg:col-span-5">
          <MonoLabel as="p">{dict.home.workLabel}</MonoLabel>
          <h2 id="work-title" className="text-h2">
            {dict.home.workTitle}
          </h2>
        </div>
        <p className="col-span-full self-end text-stone-600 lg:col-span-4 lg:col-start-9">{dict.home.workBody}</p>

        {featured.map((project, i) => {
          const slot = slots[i]!;
          return (
            <article key={project.slug} className={cn("group relative", slot.variant === "desktop" && "col-span-full", slot.cls)}>
              <div className="transition-transform duration-(--duration-3) ease-(--ease-out) group-hover:-translate-y-1">
                <ProjectVisual
                  project={project}
                  variant={slot.variant}
                  pendingLabel={dict.home.visualPending}
                  alt={(slot.variant === "desktop" ? dict.common.shotDesktop : dict.common.shotMobile).replace("{name}", project.name)}
                  sizes={slot.sizes}
                />
              </div>
              <Caption project={project} n={i + 1} lang={lang} />
            </article>
          );
        })}

        <div className="col-span-full flex justify-end pt-4">
          <ButtonLink href={href(lang, "projects")} variant="outline">
            {dict.common.allProjects} ({all.length})
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
