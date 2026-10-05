import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";
import type { Dictionary } from "@/lib/dictionary";
import { getProducts, getSite } from "@/lib/content";
import { ButtonLink } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { TerminalPreview } from "./TerminalPreview";

export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const site = getSite();
  const liveProducts = getProducts().filter((p) => p.status === "live").length;
  const stats = [
    ...site.stats.map((s) => ({ value: s.value, label: s.label[lang] })),
    { value: String(liveProducts), label: dict.stats.products },
  ];
  return (
    <section data-surface="ink" aria-labelledby="hero-title" className="overflow-hidden">
      <div className="container-site grid-site gap-y-10 pb-(--section-sm) pt-[clamp(3rem,7vw,6.5rem)]">
        <MonoLabel as="p" className="col-span-full">
          {dict.home.heroTag}
        </MonoLabel>

        <h1 id="hero-title" className="col-span-full font-display-tight text-display font-semibold">
          <span className="settle block">{dict.home.heroLine1}</span>
          <span className="settle settle-2 block lg:pl-[16.66%]">
            {dict.home.heroLine2.replace(/\.$/, "")}
            <span className="settle-dot text-signal">.</span>
          </span>
        </h1>

        <div className="col-span-full flex flex-col gap-8 md:col-span-4 lg:col-span-5 lg:pt-4">
          <p className="text-lead text-stone-400">{dict.home.heroLead}</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={href(lang, "contact")}>{dict.home.heroCta}</ButtonLink>
            <ButtonLink href={href(lang, "projects")} variant="quiet">
              {dict.home.heroSecondary}
            </ButtonLink>
          </div>
        </div>

        <div className="col-span-full md:col-span-6 lg:col-span-6 lg:col-start-7">
          <TerminalPreview lang={lang} dict={dict} />
        </div>

        <dl className="col-span-full mt-4 grid grid-cols-3 border-t border-ink-800 pt-6">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse justify-end gap-1">
              <dt className="font-mono text-mono-sm text-stone-400">{s.label}</dt>
              <dd className="font-display text-h3 font-semibold">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
