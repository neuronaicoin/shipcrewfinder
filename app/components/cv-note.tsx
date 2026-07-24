"use client";

import { useEffect, useState } from "react";

export default function CvNote() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("scf_cv_note") !== "1") setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem("scf_cv_note", "1");
    } catch {}
  };

  if (!show) return null;

  return (
    <div
      className="no-print"
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(3,5,18,.78)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div
        style={{ background: "linear-gradient(165deg,#141845,#050716)", border: "1.5px solid rgba(251,191,36,.4)", borderRadius: 20, padding: "26px 26px 22px", maxWidth: 420, width: "100%", boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}
      >
        <div style={{ fontSize: 26, marginBottom: 10 }}>📄</div>
        <div style={{ fontFamily: "var(--disp)", fontWeight: 800, fontSize: 18, color: "#eef4fa", marginBottom: 10 }}>Make your CV complete</div>
        <p style={{ fontSize: 13, color: "#a8bdd2", lineHeight: 1.7, marginBottom: 14 }}>
          Your CV fills itself automatically from three places:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12.5, color: "#a8bdd2", lineHeight: 1.55 }}><span>👤</span><span><b style={{ color: "#eef4fa" }}>Profile</b> — rank, availability, phone, languages</span></div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12.5, color: "#a8bdd2", lineHeight: 1.55 }}><span>⏱</span><span><b style={{ color: "#eef4fa" }}>Sea Time Tracker</b> — your sea service table</span></div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12.5, color: "#a8bdd2", lineHeight: 1.55 }}><span>📁</span><span><b style={{ color: "#eef4fa" }}>Document Vault</b> — certificates with expiry years</span></div>
        </div>
        <p style={{ fontSize: 12, color: "#6b83a0", lineHeight: 1.6, marginBottom: 18 }}>
          Fill all three completely so your CV looks professional and nothing is missing when companies see it.
        </p>
        <button
          type="button"
          onClick={dismiss}
          style={{ width: "100%", background: "linear-gradient(135deg,#fbbf24,#e0a010)", color: "#0b0e13", border: "none", borderRadius: 12, padding: "13px 0", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "var(--body)" }}
        >
          OK, got it ✓
        </button>
      </div>
    </div>
  );
}
