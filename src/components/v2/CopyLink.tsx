"use client";

import { useState } from "react";

/** Copies the page URL; on phones with a share sheet, opens that instead. */
export function CopyLink({ label, done, title }: { label: string; done: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const onClick = async () => {
    const url = location.href;
    if (navigator.share && matchMedia("(hover: none)").matches) {
      await navigator.share({ title, url }).catch(() => {});
      return;
    }
    await navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink-950 px-5 font-archivo text-sm font-semibold transition-colors hover:bg-ink-950 hover:text-white"
    >
      <span aria-hidden>{copied ? "✓" : "↗"}</span>
      <span aria-live="polite">{copied ? done : label}</span>
    </button>
  );
}
