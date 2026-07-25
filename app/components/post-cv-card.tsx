import { postMyCv, removeMyCvPost, boostDeckPost } from "@/lib/actions/deck";

const DAY_MS = 24 * 3600 * 1000;

export default function PostCvCard({
  activePost,
}: {
  activePost: { id: string; expires_at: string; boosted_at: string } | null;
}) {
  const cardStyle: React.CSSProperties = {
    background: "linear-gradient(165deg,var(--navy2),var(--ink))",
    border: "1.5px solid var(--line)",
    borderRadius: 18,
    padding: "20px 22px",
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "var(--disp)",
    fontSize: 12.5,
    fontWeight: 700,
    letterSpacing: ".12em",
    textTransform: "uppercase",
    color: "var(--gold)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  const goldBtn: React.CSSProperties = {
    background: "linear-gradient(135deg,var(--gold),var(--gold2))",
    color: "#0b0e13",
    border: "none",
    borderRadius: 11,
    padding: "11px 18px",
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "var(--body)",
    whiteSpace: "nowrap",
  };

  const ghostBtn: React.CSSProperties = {
    background: "transparent",
    color: "var(--tx3)",
    border: "1px solid var(--line2)",
    borderRadius: 11,
    padding: "11px 16px",
    fontWeight: 700,
    fontSize: 12.5,
    cursor: "pointer",
    fontFamily: "var(--body)",
    whiteSpace: "nowrap",
  };

  const liveDot: React.CSSProperties = {
    width: 9,
    height: 9,
    borderRadius: "50%",
    background: "var(--grn)",
    display: "inline-block",
  };

  // ── DURUM: kart canlı ──
  if (activePost) {
    const daysLeft = Math.max(0, Math.ceil((new Date(activePost.expires_at).getTime() - Date.now()) / DAY_MS));
    const canBoost = Date.now() - new Date(activePost.boosted_at).getTime() >= DAY_MS;

    return (
      <div style={cardStyle}>
        <div style={titleStyle}><span style={liveDot}></span>⚓ Your CV is on the main page</div>
        <p style={{ fontSize: 12.5, color: "var(--tx2)", lineHeight: 1.6, marginBottom: 14 }}>
          Live on the Crew Board — <b style={{ color: "var(--tx)" }}>{daysLeft} days left</b>. Boost once a day to jump back to the top and reset your 30 days.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {canBoost ? (
            <form action={boostDeckPost} style={{ display: "inline" }}>
              <input type="hidden" name="postId" value={activePost.id} />
              <input type="hidden" name="backTo" value="/dashboard" />
              <button type="submit" style={goldBtn}>⬆️ Boost to top</button>
            </form>
          ) : (
            <span style={{ fontSize: 12, color: "var(--tx3)", border: "1px dashed var(--line2)", borderRadius: 11, padding: "10px 15px" }}>⬆️ Boosted — next boost tomorrow</span>
          )}
          <a href="/deck" style={{ ...ghostBtn, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>View board →</a>
          <form action={removeMyCvPost} style={{ display: "inline", marginLeft: "auto" }}>
            <button type="submit" style={ghostBtn}>Remove</button>
          </form>
        </div>
      </div>
    );
  }

  // ── DURUM: kart yok — paylaşım formu ──
  return (
    <div style={cardStyle}>
      <div style={titleStyle}>⚓ Post my CV on main page</div>
      <p style={{ fontSize: 12.5, color: "var(--tx2)", lineHeight: 1.6, marginBottom: 14 }}>
        One tap puts your availability card on the homepage — seen by every visiting company. <b style={{ color: "var(--tx)" }}>Live for 30 days</b>, boost to the top once a day.
      </p>
      <form action={postMyCv}>
        <input
          type="text"
          name="note"
          maxLength={120}
          placeholder='Optional note — e.g. "Preferring bulk carriers, ready from September"'
          style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid var(--line2)", borderRadius: 11, padding: "11px 14px", fontSize: 13, color: "var(--tx)", fontFamily: "var(--body)", marginBottom: 12 }}
        />
        <label style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 12, color: "var(--tx2)", lineHeight: 1.5, marginBottom: 14, cursor: "pointer" }}>
          <input type="checkbox" name="showContact" value="1" defaultChecked style={{ marginTop: 2, accentColor: "var(--gold)" }} />
          <span>Show my phone &amp; email on the card <span style={{ color: "var(--tx3)" }}>(uncheck to show &ldquo;Contact via ShipCrewFinder&rdquo; instead)</span></span>
        </label>
        <button type="submit" style={goldBtn}>⚓ Post my CV on main page</button>
      </form>
    </div>
  );
}
