import { cn } from "./cn";

/** Visible marker for content the client still has to provide. Strips the "TODO:" prefix. */
export function Todo({ text, label, className }: { text: string; label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-baseline gap-2 border border-dashed border-current/30 px-2 py-1 font-mono text-mono-sm muted",
        className,
      )}
    >
      <span className="text-ember in-data-[surface=ink]:text-signal">{label}</span>
      <span>{text.replace(/^TODO:?\s*/, "")}</span>
    </span>
  );
}
