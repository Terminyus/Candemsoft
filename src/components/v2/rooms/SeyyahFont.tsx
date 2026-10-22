"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/static";

const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const LATIN_EXT =
  "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";

function injectCaveatFont() {
  if (document.getElementById("caveat-font-face")) return;
  const style = document.createElement("style");
  style.id = "caveat-font-face";
  style.textContent = `@font-face{font-family:"Caveat V2";src:url("${asset("/fonts/caveat-v2-latin.v1.woff2")}") format("woff2");font-weight:700;font-display:swap;unicode-range:${LATIN}}@font-face{font-family:"Caveat V2";src:url("${asset("/fonts/caveat-v2-latin-ext.v1.woff2")}") format("woff2");font-weight:700;font-display:swap;unicode-range:${LATIN_EXT}}`;
  document.head.appendChild(style);
}

export function SeyyahFont() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (document.getElementById("caveat-font-face")) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      injectCaveatFont();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          injectCaveatFont();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="sr-only" aria-hidden="true" />;
}
