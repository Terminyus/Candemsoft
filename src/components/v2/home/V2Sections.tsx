import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getProjects, getServices, getSite } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { ProjectVisual } from "@/components/project/ProjectVisual";
import { v2Href } from "@/components/v2/nav";

export function SectionHead({ kicker, title, lead, id }: { kicker: string; title: string; lead?: string; id: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-end">
      <div>
        <p className="font-mono text-mono-sm text-stone-600">{kicker}</p>
        <h2 id={id} className="v2-display mt-4 text-[clamp(2.25rem,1.4rem+3.8vw,5rem)]">
          {title}
        </h2>
      </div>
      {lead && <p className="text-lead text-stone-600">{lead}</p>}
    </div>
  );
}

export function RoomsIntro({ dict }: { dict: Dictionary }) {
  const t = dict.v2;
  return (
    <div id="rooms" className="container-site scroll-mt-(--header-h) py-(--section-sm)">
      <SectionHead id="rooms-title" kicker={t.roomsKicker} title={t.roomsTitle} lead={t.roomsLead} />
    </div>
  );
}

export function ClientWork({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.v2;
  const clients = getProjects().filter((p) => !p.ownProduct);
  const live = clients.filter((p) => p.status === "live");
  const offline = clients.filter((p) => p.status === "offline");
  return (
    <section aria-labelledby="clients-title" className="cv-auto container-site py-(--section)">
      <SectionHead id="clients-title" kicker={t.clientsKicker} title={t.clientsTitle} />
      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        {live.map((p) => (
          <article key={p.slug} className="group relative">
            <ProjectVisual
              project={p}
              variant="desktop"
              pendingLabel={dict.home.visualPending}
              alt={dict.common.shotDesktop.replace("{name}", p.name)}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="rounded-2xl ring-1 ring-ink-950"
            />
            <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-ink-950 pb-4">
              <h3 className="v2-heading text-2xl">
                <Link href={v2Href(lang, "projects", p.slug)} className="after:absolute after:inset-0 group-hover:text-ember">
                  {p.name}
                </Link>
              </h3>
              <p className="font-mono text-mono-sm text-stone-600">{p.type[lang]}</p>
            </div>
          </article>
        ))}
        <ul className="self-start border-t border-ink-950">
          {offline.map((p) => (
            <li key={p.slug} className="relative flex items-baseline justify-between gap-4 border-b border-ink-950/20 py-4">
              <Link href={v2Href(lang, "projects", p.slug)} className="v2-heading text-xl after:absolute after:inset-0 hover:text-ember">
                {p.name}
              </Link>
              <span className="text-right font-mono text-mono-sm text-stone-600">
                {p.type[lang]} · {t.clientsOffline}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ServicesGrid({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const services = getServices();
  return (
    <section aria-labelledby="v2-services" className="cv-auto border-y border-ink-950 bg-white">
      <div className="container-site py-(--section)">
        <SectionHead id="v2-services" kicker={dict.v2.servicesKicker} title={dict.servicesPage.title} lead={dict.servicesPage.lead} />
        <ol className="mt-12 grid border-t border-ink-950 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((s, i) => (
            <li key={s.slug} className="relative border-b border-ink-950 py-6 sm:pr-6 lg:border-b-0 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0">
              <span className="v2-display text-4xl text-signal">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="v2-heading mt-4 text-xl">
                <Link href={`${v2Href(lang, "services")}#${s.slug}`} className="after:absolute after:inset-0 hover:text-ember">
                  {s.title[lang]}
                </Link>
              </h3>
              <p className="mt-3 text-stone-600">{s.summary[lang]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function AboutBand({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.v2;
  const site = getSite();
  return (
    <section aria-labelledby="v2-about" className="cv-auto container-site grid gap-10 py-(--section) lg:grid-cols-2">
      <div>
        <p className="font-mono text-mono-sm text-stone-600">{t.aboutKicker}</p>
        <h2 id="v2-about" className="v2-display mt-4 text-[clamp(2.25rem,1.4rem+3.8vw,5rem)]">
          {t.aboutTitle}
        </h2>
      </div>
      <div className="space-y-6 text-lead">
        <p>{dict.about.lead}</p>
        <p className="text-stone-600">{dict.about.ownBody}</p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link href={v2Href(lang, "about")} className="font-archivo font-semibold underline decoration-signal decoration-2 underline-offset-[6px] hover:text-ember">
            {dict.nav.about} →
          </Link>
          <span className="font-mono text-mono-sm text-stone-600">
            {site.contact.city[lang]} · {site.foundedYear}
          </span>
        </div>
      </div>
    </section>
  );
}
