import { ViewTransition } from "react";
import { preload } from "react-dom";
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
  const isDesktop = variant === "desktop";
  const base = `/projects/${project.slug}/${variant}`;
  const smAvif = `${base}-sm.avif`;
  const lgAvif = `${base}.avif`;
  const smWebp = `${base}-sm.webp`;
  const lgWebp = `${base}.webp`;
  const hasAvif = publicFileExists(smAvif) && publicFileExists(lgAvif);
  const hasWebp = publicFileExists(smWebp) && publicFileExists(lgWebp);
  const smWidth = isDesktop ? "768w" : "500w";
  const lgWidth = isDesktop ? "1440w" : "780w";

  if (priority && hasAvif) {
    preload(asset(smAvif), {
      as: "image",
      type: "image/avif",
      imageSrcSet: `${asset(smAvif)} ${smWidth}, ${asset(lgAvif)} ${lgWidth}`,
      imageSizes: sizes,
      fetchPriority: "high",
    });
  } else if (priority && hasWebp) {
    preload(asset(smWebp), {
      as: "image",
      type: "image/webp",
      imageSrcSet: `${asset(smWebp)} ${smWidth}, ${asset(lgWebp)} ${lgWidth}`,
      imageSizes: sizes,
      fetchPriority: "high",
    });
  } else if (priority) {
    preload(asset(src), { as: "image", fetchPriority: "high" });
  }

  // Same name on the home card and the case-study page: the browser morphs one into the other.
  return (
    <ViewTransition name={`shot-${project.slug}-${variant}`} share="morph" default="none">
      <div
        className={cn("relative overflow-hidden bg-ink-900 ring-1 ring-ink-800 ring-inset", ratio[variant], className)}
      >
        {project.status === "live" && publicFileExists(src) ? (
          <picture className="absolute inset-0 size-full">
            {hasAvif && (
              <source
                type="image/avif"
                srcSet={`${asset(smAvif)} ${smWidth}, ${asset(lgAvif)} ${lgWidth}`}
                sizes={sizes}
              />
            )}
            {hasWebp && (
              <source
                type="image/webp"
                srcSet={`${asset(smWebp)} ${smWidth}, ${asset(lgWebp)} ${lgWidth}`}
                sizes={sizes}
              />
            )}
            <img
              src={asset(src)}
              alt={alt}
              sizes={sizes}
              fetchPriority={priority ? "high" : "low"}
              loading={priority ? "eager" : "lazy"}
              decoding={priority ? "sync" : "async"}
              className="size-full object-cover object-top"
            />
          </picture>
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
