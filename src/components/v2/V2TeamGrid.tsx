import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getTeam, publicFileExists } from "@/lib/content";
import { asset } from "@/lib/static";
import { initials } from "@/lib/text";

export function V2TeamGrid({ lang }: { lang: Locale }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
      {getTeam().map((m, i) => (
        <li key={`${m.name}-${i}`}>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-ink-950 bg-white">
            {m.photo && publicFileExists(m.photo) ? (
              <Image src={asset(m.photo)} alt={m.name} fill sizes="(min-width: 768px) 22vw, 45vw" className="object-cover" />
            ) : (
              <span aria-hidden className={`absolute inset-0 grid place-items-center v2-display text-[clamp(2.5rem,1.5rem+4vw,5rem)] ${i % 3 === 0 ? "bg-signal" : i % 3 === 1 ? "bg-ink-950 text-white" : ""}`}>
                {initials(m.name)}
              </span>
            )}
          </div>
          <p className="v2-heading mt-3 text-lg">{m.name}</p>
          <p className="font-mono text-mono-sm text-stone-600">{m.role[lang]}</p>
        </li>
      ))}
    </ul>
  );
}
