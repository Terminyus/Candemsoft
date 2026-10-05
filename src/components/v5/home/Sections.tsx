import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getPosts, getProducts, getProject, getProjects, getServices, getSite, getStack, getTeam, publicFileExists } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { formatDate } from "@/lib/format";
import { asset } from "@/lib/static";
import { initials } from "@/lib/text";
import { cn } from "@/components/ui/cn";
import { Counter } from "@/components/v4/fx/Counter";
import { ServiceIcon } from "../Icons";
import { v5Href } from "../nav";
import { ProductTabs, type TabProduct } from "./ProductTabs";

const brand: Record<string, string> = { seyyah: "#0068c8", orpigo: "#e80820", "kisisel-qr": "#c9a400", candemfit: "#00a0b8", candemkey: "#f85404" };

export function Head({ kicker, title, lead, id, center }: { kicker: string; title: string; lead?: string; id: string; center?: boolean }) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center")}>
      <p className="text-sm font-semibold text-ember">{kicker}</p>
      <h2 id={id} className="v5-title mt-3 text-[clamp(2rem,1.4rem+2.4vw,3.25rem)]">
        {title}
      </h2>
      {lead && <p className="mt-4 text-lg text-corp-muted">{lead}</p>}
    </div>
  );
}

export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.v5;
  const site = getSite();
  const lead = getProject("seyyah");
  const phone = getProject("orpigo");
  const live = getProducts().filter((p) => p.status === "live").length;
  const stats = [...site.stats.map((s) => ({ v: s.value, k: s.label[lang] })), { v: String(live), k: dict.stats.products }];
  return (
    <section aria-labelledby="v5-hero" className="relative overflow-hidden bg-corp-soft">
      <div className="container-site grid items-center gap-14 py-[clamp(3rem,7vw,6.5rem)] lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-corp-line bg-white px-3 py-1 text-sm font-medium">
            <span className="v4-pulse size-2 rounded-full bg-dev-str" /> {t.heroPill}
          </p>
          <h1 id="v5-hero" className="v5-title mt-6 text-[clamp(2.4rem,1.3rem+4.2vw,4.5rem)]">
            {t.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-corp-muted">{t.heroLead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={v5Href(lang, "contact")} className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-ember px-6 font-semibold text-white transition-colors hover:bg-corp-ink">
              {t.ctaPrimary} <span aria-hidden>→</span>
            </Link>
            <Link href={v5Href(lang, "projects")} className="inline-flex min-h-12 items-center rounded-lg border border-corp-line bg-white px-6 font-semibold transition-colors hover:border-corp-ink">
              {t.heroSecondary}
            </Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 divide-x divide-corp-line">
            {stats.map((s, i) => (
              <div key={s.k} className={cn("flex flex-col-reverse justify-end", i > 0 && "pl-5")}>
                <dt className="text-sm text-corp-muted">{s.k}</dt>
                <dd className="v5-title text-3xl">
                  <Counter value={s.v} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Collage: a live client-facing site, our app on a phone, a deploy badge and a code card. */}
        <div aria-hidden className="relative mx-auto w-full max-w-xl pb-10 pt-6">
          {lead && publicFileExists(lead.images.desktop) && (
            <div className="v5-float-slow overflow-hidden rounded-xl border border-corp-line bg-white shadow-[0_30px_80px_-30px_rgba(16,24,40,0.35)]">
              <div className="flex items-center gap-1.5 border-b border-corp-line px-3 py-2">
                <span className="size-2.5 rounded-full bg-corp-line" />
                <span className="size-2.5 rounded-full bg-corp-line" />
                <span className="size-2.5 rounded-full bg-corp-line" />
                <span className="ml-3 rounded bg-corp-soft px-2 py-0.5 font-mono text-[0.7rem] text-corp-muted">seyyah.info</span>
              </div>
              <div className="relative aspect-[16/10]">
                <Image src={asset(lead.images.desktop)} alt="" fill sizes="(min-width: 1024px) 40vw, 90vw" preload fetchPriority="high" className="object-cover object-top" />
              </div>
            </div>
          )}
          {phone && publicFileExists(phone.images.mobile) && (
            <div className="v5-float absolute -bottom-2 -left-2 w-[30%] overflow-hidden rounded-[1.4rem] border-[5px] border-corp-ink bg-white shadow-2xl sm:-left-8">
              <div className="relative aspect-[9/16]">
                <Image src={asset(phone.images.mobile)} alt="" fill sizes="160px" className="object-cover object-top" />
              </div>
            </div>
          )}
          <div className="v5-float absolute -top-2 right-2 rounded-xl border border-dev-line bg-dev-bg px-4 py-3 font-mono text-xs text-dev-text shadow-xl sm:-right-6">
            <p className="flex items-center gap-2">
              <span className="v4-pulse size-2 rounded-full bg-dev-str" /> <span className="text-dev-str">Ready</span> · Production
            </p>
            <p className="mt-1 text-dev-comment">▲ seyyah.info</p>
          </div>
          <pre className="v5-float-slow absolute -bottom-4 right-0 hidden rounded-xl border border-dev-line bg-dev-bg px-4 py-3 font-mono text-[0.72rem] leading-relaxed text-dev-text shadow-xl sm:block">
            <span className="text-dev-key">const</span> <span className="text-dev-fn">apps</span> = <span className="text-dev-attr">{live}</span>;{"\n"}
            <span className="text-dev-key">export default</span> <span className="text-dev-tag">ship</span>(apps);
          </pre>
        </div>
      </div>
    </section>
  );
}

export function Shelf({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const products = getProducts();
  return (
    <section aria-label={dict.v5.shelfTitle} className="border-y border-corp-line bg-white">
      <div className="container-site flex flex-wrap items-center justify-between gap-6 py-6">
        <p className="text-sm font-semibold text-corp-muted">{dict.v5.shelfTitle}</p>
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {products.map((p) => (
            <li key={p.slug}>
              <Link href={`${v5Href(lang, "products")}#${p.slug}`} className="flex items-center gap-2.5 font-semibold text-corp-ink/80 transition-colors hover:text-corp-ink">
                <span className="relative size-8 overflow-hidden rounded-lg bg-corp-soft">
                  {p.icon && publicFileExists(p.icon) ? (
                    <Image src={asset(p.icon)} alt="" fill sizes="32px" className="object-contain" />
                  ) : (
                    <span aria-hidden className="absolute inset-0 grid place-items-center bg-signal text-xs font-bold">
                      {p.name[0]}
                    </span>
                  )}
                </span>
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Solutions({ lang, dict, detailed }: { lang: Locale; dict: Dictionary; detailed?: boolean }) {
  const t = dict.v5;
  const projects = getProjects();
  return (
    <section aria-labelledby="solutions" className="container-site py-(--section)">
      <Head id="solutions" kicker={t.solutionsKicker} title={t.solutionsTitle} lead={t.solutionsLead} />
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {getServices().map((s) => {
          const related = projects.filter((p) => p.services.includes(s.slug) && p.status === "live").slice(0, 3);
          return (
            <article key={s.slug} id={s.slug} className="v4-rise group flex scroll-mt-28 flex-col rounded-2xl border border-corp-line bg-white p-7 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-corp-ink/20 hover:shadow-[0_24px_60px_-30px_rgba(16,24,40,0.3)]">
              <span className="grid size-12 place-items-center rounded-xl bg-corp-soft text-ember transition-colors group-hover:bg-ember group-hover:text-white">
                <ServiceIcon slug={s.slug} />
              </span>
              <h3 className="mt-5 text-xl font-bold">{s.title[lang]}</h3>
              <p className="mt-2 text-corp-muted">{s.summary[lang]}</p>
              <ul className="mt-4 space-y-1.5 text-[0.95rem]">
                {s.items[lang].map((i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden className="text-ember">
                      ›
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
              {detailed && related.length > 0 && (
                <p className="mt-4 text-sm text-corp-muted">
                  {dict.servicesPage.related}:{" "}
                  {related.map((p, i) => (
                    <span key={p.slug}>
                      {i > 0 && ", "}
                      <Link href={v5Href(lang, "projects", p.slug)} className="font-medium text-corp-ink underline underline-offset-4">
                        {p.name}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
              {!detailed && (
                <Link href={`${v5Href(lang, "services")}#${s.slug}`} className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-ember">
                  {t.learnMore} <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              )}
            </article>
          );
        })}
        <article className="v4-rise flex flex-col rounded-2xl bg-corp-ink p-7 text-white">
          <h3 className="text-2xl font-bold">{t.ctaTitle}</h3>
          <p className="mb-6 mt-2 text-white/75">{t.ctaLead}</p>
          <Link href={v5Href(lang, "contact")} className="mt-auto inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-5 font-semibold text-corp-ink hover:bg-signal">
            {t.quote}
          </Link>
        </article>
      </div>
    </section>
  );
}

export function Products({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.v5;
  const pp = dict.productsPage;
  const products: TabProduct[] = getProducts().map((p) => {
    const proj = p.project ? getProject(p.project) : undefined;
    return {
      slug: p.slug,
      name: p.name,
      icon: p.icon && publicFileExists(p.icon) ? asset(p.icon) : null,
      tagline: p.tagline[lang],
      description: p.description[lang],
      features: p.features[lang],
      links: [
        p.links.appStore && { label: pp.appStore, href: p.links.appStore },
        p.links.googlePlay && { label: pp.googlePlay, href: p.links.googlePlay },
        p.links.web && { label: pp.web, href: p.links.web },
      ].filter((x): x is { label: string; href: string } => Boolean(x)),
      shot: proj && publicFileExists(proj.images.mobile) ? asset(proj.images.mobile) : null,
      shotAlt: dict.common.shotMobile.replace("{name}", p.name),
      color: brand[p.slug] ?? "#f85404",
      soon: p.status === "soon",
      soonLabel: dict.common.comingSoon,
    };
  });
  return (
    <section aria-labelledby="products" className="bg-corp-soft py-(--section)">
      <div className="container-site">
        <Head id="products" kicker={t.productsKicker} title={t.productsTitle} lead={t.productsLead} />
        <div className="mt-10">
          <ProductTabs products={products} label={t.productsKicker} />
        </div>
      </div>
    </section>
  );
}

export function Work({ lang, dict, all }: { lang: Locale; dict: Dictionary; all?: boolean }) {
  const t = dict.v5;
  const projects = getProjects();
  const live = projects.filter((p) => p.status === "live" && publicFileExists(p.images.desktop));
  const shown = all ? live : live.slice(0, 3);
  const archive = projects.filter((p) => p.status === "offline");
  return (
    <section aria-labelledby="work" className="container-site py-(--section)">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Head id="work" kicker={t.projectsKicker} title={t.projectsTitle} lead={t.projectsLead} />
        {!all && (
          <Link href={v5Href(lang, "projects")} className="inline-flex min-h-11 items-center rounded-lg border border-corp-line px-5 font-semibold hover:border-corp-ink">
            {t.allProjects} →
          </Link>
        )}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <Link key={p.slug} href={v5Href(lang, "projects", p.slug)} className="v4-rise group overflow-hidden rounded-2xl border border-corp-line bg-white transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(16,24,40,0.35)]">
            <div className="relative aspect-[16/10] overflow-hidden bg-corp-soft">
              <Image src={asset(p.images.desktop)} alt={dict.common.shotDesktop.replace("{name}", p.name)} fill sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 font-mono text-[0.7rem] font-medium">
                <span className="size-1.5 rounded-full bg-[#16a34a]" /> Live
              </span>
            </div>
            <div className="p-5">
              <p className="text-sm font-semibold text-ember">{p.ownProduct ? dict.projectsPage.ownProduct : p.sector[lang]}</p>
              <h3 className="mt-1 text-xl font-bold">{p.name}</h3>
              <p className="mt-1 text-corp-muted">{p.summary[lang]}</p>
            </div>
          </Link>
        ))}
      </div>
      {all && archive.length > 0 && (
        <div className="mt-14">
          <h3 className="text-lg font-bold">{dict.v3.archiveTitle}</h3>
          <p className="mt-1 text-corp-muted">{dict.v3.archiveNote}</p>
          <ul className="mt-4 divide-y divide-corp-line rounded-2xl border border-corp-line bg-white">
            {archive.map((p) => (
              <li key={p.slug}>
                <Link href={v5Href(lang, "projects", p.slug)} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-corp-soft">
                  <span className="font-semibold">{p.name}</span>
                  <span className="flex items-center gap-3 text-sm text-corp-muted">
                    {p.type[lang]}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-corp-soft px-2.5 py-0.5 font-mono text-[0.7rem]">
                      <span className="size-1.5 rounded-full bg-[#dc2626]" /> Offline
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export function Why({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.v5;
  const a = dict.about;
  const site = getSite();
  const numbers = [
    { v: String(site.foundedYear), k: a.founded },
    ...site.stats.map((s) => ({ v: s.value, k: s.label[lang] })),
    { v: String(getProducts().filter((p) => p.status === "live").length), k: dict.stats.products },
  ];
  return (
    <section aria-labelledby="why" className="bg-corp-ink py-(--section) text-white">
      <div className="container-site">
        <p className="text-sm font-semibold text-signal">{t.whyKicker}</p>
        <h2 id="why" className="v5-title mt-3 text-[clamp(2rem,1.4rem+2.4vw,3.25rem)]">
          {t.whyTitle}
        </h2>
        {/* Principles set like pull quotes (from Gazete). */}
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {a.principles.map((p, i) => (
            <li key={p.title} className="v4-rise border-l-2 border-signal pl-6">
              <span className="font-mono text-sm text-white/60">0{i + 1}</span>
              <blockquote className="mt-2 text-2xl font-bold leading-snug">“{p.title}”</blockquote>
              <p className="mt-3 text-white/75">{p.body}</p>
            </li>
          ))}
        </ol>
        <dl className="mt-16 grid grid-cols-2 gap-6 border-t border-white/10 pt-10 md:grid-cols-4">
          {numbers.map((n) => (
            <div key={n.k} className="flex flex-col-reverse justify-end gap-1">
              <dt className="text-white/70">{n.k}</dt>
              <dd className="v5-title text-5xl text-white">
                <Counter value={n.v} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Tech({ dict }: { dict: Dictionary }) {
  const t = dict.v5;
  const stack = getStack();
  return (
    <section aria-labelledby="tech" className="container-site grid items-center gap-12 py-(--section) lg:grid-cols-2">
      <div>
        <Head id="tech" kicker={t.techKicker} title={t.techTitle} lead={t.techLead} />
        <ul className="mt-8 flex flex-wrap gap-2.5">
          {stack.map((s) => (
            <li key={s} className="rounded-lg border border-corp-line bg-white px-4 py-2 font-semibold">
              {s}
            </li>
          ))}
        </ul>
      </div>
      {/* A code card from Derleme: the same list, the way a developer would see it. */}
      <div className="v4-rise overflow-hidden rounded-2xl border border-dev-line bg-dev-bg shadow-[0_40px_100px_-50px_rgba(16,24,40,0.6)]">
        <div className="flex items-center gap-1.5 border-b border-dev-line px-4 py-3">
          <span className="size-2.5 rounded-full bg-dev-line" />
          <span className="size-2.5 rounded-full bg-dev-line" />
          <span className="size-2.5 rounded-full bg-dev-line" />
          <span className="ml-3 font-mono text-xs text-dev-muted">package.json</span>
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed text-dev-text">
          {"{\n  "}
          <span className="text-dev-str">&quot;name&quot;</span>: <span className="text-dev-attr">&quot;candemsoft&quot;</span>,{"\n  "}
          <span className="text-dev-str">&quot;stack&quot;</span>: [
          {stack.map((s, i) => (
            <span key={s}>
              {"\n    "}
              <span className="text-dev-attr">&quot;{s}&quot;</span>
              {i < stack.length - 1 ? "," : ""}
            </span>
          ))}
          {"\n  ]\n}"}
        </pre>
      </div>
    </section>
  );
}

export function Team({ lang, dict, limit }: { lang: Locale; dict: Dictionary; limit?: number }) {
  const t = dict.v5;
  return (
    <section aria-labelledby="team" className="bg-corp-soft py-(--section)">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Head id="team" kicker={t.teamKicker} title={t.teamTitle} lead={dict.teamPage.lead} />
          <Link href={v5Href(lang, "team")} className="inline-flex min-h-11 items-center rounded-lg border border-corp-line bg-white px-5 font-semibold hover:border-corp-ink">
            {dict.about.teamCta} →
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {getTeam().slice(0, limit).map((m, i) => (
            <li key={`${m.name}-${i}`} className="v4-rise rounded-2xl border border-corp-line bg-white p-5 text-center">
              <span className="relative mx-auto grid size-20 place-items-center overflow-hidden rounded-full bg-corp-soft text-xl font-bold text-ember">
                {m.photo && publicFileExists(m.photo) ? <Image src={asset(m.photo)} alt={m.name} fill sizes="80px" className="object-cover" /> : initials(m.name)}
              </span>
              <p className="mt-4 font-bold">{m.name}</p>
              <p className="text-sm text-corp-muted">{m.role[lang]}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export async function Blog({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.v5;
  const posts = (await getPosts(lang)).slice(0, 2);
  if (!posts.length) return null;
  return (
    <section aria-labelledby="blog" className="container-site grid gap-10 py-(--section) lg:grid-cols-[1fr_2fr]">
      <div>
        <Head id="blog" kicker={t.blogKicker} title={t.blogTitle} lead={dict.blogPage.lead} />
        <Link href={v5Href(lang, "blog")} className="mt-6 inline-flex min-h-11 items-center rounded-lg border border-corp-line px-5 font-semibold hover:border-corp-ink">
          {dict.nav.blog} →
        </Link>
      </div>
      <div className="grid gap-6">
        {posts.map((p) => (
          <Link key={p.slug} href={v5Href(lang, "blog", p.slug)} className="v4-rise group grid gap-4 rounded-2xl border border-corp-line p-7 transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(16,24,40,0.3)] sm:grid-cols-[9rem_1fr]">
            <time dateTime={p.date} className="text-sm text-corp-muted">
              {formatDate(p.date, lang)}
            </time>
            <div>
              <h3 className="text-2xl font-bold group-hover:text-ember">{p.title}</h3>
              <p className="mt-2 text-corp-muted">{p.description}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-ember">{dict.common.readMore} →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Cta({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.v5;
  const { contact } = getSite();
  return (
    <section aria-labelledby="cta" className="container-site pb-(--section)">
      <div className="grid gap-8 overflow-hidden rounded-3xl bg-ember p-8 text-white sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <h2 id="cta" className="v5-title text-[clamp(2rem,1.4rem+2.4vw,3.25rem)]">
            {t.ctaTitle}
          </h2>
          <p className="mt-3 max-w-xl text-lg text-white/90">{t.ctaLead}</p>
        </div>
        <div className="flex flex-col gap-3 lg:items-end">
          <Link href={v5Href(lang, "contact")} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-7 font-semibold text-corp-ink hover:bg-corp-ink hover:text-white">
            {t.ctaPrimary} →
          </Link>
          <a href={`tel:${contact.phoneHref}`} className="font-semibold text-white underline underline-offset-4">
            {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`} className="font-semibold text-white underline underline-offset-4">
            {contact.email}
          </a>
        </div>
      </div>
    </section>
  );
}
