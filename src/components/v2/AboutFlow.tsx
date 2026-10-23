/**
 * The project flow as a CI pipeline: each stage checks off in turn as the section scrolls by
 * (CSS scroll-driven; without support or with reduced motion every stage is simply checked).
 */
export function AboutFlow({ stages }: { stages: string[][] }) {
  return (
    <ol className="about-flow relative grid gap-6 md:grid-cols-5 md:gap-4">
      {/* the track and its filling, behind the dots (desktop) */}
      <span aria-hidden className="absolute left-[10%] right-[10%] top-[1.375rem] hidden h-1 bg-ink-950/10 md:block" />
      <span aria-hidden className="about-flow-fill absolute left-[10%] right-[10%] top-[1.375rem] hidden h-1 origin-left bg-signal md:block" />
      {stages.map(([name, body], i) => (
        <li key={name} className="relative flex gap-4 md:flex-col md:items-center md:text-center" style={{ "--i": i } as React.CSSProperties}>
          <span aria-hidden className="about-flow-dot relative z-10 grid size-12 shrink-0 place-items-center rounded-full border-2 border-ink-950 bg-white font-mono text-sm font-bold">
            <span className="about-flow-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="about-flow-ok absolute inset-0 grid place-items-center rounded-full bg-signal text-ink-950">✓</span>
          </span>
          <div>
            <p className="font-mono text-mono-sm text-ember">{name}</p>
            <p className="mt-1 text-stone-600">{body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
