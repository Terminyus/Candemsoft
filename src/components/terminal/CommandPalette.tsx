"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { TermData, TermLine } from "@/lib/terminal/types";
import { Terminal, type TerminalLabels } from "./Terminal";

export const OPEN_EVENT = "candem:terminal";

function isTypingTarget(el: EventTarget | null) {
  return el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

/** ⌘K / Ctrl+K / "/" from anywhere opens the same terminal as the home hero. */
export function CommandPalette({ data, labels, initial }: { data: TermData; labels: TerminalLabels & { close: string }; initial: TermLine[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const show = () => {
      setSession((s) => s + 1); // fresh terminal each time
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (dialogRef.current?.open) dialogRef.current.close();
        else show();
      } else if (e.key === "/" && !isTypingTarget(e.target) && !dialogRef.current?.open) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, show);
    };
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // showModal() focuses the first focusable element (a help link); the prompt is what we want.
      d.querySelector<HTMLInputElement>("input")?.focus();
    }
    if (!open && d.open) d.close();
  }, [open]);

  // Route change closes the palette (also covers browser back/forward).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={labels.title}
      onClose={() => setOpen(false)}
      onClick={(e) => {
        if (e.target === dialogRef.current) setOpen(false); // backdrop click
      }}
      className="palette m-0 mx-auto mt-[12vh] w-[min(720px,calc(100%-2rem))] max-w-none bg-transparent p-0 text-paper-100 backdrop:bg-ink-950/70"
    >
      {open && (
        <div className="relative">
          <Terminal key={session} data={data} labels={labels} initial={initial} mode="palette" onDone={() => setOpen(false)} />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-2 top-1.5 min-h-8 px-2 font-mono text-mono-sm text-stone-400 hover:text-paper-100 sm:hidden"
          >
            {labels.close}
          </button>
        </div>
      )}
    </dialog>
  );
}
