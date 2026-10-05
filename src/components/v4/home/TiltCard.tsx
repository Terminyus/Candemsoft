"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/components/ui/cn";
import { useMotionOK } from "../fx/useMotionOK";

/** Card that tilts toward the pointer with a moving glare. Transform/opacity only; mouse only. */
export function TiltCard({ children, className, glow }: { children: ReactNode; className?: string; glow: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);
  const motion = useMotionOK();
  const onMove = (e: React.PointerEvent) => {
    if (!motion || e.pointerType !== "mouse") return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateZ(0)`;
    glare.current!.style.transform = `translate(${x * 60}%, ${y * 60}%)`;
    glare.current!.style.opacity = "1";
  };
  const reset = () => {
    ref.current!.style.transform = "";
    glare.current!.style.opacity = "0";
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={cn("relative overflow-hidden rounded-2xl border border-dev-line bg-dev-surface transition-transform duration-300 ease-(--ease-out) will-change-transform", className)}
      style={{ boxShadow: `0 30px 80px -40px ${glow}` }}
    >
      <div
        ref={glare}
        aria-hidden
        className="pointer-events-none absolute -inset-1/2 opacity-0 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at center, ${glow.replace(/[\d.]+\)$/, "0.16)")}, transparent 45%)` }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
