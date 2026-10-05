"use client";

import { useSyncExternalStore } from "react";
import { OPEN_EVENT } from "./CommandPalette";

const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

export function TerminalTrigger({ label }: { label: string }) {
  const mac = useSyncExternalStore(
    () => () => {},
    isMac,
    () => true,
  );
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      aria-label={label}
      aria-keyshortcuts="Meta+K Control+K /"
      className="group flex min-h-11 items-center gap-2 font-mono text-mono-sm text-stone-400 transition-colors hover:text-paper-100"
    >
      <span aria-hidden className="text-signal">
        &gt;_
      </span>
      <kbd aria-hidden className="hidden rounded-sm border border-ink-800 px-1.5 py-0.5 font-mono group-hover:border-ink-600 md:inline">
        {mac ? "⌘K" : "Ctrl K"}
      </kbd>
    </button>
  );
}
