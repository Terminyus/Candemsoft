"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionary";

/** Tap a situation, see the notification the car owner would get. Works as plain text without JS (first one is shown). */
export function QrAlert({ t }: { t: Dictionary["v2"] }) {
  const [i, setI] = useState(0);
  const items = t.qrAlertSituations;
  return (
    <div className="rounded-3xl border-2 border-qr-yellow/70 bg-[#0d0d0d] p-5 shadow-[0_0_60px_-20px_rgba(248,208,8,0.55)] sm:p-6">
      <p className="font-mono text-[0.7rem] text-qr-yellow">{t.qrAlertTitle}</p>
      <div role="group" aria-label={t.qrAlertHint} className="mt-4 flex flex-wrap gap-2">
        {items.map(([label], k) => (
          <button
            key={label}
            type="button"
            aria-pressed={k === i}
            onClick={() => setI(k)}
            className={`min-h-10 rounded-full border px-4 font-archivo text-sm font-semibold transition-colors ${
              k === i ? "border-qr-yellow bg-qr-yellow text-black" : "border-white/25 text-white hover:border-qr-yellow"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="mt-2 font-mono text-[0.7rem] text-white/60">{t.qrAlertHint}</p>
      <div aria-live="polite" className="mt-5 flex items-start gap-3 rounded-2xl bg-white/10 p-4">
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-xl bg-qr-yellow font-archivo text-sm font-bold text-black">
          QR
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex justify-between gap-3 text-xs text-white/70">
            <span>{t.qrAlertApp}</span>
            <span>{t.qrAlertNow}</span>
          </p>
          <p className="mt-0.5 font-archivo font-semibold text-white">{items[i][1]}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-white/75">{t.qrAlertNote}</p>
    </div>
  );
}
