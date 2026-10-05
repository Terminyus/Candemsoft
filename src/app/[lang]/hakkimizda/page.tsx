import type { Metadata } from "next";
import { href } from "@/i18n/routes";
import { getProducts, getProjects, getSite } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/page/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { ContactBlock } from "@/components/home/ContactBlock";

export async function generateMetadata({ params }: PageProps<"/[lang]/hakkimizda">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, route: "about", title: dict.nav.about, description: dict.about.lead });
}

export default async function AboutPage({ params }: PageProps<"/[lang]/hakkimizda">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const a = dict.about;
  const site = getSite();
  const numbers = [
    { value: String(site.foundedYear), label: a.founded },
    ...site.stats.map((s) => ({ value: s.value, label: s.label[lang] })),
    { value: String(getProducts().filter((p) => p.status === "live").length), label: dict.stats.products },
  ];
  const clientNames = getProjects()
    .filter((p) => !p.ownProduct)
    .map((p) => p.name);

  return (
    <>
      <PageIntro label={a.label} title={a.title} lead={a.lead} />

      {/* Two sides of the company, set as a split spread rather than cards */}
      <section data-surface="paper" aria-labelledby="two-sides" className="py-(--section)">
        <div className="container-site grid-site gap-y-12">
          <MonoLabel as="p" className="col-span-full">
            <span id="two-sides">{a.twoLabel}</span>
          </MonoLabel>
          <div className="col-span-full md:col-span-3 lg:col-span-5">
            <h2 className="text-h2">{a.clientTitle}</h2>
            <p className="mt-6 text-lead">{a.clientBody}</p>
            <p className="mt-6 font-mono text-mono-sm text-stone-600">{clientNames.join(" · ")}</p>
            <ButtonLink href={href(lang, "projects")} variant="quiet" className="mt-6">
              {dict.common.allProjects}
            </ButtonLink>
          </div>
          <div className="col-span-full border-paper-200 md:col-span-3 md:border-l md:pl-6 lg:col-span-5 lg:col-start-8 lg:mt-32">
            <h2 className="text-h2">{a.ownTitle}</h2>
            <p className="mt-6 text-lead">{a.ownBody}</p>
            <p className="mt-6 font-mono text-mono-sm text-stone-600">
              {getProducts()
                .map((p) => p.name)
                .join(" · ")}
            </p>
            <ButtonLink href={href(lang, "products")} variant="quiet" className="mt-6">
              {dict.home.productsAll}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section data-surface="ink" aria-labelledby="principles" className="py-(--section)">
        <div className="container-site grid-site gap-y-10">
          <MonoLabel as="p" className="col-span-full">
            <span id="principles">{a.principlesLabel}</span>
          </MonoLabel>
          <ol className="col-span-full">
            {a.principles.map((p, i) => (
              <li key={p.title} className="grid-site gap-y-3 border-t border-ink-800 py-10">
                <span className="col-span-1 font-mono text-mono-sm text-signal">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="col-span-3 font-display-tight text-h2 font-extrabold md:col-span-5 lg:col-span-6">{p.title}</h3>
                <p className="col-span-3 col-start-2 text-stone-400 md:col-span-4 md:col-start-2 lg:col-span-4 lg:col-start-9">
                  {p.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section data-surface="paper" aria-labelledby="numbers" className="py-(--section-sm)">
        <div className="container-site grid-site gap-y-8">
          <MonoLabel as="p" className="col-span-full">
            <span id="numbers">{a.numbersLabel}</span>
          </MonoLabel>
          <dl className="col-span-full grid grid-cols-2 gap-y-10 lg:grid-cols-4">
            {numbers.map((n) => (
              <div key={n.label} className="flex flex-col-reverse justify-end gap-2 border-l border-paper-200 pl-4">
                <dt className="font-mono text-mono-sm text-stone-600">{n.label}</dt>
                <dd className="font-display-tight text-h1 font-extrabold">{n.value}</dd>
              </div>
            ))}
          </dl>
          <div className="col-span-full pt-6">
            <ButtonLink href={href(lang, "team")} variant="outline">
              {a.teamCta}
            </ButtonLink>
          </div>
        </div>
      </section>

      <ContactBlock lang={lang} dict={dict} />
    </>
  );
}
