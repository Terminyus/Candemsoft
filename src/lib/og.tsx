import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = path.join(process.cwd(), "src/assets/fonts");

/** Shared Open Graph card: ink surface, mono label, condensed display title, orange full stop. */
export async function renderOg({ label, title, footer }: { label: string; title: string; footer?: string }) {
  const [display, mono, mark] = await Promise.all([
    fs.readFile(path.join(fontDir, "BricolageGrotesque-Condensed-SemiBold.ttf")),
    fs.readFile(path.join(fontDir, "JetBrainsMono-Regular.ttf")),
    fs.readFile(path.join(process.cwd(), "public/brand/logo-on-dark.png")),
  ]);
  const logo = `data:image/png;base64,${mark.toString("base64")}`;
  const size = title.length > 38 ? 72 : title.length > 22 ? 96 : 128;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e0d0b",
          color: "#f3f0ea",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={225} height={40} alt="" />
          <div style={{ fontFamily: "Mono", fontSize: 24, color: "#a39d91" }}>{label}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Display", fontSize: size, lineHeight: 0.95, letterSpacing: "-0.03em", display: "flex", flexWrap: "wrap" }}>
            {title.replace(/\.$/, "")}
            {/* Satori lays spans out as flex items, so the full stop only goes on titles that fit one line. */}
            {title.length <= 22 && !/[?!]$/.test(title) && <span style={{ color: "#f85404" }}>.</span>}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Mono", fontSize: 22, color: "#a39d91", borderTop: "1px solid #24221e", paddingTop: 24 }}>
          <span>{footer ?? "candemsoft.com"}</span>
          <span style={{ color: "#4ade80" }}>ziyaretci@candemsoft:~$</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Display", data: display, weight: 600, style: "normal" },
        { name: "Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
