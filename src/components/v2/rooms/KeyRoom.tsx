import dynamic from "next/dynamic";
import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";

const KeyDemo = dynamic(() => import("./KeyDemo").then((m) => m.KeyDemo));

export function KeyRoom({ product, lang, dict, level = 3 }: { product: Product; lang: Locale; dict: Dictionary; level?: 2 | 3 }) {
  const t = dict.v2;
  const Title = level === 2 ? "h2" : "h3";
  return (
    <section id={product.slug} aria-labelledby={`room-${product.slug}`} className="cv-auto-room bg-signal py-(--section) text-ink-950">
      <div className="container-site grid items-center gap-10 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <p className="font-mono text-mono-sm">{dict.common.comingSoon} · {t.keyLayouts}</p>
          <Title id={`room-${product.slug}`} className="v2-display text-[clamp(2.5rem,1.6rem+3.5vw,4.75rem)]">
            {product.name}
          </Title>
          <p className="v2-heading text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)]">{product.tagline[lang]}</p>
          <p className="max-w-xl text-lead">{product.description[lang]}</p>
          <dl className="grid max-w-xl gap-4 border-t border-ink-950/30 pt-5">
            {t.keyFacts.map(([k, v]) => (
              <div key={k} className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <dt className="font-archivo font-bold">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center gap-3">
            {product.links.web && (
              <a
                href={product.links.web}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-ink-950 px-6 font-archivo text-[0.95rem] font-semibold text-white transition-transform active:translate-y-px hover:bg-white hover:text-ink-950"
              >
                {dict.productsPage.web} <span aria-hidden>↗</span>
              </a>
            )}
            <span className="font-mono text-mono-sm">{t.keySoonStores}</span>
          </div>
        </div>
        <KeyDemo t={t} />
      </div>
    </section>
  );
}
