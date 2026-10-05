import { normalize } from "@/lib/text";
import type { TermData, TermLink, TermResult } from "./types";

const fill = (s: string, vars: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

function distance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0]![j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i]![j] = Math.min(dp[i - 1]![j]! + 1, dp[i]![j - 1]! + 1, dp[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length]![b.length]!;
}

const verbs = {
  help: ["help", "yardim", "?", "komutlar", "commands", "man", "ayuda", "comandos"],
  clear: ["clear", "temizle", "cls", "limpiar"],
  ls: ["ls", "dir", "liste", "list", "listar"],
  cd: ["cd", "git", "go", "ir"],
  open: ["open", "ac", "goster", "show", "abrir"],
  cat: ["cat", "oku", "read", "leer"],
  mail: ["mail", "email", "eposta", "e-posta", "correo"],
  whatsapp: ["whatsapp", "wa"],
  tel: ["tel", "ara", "call", "phone", "telefon", "telefono", "llamar"],
  lang: ["lang", "dil", "language", "idioma"],
  whoami: ["whoami", "kimim", "quiensoy"],
  pwd: ["pwd"],
  sudo: ["sudo"],
};

type Verb = keyof typeof verbs;
const verbOf = (word: string): Verb | undefined =>
  (Object.keys(verbs) as Verb[]).find((v) => verbs[v].some((alias) => normalize(alias) === word));

function findRoute(data: TermData, word: string) {
  if (["~", "..", "/", "home", "anasayfa"].includes(word)) return data.routes.find((r) => r.key === "home");
  return data.routes.find((r) => r.aliases.some((a) => normalize(a) === word));
}

function matchBy<T extends { slug: string }>(items: T[], arg: string, name: (t: T) => string): T | undefined {
  const a = normalize(arg).replace(/\s+/g, "-");
  return (
    items.find((i) => i.slug === a || normalize(name(i)).replace(/\s+/g, "-") === a) ??
    items.find((i) => i.slug.startsWith(a) || normalize(name(i)).startsWith(normalize(arg)))
  );
}

/** Every word a visitor could type first; used for completion and typo hints. */
export function vocabulary(data: TermData): string[] {
  const words = new Set<string>();
  data.routes.forEach((r) => words.add(r.command));
  ["help", "ls", "open", "cat", "clear", "mail", "whatsapp", "tel", "lang", "whoami"].forEach((w) => words.add(w));
  const local: Partial<Record<TermData["lang"], string[]>> = { tr: ["yardim", "ac", "temizle"], es: ["ayuda", "abrir", "limpiar"] };
  local[data.lang]?.forEach((w) => words.add(w));
  return [...words];
}

export function complete(data: TermData, input: string): string[] {
  const raw = input.replace(/^\s+/, "");
  const parts = raw.split(/\s+/);
  if (parts.length <= 1) {
    const q = normalize(parts[0] ?? "");
    if (!q) return [];
    return vocabulary(data).filter((w) => normalize(w).startsWith(q) && normalize(w) !== q).slice(0, 6);
  }
  const verb = verbOf(normalize(parts[0]!));
  const q = normalize(parts.slice(1).join(" "));
  let pool: string[] = [];
  if (verb === "open") pool = [...data.projects.map((p) => p.slug), ...data.products.map((p) => p.slug)];
  else if (verb === "cat") pool = data.services.map((s) => s.slug);
  else if (verb === "cd" || verb === "ls") pool = data.routes.map((r) => r.command).filter(Boolean);
  else if (verb === "lang") pool = Object.keys(data.langHrefs);
  return pool
    .filter((w) => normalize(w).startsWith(q) && normalize(w) !== q)
    .slice(0, 6)
    .map((w) => `${parts[0]} ${w}`);
}

function help(data: TermData): TermResult {
  const s = data.strings;
  return {
    lines: [
      {
        kind: "links",
        heading: s.helpIntro,
        items: data.routes
          .filter((r) => r.key !== "home" && r.key !== "privacy")
          .map((r) => ({ label: r.command, href: r.href, desc: r.desc, command: r.command })),
      },
      {
        kind: "links",
        heading: s.helpMore,
        items: s.more.map(({ cmd, desc }) => ({
          label: cmd,
          href: "#",
          desc,
          command: cmd.includes("<") || cmd.includes("·") ? undefined : cmd,
        })),
      },
    ],
  };
}

function go(data: TermData, href: string, label: string): TermResult {
  return { lines: [{ kind: "text", text: fill(data.strings.going, { target: label }), tone: "ok" }], action: { type: "navigate", href } };
}

export function run(data: TermData, input: string, pathname = "/"): TermResult {
  const s = data.strings;
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };
  const [head = "", ...rest] = trimmed.split(/\s+/);
  const word = normalize(head);
  const arg = rest.join(" ");
  const verb = verbOf(word);

  if (verb === "help") return help(data);
  if (verb === "clear") return { lines: [], action: { type: "clear" } };
  if (verb === "whoami") return { lines: [{ kind: "text", text: s.whoami }] };
  if (verb === "pwd") return { lines: [{ kind: "text", text: pathname }] };

  if (verb === "sudo")
    return {
      lines: [
        { kind: "text", text: s.sudo, tone: "muted" },
        { kind: "links", items: [{ label: data.contact.email, href: `mailto:${data.contact.email}`, external: true }] },
      ],
    };

  if (verb === "mail")
    return {
      lines: [{ kind: "text", text: fill(s.going, { target: data.contact.email }), tone: "ok" }],
      action: { type: "location", href: `mailto:${data.contact.email}` },
    };
  if (verb === "whatsapp")
    return {
      lines: [{ kind: "text", text: fill(s.opening, { target: "WhatsApp" }), tone: "ok" }],
      action: { type: "external", href: data.contact.whatsapp },
    };
  if (verb === "tel")
    return { lines: [{ kind: "links", items: [{ label: data.contact.phone, href: `tel:${data.contact.phoneHref}`, external: true }] }] };

  if (verb === "lang") {
    const codes = Object.keys(data.langHrefs) as TermData["lang"][];
    const target = normalize(arg) as TermData["lang"];
    if (!codes.includes(target)) return { lines: [{ kind: "text", text: fill(s.needArg, { usage: `lang ${codes.join("|")}` }), tone: "error" }] };
    if (target === data.lang) return { lines: [{ kind: "text", text: `lang: ${target}`, tone: "muted" }] };
    return { lines: [{ kind: "text", text: fill(s.going, { target }), tone: "ok" }], action: { type: "location", href: data.langHrefs[target] } };
  }

  if (verb === "ls") {
    const target = arg ? findRoute(data, normalize(arg)) : undefined;
    if (target?.key === "projects")
      return {
        lines: [
          {
            kind: "links",
            heading: s.projectsHeading,
            items: data.projects.map((p) => ({ label: p.slug, href: p.href, desc: p.live ? p.name : `${p.name} · ${s.offline}`, command: `open ${p.slug}` })),
          },
        ],
      };
    if (target?.key === "products")
      return { lines: [{ kind: "links", heading: s.productsHeading, items: data.products.map((p) => ({ label: p.slug, href: p.href, desc: p.name, command: `open ${p.slug}` })) }] };
    if (target?.key === "services")
      return { lines: [{ kind: "links", heading: s.servicesHeading, items: data.services.map((x) => ({ label: x.slug, href: x.href, desc: x.title, command: `cat ${x.slug}` })) }] };
    return help(data);
  }

  if (verb === "open") {
    if (!arg) return { lines: [{ kind: "text", text: fill(s.needArg, { usage: "open <slug>" }), tone: "error" }] };
    const project = matchBy(data.projects, arg, (p) => p.name);
    if (project) return go(data, project.href, project.name);
    const product = matchBy(data.products, arg, (p) => p.name);
    if (product) return go(data, product.href, product.name);
    return { lines: [{ kind: "text", text: fill(s.noMatch, { arg }), tone: "error" }] };
  }

  if (verb === "cat") {
    if (!arg) return { lines: [{ kind: "text", text: fill(s.needArg, { usage: "cat <slug>" }), tone: "error" }] };
    const a = normalize(arg);
    const service = data.services.find((x) => x.aliases.some((al) => normalize(al) === a)) ?? matchBy(data.services, arg, (x) => x.title);
    if (!service) return { lines: [{ kind: "text", text: fill(s.noMatch, { arg }), tone: "error" }] };
    return {
      lines: [
        { kind: "text", text: `# ${service.title}` },
        { kind: "text", text: service.summary, tone: "muted" },
        { kind: "links", items: [{ label: `${data.routes.find((r) => r.key === "services")?.command}#${service.slug}`, href: service.href }] },
      ],
    };
  }

  const route = findRoute(data, verb === "cd" ? normalize(arg) : word);
  if (route) return go(data, route.href, route.label);

  // Unknown: suggest the closest known word.
  const candidates = vocabulary(data);
  const best = candidates
    .map((c) => ({ c, d: distance(word, normalize(c)) }))
    .sort((a, b) => a.d - b.d)[0];
  const lines: TermResult["lines"] = [{ kind: "text", text: fill(s.notFound, { cmd: head }), tone: "error" }];
  if (best && best.d <= Math.max(2, Math.floor(word.length / 3))) {
    const r = findRoute(data, normalize(best.c));
    const suggestion: TermLink = { label: best.c, href: r?.href ?? "#", command: best.c };
    lines.push({ kind: "links", heading: s.didYouMean, items: [suggestion] });
  }
  return { lines };
}
