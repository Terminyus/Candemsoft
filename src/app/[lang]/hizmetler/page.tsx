import type { Metadata } from "next";
import Link from "next/link";
import { href } from "@/i18n/routes";
import { getProjects, getServices, getStack } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/page/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { cn } from "@/components/ui/cn";

export async function generateMetadata({ params }: PageProps<"/[lang]/hizmetler">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, route: "services", title: dict.nav.services, description: dict.servicesPage.lead });
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/hizmetler">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.servicesPage;
  const services = getServices();
  const projects = getProjects();

  return (
    <>
      <PageIntro
        label={t.label}
        title={t.title}
        lead={t.lead}
        aside={
          <nav
            aria-label={t.label}
            // One scrollable line: its height must not depend on which mono font has loaded (CLS).
            className="-mx-(--gutter) flex gap-x-6 overflow-x-auto whitespace-nowrap border-t border-ink-800 px-(--gutter) pt-6 [scrollbar-width:none] lg:mx-0 lg:px-0"
          >
            {services.map((s, i) => (
              <a
                key={s.slug}
                href={`#${s.slug}`}
                className="font-mono text-mono-sm text-stone-400 hover:text-paper-100"
              >
                <span className="text-signal">{String(i + 1).padStart(2, "0")}</span> {s.title[lang]}
              </a>
            ))}
          </nav>
        }
      />

      {services.map((s, i) => {
        const related = projects.filter((p) => p.services.includes(s.slug)).slice(0, 4);
        const flip = i % 2 === 1;
        return (
          <section
            key={s.slug}
            id={s.slug}
            aria-labelledby={`${s.slug}-title`}
            data-surface="paper"
            className="border-b border-paper-200 py-(--section-sm)"
          >
            <div className="container-site grid-site gap-y-8">
              <div className={cn("col-span-full lg:col-span-6", flip && "lg:col-start-7")}>
                <span
                  aria-hidden
                  data-numeral={String(i + 1).padStart(2, "0")}
                  className="numeral block font-display-tight text-[clamp(5rem,3rem+10vw,12rem)] font-extrabold leading-[0.8] text-paper-200"
                />
                <h2 id={`${s.slug}-title`} className="-mt-[0.4em] text-h2">
                  {s.title[lang]}
                </h2>
                <p className="mt-6 max-w-xl text-lead">{s.summary[lang]}</p>
              </div>
              <div
                className={cn(
                  "col-span-full lg:col-span-4 lg:self-end",
                  flip ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-9",
                )}
              >
                <MonoLabel as="p">{t.includes}</MonoLabel>
                <ul className="mt-3 border-t border-ink-950">
                  {s.items[lang].map((item) => (
                    <li key={item} className="border-b border-paper-200 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
                {related.length > 0 && (
                  <>
                    <MonoLabel as="p" className="mt-8">
                      {t.related}
                    </MonoLabel>
                    <p className="mt-2">
                      {related.map((p, j) => (
                        <span key={p.slug}>
                          <Link
                            href={href(lang, "projects", p.slug)}
                            className="underline decoration-paper-200 underline-offset-4 hover:decoration-ink-950"
                          >
                            {p.name}
                          </Link>
                          {j < related.length - 1 && ", "}
                        </span>
                      ))}
                    </p>
                  </>
                )}
                <ButtonLink href={href(lang, "contact")} variant="quiet" className="mt-8">
                  {t.cta}
                </ButtonLink>
              </div>
            </div>
          </section>
        );
      })}

      <section data-surface="ink" aria-labelledby="stack-title" className="py-(--section-sm)">
        <div className="container-site grid-site gap-y-6">
          <MonoLabel as="h2" className="col-span-full">
            <span id="stack-title">{t.stackLabel}</span>
          </MonoLabel>
          <ul className="col-span-full flex flex-wrap gap-x-[0.4em] font-display-tight text-h2 font-extrabold">
            {getStack().map((tech, i, all) => (
              <li key={tech}>
                {tech}
                {i < all.length - 1 && <span className="text-ink-600"> /</span>}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
