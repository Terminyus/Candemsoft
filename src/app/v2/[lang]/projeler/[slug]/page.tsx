import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { getProductByProject, getProject, getProjects, getServices } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { ProjectVisual } from "@/components/project/ProjectVisual";
import { V2PageHead } from "@/components/v2/V2PageHead";
import { v2Href } from "@/components/v2/nav";
import {
  breadcrumbJsonLd,
  jsonLd,
  mergeJsonLd,
  pageBreadcrumbs,
  pageMetadata,
  siteUrl,
  softwareJsonLd,
} from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getProjects().map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/v2/[lang]/projeler/[slug]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const p = getProject((await params).slug);
  if (!p) return {};
  const title = p.metaTitle?.[lang] ?? `${p.name} | Candemsoft`;
  return pageMetadata({
    lang,
    route: "projects",
    rest: [p.slug],
    title,
    description: p.summary[lang],
    image: p.images?.desktop,
  });
}

export default async function Page({ params }: PageProps<"/v2/[lang]/projeler/[slug]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.projectPage;
  const all = getProjects();
  const project = getProject((await params).slug);
  if (!project) notFound();
  const next = all[(all.findIndex((p) => p.slug === project.slug) + 1) % all.length]!;
  const services = getServices().filter((s) => project.services.includes(s.slug)).map((s) => s.title[lang]);
  const story = (["challenge", "approach", "outcome"] as const).filter((k) => project.caseStudy[k][lang]?.trim());
  const product = getProductByProject(project.slug);
  const projectUrl = `${siteUrl}${href(lang, "projects", project.slug)}`;
  const breadcrumbs = breadcrumbJsonLd(pageBreadcrumbs(lang, "projects", { name: project.name, url: projectUrl }));
  const productSchema = product ? softwareJsonLd(lang, product, project.name, projectUrl) : null;
  const merged = mergeJsonLd(productSchema, breadcrumbs);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(merged)} />
      <V2PageHead kicker={`${dict.projectsPage.label} / ${project.type[lang]}`} title={project.name} lead={project.summary[lang]}>
        <div className="container-site flex flex-wrap items-center gap-x-10 gap-y-3 pb-8 font-mono text-mono-sm">
          <span>
            {t.sector}: {project.sector[lang]}
          </span>
          {services.length > 0 && (
            <span>
              {t.services}: {services.join(", ")}
            </span>
          )}
          {project.status === "live" ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex min-h-11 items-center rounded-full bg-ink-950 px-6 font-archivo text-sm font-semibold text-white hover:bg-signal hover:text-ink-950">
              {t.visit} ↗
            </a>
          ) : (
            <span className="ml-auto text-stone-600">{dict.v2.clientsOffline}</span>
          )}
        </div>
      </V2PageHead>
      {project.status === "live" && (
        <section aria-label={t.desktop} className="container-site grid items-end gap-6 py-(--section-sm) md:grid-cols-[3fr_1fr]">
          <ProjectVisual
            project={project}
            variant="desktop"
            priority
            pendingLabel={dict.home.visualPending}
            alt={dict.common.shotDesktop.replace("{name}", project.name)}
            sizes="(min-width: 768px) 70vw, 100vw"
            className="rounded-2xl ring-1 ring-ink-950"
          />
          <div className="cv-auto mx-auto w-2/3 md:w-full">
            <ProjectVisual
              project={project}
              variant="mobile"
              pendingLabel={dict.home.visualPending}
              alt={dict.common.shotMobile.replace("{name}", project.name)}
              sizes="(min-width: 768px) 22vw, 60vw"
              className="rounded-2xl ring-1 ring-ink-950"
            />
          </div>
        </section>
      )}
      {story.length > 0 && (
        <section className="cv-auto-sm container-site grid gap-10 pb-(--section-sm) md:grid-cols-3">
          {story.map((k, i) => (
            <div key={k} className="border-t border-ink-950 pt-4">
              <span className="v2-display text-3xl text-signal">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="v2-heading mt-3 text-xl">{t[k]}</h2>
              <p className="mt-3 text-stone-600">{project.caseStudy[k][lang]}</p>
            </div>
          ))}
        </section>
      )}
      <nav aria-label={t.next} className="cv-auto-sm border-t border-ink-950">
        <Link href={v2Href(lang, "projects", next.slug)} prefetch={false} className="container-site group flex items-center justify-between gap-6 py-10">
          <span>
            <span className="block font-mono text-mono-sm text-stone-600">{t.next}</span>
            <span className="v2-display mt-2 block text-[clamp(2rem,1.3rem+3vw,4rem)] group-hover:text-ember">{next.name}</span>
          </span>
          <span aria-hidden className="v2-display text-5xl transition-transform group-hover:translate-x-2">
            →
          </span>
        </Link>
      </nav>
    </>
  );
}
