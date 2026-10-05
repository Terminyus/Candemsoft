import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getProducts, getProjects, getServices, getSite, getStack, publicFileExists } from "@/lib/content";
import { getCommits } from "@/lib/build-info";
import type { Dictionary } from "@/lib/dictionary";
import { asset } from "@/lib/static";
import { cn } from "@/components/ui/cn";
import { Counter } from "../fx/Counter";
import { Scramble } from "../fx/Scramble";
import { v4Href } from "../nav";
import { DotField } from "./DotField";
import { HeroEditor } from "./HeroEditor";
import { TiltCard } from "./TiltCard";

export function SectionHead({ path, title, lead, id }: { path: string; title: string; lead?: string; id: string }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-end">
      <div>
        <p className="v4-mono text-xs text-dev-comment">{path}</p>
        <Scramble id={id} text={title} className="v4-title mt-3 text-[clamp(2.1rem,1.3rem+3.6vw,4.5rem)]" />
      </div>
      {lead && <p className="text-lg text-dev-muted">{lead}</p>}
    </div>
  );
}

export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.v4;
  const site = getSite();
  const svc = getServices();
  const stats = [
    ...site.stats.map((s) => ({ v: s.value, k: s.label[lang] })),
    { v: String(getProducts().filter((p) => p.status === "live").length), k: dict.stats.products },
  ];
  const stack = getStack();
  return (
    <section aria-labelledby="v4-hero" className="relative overflow-hidden border-b border-dev-line">
      <DotField />
      <div className="container-site relative grid gap-12 pb-14 pt-[clamp(2.5rem,6vw,5.5rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] xl:items-center">
        <div>
          <p className="v4-mono text-sm text-dev-comment">{t.heroKicker}</p>
          <h1 id="v4-hero" className="v4-title mt-5 text-[clamp(2.6rem,1.2rem+5.4vw,6rem)]">
            <span className="block">{t.heroLine1}</span>
            <span className="block text-signal">{t.heroLine2}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-dev-muted">{dict.home.heroLead}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={v4Href(lang, "contact")} className="inline-flex min-h-12 items-center gap-3 rounded-md bg-signal px-6 font-semibold text-dev-bg transition-transform hover:-translate-y-0.5">
              {dict.home.heroCta} <span aria-hidden>→</span>
            </Link>
            <Link href={v4Href(lang, "projects")} className="inline-flex min-h-12 items-center rounded-md border border-dev-line px-6 v4-mono text-sm text-dev-text transition-colors hover:border-dev-muted">
              ls ./{dict.nav.projects.toLocaleLowerCase(lang)}
            </Link>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.k} className="flex flex-col-reverse justify-end gap-1 border-l border-dev-line pl-3">
                <dt className="v4-mono text-[0.7rem] text-dev-comment">{s.k}</dt>
                <dd className="v4-title text-3xl">
                  <Counter value={s.v} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <HeroEditor
          city={site.contact.city[lang].split(",")[0]!}
          labels={{
            file: t.editor,
            preview: t.preview,
            compiling: t.compiling,
            compiled: t.compiled,
            passing: t.buildPassing,
            replay: t.replay,
            blocks: {
              studio: site.contact.city[lang],
              web: svc[0]!.title[lang],
              mobile: svc[1]!.title[lang],
              ai: svc[2]!.title[lang],
              ship: dict.common.live,
            },
          }}
        />
      </div>
      {/* tech stack marquee: duplicated list, CSS-translated by half its width */}
      <div className="relative border-t border-dev-line bg-dev-bg/70 py-4">
        <ul aria-label={dict.servicesPage.stackLabel} className="v4-marquee flex w-max gap-10 pl-10 v4-mono text-sm text-dev-muted">
          {[...stack, ...stack, ...stack, ...stack].map((s, i) => (
            <li key={i} aria-hidden={i >= stack.length || undefined} className="flex items-center gap-10">
              <span className="text-dev-text">{s}</span>
              <span aria-hidden className="text-signal">
                ◆
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Deployments({ lang, dict, limit }: { lang: Locale; dict: Dictionary; limit?: number }) {
  const t = dict.v4;
  const projects = getProjects().slice(0, limit);
  return (
    <section aria-labelledby="deploys" className="container-site pt-(--section)">
      <SectionHead id="deploys" path="$ candemsoft deployments ls" title={t.deployTitle} lead={t.deployLead} />
      <div className="mt-10 overflow-hidden rounded-xl border border-dev-line">
        <div className="hidden grid-cols-[9rem_1.3fr_1.2fr_1fr_8rem] gap-4 border-b border-dev-line bg-dev-surface px-5 py-3 v4-mono text-xs text-dev-comment md:grid">
          <span>{t.colStatus}</span>
          <span>{t.colProject}</span>
          <span>{t.colDomain}</span>
          <span>{t.colType}</span>
          <span className="text-right">env</span>
        </div>
        <ul>
          {projects.map((p) => {
            const live = p.status === "live";
            const host = new URL(p.url).host.replace(/^www\./, "");
            return (
              <li key={p.slug} className="v4-rise group relative grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-dev-line px-5 py-4 transition-colors last:border-0 hover:bg-dev-surface md:grid-cols-[9rem_1.3fr_1.2fr_1fr_8rem]">
                <span className="flex items-center gap-2 v4-mono text-xs">
                  <span className={cn("size-2 rounded-full", live ? "v4-pulse bg-dev-str" : "bg-[#f87171]")} />
                  <span className={live ? "text-dev-str" : "text-[#f87171]"}>{live ? t.ready : t.offline}</span>
                </span>
                <span className="col-span-2 flex items-center gap-2 font-semibold md:col-span-1">
                  <Link href={v4Href(lang, "projects", p.slug)} className="after:absolute after:inset-0 group-hover:text-signal">
                    {p.name}
                  </Link>
                  {p.ownProduct && <span className="rounded border border-signal/50 px-1.5 v4-mono text-[0.65rem] text-signal">own</span>}
                </span>
                <span className={cn("v4-mono text-xs", live ? "text-dev-key" : "text-dev-comment line-through")}>{host}</span>
                <span className="hidden text-sm text-dev-muted md:block">{p.type[lang]}</span>
                <span className="hidden text-right v4-mono text-xs text-dev-comment md:block">{t.production}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const glows: Record<string, string> = {
  seyyah: "rgba(0,104,200,0.55)",
  orpigo: "rgba(232,8,32,0.5)",
  "kisisel-qr": "rgba(248,208,8,0.45)",
  candemfit: "rgba(0,216,216,0.45)",
};

export function ProductGrid({ lang, dict, detailed }: { lang: Locale; dict: Dictionary; detailed?: boolean }) {
  const t = dict.v4;
  const products = getProducts();
  const projects = getProjects();
  return (
    <section aria-labelledby="products" className="container-site pt-(--section)">
      <SectionHead id="products" path="~/candemsoft/apps" title={t.productsTitle} lead={t.productsLead} />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {products.map((p) => {
          const proj = projects.find((x) => x.slug === p.project);
          const links = [
            p.links.appStore && { h: p.links.appStore, l: "App Store" },
            p.links.googlePlay && { h: p.links.googlePlay, l: "Google Play" },
            p.links.web && { h: p.links.web, l: "Web" },
          ].filter((x): x is { h: string; l: string } => Boolean(x));
          return (
            <TiltCard key={p.slug} glow={glows[p.slug] ?? "rgba(248,84,4,0.45)"} className={cn("v4-rise", p.status === "soon" && "md:col-span-2")}>
              <article id={p.slug} aria-labelledby={`p-${p.slug}`} lang={lang} className="grid gap-5 p-6 hyphens-auto xl:grid-cols-[1fr_auto]">
                <div className="flex min-w-0 flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="relative size-12 overflow-hidden rounded-[22%] bg-white">
                      {p.icon && publicFileExists(p.icon) ? (
                        <Image src={asset(p.icon)} alt={`${p.name} logo`} fill sizes="48px" className="object-contain" />
                      ) : (
                        <span aria-hidden className="absolute inset-0 grid place-items-center bg-signal font-bold text-dev-bg">
                          {p.name[0]}
                        </span>
                      )}
                    </span>
                    <div>
                      <h3 id={`p-${p.slug}`} className="v4-title text-2xl">
                        {p.name}
                      </h3>
                      <p className="v4-mono text-xs text-dev-comment">
                        {p.status === "soon" ? `status: ${dict.common.comingSoon}` : `platforms: [${p.platforms.join(", ")}]`}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">{p.tagline[lang]}</p>
                  <p className="text-dev-muted">{p.description[lang]}</p>
                  {detailed && p.features[lang].length > 0 && (
                    <ul className="grid min-w-0 gap-1 v4-mono text-sm text-dev-muted 2xl:grid-cols-2">
                      {p.features[lang].map((f) => (
                        <li key={f}>
                          <span className="text-dev-str">+</span> {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  {links.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      {links.map((x) => (
                        <a key={x.h} href={x.h} target="_blank" rel="noopener noreferrer" className="rounded-md border border-dev-line px-3 py-1.5 v4-mono text-xs hover:border-signal hover:text-signal">
                          {x.l} ↗
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                {proj && publicFileExists(proj.images.mobile) && (
                  <div className="relative mx-auto aspect-[9/16] w-36 overflow-hidden rounded-2xl border-4 border-dev-line sm:w-40">
                    <Image src={asset(proj.images.mobile)} alt={dict.common.shotMobile.replace("{name}", p.name)} fill sizes="160px" className="object-cover object-top" />
                  </div>
                )}
              </article>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
}

export function Modules({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const services = getServices();
  return (
    <section aria-labelledby="modules" className="container-site pt-(--section)">
      <SectionHead id="modules" path='import * as services from "@candemsoft/services"' title={dict.v4.modulesTitle} lead={dict.servicesPage.lead} />
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => {
          const id = s.slug.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());
          return (
            <Link
              key={s.slug}
              href={`${v4Href(lang, "services")}#${s.slug}`}
              id={s.slug}
              className="v4-rise group flex flex-col rounded-xl border border-dev-line bg-dev-surface p-5 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-signal/60"
            >
              <span className="v4-mono text-xs text-dev-comment">services/{s.slug}.ts</span>
              <span className="v4-title mt-3 text-2xl">{s.title[lang]}</span>
              <span className="mt-2 text-dev-muted">{s.summary[lang]}</span>
              <code className="mt-4 block v4-mono text-[0.78rem] leading-relaxed">
                <span className="text-dev-key">export const</span> <span className="text-dev-fn">{id}</span> = [
                {s.items[lang].map((item) => (
                  <span key={item} className="block pl-4 text-dev-str">
                    &quot;{item}&quot;,
                  </span>
                ))}
                ];
                <span aria-hidden className="v4-caret ml-1 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-signal opacity-0 group-hover:opacity-100" />
              </code>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const typeColor: Record<string, string> = {
  feat: "text-dev-str border-dev-str/40",
  fix: "text-[#f87171] border-[#f87171]/40",
  perf: "text-dev-attr border-dev-attr/40",
  style: "text-dev-fn border-dev-fn/40",
  docs: "text-dev-key border-dev-key/40",
  refactor: "text-dev-key border-dev-key/40",
  chore: "text-dev-comment border-dev-line",
};

export function GitLog({ dict }: { dict: Dictionary }) {
  const commits = getCommits(28);
  if (!commits.length) return null;
  return (
    <section aria-labelledby="gitlog" className="container-site pt-(--section)">
      <SectionHead id="gitlog" path="$ git log --oneline --graph" title={dict.v4.gitTitle} lead={dict.v4.gitLead} />
      <ol className="relative mt-10 border-l-2 border-dev-line pl-6 sm:ml-4">
        {commits.map((c, i) => (
          <li key={c.hash} className="v4-rise relative py-2.5">
            <span aria-hidden className={cn("absolute -left-[1.95rem] top-4 size-3 rounded-full border-2 border-dev-bg", i === 0 ? "v4-pulse bg-dev-str" : "bg-signal")} />
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="v4-mono text-sm text-dev-tag">{c.hash}</span>
              <span className={cn("rounded border px-1.5 v4-mono text-[0.7rem]", typeColor[c.type] ?? typeColor.chore)}>{c.type}</span>
              <span className="text-dev-text">{c.subject.replace(/^\w+(\(.+?\))?!?:\s*/, "")}</span>
              <time dateTime={c.date} className="v4-mono text-xs text-dev-comment">
                {c.date}
              </time>
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-4 v4-mono text-xs text-dev-comment">
        github.com/Terminyus/Candemsoft · {commits.length} {dict.v4.recentCommits}
      </p>
    </section>
  );
}
