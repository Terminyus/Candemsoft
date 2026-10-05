import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { RoomInfo, type RoomTheme } from "./RoomInfo";

const theme: RoomTheme = {
  kicker: "text-fit-teal",
  button: "bg-fit-teal text-fit-night hover:bg-white",
  ghost: "border-2 border-fit-teal/50 text-fit-teal hover:border-fit-teal",
  rule: "border-white/15",
  bullet: "text-fit-teal",
  muted: "text-white/80",
};

// A loop around a park, roughly: the kind of route the app animates after a run.
const route =
  "M60 300 C 60 220, 120 170, 190 160 S 300 120, 330 70 S 440 40, 470 110 S 450 230, 380 250 S 270 250, 240 300 S 150 380, 100 360 S 60 330, 60 300";

export function FitRoom({ product, lang, dict, index, level = 3 }: { product: Product; lang: Locale; dict: Dictionary; index: number; level?: 2 | 3 }) {
  const t = dict.v2;
  const stats = [
    { k: t.fitDistance, v: "5,2 km" },
    { k: t.fitPace, v: "5'48\"" },
    { k: t.fitTime, v: "30:10" },
  ];
  return (
    <section id={product.slug} aria-labelledby={`room-${product.slug}`} className="cv-auto relative overflow-hidden bg-fit-night py-(--section) text-white">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[6fr_5fr] lg:gap-16">
        <figure className="order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#04121a] p-4 sm:p-6">
            <div className="flex items-center justify-between font-mono text-mono-sm">
              <span className="text-fit-teal">{t.fitWorkout}</span>
              <span className="rounded-full border border-white/20 px-2 py-0.5 text-white/70">{t.sample}</span>
            </div>
            <svg viewBox="0 0 530 400" role="img" aria-label={t.fitWorkout} className="mt-2 h-auto w-full">
              {/* street grid */}
              {[80, 160, 240, 320].map((y) => (
                <line key={`h${y}`} x1="0" x2="530" y1={y} y2={y} stroke="white" strokeOpacity="0.06" strokeWidth="10" />
              ))}
              {[110, 230, 350, 470].map((x) => (
                <line key={`v${x}`} y1="0" y2="400" x1={x} x2={x} stroke="white" strokeOpacity="0.06" strokeWidth="10" />
              ))}
              <path d={route} fill="none" stroke="#00d8d8" strokeOpacity="0.18" strokeWidth="16" strokeLinecap="round" />
              <path className="fit-route" d={route} pathLength={1} fill="none" stroke="#00d8d8" strokeWidth="5" strokeLinecap="round" />
              <circle cx="60" cy="300" r="9" fill="#000810" stroke="#00d8d8" strokeWidth="4" />
            </svg>
            <dl className="mt-2 grid grid-cols-3 gap-2">
              {stats.map((s) => (
                <div key={s.k} className="rounded-2xl bg-white/5 px-3 py-3">
                  <dt className="font-mono text-[0.7rem] text-white/70">{s.k}</dt>
                  <dd className="mt-1 font-archivo text-xl font-bold tabular-nums sm:text-2xl">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figcaption className="mt-3 font-mono text-mono-sm text-white/70">{t.sampleNote}</figcaption>
        </figure>
        <div className="order-1 lg:order-2">
          <RoomInfo level={level}
            product={product}
            lang={lang}
            dict={dict}
            theme={theme}
            index={index}
            titleClass="text-white"
            taglineClass="v2-heading text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] text-fit-teal"
          />
        </div>
      </div>
    </section>
  );
}
