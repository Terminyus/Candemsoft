"use client";

import { useInView } from "@/components/fx/useInView";
import { useEffect, useRef, useState } from "react";
import { useMotionOK } from "@/components/v4/fx/useMotionOK";

type Labels = { distance: string; pace: string; time: string; pause: string; play: string; place: string };
type Route = { d: string; start: number[]; metres: number; viewBox: number[] };

const RUN_MS = 11000; // one lap on screen
const HOLD_MS = 2600; // finished lap stays up before the next one
const PACE_S = 348; // sample pace: 5'48" per km
const STEPS = 90; // footprints left along the lap

const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const fmtPace = (s: number) => `${Math.floor(s / 60)}'${String(Math.round(s % 60)).padStart(2, "0")}"`;

/**
 * A real map of Moda, Kadıköy (OpenStreetMap, built by scripts/build-fit-map.py) with a real
 * 4 km loop through its streets. Like a run replay: the line inks itself in behind a moving
 * runner, leaving footprints, while distance and time count up. Pausable; with reduced motion
 * the finished lap is shown. Pace and time are sample values; the distance is the route's own.
 */
export function FitMap({ lang, labels, route, children }: { lang: string; labels: Labels; route: Route; children: React.ReactNode }) {
  const motionOK = useMotionOK();
  const [paused, setPaused] = useState(false);
  const [p, setP] = useState(1); // lap progress 0..1
  const [steps, setSteps] = useState<{ x: number; y: number; a: number; t: number }[]>([]);
  const [runner, setRunner] = useState<{ x: number; y: number } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, 0.3);
  const line = useRef<SVGPathElement>(null);
  const len = useRef(1);
  const clock = useRef(0); // ms into the current cycle

  // Footprints: points along the route, alternating left/right of the line, facing its direction.
  useEffect(() => {
    const el = line.current;
    if (!el) return;
    const L = el.getTotalLength();
    len.current = L;
    const out: { x: number; y: number; a: number; t: number }[] = [];
    for (let i = 0; i < STEPS; i++) {
      const d = ((i + 0.5) / STEPS) * L;
      const a = el.getPointAtLength(d);
      const b = el.getPointAtLength(Math.min(L, d + 1));
      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      const side = i % 2 ? 3.5 : -3.5;
      out.push({ x: a.x - Math.sin(ang) * side, y: a.y + Math.cos(ang) * side, a: (ang * 180) / Math.PI, t: d / L });
    }
    const raf = requestAnimationFrame(() => setSteps(out));
    return () => cancelAnimationFrame(raf);
  }, []);


  const running = motionOK && !paused && inView;
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      clock.current = (clock.current + now - last) % (RUN_MS + HOLD_MS);
      last = now;
      const q = Math.min(1, clock.current / RUN_MS);
      setP(q);
      const el = line.current;
      if (el && q < 1) {
        const pt = el.getPointAtLength(q * len.current);
        setRunner({ x: pt.x, y: pt.y });
      } else setRunner(null);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const km = (route.metres / 1000) * p;
  const nf = new Intl.NumberFormat(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const stats = [
    { k: labels.distance, v: `${nf.format(km)} km` },
    { k: labels.pace, v: fmtPace(PACE_S) },
    { k: labels.time, v: fmtTime(km * PACE_S) },
  ];
  const [w, h] = route.viewBox as [number, number];
  const drawn = motionOK ? p : 1;

  return (
    <div ref={root}>
      <div className="relative overflow-hidden rounded-2xl bg-[#03101a]">
        <svg viewBox={`0 0 ${w} ${h}`} aria-hidden className="block h-auto w-full">
          {/* streets, coast and parks: static, rendered on the server (see FitRoom) */}
          {children}
          {/* the lap: a faint planned line, then the inked trail with a soft glow */}
          {/* measured for the runner and footprints: no pathLength here, so lengths are real units */}
          <path ref={line} d={route.d} fill="none" stroke="#00d8d8" strokeOpacity="0.12" strokeWidth="3" strokeLinejoin="round" />
          <path d={route.d} pathLength={1} fill="none" stroke="#00d8d8" strokeOpacity="0.25" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - drawn} />
          <path d={route.d} pathLength={1} fill="none" stroke="#00d8d8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - drawn} />
          {/* footprints left behind */}
          {steps.map((s, i) =>
            s.t <= drawn ? <ellipse key={i} cx={s.x} cy={s.y} rx="2.3" ry="1.3" transform={`rotate(${s.a} ${s.x} ${s.y})`} fill="#e9ffff" fillOpacity="0.9" /> : null,
          )}
          <circle cx={route.start[0]} cy={route.start[1]} r="6" fill="#000810" stroke="#00d8d8" strokeWidth="3" />
          {runner && (
            <g>
              <circle cx={runner.x} cy={runner.y} r="12" fill="#00d8d8" fillOpacity="0.25" className="fit-pulse" />
              <circle cx={runner.x} cy={runner.y} r="5.5" fill="#fff" stroke="#00d8d8" strokeWidth="3" />
            </g>
          )}
        </svg>
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[0.7rem] text-white/85">{labels.place}</span>
        {motionOK && (
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-label={paused ? labels.play : labels.pause}
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-black/60 text-white hover:bg-black"
          >
            <span aria-hidden>{paused ? "▶" : "❚❚"}</span>
          </button>
        )}
      </div>
      <dl className="mt-2 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.k} className="rounded-2xl bg-white/5 px-3 py-3">
            <dt className="font-mono text-[0.7rem] text-white/70">{s.k}</dt>
            <dd className="mt-1 font-archivo text-xl font-bold tabular-nums sm:text-2xl">{s.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
