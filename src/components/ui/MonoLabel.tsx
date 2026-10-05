import type { ReactNode } from "react";
import { cn } from "./cn";

/** Machine-voice label: "01 / web", dates, categories. Never uppercase-transformed (see DESIGN.md). */
export function MonoLabel({
  children,
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "p" | "div" | "dt" | "dd";
}) {
  return <Tag className={cn("font-mono text-mono-sm muted", className)}>{children}</Tag>;
}

export function Index({ n, label, className }: { n: number; label?: string; className?: string }) {
  return (
    <MonoLabel className={className}>
      <span className="text-signal">{String(n).padStart(2, "0")}</span>
      {label ? <> / {label}</> : null}
    </MonoLabel>
  );
}
