import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";

const control =
  "w-full rounded-md border bg-paper-50 px-4 py-3 text-ink-950 placeholder:text-stone-600/70 " +
  "border-paper-200 transition-colors duration-(--duration-1) hover:border-stone-600/50 " +
  "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:border-transparent " +
  "aria-invalid:border-ember";

type FieldProps = { id: string; label: string; hint?: string; error?: string; required?: boolean; children: ReactNode };

export function Field({ id, label, hint, error, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-baseline justify-between gap-4 font-medium">
        <span>
          {label}
          {required && (
            <span aria-hidden className="text-ember">
              {" "}
              *
            </span>
          )}
        </span>
        {hint && <span className="font-mono text-mono-sm muted">{hint}</span>}
      </label>
      {children}
      <p id={`${id}-error`} aria-live="polite" className={cn("text-sm text-ember", !error && "sr-only")}>
        {error}
      </p>
    </div>
  );
}

export function Input({ className, ...rest }: ComponentProps<"input">) {
  return <input className={cn(control, "min-h-12", className)} {...rest} />;
}

export function Textarea({ className, ...rest }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-40 resize-y", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: ComponentProps<"select">) {
  return (
    <select className={cn(control, "min-h-12", className)} {...rest}>
      {children}
    </select>
  );
}
