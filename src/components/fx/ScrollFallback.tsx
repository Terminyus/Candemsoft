"use client";

import { useEffect } from "react";

// Elements that animate with CSS scroll-driven animations (animation-timeline) in globals.css.
const REVEAL = ".v4-rise, .sy-draw, .about-code, .about-flow, .halftone";

/**
 * Scroll-driven CSS animations don't exist in Safari before iOS 26 or in Firefox, so on many
 * phones those elements would just sit in their finished state. There, this adds `sda-fallback`
 * to <html> and marks each element `sda-in` when it scrolls into view; globals.css replays the
 * same motion as ordinary transitions. Supporting browsers and reduced-motion users are untouched.
 */
export function ScrollFallback() {
  useEffect(() => {
    if (CSS.supports("animation-timeline: view()")) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("sda-fallback");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("sda-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    const watch = () => document.querySelectorAll(`:is(${REVEAL}):not(.sda-in)`).forEach((el) => io.observe(el));
    watch();
    // Client-side navigation brings new elements: watch those too.
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });

    // v4 reading-progress bar, normally driven by scroll(root).
    let raf = 0;
    const progress = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = root.scrollHeight - innerHeight;
        const p = max > 0 ? Math.min(1, scrollY / max) : 0;
        document.querySelectorAll<HTMLElement>(".v4-progress").forEach((el) => (el.style.transform = `scaleX(${p})`));
      });
    };
    addEventListener("scroll", progress, { passive: true });
    progress();

    return () => {
      io.disconnect();
      mo.disconnect();
      removeEventListener("scroll", progress);
      cancelAnimationFrame(raf);
      root.classList.remove("sda-fallback");
    };
  }, []);
  return null;
}
