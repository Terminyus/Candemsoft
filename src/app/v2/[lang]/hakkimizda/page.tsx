import type { Metadata } from "next";
import { getProducts, getSite } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V2PageHead } from "@/components/v2/V2PageHead";
import { V2TeamGrid } from "@/components/v2/V2TeamGrid";

export async function generateMetadata({ params }: PageProps<"/v2/[lang]/hakkimizda">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.about };
}

export default async function Page({ params }: PageProps<"/v2/[lang]/hakkimizda">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const a = dict.about;
  const site = getSite();
  const numbers = [
    { v: String(site.foundedYear), k: a.founded },
    ...site.stats.map((s) => ({ v: s.value, k: s.label[lang] })),
    { v: String(getProducts().filter((p) => p.status === "live").length), k: dict.stats.products },
  ];
  return (
    <>
      <V2PageHead kicker={a.label} title={a.title} lead={a.lead} />
      <section className="container-site grid gap-px bg-ink-950 md:grid-cols-2">
        {[
          { t: a.clientTitle, b: a.clientBody },
          { t: a.ownTitle, b: a.ownBody },
        ].map((x, i) => (
          <div key={x.t} className={i === 0 ? "bg-white py-12 md:pr-10" : "bg-signal px-0 py-12 md:px-10"}>
            <h2 className="v2-display text-[clamp(2rem,1.4rem+2.6vw,3.5rem)]">{x.t}</h2>
            <p className="mt-4 text-lead">{x.b}</p>
          </div>
        ))}
      </section>
      <section aria-labelledby="principles" className="container-site py-(--section-sm)">
        <p id="principles" className="font-mono text-mono-sm text-stone-600">
          {a.principlesLabel}
        </p>
        <ol className="mt-6 grid gap-8 md:grid-cols-3">
          {a.principles.map((p, i) => (
            <li key={p.title} className="border-t-4 border-ink-950 pt-5">
              <span className="v2-display text-4xl text-signal">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="v2-heading mt-3 text-2xl">{p.title}</h3>
              <p className="mt-3 text-stone-600">{p.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <dl className="container-site grid grid-cols-2 border-y border-ink-950 md:grid-cols-4">
        {numbers.map((n, i) => (
          <div key={n.k} className={`flex flex-col-reverse justify-end gap-1 py-8 ${i % 2 ? "border-l border-ink-950 pl-4" : ""} ${i > 0 ? "md:border-l md:pl-6" : ""}`}>
            <dt className="font-mono text-mono-sm text-stone-600">{n.k}</dt>
            <dd className="v2-display text-[clamp(2.5rem,1.8rem+3vw,4.5rem)]">{n.v}</dd>
          </div>
        ))}
      </dl>
      <section id="team" aria-labelledby="team-title" className="container-site py-(--section-sm)">
        <h2 id="team-title" className="v2-display mb-10 text-[clamp(2rem,1.4rem+2.6vw,3.5rem)]">
          {dict.teamPage.title}
        </h2>
        <V2TeamGrid lang={lang} />
      </section>
    </>
  );
}
