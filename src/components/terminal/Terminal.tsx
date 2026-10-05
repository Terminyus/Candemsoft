"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { switchLocalePath } from "@/i18n/routes";
import { complete, run } from "@/lib/terminal/engine";
import type { TermData, TermLine, TermLink } from "@/lib/terminal/types";
import { cn } from "@/components/ui/cn";

export type TerminalLabels = { title: string; hint: string; prompt: string; inputLabel: string; hintKeys: string };

type Props = {
  data: TermData;
  labels: TerminalLabels;
  initial: TermLine[];
  mode: "inline" | "palette";
  onDone?: () => void;
  className?: string;
};

type Entry = { id: number; line: TermLine };

function Prompt({ user }: { user: string }) {
  return (
    <>
      <span className="text-mint">{user}</span>
      <span className="text-stone-400">:~$ </span>
    </>
  );
}

export function Terminal({ data, labels, initial, mode, onDone, className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const inputId = useId();
  const nextId = useRef(initial.length);
  const [entries, setEntries] = useState<Entry[]>(() => initial.map((line, id) => ({ id, line })));
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [typing, setTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const suggestions = typing ? [] : complete(data, value);
  const termData: TermData = { ...data, otherLangHref: switchLocalePath(pathname, data.lang, data.lang === "tr" ? "en" : "tr") };

  // Keep the newest output in view inside the terminal only; never scroll the page.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  function push(lines: TermLine[]) {
    setEntries((prev) => [...prev, ...lines.map((line) => ({ id: nextId.current++, line }))]);
  }

  function execute(command: string) {
    const result = run(termData, command, pathname);
    setValue("");
    setCursor(null);
    if (command.trim()) setHistory((h) => [...h.filter((c) => c !== command), command]);
    if (result.action?.type === "clear") {
      setEntries([]);
      return;
    }
    push([{ kind: "input", text: command }, ...result.lines]);
    const action = result.action;
    if (!action) return;
    // A short beat so the "→ target" feedback is seen before the page changes.
    const delay = reduce ? 0 : 280;
    window.setTimeout(() => {
      if (action.type === "navigate") {
        router.push(action.href);
        onDone?.();
      } else if (action.type === "external") {
        window.open(action.href, "_blank", "noopener,noreferrer");
      } else if (action.type === "location") {
        window.location.href = action.href;
      }
    }, delay);
  }

  /** Clicking a command types it, so visitors learn the clicks and the keyboard are the same thing. */
  function typeAndRun(command: string) {
    if (reduce) return execute(command);
    setTyping(true);
    let i = 0;
    const step = Math.max(14, Math.min(32, 260 / command.length));
    const timer = window.setInterval(() => {
      i++;
      setValue(command.slice(0, i));
      if (i >= command.length) {
        window.clearInterval(timer);
        setTyping(false);
        execute(command);
      }
    }, step);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      execute(value);
    } else if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      setValue(suggestions[0]! + " ");
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]!);
    } else if (e.key === "ArrowDown" && cursor !== null) {
      e.preventDefault();
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(null);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next]!);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  }

  function renderLink(item: TermLink) {
    const label = <span className="text-cobalt underline-offset-4 group-hover/l:underline">{item.label}</span>;
    if (item.command) {
      return (
        <a
          href={item.href}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey) return;
            e.preventDefault();
            typeAndRun(item.command!);
          }}
          className="group/l w-fit"
        >
          {label}
        </a>
      );
    }
    if (item.href === "#") {
      // Templates such as "open <project>": clicking prefills the input.
      return (
        <button
          type="button"
          onClick={() => {
            setValue(item.label.replace(/<.*>/, "").split("·")[0]!.trim() + " ");
            inputRef.current?.focus();
          }}
          className="group/l w-fit text-left"
        >
          {label}
        </button>
      );
    }
    if (item.external) {
      return (
        <a href={item.href} className="group/l w-fit">
          {label}
        </a>
      );
    }
    return (
      <Link href={item.href} onClick={onDone} className="group/l w-fit">
        {label}
      </Link>
    );
  }

  function renderLine({ id, line }: Entry) {
    if (line.kind === "input")
      return (
        <p key={id} className="mt-3 first:mt-0">
          <Prompt user={data.strings.user} />
          <span>{line.text}</span>
        </p>
      );
    if (line.kind === "text")
      return (
        <p
          key={id}
          className={cn(
            line.tone === "error" && "text-signal",
            line.tone === "ok" && "text-mint",
            line.tone === "muted" && "text-stone-400",
          )}
        >
          {line.text}
        </p>
      );
    return (
      <div key={id} className="mt-1">
        {line.heading && <p className="text-stone-400">{line.heading}</p>}
        <ul className="grid grid-cols-[auto_1fr] gap-x-6">
          {line.items.map((item) => (
            <li key={item.label} className="contents">
              {renderLink(item)}
              <span className="text-stone-400">{item.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col border border-ink-800 bg-ink-900 font-mono text-[0.8125rem] leading-relaxed text-paper-100 md:text-sm",
        className,
      )}
      onMouseUp={() => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
      }}
    >
      <div className="flex items-center justify-between gap-4 border-b border-ink-800 px-4 py-2.5 text-stone-400">
        <span>{labels.title}</span>
        <span className="hidden truncate sm:inline">{mode === "palette" ? labels.hintKeys : labels.hint}</span>
      </div>
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label={labels.title}
        className={cn("overflow-y-auto overscroll-contain px-4 pt-4 md:px-5", mode === "inline" ? "max-h-[22rem]" : "max-h-[50vh]")}
      >
        {entries.map(renderLine)}
      </div>
      <div className="px-4 pb-4 pt-3 md:px-5">
        <div className="flex items-center">
          <label htmlFor={inputId} className="sr-only">
            {labels.inputLabel}
          </label>
          <span aria-hidden className="shrink-0">
            <Prompt user={data.strings.user} />
          </span>
          <input
            ref={inputRef}
            id={inputId}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setCursor(null);
            }}
            onKeyDown={onKeyDown}
            readOnly={typing}
            autoFocus={mode === "palette"}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="go"
            placeholder={labels.prompt}
            aria-describedby={`${inputId}-hint`}
            className="min-w-0 flex-1 bg-transparent pl-[1ch] text-paper-100 caret-signal outline-none placeholder:text-ink-600"
          />
        </div>
        <p id={`${inputId}-hint`} className="sr-only">
          {labels.hintKeys}
        </p>
        {suggestions.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2" aria-label="Tab">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => typeAndRun(s)}
                  className="rounded-sm border border-ink-800 px-2 py-0.5 text-stone-400 hover:border-cobalt hover:text-cobalt"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
