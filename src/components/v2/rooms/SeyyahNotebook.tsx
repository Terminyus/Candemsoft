"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/components/ui/cn";

type Labels = {
  title: string;
  pins: string[];
  checkin: string;
  locating: string;
  done: string;
  reset: string;
  progress: string;
  tryIt: string;
};

// Stop pins sit on the route; the route is split at each stop so it can be walked leg by leg.
const stops = [
  { x: 40, y: 262 },
  { x: 172, y: 196 },
  { x: 394, y: 120 },
];
const legs = ["M58 300C120 296 140 250 190 236", "M190 236C240 222 262 236 300 210S360 168 412 160"];
const pin = "M18 40s14-13 14-24a14 14 0 0 0-28 0c0 11 14 24 14 24Z";

/**
 * The app's check-in, in miniature: "I'm here" verifies the next stop (a fake GPS pause),
 * walks the next leg of the route and earns a sticker. Three stops complete the route.
 */
export function SeyyahNotebook({ labels, stickers }: { labels: Labels; stickers: string[] }) {
  const [done, setDone] = useState(1);
  const [busy, setBusy] = useState(false);
  const complete = done === stops.length;

  const checkIn = () => {
    if (busy) return;
    if (complete) {
      setDone(1);
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      setDone((d) => Math.min(d + 1, stops.length));
      setBusy(false);
    }, 900);
  };

  const [p1, p2, p3] = labels.pins;
  return (
    <div>
      <svg viewBox="0 0 480 360" aria-hidden className="block h-auto w-full overflow-visible">
        <defs>
          <filter id="sy-wobble" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <pattern id="sy-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#1f4fbf" strokeWidth="1.3" strokeOpacity=".55" />
          </pattern>
          {/* each dashed leg is revealed by a solid stroke drawing underneath it */}
          {legs.map((d, i) => (
            <mask key={d} id={`sy-leg-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="360">
              <path
                d={d}
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeWidth="14"
                strokeLinecap="round"
                className={cn("sy-leg", done > i + 1 && "sy-leg-on")}
              />
            </mask>
          ))}
        </defs>
        <text x="18" y="62" fontSize="46" className="sy-write fill-seyyah-ink font-hand font-bold">
          {labels.title}
        </text>
        <g filter="url(#sy-wobble)">
          <path data-draw pathLength={1} className="sy-ink" strokeWidth="2.6" d="M20 80c70-6 160-9 250-4s130 2 190-3" />
          {/* the whole route, faintly pencilled in; the walked legs are inked over it */}
          {legs.map((d, i) => (
            <g key={d}>
              <path className="sy-ink opacity-25" strokeWidth="2" strokeDasharray="2 9" d={d} />
              <path mask={`url(#sy-leg-${i})`} className="sy-ink" strokeWidth="3.4" strokeDasharray="2 9" d={d} />
            </g>
          ))}
          {stops.map((s, i) => {
            const checked = i < done;
            const next = i === done && !complete;
            return (
              <g key={i} transform={`translate(${s.x} ${s.y})`}>
                {next && (
                  <circle
                    cx="18"
                    cy="40"
                    r="16"
                    className={cn("sy-ping fill-none stroke-seyyah-ink", busy && "sy-ping-fast")}
                    strokeWidth="2"
                  />
                )}
                <path className="sy-ink" fill={checked ? "url(#sy-hatch)" : "#fff"} d={pin} />
                <circle cx="18" cy="16" r="5" className="fill-seyyah-ink" />
                {checked && <path className="sy-ink sy-pop" strokeWidth="3" d="M28 -6l5 5 9-10" />}
              </g>
            );
          })}
          {/* the reward: a hand-drawn stamp once all three stops are verified */}
          {/* position on the outer group: the inner one's CSS transform would override it */}
          <g transform="translate(62 112) rotate(-10)">
            <g className={cn("sy-stamp", complete && "sy-stamp-on")}>
              <circle className="sy-ink" strokeWidth="2.4" cx="44" cy="44" r="40" />
              <circle className="sy-ink" strokeWidth="1.4" cx="44" cy="44" r="33" />
              <path className="sy-ink" strokeWidth="4" d="M27 45l11 11 23-25" />
              <text
                x="44"
                y="78"
                textAnchor="middle"
                fontSize="9"
                letterSpacing="2"
                className="fill-seyyah-ink font-mono"
              >
                GPS ✓
              </text>
            </g>
          </g>
          <circle
            cx="106"
            cy="156"
            r="40"
            strokeDasharray="3 7"
            className={cn("sy-ink opacity-30 transition-opacity", complete && "opacity-0")}
            strokeWidth="1.6"
            transform="rotate(-10 106 156)"
          />
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

      <div className="relative z-10 mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 pr-[44%]">
        <button
          type="button"
          onClick={checkIn}
          aria-busy={busy}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-seyyah-ink px-5 font-archivo font-semibold text-white shadow-[3px_4px_0_0_var(--color-seyyah-deep)] transition-transform hover:bg-seyyah-deep active:translate-x-[2px] active:translate-y-[3px] active:shadow-none"
        >
          <svg aria-hidden viewBox="0 0 24 24" className={cn("size-5", busy && "animate-pulse")}>
            <path
              d="M12 22s7-6.6 7-12.2A7 7 0 0 0 5 9.8C5 15.4 12 22 12 22Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="9.6" r="2.6" fill="currentColor" />
          </svg>
          {complete ? labels.reset : labels.checkin}
        </button>
        <p aria-live="polite" className="font-hand text-xl font-bold leading-tight text-seyyah-ink">
          {busy ? labels.locating : complete ? `${labels.done} ★★★` : labels.progress.replace("{n}", String(done))}
        </p>
        <p className="w-full font-mono text-mono-sm text-seyyah-ink/80">{labels.tryIt}</p>
        {/* stickers earned so far */}
        <div aria-hidden className="flex items-end gap-1">
          {stickers.map((s, i) => (
            <Image
              key={s}
              src={s}
              alt=""
              width={240}
              height={240}
              sizes="64px"
              className={cn(
                "sy-sticker size-12 sm:size-14",
                i % 2 ? "-rotate-6" : "rotate-6",
                i < done ? "sy-sticker-on" : "",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
