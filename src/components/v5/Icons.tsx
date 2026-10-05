import type { SVGProps } from "react";

/** Line icons for the five services, drawn for this site (24px grid, 1.5 stroke). */
const base = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function ServiceIcon({ slug, ...rest }: { slug: string } & SVGProps<SVGSVGElement>) {
  const paths: Record<string, React.ReactNode> = {
    web: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 8h18M6.5 6h.01M9 6h.01M8 13l-2 2 2 2M16 13l2 2-2 2M13 12l-2 6" />
      </>
    ),
    mobil: (
      <>
        <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
        <path d="M11 18.5h2M10 5h4" />
      </>
    ),
    "yapay-zeka": (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      </>
    ),
    "ui-ux": (
      <>
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="5" rx="1.5" />
        <rect x="13" y="10" width="8" height="11" rx="1.5" />
        <path d="M3 15h8M3 18.5h5" />
      </>
    ),
    danismanlik: (
      <>
        <path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
        <path d="M19 9h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v2.5L16 18h-3" />
      </>
    ),
  };
  return (
    <svg {...base} aria-hidden {...rest}>
      {paths[slug] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}
