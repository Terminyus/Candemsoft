"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const KEY = "cs-notice-v1";

function read(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/**
 * KVKK notice. The site sets no cookies, so this informs rather than asks.
 * Hidden on the server (no flash for returning visitors); appears after hydration.
 */
export function CookieNotice({ text, ok, more, moreHref }: { text: string; ok: string; more: string; moreHref: string }) {
  const dismissed = useSyncExternalStore(subscribe, read, () => true);
  if (dismissed) return null;
  const close = () => {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* storage blocked: notice simply reappears next visit */
    }
    listeners.forEach((l) => l());
  };
  return (
    <div
      role="region"
      aria-label={more}
      data-surface="ink"
      className="fixed inset-x-4 bottom-4 z-40 max-w-md border border-ink-800 p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] sm:left-4 sm:right-auto"
    >
      <p className="text-sm text-stone-400">{text}</p>
      <div className="mt-3 flex items-center gap-4">
        <button type="button" onClick={close} className="min-h-10 rounded-md bg-paper-100 px-4 text-sm font-medium text-ink-950 hover:bg-signal">
          {ok}
        </button>
        <Link href={moreHref} className="text-sm text-stone-400 underline underline-offset-4 hover:text-paper-100">
          {more}
        </Link>
      </div>
    </div>
  );
}
