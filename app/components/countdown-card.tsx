"use client";

export default function CountdownCard({
  endDate,
  startDate,
  rankLabel,
}: {
  endDate: string | null;
  startDate: string | null;
  rankLabel: string | null;
}) {
  const dayMs = 24 * 3600 * 1000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = endDate ? new Date(endDate + "T00:00:00") : null;
  const start = startDate ? new Date(startDate + "T00:00:00") : null;

  const daysLeft = end ? Math.round((end.getTime() - today.getTime()) / dayMs) : null;

  const shareText = (d: number) =>
    "\u2693 " + d + " days to sign-off! \u23F3 \u2014 counting down at shipcrewfinder.com";

  const shareWhatsApp = () => {
    if (daysLeft === null || daysLeft < 0) return;
    window.open("https://wa.me/?text=" + encodeURIComponent(shareText(daysLeft)), "_blank");
  };

  const cardBase: React.CSSProperties = {
    borderRadius: 18,
    padding: "20px 22px",
  };

  const goldBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    background: "linear-gradient(135deg,var(--gold),var(--gold2))",
    color: "#0b0e13",
    borderRadius: 11,
    padding: "10px 17px",
    fontWeight: 700,
    fontSize: 13,
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  // ── DURUM 3: tarih yok veya kontrat bitti ──
  if (!end || (daysLeft !== null && daysLeft < 0)) {
    return (
      <div
        style={{
          ...cardBase,
          background: "linear-gradient(165deg,var(--navy2),var(--ink))",
          border: "1.5px dashed var(--line)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "var(--disp)", fontWeight: 800, fontSize: 15.5, marginBottom: 3 }}>
            {end ? "Welcome home! 🏠" : "⏳ Sign-off countdown"}
          </div>
          <p style={{ fontSize: 12.5, color: "var(--tx2)", lineHeight: 1.55 }}>
            {end
              ? "Contract complete. Update your availability so companies can find you first."
              : "Set your contract dates and count down every day to sign-off."}
          </p>
        </div>
        <a href="/onboarding/crew/step-5" style={goldBtn}>{end ? "Update availability →" : "Set dates →"}</a>
      </div>
    );
  }

  const isFinal = daysLeft !== null && daysLeft <= 7;

  // İlerleme (start varsa)
  let pct: number | null = null;
  let dayNum: number | null = null;
  let totalDays: number | null = null;
  if (start && end && end > start) {
    totalDays = Math.round((end.getTime() - start.getTime()) / dayMs);
    dayNum = Math.min(totalDays, Math.max(0, Math.round((today.getTime() - start.getTime()) / dayMs)));
    pct = Math.min(100, Math.max(0, Math.round((dayNum / totalDays) * 100)));
  }

  const endLabel = end.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div
      style={{
        ...cardBase,
        background: isFinal
          ? "linear-gradient(160deg,rgba(52,211,153,.14),var(--ink))"
          : "linear-gradient(165deg,var(--navy2),var(--ink))",
        border: isFinal ? "1.5px solid rgba(52,211,153,.45)" : "1.5px solid var(--line)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 10, flexWrap: "wrap" }}>
        <div style={{ fontFamily: "var(--disp)", fontSize: 12.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: isFinal ? "#34d399" : "var(--gold)" }}>
          ⏳ Sign-off countdown
        </div>
        <button
          type="button"
          onClick={shareWhatsApp}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(37,211,102,.13)", color: "#25d366", border: "1px solid rgba(37,211,102,.4)", borderRadius: 10, padding: "7px 13px", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "var(--body)" }}
        >
          📱 Share
        </button>
      </div>

      <div style={{ textAlign: "center", padding: "4px 0 10px" }}>
        <div style={{ fontFamily: "var(--disp)", fontWeight: 800, fontSize: 54, lineHeight: 1, color: isFinal ? "#34d399" : "var(--gold)" }}>
          {daysLeft}
        </div>
        <div style={{ fontSize: 13, color: "var(--tx2)", marginTop: 5 }}>
          {isFinal
            ? (daysLeft === 0 ? "sign-off day — almost home! 🎉" : "days left — almost home! 🎉")
            : "days to sign-off · " + endLabel}
        </div>
      </div>

      {pct !== null && totalDays !== null && dayNum !== null ? (
        <div>
          <div style={{ height: 7, background: "rgba(255,255,255,.07)", borderRadius: 999, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ width: pct + "%", height: "100%", background: isFinal ? "#34d399" : "linear-gradient(90deg,var(--gold),var(--gold2))", borderRadius: 999 }} />
          </div>
          <p style={{ fontSize: 11.5, color: "var(--tx3)", textAlign: "center" }}>
            Day {dayNum} of {totalDays} — {pct}% done{rankLabel ? ", " + rankLabel : ""} ⚓
          </p>
        </div>
      ) : null}
    </div>
  );
}
