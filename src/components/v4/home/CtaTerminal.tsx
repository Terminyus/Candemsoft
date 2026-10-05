"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { onceVisible, useMotionOK } from "../fx/useMotionOK";

type Props = {
  prompt: string;
  title: string;
  button: string;
  href: string;
  contact: { email: string; phone: string; phoneHref: string; whatsapp: string };
};

/** Types a command when it scrolls into view, then prints the real ways to reach us. */
export function CtaTerminal({ prompt, title, button, href, contact }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotionOK();
  const cmd = `candemsoft ${prompt}`;
  const [typed, setTyped] = useState(cmd.length);
  const [out, setOut] = useState(true);

  useEffect(() => {
    if (!motion || !ref.current) return;
    let t: number | undefined;
    // Below the fold at load: clear the finished text so it can be typed when it arrives.
    const reset = requestAnimationFrame(() => {
      setTyped(0);
      setOut(false);
    });
    const stop = onceVisible(ref.current, () => {
      t = window.setInterval(() => {
        setTyped((n) => {
          if (n >= cmd.length) {
            window.clearInterval(t);
            window.setTimeout(() => setOut(true), 250);
            return n;
          }
          return n + 1;
        });
      }, 45);
    });
    return () => {
      cancelAnimationFrame(reset);
      stop();
      window.clearInterval(t);
    };
  }, [motion, cmd]);

  const lines = [
    { k: "email", v: contact.email, h: `mailto:${contact.email}` },
    { k: "phone", v: contact.phone, h: `tel:${contact.phoneHref}` },
    { k: "whatsapp", v: "wa.me/905349334631", h: contact.whatsapp },
  ];

  return (
    <section aria-labelledby="cta" className="container-site pt-(--section)">
      <div
        ref={ref}
        className="overflow-hidden rounded-2xl border border-signal/40 bg-dev-surface shadow-[0_0_120px_-50px_rgba(248,84,4,0.6)]"
      >
        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="v4-mono text-sm">
              <span className="text-dev-str">➜</span> <span className="text-dev-key">~</span>{" "}
              <span className="text-dev-text">{cmd.slice(0, typed)}</span>
              {typed < cmd.length && (
                <span
                  aria-hidden
                  className="v4-caret ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-signal"
                />
              )}
            </p>
            <ul className="mt-3 space-y-1 v4-mono text-sm" aria-live="polite">
              {lines.map((l, i) => (
                <li
                  key={l.k}
                  // Hidden (not faded) until the command finishes: never shown at low contrast, still holds its space.
                  className="transition-[transform,visibility] duration-500"
                  style={{
                    visibility: out ? "visible" : "hidden",
                    transform: out ? "none" : "translateY(6px)",
                    transitionDelay: `${i * 120}ms`,
                  }}
                >
                  <span className="text-dev-comment">→ {l.k.padEnd(9)}</span>
                  <a
                    href={l.h}
                    className="text-dev-key hover:text-signal"
                    {...(l.h.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {l.v}
                  </a>
                </li>
              ))}
            </ul>
            <h2 id="cta" className="v4-title mt-8 text-[clamp(2.1rem,1.3rem+3.6vw,4.5rem)]">
              {title}
            </h2>
          </div>
          <Link
            href={href}
            className="inline-flex min-h-14 items-center justify-between gap-6 rounded-md bg-signal px-7 text-lg font-semibold text-dev-bg transition-transform hover:-translate-y-0.5 lg:justify-self-end"
          >
            {button} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
