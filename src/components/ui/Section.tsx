import type { ReactNode } from "react";
import { cn } from "./cn";

type Props = {
  surface?: "ink" | "paper";
  space?: "none" | "sm" | "md" | "lg";
  id?: string;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
};

const spacing = {
  none: "",
  sm: "py-(--section-sm)",
  md: "py-(--section)",
  lg: "py-(--section-lg)",
};

export function Section({ surface = "paper", space = "md", id, labelledBy, className, children }: Props) {
  return (
    <section id={id} aria-labelledby={labelledBy} data-surface={surface} className={cn(spacing[space], className)}>
      <div className="container-site">{children}</div>
    </section>
  );
}
