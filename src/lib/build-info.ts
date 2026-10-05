import "server-only";
import { execSync } from "node:child_process";

export type Commit = { hash: string; date: string; subject: string; type: string };

function git(cmd: string): string {
  try {
    return execSync(`git ${cmd}`, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
}

/** This repository's own history, read at build time. Empty when git isn't available. */
export function getCommits(limit = 32): Commit[] {
  const raw = git(`log --no-merges -n ${limit} --pretty=format:%h%x09%cs%x09%s`);
  if (!raw) return [];
  return raw.split("\n").map((line) => {
    const [hash = "", date = "", subject = ""] = line.split("\t");
    const type = subject.match(/^(\w+)(\(.+?\))?!?:/)?.[1] ?? "commit";
    return { hash, date, subject, type };
  });
}

export function getHead(): { hash: string; date: string } {
  const [hash = "", date = ""] = git("log -1 --pretty=format:%h%x09%cs").split("\t");
  return { hash, date };
}
