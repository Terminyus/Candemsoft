import type { Metadata } from "next";
import { getStack } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V4PageHead } from "@/components/v4/V4PageHead";
import { Modules } from "@/components/v4/home/Sections";

export async function generateMetadata({ params }: PageProps<"/v4/[lang]/hizmetler">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.services };
}

export default async function Page({ params }: PageProps<"/v4/[lang]/hizmetler">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  return (
    <>
      <V4PageHead path="~/candemsoft/services" title={dict.servicesPage.title} lead={dict.servicesPage.lead} />
      <Modules lang={lang} dict={dict} />
      <section aria-label={dict.servicesPage.stackLabel} className="container-site pt-(--section-sm)">
        <p className="v4-mono text-sm text-dev-comment">{"// " + dict.servicesPage.stackLabel}</p>
        <pre className="mt-3 overflow-x-auto rounded-xl border border-dev-line bg-dev-surface p-5 v4-mono text-sm">
          <span className="text-dev-key">{"{"}</span>
          {"\n  "}
          <span className="text-dev-str">&quot;dependencies&quot;</span>: {"{"}
          {getStack().map((s, i, a) => (
            <span key={s}>
              {"\n    "}
              <span className="text-dev-str">&quot;{s}&quot;</span>: <span className="text-dev-attr">&quot;latest&quot;</span>
              {i < a.length - 1 ? "," : ""}
            </span>
          ))}
          {"\n  }\n"}
          <span className="text-dev-key">{"}"}</span>
        </pre>
      </section>
    </>
  );
}
