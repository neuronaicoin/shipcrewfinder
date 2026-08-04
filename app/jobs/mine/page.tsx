import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { closeJob, reopenJob } from "@/lib/actions/jobs";
import { postJobToDeck, removeJobFromDeck, boostDeckPost } from "@/lib/actions/deck";
import DeleteJobButton from "@/app/components/delete-job-button";
import { getSortedCountries } from "@/lib/constants/countries";
import SiteHeader from "@/app/components/site-header";
import { getPlanAccess } from "@/lib/plan-access";

export const metadata = {
  title: "My Job Posts — ShipCrewFinder",
};

const DAY_MS = 24 * 3600 * 1000;

export default async function MyJobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const created = sp.created;
  const updated = sp.updated;
  const deleted = sp.deleted;
  const deck = sp.deck;

  const supabase = await createClient();

  // getSession: çerezden okur — ekstra ağ turu yok
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!user) redirect("/login");

  const [{ data: profile }, { count: unreadCount }, { data: jobs }, { data: deckPosts }] = await Promise.all([
    supabase.from("profiles").select("user_type, plan").eq("id", user.id).single(),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false),
    supabase
      .from("jobs")
      .select("id, title, position, job_type, location_country, location_city, status, created_at")
      .eq("company_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("deck_posts")
      .select("id, job_id, expires_at, boosted_at")
      .eq("user_id", user.id)
      .eq("post_type", "company"),
  ]);

  if (!profile || profile.user_type !== "company") redirect("/dashboard");

  const myPlan = (profile.plan as string) || "free";
  const access = getPlanAccess(myPlan as never);

  const jobList = jobs || [];
  const activeCount = jobList.filter((j) => j.status === "active").length;

  // İlan → aktif board kartı eşlemesi
  const now = Date.now();
  const deckMap: Record<string, { id: string; expires_at: string; boosted_at: string }> = {};
  (deckPosts || []).forEach((p) => {
    if (p.job_id && new Date(p.expires_at as string).getTime() > now) {
      deckMap[p.job_id as string] = {
        id: p.id as string,
        expires_at: p.expires_at as string,
        boosted_at: p.boosted_at as string,
      };
    }
  });

  // Her ilana gelen başvuru sayısı
  const jobIds = jobList.map((j) => j.id as string);
  const appCountMap: Record<string, number> = {};
  if (jobIds.length > 0) {
    const { data: apps } = await supabase
      .from("job_applications")
      .select("job_id")
      .in("job_id", jobIds);
    (apps || []).forEach((a) => {
      const jid = a.job_id as string;
      appCountMap[jid] = (appCountMap[jid] || 0) + 1;
    });
  }

  const countries = getSortedCountries();
  const countryName = (code: string | null) => {
    if (!code) return null;
    const c = countries.find((x) => x.code === code);
    return c ? `${c.flag} ${c.name}` : code;
  };

  const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "";

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
  .wrap{max-width:880px;margin:0 auto;padding:0 20px}
  .mj-hero{position:relative;padding:36px 0 20px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:16px}
  .back:hover{color:var(--gold)}
  .hrow{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap}
  h1{font-family:var(--disp);font-size:clamp(1.7rem,4.2vw,2.5rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:6px}
  .sub{font-size:14px;color:var(--tx2)}
  section{padding:20px 0 44px}
  .banner{border-radius:13px;padding:13px 17px;font-size:13px;margin-bottom:16px;border:1px solid}
  .banner.ok{color:var(--grn);border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.08)}
  .banner.info{color:var(--tx2);border-color:var(--line2);background:rgba(255,255,255,.03)}
  .banner.plan{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;color:var(--gold);border-color:rgba(251,191,36,.3);background:rgba(251,191,36,.08)}
  .banner.plan.locked{color:#f87171;border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:11px 19px;font-family:var(--body);white-space:nowrap}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-gold:hover{transform:translateY(-2px)}
  .btn-sm{padding:8px 15px;font-size:12.5px}
  .jlist{display:flex;flex-direction:column;gap:12px}
  .jcard{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:16px;padding:20px 22px}
  .jtags{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:9px}
  .jtag{font-size:10px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;border-radius:999px;padding:4px 11px;border:1px solid}
  .jtag.rank{color:var(--gold);border-color:rgba(251,191,36,.35);background:rgba(251,191,36,.08)}
  .jtag.on{color:var(--grn);border-color:rgba(52,211,153,.35);background:rgba(52,211,153,.08)}
  .jtag.off{color:var(--tx3);border-color:var(--line2);background:rgba(255,255,255,.03)}
  .jtag.board{color:#60a5fa;border-color:rgba(96,165,250,.4);background:rgba(96,165,250,.09)}
  .jtitle{font-family:var(--disp);font-size:17px;font-weight:700;text-decoration:none;color:var(--tx);display:block;margin-bottom:6px}
  .jtitle:hover{color:var(--gold)}
  .jmeta{display:flex;flex-wrap:wrap;gap:6px 12px;font-size:12.5px;color:var(--tx3);margin-bottom:14px}
  .acts{display:flex;flex-wrap:wrap;gap:8px;padding-top:14px;border-top:1px solid var(--line2)}
  .act{font-size:11.5px;font-weight:700;border-radius:9px;padding:7px 13px;border:1px solid;cursor:pointer;text-decoration:none;transition:.15s;font-family:var(--body);background:transparent}
  .act.gold{color:var(--gold);border-color:rgba(251,191,36,.35);background:rgba(251,191,36,.08)}
  .act.gold:hover{background:rgba(251,191,36,.15)}
  .act.plain{color:var(--tx2);border-color:var(--line2)}
  .act.plain:hover{color:var(--tx);border-color:var(--tx3)}
  .act.grn{color:var(--grn);border-color:rgba(52,211,153,.35);background:rgba(52,211,153,.08)}
  .act.blue{color:#60a5fa;border-color:rgba(96,165,250,.4);background:rgba(96,165,250,.09)}
  .act.blue:hover{background:rgba(96,165,250,.16)}
  .act.dis{color:var(--tx3);border-color:var(--line2);cursor:default}
  .empty{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:40px;text-align:center;font-size:14px;color:var(--tx2)}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader
        isLoggedIn={true}
        userType="company"
        unreadCount={unreadCount || 0}
        active={null}
      />

      <div className="mj-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/dashboard" className="back">← Back to dashboard</Link>
          <div className="hrow">
            <div>
              <h1>My Job <span style={{ color: "var(--gold)" }}>Posts</span></h1>
              <p className="sub">{jobList.length} job{jobList.length === 1 ? "" : "s"} total · post any active job to the main page board</p>
            </div>
            {access.canPostJob ? (
              <Link href="/jobs/new" className="btn btn-gold">+ Post Job</Link>
            ) : (
              <Link href="/upgrade" className="btn btn-gold">🔒 Choose a plan to post</Link>
            )}
          </div>
        </div>
      </div>

      <section style={{ paddingTop: 8 }}>
        <div className="wrap">
          {!access.canPostJob ? (
            <div className="banner plan locked">
              <span>🔒 You&apos;re on the <b>Free</b> plan — you can view your existing listings, but posting new jobs requires Pro or Fleet.</span>
              <Link href="/upgrade" className="btn btn-gold btn-sm">Choose a plan →</Link>
            </div>
          ) : access.jobPostLimit !== null ? (
            <div className="banner plan">
              <span>📋 {access.label} plan — {activeCount}/{access.jobPostLimit} active job listings used this month.</span>
              {activeCount >= access.jobPostLimit ? (
                <Link href="/upgrade" className="btn btn-gold btn-sm">Upgrade to Fleet →</Link>
              ) : null}
            </div>
          ) : null}

          {created === "1" ? <div className="banner ok">Your job has been published.</div> : null}
          {updated === "1" ? <div className="banner ok">Your job has been updated.</div> : null}
          {deleted === "1" ? <div className="banner info">The job has been deleted.</div> : null}
          {deck === "posted" ? <div className="banner ok">📋 Your job is now on the main page board — live for 30 days.</div> : null}
          {deck === "boosted" ? <div className="banner ok">⬆️ Boosted to the top — 30 days renewed.</div> : null}
          {deck === "removed" ? <div className="banner info">The job has been removed from the board.</div> : null}
          {deck === "toosoon" ? <div className="banner info">You can boost each post once a day — try again tomorrow.</div> : null}
          {deck === "invalid" ? <div className="banner info">Only your own active jobs can go on the board.</div> : null}
          {deck === "failed" ? <div className="banner info">Something went wrong — please try again.</div> : null}

          {jobList.length === 0 ? (
            <div className="empty">
              <p style={{ marginBottom: 16 }}>You haven&apos;t posted any jobs yet.</p>
              {access.canPostJob ? (
                <Link href="/jobs/new" className="btn btn-gold">Post Your First Job</Link>
              ) : (
                <Link href="/upgrade" className="btn btn-gold">Choose a plan to get started</Link>
              )}
            </div>
          ) : (
            <div className="jlist">
              {jobList.map((job) => {
                const appCount = appCountMap[job.id as string] || 0;
                const boardPost = deckMap[job.id as string];
                const boardDays = boardPost ? Math.max(0, Math.ceil((new Date(boardPost.expires_at).getTime() - now) / DAY_MS)) : 0;
                const canBoost = boardPost ? now - new Date(boardPost.boosted_at).getTime() >= DAY_MS : false;
                return (
                  <div key={job.id} className="jcard">
                    <div className="jtags">
                      <span className="jtag rank">{job.position}</span>
                      <span className={`jtag ${job.status === "active" ? "on" : "off"}`}>
                        {job.status === "active" ? "Active" : "Closed"}
                      </span>
                      {boardPost ? <span className="jtag board">● On main page · {boardDays}d</span> : null}
                    </div>
                    <Link href={`/jobs/${job.id}`} className="jtitle">{job.title}</Link>
                    <div className="jmeta">
                      {countryName(job.location_country) ? (
                        <span>{countryName(job.location_country)}{job.location_city ? `, ${job.location_city}` : ""}</span>
                      ) : null}
                      <span>{fmtDate(job.created_at)}</span>
                    </div>

                    <div className="acts">
                      {access.canSearchCrew ? (
                        <Link href={`/jobs/${job.id}/applications`} className="act gold">
                          Applications{appCount > 0 ? ` (${appCount})` : ""}
                        </Link>
                      ) : (
                        <Link href="/upgrade" className="act gold">
                          🔒 Applications{appCount > 0 ? ` (${appCount})` : ""}
                        </Link>
                      )}
                      {job.status === "active" && !boardPost ? (
                        <form action={postJobToDeck} style={{ display: "inline" }}>
                          <input type="hidden" name="jobId" value={job.id} />
                          <button type="submit" className="act blue">📋 Post this job on main page</button>
                        </form>
                      ) : null}
                      {boardPost && canBoost ? (
                        <form action={boostDeckPost} style={{ display: "inline" }}>
                          <input type="hidden" name="postId" value={boardPost.id} />
                          <input type="hidden" name="backTo" value="/jobs/mine" />
                          <button type="submit" className="act blue">⬆️ Boost</button>
                        </form>
                      ) : null}
                      {boardPost && !canBoost ? (
                        <span className="act dis">⬆️ Boosted today</span>
                      ) : null}
                      {boardPost ? (
                        <form action={removeJobFromDeck} style={{ display: "inline" }}>
                          <input type="hidden" name="jobId" value={job.id} />
                          <button type="submit" className="act plain">Remove from board</button>
                        </form>
                      ) : null}
                      <Link href={`/jobs/${job.id}/edit`} className="act plain">Edit</Link>
                      {job.status === "active" ? (
                        <form action={closeJob} style={{ display: "inline" }}>
                          <input type="hidden" name="jobId" value={job.id} />
                          <button type="submit" className="act plain">Close</button>
                        </form>
                      ) : (
                        <form action={reopenJob} style={{ display: "inline" }}>
                          <input type="hidden" name="jobId" value={job.id} />
                          <button type="submit" className="act grn">Reopen</button>
                        </form>
                      )}
                      <DeleteJobButton jobId={job.id} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/browse">Search Crew</Link> ·{" "}
          <Link href="/jobs/new">Post a Job</Link> · <Link href="/dashboard">Dashboard</Link>
        </div>
      </footer>
    </>
  );
}
