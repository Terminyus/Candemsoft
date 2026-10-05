import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getTeam, publicFileExists } from "@/lib/content";
import { asset } from "@/lib/static";
import { initials } from "@/lib/text";

export function V4Team({ lang }: { lang: Locale }) {
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {getTeam().map((m, i) => (
        <li key={`${m.name}-${i}`} className="v4-rise rounded-xl border border-dev-line bg-dev-surface p-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-dev-bg">
            {m.photo && publicFileExists(m.photo) ? (
              <Image src={asset(m.photo)} alt={m.name} fill sizes="(min-width: 768px) 22vw, 45vw" className="object-cover" />
            ) : (
              <span aria-hidden className="absolute inset-0 grid place-items-center v4-mono text-4xl text-signal">
                {`<${initials(m.name)}/>`}
              </span>
            )}
          </div>
          <p className="mt-3 font-semibold">{m.name}</p>
          <p className="v4-mono text-xs text-dev-comment">{m.role[lang]}</p>
        </li>
      ))}
    </ul>
  );
}
