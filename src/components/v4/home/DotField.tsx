"use client";

import { useEffect, useRef } from "react";
import { useMotionOK } from "../fx/useMotionOK";

/**
 * Background dot grid. Dots near the pointer light up in the brand orange and lean
 * towards it; a slow wave runs through the rest. Paused off-screen; drawn once, still,
 * for reduced motion.
 */
export function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const motion = useMotionOK();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const gap = 26;
    const pointer = { x: -999, y: -999 };
    let w = 0;
    let h = 0;
    let frame = 0;
    let visible = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (let y = gap / 2; y < h; y += gap)
        for (let x = gap / 2; x < w; x += gap) {
          const dx = pointer.x - x;
          const dy = pointer.y - y;
          const d = Math.hypot(dx, dy);
          const near = Math.max(0, 1 - d / 160);
          const wave = motion ? (Math.sin(x * 0.012 + y * 0.018 + t * 0.0012) + 1) / 2 : 0.5;
          const px = x + (d > 0 ? (dx / d) * near * 6 : 0);
          const py = y + (d > 0 ? (dy / d) * near * 6 : 0);
          ctx.fillStyle = near > 0.02 ? `rgba(248,84,4,${0.25 + near * 0.75})` : `rgba(154,160,166,${0.08 + wave * 0.12})`;
          ctx.beginPath();
          ctx.arc(px, py, 1 + near * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
    };
    const loop = (t: number) => {
      if (visible) draw(t);
      frame = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    io.observe(canvas);
    if (motion) {
      window.addEventListener("pointermove", onMove, { passive: true });
      frame = requestAnimationFrame(loop);
    } else draw(0);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [motion]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
