import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";
import type { Dictionary } from "@/lib/dictionary";
import { getServices, getStack } from "@/lib/content";
import { ButtonLink } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { ServicesScroll } from "./ServicesScroll";

export function ServicesIndex({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const services = getServices();
  return (
    <section data-surface="ink" aria-labelledby="services-title" className="py-(--section)">
      <div className="container-site grid-site gap-y-10">
        <ServicesScroll total={services.length}>
          <div className="col-span-full lg:col-span-4">
            <div className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <MonoLabel as="p">{dict.home.servicesLabel}</MonoLabel>
              <h2 id="services-title" className="text-h2">
                {dict.home.servicesTitle}
              </h2>
              <MonoLabel as="p" className="mt-4 max-w-xs">
                {getStack().join(" · ")}
              </MonoLabel>
              <ButtonLink href={href(lang, "services")} variant="quiet" className="mt-2 self-start">
                {dict.home.servicesAll}
              </ButtonLink>
              <div aria-hidden className="mt-8 hidden lg:block">
                <span data-service-counter className="font-display text-h3 font-semibold tabular-nums" />
                <span className="mt-3 block h-px w-full bg-ink-800">
                  <span data-service-bar className="block h-px w-full origin-left scale-x-0 bg-signal" />
                </span>
              </div>
            </div>
          </div>

          <ol className="col-span-full border-t border-ink-800 lg:col-span-8">
            {services.map((s, i) => (
              <li key={s.slug} data-service-row className="service-row group relative border-b border-ink-800">
                <div className="grid grid-cols-[3rem_1fr] gap-x-4 gap-y-3 py-8 md:grid-cols-[4rem_1fr_1fr] md:py-10">
                  <span className="font-mono text-mono-sm text-stone-400 transition-colors group-hover:text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-h3 font-semibold">
                    <Link href={`${href(lang, "services")}#${s.slug}`} className="after:absolute after:inset-0">
                      {s.title[lang]}
                    </Link>
                  </h3>
                  <div className="col-start-2 md:col-start-3 md:row-start-1">
                    <p className="text-stone-400">{s.summary[lang]}</p>
                    <p className="mt-3 font-mono text-mono-sm text-stone-400/80">{s.items[lang].join(" / ")}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </ServicesScroll>
      </div>
    </section>
  );
}
