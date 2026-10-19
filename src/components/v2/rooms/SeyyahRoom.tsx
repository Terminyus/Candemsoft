import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { asset } from "@/lib/static";
import { RoomInfo, type RoomTheme } from "./RoomInfo";

// Palette and drawing language follow the revised seyyah.info: blue ink on warm paper.
const theme: RoomTheme = {
  kicker: "text-seyyah-ink",
  button: "bg-seyyah-ink text-white shadow-[3px_4px_0_0_var(--color-seyyah-deep)] hover:bg-seyyah-deep",
  ghost: "border-[1.5px] border-seyyah-ink bg-white text-seyyah-ink hover:bg-seyyah-soft",
  rule: "border-seyyah-ink/25",
  bullet: "text-seyyah-ink",
  muted: "text-seyyah-title/80",
};

const FOOT =
  "M1948 3197 c-218 -92 -358 -390 -268 -567 25 -50 74 -89 183 -147 153 -81 271 -183 319 -277 25 -48 25 -49 98 114 209 462 194 754 -45 870 -75 36 -209 39 -287 7z M1284 3021 c-124 -56 -215 -215 -198 -343 28 -216 316 -194 423 32 35 74 38 212 5 257 -54 72 -143 93 -230 54z M785 2801 c-171 -42 -270 -297 -154 -395 80 -68 230 3 289 137 69 155 -2 290 -135 258z M340 2479 c-90 -36 -159 -175 -130 -263 36 -111 183 -80 253 54 71 135 -1 257 -123 209z M1250 2369 c-495 -55 -957 -334 -1072 -647 -37 -98 -32 -258 9 -342 64 -129 158 -216 348 -324 55 -31 103 -56 108 -56 17 0 216 -96 273 -132 233 -146 210 -348 -40 -348 -225 0 -561 212 -778 490 -32 41 -29 46 -59 -120 -30 -167 -33 -432 -5 -530 96 -347 487 -448 970 -251 348 143 663 425 748 670 36 104 33 256 -6 331 -78 151 -191 234 -503 371 -351 154 -446 276 -307 397 114 101 421 135 484 55 28 -36 26 -104 -5 -172 -30 -64 -32 -61 70 -101 238 -94 419 -251 450 -391 4 -16 10 -29 14 -29 9 0 60 115 101 229 216 593 -125 975 -800 900z";

/** One footprint (the app's own mark); the left foot is the right one mirrored. */
function Foot({ left }: { left?: boolean }) {
  return (
    <g transform={left ? "translate(26 0) scale(-1 1)" : undefined}>
      <path d={FOOT} transform="scale(0.1066 0.1238) translate(0 323) scale(0.1 -0.1)" />
    </g>
  );
}

/** Footprints walking into the room, along a gentle wave (as between sections on seyyah.info). */
function Trail() {
  const steps = 8;
  return (
    <svg
      aria-hidden
      viewBox="0 0 520 120"
      className="sy-trail mx-auto block h-auto w-[min(520px,88%)] overflow-visible fill-seyyah-ink"
    >
      {Array.from({ length: steps }, (_, i) => {
        const t = i / (steps - 1);
        const x = 26 + t * 468;
        const y = 60 + Math.sin(t * Math.PI * 1.6) * 22;
        const slope = (Math.cos(t * Math.PI * 1.6) * 22 * Math.PI * 1.6) / 468;
        const side = i % 2 ? 1 : -1;
        const rot = 90 + (Math.atan(slope) * 180) / Math.PI;
        return (
          <g
            key={i}
            className="sy-step"
            style={{ "--i": i } as React.CSSProperties}
            transform={`translate(${x.toFixed(1)} ${(y + side * 13).toFixed(1)}) rotate(${rot.toFixed(1)}) translate(-13 -20)`}
          >
            <Foot left={side < 0} />
          </g>
        );
      })}
    </svg>
  );
}

const pin = "M18 40s14-13 14-24a14 14 0 0 0-28 0c0 11 14 24 14 24Z";
const route = "M58 300C120 296 140 250 190 236S262 236 300 210 360 168 412 160";

function Notebook({ t }: { t: Dictionary["v2"] }) {
  const [p1, p2, p3] = t.seyyahPins;
  return (
    <svg viewBox="0 0 480 360" aria-hidden className="block h-auto w-full overflow-visible">
      <defs>
        <filter id="sy-wobble" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <pattern id="sy-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#1f4fbf" strokeWidth="1.3" strokeOpacity=".55" />
        </pattern>
        {/* the dashed route is revealed by a solid stroke drawing underneath it */}
        <mask id="sy-route" maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="360">
          <path data-draw pathLength={1} d={route} fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" />
        </mask>
      </defs>
      <text x="18" y="62" fontSize="46" className="sy-write fill-seyyah-ink font-hand font-bold">
        {t.seyyahNotebook}
      </text>
      <g filter="url(#sy-wobble)">
        <path data-draw pathLength={1} className="sy-ink" strokeWidth="2.6" d="M20 80c70-6 160-9 250-4s130 2 190-3" />
        <path mask="url(#sy-route)" className="sy-ink" strokeWidth="3.4" strokeDasharray="2 9" d={route} />
        {[
          [40, 262, "#fff"],
          [172, 196, "#fff"],
          [394, 120, "url(#sy-hatch)"],
        ].map(([x, y, fill]) => (
          <g key={`${x}`} transform={`translate(${x} ${y})`}>
            <path className="sy-ink" fill={fill as string} d={pin} />
            <circle cx="18" cy="16" r="5" className="fill-seyyah-ink" />
          </g>
        ))}
        {/* GPS stamp */}
        <g transform="translate(62 112) rotate(-10)">
          <circle data-draw pathLength={1} className="sy-ink" strokeWidth="2.4" cx="44" cy="44" r="40" />
          <circle data-draw pathLength={1} className="sy-ink" strokeWidth="1.4" cx="44" cy="44" r="33" />
          <path data-draw pathLength={1} className="sy-ink" strokeWidth="4" d="M27 45l11 11 23-25" />
          <text x="44" y="78" textAnchor="middle" fontSize="9" letterSpacing="2" className="fill-seyyah-ink font-mono">
            GPS ✓
          </text>
        </g>
      </g>
      <g className="fill-seyyah-ink font-hand font-bold" fontSize="24">
        <text x="22" y="340">
          {p1}
        </text>
        <text x="150" y="282">
          {p2}
        </text>
        <text x="300" y="132">
          {p3}
        </text>
      </g>
    </svg>
  );
}

export function SeyyahRoom({
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
  // "Türkiye'yi keşfet. Her check-in bir anı." → print line, then the hand-written line underlined in ink.
  const [lead, ...rest] = product.tagline[lang].split(/(?<=\.)\s+/);
  return (
    <section
      id={product.slug}
      aria-labelledby={`room-${product.slug}`}
      className="cv-auto relative overflow-hidden bg-seyyah-paper pb-(--section) pt-8 text-seyyah-title"
    >
      {/* faint pencil landscape from the app, fading in and out at the edges */}
      <Image
        src={asset("/rooms/seyyah/turkiye-rotasi.webp")}
        alt=""
        width={1536}
        height={1024}
        sizes="100vw"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-auto w-full opacity-90 mix-blend-multiply [mask-image:linear-gradient(to_bottom,transparent,#000_35%,#000_80%,transparent)] max-sm:w-[220%] max-sm:max-w-none"
      />
      <Trail />
      <div className="container-site relative mt-6 grid items-center gap-14 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <RoomInfo
          level={level}
          product={product}
          lang={lang}
          dict={dict}
          theme={theme}
          index={index}
          titleClass="text-seyyah-title"
          taglineClass="v2-heading text-[clamp(1.6rem,1.2rem+1.5vw,2.4rem)] leading-[1.15] text-seyyah-title"
          tagline={
            <>
              {lead}
              {rest.length > 0 && (
                <span className="mt-1 block font-hand text-[1.2em] font-bold text-seyyah-ink">
                  <span className="sy-scribble">{rest.join(" ")}</span>
                </span>
              )}
            </>
          }
        />
        <figure role="img" aria-label={t.seyyahArt} className="relative mx-auto w-full max-w-[560px] pb-16 pr-2">
          <div className="sy-paper sy-notebook sy-draw relative -rotate-[1.5deg] py-6 pl-9 pr-5">
            <Notebook t={t} />
          </div>
          {/* polaroid: the app's pencil drawing of Galata */}
          <div className="sy-paper absolute -bottom-2 right-0 w-[40%] rotate-[5deg] rounded-[2px] bg-white p-2 pb-8">
            <Image
              src={asset("/rooms/seyyah/galata.webp")}
              alt=""
              width={370}
              height={370}
              sizes="(min-width: 1024px) 220px, 40vw"
              className="aspect-square w-full object-cover"
            />
            <span className="absolute inset-x-0 bottom-1 text-center font-hand text-lg font-bold text-seyyah-ink">
              Galata, 09:12
            </span>
          </div>
          {/* collected stickers, taped to the page */}
          <div className="absolute -bottom-6 left-2 flex items-end gap-1">
            {["first_checkin", "early_bird", "sunset_chaser"].map((s, i) => (
              <Image
                key={s}
                src={asset(`/rooms/seyyah/${s}.webp`)}
                alt=""
                width={240}
                height={240}
                sizes="72px"
                className={i === 1 ? "size-16 -rotate-6 sm:size-[4.5rem]" : "size-12 rotate-6 sm:size-14"}
              />
            ))}
            <span className="mb-1 ml-1 font-hand text-xl font-bold text-seyyah-ink">← {t.seyyahStickers}</span>
          </div>
        </figure>
      </div>
      <p className="container-site relative mt-10 text-right font-mono text-mono-sm text-seyyah-ink">
        ✓ {t.seyyahVerified} · {t.sampleNote}
      </p>
    </section>
  );
}
