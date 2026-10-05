export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="fixed left-4 top-3 z-[100] print:hidden -translate-y-24 rounded-md bg-signal px-4 py-3 font-medium text-ink-950 transition-transform focus-visible:translate-y-0"
    >
      {label}
    </a>
  );
}
