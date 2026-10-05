import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/lib/dictionary";
import { getTerminalData } from "@/lib/terminal/data";
import { run } from "@/lib/terminal/engine";
import { Terminal } from "@/components/terminal/Terminal";

/**
 * Home hero terminal. The server renders a `help` listing whose commands are
 * real links (works without JS); the client makes the prompt live.
 */
export function TerminalPreview({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const data = getTerminalData(lang, dict);
  const help = run(data, "help").lines;
  const initial = [{ kind: "input" as const, text: "help" }, help[0]!];
  return (
    <Terminal
      data={data}
      mode="inline"
      initial={initial}
      labels={{
        title: dict.terminal.title,
        hint: dict.terminal.hint,
        prompt: dict.terminal.prompt,
        inputLabel: dict.terminal.inputLabel,
        hintKeys: dict.terminal.hintKeys,
      }}
    />
  );
}
