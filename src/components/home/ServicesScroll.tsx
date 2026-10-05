"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Narration for the services index: the row crossing the middle of the
 * viewport is "active", the others step back, and the sticky counter
 * tracks position. Without JS (or before GSAP loads) every row is fully visible.
 */
export function ServicesScroll({ children, total }: { children: ReactNode; total: number }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let cleanup = () => {};
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const rows = Array.from(el.querySelectorAll<HTMLElement>("[data-service-row]"));
      const counter = el.querySelector<HTMLElement>("[data-service-counter]");
      const bar = el.querySelector<HTMLElement>("[data-service-bar]");
      const setActive = (i: number) => {
        rows.forEach((r, j) => r.toggleAttribute("data-active", i === j));
        if (counter) counter.textContent = `${String(i + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
      };
      el.setAttribute("data-narrated", "");
      setActive(0);
      const triggers = rows.map((row, i) =>
        ScrollTrigger.create({
          trigger: row,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        }),
      );
      // Progress bar is scrubbed with the list: scaleX only, compositor-friendly.
      const progress = bar
        ? gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: { trigger: rows[0]!.parentElement!, start: "top 55%", end: "bottom 55%", scrub: true },
            },
          )
        : null;
      cleanup = () => {
        triggers.forEach((t) => t.kill());
        progress?.scrollTrigger?.kill();
        progress?.kill();
        el.removeAttribute("data-narrated");
      };
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [total]);

  return (
    <div ref={root} className="contents">
      {children}
    </div>
  );
}
