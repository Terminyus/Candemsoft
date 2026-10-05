"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** Optimal Recognition Point: the letter the eye should land on, by word length. */
function orpIndex(word: string): number {
  const n = word.replace(/[^\p{L}\p{N}]/gu, "").length;
  if (n <= 1) return 0;
  if (n <= 5) return 1;
  if (n <= 9) return 2;
  if (n <= 13) return 3;
  return 4;
}

type Labels = { title: string; play: string; pause: string; speed: string; wpm: string };

/**
 * A working miniature of Orpigo: RSVP reading with the ORP letter pinned under a guide.
 * Nothing moves until the visitor presses play.
 */
export function OrpigoReader({ text, labels }: { text: string; labels: Labels }) {
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [wpm, setWpm] = useState(300);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!playing) return;
    const word = words[i] ?? "";
    // Slightly longer pause on sentence ends and long words, as speed readers do.
    const base = 60000 / wpm;
    const delay = base * (/[.!?;:]$/.test(word) ? 2 : word.length > 9 ? 1.3 : 1);
    timer.current = window.setTimeout(() => {
      if (i + 1 >= words.length) {
        setPlaying(false);
        setI(0);
      } else setI(i + 1);
    }, delay);
    return () => window.clearTimeout(timer.current);
  }, [playing, i, wpm, words]);

  const word = words[i] ?? "";
  const k = orpIndex(word);
  const progress = ((i + 1) / words.length) * 100;

  return (
    <div className="rounded-3xl bg-white p-5 text-orpigo-navy shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] sm:p-8">
      <p className="font-mono text-mono-sm text-orpigo-navy/70">{labels.title}</p>
      <div aria-live="off" className="relative mt-6 rounded-2xl bg-[#f4f5fa] px-2 py-12">
        <span aria-hidden className="absolute left-1/2 top-4 h-4 w-0.5 -translate-x-1/2 bg-orpigo-red" />
        <span aria-hidden className="absolute bottom-4 left-1/2 h-4 w-0.5 -translate-x-1/2 bg-orpigo-red" />
        {/* pre | ORP letter | post: the middle column sits exactly under the guide */}
        <p className="grid grid-cols-[1fr_auto_1fr] font-archivo text-[clamp(1.75rem,1.2rem+2.5vw,3rem)] font-semibold leading-none">
          <span className="text-right">{word.slice(0, k)}</span>
          <span className="text-orpigo-red">{word.charAt(k)}</span>
          <span className="text-left">{word.slice(k + 1)}</span>
        </p>
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-orpigo-navy/10">
        <div className="h-full origin-left bg-orpigo-red transition-transform duration-150" style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-5">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-pressed={playing}
          className="inline-flex min-h-12 min-w-32 items-center justify-center gap-2 rounded-full bg-orpigo-red px-6 font-archivo font-semibold text-white hover:bg-orpigo-navy"
        >
          <span aria-hidden>{playing ? "❚❚" : "▶"}</span> {playing ? labels.pause : labels.play}
        </button>
        <label className="flex flex-1 items-center gap-3 font-mono text-mono-sm">
          <span>{labels.speed}</span>
          <input
            type="range"
            min={150}
            max={600}
            step={25}
            value={wpm}
            onChange={(e) => setWpm(Number(e.target.value))}
            className="w-full accent-orpigo-red"
          />
          <span className="w-24 shrink-0 tabular-nums">
            {wpm} {labels.wpm}
          </span>
        </label>
      </div>
    </div>
  );
}
