"use client";

import { useEffect, useRef } from "react";
import { useMotionOK } from "./useMotionOK";

/**
 * A small orange dot with a lagging ring that grows over anything clickable.
 * Mouse only (no touch), off with reduced motion; the system cursor stays visible.
 */
export function DevCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const motion = useMotionOK();

  useEffect(() => {
    if (!motion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const d = dot.current!;
    const r = ring.current!;
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let big = false;
    let scale = 1;
    let frame = 0;
    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      big = !!(e.target as Element).closest?.("a,button,input,textarea,select,[role=button]");
      d.style.opacity = r.style.opacity = "1";
    };
    const leave = () => (d.style.opacity = r.style.opacity = "0");
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      d.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      scale += ((big ? 1.8 : 1) - scale) * 0.2;
      r.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${scale})`;
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, [motion]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] print:hidden">
      <div ref={dot} className="absolute -left-1 -top-1 size-2 rounded-full bg-signal opacity-0" />
      <div ref={ring} className="absolute -left-4 -top-4 size-8 rounded-full border border-signal/70 opacity-0" />
    </div>
  );
}
