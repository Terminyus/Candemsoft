import { asset } from "@/lib/static";
import { cn } from "./cn";

type Props = { surface?: "ink" | "paper"; className?: string; priority?: boolean };

export function Logo({ surface = "ink", className, priority }: Props) {
  const isDark = surface === "ink";
  const base = isDark ? "/brand/logo-on-dark" : "/brand/logo-on-light";

  return (
    <picture>
      <source type="image/avif" srcSet={asset(`${base}.avif`)} />
      <source type="image/webp" srcSet={asset(`${base}.webp`)} />
      <img
        src={asset(`${base}.png`)}
        alt="Candemsoft"
        width={360}
        height={64}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "low"}
        className={cn("h-7 w-auto md:h-8", className)}
      />
    </picture>
  );
}
