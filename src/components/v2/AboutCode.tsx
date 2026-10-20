import type { Locale } from "@/i18n/config";
import { getProducts, getServices, getSite, getStack } from "@/lib/content";

const str = (s: string) => <span className="text-signal">&quot;{s}&quot;</span>;
const list = (xs: string[]) => (
  <>
    [
    {xs.map((x, i) => (
      <span key={x}>
        {str(x)}
        {i < xs.length - 1 ? ", " : ""}
      </span>
    ))}
    ]
  </>
);

/**
 * The company's facts as a TypeScript file, compiled from /content (nothing typed in by hand).
 * Lines wipe in as the card scrolls into view.
 */
export function AboutCode({ lang }: { lang: Locale }) {
  const site = getSite();
  const products = getProducts();
  const lines = [
    <>
      <span className="text-stone-400">{"// derlendi: content/*.json"}</span>
    </>,
    <>
      <span className="text-[#ff8a4c]">export const</span> candemsoft = {"{"}
    </>,
    <>
      {"  "}founded: <span className="text-[#e3b341]">{site.foundedYear}</span>,
    </>,
    <>
      {"  "}city: {str(site.contact.city[lang])},
    </>,
    <>
      {"  "}services: {list(getServices().map((s) => s.title[lang]))},
    </>,
    <>
      {"  "}stack: {list(getStack())},
    </>,
    <>
      {"  "}products: {"{"}
    </>,
    <>
      {"    "}live: {list(products.filter((p) => p.status === "live").map((p) => p.name))},
    </>,
    <>
      {"    "}soon: {list(products.filter((p) => p.status === "soon").map((p) => p.name))},
    </>,
    <>{"  },"}</>,
    <>
      {"  "}stats: {list(site.stats.map((s) => `${s.value} ${s.label[lang]}`))},
    </>,
    <>{"} as const;"}</>,
  ];
  return (
    <div className="about-code overflow-hidden rounded-3xl bg-ink-950 text-paper-100 shadow-[12px_12px_0_0_var(--color-signal)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
        <span className="size-3 rounded-full bg-white/15" />
        <span className="size-3 rounded-full bg-white/15" />
        <span className="size-3 rounded-full bg-white/15" />
        <span className="ml-3 font-mono text-mono-sm text-stone-400">candemsoft.ts</span>
      </div>
      <pre className="overflow-x-auto px-5 py-5 font-mono text-[0.85rem] leading-relaxed">
        <code>
          {lines.map((l, i) => (
            <span key={i} className="about-line block whitespace-pre-wrap [counter-increment:line] before:mr-4 before:inline-block before:w-5 before:text-right before:text-stone-600 before:content-[counter(line)]" style={{ "--i": i } as React.CSSProperties}>
              {l}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
