"use client";

import { useEffect, useRef } from "react";
import { onceVisible, useMotionOK } from "./useMotionOK";

/** "50+" counts up from 0 the first time it scrolls into view. The server renders the final value. */
export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motion = useMotionOK();
  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^(\d+)(.*)$/);
    if (!el || !m || !motion) return;
    // Already on screen at load: leave the real number alone rather than flash to 0.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const target = Number(m[1]);
    const suffix = m[2] ?? "";
    el.textContent = `0${suffix}`;
    let frame = 0;
    const stop = onceVisible(el, () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 1100);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    return () => {
      stop();
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [motion, value]);
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
