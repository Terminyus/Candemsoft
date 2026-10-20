"use client";

import { useInView } from "@/components/fx/useInView";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/components/ui/cn";
import { useMotionOK } from "@/components/v4/fx/useMotionOK";

// Turkish Q, laid out like the phone keyboard: widths in key units, 12 units per row.
type K = { k: string; u?: number; sp?: boolean; label?: string };
const L = (keys: string) => keys.split(" ").map((k) => ({ k }));
const rows: K[][] = [
  [{ k: "", u: 1, sp: true }, ...L("1 2 3 4 5 6 7 8 9 0"), { k: "", u: 1, sp: true }],
  L("q w e r t y u ı o p ğ ü"),
  [{ k: "", u: 0.5, sp: true }, ...L("a s d f g h j k l ş i"), { k: "", u: 0.5, sp: true }],
  [{ k: "shift", u: 1.5, label: "⇧" }, ...L("z x c v b n m ö ç"), { k: "back", u: 1.5, label: "⌫" }],
];

type Props = {
  before: string;
  actions: [label: string, after: string][];
  labels: {
    before: string;
    after: string;
    actions: string;
    sample: string;
    note: string;
    pause: string;
    play: string;
    chat: string;
    incoming: string;
    space: string;
    send: string;
  };
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
  const [phase, setPhase] = useState<Phase>("result");
  const [typed, setTyped] = useState(before.length);
  const [active, setActive] = useState(1);
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, 0.35);
  const id = useId();
  const auto = motionOK && playing;


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
  const key = (k: K, i: number) =>
    k.sp ? (
      <span key={`sp${i}`} style={{ flex: `${k.u} 1 0` }} />
    ) : (
      <span
        key={k.k}
        style={{ flex: `${k.u ?? 1} 1 0` }}
        className={cn(
          "grid h-10 min-w-0 place-items-center rounded-[0.4rem] text-[0.95rem] shadow-[0_1px_0_rgba(0,0,0,0.6)] transition-[transform,background-color,box-shadow] duration-100",
          k.label && k.k !== " " ? "bg-[#151c31] text-ck-muted" : "bg-[#2a3354] text-ck-text",
          pressed === k.k && "-translate-y-1 scale-110 bg-ck-violet text-white shadow-[0_0_18px_rgba(139,92,246,0.85)]",
        )}
      >
        {k.label ?? k.k}
      </span>
    );
  const result = actions[active]!;
  const showResult = phase === "result";

  return (
    <figure ref={root} className="relative mx-auto w-full max-w-[24rem]">
      {/* phone */}
      <div className="overflow-hidden rounded-[2.75rem] border-[10px] border-[#182039] bg-ck-bg shadow-[0_40px_120px_-40px_rgba(139,92,246,0.6)]">
        <div className="flex items-center gap-3 border-b border-ck-line px-4 pb-3 pt-5">
          <span aria-hidden className="grid size-9 place-items-center rounded-full bg-ck-surface font-semibold">
            {labels.chat[0]}
          </span>
          <span className="font-semibold">{labels.chat}</span>
          <span className="rounded-full border border-ck-purple/60 px-2 py-0.5 font-mono text-[0.6rem] uppercase text-ck-text">{labels.sample}</span>
          {motionOK && (
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? labels.pause : labels.play}
              className="ml-auto grid size-9 place-items-center rounded-full border border-ck-line text-xs text-ck-text hover:border-ck-purple"
            >
              <span aria-hidden>{playing ? "❚❚" : "▶"}</span>
            </button>
          )}
        </div>
        <div className="space-y-3 px-4 pb-3 pt-4">
          <p className="max-w-[85%] rounded-2xl rounded-tl-md bg-ck-surface px-3.5 py-2 text-sm">{labels.incoming}</p>
          {/* composer: the draft being typed, then the AI's rewrite */}
          <div className="flex items-end gap-2">
            <div className={cn("min-h-[6.5rem] flex-1 rounded-2xl border px-3.5 py-2.5 transition-colors", showResult ? "border-ck-purple/70 bg-ck-violet/10" : "border-ck-line bg-ck-surface")}>
              <p className="font-mono text-[0.65rem] uppercase text-ck-muted">
                {showResult ? `✦ ${labels.after} · ${result[0]}` : labels.before}
              </p>
              <p className="mt-1 text-[0.95rem] leading-snug text-ck-muted">
                <span className="sr-only">{labels.before}: </span>
                {showResult ? <span className="sr-only">{before}</span> : null}
                {!showResult && (
                  <>
                    <span aria-hidden>{before.slice(0, typed)}</span>
                    <span className="sr-only">{before}</span>
                    {auto && phase === "typing" && <span aria-hidden className="ml-px inline-block h-[1.1em] w-0.5 translate-y-[0.15em] animate-pulse bg-ck-purple" />}
                    {phase === "ai" && <span aria-hidden className="ml-1 animate-pulse text-ck-purple">✦✦✦</span>}
                  </>
                )}
              </p>
              {/* Announced only when the visitor picks an action, not on every autoplay step. */}
              <p id={`${id}-after`} aria-live={auto ? "off" : "polite"} className={cn("text-[0.95rem] font-semibold leading-snug text-ck-text", !showResult && "sr-only")}>
                <span className="sr-only">{labels.after}: </span>
                {result[1]}
              </p>
            </div>
            <span aria-hidden className="mb-2 text-ck-muted">
              ➤
            </span>
          </div>
        </div>
        {/* AI bar where the suggestion strip would be: the five actions */}
        <div role="group" aria-label={labels.actions} className="flex gap-1.5 overflow-x-auto border-t border-ck-line bg-ck-surface px-2 py-2 [scrollbar-width:none]">
          {actions.map(([label], i) => (
            <button
              key={label}
              type="button"
              aria-pressed={i === active}
              aria-controls={`${id}-after`}
              onClick={() => pick(i)}
              className={cn(
                "min-h-9 shrink-0 rounded-full border px-3 text-[0.8rem] font-semibold transition-colors",
                i === active ? "border-ck-purple bg-ck-violet text-white" : "border-ck-line bg-ck-bg text-ck-text hover:border-ck-purple",
                i === active && auto && phase === "ai" && "animate-pulse",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {/* the keyboard (decorative) */}
        <div aria-hidden className="space-y-2 bg-[#0b1122] px-1.5 pb-6 pt-2.5">
          {rows.map((row, r) => (
            <div key={r} className="flex gap-1.5">
              {row.map(key)}
            </div>
          ))}
          <div className="flex gap-1.5">
            {key({ k: "123", u: 1.5, label: "123" }, 0)}
            {key({ k: "emoji", u: 1, label: "☺" }, 1)}
            <span
              style={{ flex: "1.5 1 0" }}
              className={cn(
                "grid h-10 place-items-center rounded-[0.4rem] bg-gradient-to-br from-ck-purple via-ck-blue to-ck-cyan text-xs font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-transform duration-100",
                pressed === "ai" && "-translate-y-1 scale-110 shadow-[0_0_40px_rgba(34,211,238,0.9)]",
              )}
            >
              AI ✦
            </span>
            {key({ k: " ", u: 4.5, label: labels.space }, 2)}
            {key({ k: ".", u: 1 }, 3)}
            {key({ k: "send", u: 2.5, label: labels.send }, 4)}
          </div>
        </div>
      </div>
      <figcaption className="mt-3 font-mono text-mono-sm text-ck-muted">{labels.note}</figcaption>
    </figure>
  );
}
