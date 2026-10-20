"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True while at least `ratio` of the element is on screen.
 *
 * IntersectionObserver alone isn't enough: in Safari (iOS), an observer created while the
 * element sits inside a content-visibility:auto section that hasn't rendered yet may never
 * report it as visible. So the same check also runs on scroll and resize (one rect read per
 * frame at most), which works everywhere.
 */
export function useInView(ref: RefObject<Element | null>, ratio = 0.3): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const visible = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
        setInView(r.height > 0 && visible / Math.min(r.height, innerHeight) >= ratio);
      });
    };
    const io = new IntersectionObserver(check, { threshold: [0, ratio, 1] });
    io.observe(el);
    addEventListener("scroll", check, { passive: true });
    addEventListener("resize", check);
    check();
    return () => {
      io.disconnect();
      removeEventListener("scroll", check);
      removeEventListener("resize", check);
      cancelAnimationFrame(raf);
    };
  }, [ref, ratio]);
  return inView;
}
