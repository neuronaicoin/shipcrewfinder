"use client";

import { useState } from "react";

export default function CvActions({ shareUrl }: { shareUrl: string }) {
  const [copied, setCopied] = useState(false);

  const printPdf = () => {
    window.print();
  };

  const shareWhatsApp = () => {
    const text = "My maritime CV — verified profile on ShipCrewFinder: " + shareUrl;
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy your CV link:", shareUrl);
    }
  };

  const btnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 11,
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    transition: ".18s",
    border: "none",
    padding: "11px 18px",
    fontFamily: "var(--body)",
  };

  return (
    <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }} className="no-print">
      <button
        type="button"
        onClick={printPdf}
        style={{
          ...btnBase,
          background: "linear-gradient(135deg,#fbbf24,#e0a010)",
          color: "#0b0e13",
        }}
      >
        ⬇️ Download PDF
      </button>
      <button
        type="button"
        onClick={shareWhatsApp}
        style={{
          ...btnBase,
          background: "rgba(37,211,102,.14)",
          color: "#25d366",
          border: "1px solid rgba(37,211,102,.4)",
        }}
      >
        📱 WhatsApp
      </button>
      <button
        type="button"
        onClick={copyLink}
        style={{
          ...btnBase,
          background: copied ? "rgba(52,211,153,.14)" : "transparent",
          color: copied ? "#34d399" : "var(--tx)",
          border: copied ? "1px solid rgba(52,211,153,.4)" : "1px solid var(--line2)",
        }}
      >
        {copied ? "✓ Copied" : "📋 Copy link"}
      </button>
    </div>
  );
}
