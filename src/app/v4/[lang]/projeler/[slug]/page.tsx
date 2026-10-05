import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { getProject, getProjects, getServices, publicFileExists } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { cn } from "@/components/ui/cn";
import { ProjectVisual } from "@/components/project/ProjectVisual";
import { V4PageHead } from "@/components/v4/V4PageHead";
import { v4Href } from "@/components/v4/nav";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getProjects().map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/v4/[lang]/projeler/[slug]">): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: p.name } : {};
}

export default async function Page({ params }: PageProps<"/v4/[lang]/projeler/[slug]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.v4;
  const all = getProjects();
  const p = getProject((await params).slug);
  if (!p) notFound();
  const live = p.status === "live";
  const next = all[(all.findIndex((x) => x.slug === p.slug) + 1) % all.length]!;
  const host = new URL(p.url).host.replace(/^www\./, "");
  const meta: [string, string][] = [
    ["status", live ? t.ready : t.offline],
    ["domain", host],
    ["env", t.production],
    ["type", p.type[lang]],
    ["sector", p.sector[lang]],
    ["services", getServices().filter((s) => p.services.includes(s.slug)).map((s) => s.title[lang]).join(", ")],
    ...(p.ownProduct ? ([["owner", "candemsoft"]] as [string, string][]) : []),
  ];
  return (
    <>
      <V4PageHead path={`$ candemsoft inspect ${p.slug}`} title={p.name} lead={p.summary[lang]} />
      <div className="container-site grid gap-8 pt-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="grid items-end gap-4 sm:grid-cols-[3fr_1fr]">
          {live && publicFileExists(p.images.desktop) ? (
            <>
              <ProjectVisual project={p} variant="desktop" priority pendingLabel={dict.home.visualPending} alt={dict.common.shotDesktop.replace("{name}", p.name)} sizes="(min-width: 1024px) 50vw, 100vw" className="rounded-xl ring-1 ring-dev-line" />
              <ProjectVisual project={p} variant="mobile" pendingLabel={dict.home.visualPending} alt={dict.common.shotMobile.replace("{name}", p.name)} sizes="(min-width: 1024px) 16vw, 40vw" className="mx-auto w-1/2 rounded-xl ring-1 ring-dev-line sm:w-full" />
            </>
          ) : (
            <pre className="rounded-xl border border-dev-line bg-dev-surface p-5 v4-mono text-sm text-[#f87171] sm:col-span-2">
              {`Error: ENOTFOUND ${host}\n  ${dict.v3.archiveNote}`}
            </pre>
          )}
        </div>
        <aside className="self-start rounded-xl border border-dev-line bg-dev-surface p-5">
          <dl className="space-y-2 v4-mono text-sm">
            {meta.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6rem_1fr] gap-3">
                <dt className="text-dev-comment">{k}:</dt>
                <dd className={cn(k === "status" ? (live ? "text-dev-str" : "text-[#f87171]") : k === "domain" ? "text-dev-key" : "text-dev-text")}>{v}</dd>
              </div>
            ))}
          </dl>
          {live && (
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-5 flex min-h-11 items-center justify-center rounded-md bg-signal font-semibold text-dev-bg transition-transform hover:-translate-y-0.5">
              {dict.projectPage.visit} ↗
            </a>
          )}
        </aside>
      </div>
      <nav aria-label={dict.projectPage.next} className="container-site pt-(--section-sm)">
        <Link href={v4Href(lang, "projects", next.slug)} className="group flex items-center justify-between gap-4 rounded-xl border border-dev-line p-5 hover:border-signal/60">
          <span className="v4-mono text-sm text-dev-comment">{dict.projectPage.next} →</span>
          <span className="v4-title text-3xl group-hover:text-signal">{next.name}</span>
        </Link>
      </nav>
    </>
  );
}
