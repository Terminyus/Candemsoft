"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/components/ui/cn";
import { useMotionOK } from "../fx/useMotionOK";

type Tok = [string, string?];
const K = "text-dev-key";
const F = "text-dev-fn";
const T = "text-dev-tag";
const A = "text-dev-attr";
const S = "text-dev-str";

export type EditorLabels = {
  file: string;
  preview: string;
  compiling: string;
  compiled: string;
  passing: string;
  replay: string;
  blocks: { studio: string; web: string; mobile: string; ai: string; ship: string };
};

/**
 * A component types itself out; as each line completes, the matching block appears in the
 * preview. The server renders the finished state, so without JS (or with reduced motion)
 * visitors see the compiled result straight away.
 */
export function HeroEditor({ city, labels }: { city: string; labels: EditorLabels }) {
  const lines: Tok[][] = useMemo(
    () => [
      [["export default function ", K], ["Candemsoft", F], ["() {"]],
      [["  "], ["return", K], [" ("]],
      [["    <"], ["Studio", T], [" "], ["city", A], ["="], [`"${city}"`, S], [">"]],
      [["      <"], ["Web", T], [" />"]],
      [["      <"], ["Mobile", T], [" "], ["os", A], ["={["], ['"iOS"', S], [","], ['"Android"', S], ["]} />"]],
      [["      <"], ["AI", T], [" />"]],
      [["      <"], ["Ship", T], [" "], ["to", A], ["="], ['"production"', S], [" />"]],
      [["    </"], ["Studio", T], [">"]],
      [["  );"]],
      [["}"]],
    ],
    [city],
  );
  const lineLen = lines.map((l) => l.reduce((n, [t]) => n + t.length, 0));
  const total = lineLen.reduce((a, b) => a + b, 0) + lines.length;
  const motion = useMotionOK();
  const [typed, setTyped] = useState(total);
  const timer = useRef<number | undefined>(undefined);

  const play = useCallback(() => {
    window.clearInterval(timer.current);
    setTyped(0);
    timer.current = window.setInterval(() => {
      setTyped((n) => {
        if (n >= total) {
          window.clearInterval(timer.current);
          return total;
        }
        return n + 2;
      });
    }, 28);
  }, [total]);

  useEffect(() => {
    if (!motion) return;
    const start = requestAnimationFrame(play);
    return () => {
      cancelAnimationFrame(start);
      window.clearInterval(timer.current);
    };
  }, [motion, play]);

  // Which lines are complete → which preview blocks are on.
  let budget = typed;
  const complete = lineLen.map((len) => {
    const done = budget >= len + 1;
    budget -= len + 1;
    return done;
  });
  const done = typed >= total;
  let left = typed;

  const block = (on: boolean, children: React.ReactNode, cls = "") => (
    <div
      className={cn(
        "rounded-lg border px-3 py-2.5 transition-[opacity,transform] duration-500 ease-(--ease-out)",
        on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        cls,
      )}
    >
      {children}
    </div>
  );

  return (
    <div className="grid overflow-hidden rounded-xl border border-dev-line bg-dev-surface shadow-[0_40px_120px_-40px_rgba(248,84,4,0.35)] md:grid-cols-[1.25fr_1fr]">
      {/* editor */}
      <div className="min-w-0 border-dev-line md:border-r">
        <div className="flex items-center gap-2 border-b border-dev-line px-4 py-2.5 v4-mono text-xs text-dev-muted">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-dev-line" />
            <span className="size-2.5 rounded-full bg-dev-line" />
            <span className="size-2.5 rounded-full bg-dev-line" />
          </span>
          <span className="ml-2 rounded-t border-b-2 border-signal px-2 py-0.5 text-dev-text">{labels.file}</span>
        </div>
        <pre
          aria-label={labels.file}
          className="overflow-x-auto p-4 v4-mono text-[0.78rem] leading-[1.7] sm:text-[0.85rem]"
        >
          <code className="[counter-reset:ln]">
            {lines.map((line, i) => {
              const shown = Math.max(0, Math.min(lineLen[i]!, left));
              left -= lineLen[i]! + 1;
              let rest = shown;
              return (
                <div key={i} className="v4-ln flex">
                  <span>
                    {line.map(([t, c], j) => {
                      const part = t.slice(0, Math.max(0, rest));
                      rest -= t.length;
                      return part ? (
                        <span key={j} className={c}>
                          {part}
                        </span>
                      ) : null;
                    })}
                    {!done && shown > 0 && shown < lineLen[i]! + 1 && left < 0 && (
                      <span
                        aria-hidden
                        className="v4-caret ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-signal"
                      />
                    )}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
        <div className="flex items-center justify-between border-t border-dev-line px-4 py-2 v4-mono text-xs">
          <span className={done ? "text-dev-str" : "text-dev-attr"} role="status">
            {done ? `${labels.compiled} · ${labels.passing}` : labels.compiling}
          </span>
          <button
            type="button"
            onClick={play}
            className="text-dev-muted underline-offset-4 hover:text-signal hover:underline"
          >
            ↻ {labels.replay}
          </button>
        </div>
      </div>

      {/* live preview */}
      <div className="flex min-w-0 flex-col bg-dev-bg/60">
        <div className="flex items-center gap-2 border-b border-dev-line px-4 py-2.5 v4-mono text-xs text-dev-muted">
          <span aria-hidden>◉</span> {labels.preview} · candemsoft.com
        </div>
        <div className="flex flex-1 flex-col gap-2.5 p-4 text-sm">
          {block(
            complete[2]!,
            <span className="flex items-center justify-between v4-mono text-xs text-dev-muted">
              <span>
                &lt;<span className="text-dev-tag">Studio</span>&gt;
              </span>
              <span>{labels.blocks.studio}</span>
            </span>,
            "border-dashed border-dev-line",
          )}
          {block(
            complete[3]!,
            <span className="font-semibold">{labels.blocks.web}</span>,
            "border-dev-key/40 bg-dev-key/10",
          )}
          {block(
            complete[4]!,
            <span className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold">{labels.blocks.mobile}</span>
              <span className="flex gap-1.5 v4-mono text-[0.7rem]">
                <span className="rounded bg-dev-line px-1.5 py-0.5">iOS</span>
                <span className="rounded bg-dev-line px-1.5 py-0.5">Android</span>
              </span>
            </span>,
            "border-dev-fn/40 bg-dev-fn/10",
          )}
          {block(
            complete[5]!,
            <span className="font-semibold">{labels.blocks.ai}</span>,
            "border-dev-attr/40 bg-dev-attr/10",
          )}
          {block(
            complete[6]!,
            <span className="flex items-center justify-between font-semibold">
              <span>▲ production</span>
              <span className="flex items-center gap-2 text-dev-str">
                <span className="v4-pulse size-2 rounded-full bg-dev-str" /> {labels.blocks.ship}
              </span>
            </span>,
            "border-dev-str/40 bg-dev-str/10",
          )}
        </div>
      </div>
    </div>
  );
}
