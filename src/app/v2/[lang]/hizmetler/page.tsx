import type { Metadata } from "next";
import { getServices, getStack } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V2PageHead } from "@/components/v2/V2PageHead";

export async function generateMetadata({ params }: PageProps<"/v2/[lang]/hizmetler">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.services };
}

export default async function Page({ params }: PageProps<"/v2/[lang]/hizmetler">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <>
      <V2PageHead kicker={dict.servicesPage.label} title={dict.servicesPage.title} lead={dict.servicesPage.lead} />
      <ol className="container-site">
        {getServices().map((s, i) => (
          <li key={s.slug} id={s.slug} className="grid scroll-mt-(--header-h) gap-6 border-b border-ink-950 py-12 md:grid-cols-[8rem_1fr_1fr]">
            <span className="v2-display text-6xl text-signal">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="v2-display text-[clamp(2rem,1.4rem+2.6vw,3.5rem)]">{s.title[lang]}</h2>
              <p className="mt-4 max-w-xl text-lead text-stone-600">{s.summary[lang]}</p>
            </div>
            <ul className="self-end">
              {s.items[lang].map((item) => (
                <li key={item} className="flex gap-3 border-t border-ink-950/20 py-3 font-archivo font-medium">
                  <span aria-hidden className="text-signal">
                    ●
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <section aria-label={dict.servicesPage.stackLabel} className="container-site py-(--section-sm)">
        <p className="font-mono text-mono-sm text-stone-600">{dict.servicesPage.stackLabel}</p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {getStack().map((s) => (
            <li key={s} className="rounded-full border border-ink-950 px-5 py-2 v2-heading text-xl">
              {s}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
