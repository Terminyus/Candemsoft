import type { ReactNode } from "react";
import { cn } from "./cn";

export function Tag({ children, tone = "default", className }: { children: ReactNode; tone?: "default" | "signal"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-mono-sm leading-none",
        tone === "signal" ? "border-signal/60 text-current" : "border-current/20 muted",
        className,
      )}
    >
      {tone === "signal" && <span aria-hidden className="size-1.5 rounded-full bg-signal" />}
      {children}
    </span>
  );
}
