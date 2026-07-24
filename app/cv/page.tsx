import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SiteHeader from "@/app/components/site-header";
import CvActions from "@/app/components/cv-actions";
import CvNote from "@/app/components/cv-note";
import { uploadCvPhoto, removeCvPhoto, toggleCvContact, regenerateCvLink } from "@/lib/actions/cv";
import { getSortedCountries } from "@/lib/constants/countries";
import Link from "next/link";

export const metadata = {
  title: "CV Builder — ShipCrewFinder",
};

export default async function CvPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const photoOk = sp.photo;
  const newlink = sp.newlink;
  const error = sp.error;

  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!user) redirect("/login");

  const [
    { data: profile },
    { count: unreadCount },
    { data: sfDetails },
    { data: ytDetails },
    { data: contracts },
    { data: docs },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("user_type, full_name, country, phone, email, photo_url, cv_share_code, cv_show_contact")
      .eq("id", user.id)
      .single(),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false),
    supabase
      .from("seafarer_details")
      .select("rank, years_experience, nationality, languages, english_level, availability, vessel_types")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("yacht_details")
      .select("position, years_experience, languages, english_level, availability")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("sea_contracts")
      .select("vessel_name, vessel_type, dwt, main_engine, rank, sign_on, sign_off")
      .eq("user_id", user.id)
      .order("sign_off", { ascending: false })
      .limit(10),
    supabase
      .from("crew_documents")
      .select("doc_type, name, expiry_date")
      .eq("user_id", user.id)
      .order("expiry_date", { ascending: true, nullsFirst: false }),
  ]);

  const userType =
    (profile?.user_type as "seafarer" | "yacht" | "company" | null) || null;
  if (userType === "company") redirect("/dashboard");

  const details = (sfDetails || ytDetails || {}) as Record<string, unknown>;
  const rank = (details.rank as string) || (details.position as string) || "—";
  const contractList = contracts || [];
  const docList = (docs || []).filter((d) => {
    if (!d.expiry_date) return true;
    return new Date((d.expiry_date as string) + "T00:00:00") >= new Date();
  });

  const countries = getSortedCountries();
  const myCountry = countries.find((c) => c.code === profile?.country);
  const nationality = (details.nationality as string) || profile?.country || "";
  const natCountry = countries.find((c) => c.code === nationality || c.name === nationality);
  const natLabel = natCountry ? natCountry.flag + " " + natCountry.name : (myCountry ? myCountry.flag + " " + myCountry.name : nationality || "—");

  const availLabel = (() => {
    const a = details.availability as string | undefined;
    if (a === "immediate") return "Available now / within 1 month";
    if (a === "1-3_months") return "Available in 1–3 months";
    if (a === "3+_months") return "Available in 3+ months";
    return null;
  })();

  const langs = Array.isArray(details.languages) ? (details.languages as string[]) : [];
  const engLevel = (details.english_level as string) || null;
  const vesselTypes = Array.isArray(details.vessel_types) ? (details.vessel_types as string[]) : [];

  const dayMs = 24 * 3600 * 1000;
  const durOf = (on: string, off: string) => {
    const days = Math.max(0, Math.round((new Date(off + "T00:00:00").getTime() - new Date(on + "T00:00:00").getTime()) / dayMs) + 1);
    const m = Math.floor(days / 30);
    if (m >= 1) return m + "m";
    return days + "d";
  };
  let totalDays = 0;
  contractList.forEach((c) => {
    totalDays += Math.max(0, Math.round((new Date((c.sign_off as string) + "T00:00:00").getTime() - new Date((c.sign_on as string) + "T00:00:00").getTime()) / dayMs) + 1);
  });
  const totalDur = (() => {
    const y = Math.floor(totalDays / 365);
    const m = Math.floor((totalDays % 365) / 30);
    if (y > 0) return y + "Y " + m + "M";
    return m + "M";
  })();

  const period = (on: string, off: string) => {
    const f = (d: string) => {
      const dt = new Date(d + "T00:00:00");
      return String(dt.getMonth() + 1).padStart(2, "0") + "/" + String(dt.getFullYear()).slice(2);
    };
    return f(on) + "–" + f(off);
  };

  const fmtDwtK = (n: number | null) => (n ? (n >= 1000 ? Math.round(n / 1000) + "k" : String(n)) : "");

  const expYear = (d: string | null) =>
    d ? " (" + new Date(d + "T00:00:00").getFullYear() + ")" : "";

  const shareCode = (profile?.cv_share_code as string) || "";
  const shareUrl = "https://shipcrewfinder.com/cv/share/" + shareCode;
  const showContact = profile?.cv_show_contact !== false;
  const photoUrl = (profile?.photo_url as string) || null;
  const firstName = (profile?.full_name || "").split(" ")[0];

  return (
    <>
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --navy:#0d1030;--navy2:#141845;--ink:#050716;
    --gold:#fbbf24;--gold2:#e0a010;--line:rgba(251,191,36,.16);--line2:rgba(255,255,255,.08);
    --tx:#eef4fa;--tx2:#a8bdd2;--tx3:#6b83a0;--grn:#34d399;--red:#f87171;
    --disp:var(--font-bricolage),sans-serif;--body:var(--font-jakarta),sans-serif;
  }
  body.light{
    --navy:#f2f4fb;--navy2:#ffffff;--ink:#ffffff;
    --tx:#0e1730;--tx2:#2e3c5e;--tx3:#57678a;
    --line:rgba(224,160,16,.4);--line2:rgba(15,25,60,.12);--red:#dc2626;
  }
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:900px;margin:0 auto;padding:0 20px}
  .c-hero{position:relative;padding:36px 0 14px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:16px}
  .back:hover{color:var(--gold)}
  h1{font-family:var(--disp);font-size:clamp(1.7rem,4.2vw,2.5rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:8px}
  .sub{font-size:14px;color:var(--tx2);line-height:1.6;max-width:62ch}
  section{padding:14px 0 44px}
  .banner{border-radius:13px;padding:12px 16px;font-size:13px;margin-bottom:14px;border:1px solid}
  .banner.ok{color:var(--grn);border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.08)}
  .banner.err{color:var(--red);border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:16px;padding:16px 18px;margin-bottom:14px}
  .card h3{font-family:var(--disp);font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);margin-bottom:10px}
  .setrow{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .setrow p{font-size:12px;color:var(--tx3);line-height:1.5}
  .setrow b{color:var(--tx);font-size:13px;display:block;font-family:var(--disp)}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border-radius:11px;font-weight:700;font-size:12.5px;cursor:pointer;transition:.18s;border:none;padding:9px 15px;font-family:var(--body);text-decoration:none}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-ghost{color:var(--tx);border:1px solid var(--line2);background:transparent}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
  input[type=file]{color:var(--tx3);font-size:12px;font-family:var(--body)}
  .linkbox{display:flex;align-items:center;gap:9px;flex-wrap:wrap}
  .linkbox code{flex:1 1 220px;min-width:0;border:1px solid var(--line2);background:rgba(255,255,255,.03);border-radius:10px;padding:9px 12px;font-size:11.5px;color:var(--tx2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

  /* ═══ CV (A4 beyaz) ═══ */
  .cv-sheet{background:#ffffff;color:#1a2340;border-radius:10px;overflow:hidden;max-width:794px;margin:0 auto 16px;box-shadow:0 24px 60px rgba(0,0,0,.45)}
  .cv-head{display:flex;gap:18px;align-items:center;padding:26px 30px 20px;border-bottom:3px solid #e0a010}
  .cv-photo{width:92px;height:112px;border-radius:7px;object-fit:cover;flex-shrink:0;border:1px solid #dfe5f0}
  .cv-photo-empty{width:92px;height:112px;border-radius:7px;background:#eef1f8;flex-shrink:0;display:grid;place-items:center;font-size:30px;color:#9aa7c4;border:1px dashed #c9d3e6}
  .cv-name{font-family:var(--disp);font-size:25px;font-weight:800;color:#0d1030;letter-spacing:.01em;line-height:1.1}
  .cv-rank{font-family:var(--disp);font-size:14.5px;font-weight:700;color:#b8860b;margin-top:3px;letter-spacing:.04em}
  .cv-sub{font-size:11.5px;color:#5a6785;margin-top:7px;line-height:1.7}
  .cv-sub .av{color:#0e9f6e;font-weight:700}
  .cv-body{padding:16px 30px 22px}
  .cv-sec{margin-bottom:15px}
  .cv-sec h4{font-family:var(--disp);font-size:11px;font-weight:800;letter-spacing:.11em;color:#0d1030;border-bottom:1.5px solid #e5e9f2;padding-bottom:5px;margin-bottom:8px}
  .cv-sec h4 small{font-weight:600;color:#9aa7c4;letter-spacing:.02em;text-transform:none;font-size:9.5px}
  table.cv-tab{width:100%;border-collapse:collapse;font-size:11px;color:#3a4664}
  table.cv-tab th{text-align:left;font-size:9px;font-weight:700;letter-spacing:.06em;color:#9aa7c4;padding:0 8px 5px 0}
  table.cv-tab th:last-child{text-align:right;padding-right:0}
  table.cv-tab td{padding:4px 8px 4px 0;border-top:1px solid #f0f3f9;vertical-align:top}
  table.cv-tab td:last-child{text-align:right;white-space:nowrap;padding-right:0;color:#5a6785}
  table.cv-tab td.rk{font-weight:800;color:#0d1030;white-space:nowrap}
  .cv-line{font-size:11.5px;color:#3a4664;line-height:1.75}
  .cv-foot{text-align:center;font-size:9.5px;color:#9aa7c4;padding:0 30px 18px}
  .cv-foot b{color:#b8860b}

  /* ═══ PRINT: sadece CV ═══ */
  @media print{
    body{background:#ffffff !important}
    .no-print,header,footer,.c-hero,.card,.banner,.gtabs{display:none !important}
    section{padding:0 !important}
    .wrap{max-width:none;padding:0}
    .cv-sheet{box-shadow:none;border-radius:0;max-width:none}
    @page{margin:8mm}
  }
  @media(max-width:560px){
    .cv-head{padding:18px 16px 14px;gap:12px}
    .cv-body{padding:12px 16px 16px}
    .cv-name{font-size:19px}
    .cv-photo,.cv-photo-empty{width:70px;height:86px}
    table.cv-tab{font-size:9.5px}
    .cv-foot{padding:0 16px 14px}
  }
`}</style>

      <CvNote />

      <SiteHeader
        isLoggedIn={true}
        userType={userType}
        unreadCount={unreadCount || 0}
        active={null}
      />
      <div className="c-hero no-print">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/dashboard" className="back">← Back to dashboard</Link>
          <h1>My <span style={{ color: "var(--gold)" }}>CV</span></h1>
          <p className="sub">
            Built automatically from your profile, sea time log and document vault. Download as PDF or share a live link — it updates itself as your career does.
          </p>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="no-print">
            {photoOk === "1" ? <div className="banner ok">Photo updated.</div> : null}
            {newlink === "1" ? <div className="banner ok">New share link generated — the old link no longer works.</div> : null}
            {error === "photo_too_large" ? <div className="banner err">Photo too large — maximum 2 MB.</div> : null}
            {error === "photo_type" ? <div className="banner err">Only JPG or PNG photos are accepted.</div> : null}
            {error === "photo_failed" ? <div className="banner err">Upload failed. Please try again.</div> : null}
            {error === "nofile" ? <div className="banner err">Please choose a photo file first.</div> : null}

            <div style={{ marginBottom: 14 }}>
              <CvActions shareUrl={shareUrl} />
            </div>
          </div>

          {/* ═══ A4 CV ═══ */}
          <div className="cv-sheet" id="cv-sheet">
            <div className="cv-head">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" className="cv-photo" />
              ) : (
                <div className="cv-photo-empty">👤</div>
              )}
              <div style={{ minWidth: 0 }}>
                <div className="cv-name">{(profile?.full_name as string) || "Your Name"}</div>
                <div className="cv-rank">{rank.toUpperCase()}{userType === "seafarer" ? " · MERCHANT MARINE" : ""}</div>
                <div className="cv-sub">
                  {natLabel}
                  {availLabel ? <> · <span className="av">● {availLabel}</span></> : null}
                  <br />
                  {profile?.phone ? <>📱 {profile.phone as string} · </> : null}
                  ✉ {profile?.email as string}
                  {profile?.phone ? " · WhatsApp ✓" : ""}
                </div>
              </div>
            </div>

            <div className="cv-body">
              {/* SEA SERVICE */}
              <div className="cv-sec">
                <h4>SEA SERVICE{totalDays > 0 ? " — " + totalDur + " TOTAL" : ""} <small>· from Sea Time Tracker</small></h4>
                {contractList.length === 0 ? (
                  <p className="cv-line" style={{ color: "#9aa7c4" }}>
                    No contracts logged yet — add your voyages in the Sea Time Tracker and they appear here automatically.
                  </p>
                ) : (
                  <table className="cv-tab">
                    <thead>
                      <tr>
                        <th>RANK</th>
                        <th>VESSEL</th>
                        <th>TYPE / DWT</th>
                        <th>MAIN ENGINE</th>
                        <th>PERIOD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contractList.map((c, i) => (
                        <tr key={i}>
                          <td className="rk">{c.rank as string}</td>
                          <td>{c.vessel_name as string}</td>
                          <td>
                            {(c.vessel_type as string).replace(" Carrier", "").replace(" Ship", "")}
                            {c.dwt ? " " + fmtDwtK(c.dwt as number) : ""}
                          </td>
                          <td>{(c.main_engine as string) || "—"}</td>
                          <td>
                            {period(c.sign_on as string, c.sign_off as string)} · {durOf(c.sign_on as string, c.sign_off as string)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* CERTIFICATES */}
              <div className="cv-sec">
                <h4>CERTIFICATES <small>· from Document Vault ✓</small></h4>
                {docList.length === 0 ? (
                  <p className="cv-line" style={{ color: "#9aa7c4" }}>
                    No valid documents in your vault yet — add them and they list here with expiry years.
                  </p>
                ) : (
                  <p className="cv-line">
                    {docList.map((d, i) => (
                      <span key={i}>
                        {i > 0 ? " · " : ""}
                        {d.name as string}{expYear(d.expiry_date as string | null)}
                      </span>
                    ))}
                  </p>
                )}
              </div>

              {/* LANGUAGES & EXPERIENCE */}
              <div className="cv-sec" style={{ marginBottom: 6 }}>
                <h4>LANGUAGES {vesselTypes.length > 0 ? "& VESSEL EXPERIENCE" : ""}</h4>
                <p className="cv-line">
                  {engLevel ? "English (" + engLevel + ")" : null}
                  {langs.filter((l) => l.toLowerCase() !== "english").map((l) => " · " + l)}
                  {vesselTypes.length > 0 ? (
                    <> — {vesselTypes.join(" · ")}</>
                  ) : null}
                </p>
              </div>
            </div>

            <div className="cv-foot">
              ⚓ Verified maritime profile — <b>shipcrewfinder.com/cv/share/{shareCode}</b>
            </div>
          </div>

          {/* ═══ Ayarlar ═══ */}
          <div className="no-print">
            <div className="card">
              <h3>Photo</h3>
              <div className="setrow">
                <p>
                  <b>Passport-style photo</b>
                  JPG or PNG · max 2 MB · appears top-left on your CV.
                </p>
                <div style={{ display: "flex", gap: 9, alignItems: "center", flexWrap: "wrap" }}>
                  <form action={uploadCvPhoto} style={{ display: "flex", gap: 9, alignItems: "center", flexWrap: "wrap" }}>
                    <input type="file" name="photo" accept="image/jpeg,image/png" required />
                    <button type="submit" className="btn btn-gold">Upload</button>
                  </form>
                  {photoUrl ? (
                    <form action={removeCvPhoto}>
                      <button type="submit" className="btn btn-ghost">Remove</button>
                    </form>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Shared link privacy</h3>
              <div className="setrow">
                <p>
                  <b>Show contact on shared CV</b>
                  {showContact
                    ? "Phone & email are visible to anyone with your link."
                    : "Phone & email are hidden on the public link — PDF still includes them."}
                </p>
                <form action={toggleCvContact}>
                  <input type="hidden" name="show" value={showContact ? "0" : "1"} />
                  <button type="submit" className={showContact ? "btn btn-gold" : "btn btn-ghost"}>
                    {showContact ? "ON — tap to hide" : "OFF — tap to show"}
                  </button>
                </form>
              </div>
            </div>

            <div className="card">
              <h3>Share link</h3>
              <div className="linkbox">
                <code>shipcrewfinder.com/cv/share/{shareCode}</code>
                <form action={regenerateCvLink}>
                  <button type="submit" className="btn btn-ghost">🔄 New link</button>
                </form>
              </div>
              <p style={{ fontSize: 11, color: "var(--tx3)", marginTop: 9, lineHeight: 1.6 }}>
                Anyone with this link sees your CV — no login needed. Generating a new link kills the old one instantly. Hi {firstName}: share it on WhatsApp, in applications, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="no-print" style={{ borderTop: "1px solid var(--line2)", padding: "30px 0", background: "var(--ink)", textAlign: "center", fontSize: 12.5, color: "var(--tx3)" }}>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/seatime" style={{ color: "var(--gold)", textDecoration: "none" }}>Sea Time</Link> ·{" "}
          <Link href="/vault" style={{ color: "var(--gold)", textDecoration: "none" }}>Vault</Link> ·{" "}
          <Link href="/dashboard" style={{ color: "var(--gold)", textDecoration: "none" }}>Dashboard</Link>
        </div>
      </footer>
    </>
  );
}
