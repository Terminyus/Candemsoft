"use client";

import { useSyncExternalStore } from "react";

const q = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(q);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/** True when animations are welcome. False on the server and for reduced-motion users. */
export function useMotionOK(): boolean {
  return useSyncExternalStore(subscribe, () => !window.matchMedia(q).matches, () => false);
}

/** Calls back once when the element first comes into view. */
export function onceVisible(el: Element, cb: () => void, rootMargin = "0px 0px -10% 0px") {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        cb();
      }
    },
    { rootMargin },
  );
  io.observe(el);
  return () => io.disconnect();
}
