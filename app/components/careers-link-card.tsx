"use client";

import { useState } from "react";

export default function CareersLinkCard({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const link = "https://shipcrewfinder.com/careers/" + slug;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy your careers page link:", link);
    }
  };

  const ghostBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    color: "var(--tx)",
    border: "1px solid var(--line2)",
    borderRadius: 11,
    padding: "10px 16px",
    fontWeight: 700,
    fontSize: 13,
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        background: "linear-gradient(165deg,var(--navy2),var(--ink))",
        border: "1.5px solid var(--line)",
        borderRadius: 18,
        padding: "20px 22px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--disp)",
          fontSize: 12.5,
          fontWeight: 700,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "var(--gold)",
          marginBottom: 10,
        }}
      >
        🏷️ Your Careers Page
      </div>
      <p style={{ fontSize: 12.5, color: "var(--tx2)", lineHeight: 1.6, marginBottom: 14 }}>
        Your public careers page shows all your open positions with your crew rating. Add this link to your <b style={{ color: "var(--tx)" }}>website, LinkedIn and job ads</b> — every application lands in your Applications tracker automatically.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div
          style={{
            flex: "1 1 220px",
            minWidth: 0,
            border: "1px solid var(--line2)",
            background: "rgba(255,255,255,.03)",
            borderRadius: 11,
            padding: "10px 13px",
            fontSize: 12,
            color: "var(--tx2)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "monospace",
          }}
        >
          {link.replace("https://", "")}
        </div>
        <button
          type="button"
          onClick={copy}
          style={{
            background: copied ? "rgba(52,211,153,.15)" : "linear-gradient(135deg,var(--gold),var(--gold2))",
            color: copied ? "#34d399" : "#0b0e13",
            border: copied ? "1px solid rgba(52,211,153,.4)" : "none",
            borderRadius: 11,
            padding: "10px 18px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "var(--body)",
            transition: ".18s",
            whiteSpace: "nowrap",
          }}
        >
          {copied ? "✓ Copied" : "Copy link"}
        </button>
        <a href={"/careers/" + slug} target="_blank" rel="noopener noreferrer" style={ghostBtn}>Preview →</a>
      </div>
    </div>
  );
}
