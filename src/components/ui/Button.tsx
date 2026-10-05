import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";

type Variant = "primary" | "outline" | "quiet";

const base =
  "group inline-flex items-center justify-between gap-6 rounded-md font-body text-[0.95rem] font-medium leading-none " +
  "transition-[background-color,color,border-color,transform] duration-(--duration-1) ease-(--ease-out) active:translate-y-px " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "min-h-12 px-5 bg-signal text-ink-950 hover:bg-ink-950 hover:text-paper-100 in-data-[surface=ink]:hover:bg-paper-100 in-data-[surface=ink]:hover:text-ink-950",
  outline:
    "min-h-12 px-5 border border-current/25 hover:border-current hover:bg-current/5",
  quiet: "min-h-11 underline decoration-current/30 underline-offset-[6px] hover:decoration-current",
};

type Common = { variant?: Variant; arrow?: "→" | "↗" | false; children: ReactNode; className?: string };

function Arrow({ arrow }: { arrow: Common["arrow"] }) {
  if (!arrow) return null;
  const move = arrow === "↗" ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : "group-hover:translate-x-1";
  return (
    <span aria-hidden className={cn("inline-block transition-transform duration-(--duration-2) ease-(--ease-out)", move)}>
      {arrow}
    </span>
  );
}

export function ButtonLink({
  variant = "primary",
  arrow = "→",
  children,
  className,
  href,
  ...rest
}: Common & Omit<ComponentProps<typeof Link>, "children" | "className">) {
  const external = typeof href === "string" && /^(https?:|mailto:|tel:)/.test(href);
  const cls = cn(base, variants[variant], className);
  const content = (
    <>
      <span>{children}</span>
      <Arrow arrow={arrow} />
    </>
  );
  if (external) {
    const isWeb = (href as string).startsWith("http");
    return (
      <a href={href as string} className={cls} {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}

export function Button({
  variant = "primary",
  arrow = false,
  children,
  className,
  ...rest
}: Common & Omit<ComponentProps<"button">, "children" | "className">) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      <span>{children}</span>
      <Arrow arrow={arrow} />
    </button>
  );
}
