import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const alt = siteConfig.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [regular, semibold] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Geist-Regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Geist-SemiBold.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0b0e17",
        color: "#f4f6fb",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundImage: "linear-gradient(135deg, #496cef, #00bbcb)",
          }}
        />
        <div style={{ fontSize: 28, fontWeight: 600 }}>Flowly</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            maxWidth: 980,
          }}
        >
          {siteConfig.tagline}
        </div>
        <div style={{ fontSize: 28, color: "#9ea4b5", maxWidth: 820 }}>
          {siteConfig.oneLiner}
        </div>
      </div>
      <div style={{ fontSize: 22, color: "#809eff" }}>
        flowly-demo.vercel.app
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: regular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Geist",
          data: semibold,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
