import { cn } from "@/components/ui/cn";

/** Typographic cover: a few huge characters on the orange block, with the post's tags. */
export function PostCover({
  text,
  tags,
  className,
  size = "lg",
}: {
  text: string;
  tags: string[];
  className?: string;
  size?: "lg" | "sm";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "@container relative flex flex-col justify-between overflow-hidden rounded-3xl bg-signal p-5 text-ink-950 sm:p-7",
        className,
      )}
    >
      {/* faint ruled grid, like the rest of Vitrin */}
      <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(#0e0d0b_1px,transparent_1px),linear-gradient(90deg,#0e0d0b_1px,transparent_1px)] [background-size:2.5rem_2.5rem]" />
      <ul className="relative flex flex-wrap gap-2">
        {tags.map((t) => (
          <li key={t} className="rounded-full border border-ink-950 px-3 py-1 font-mono text-mono-sm">
            #{t}
          </li>
        ))}
      </ul>
      <p
        className={cn(
          "v2-display relative leading-[0.85]",
          size === "lg" ? "mt-10 text-[clamp(5rem,38cqi,14rem)]" : "mt-6 text-[clamp(3.5rem,30cqi,8rem)]",
        )}
      >
        {text}
      </p>
    </div>
  );
}
