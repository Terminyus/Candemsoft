import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { getProject, getProjects, getServices } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Tag } from "@/components/ui/Tag";
import { ProjectVisual } from "@/components/project/ProjectVisual";

// Unknown values are unmatched routes → app/global-not-found.tsx (server-rendered 404).
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getProjects().map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projeler/[slug]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({
    lang,
    route: "projects",
    rest: [slug],
    title: project.name,
    description: project.summary[lang],
  });
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projeler/[slug]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.projectPage;
  const all = getProjects();
  const project = getProject((await params).slug);
  if (!project) notFound();

  const next = all[(all.indexOf(all.find((p) => p.slug === project.slug)!) + 1) % all.length]!;
  const host = new URL(project.url).host.replace(/^www\./, "");
  const serviceNames = getServices()
    .filter((s) => project.services.includes(s.slug))
    .map((s) => s.title[lang]);
  const meta = [
    { k: t.type, v: project.type[lang] },
    { k: t.sector, v: project.sector[lang] },
    project.year ? { k: t.year, v: String(project.year) } : null,
    serviceNames.length ? { k: t.services, v: serviceNames.join(", ") } : null,
    project.stack.length ? { k: t.stack, v: project.stack.join(", ") } : null,
  ].filter((m): m is { k: string; v: string } => m !== null);
  const story = (["challenge", "approach", "outcome"] as const)
    .map((key) => ({ key, title: t[key], body: project.caseStudy[key][lang] }))
    .filter((s) => s.body.trim());

  return (
    <article>
      <header data-surface="ink">
        <div className="container-site grid-site gap-y-8 pb-(--section-sm) pt-[clamp(3rem,6vw,6rem)]">
          <nav className="col-span-full" aria-label="breadcrumb">
            <Link href={href(lang, "projects")} className="font-mono text-mono-sm text-stone-400 hover:text-paper-100">
              ← {dict.common.backToProjects}
            </Link>
          </nav>
          <h1 className="col-span-full font-display-tight text-display font-semibold">{project.name}</h1>
          <p className="col-span-full text-lead text-stone-400 md:col-span-4 lg:col-span-5">{project.summary[lang]}</p>
          <div className="col-span-full flex flex-wrap items-start gap-2 md:col-span-2 md:justify-end lg:col-span-4 lg:col-start-9">
            {project.ownProduct && <Tag tone="signal">{dict.projectsPage.ownProduct}</Tag>}
            {project.categories.map((c) => (
              <Tag key={c}>{dict.projectsPage.categories[c]}</Tag>
            ))}
          </div>
        </div>
      </header>

      {project.status === "live" && (
        <section data-surface="ink" aria-label={t.desktop} className="pb-(--section-sm)">
          <div className="container-site grid-site gap-y-6">
            <figure className="col-span-full lg:col-span-9">
              <ProjectVisual
                project={project}
                variant="desktop"
                priority
                pendingLabel={dict.home.visualPending}
                offlineLabel={dict.projectsPage.offline}
                alt={dict.common.shotDesktop.replace("{name}", project.name)}
                sizes="(min-width: 1024px) 70vw, 100vw"
              />
              <figcaption className="mt-3 font-mono text-mono-sm text-stone-400">{t.desktop} · 1440px</figcaption>
            </figure>
            <figure className="col-span-2 md:col-span-2 lg:col-span-3 lg:self-end">
              <ProjectVisual
                project={project}
                variant="mobile"
                pendingLabel={dict.home.visualPending}
                offlineLabel={dict.projectsPage.offline}
                alt={dict.common.shotMobile.replace("{name}", project.name)}
                sizes="(min-width: 1024px) 22vw, 50vw"
              />
              <figcaption className="mt-3 font-mono text-mono-sm text-stone-400">{t.mobile} · 390px</figcaption>
            </figure>
          </div>
        </section>
      )}

      <section data-surface="paper" className="py-(--section-sm)">
        <div className="container-site grid-site gap-y-10">
          <div className="col-span-full lg:col-span-4">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
              {meta.map((m) => (
                <div key={m.k} className="border-t border-paper-200 pt-3">
                  <MonoLabel as="dt">{m.k}</MonoLabel>
                  <dd className="mt-1">{m.v}</dd>
                </div>
              ))}
            </dl>
            <div className="pt-8">
              {project.status === "live" ? (
                <>
                  <ButtonLink href={project.url} arrow="↗">
                    {t.visit}
                  </ButtonLink>
                  <p className="mt-2 font-mono text-mono-sm text-stone-600">{host}</p>
                </>
              ) : (
                <p className="font-mono text-mono-sm text-stone-600">
                  <span className="line-through">{host}</span> · {dict.projectsPage.offline}
                </p>
              )}
            </div>
          </div>

          {story.length > 0 && (
            <div className="col-span-full space-y-12 lg:col-span-7 lg:col-start-6">
              {story.map((s, i) => (
                <section key={s.key} aria-labelledby={`story-${s.key}`}>
                  <MonoLabel as="p">
                    <span className="text-ember">{String(i + 1).padStart(2, "0")}</span>
                  </MonoLabel>
                  <h2 id={`story-${s.key}`} className="mt-2 text-h3">
                    {s.title}
                  </h2>
                  <p className="mt-4 text-lead">{s.body}</p>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>

      <nav data-surface="ink" aria-label={t.next} className="group relative">
        <div className="container-site flex flex-wrap items-end justify-between gap-6 py-(--section-sm)">
          <div>
            <MonoLabel as="p">{t.next}</MonoLabel>
            <Link
              href={href(lang, "projects", next.slug)}
              className="mt-3 block font-display-tight text-h1 font-semibold transition-colors after:absolute after:inset-0 group-hover:text-signal"
            >
              {next.name}
            </Link>
          </div>
          <span
            aria-hidden
            className="font-display text-h1 transition-transform duration-(--duration-2) ease-(--ease-out) group-hover:translate-x-2"
          >
            →
          </span>
        </div>
      </nav>
    </article>
  );
}
