import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SiteHeader from "@/app/components/site-header";
import Link from "next/link";

export const metadata = {
  title: "My Profile — ShipCrewFinder",
};

export default async function MyProfilePage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  if (!user) {
    redirect("/login");
  }

  const [
    { data: profile },
    { data: seafarerDetails },
    { data: yachtDetails },
    { data: companyDetails },
    { count: unreadCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("seafarer_details").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("yacht_details").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("company_details").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false),
  ]);

  if (!profile) {
    redirect("/dashboard");
  }

  let detailsData: Record<string, unknown> | null = null;
  if (profile.user_type === "seafarer") detailsData = seafarerDetails;
  else if (profile.user_type === "yacht") detailsData = yachtDetails;
  else if (profile.user_type === "company") detailsData = companyDetails;

  const isCrew =
    profile.user_type === "seafarer" || profile.user_type === "yacht";

  const accountTypeLabel =
    profile.user_type === "company"
      ? "Company"
      : profile.user_type === "yacht"
      ? "Yacht Crew"
      : "Ship Crew";

  const onboardingUrl =
    profile.user_type === "company"
      ? "/onboarding/company/step-1"
      : "/onboarding/crew/step-1";

  const experienceLabel = (() => {
    const y = detailsData?.years_experience as number | undefined | null;
    if (y === undefined || y === null) return null;
    if (y <= 1) return "0–1 years";
    if (y <= 3) return "1–3 years";
    return "3+ years";
  })();

  const availabilityLabel = (() => {
    const a = detailsData?.availability as string | undefined | null;
    if (!a) return null;
    if (a === "immediate") return "Available within 1 month";
    if (a === "1-3_months") return "Available in 1–3 months";
    if (a === "3+_months") return "Available in 3+ months";
    return a;
  })();

  const languages = Array.isArray(detailsData?.languages)
    ? (detailsData?.languages as string[])
    : [];

  const hiringRanks = Array.isArray(detailsData?.hiring_for_ranks)
    ? (detailsData?.hiring_for_ranks as string[])
    : [];

  const fleetTypes = Array.isArray(detailsData?.fleet_types)
    ? (detailsData?.fleet_types as string[])
    : [];

  const displayName = profile.full_name || "Your Profile";
  const initial = (profile.full_name || user.email || "U")
    .charAt(0)
    .toUpperCase();

  const isPublic = profile.visibility === "public";

  const cvUrl = (detailsData?.cv_url as string) || "";
  const webRaw = (detailsData?.website as string) || "";
  const webUrl = webRaw
    ? (webRaw.startsWith("http") ? webRaw : "https://" + webRaw)
    : "";

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
  .wrap{max-width:820px;margin:0 auto;padding:0 20px}
  .pm-hero{position:relative;padding:34px 0 8px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:18px}
  .back:hover{color:var(--gold)}
  section{padding:14px 0 44px}
  .idcard{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1.5px solid var(--line);border-radius:20px;padding:26px;margin-bottom:16px}
  .idrow{display:flex;align-items:flex-start;gap:18px;flex-wrap:wrap}
  .avatar{flex-shrink:0;width:72px;height:72px;border-radius:18px;background:rgba(251,191,36,.13);border:1px solid rgba(251,191,36,.3);display:grid;place-items:center;font-family:var(--disp);font-weight:800;font-size:28px;color:var(--gold)}
  .tag{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);background:rgba(251,191,36,.09);border:1px solid var(--line);border-radius:8px;padding:4px 11px;margin-bottom:8px}
  h1{font-family:var(--disp);font-size:clamp(1.5rem,3.8vw,2.2rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;word-break:break-word}
  .vis{display:flex;align-items:center;gap:9px;margin-top:9px;flex-wrap:wrap}
  .pill{display:inline-block;padding:3px 10px;border-radius:999px;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;border:1px solid}
  .pill.ok{color:var(--grn);border-color:rgba(52,211,153,.35);background:rgba(52,211,153,.08)}
  .pill.off{color:var(--tx3);border-color:var(--line2);background:rgba(255,255,255,.03)}
  .vnote{font-size:11.5px;color:var(--tx3)}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:11px 19px;font-family:var(--body)}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-gold:hover{transform:translateY(-2px)}
  .btn-ghost{color:var(--tx);border:1px solid var(--line2);background:transparent}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:22px 24px;margin-bottom:16px}
  .card h2{font-family:var(--disp);font-size:17px;font-weight:800;margin-bottom:10px}
  .rows{display:flex;flex-direction:column}
  .row{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:11px 0;border-bottom:1px solid var(--line2);font-size:13.5px}
  .row:last-child{border-bottom:none}
  .row span{color:var(--tx3)}
  .row b,.row a{font-weight:600;text-align:right;word-break:break-all;min-width:0}
  .row a{color:var(--gold);text-decoration:none}
  .row a:hover{text-decoration:underline}
  .about{font-size:13px;color:var(--tx2);line-height:1.7;margin-top:12px;padding-top:12px;border-top:1px solid var(--line2)}
  .fine{font-size:11.5px;color:var(--tx3);margin-top:12px;line-height:1.5}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader
        isLoggedIn={true}
        userType={profile.user_type as "seafarer" | "yacht" | "company" | null}
        unreadCount={unreadCount || 0}
        active={null}
      />
      <div className="pm-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/dashboard" className="back">← Back to dashboard</Link>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {/* Identity card */}
          <div className="idcard">
            <div className="idrow">
              <div className="avatar">{initial}</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <span className="tag">{accountTypeLabel}</span>
                <h1>{displayName}</h1>
                <div className="vis">
                  <span className={"pill " + (isPublic ? "ok" : "off")}>
                    {isPublic ? "Public" : "Hidden"}
                  </span>
                  <span className="vnote">
                    {isPublic ? "Visible to verified companies" : "Not visible in search"}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <Link href={onboardingUrl} className="btn btn-ghost">Edit Profile</Link>
            </div>
          </div>

          {/* Crew details */}
          {isCrew ? (
            <div className="card">
              <h2>Professional Details</h2>
              <div className="rows">
                <div className="row">
                  <span>{profile.user_type === "yacht" ? "Position" : "Rank"}</span>
                  <b>{(detailsData?.rank as string) || (detailsData?.position as string) || "—"}</b>
                </div>
                <div className="row">
                  <span>Experience</span>
                  <b>{experienceLabel || "—"}</b>
                </div>
                <div className="row">
                  <span>Nationality</span>
                  <b>{(detailsData?.nationality as string) || profile.country || "—"}</b>
                </div>
                <div className="row">
                  <span>Languages</span>
                  <b>{languages.length > 0 ? languages.join(", ") : "—"}</b>
                </div>
                {detailsData?.english_level ? (
                  <div className="row">
                    <span>English Level</span>
                    <b>{detailsData.english_level as string}</b>
                  </div>
                ) : null}
                <div className="row">
                  <span>Availability</span>
                  <b>{availabilityLabel || "—"}</b>
                </div>
                <div className="row">
                  <span>CV</span>
                  {cvUrl ? (
                    <a href={cvUrl} target="_blank" rel="noopener noreferrer">View CV</a>
                  ) : (
                    <b>Not uploaded</b>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* Company details */}
          {profile.user_type === "company" ? (
            <div className="card">
              <h2>Company Details</h2>
              <div className="rows">
                <div className="row">
                  <span>Company Type</span>
                  <b>{(detailsData?.company_type as string) || "—"}</b>
                </div>
                <div className="row">
                  <span>Headquarters</span>
                  <b>{(detailsData?.headquarters_country as string) || "—"}</b>
                </div>
                {webUrl ? (
                  <div className="row">
                    <span>Website</span>
                    <a href={webUrl} target="_blank" rel="noopener noreferrer">{webRaw}</a>
                  </div>
                ) : null}
                <div className="row">
                  <span>Hiring For</span>
                  <b>{hiringRanks.length > 0 ? hiringRanks.join(", ") : "—"}</b>
                </div>
                <div className="row">
                  <span>Fleet Types</span>
                  <b>{fleetTypes.length > 0 ? fleetTypes.join(", ") : "—"}</b>
                </div>
              </div>
              {detailsData?.description ? (
                <div className="about">{detailsData.description as string}</div>
              ) : null}
            </div>
          ) : null}

          {/* Contact */}
          <div className="card">
            <h2>Contact</h2>
            <div className="rows">
              <div className="row">
                <span>Email</span>
                <b>{user.email}</b>
              </div>
              <div className="row">
                <span>Phone</span>
                <b>{profile.phone || "—"}</b>
              </div>
            </div>
            <p className="fine">
              Your contact details are only shared with companies after they unlock your profile.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/dashboard">Dashboard</Link> ·{" "}
          <Link href="/jobs">Jobs</Link> · <Link href="/salary">Salary Index</Link>
        </div>
      </footer>
    </>
  );
}
