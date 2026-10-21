"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionary";

/** Pick an AI action and see a sample rewrite. Plain text without JS (first action is shown). */
export function KeyDemo({ t }: { t: Dictionary["v2"] }) {
  const [i, setI] = useState(1);
  const actions = t.keyActions;
  return (
    <div className="rounded-[2rem] bg-ink-950 p-5 text-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] sm:p-6">
      <p className="font-mono text-[0.7rem] text-signal">{t.keyDemoLabel}</p>
      <p className="mt-4 w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-white/10 px-4 py-2 text-sm">{t.keyChat}</p>
      <p className="mt-3 rounded-2xl border border-white/20 px-4 py-3 text-[0.95rem] text-white/90">{t.keyRaw}</p>
      <div role="group" aria-label={t.keyDemoLabel} className="mt-4 flex flex-wrap gap-2">
        <span aria-hidden className="grid h-10 place-items-center rounded-full bg-white px-3 font-archivo text-sm font-bold text-ink-950">
          AI ✦
        </span>
        {actions.map(([label], k) => (
          <button
            key={label}
            type="button"
            aria-pressed={k === i}
            onClick={() => setI(k)}
            className={`min-h-10 rounded-full border px-4 font-archivo text-sm font-semibold transition-colors ${
              k === i ? "border-signal bg-signal text-ink-950" : "border-white/30 text-white hover:border-signal"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div aria-live="polite" className="mt-4 rounded-2xl bg-white/10 p-4">
        <p className="font-mono text-[0.7rem] text-signal">{t.keyResult}</p>
        <p className="mt-1 font-archivo font-semibold">{actions[i][1]}</p>
        <div aria-hidden className="mt-4 flex gap-2 text-xs">
          <span className="rounded-full bg-signal px-3 py-1.5 font-bold text-ink-950">{t.keyApply}</span>
          <span className="rounded-full border border-white/30 px-3 py-1.5">{t.keyCopy}</span>
          <span className="rounded-full border border-white/30 px-3 py-1.5">{t.keyRetry}</span>
        </div>
      </div>
      <p className="mt-3 font-mono text-[0.7rem] text-white/60">{t.keySample}</p>
    </div>
  );
}
