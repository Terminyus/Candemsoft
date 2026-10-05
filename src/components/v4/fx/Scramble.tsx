"use client";

import { useEffect, useRef, type ElementType } from "react";
import { cn } from "@/components/ui/cn";
import { onceVisible, useMotionOK } from "./useMotionOK";

const CHARS = "ABCDEFGHİJKLMNOPRSŞTUVYZÇĞÖÜ0123456789<>/{}[]=;_#$%&*";

/**
 * Heading that "decodes" when it first scrolls into view. The real text stays in the
 * layout (invisible during the effect) so nothing moves; the scrambled copy is drawn
 * on top and hidden from assistive tech.
 */
export function Scramble({ text, as: Tag = "h2", className, id }: { text: string; as?: ElementType; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLSpanElement>(null);
  const motion = useMotionOK();

  useEffect(() => {
    const el = ref.current;
    const ov = overlay.current;
    if (!el || !ov || !motion) return;
    let frame = 0;
    const stop = onceVisible(el, () => {
      const start = performance.now();
      const dur = Math.min(1100, 380 + text.length * 22);
      el.dataset.scrambling = "";
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const reveal = Math.floor(p * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const c = text[i]!;
          out += i < reveal || c === " " ? c : CHARS[(Math.random() * CHARS.length) | 0];
        }
        ov.textContent = out;
        if (p < 1) frame = requestAnimationFrame(tick);
        else delete el.dataset.scrambling;
      };
      frame = requestAnimationFrame(tick);
    });
    return () => {
      stop();
      cancelAnimationFrame(frame);
    };
  }, [motion, text]);

  return (
    <Tag ref={ref} id={id} className={cn("group/scr relative", className)}>
      <span className="group-data-scrambling/scr:invisible">{text}</span>
      <span ref={overlay} aria-hidden className="pointer-events-none absolute inset-0 hidden group-data-scrambling/scr:block" />
    </Tag>
  );
}
