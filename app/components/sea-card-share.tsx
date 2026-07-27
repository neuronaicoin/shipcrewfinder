"use client";

export default function SeaCardShare({
  years,
  vessels,
  rank,
  maxDwt,
}: {
  years: string;
  vessels: number;
  rank: string | null;
  maxDwt: string | null;
}) {
  if (!vessels || vessels < 1) return null;

  const share = () => {
    const params = new URLSearchParams();
    params.set("y", years);
    params.set("v", String(vessels));
    params.set("r", (rank || "SEAFARER").toUpperCase());
    if (maxDwt) params.set("d", maxDwt);
    const url = "https://shipcrewfinder.com/s/seacard?" + params.toString();
    const text = "\u2693 " + years + " years at sea \u00b7 " + vessels + " vessels. My sea service card:\n" + url;
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  };

  return (
    <div
      style={{
        borderRadius: 18,
        padding: "16px 20px",
        background: "linear-gradient(160deg,rgba(251,191,36,.08),var(--ink))",
        border: "1.5px solid var(--line)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--disp)", fontWeight: 800, fontSize: 14.5, marginBottom: 3 }}>
          ⚓ Your Sea Service Card
        </div>
        <p style={{ fontSize: 12.5, color: "var(--tx2)", lineHeight: 1.5 }}>
          {years} years at sea · {vessels} vessel{vessels === 1 ? "" : "s"}
          {maxDwt ? " · up to " + maxDwt + " DWT" : ""} — share it with pride.
        </p>
      </div>
      <button
        type="button"
        onClick={share}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(37,211,102,.13)",
          color: "#25d366",
          border: "1px solid rgba(37,211,102,.4)",
          borderRadius: 10,
          padding: "9px 15px",
          fontWeight: 700,
          fontSize: 12.5,
          cursor: "pointer",
          fontFamily: "var(--body)",
          whiteSpace: "nowrap",
        }}
      >
        📱 Share my card
      </button>
    </div>
  );
}
