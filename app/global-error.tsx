"use client";

import type { ErrorInfo } from "next/error";

export default function GlobalError({ retry }: ErrorInfo) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          background: "#0b0e17",
          color: "#f4f6fb",
        }}
      >
        <div style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, margin: "0 0 12px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#9ea4b5", margin: "0 0 24px" }}>
            The page failed to load. Try again, or come back later.
          </p>
          <button
            type="button"
            onClick={retry}
            style={{
              appearance: "none",
              border: 0,
              borderRadius: 10,
              padding: "12px 18px",
              background: "#809eff",
              color: "#121826",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
        <style>{`
          @media (prefers-color-scheme: light) {
            body { background: #ffffff !important; color: #121826 !important; }
            p { color: #5b6172 !important; }
            button { background: #3959da !important; color: #ffffff !important; }
          }
        `}</style>
      </body>
    </html>
  );
}
