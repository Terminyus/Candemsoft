import { notFound } from "next/navigation";

// Any unmatched path under a locale renders [lang]/not-found.tsx inside the site layout.
export default function CatchAll() {
  notFound();
}
