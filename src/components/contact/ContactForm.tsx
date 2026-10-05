"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { submitContact } from "@/lib/contact";

type Labels = {
  name: string;
  email: string;
  phone: string;
  optional: string;
  topic: string;
  topics: string[];
  message: string;
  messageHint: string;
  consent: string;
  consentLink: string;
  submit: string;
  sending: string;
  success: string;
  mailtoFallback: string;
  error: string;
  errors: { name: string; email: string; message: string; consent: string };
};

type Errors = Partial<Record<"name" | "email" | "message" | "consent", string>>;
const MAX = 1000;

export function ContactForm({ labels, locale, email, privacyHref }: { labels: Labels; locale: string; email: string; privacyHref: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [length, setLength] = useState(0);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "mailto" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  function validate(data: FormData): Errors {
    const e: Errors = {};
    if (!String(data.get("name")).trim()) e.name = labels.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email")).trim())) e.email = labels.errors.email;
    if (String(data.get("message")).trim().length < 10) e.message = labels.errors.message;
    if (!data.get("consent")) e.consent = labels.errors.consent;
    return e;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("company")) return; // honeypot
    const found = validate(data);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setState("sending");
    const result = await submitContact(
      {
        name: String(data.get("name")).trim(),
        email: String(data.get("email")).trim(),
        phone: String(data.get("phone") ?? "").trim(),
        topic: String(data.get("topic")),
        message: String(data.get("message")).trim(),
        locale,
      },
      email,
    );
    setState(result.status);
    if (result.status === "sent") {
      formRef.current?.reset();
      setLength(0);
    }
  }

  const err = (k: keyof Errors) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": `cf-${k}-error` } : {};

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-6 md:grid-cols-2">
      <Field id="cf-name" label={labels.name} required error={errors.name}>
        <Input id="cf-name" name="name" autoComplete="name" required {...err("name")} />
      </Field>
      <Field id="cf-email" label={labels.email} required error={errors.email}>
        <Input id="cf-email" name="email" type="email" autoComplete="email" inputMode="email" required {...err("email")} />
      </Field>
      <Field id="cf-phone" label={labels.phone} hint={labels.optional}>
        <Input id="cf-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" />
      </Field>
      <Field id="cf-topic" label={labels.topic}>
        <Select id="cf-topic" name="topic" defaultValue={labels.topics[0]}>
          {labels.topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
      </Field>
      <div className="md:col-span-2">
        <Field id="cf-message" label={labels.message} required error={errors.message} hint={labels.messageHint.replace("{n}", String(length))}>
          <Textarea
            id="cf-message"
            name="message"
            maxLength={MAX}
            required
            onChange={(e) => setLength(e.target.value.length)}
            {...err("message")}
          />
        </Field>
      </div>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="cf-company">Company</label>
        <input id="cf-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="md:col-span-2">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 size-5 shrink-0 accent-ink-950"
            {...err("consent")}
          />
          <span className="text-stone-600">
            {labels.consent}{" "}
            <Link href={privacyHref} className="text-ink-950 underline underline-offset-4">
              {labels.consentLink}
            </Link>
          </span>
        </label>
        <p id="cf-consent-error" aria-live="polite" className={errors.consent ? "mt-2 text-sm text-ember" : "sr-only"}>
          {errors.consent}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-6 md:col-span-2">
        <Button type="submit" arrow="→" disabled={state === "sending"}>
          {state === "sending" ? labels.sending : labels.submit}
        </Button>
        <p role="status" className="text-stone-600">
          {state === "sent" && labels.success}
          {state === "mailto" && labels.mailtoFallback}
          {state === "error" && <span className="text-ember">{labels.error}</span>}
        </p>
      </div>
    </form>
  );
}
