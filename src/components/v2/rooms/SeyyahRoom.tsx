import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { RoomInfo, type RoomTheme } from "./RoomInfo";

const theme: RoomTheme = {
  kicker: "text-seyyah",
  button: "bg-seyyah text-white hover:bg-ink-950",
  ghost: "border-2 border-seyyah text-seyyah hover:bg-seyyah hover:text-white",
  rule: "border-seyyah/30",
  bullet: "text-seyyah",
  muted: "text-ink-950/80",
};

/** Draws a stroke twice, slightly offset: the doubled line reads as pencil on paper. */
function Ink({ d, w = 2.2, dash }: { d: string; w?: number; dash?: string }) {
  return (
    <>
      <path d={d} fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />
      <path d={d} fill="none" stroke="currentColor" strokeWidth={w * 0.5} strokeLinecap="round" opacity="0.45" strokeDasharray={dash} transform="translate(1.4 -1.1)" />
    </>
  );
}

function Pin({ x, y, label, lx = 18, ly = 6 }: { x: number; y: number; label: string; lx?: number; ly?: number }) {
  const d = `M${x} ${y} c-14 -18 -16 -30 -10 -38 c6 -8 18 -8 22 0 c5 9 2 20 -12 38 z`;
  return (
    <g>
      <path d={d} fill="url(#hatch)" />
      <Ink d={d} />
      <circle cx={x + 1} cy={y - 28} r="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x={x + lx} y={y + ly} className="font-hand" fontSize="26" fill="currentColor">
        {label}
      </text>
    </g>
  );
}

function SeyyahSketch({ t }: { t: Dictionary["v2"] }) {
  return (
    <svg viewBox="0 0 600 520" role="img" aria-label={t.seyyahRoute} className="h-auto w-full text-seyyah">
      <defs>
        <filter id="pencil" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="currentColor" strokeWidth="1.3" opacity="0.55" />
        </pattern>
      </defs>
      <g filter="url(#pencil)">
        {/* route */}
        <Ink d="M92 420 C 150 380, 170 330, 238 318 S 330 300, 360 250 S 430 150, 486 132" w={2.6} dash="2 12" />
        {/* title of the page, top-left, underlined by hand */}
        <text x="24" y="58" className="font-hand" fontSize="34" fill="currentColor" fontWeight="700">
          {t.seyyahRoute}
        </text>
        <Ink d="M24 72 C 90 66, 160 76, 236 68" w={2} />
        <Pin x={92} y={430} label="İstanbul" lx={-30} ly={44} />
        <Pin x={238} y={326} label="Eskişehir" lx={-6} ly={40} />
        <Pin x={486} y={140} label="Kapadokya" lx={-150} ly={-48} />

        {/* note: go there first */}
        <text x="20" y="300" className="font-hand" fontSize="30" fill="currentColor">
          {t.seyyahNote1}
        </text>
        <Ink d="M58 312 C 64 340, 72 360, 84 380" />
        <Ink d="M76 370 l8 12 l6 -12" />

        {/* GPS verifies: check mark at the destination */}
        <circle cx="520" cy="200" r="22" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <Ink d="M509 200 l8 9 l16 -19" w={3} />
        <text x="470" y="250" className="font-hand" fontSize="28" fill="currentColor">
          {t.seyyahNote2}
        </text>

        {/* collectible sticker */}
        <g transform="translate(420 380)">
          <circle r="62" fill="url(#hatch)" opacity="0.5" />
          <Ink d="M0 -62 C 34 -62, 62 -34, 62 0 S 34 62, 0 62 S -62 34, -62 0 S -34 -62, 0 -62" w={2.6} />
          <Ink d="M0 -50 C 28 -50, 50 -28, 50 0 S 28 50, 0 50 S -50 28, -50 0 S -28 -50, 0 -50" w={1.4} />
          <text textAnchor="middle" y="-6" className="font-hand" fontSize="24" fill="currentColor" fontWeight="700">
            Kapadokya
          </text>
          <text textAnchor="middle" y="22" className="font-hand" fontSize="20" fill="currentColor">
            ★ ★ ★
          </text>
        </g>
        <text x="300" y="505" className="font-hand" fontSize="28" fill="currentColor">
          {t.seyyahNote3}
        </text>
        <Ink d="M420 492 C 450 488, 452 470, 446 452" />
        <Ink d="M438 462 l8 -12 l6 13" />
      </g>
    </svg>
  );
}

export function SeyyahRoom({ product, lang, dict, index, level = 3 }: { product: Product; lang: Locale; dict: Dictionary; index: number; level?: 2 | 3 }) {
  return (
    <section
      id={product.slug}
      aria-labelledby={`room-${product.slug}`}
      className="cv-auto relative overflow-hidden bg-seyyah-paper py-(--section) text-ink-950"
      // Notebook paper: faint ruled lines and a margin, drawn in the app's blue.
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent 0 56px, rgba(0,104,200,.28) 56px 57px, transparent 57px), repeating-linear-gradient(180deg, transparent 0 35px, rgba(0,104,200,.11) 35px 36px)",
      }}
    >
      <div className="container-site grid items-center gap-12 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <RoomInfo level={level}
          product={product}
          lang={lang}
          dict={dict}
          theme={theme}
          index={index}
          titleClass="text-seyyah"
          taglineClass="font-hand text-[clamp(2.25rem,1.6rem+2.4vw,3.5rem)] font-bold leading-[1] text-seyyah"
        />
        <figure className="relative">
          <SeyyahSketch t={dict.v2} />
          <figcaption className="mt-2 text-right font-mono text-mono-sm text-seyyah">{dict.v2.sampleNote}</figcaption>
        </figure>
      </div>
    </section>
  );
}
