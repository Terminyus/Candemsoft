import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { FitMap } from "./FitMap";
import map from "./fit-map.json";
import { RoomInfo, type RoomTheme } from "./RoomInfo";

const theme: RoomTheme = {
  kicker: "text-fit-teal",
  button: "bg-fit-teal text-fit-night hover:bg-white",
  ghost: "border-2 border-fit-teal/50 text-fit-teal hover:border-fit-teal",
  rule: "border-white/15",
  bullet: "text-fit-teal",
  muted: "text-white/80",
};

export function FitRoom({ product, lang, dict, index, level = 3 }: { product: Product; lang: Locale; dict: Dictionary; index: number; level?: 2 | 3 }) {
  const t = dict.v2;
  return (
    <section id={product.slug} aria-labelledby={`room-${product.slug}`} className="cv-auto relative overflow-hidden bg-fit-night py-(--section) text-white">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[6fr_5fr] lg:gap-16">
        <figure className="order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#04121a] p-4 sm:p-6">
            <div className="flex items-center justify-between font-mono text-mono-sm">
              <span className="text-fit-teal">{t.fitWorkout}</span>
              <span className="rounded-full border border-white/20 px-2 py-0.5 text-white/70">{t.sample}</span>
            </div>
            <div className="mt-3">
              <FitMap
                lang={lang}
                labels={{ distance: t.fitDistance, pace: t.fitPace, time: t.fitTime, pause: t.fitPause, play: t.fitPlay, place: map.place }}
                route={{ d: map.route, start: map.start, metres: map.metres, viewBox: map.viewBox }}
              >
                <path d={map.layers.park} fill="#00d8d8" fillOpacity="0.07" />
                <path d={map.layers.minor} fill="none" stroke="#fff" strokeOpacity="0.13" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d={map.layers.major} fill="none" stroke="#fff" strokeOpacity="0.2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d={map.layers.coast} fill="none" stroke="#00d8d8" strokeOpacity="0.4" strokeWidth="1.2" />
              </FitMap>
            </div>
          </div>
          <figcaption className="mt-3 font-mono text-mono-sm text-white/70">
            {t.fitNote}{" "}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-fit-teal">
              © OpenStreetMap
            </a>
          </figcaption>
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
