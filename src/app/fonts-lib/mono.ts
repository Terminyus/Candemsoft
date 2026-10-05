import { JetBrains_Mono } from "next/font/google";

export const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--ff-mono",
  display: "swap",
  // Labels and the terminal read fine in the system monospace for the first moment; don't compete with LCP.
  preload: false,
});
