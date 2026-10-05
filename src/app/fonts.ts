import { Instrument_Sans, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";

// Schibsted Grotesk carries the classic design: 400 for text, 700–800 for headings.
// latin-ext covers ğ ş ı İ and Spanish.
export const body = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--ff-body",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--ff-mono",
  display: "swap",
  // Labels and the terminal read fine in the system monospace for the first moment; don't compete with LCP.
  preload: false,
});

// Vitrin (/v2) keeps its original text face.
export const instrument = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--ff-body",
  display: "swap",
});
