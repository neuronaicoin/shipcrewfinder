"use client";

import { useActionState } from "react";
import { submitSalary, type SubmitState } from "@/lib/actions/salary";
import { SALARY_DATA, VESSELS } from "@/lib/data/salary";

export default function SalarySubmitForm() {
  const [state, formAction, pending] = useActionState<SubmitState | null, FormData>(
    submitSalary,
    null
  );

  if (state?.ok) {
    return (
      <div style={{
        background: "rgba(52,211,153,.08)", border: "1px solid rgba(52,211,153,.3)",
        borderRadius: 16, padding: "26px 24px", textAlign: "center",
      }}>
        <div style={{ fontSize: 26, marginBottom: 8 }}>⚓</div>
        <div style={{ fontFamily: "var(--disp)", fontWeight: 800, fontSize: 17, marginBottom: 6 }}>
          Thank you, sailor.
        </div>
        <p style={{ fontSize: 13, color: "var(--tx2)", lineHeight: 1.6 }}>
          Your anonymous contribution strengthens the index for every seafarer.
          Updated figures roll into the next quarterly release.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        aria-hidden="true"
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={lbl}>Rank</label>
          <select name="rank" required defaultValue="" style={sel}>
            <option value="" disabled>Select rank</option>
            {SALARY_DATA.map((r) => (
              <option key={r.slug} value={r.rank}>{r.rank}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={lbl}>Vessel type</label>
          <select name="vessel" required defaultValue="" style={sel}>
            <option value="" disabled>Select vessel</option>
            {VESSELS.map((v) => (
              <option key={v.key} value={v.label}>{v.label}</option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label style={lbl}>Monthly basic (USD)</label>
          <input name="wage" type="number" min={100} max={50000} required placeholder="e.g. 9500" style={sel} />
        </div>
        <div>
          <label style={lbl}>Years in rank (optional)</label>
          <select name="years" defaultValue="" style={sel}>
            <option value="">Prefer not to say</option>
            <option value="0-2">0–2 years</option>
            <option value="3-5">3–5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>
      </div>
      {state?.error && (
        <div style={{
          background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)",
          borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 12,
        }}>
          {state.error}
        </div>
      )}
      <button type="submit" disabled={pending} className="btn btn-gold" style={{ width: "100%", opacity: pending ? 0.6 : 1 }}>
        {pending ? "Submitting…" : "Submit anonymously →"}
      </button>
      <p style={{ fontSize: 11.5, color: "var(--tx3)", textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
        No name. No email. No account needed. We store only rank, vessel type and wage.
      </p>
    </form>
  );
}

const lbl: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
  textTransform: "uppercase", color: "var(--tx3)", marginBottom: 7,
};

const sel: React.CSSProperties = {
  width: "100%", background: "var(--navy)", border: "1px solid var(--line2)",
  color: "var(--tx)", borderRadius: 11, padding: "12px 13px",
  fontFamily: "var(--body)", fontSize: 13.5, fontWeight: 500, outline: "none",
};
