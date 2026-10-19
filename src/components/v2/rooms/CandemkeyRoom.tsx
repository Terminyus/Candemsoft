import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { KeyDemo } from "./KeyDemo";
import { RoomInfo, type RoomTheme } from "./RoomInfo";

// candemkey.com: night-blue surfaces, a purple → blue → cyan light.
const theme: RoomTheme = {
  kicker: "text-ck-muted",
  button: "bg-ck-violet text-white hover:bg-white hover:text-ck-bg",
  ghost: "border border-ck-line text-ck-text hover:border-ck-purple",
  rule: "border-ck-line",
  bullet: "text-ck-cyan",
  muted: "text-ck-muted",
};

export function CandemkeyRoom({
  product,
  lang,
  dict,
  index,
  level = 3,
}: {
  product: Product;
  lang: Locale;
  dict: Dictionary;
  index: number;
  level?: 2 | 3;
}) {
  const t = dict.v2;
  const tagline = product.tagline[lang];
  const at = tagline.indexOf(t.keyHighlight);
  return (
    <section
      id={product.slug}
      aria-labelledby={`room-${product.slug}`}
      className="cv-auto relative overflow-hidden bg-ck-bg py-(--section) text-ck-text"
    >
      {/* the glowing arc from candemkey.com's hero */}
      <svg
        aria-hidden
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%] w-full"
      >
        <defs>
          <linearGradient id="ck-arc" x1="0" x2="1">
            <stop offset="0" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset=".45" stopColor="#8b5cf6" />
            <stop offset=".75" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#22d3ee" stopOpacity=".2" />
          </linearGradient>
          <radialGradient id="ck-glow" cx=".75" cy=".15" r=".6">
            <stop offset="0" stopColor="#8b5cf6" stopOpacity=".28" />
            <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1200" height="600" fill="url(#ck-glow)" />
        <path d="M380 600C520 230 820 60 1200 40" fill="none" stroke="url(#ck-arc)" strokeWidth="2.5" />
      </svg>
      <div className="container-site relative grid items-center gap-12 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <RoomInfo
          level={level}
          product={product}
          lang={lang}
          dict={dict}
          theme={theme}
          index={index}
          titleClass="text-ck-text"
          taglineClass="v2-heading text-[clamp(1.6rem,1.2rem+1.5vw,2.4rem)] leading-[1.15] text-ck-text"
          tagline={
            at < 0 ? undefined : (
              <>
                {tagline.slice(0, at)}
                <span className="ck-grad">{t.keyHighlight}</span>
                {tagline.slice(at + t.keyHighlight.length)}
              </>
            )
          }
          extra={
            <p className="flex flex-wrap items-center gap-2 text-sm text-ck-muted">
              <span className="sr-only">{t.keyStores}:</span>
              {["App Store", "Google Play"].map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-2 rounded-full border border-ck-line px-3 py-1 text-ck-text"
                >
                  {s}
                  <span className="rounded-full bg-ck-violet/30 px-2 py-0.5 font-mono text-[0.65rem] uppercase">
                    {dict.common.comingSoon}
                  </span>
                </span>
              ))}
            </p>
          }
        />
        <div className="min-w-0">
          <KeyDemo
            before={t.keyDemo.before}
            actions={t.keyDemo.actions as [string, string][]}
            labels={{
              before: t.keyBefore,
              after: t.keyAfter,
              actions: t.keyActions,
              sample: t.sample,
              note: t.keyDemoNote,
            }}
          />
        </div>
      </div>
    </section>
  );
}
