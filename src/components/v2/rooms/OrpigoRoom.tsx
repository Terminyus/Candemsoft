import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { RoomInfo, type RoomTheme } from "./RoomInfo";
import { OrpigoReader } from "./OrpigoReader";

const theme: RoomTheme = {
  kicker: "text-[#ff8a95]",
  button: "bg-orpigo-red text-white hover:bg-white hover:text-orpigo-navy",
  ghost: "border-2 border-white/40 text-white hover:border-white",
  rule: "border-white/20",
  bullet: "text-[#ff6b78]",
  muted: "text-white/80",
};

export function OrpigoRoom({ product, lang, dict, index, level = 3 }: { product: Product; lang: Locale; dict: Dictionary; index: number; level?: 2 | 3 }) {
  const t = dict.v2;
  return (
    <section id={product.slug} aria-labelledby={`room-${product.slug}`} className="cv-auto relative overflow-hidden bg-orpigo-navy py-(--section) text-white">
      {/* the app's motion lines, as one quiet graphic */}
      <svg aria-hidden viewBox="0 0 400 120" className="absolute -left-10 top-10 w-[34rem] max-w-none text-orpigo-red opacity-30">
        {[20, 46, 72, 98].map((y, i) => (
          <line key={y} x1={0} x2={300 - i * 50} y1={y} y2={y} stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        ))}
      </svg>
      <div className="container-site relative grid items-center gap-12 lg:grid-cols-[6fr_5fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <OrpigoReader text={t.orpigoText} labels={{ title: t.orpigoDemo, play: t.orpigoPlay, pause: t.orpigoPause, speed: t.orpigoSpeed, wpm: t.orpigoWpm }} />
        </div>
        <div className="order-1 lg:order-2">
          <RoomInfo level={level} product={product} lang={lang} dict={dict} theme={theme} index={index} />
        </div>
      </div>
    </section>
  );
}
