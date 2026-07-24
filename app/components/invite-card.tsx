"use client";

import { useState } from "react";

export default function InviteCard({
  refCode,
  joined,
  monthsEarned,
  invitesLeft,
  resetInfo,
}: {
  refCode: string;
  joined: number;
  monthsEarned: number;
  invitesLeft: number;
  resetInfo: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const link = "https://shipcrewfinder.com/signup/crew?ref=" + refCode;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Panoya erişilemezse metni seçtirmek için prompt
      window.prompt("Copy your invite link:", link);
    }
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
        🎁 Invite crew — earn free months
      </div>
      <p style={{ fontSize: 12.5, color: "var(--tx2)", lineHeight: 1.6, marginBottom: 14 }}>
        Share your link with shipmates. When they join and complete their profile, <b style={{ color: "var(--tx)" }}>you both get +1 free month</b>.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <div
          style={{
            flex: "1 1 200px",
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
            background: copied
              ? "rgba(52,211,153,.15)"
              : "linear-gradient(135deg,var(--gold),var(--gold2))",
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
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9 }}>
        <div style={{ border: "1px solid var(--line2)", borderRadius: 12, padding: "10px 12px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--tx3)", marginBottom: 3 }}>
            Crew joined
          </div>
          <div style={{ fontFamily: "var(--disp)", fontWeight: 800, fontSize: 21 }}>{joined}</div>
        </div>
        <div style={{ border: "1px solid rgba(52,211,153,.3)", background: "rgba(52,211,153,.06)", borderRadius: 12, padding: "10px 12px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#34d399", marginBottom: 3 }}>
            Months earned
          </div>
          <div style={{ fontFamily: "var(--disp)", fontWeight: 800, fontSize: 21, color: "#34d399" }}>+{monthsEarned}</div>
        </div>
        <div style={{ border: "1px solid rgba(251,191,36,.3)", background: "rgba(251,191,36,.06)", borderRadius: 12, padding: "10px 12px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 3 }}>
            Invites left
          </div>
          <div style={{ fontFamily: "var(--disp)", fontWeight: 800, fontSize: 21, color: "var(--gold)" }}>{invitesLeft}/2</div>
        </div>
      </div>

      {invitesLeft === 0 && resetInfo ? (
        <p style={{ fontSize: 11, color: "var(--tx3)", marginTop: 10 }}>
          Reward limit reached — next invite slot opens {resetInfo}.
        </p>
      ) : null}
    </div>
  );
}
