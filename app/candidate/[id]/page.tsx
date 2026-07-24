import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import SiteHeader from "@/app/components/site-header";
import Link from "next/link";

export const metadata = {
  title: "Candidate — ShipCrewFinder",
};

// Plan → aylık tam-CV limiti (null = sınırsız)
const PLAN_LIMITS: Record<string, number | null> = {
  founding: 100,
  pro: 100,
  fleet: null,
};

export default async function CandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!user) redirect("/login");

  // Only companies
  const [{ data: me }, { count: unreadCount }] = await Promise.all([
    supabase.from("profiles").select("user_type, plan").eq("id", user.id).single(),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false),
  ]);
  if (!me || me.user_type !== "company") redirect("/dashboard");

  const myPlan = (me.plan as string) || "founding";
  const limit = PLAN_LIMITS[myPlan] ?? 100;

  // Candidate profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, user_type, full_name, email, phone, country, visibility, cv_share_code")
    .eq("id", id)
    .single();

  if (!profile || !["seafarer", "yacht"].includes(profile.user_type)) {
    notFound();
  }

  // Hidden profiles are not viewable (crew privacy — kept)
  if (profile.visibility === "hidden") {
    notFound();
  }

  // Did this candidate block the company? (crew blocking — kept)
  const { data: blocked } = await supabase
    .from("blocked_companies")
    .select("id")
    .eq("user_id", id)
    .eq("company_id", user.id)
    .maybeSingle();
  if (blocked) notFound();

  // ── Credit system ─────────────────────────────────────────
  const monthKey = new Date().toISOString().slice(0, 7); // "2026-07"

  // Already viewed this crew this month? (re-opening is free)
  const { data: existingView } = await supabase
    .from("company_profile_views")
    .select("id")
    .eq("company_id", user.id)
    .eq("crew_id", id)
    .eq("month_key", monthKey)
    .maybeSingle();

  // How many distinct CVs viewed this month?
  const { count: usedRaw } = await supabase
    .from("company_profile_views")
    .select("id", { count: "exact", head: true })
    .eq("company_id", user.id)
    .eq("month_key", monthKey);
  let used = usedRaw || 0;

  let unlocked = false;
  if (existingView) {
    unlocked = true;
  } else if (limit === null || used < limit) {
    // Spend one credit (unique constraint makes double-insert harmless)
    const { error: insErr } = await supabase.from("company_profile_views").insert({
      company_id: user.id,
      crew_id: id,
      month_key: monthKey,
    });
    if (!insErr) used += 1;
    unlocked = true;
  }
  // else: limit reached → locked view (rank + country only)

  // Details
  let details: Record<string, unknown> | null = null;
  if (profile.user_type === "seafarer") {
    const { data } = await supabase
      .from("seafarer_details")
      .select("*")
      .eq("id", id)
      .single();
    details = data;
  } else {
    const { data } = await supabase
      .from("yacht_details")
      .select("*")
      .eq("id", id)
      .single();
    details = data;
  }

  const roleTitle =
    (details?.rank as string) ||
    (details?.position as string) ||
    "Maritime Professional";

  const expLabel = (() => {
    const n = details?.years_experience as number | null | undefined;
    if (n === undefined || n === null) return "—";
    if (n <= 1) return "0–1 years";
    if (n <= 3) return "1–3 years";
    return "3+ years";
  })();

  const availLabel = (() => {
    const v = details?.availability as string | null | undefined;
    if (!v) return null;
    if (v === "immediate") return "Available within 1 month";
    if (v === "1-3_months") return "Available in 1–3 months";
    if (v === "3+_months") return "Available in 3+ months";
    return v;
  })();

  const languages = Array.isArray(details?.languages)
    ? (details?.languages as string[])
    : [];

  const displayName = unlocked ? profile.full_name || "Unnamed" : "Profile Locked";
  const counterText =
    limit === null ? "Unlimited plan" : "Views this month: " + used + "/" + limit;

  const cvUrl = (details?.cv_url as string) || "";
  const scfCvCode = (profile.cv_share_code as string) || "";
  return (
    <>
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --navy:#0d1030;--navy2:#141845;--ink:#050716;
    --gold:#fbbf24;--gold2:#e0a010;--line:rgba(251,191,36,.16);--line2:rgba(255,255,255,.08);
    --tx:#eef4fa;--tx2:#a8bdd2;--tx3:#6b83a0;--grn:#34d399;
    --disp:var(--font-bricolage),sans-serif;--body:var(--font-jakarta),sans-serif;
  }
  body.light{
    --navy:#f2f4fb;--navy2:#ffffff;--ink:#ffffff;
    --tx:#0e1730;--tx2:#2e3c5e;--tx3:#57678a;
    --line:rgba(224,160,16,.4);--line2:rgba(15,25,60,.12);
  }
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:760px;margin:0 auto;padding:0 20px}
  .cd-hero{position:relative;padding:34px 0 8px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .hrow{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s}
  .back:hover{color:var(--gold)}
  .counter{font-size:11.5px;font-weight:800;color:var(--gold);border:1px solid rgba(251,191,36,.3);background:rgba(251,191,36,.08);border-radius:9px;padding:6px 13px;white-space:nowrap}
  section{padding:10px 0 44px}
  .idcard{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1.5px solid var(--line);border-radius:20px;padding:26px;margin-bottom:16px}
  .idrow{display:flex;align-items:flex-start;gap:18px;flex-wrap:wrap}
  .avatar{flex-shrink:0;width:70px;height:70px;border-radius:18px;background:rgba(251,191,36,.13);border:1px solid rgba(251,191,36,.3);display:grid;place-items:center;font-family:var(--disp);font-weight:800;font-size:27px;color:var(--gold)}
  .tag{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);background:rgba(251,191,36,.09);border:1px solid var(--line);border-radius:8px;padding:4px 11px;margin-bottom:8px}
  h1{font-family:var(--disp);font-size:clamp(1.5rem,3.8vw,2.1rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;word-break:break-word}
  .role{color:var(--gold);font-weight:700;font-size:14px;margin-top:5px}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:22px 24px;margin-bottom:16px}
  .card h2{font-family:var(--disp);font-size:17px;font-weight:800;margin-bottom:10px}
  .rows{display:flex;flex-direction:column}
  .row{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:11px 0;border-bottom:1px solid var(--line2);font-size:13.5px}
  .row:last-child{border-bottom:none}
  .row span{color:var(--tx3)}
  .row b,.row a{font-weight:600;text-align:right;word-break:break-all;min-width:0}
  .row a{color:var(--gold);text-decoration:none}
  .row a:hover{text-decoration:underline}
  .blur{filter:blur(4px);user-select:none;color:var(--tx2)}
  .scvbtn{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;border:1.5px solid var(--line);background:rgba(251,191,36,.07);border-radius:14px;padding:14px 16px;margin-top:16px}
  .scvbtn .si{display:flex;gap:10px;align-items:center;min-width:0}
  .scvbtn .sic{font-size:20px;flex-shrink:0}
  .scvbtn b{font-family:var(--disp);font-size:13.5px;display:block}
  .scvbtn p{font-size:11.5px;color:var(--tx3);margin-top:1px;line-height:1.5}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:12px 22px;font-family:var(--body)}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-gold:hover{transform:translateY(-2px)}
  .btn-ghost{color:var(--tx);border:1px solid var(--line2);background:transparent}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
  .lock{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1.5px solid var(--line);border-radius:20px;padding:32px 26px;text-align:center}
  .lock .lic{width:52px;height:52px;margin:0 auto 16px;border-radius:15px;background:rgba(251,191,36,.13);border:1px solid rgba(251,191,36,.3);display:grid;place-items:center;font-size:21px}
  .lock h2{font-family:var(--disp);font-size:20px;font-weight:800;margin-bottom:9px}
  .lock p{font-size:13px;color:var(--tx2);line-height:1.65;max-width:46ch;margin:0 auto 8px}
  .lock .fine{font-size:11.5px;color:var(--tx3);margin-bottom:20px}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader
        isLoggedIn={true}
        userType="company"
        unreadCount={unreadCount || 0}
        active="browse"
      />
      <div className="cd-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <div className="hrow">
            <Link href="/browse" className="back">← Back to Browse</Link>
            <span className="counter">{counterText}</span>
          </div>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {/* Identity card */}
          <div className="idcard">
            <div className="idrow">
              <div className="avatar">
                {unlocked ? (profile.full_name || "U").charAt(0).toUpperCase() : "🔒"}
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <span className="tag">
                  {profile.user_type === "yacht" ? "Yacht Crew" : "Ship Crew"}
                </span>
                <h1>{displayName}</h1>
                <div className="role">{roleTitle}</div>
              </div>
            </div>
          </div>

          {/* Professional details */}
          <div className="card">
            <h2>Professional Details</h2>
            <div className="rows">
              {/* Rank + Country: her zaman görünür (kilitliyken de) */}
              <div className="row">
                <span>{profile.user_type === "yacht" ? "Position" : "Rank"}</span>
                <b>{roleTitle}</b>
              </div>
              <div className="row">
                <span>Country</span>
                <b>{(details?.nationality as string) || profile.country || "—"}</b>
              </div>

              {unlocked ? (
                <>
                  <div className="row">
                    <span>Experience</span>
                    <b>{expLabel}</b>
                  </div>
                  {languages.length > 0 ? (
                    <div className="row">
                      <span>Languages</span>
                      <b>{languages.join(", ")}</b>
                    </div>
                  ) : null}
                  <div className="row">
                    <span>Availability</span>
                    <b style={{ color: "var(--grn)" }}>{availLabel || "—"}</b>
                  </div>
                </>
              ) : (
                <>
                  {/* Kilitli: bulanık placeholder satırları */}
                  <div className="row">
                    <span>Experience</span>
                    <b className="blur">3+ years</b>
                  </div>
                  <div className="row">
                    <span>Languages</span>
                    <b className="blur">English, ······</b>
                  </div>
                  <div className="row">
                    <span>Availability</span>
                    <b className="blur">Available ······</b>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Contact & CV veya kilit ekranı */}
          {unlocked ? (
            <div className="card">
              <h2>Contact &amp; Documents</h2>
              <div className="rows">
                <div className="row">
                  <span>Email</span>
                  <b>{profile.email || "—"}</b>
                </div>
                <div className="row">
                  <span>Phone</span>
                  <b>{profile.phone || "—"}</b>
                </div>
                <div className="row">
                  <span>Uploaded CV</span>
                  {cvUrl ? (
                    <a href={cvUrl} target="_blank" rel="noopener noreferrer">View CV</a>
                  ) : (
                    <b>Not uploaded</b>
                  )}
                </div>
              </div>

              {scfCvCode ? (
                <div className="scvbtn">
                  <div className="si">
                    <span className="sic">📄</span>
                    <div style={{ minWidth: 0 }}>
                      <b>SCF Verified CV</b>
                      <p>Live professional CV — sea service log, valid certificates and availability, always up to date.</p>
                    </div>
                  </div>
                  
                    href={"/cv/share/" + scfCvCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-gold"
                  >
                    View SCF CV →
                  </a>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="lock">
              <div className="lic">🔒</div>
              <h2>Monthly view limit reached</h2>
              <p>
                You&apos;ve used {limit === null ? "" : "all " + limit} full profile views for this
                month ({counterText}). This profile shows rank and country only.
              </p>
              <p className="fine">
                Your credits reset at the start of next month — or upgrade to Fleet for unlimited views.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/contact" className="btn btn-gold">Upgrade to Fleet — Unlimited</Link>
                <Link href="/browse" className="btn btn-ghost">Back to Browse</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/browse">Search Crew</Link> ·{" "}
          <Link href="/jobs/mine">My Job Posts</Link> · <Link href="/dashboard">Dashboard</Link>
        </div>
      </footer>
    </>
  );
}
