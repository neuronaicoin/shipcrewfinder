"use client";

import { useState } from "react";

export default function InviteCard({
  refCode,
  joined,
  isPremium,
  invitesLeft,
}: {
  refCode: string;
  joined: number;
  isPremium: boolean;
  invitesLeft: number;
}) {
  const [copied, setCopied] = useState(false);
  const link = "https://shipcrewfinder.com/signup/crew?ref=" + refCode;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy your invite link:", link);
    }
  };

  return (
    <div
      style={{
        background: isPremium
          ? "linear-gradient(165deg,rgba(251,191,36,.1),var(--ink))"
          : "linear-gradient(165deg,var(--navy2),var(--ink))",
        border: isPremium ? "1.5px solid var(--gold)" : "1.5px solid var(--gold)",
        borderRadius: 18,
        padding: "20px 22px",
        boxShadow: isPremium ? "none" : "0 0 24px rgba(251,191,36,.15)",
      }}
    >
      {isPremium ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "linear-gradient(135deg,var(--gold),var(--gold2))",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 26 }}>🌟</span>
          <div>
            <div style={{ fontFamily: "var(--disp)", fontWeight: 800, fontSize: 15, color: "#0b0e13" }}>
              You're a PREMIUM member
            </div>
            <div style={{ fontSize: 11.5, color: "#0b0e13", opacity: 0.85 }}>
              Priority in search results · First alert on new job posts
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              fontFamily: "var(--disp)",
              fontSize: 17,
              fontWeight: 800,
              color: "var(--gold)",
              marginBottom: 8,
              lineHeight: 1.3,
            }}
          >
            🌟 Invite 2 friends — Get Premium
          </div>
          <p style={{ fontSize: 13, color: "var(--tx2)", lineHeight: 1.6, marginBottom: 12 }}>
            2 friends join with your link {"&"} finish their profile — you get <b style={{ color: "var(--gold)" }}>Premium, free forever</b>:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "var(--tx)" }}>
              <span style={{ fontSize: 16 }}>🔝</span> Show up first in company searches
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "var(--tx)" }}>
              <span style={{ fontSize: 16 }}>🔔</span> Get new jobs before anyone else
            </div>
          </div>
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: "var(--tx3)",
              textTransform: "uppercase",
              letterSpacing: ".04em",
              marginBottom: 8,
            }}
          >
            👇 Copy your link. Send it to a friend.
          </div>
        </>
      )}

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

      <div style={{ display: "grid", gridTemplateColumns: isPremium ? "1fr" : "1fr 1fr", gap: 9 }}>
        <div style={{ border: "1px solid var(--line2)", borderRadius: 12, padding: "10px 12px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--tx3)", marginBottom: 3 }}>
            Friends joined
          </div>
          <div style={{ fontFamily: "var(--disp)", fontWeight: 800, fontSize: 21 }}>{joined}</div>
        </div>
        {!isPremium && (
          <div style={{ border: "1px solid rgba(251,191,36,.3)", background: "rgba(251,191,36,.06)", borderRadius: 12, padding: "10px 12px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 3 }}>
              Until Premium
            </div>
            <div style={{ fontFamily: "var(--disp)", fontWeight: 800, fontSize: 21, color: "var(--gold)" }}>{invitesLeft} left</div>
          </div>
        )}
      </div>
    </div>
  );
}
