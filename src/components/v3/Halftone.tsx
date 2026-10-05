import Image from "next/image";
import { asset } from "@/lib/static";
import { cn } from "@/components/ui/cn";

/**
 * A screenshot printed like a newspaper photo: grey and dotted until hovered or focused,
 * then the colour image underneath shows through. Both layers share one download.
 */
export function Halftone({
  src,
  alt,
  sizes,
  ratio = "aspect-[16/10]",
  priority,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  ratio?: string;
  priority?: boolean;
  className?: string;
}) {
  const url = asset(src);
  return (
    <div className={cn("halftone bg-news-ink/10", ratio, className)}>
      <Image src={url} alt={alt} fill sizes={sizes} preload={priority} fetchPriority={priority ? "high" : undefined} className="object-cover object-top" />
      <div aria-hidden className="halftone-print">
        <Image src={url} alt="" fill sizes={sizes} className="object-cover object-top" />
      </div>
    </div>
  );
}
