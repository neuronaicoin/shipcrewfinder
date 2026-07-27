"use client";

export default function SalaryShare({
  rank,
  salary,
  vessel,
}: {
  rank: string;
  salary: string;
  vessel?: string;
}) {
  const share = () => {
    const params = new URLSearchParams();
    params.set("r", rank.toUpperCase());
    params.set("s", salary);
    if (vessel) params.set("v", vessel);
    const url = "https://shipcrewfinder.com/s/salary?" + params.toString();
    const text = "\uD83D\uDCB0 " + rank.toUpperCase() + " salary 2026: " + salary + "\n" + url;
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  };

  return (
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
        padding: "8px 14px",
        fontWeight: 700,
        fontSize: 12.5,
        cursor: "pointer",
        fontFamily: "var(--body)",
        whiteSpace: "nowrap",
      }}
    >
      📱 Share salary card
    </button>
  );
}
