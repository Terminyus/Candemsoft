import Image from "next/image";
import { publicFileExists } from "@/lib/content";
import type { Project } from "@/lib/content";
import { cn } from "@/components/ui/cn";

type Props = {
  project: Project;
  variant: "desktop" | "mobile";
  pendingLabel: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

const ratio = { desktop: "aspect-[16/10]", mobile: "aspect-[9/16]" };

/** Real screenshot when present; otherwise an honest, labelled empty frame (never an illustration). */
export function ProjectVisual({ project, variant, pendingLabel, alt, sizes, priority, className }: Props) {
  const src = project.images[variant];
  const host = new URL(project.url).host.replace(/^www\./, "");
  return (
    <div className={cn("relative overflow-hidden bg-ink-900 ring-1 ring-ink-800 ring-inset", ratio[variant], className)}>
      {publicFileExists(src) ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between p-4 text-stone-400">
          <span className="font-mono text-mono-sm">{host}</span>
          <span className="font-mono text-mono-sm opacity-70">{pendingLabel}</span>
        </div>
      )}
    </div>
  );
}
