/**
 * Contact form integration point.
 *
 * Set NEXT_PUBLIC_CONTACT_ENDPOINT to any endpoint that accepts a JSON POST
 * (Formspree, a Vercel function, a CRM webhook…). Without it the form still
 * works: it opens the visitor's email app with the message pre-filled.
 */
export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  locale: string;
};

export type ContactResult = { status: "sent" } | { status: "mailto" } | { status: "error" };

export async function submitContact(payload: ContactPayload, fallbackEmail: string): Promise<ContactResult> {
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      return res.ok ? { status: "sent" } : { status: "error" };
    } catch {
      return { status: "error" };
    }
  }
  const body = [payload.message, "", "—", payload.name, payload.email, payload.phone].filter((l) => l !== undefined).join("\n");
  const url = `mailto:${fallbackEmail}?subject=${encodeURIComponent(`[${payload.topic}] ${payload.name}`)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
  return { status: "mailto" };
}
