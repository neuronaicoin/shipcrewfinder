"use client";

import { useState, useTransition } from "react";
import { rateCompany } from "@/lib/actions/ratings";

export default function CompanyRating({
  companyId,
  myRating,
}: {
  companyId: string;
  myRating: number | null;
}) {
  const [current, setCurrent] = useState<number | null>(myRating);
  const [hover, setHover] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    myRating ? { kind: "ok", text: "Your rating: " + myRating + " anchor" + (myRating === 1 ? "" : "s") } : null
  );
  const [pending, startTransition] = useTransition();

  const anchorSvg = (filled: boolean) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={filled ? "#fbbf24" : "rgba(168,189,210,.45)"}
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", margin: "0 auto" }}
    >
      <circle cx="12" cy="5" r="2.4" />
      <line x1="12" y1="7.4" x2="12" y2="20.5" />
      <line x1="7.5" y1="10.4" x2="16.5" y2="10.4" />
      <path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7" />
      <path d="M4.5 14.8l-1.6-1.2M4.5 14.8l2-.4" />
      <path d="M19.5 14.8l1.6-1.2M19.5 14.8l-2-.4" />
    </svg>
  );

  const pick = (value: number) => {
    if (pending) return;
    startTransition(async () => {
      const res = await rateCompany(companyId, value);
      if (res.ok) {
        setCurrent(value);
        setMsg({ kind: "ok", text: "Saved — your rating: " + value + " anchor" + (value === 1 ? "" : "s") });
      } else {
        setMsg({ kind: "err", text: res.error || "Something went wrong." });
      }
    });
  };

  const shown = hover ?? current ?? 0;

  return (
    <div>
      <div style={{ fontFamily: "var(--disp)", fontWeight: 800, fontSize: 14.5, marginBottom: 4 }}>
        Rate this company
      </div>
      <div style={{ fontSize: 12, color: "var(--tx3)", marginBottom: 12 }}>
        Anonymous — the company never sees who voted.
      </div>

      <div style={{ display: "flex", gap: 7, marginBottom: 10 }}>
        {[1, 2, 3, 4, 5].map((v) => {
          const filled = v <= shown;
          return (
            <button
              key={v}
              type="button"
              disabled={pending}
              onClick={() => pick(v)}
              onMouseEnter={() => setHover(v)}
              onMouseLeave={() => setHover(null)}
              style={{
                flex: 1,
                cursor: pending ? "wait" : "pointer",
                background: filled ? "rgba(251,191,36,.12)" : "rgba(255,255,255,.03)",
                border: filled ? "1.5px solid rgba(251,191,36,.55)" : "1px solid var(--line2)",
                borderRadius: 11,
                padding: "8px 0 9px",
                transition: ".15s",
              }}
              aria-label={"Rate " + v}
            >
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  fontFamily: "var(--disp)",
                  color: filled ? "#fbbf24" : "var(--tx3)",
                  marginBottom: 3,
                }}
              >
                {v}
              </div>
              {anchorSvg(filled)}
            </button>
          );
        })}
      </div>

      {pending ? (
        <div style={{ fontSize: 12, color: "var(--tx3)" }}>Saving…</div>
      ) : msg ? (
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: msg.kind === "ok" ? "#34d399" : "#f87171",
          }}
        >
          {msg.kind === "ok" ? "✓ " : ""}{msg.text}
        </div>
      ) : (
        <div style={{ fontSize: 12, color: "var(--tx3)" }}>Tap an anchor to rate — saves instantly.</div>
      )}
    </div>
  );
}
