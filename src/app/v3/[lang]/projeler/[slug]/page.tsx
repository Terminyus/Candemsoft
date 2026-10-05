import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { getProject, getProjects, getServices, publicFileExists } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { Halftone } from "@/components/v3/Halftone";
import { V3PageHead } from "@/components/v3/V3PageHead";
import { v3Href } from "@/components/v3/nav";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getProjects().map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/v3/[lang]/projeler/[slug]">): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: p.name } : {};
}

export default async function Page({ params }: PageProps<"/v3/[lang]/projeler/[slug]">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.projectPage;
  const all = getProjects();
  const p = getProject((await params).slug);
  if (!p) notFound();
  const next = all[(all.findIndex((x) => x.slug === p.slug) + 1) % all.length]!;
  const facts = [
    { k: t.type, v: p.type[lang] },
    { k: t.sector, v: p.sector[lang] },
    { k: t.services, v: getServices().filter((s) => p.services.includes(s.slug)).map((s) => s.title[lang]).join(", ") },
  ].filter((f) => f.v);
  const story = (["challenge", "approach", "outcome"] as const).filter((k) => p.caseStudy[k][lang]?.trim());
  return (
    <article>
      <V3PageHead kicker={p.ownProduct ? dict.projectsPage.ownProduct : dict.projectsPage.label} title={p.name} deck={p.summary[lang]} />
      <div className="container-site grid gap-10 pt-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        <div>
          {p.status === "live" && publicFileExists(p.images.desktop) ? (
            <figure className="grid grid-cols-[3fr_1fr] items-end gap-3">
              <Halftone src={p.images.desktop} alt={dict.common.shotDesktop.replace("{name}", p.name)} sizes="(min-width: 1024px) 55vw, 75vw" priority />
              <Halftone src={p.images.mobile} alt={dict.common.shotMobile.replace("{name}", p.name)} sizes="(min-width: 1024px) 18vw, 25vw" ratio="aspect-[9/16]" />
              <figcaption className="col-span-2 text-sm italic text-news-gray">{dict.v3.photoCaption.replace("{name}", p.name)}</figcaption>
            </figure>
          ) : (
            <p className="border-l-4 border-signal pl-4 italic">{dict.v3.archiveNote}</p>
          )}
          {story.length > 0 && (
            <div className="v3-columns v3-dropcap mt-8 text-[1.075rem] leading-relaxed">
              {story.map((k) => (
                <p key={k} className="mb-4">
                  <strong className="font-[650]">{t[k]}.</strong> {p.caseStudy[k][lang]}
                </p>
              ))}
            </div>
          )}
        </div>
        <aside className="self-start border-2 border-news-ink p-5">
          <dl className="space-y-3">
            {facts.map((f) => (
              <div key={f.k}>
                <dt className="v3-kicker text-news-gray">{f.k}</dt>
                <dd className="mt-0.5">{f.v}</dd>
              </div>
            ))}
          </dl>
          {p.status === "live" && (
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="v3-kicker mt-5 flex min-h-11 items-center justify-center bg-news-ink px-4 text-news-paper hover:bg-signal hover:text-news-ink">
              {t.visit} ↗
            </a>
          )}
        </aside>
      </div>
      <nav aria-label={t.next} className="container-site mt-(--section-sm)">
        <Link href={v3Href(lang, "projects", next.slug)} className="group flex items-baseline justify-between gap-4 border-y-2 border-news-ink py-4">
          <span className="v3-kicker">{t.next}</span>
          <span className="v3-headline text-3xl group-hover:text-ember">{next.name} →</span>
        </Link>
      </nav>
    </article>
  );
}
