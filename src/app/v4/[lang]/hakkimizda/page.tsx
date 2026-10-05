import type { Metadata } from "next";
import { getProducts, getSite } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { Counter } from "@/components/v4/fx/Counter";
import { V4PageHead } from "@/components/v4/V4PageHead";
import { V4Team } from "@/components/v4/V4Team";
import { SectionHead } from "@/components/v4/home/Sections";

export async function generateMetadata({ params }: PageProps<"/v4/[lang]/hakkimizda">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.about };
}

export default async function Page({ params }: PageProps<"/v4/[lang]/hakkimizda">) {
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
      <V4PageHead path="$ cat README.md" title={a.title} lead={a.lead} />
      <div className="container-site grid gap-5 pt-12 md:grid-cols-2">
        {[
          { t: a.clientTitle, b: a.clientBody, c: "border-dev-key/40" },
          { t: a.ownTitle, b: a.ownBody, c: "border-signal/50" },
        ].map((x) => (
          <section key={x.t} className={`v4-rise rounded-xl border bg-dev-surface p-6 ${x.c}`}>
            <h2 className="v4-title text-3xl">{x.t}</h2>
            <p className="mt-3 text-lg text-dev-muted">{x.b}</p>
          </section>
        ))}
      </div>
      <dl className="container-site mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {numbers.map((n) => (
          <div key={n.k} className="flex flex-col-reverse justify-end gap-1 rounded-xl border border-dev-line p-5">
            <dt className="v4-mono text-xs text-dev-comment">{n.k}</dt>
            <dd className="v4-title text-5xl">
              <Counter value={n.v} />
            </dd>
          </div>
        ))}
      </dl>
      <section aria-labelledby="principles" className="container-site pt-(--section)">
        <SectionHead id="principles" path="$ git log --format=%s principles" title={a.principlesLabel} />
        <ol className="mt-8 space-y-3">
          {a.principles.map((p, i) => (
            <li key={p.title} className="v4-rise rounded-xl border border-dev-line bg-dev-surface p-5">
              <p className="v4-mono text-sm">
                <span className="text-dev-tag">#{String(i + 1).padStart(2, "0")}</span> <span className="text-dev-str">principle:</span> <span className="text-dev-text">{p.title}</span>
              </p>
              <p className="mt-2 text-dev-muted">{p.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <section aria-labelledby="team" className="container-site pt-(--section)">
        <SectionHead id="team" path="$ ls ./team" title={dict.teamPage.title} lead={dict.teamPage.lead} />
        <div className="mt-8">
          <V4Team lang={lang} />
        </div>
      </section>
    </>
  );
}
