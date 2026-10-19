"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/components/ui/cn";
import { useMotionOK } from "@/components/v4/fx/useMotionOK";

const rows = [
  ["q", "w", "e", "r", "t", "y", "u", "ı", "o", "p", "ğ", "ü"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ş", "i"],
  ["z", "x", "c", "v", "b", "n", "m", "ö", "ç"],
];

type Props = {
  before: string;
  actions: [label: string, after: string][];
  labels: { before: string; after: string; actions: string; sample: string; note: string; pause: string; play: string };
};

type Phase = "typing" | "ai" | "result";

/**
 * Candemkey's AI panel, redrawn. On its own it types the draft key by key, presses the AI key
 * and shows one rewrite after another (texts are candemkey.com's own examples). Picking an
 * action, or the pause button, stops the loop; it never runs off screen or with reduced motion.
 */
export function KeyDemo({ before, actions, labels }: Props) {
  const motionOK = useMotionOK();
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [phase, setPhase] = useState<Phase>("result");
  const [typed, setTyped] = useState(before.length);
  const [active, setActive] = useState(1);
  const root = useRef<HTMLElement>(null);
  const id = useId();
  const auto = motionOK && playing;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e!.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !inView) return;
    let t: number;
    if (phase === "typing") {
      t =
        typed < before.length
          ? window.setTimeout(() => setTyped((n) => n + 1), 70 + ((typed * 37) % 60)) // uneven, like a thumb
          : window.setTimeout(() => setPhase("ai"), 450);
    } else if (phase === "ai") {
      t = window.setTimeout(() => setPhase("result"), 650);
    } else {
      t = window.setTimeout(() => {
        setActive((a) => (a + 1) % actions.length);
        setTyped(0);
        setPhase("typing");
      }, 2800);
    }
    return () => window.clearTimeout(t);
  }, [auto, inView, phase, typed, before.length, actions.length]);

  const pick = (i: number) => {
    setPlaying(false);
    setActive(i);
    setTyped(before.length);
    setPhase("result");
  };
  const toggle = () => {
    if (playing) {
      pick(active);
    } else {
      setPlaying(true);
      setTyped(0);
      setPhase("typing");
    }
  };

  // The key under the thumb right now.
  const pressed = auto && phase === "typing" && typed > 0 ? before[typed - 1]!.toLocaleLowerCase("tr") : auto && phase === "ai" ? "ai" : null;
  const keyClass = (k: string) =>
    cn(
      "grid place-items-center rounded-md transition-[transform,background-color,box-shadow] duration-100",
      pressed === k ? "translate-y-px scale-90 bg-ck-violet text-white shadow-[0_0_18px_rgba(139,92,246,0.8)]" : "bg-[#1c2540] text-ck-text",
    );

  return (
    <figure ref={root} className="relative">
      <div className="overflow-hidden rounded-[2rem] border border-ck-line bg-ck-surface shadow-[0_40px_120px_-40px_rgba(139,92,246,0.55)]">
        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-mono-sm uppercase text-ck-muted">{labels.before}</p>
              <p className="mt-1 min-h-[2lh] text-lg text-ck-muted sm:min-h-0">
                {before.slice(0, typed)}
                {auto && phase === "typing" && <span aria-hidden className="ml-px inline-block h-[1.1em] w-0.5 translate-y-[0.15em] animate-pulse bg-ck-purple" />}
                {/* full sentence for assistive tech, whatever the animation is showing */}
                <span className="sr-only">{typed < before.length ? before.slice(typed) : ""}</span>
              </p>
            </div>
            {motionOK && (
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? labels.pause : labels.play}
                className="grid size-10 shrink-0 place-items-center rounded-full border border-ck-line text-ck-text hover:border-ck-purple"
              >
                <span aria-hidden>{playing ? "❚❚" : "▶"}</span>
              </button>
            )}
          </div>
          <div role="group" aria-label={labels.actions} className="flex flex-wrap gap-2">
            {actions.map(([label], i) => (
              <button
                key={label}
                type="button"
                aria-pressed={i === active}
                aria-controls={`${id}-after`}
                onClick={() => pick(i)}
                className={cn(
                  "min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors",
                  i === active ? "border-ck-purple bg-ck-violet text-white" : "border-ck-line bg-ck-bg text-ck-text hover:border-ck-purple",
                  i === active && auto && phase === "ai" && "animate-pulse",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div>
            <p className="flex items-center gap-2 font-mono text-mono-sm uppercase text-ck-muted">
              {labels.after}
              <span className="rounded-full border border-ck-purple/60 px-2 py-0.5 text-[0.65rem] text-ck-text">{labels.sample}</span>
            </p>
            {/* Announced only when the visitor picks an action, not on every autoplay step. */}
            <p
              id={`${id}-after`}
              aria-live={auto ? "off" : "polite"}
              className={cn(
                "mt-2 min-h-[4.5em] text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-semibold leading-snug text-ck-text transition-opacity duration-300",
                phase !== "result" && "opacity-25",
              )}
            >
              {phase === "ai" ? "✦ ✦ ✦" : actions[active]![1]}
            </p>
          </div>
        </div>
        {/* Turkish Q keyboard with the AI key, as in the app (decorative) */}
        <div aria-hidden className="space-y-1.5 border-t border-ck-line bg-ck-bg/60 px-2 pb-3 pt-3 sm:px-3">
          {rows.map((row, r) => (
            <div key={r} className="flex justify-center gap-1">
              {row.map((k) => (
                <span key={k} className={cn(keyClass(k), "h-9 min-w-0 flex-1 basis-0 text-sm sm:h-10 sm:text-base")} style={{ maxWidth: "2.6rem" }}>
                  {k}
                </span>
              ))}
            </div>
          ))}
          <div className="flex justify-center gap-1">
            <span className="grid h-9 w-14 place-items-center rounded-md bg-[#1c2540] text-xs text-ck-muted sm:h-10">123</span>
            <span className={cn(keyClass(" "), "h-9 flex-1 sm:h-10")} style={{ maxWidth: "14rem" }} />
            <span
              className={cn(
                "grid h-9 w-14 place-items-center rounded-md bg-gradient-to-br from-ck-purple via-ck-blue to-ck-cyan text-xs font-bold text-white shadow-[0_0_24px_rgba(139,92,246,0.7)] transition-transform duration-100 sm:h-10",
                pressed === "ai" && "scale-90 shadow-[0_0_40px_rgba(34,211,238,0.9)]",
              )}
            >
              AI ✦
            </span>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 font-mono text-mono-sm text-ck-muted">{labels.note}</figcaption>
    </figure>
  );
}
