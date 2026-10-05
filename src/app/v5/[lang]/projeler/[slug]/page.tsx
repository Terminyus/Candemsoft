import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { getProject, getProjects, getServices, publicFileExists } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { ProjectVisual } from "@/components/project/ProjectVisual";
import { V5PageHead } from "@/components/v5/V5PageHead";
import { v5Href } from "@/components/v5/nav";
import { Cta } from "@/components/v5/home/Sections";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getProjects().map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/v5/[lang]/projeler/[slug]">): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: p.name } : {};
}

export default async function Page({ params }: PageProps<"/v5/[lang]/projeler/[slug]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.projectPage;
  const all = getProjects();
  const p = getProject((await params).slug);
  if (!p) notFound();
  const live = p.status === "live";
  const next = all[(all.findIndex((x) => x.slug === p.slug) + 1) % all.length]!;
  const host = new URL(p.url).host.replace(/^www\./, "");
  const services = getServices().filter((s) => p.services.includes(s.slug)).map((s) => s.title[lang]);
  const meta = [
    { k: dict.v5.status, v: live ? "Live" : "Offline" },
    { k: t.type, v: p.type[lang] },
    { k: t.sector, v: p.sector[lang] },
    p.year ? { k: t.year, v: String(p.year) } : null,
    services.length ? { k: t.services, v: services.join(", ") } : null,
    p.stack.length ? { k: t.stack, v: p.stack.join(", ") } : null,
  ].filter((m): m is { k: string; v: string } => m !== null);
  const story = (["challenge", "approach", "outcome"] as const).map((key) => ({ key, title: t[key], body: p.caseStudy[key][lang] })).filter((s) => s.body.trim());

  return (
    <article>
      <V5PageHead
        lang={lang}
        dict={dict}
        crumbs={[{ label: dict.nav.projects, href: v5Href(lang, "projects") }]}
        kicker={p.ownProduct ? dict.projectsPage.ownProduct : p.sector[lang]}
        title={p.name}
        lead={p.summary[lang]}
      />
      <div className="container-site grid gap-10 py-(--section) lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          {live && publicFileExists(p.images.desktop) ? (
            <div className="grid items-end gap-5 sm:grid-cols-[3fr_1fr]">
              <ProjectVisual project={p} variant="desktop" priority pendingLabel={dict.home.visualPending} alt={dict.common.shotDesktop.replace("{name}", p.name)} sizes="(min-width: 1024px) 45vw, 100vw" className="overflow-hidden rounded-xl border border-corp-line shadow-[0_30px_80px_-40px_rgba(16,24,40,0.4)]" />
              <ProjectVisual project={p} variant="mobile" pendingLabel={dict.home.visualPending} alt={dict.common.shotMobile.replace("{name}", p.name)} sizes="(min-width: 1024px) 15vw, 40vw" className="mx-auto w-1/2 overflow-hidden rounded-xl border border-corp-line sm:w-full" />
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-corp-line bg-corp-soft p-8 text-corp-muted">
              <span className="line-through">{host}</span> · {dict.v3.archiveNote}
            </p>
          )}
          {story.length > 0 && (
            <div className="mt-14 space-y-10">
              {story.map((s, i) => (
                <section key={s.key} aria-labelledby={`story-${s.key}`}>
                  <p className="font-mono text-sm text-ember">0{i + 1}</p>
                  <h2 id={`story-${s.key}`} className="mt-1 text-2xl font-bold">
                    {s.title}
                  </h2>
                  <p className="mt-3 text-lg text-corp-muted">{s.body}</p>
                </section>
              ))}
            </div>
          )}
        </div>
        <aside className="self-start rounded-2xl border border-corp-line bg-corp-soft p-6 lg:sticky lg:top-28">
          <dl className="divide-y divide-corp-line">
            {meta.map((m) => (
              <div key={m.k} className="grid grid-cols-[7rem_1fr] gap-3 py-3 first:pt-0">
                <dt className="text-sm text-corp-muted">{m.k}</dt>
                <dd className="font-medium">
                  {m.k === dict.v5.status ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className={live ? "size-2 rounded-full bg-[#16a34a]" : "size-2 rounded-full bg-[#dc2626]"} /> {m.v}
                    </span>
                  ) : (
                    m.v
                  )}
                </dd>
              </div>
            ))}
          </dl>
          {live && (
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-5 flex min-h-12 items-center justify-center rounded-lg bg-ember font-semibold text-white hover:bg-corp-ink">
              {t.visit} ↗
            </a>
          )}
        </aside>
      </div>
      <nav aria-label={t.next} className="container-site pb-(--section)">
        <Link href={v5Href(lang, "projects", next.slug)} className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-corp-line p-6 hover:border-corp-ink">
          <span className="text-sm text-corp-muted">{t.next}</span>
          <span className="v5-title text-3xl group-hover:text-ember">
            {next.name} <span aria-hidden>→</span>
          </span>
        </Link>
      </nav>
      <Cta lang={lang} dict={dict} />
    </article>
  );
}
