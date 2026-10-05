import Image from "next/image";
import { ViewTransition } from "react";
import { publicFileExists } from "@/lib/content";
import type { Project } from "@/lib/content";
import { asset } from "@/lib/static";
import { cn } from "@/components/ui/cn";

type Props = {
  project: Project;
  variant: "desktop" | "mobile";
  pendingLabel: string;
  offlineLabel?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

const ratio = { desktop: "aspect-[16/10]", mobile: "aspect-[9/16]" };

/** Real screenshot when present; otherwise an honest, labelled empty frame (never an illustration). */
export function ProjectVisual({
  project,
  variant,
  pendingLabel,
  offlineLabel,
  alt,
  sizes,
  priority,
  className,
}: Props) {
  const src = project.images[variant];
  const host = new URL(project.url).host.replace(/^www\./, "");
  // Same name on the home card and the case-study page: the browser morphs one into the other.
  return (
    <ViewTransition name={`shot-${project.slug}-${variant}`} share="morph" default="none">
      <div
        className={cn("relative overflow-hidden bg-ink-900 ring-1 ring-ink-800 ring-inset", ratio[variant], className)}
      >
        {project.status === "live" && publicFileExists(src) ? (
          <Image src={asset(src)} alt={alt} fill sizes={sizes} preload={priority} fetchPriority={priority ? "high" : undefined} className="object-cover object-top" />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between p-4 text-stone-400">
            <span className="font-mono text-mono-sm">{host}</span>
            <span className="font-mono text-mono-sm opacity-70">
              {project.status === "offline" && offlineLabel ? offlineLabel : pendingLabel}
            </span>
          </div>
        )}
      </div>
    </ViewTransition>
  );
}
