import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { addFleetCrew, deleteFleetCrew, activatePlannedCrew, deletePlannedCrew } from "@/lib/actions/fleet";

export const metadata = {
  title: "Vessel Crew — ShipCrewFinder",
};

export default async function VesselCrewPage({
  params,
  searchParams,
}: {
  params: Promise<{ vesselId: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { vesselId } = await params;
  const sp = await searchParams;
  const added = sp.added;
  const deleted = sp.deleted;
  const signedoff = sp.signedoff;
  const error = sp.error;

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!user) redirect("/login");

  const [{ data: profile }, { count: unreadCount }] = await Promise.all([
    supabase.from("profiles").select("user_type, plan").eq("id", user.id).single(),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false),
  ]);

  if (!profile || profile.user_type !== "company") redirect("/dashboard");

  const { data: vessel } = await supabase
    .from("vessels")
    .select("id, name, imo_number, vessel_type, flag, dwt")
    .eq("id", vesselId)
    .eq("company_id", user.id)
    .maybeSingle();

  if (!vessel) notFound();

  const { data: allCrew } = await supabase
    .from("fleet_crew")
    .select("id, full_name, rank, nationality, join_date, departure_date, passport_expiry, health_report_expiry, status, notes, expected_join_date, planning_country, planning_status")
    .eq("vessel_id", vesselId)
    .order("created_at", { ascending: false });

  const crewAll = allCrew || [];
  const crewList = crewAll.filter((c) => (c.status as string) === "active");
  const historyList = crewAll.filter((c) => (c.status as string) === "signed_off");
  const plannedList = crewAll.filter((c) => (c.status as string) === "planned");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMs = 24 * 3600 * 1000;

  const expiryStatus = (dateStr: string | null) => {
    if (!dateStr) return "none";
    const days = Math.round(
      (new Date(dateStr + "T00:00:00").getTime() - today.getTime()) / dayMs
    );
    if (days < 0) return "expired";
    if (days <= 60) return "soon";
    return "ok";
  };

  const fmtDate = (d: string | null) =>
    d
      ? new Date(d + "T00:00:00").toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  const fmtDwt = (d: number | null) => (d ? Number(d).toLocaleString("en-US") + " DWT" : null);
  const metaParts = [
    (vessel.vessel_type as string) || null,
    (vessel.flag as string) ? "Flag: " + (vessel.flag as string) : null,
    fmtDwt(vessel.dwt as number | null),
    vessel.imo_number ? "IMO " + vessel.imo_number : null,
  ].filter(Boolean);

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
    --line:rgba(224,160,16,.4);--line2:rgba(15,25,60,.12);
  }
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:920px;margin:0 auto;padding:0 20px}
  .vc-hero{position:relative;padding:36px 0 20px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:16px}
  .back:hover{color:var(--gold)}
  h1{font-family:var(--disp);font-size:clamp(1.7rem,4.2vw,2.4rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:6px}
  .sub{font-size:14px;color:var(--tx2)}
  section{padding:20px 0 44px}
  .stitle{display:flex;align-items:center;gap:9px;font-size:12.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin:28px 0 12px}
  .banner{border-radius:13px;padding:13px 17px;font-size:13px;margin-bottom:16px;border:1px solid}
  .banner.ok{color:var(--grn);border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.08)}
  .banner.err{color:var(--red);border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:22px 24px;margin-bottom:20px}
  .card h2{font-family:var(--disp);font-size:16px;font-weight:800;margin-bottom:14px}
  .frow{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr auto;gap:10px;align-items:end}
  @media(max-width:820px){.frow{grid-template-columns:1fr 1fr}}
  label{display:block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--tx3);margin-bottom:6px}
  input[type=text],input[type=date]{width:100%;background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:11px;padding:11px 13px;font-family:var(--body);font-size:13.5px;outline:none}
  input:focus{border-color:var(--gold)}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:11px 19px;font-family:var(--body)}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-gold:hover{transform:translateY(-2px)}
  .clist{display:flex;flex-direction:column;gap:9px}
  .crow{display:flex;align-items:center;gap:14px;border:1px solid var(--line2);border-radius:14px;padding:14px 16px;background:rgba(255,255,255,.02);flex-wrap:wrap}
  .crow:hover{border-color:var(--gold)}
  .cavatar{flex-shrink:0;width:42px;height:42px;border-radius:12px;background:rgba(251,191,36,.13);border:1px solid rgba(251,191,36,.3);display:grid;place-items:center;font-family:var(--disp);font-weight:800;font-size:15px;color:var(--gold)}
  .cinfo{flex:1;min-width:180px}
  .cname{font-family:var(--disp);font-weight:700;font-size:14.5px;text-decoration:none;color:var(--tx)}
  .cname:hover{color:var(--gold)}
  .cmeta{font-size:12px;color:var(--tx3);margin-top:2px}
  .cbadges{display:flex;gap:6px;flex-wrap:wrap}
  .cbadge{font-size:10px;font-weight:800;border-radius:999px;padding:4px 10px;border:1px solid;white-space:nowrap}
  .cbadge.ok{color:var(--grn);border-color:rgba(52,211,153,.35);background:rgba(52,211,153,.08)}
  .cbadge.soon{color:var(--gold);border-color:rgba(251,191,36,.35);background:rgba(251,191,36,.08)}
  .cbadge.expired{color:var(--red);border-color:rgba(239,68,68,.35);background:rgba(239,68,68,.08)}
  .cdel{flex-shrink:0}
  .cdel button{background:none;border:1px solid var(--line2);color:var(--tx3);border-radius:8px;padding:6px 11px;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--body)}
  .cdel button:hover{color:var(--red);border-color:rgba(239,68,68,.4)}
  .empty{text-align:center;padding:30px 12px;font-size:13.5px;color:var(--tx2);line-height:1.7}
  .pacts{display:flex;gap:6px;flex-shrink:0}
  .pacts button{background:none;border:1px solid var(--line2);color:var(--tx3);border-radius:8px;padding:6px 11px;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--body)}
  .pacts button.go{color:var(--grn);border-color:rgba(52,211,153,.4)}
  .pacts button.go:hover{background:rgba(52,211,153,.1)}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader isLoggedIn={true} userType="company" unreadCount={unreadCount || 0} active={null} />

      <div className="vc-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/fleet" className="back">← My Fleet</Link>
          <h1>🚢 {vessel.name as string}</h1>
          <p className="sub">
            {metaParts.length > 0 ? metaParts.join(" · ") : "Vessel details not set"} ·{" "}
            {crewList.length} active crew member{crewList.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {added === "1" ? <div className="banner ok">Crew member added.</div> : null}
          {deleted === "1" ? <div className="banner ok">Crew member removed.</div> : null}
          {signedoff === "1" ? <div className="banner ok">Moved to crew history.</div> : null}
          {error === "missing" ? <div className="banner err">Full name is required.</div> : null}
          {error === "failed" ? <div className="banner err">Something went wrong — please try again.</div> : null}

          <div className="card">
            <h2>+ Add crew member</h2>
            <form action={addFleetCrew}>
              <input type="hidden" name="vesselId" value={vesselId} />
              <div className="frow">
                <div>
                  <label htmlFor="fullName">Full name</label>
                  <input id="fullName" name="fullName" type="text" required maxLength={100} placeholder="e.g. John Smith" />
                </div>
                <div>
                  <label htmlFor="rank">Rank</label>
                  <input id="rank" name="rank" type="text" maxLength={60} placeholder="e.g. Chief Engineer" />
                </div>
                <div>
                  <label htmlFor="nationality">Nationality</label>
                  <input id="nationality" name="nationality" type="text" maxLength={60} placeholder="e.g. Turkey" />
                </div>
                <div>
                  <label htmlFor="joinDate">Join date</label>
                  <input id="joinDate" name="joinDate" type="date" />
                </div>
                <button type="submit" className="btn btn-gold">+ Add</button>
              </div>
            </form>
          </div>

          {crewList.length === 0 ? (
            <div className="empty">
              No active crew members yet — use the form above to add your first one.
            </div>
          ) : (
            <div className="clist">
              {crewList.map((c) => {
                const passportSt = expiryStatus(c.passport_expiry as string | null);
                const healthSt = expiryStatus(c.health_report_expiry as string | null);
                return (
                  <div key={c.id as string} className="crow">
                    <div className="cavatar">
                      {(c.full_name as string || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="cinfo">
                      <Link href={`/fleet/${vesselId}/${c.id}`} className="cname">
                        {c.full_name as string}
                      </Link>
                      <div className="cmeta">
                        {(c.rank as string) || "Rank not set"} · {(c.nationality as string) || "—"} · Joined {fmtDate(c.join_date as string | null)}
                      </div>
                    </div>
                    <div className="cbadges">
                      {passportSt !== "none" ? (
                        <span className={`cbadge ${passportSt}`}>
                          Passport {passportSt === "expired" ? "expired" : passportSt === "soon" ? "expiring" : "valid"}
                        </span>
                      ) : null}
                      {healthSt !== "none" ? (
                        <span className={`cbadge ${healthSt}`}>
                          Health {healthSt === "expired" ? "expired" : healthSt === "soon" ? "expiring" : "valid"}
                        </span>
                      ) : null}
                    </div>
                    <div className="cdel">
                      <form action={deleteFleetCrew}>
                        <input type="hidden" name="crewId" value={c.id as string} />
                        <input type="hidden" name="vesselId" value={vesselId} />
                        <button type="submit">✕</button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {plannedList.length > 0 ? (
            <>
              <div className="stitle">📅 Planned for this vessel</div>
              <div className="card">
                <div className="clist">
                  {plannedList.map((c) => (
                    <div key={c.id as string} className="crow">
                      <div className="cavatar">{(c.full_name as string || "?").charAt(0).toUpperCase()}</div>
                      <div className="cinfo">
                        <span className="cname" style={{ cursor: "default" }}>{c.full_name as string}</span>
                        <div className="cmeta">
                          {(c.rank as string) || "Crew"} · expected {fmtDate(c.expected_join_date as string | null)}
                          {c.planning_country ? " · " + (c.planning_country as string) : ""}
                        </div>
                      </div>
                      <div className="pacts">
                        <form action={activatePlannedCrew}>
                          <input type="hidden" name="crewId" value={c.id as string} />
                          <input type="hidden" name="vesselId" value={vesselId} />
                          <button type="submit" className="go">Sign on</button>
                        </form>
                        <form action={deletePlannedCrew}>
                          <input type="hidden" name="crewId" value={c.id as string} />
                          <button type="submit">✕</button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {historyList.length > 0 ? (
            <>
              <div className="stitle">📜 Crew history for this vessel</div>
              <div className="card">
                <div className="clist">
                  {historyList.map((c) => (
                    <div key={c.id as string} className="crow">
                      <div className="cavatar">{(c.full_name as string || "?").charAt(0).toUpperCase()}</div>
                      <div className="cinfo">
                        <span className="cname" style={{ cursor: "default" }}>{c.full_name as string}</span>
                        <div className="cmeta">
                          {(c.rank as string) || "Crew"} · signed off {fmtDate(c.departure_date as string | null)}
                          {c.notes ? " · has notes" : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <footer>
        <div className="wrap">© 2026 ShipCrewFinder · <Link href="/fleet">My Fleet</Link> · <Link href="/dashboard">Dashboard</Link></div>
      </footer>
    </>
  );
}
