import { initials } from "@/lib/text";
import { cn } from "./cn";

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.codePointAt(0)!) >>> 0;
  return h;
}

/**
 * Photo fallback. Initials set large in the display face; the name's hash
 * picks one of four compositions so a team grid doesn't repeat itself.
 */
export function Monogram({ name, index, className }: { name: string; index: number; className?: string }) {
  const h = hash(name + index);
  const layout = [
    "items-end justify-start",
    "items-start justify-end",
    "items-end justify-end",
    "items-center justify-start",
  ][h % 4];
  const dark = (h >> 3) % 3 !== 0;
  return (
    <div
      role="img"
      aria-label={name}
      className={cn(
        "relative flex aspect-[4/5] overflow-hidden p-4 pb-7",
        dark ? "bg-ink-900 text-paper-100" : "bg-paper-200 text-ink-950",
        layout,
        className,
      )}
    >
      <span aria-hidden className="absolute left-4 top-4 font-mono text-mono-sm opacity-60">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span aria-hidden className="absolute inset-x-4 top-1/2 h-px bg-current opacity-10" />
      <span
        aria-hidden
        className="font-display-tight text-[clamp(4rem,10vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.05em]"
      >
        {initials(name)}
        <span className="text-signal">.</span>
      </span>
    </div>
  );
}
