import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import SiteHeader from "@/app/components/site-header";
import InviteCard from "@/app/components/invite-card";
import CountdownCard from "@/app/components/countdown-card";
import CareersLinkCard from "@/app/components/careers-link-card";
import PostCvCard from "@/app/components/post-cv-card";
import SeaCardShare from "@/app/components/sea-card-share";
import MyApplications from "@/app/components/my-applications";
import Link from "next/link";

export const metadata = {
  title: "Your Account — ShipCrewFinder",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  if (!user) {
    redirect("/login");
  }

  if (sp.read === "1") {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
  }

  const [
    { data: profile },
    { data: seafarerDetails },
    { data: yachtDetails },
    { data: companyDetails },
    { count: unreadCount },
    { data: notifications },
    { data: vaultDocs },
    { data: myDeckPosts },
    { data: myConvs },
    { data: seaContracts },
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
    supabase
      .from("notifications")
      .select("id, type, title, message, link, read, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("crew_documents")
      .select("expiry_date")
      .eq("user_id", user.id),
    supabase
      .from("deck_posts")
      .select("id, post_type, expires_at, boosted_at")
      .eq("user_id", user.id),
    supabase
      .from("conversations")
      .select("id, last_message_at, last_message_preview")
      .or("p1.eq." + user.id + ",p2.eq." + user.id)
      .order("last_message_at", { ascending: false })
      .limit(3),
    supabase
      .from("sea_contracts")
      .select("start_date, end_date, dwt")
      .eq("user_id", user.id),
  ]);

  const convIds = (myConvs || []).map((c) => c.id as string);
  let msgUnread = 0;
  if (convIds.length > 0) {
    const { data: unreadRows } = await supabase
      .from("messages")
      .select("id, sender_id")
      .in("conversation_id", convIds)
      .is("read_at", null);
    msgUnread = (unreadRows || []).filter((m) => m.sender_id !== user.id).length;
  }
  const lastConvPreview = ((myConvs || [])[0]?.last_message_preview as string) || null;

  let detailsData: Record<string, unknown> | null = null;

  if (profile?.user_type === "seafarer") {
    detailsData = seafarerDetails;
  } else if (profile?.user_type === "yacht") {
    detailsData = yachtDetails;
  } else if (profile?.user_type === "company") {
    detailsData = companyDetails;
  }

  let completion = 20;

  if (profile?.user_type === "seafarer" || profile?.user_type === "yacht") {
    if (detailsData?.rank || detailsData?.position) completion += 15;
    if (detailsData?.years_experience !== undefined && detailsData?.years_experience !== null) completion += 15;
    if (detailsData?.nationality || profile?.country) completion += 15;
    if (detailsData?.cv_url) completion += 15;
    if (detailsData?.availability) completion += 10;
    if (profile?.phone) completion += 10;
  } else if (profile?.user_type === "company") {
    if (detailsData?.headquarters_country) completion += 20;
    if (detailsData?.company_type) completion += 20;
    if (detailsData?.hiring_for_ranks && Array.isArray(detailsData.hiring_for_ranks) && detailsData.hiring_for_ranks.length > 0) completion += 20;
    if (detailsData?.company_logo_url) completion += 10;
    if (detailsData?.description) completion += 10;
  }

  completion = Math.min(completion, 100);
  const isComplete = completion === 100;

  const missingItems: string[] = [];
  if (profile?.user_type === "seafarer" || profile?.user_type === "yacht") {
    if (!(detailsData?.rank || detailsData?.position)) missingItems.push("Rank");
    if (detailsData?.years_experience === undefined || detailsData?.years_experience === null) missingItems.push("Experience");
    if (!(detailsData?.nationality || profile?.country)) missingItems.push("Nationality");
    if (!detailsData?.cv_url) missingItems.push("CV upload");
    if (!detailsData?.availability) missingItems.push("Availability");
    if (!profile?.phone) missingItems.push("Phone number");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMs = 24 * 3600 * 1000;
  let vaultWarn = 0;
  (vaultDocs || []).forEach((d) => {
    if (!d.expiry_date) return;
    const days = Math.round((new Date((d.expiry_date as string) + "T00:00:00").getTime() - today.getTime()) / dayMs);
    if (days <= 90) vaultWarn++;
  });
  const vaultCount = (vaultDocs || []).length;

  const onboardingUrl =
    profile?.user_type === "company"
      ? "/onboarding/company/step-1"
      : "/onboarding/crew/step-1";

  const accountTypeLabel =
    profile?.user_type === "company"
      ? "Company Account"
      : profile?.user_type === "yacht"
      ? "Yacht Crew"
      : "Ship Crew";

  const isCrew =
    profile?.user_type === "seafarer" || profile?.user_type === "yacht";

  const isCompany = profile?.user_type === "company";

  const now = Date.now();
  const activeCvPost = (myDeckPosts || []).find(
    (p) => p.post_type === "crew" && new Date(p.expires_at as string).getTime() > now
  ) as { id: string; expires_at: string; boosted_at: string } | undefined;

  let appTotal = 0;
  let appNew = 0;
  let appLink = "/jobs/mine";
  if (isCompany) {
    const { data: myApps } = await supabase
      .from("job_applications")
      .select("id, job_id, status, created_at")
      .eq("company_id", user.id)
      .order("created_at", { ascending: false });
    const list = myApps || [];
    appTotal = list.length;
    appNew = list.filter((a) => ((a.status as string) || "new") === "new").length;
    if (list.length > 0) {
      appLink = "/jobs/" + (list[0].job_id as string) + "/applications";
    }
  }

  const careersSlug = isCompany ? ((detailsData?.careers_slug as string) || "") : "";

  const rankLabel =
    (detailsData?.rank as string) || (detailsData?.position as string) || null;

  const contractEnd = isCrew ? ((detailsData?.contract_end_date as string) || null) : null;
  const contractStart = isCrew ? ((detailsData?.contract_start_date as string) || null) : null;

  let seaYears = "0";
  let seaVessels = 0;
  let seaMaxDwt: string | null = null;
  if (isCrew && seaContracts && seaContracts.length > 0) {
    seaVessels = seaContracts.length;
    let totalDaysAtSea = 0;
    let maxDwtNum = 0;
    seaContracts.forEach((sc) => {
      if (sc.start_date) {
        const s = new Date((sc.start_date as string) + "T00:00:00").getTime();
        const e = sc.end_date ? new Date((sc.end_date as string) + "T00:00:00").getTime() : Date.now();
        if (e > s) totalDaysAtSea += Math.round((e - s) / dayMs);
      }
      const dw = Number(sc.dwt) || 0;
      if (dw > maxDwtNum) maxDwtNum = dw;
    });
    const yrs = totalDaysAtSea / 365;
    seaYears = yrs >= 10 ? String(Math.round(yrs)) : (Math.round(yrs * 10) / 10).toString();
    if (maxDwtNum > 0) seaMaxDwt = maxDwtNum.toLocaleString("en-US");
  }

  const availabilityLabel = (() => {
    const a = detailsData?.availability as string | undefined | null;
    if (!a) return null;
    if (a === "immediate") return "Available within 1 month";
    if (a === "1-3_months") return "Available in 1–3 months";
    if (a === "3+_months") return "Available in 3+ months";
    return a;
  })();

  const hiringRanks = Array.isArray(detailsData?.hiring_for_ranks)
    ? (detailsData?.hiring_for_ranks as string[])
    : [];

  const firstName = (profile?.full_name || "there").split(" ")[0];

  const ringR = 42;
  const ringC = 2 * Math.PI * ringR;
  const ringOff = ringC - (completion / 100) * ringC;
  // Davet kartı verileri (sadece crew) — 2 başarılı davet = kalıcı Premium
  let refCode = "";
  let refJoined = 0;
  let refInvitesLeft = 2;
  const isPremiumMember = isCrew && profile?.is_premium === true;
  if (isCrew) {
    const { data: myRewards } = await supabase
      .from("referral_rewards")
      .select("referrer_rewarded")
      .eq("referrer_id", user.id)
      .eq("referrer_rewarded", true);
    refCode = (profile?.referral_code as string) || "";
    refJoined = (myRewards || []).length;
    refInvitesLeft = Math.max(0, 2 - refJoined);
  }

  const fmtNotifDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

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
  .wrap{max-width:1080px;margin:0 auto;padding:0 20px}
  .dash-hero{position:relative;padding:40px 0 28px;overflow:hidden}
  .aur{position:absolute;width:480px;height:480px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.45;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .tag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);background:rgba(251,191,36,.09);border:1px solid var(--line);border-radius:8px;padding:5px 12px;margin-bottom:12px}
  h1{font-family:var(--disp);font-size:clamp(1.7rem,4vw,2.5rem);font-weight:800;line-height:1.1;letter-spacing:-.02em}
  .sub{font-size:14px;color:var(--tx2);margin-top:8px}
  .hero-grid{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center}
  @media(max-width:640px){.hero-grid{grid-template-columns:1fr}}
  .ring-box{display:flex;align-items:center;gap:16px;background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:18px 22px}
  .ring{width:96px;height:96px;flex-shrink:0}
  .ring circle{fill:none;stroke-width:8}
  .ring .bg{stroke:var(--line2)}
  .ring .fg{stroke:var(--gold);stroke-linecap:round;transform:rotate(-90deg);transform-origin:center}
  .ring-num{font-family:var(--disp);font-weight:800;font-size:22px;fill:var(--tx)}
  .ring-lbl b{font-family:var(--disp);font-size:15px;display:block;margin-bottom:4px}
  .ring-lbl p{font-size:12px;color:var(--tx3);max-width:22ch;line-height:1.5}
  section{padding:22px 0}
  .stitle{font-family:var(--disp);font-size:12.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
  .qgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
  .qcard{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:16px;padding:18px 20px;text-decoration:none;color:var(--tx);transition:.2s;display:block;position:relative}
  .qcard:hover{transform:translateY(-3px);border-color:var(--gold)}
  .qcard .qi{font-size:22px;margin-bottom:8px}
  .qcard b{font-family:var(--disp);font-size:14.5px;display:block;margin-bottom:4px}
  .qcard p{font-size:12px;color:var(--tx3);line-height:1.5}
  .qcard.gold{border-color:var(--line);background:linear-gradient(160deg,rgba(251,191,36,.12),var(--ink))}
  .qbadge{position:absolute;top:12px;right:12px;font-size:10px;font-weight:800;border-radius:999px;padding:3px 9px;border:1px solid;color:var(--gold);border-color:rgba(251,191,36,.4);background:rgba(251,191,36,.1)}
  .qbadge.warn{color:#f87171;border-color:rgba(239,68,68,.4);background:rgba(239,68,68,.1)}
  .qbadge.grn{color:var(--grn);border-color:rgba(52,211,153,.4);background:rgba(52,211,153,.1)}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:22px 24px}
  .rows{display:flex;flex-direction:column}
  .row{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--line2);font-size:13.5px}
  .row:last-child{border-bottom:none}
  .row span{color:var(--tx3)}
  .row b{font-weight:600;text-align:right}
  .pill{display:inline-block;padding:3px 10px;border-radius:999px;font-size:10.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;border:1px solid}
  .pill.ok{color:var(--grn);border-color:rgba(52,211,153,.35);background:rgba(52,211,153,.08)}
  .pill.warn{color:var(--gold);border-color:rgba(251,191,36,.35);background:rgba(251,191,36,.08)}
  .notif{display:flex;flex-direction:column;gap:9px}
  .nrow{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;border:1px solid var(--line2);border-radius:12px;text-decoration:none;color:var(--tx);transition:.15s;background:rgba(255,255,255,.02)}
  .nrow:hover{border-color:var(--gold)}
  .nrow.unread{border-color:rgba(251,191,36,.3);background:rgba(251,191,36,.05)}
  .nrow .ni{font-size:16px;flex-shrink:0;margin-top:1px}
  .nrow b{font-size:13px;display:block;font-family:var(--disp)}
  .nrow p{font-size:12px;color:var(--tx2);margin-top:2px;line-height:1.5}
  .nrow .nd{font-size:10.5px;color:var(--tx3);margin-left:auto;flex-shrink:0;white-space:nowrap}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:11px 19px;font-family:var(--body)}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-gold:hover{transform:translateY(-2px)}
  .btn-ghost{color:var(--tx);border:1px solid var(--line2);background:transparent}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media(max-width:820px){.grid2{grid-template-columns:1fr}}
  .msgbox{display:flex;align-items:center;gap:14px;background:linear-gradient(160deg,rgba(52,211,153,.09),var(--ink));border:1.5px solid rgba(52,211,153,.35);border-radius:18px;padding:16px 20px;text-decoration:none;color:var(--tx);transition:.18s}
  .msgbox:hover{transform:translateY(-2px);border-color:var(--grn)}
  .msgbox .mi{width:44px;height:44px;border-radius:12px;background:rgba(52,211,153,.14);border:1px solid rgba(52,211,153,.35);display:grid;place-items:center;font-size:20px;flex-shrink:0}
  .msgbox b{font-family:var(--disp);font-size:14.5px;display:block}
  .msgbox p{font-size:12px;color:var(--tx2);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .msgbox .mb{min-width:24px;height:24px;border-radius:999px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;font-size:11.5px;font-weight:800;display:grid;place-items:center;padding:0 7px;margin-left:auto;flex-shrink:0}
  .msgbox .go{margin-left:auto;color:var(--grn);font-weight:800;font-size:13px;flex-shrink:0}
  .foot{padding:30px 0 44px;text-align:center}
  .foot form{display:inline}
  .foot button{background:none;border:none;color:var(--tx3);font-size:13px;cursor:pointer;font-family:var(--body);text-decoration:underline;text-underline-offset:3px}
  .foot button:hover{color:var(--gold)}
`}</style>

      <SiteHeader
        isLoggedIn={true}
        userType={profile?.user_type as "seafarer" | "yacht" | "company" | null}
        unreadCount={unreadCount || 0}
        active="dashboard"
      />
      <div className="dash-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <form action={logout} style={{ position: "absolute", top: 0, right: 0, zIndex: 5 }}>
            <button
              type="submit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "linear-gradient(135deg,#fbbf24,#e0a010)",
                color: "#0b0e13",
                border: "none",
                borderRadius: "10px",
                padding: "9px 16px",
                fontWeight: 800,
                fontSize: "13px",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 4px 16px rgba(251,191,36,.3)",
              }}
            >
              ⏻ Log out
            </button>
          </form>
          <div className="hero-grid">
            <div>
              <div className="tag">{accountTypeLabel}</div>
              <h1>Welcome back, {firstName} ⚓</h1>
              <p className="sub">
                {isComplete
                  ? isCompany
                    ? "Your company profile is live. The crew pool is waiting."
                    : "Your profile is live and visible to verified companies."
                  : "Complete your profile to unlock full visibility."}
              </p>
            </div>
            <div className="ring-box">
              <svg className="ring" viewBox="0 0 96 96">
                <circle className="bg" cx="48" cy="48" r="42" />
                <circle
                  className="fg"
                  cx="48"
                  cy="48"
                  r="42"
                  strokeDasharray={ringC}
                  strokeDashoffset={ringOff}
                />
                <text className="ring-num" x="48" y="55" textAnchor="middle">
                  {completion}%
                </text>
              </svg>
              <div className="ring-lbl">
                <b>Profile completion</b>
                <p>
                  {isComplete
                    ? "Fully complete — you appear in search results."
                    : "Incomplete profiles get significantly fewer views."}
                </p>
                {!isComplete && missingItems.length > 0 && (
                  <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {missingItems.map((m) => (
                      <span
                        key={m}
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: "#f87171",
                          background: "rgba(239,68,68,.1)",
                          border: "1px solid rgba(239,68,68,.3)",
                          borderRadius: 999,
                          padding: "3px 9px",
                        }}
                      >
                        Missing: {m}
                      </span>
                    ))}
                  </div>
                )}
                {!isComplete && (
                  <Link href={onboardingUrl} className="btn btn-gold" style={{ marginTop: 10, padding: "8px 14px", fontSize: 12.5 }}>
                    Complete now →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section style={{ paddingTop: 0, paddingBottom: 4 }}>
        <div className="wrap">
          <Link href="/messages" className="msgbox">
            <span className="mi">💬</span>
            <span style={{ minWidth: 0 }}>
              <b>Messages</b>
              <p>{msgUnread > 0 ? "You have unread messages — they vanish in 24h!" : (lastConvPreview ? lastConvPreview : "Direct line to crew & companies · auto-delete after 24h")}</p>
            </span>
            {msgUnread > 0 ? <span className="mb">{msgUnread}</span> : <span className="go">Open →</span>}
          </Link>
        </div>
      </section>

      {isCrew ? (
        <section style={{ paddingTop: 10, paddingBottom: 4 }}>
          <div className="wrap">
            <CountdownCard endDate={contractEnd} startDate={contractStart} rankLabel={rankLabel} />
          </div>
        </section>
      ) : null}

      {isCrew ? (
        <section style={{ paddingTop: 10, paddingBottom: 4 }}>
          <div className="wrap">
            <PostCvCard activePost={activeCvPost || null} />
          </div>
        </section>
      ) : null}

      {isCrew && seaVessels > 0 ? (
        <section style={{ paddingTop: 10, paddingBottom: 4 }}>
          <div className="wrap">
            <SeaCardShare years={seaYears} vessels={seaVessels} rank={rankLabel} maxDwt={seaMaxDwt} />
          </div>
        </section>
      ) : null}

      {isCrew ? (
        <section style={{ paddingTop: 10, paddingBottom: 4 }}>
          <div className="wrap">
            <MyApplications userId={user.id} />
          </div>
        </section>
      ) : null}

      <section style={{ paddingTop: 14 }}>
        <div className="wrap">
          <div className="stitle">Quick actions</div>
          <div className="qgrid">
            {isCompany ? (
              <>
                <Link href="/browse" className="qcard gold">
                  <div className="qi">🔍</div>
                  <b>Search Crew</b>
                  <p>Filter verified profiles by rank, availability and vessel experience.</p>
                </Link>
                <Link href={appLink} className="qcard gold">
                  {appNew > 0 ? (
                    <span className="qbadge grn">{appNew} new</span>
                  ) : appTotal > 0 ? (
                    <span className="qbadge">{appTotal} total</span>
                  ) : null}
                  <div className="qi">📥</div>
                  <b>Applications</b>
                  <p>Every applicant in one place — New → Contacted → Shortlisted → Hired.</p>
                </Link>
                <Link href="/radar" className="qcard">
                  <div className="qi">📡</div>
                  <b>Rotation Radar</b>
                  <p>Crew in your ranks whose contracts end within 90 days — contact them first.</p>
                </Link>
                <Link href="/jobs/new" className="qcard">
                  <div className="qi">📋</div>
                  <b>Post a Job</b>
                  <p>Matching crew get an instant email + in-app alert.</p>
                </Link>
                <Link href="/jobs/mine" className="qcard">
                  <div className="qi">🗂️</div>
                  <b>My Job Posts</b>
                  <p>Manage listings — post any of them to the main page board.</p>
                </Link>
                <Link href="/salary" className="qcard">
                  <div className="qi">💰</div>
                  <b>Salary Index</b>
                  <p>2026 wage benchmarks by rank, vessel type and nationality.</p>
                </Link>
                <Link href="/fleet" className="qcard gold">
                  <div className="qi">🚢</div>
                  <b>My Fleet</b>
                  <p>Track vessels and crew — passports, health reports, certificates and salaries.</p>
                </Link>
              </>
      ) : (
              <>
                <Link href="/jobs" className="qcard gold">
                  <div className="qi">⚓</div>
                  <b>Search Jobs</b>
                  <p>Open positions from verified companies — apply directly.</p>
                </Link>
                <Link href="/cv" className="qcard gold">
                  <div className="qi">📄</div>
                  <b>My CV</b>
                  <p>Professional maritime CV — download as PDF or share by link.</p>
                </Link>
                <Link href="/seatime" className="qcard">
                  <div className="qi">⏱</div>
                  <b>Sea Time</b>
                  <p>Log contracts — sea service totals and licence renewal check.</p>
                </Link>
                <Link href="/vault" className="qcard">
                  {vaultWarn > 0 ? (
                    <span className="qbadge warn">{vaultWarn} expiring</span>
                 ) : vaultCount > 0 ? (
                    <span className="qbadge">{vaultCount} docs</span>
                  ) : null}
                  <div className="qi">📁</div>
                  <b>Document Vault</b>
                  <p>Certificates in one place — expiry reminders 90/30/7 days ahead.</p>
                </Link>
                <Link href={`/jobs${rankLabel ? `?rank=${encodeURIComponent(String(rankLabel).toUpperCase())}` : ""}`} className="qcard">
                  <div className="qi">🔔</div>
                  <b>Job Alerts</b>
                  <p>Get emailed the moment a matching position is posted.</p>
                </Link>
                <Link href="/salary" className="qcard">
                  <div className="qi">💰</div>
                  <b>Salary Index</b>
                  <p>Know your market rate before you negotiate.</p>
                </Link>
                <Link href="/profile/me" className="qcard">
                  <div className="qi">👤</div>
                  <b>My Profile</b>
                  <p>See your profile exactly as companies see it.</p>
                </Link>
                {(rankLabel === "CHIEF ENGINEER" || rankLabel === "2ND ENGINEER") && (
                  <Link href="/tools/oil-record-book" className="qcard gold">
                    <span className="qbadge grn">Pro</span>
                    <div className="qi">⚓</div>
                    <b>Oil Record Book Pro</b>
                    <p>MARPOL Annex I compliant logging — 24 operations, auto-generated codes, PDF export.</p>
                  </Link>
                )}
                {(rankLabel === "MASTER" || rankLabel === "CHIEF OFFICER") && (
                  <Link href="/tools/draft-survey-pro" className="qcard gold">
                    <span className="qbadge grn">Pro</span>
                    <div className="qi">📐</div>
                    <b>Draft Survey Pro</b>
                    <p>Full quadratic-mean cargo calculation — your own hydrostatic table, verified formulas, signable report.</p>
                  </Link>
                )}
                {(rankLabel === "MASTER" || rankLabel === "CHIEF OFFICER") && (
                  <Link href="/tools/documents" className="qcard gold">
                    <span className="qbadge grn">Pro</span>
                    <div className="qi">📄</div>
                    <b>Document Generator Pro</b>
                    <p>NOR, SOF, LOI, Letters of Protest and more — unlimited PDF export and sharing.</p>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {isCompany && careersSlug ? (
        <section style={{ paddingTop: 6 }}>
          <div className="wrap">
            <CareersLinkCard slug={careersSlug} />
          </div>
        </section>
      ) : null}

      {isCrew && refCode ? (
        <section style={{ paddingTop: 6 }}>
          <div className="wrap">
            <InviteCard
              refCode={refCode}
              joined={refJoined}
              isPremium={isPremiumMember}
              invitesLeft={refInvitesLeft}
            />
          </div>
        </section>
      ) : null}

      <section style={{ paddingTop: 6 }}>
        <div className="wrap">
          <div className="grid2">
            <div className="card" id="notifications" style={{ scrollMarginTop: 80 }}>
              <div className="stitle" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Notifications</span>
                {(unreadCount || 0) > 0 && (
                  <span className="pill warn">{unreadCount} new</span>
                )}
              </div>
              {notifications && notifications.length > 0 ? (
                <div className="notif">
                  {notifications.map((n) => (
                    <Link
                      key={n.id as string}
                      href={(n.link as string) || "/dashboard"}
                      className={`nrow ${n.read ? "" : "unread"}`}
                    >
                      <span className="ni">
                        {n.type === "job_alert" ? "⚓" : n.type === "job_application" ? "📥" : n.type === "doc_expiry" ? "📁" : n.type === "referral" ? "🎁" : n.type === "rotation_radar" ? "📡" : n.type === "hired" ? "🎉" : n.type === "message" ? "💬" : "🔔"}
                      </span>
                      <span style={{ minWidth: 0 }}>
                        <b>{n.title as string}</b>
                        <p>{n.message as string}</p>
                      </span>
                      <span className="nd">{fmtNotifDate(n.created_at as string)}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: "var(--tx3)", padding: "8px 0" }}>
                  No notifications yet. {isCrew ? "Set a job alert and new matching positions will appear here." : "Applications to your job posts will appear here."}
                </p>
              )}
            </div>

            <div className="card">
              <div className="stitle">
                {isCompany ? "Company summary" : "Profile summary"}
              </div>
              <div className="rows">
                {isCrew && (
                  <>
                    <div className="row">
                      <span>{profile?.user_type === "yacht" ? "Position" : "Rank"}</span>
                      <b>{rankLabel || "—"}</b>
                    </div>
                    <div className="row">
                      <span>Availability</span>
                      <b>{availabilityLabel || "—"}</b>
                    </div>
                    <div className="row">
                      <span>Sign-off date</span>
                      <b>
                        {contractEnd ? (
                          new Date(contractEnd + "T00:00:00").toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                        ) : (
                          <Link href="/onboarding/crew/step-5" style={{ color: "var(--gold)", textDecoration: "none" }}>
                            Set dates →
                          </Link>
                        )}
                      </b>
                    </div>
                    <div className="row">
                      <span>Crew Board</span>
                      <b>
                        {activeCvPost ? (
                          <Link href="/deck" style={{ color: "var(--grn)", textDecoration: "none" }}>
                            ● Live on main page
                          </Link>
                        ) : (
                          <span style={{ color: "var(--tx3)" }}>Not posted</span>
                        )}
                      </b>
                    </div>
                    <div className="row">
                      <span>Nationality</span>
                      <b>{(detailsData?.nationality as string) || profile?.country || "—"}</b>
                    </div>
                    <div className="row">
                      <span>Documents</span>
                      <b>
                        {vaultCount > 0 ? (
                          <Link href="/vault" style={{ color: "var(--gold)", textDecoration: "none" }}>
                            {vaultCount} in vault{vaultWarn > 0 ? " · "+vaultWarn+" expiring" : ""}
                          </Link>
                        ) : (
                          <Link href="/vault" style={{ color: "var(--gold)", textDecoration: "none" }}>
                            Add documents →
                          </Link>
                        )}
                      </b>
                    </div>
                    <div className="row">
                      <span>CV</span>
                      <b>
                        <Link href="/cv" style={{ color: "var(--gold)", textDecoration: "none" }}>
                          Open SCF CV →
                        </Link>
                      </b>
                    </div>
                  </>
                )}
                {isCompany && (
                  <>
                    <div className="row">
                      <span>Applications received</span>
                      <b>
                        {appTotal > 0 ? (
                          <Link href={appLink} style={{ color: "var(--gold)", textDecoration: "none" }}>
                            {appTotal} total{appNew > 0 ? " ·"+appNew+" new" : ""}
                          </Link>
                        ) : (
                          "0"
                        )}
                      </b>
                    </div>
                    <div className="row">
                      <span>Careers page</span>
                      <b>
                        {careersSlug ? (
                          <a href={"/careers/"+careersSlug} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)", textDecoration: "none" }}>View →</a>
                        ) : (
                          "—"
                        )}
                      </b>
                    </div>
                    <div className="row">
                      <span>Company type</span>
                      <b>{(detailsData?.company_type as string) || "—"}</b>
                    </div>
                    <div className="row">
                      <span>Headquarters</span>
                      <b>{(detailsData?.headquarters_country as string) || "—"}</b>
                    </div>
                    <div className="row">
                      <span>Hiring for</span>
                      <b style={{ maxWidth: "60%" }}>{hiringRanks.length > 0 ? hiringRanks.join(", ") : "—"}</b>
                    </div>
                    <div className="row">
                      <span>Plan</span>
                      <b>{(profile?.plan as string) || "Founding"}</b>
                    </div>
                  </>
                )}
                <div className="row">
                  <span>Email</span>
                  <b>{user.email}</b>
                </div>
                <div className="row">
                  <span>Visibility</span>
                  <b>
                    <span className={`pill ${profile?.visibility === "public" ? "ok" : "warn"}`}>
                      {profile?.visibility === "public" ? "Public" : "Hidden"}
                    </span>
                  </b>
                </div>
                <div className="row">
                  <span>Member since</span>
                  <b>
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </b>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                <Link href={onboardingUrl} className="btn btn-ghost">Edit profile</Link>
                {isCrew && (
                  <Link href="/profile/me" className="btn btn-gold">View my profile</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="foot">
        <form action={logout}>
          <button type="submit">Log out</button>
        </form>
      </div>
    </>
  );
}
