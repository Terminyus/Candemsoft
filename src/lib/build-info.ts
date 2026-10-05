import "server-only";
import { execSync } from "node:child_process";

function git(cmd: string): string {
  try {
    return execSync(`git ${cmd}`, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
}

export function getHead(): { hash: string; date: string } {
  const [hash = "", date = ""] = git("log -1 --pretty=format:%h%x09%cs").split("\t");
  return { hash, date };
}
