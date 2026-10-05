import { Instrument_Sans, JetBrains_Mono } from "next/font/google";

// latin-ext carries ğ ş ı İ. The display face (Bricolage Grotesque) is self-hosted in
// globals.css instead: it needs opsz pinned at 96, which next/font can't request.

export const body = Instrument_Sans({
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
