"use client";

import { useId, useState } from "react";
import { cn } from "@/components/ui/cn";

const rows = [
  ["q", "w", "e", "r", "t", "y", "u", "ı", "o", "p", "ğ", "ü"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ş", "i"],
  ["z", "x", "c", "v", "b", "n", "m", "ö", "ç"],
];

type Props = {
  before: string;
  actions: [label: string, after: string][];
  labels: { before: string; after: string; actions: string; sample: string; note: string };
};

/** Candemkey's AI panel, redrawn: pick an action, the draft is rewritten (texts are candemkey.com's own examples). */
export function KeyDemo({ before, actions, labels }: Props) {
  const [active, setActive] = useState(1);
  const id = useId();
  return (
    <figure className="relative">
      <div className="overflow-hidden rounded-[2rem] border border-ck-line bg-ck-surface shadow-[0_40px_120px_-40px_rgba(139,92,246,0.55)]">
        <div className="space-y-4 p-5 sm:p-6">
          <div>
            <p className="font-mono text-mono-sm uppercase text-ck-muted">{labels.before}</p>
            <p className="mt-1 text-lg text-ck-muted">{before}</p>
          </div>
          <div role="group" aria-label={labels.actions} className="flex flex-wrap gap-2">
            {actions.map(([label], i) => (
              <button
                key={label}
                type="button"
                aria-pressed={i === active}
                aria-controls={`${id}-after`}
                onClick={() => setActive(i)}
                className={cn(
                  "min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors",
                  i === active
                    ? "border-ck-purple bg-ck-violet text-white"
                    : "border-ck-line bg-ck-bg text-ck-text hover:border-ck-purple",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div>
            <p className="flex items-center gap-2 font-mono text-mono-sm uppercase text-ck-muted">
              {labels.after}
              <span className="rounded-full border border-ck-purple/60 px-2 py-0.5 text-[0.65rem] text-ck-text">
                {labels.sample}
              </span>
            </p>
            <p
              id={`${id}-after`}
              aria-live="polite"
              className="mt-2 min-h-[4.5em] text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-semibold leading-snug text-ck-text"
            >
              {actions[active]![1]}
            </p>
          </div>
        </div>
        {/* Turkish Q keyboard with the AI key, as in the app (decorative) */}
        <div aria-hidden className="space-y-1.5 border-t border-ck-line bg-ck-bg/60 px-2 pb-3 pt-3 sm:px-3">
          {rows.map((row, r) => (
            <div key={r} className="flex justify-center gap-1">
              {row.map((k) => (
                <span
                  key={k}
                  className="grid h-9 min-w-0 flex-1 basis-0 place-items-center rounded-md bg-[#1c2540] text-sm text-ck-text sm:h-10 sm:text-base"
                  style={{ maxWidth: "2.6rem" }}
                >
                  {k}
                </span>
              ))}
            </div>
          ))}
          <div className="flex justify-center gap-1">
            <span className="grid h-9 w-14 place-items-center rounded-md bg-[#1c2540] text-xs text-ck-muted sm:h-10">
              123
            </span>
            <span className="h-9 flex-1 rounded-md bg-[#1c2540] sm:h-10" style={{ maxWidth: "14rem" }} />
            <span className="grid h-9 w-14 place-items-center rounded-md bg-gradient-to-br from-ck-purple via-ck-blue to-ck-cyan text-xs font-bold text-white shadow-[0_0_24px_rgba(139,92,246,0.7)] sm:h-10">
              AI ✦
            </span>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 font-mono text-mono-sm text-ck-muted">{labels.note}</figcaption>
    </figure>
  );
}
