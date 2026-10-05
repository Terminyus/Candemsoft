import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getPosts, getProducts, getProjects, getServices, getSite, publicFileExists, type Product } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { formatDate } from "@/lib/format";
import { Halftone } from "@/components/v3/Halftone";
import { v3Href } from "@/components/v3/nav";

const platformName = { ios: "iOS", android: "Android", web: "Web" } as const;

/** Black section band, like a newspaper section header. */
export function SectionBand({ title, aside, id }: { title: string; aside?: string; id?: string }) {
  return (
    <div className="mt-(--section-sm) flex items-baseline justify-between gap-4 border-y-2 border-news-ink py-2">
      <h2 id={id} className="v3-headline text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)]">
        {title}
      </h2>
      {aside && <p className="hidden text-right italic text-news-gray sm:block">{aside}</p>}
    </div>
  );
}

function StoreLine({ p, dict }: { p: Product; dict: Dictionary }) {
  const links = [
    p.links.appStore && { h: p.links.appStore, l: "App Store" },
    p.links.googlePlay && { h: p.links.googlePlay, l: "Google Play" },
    p.links.web && { h: p.links.web, l: new URL(p.links.web).host.replace(/^www\./, "") },
  ].filter((x): x is { h: string; l: string } => Boolean(x));
  if (!links.length) return null;
  return (
    <p className="v3-kicker mt-3">
      {dict.v3.stores}:{" "}
      {links.map((x, i) => (
        <span key={x.h}>
          {i > 0 && " · "}
          <a href={x.h} target="_blank" rel="noopener noreferrer" className="underline decoration-signal decoration-2 underline-offset-4 hover:text-ember">
            {x.l}
          </a>
        </span>
      ))}
    </p>
  );
}

export async function Front({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.v3;
  const site = getSite();
  const products = getProducts();
  const live = products.filter((p) => p.status === "live");
  const soon = products.filter((p) => p.status === "soon");
  const projects = getProjects();
  const lead = projects.find((p) => p.slug === live[0]?.project);
  const clients = projects.filter((p) => !p.ownProduct);
  const posts = await getPosts(lang);
  const stats = [...site.stats.map((s) => ({ v: s.value, k: s.label[lang] })), { v: String(live.length), k: dict.stats.products }];

  return (
    <div className="container-site">
      {/* Front page: lead story + right rail */}
      <div className="grid gap-8 pt-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-10">
        <article aria-labelledby="lead">
          <p className="v3-kicker text-ember">{t.leadKicker}</p>
          <h1 id="lead" className="v3-headline mt-2 text-[clamp(2.4rem,1.2rem+4.6vw,5.25rem)]">
            {t.leadTitle}
          </h1>
          <p className="mt-4 text-[clamp(1.15rem,1rem+0.5vw,1.45rem)] italic leading-snug">{t.leadDeck}</p>
          <p className="v3-kicker mt-4 border-y border-news-ink/30 py-2 text-news-gray">{t.leadByline}</p>
          {lead && publicFileExists(lead.images.desktop) && (
            <figure className="mt-5">
              <Link href={v3Href(lang, "products") + `#${live[0]!.slug}`} className="block">
                <Halftone src={lead.images.desktop} alt={dict.common.shotDesktop.replace("{name}", lead.name)} sizes="(min-width: 1024px) 60vw, 100vw" priority />
              </Link>
              <figcaption className="mt-2 text-sm italic text-news-gray">{t.photoCaption.replace("{name}", lead.name)}</figcaption>
            </figure>
          )}
          <div className="v3-columns v3-dropcap mt-6 text-[1.075rem] leading-relaxed [&>p]:mb-4 [&>p]:break-inside-avoid-column">
            {live.map((p) => (
              <p key={p.slug}>
                <strong className="font-[650]">{p.name}.</strong> {p.description[lang]}
              </p>
            ))}
          </div>
        </article>

        <aside className="flex flex-col gap-8 border-news-ink lg:border-l lg:pl-10">
          <section aria-labelledby="numbers">
            <h2 id="numbers" className="v3-kicker border-b-2 border-news-ink pb-1">
              {t.numbersTitle}
            </h2>
            <dl className="divide-y divide-news-ink/20">
              {stats.map((s) => (
                <div key={s.k} className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="italic">{s.k}</dt>
                  <dd className="v3-headline text-4xl">{s.v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="briefs">
            <h2 id="briefs" className="v3-kicker border-b-2 border-news-ink pb-1">
              {t.briefsTitle}
            </h2>
            <ul className="divide-y divide-news-ink/20">
              {getServices().map((s) => (
                <li key={s.slug} className="py-3">
                  <h3 className="v3-sub text-lg">
                    <Link href={`${v3Href(lang, "services")}#${s.slug}`} className="hover:text-ember">
                      {s.title[lang]}
                    </Link>
                  </h3>
                  <p className="mt-1 text-[0.95rem] leading-snug text-news-gray">{s.summary[lang]}</p>
                </li>
              ))}
            </ul>
          </section>

          {soon.map((p) => (
            <section key={p.slug} aria-labelledby={`soon-${p.slug}`} className="bg-signal p-5">
              <p className="v3-kicker">{t.soonTitle}</p>
              <h2 id={`soon-${p.slug}`} className="v3-headline mt-1 text-3xl">
                {p.name}
              </h2>
              <p className="mt-2 leading-snug">{p.description[lang]}</p>
            </section>
          ))}
        </aside>
      </div>

      {/* Products supplement */}
      <SectionBand id="supplement" title={t.productsTitle} aside={t.productsLead} />
      <div className="grid gap-x-8 gap-y-10 pt-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-news-ink/25">
        {live.map((p, i) => {
          const proj = projects.find((x) => x.slug === p.project);
          return (
            <article key={p.slug} aria-labelledby={`p-${p.slug}`} className={i > 0 ? "lg:pl-8" : ""}>
              {proj && publicFileExists(proj.images.mobile) && (
                <Link href={v3Href(lang, "products") + `#${p.slug}`} className="block">
                  <Halftone src={proj.images.mobile} alt={dict.common.shotMobile.replace("{name}", p.name)} sizes="(min-width: 1024px) 20vw, 45vw" ratio="aspect-[4/5]" />
                </Link>
              )}
              <p className="v3-kicker mt-3 text-ember">
                {p.name} · {p.platforms.map((x) => platformName[x]).join(" / ")}
              </p>
              <h3 id={`p-${p.slug}`} className="v3-sub mt-1 text-[1.45rem]">
                <Link href={v3Href(lang, "products") + `#${p.slug}`} className="hover:text-ember">
                  {p.tagline[lang]}
                </Link>
              </h3>
              <p className="mt-2 leading-snug">{p.description[lang].split(/(?<=\.)\s/)[0]}</p>
              <StoreLine p={p} dict={dict} />
            </article>
          );
        })}
      </div>

      {/* Client work + archive */}
      <SectionBand id="clients" title={t.clientsTitle} />
      <div className="grid gap-8 pt-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-10">
        {clients
          .filter((p) => p.status === "live")
          .slice(0, 1)
          .map((p) => (
            <article key={p.slug} className="grid gap-5 md:grid-cols-[3fr_2fr]">
              <Link href={v3Href(lang, "projects", p.slug)} className="block">
                <Halftone src={p.images.desktop} alt={dict.common.shotDesktop.replace("{name}", p.name)} sizes="(min-width: 768px) 40vw, 100vw" />
              </Link>
              <div>
                <p className="v3-kicker text-ember">{p.sector[lang]}</p>
                <h3 className="v3-headline mt-1 text-4xl">
                  <Link href={v3Href(lang, "projects", p.slug)} className="hover:text-ember">
                    {p.name}
                  </Link>
                </h3>
                <p className="mt-3 italic">{p.summary[lang]}</p>
              </div>
            </article>
          ))}
        <section aria-labelledby="archive" className="border-news-ink lg:border-l lg:pl-10">
          <h3 id="archive" className="v3-kicker border-b-2 border-news-ink pb-1">
            {t.archiveTitle}
          </h3>
          <p className="mt-2 text-sm italic text-news-gray">{t.archiveNote}</p>
          <ul className="mt-2 divide-y divide-news-ink/20">
            {clients
              .filter((p) => p.status === "offline")
              .map((p) => (
                <li key={p.slug} className="flex items-baseline justify-between gap-3 py-2">
                  <Link href={v3Href(lang, "projects", p.slug)} className="v3-sub hover:text-ember">
                    {p.name}
                  </Link>
                  <span className="text-right text-sm text-news-gray">{p.type[lang]}</span>
                </li>
              ))}
          </ul>
        </section>
      </div>

      {/* Classifieds + column */}
      <SectionBand id="classifieds" title={t.classifiedsTitle} />
      <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-2 border-news-ink bg-signal p-4 sm:col-span-2 lg:col-span-1 lg:row-span-2">
          <p className="v3-headline text-4xl">{t.wanted}</p>
          <p className="mt-3 leading-snug">{t.wantedBody}</p>
          <p className="mt-3 font-[650]">
            <a href={`mailto:${site.contact.email}`} className="underline underline-offset-4">
              {site.contact.email}
            </a>
            <br />
            <a href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</a>
          </p>
          <Link href={v3Href(lang, "contact")} className="v3-kicker v3-noprint mt-4 inline-block underline underline-offset-4">
            {t.lettersTitle} →
          </Link>
        </div>
        {getServices().map((s) => (
          <Link key={s.slug} href={`${v3Href(lang, "services")}#${s.slug}`} className="group border border-news-ink p-4 hover:bg-news-ink hover:text-news-paper">
            <p className="v3-kicker">{s.title[lang]}</p>
            <p className="mt-2 text-[0.95rem] leading-snug">{s.items[lang].join(" · ")}</p>
          </Link>
        ))}
        {posts[0] && (
          <article className="border border-news-ink p-4 sm:col-span-2 lg:col-span-2">
            <p className="v3-kicker text-ember">
              {t.columnTitle} · <time dateTime={posts[0].date}>{formatDate(posts[0].date, lang)}</time>
            </p>
            <h3 className="v3-sub mt-2 text-2xl">
              <Link href={v3Href(lang, "blog", posts[0].slug)} className="hover:text-ember">
                {posts[0].title}
              </Link>
            </h3>
            <p className="mt-2 italic text-news-gray">{posts[0].description}</p>
          </article>
        )}
      </div>
    </div>
  );
}
