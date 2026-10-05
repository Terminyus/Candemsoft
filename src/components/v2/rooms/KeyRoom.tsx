import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";

const rows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
  ["Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç"],
];

export function KeyRoom({ product, lang, dict, level = 3 }: { product: Product; lang: Locale; dict: Dictionary; level?: 2 | 3 }) {
  const t = dict.v2;
  const Title = level === 2 ? "h2" : "h3";
  return (
    <section id={product.slug} aria-labelledby={`room-${product.slug}`} className="cv-auto bg-signal py-(--section-sm) text-ink-950">
      <div className="container-site grid items-center gap-10 lg:grid-cols-[5fr_6fr]">
        <div>
          <p className="font-mono text-mono-sm">{dict.common.comingSoon}</p>
          <Title id={`room-${product.slug}`} className="v2-display mt-2 text-[clamp(2.5rem,1.6rem+3.5vw,4.75rem)]">
            {product.name}
          </Title>
          <p className="v2-heading mt-4 text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)]">{t.keyTitle}</p>
          <p className="mt-3 max-w-md text-lead">{product.description[lang]}</p>
        </div>
        <div aria-hidden className="space-y-2">
          {rows.map((row, r) => (
            <div key={r} className="flex justify-center gap-1.5 sm:gap-2" style={{ paddingLeft: `${r * 4}%` }}>
              {row.map((k) => (
                <span
                  key={k}
                  className="grid aspect-square w-[7.4%] place-items-center rounded-md bg-ink-950 font-archivo text-[clamp(0.75rem,0.5rem+1vw,1.25rem)] font-bold text-white shadow-[0_4px_0_0_#000]"
                >
                  {k}
                </span>
              ))}
            </div>
          ))}
          <div className="flex justify-center gap-2 pt-1">
            <span className="grid h-10 w-[46%] place-items-center rounded-md bg-ink-950 font-mono text-sm text-white shadow-[0_4px_0_0_#000] sm:h-12">
              space
            </span>
            <span className="grid h-10 w-[14%] place-items-center rounded-md bg-white font-archivo text-sm font-bold text-ink-950 shadow-[0_4px_0_0_#000] sm:h-12">
              AI ✦
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
