import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getPlanAccess } from "@/lib/plan-access";
import {
  addVessel,
  deleteVessel,
  addPlannedCrew,
  activatePlannedCrew,
  deletePlannedCrew,
  rehireCrew,
} from "@/lib/actions/fleet";

export const metadata = {
  title: "My Fleet — ShipCrewFinder",
};

export default async function FleetPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const added = sp.added;
  const deleted = sp.deleted;
  const planned = sp.planned;
  const error = sp.error;
  const fVessel = sp.fVessel || "";
  const fRank = sp.fRank || "";

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

  const myPlan = (profile.plan as string) || "free";
  const access = getPlanAccess(myPlan as never);

  const { data: vessels } = await supabase
    .from("vessels")
    .select("id, name, imo_number, vessel_type, flag, dwt, created_at")
    .eq("company_id", user.id)
    .order("created_at", { ascending: false });

  const vesselList = vessels || [];
  const vesselCount = vesselList.length;
  const atLimit = access.vesselLimit !== null && vesselCount >= access.vesselLimit;
  const vesselIds = vesselList.map((v) => v.id as string);

  const crewCountMap: Record<string, number> = {};
  const vesselNameMap: Record<string, string> = {};
  vesselList.forEach((v) => {
    vesselNameMap[v.id as string] = v.name as string;
  });

  let activeCrew: Record<string, unknown>[] = [];
  let historyCrew: Record<string, unknown>[] = [];
  let plannedCrew: Record<string, unknown>[] = [];

  if (vesselIds.length > 0) {
    const { data: allCrew } = await supabase
      .from("fleet_crew")
      .select("id, full_name, rank, vessel_id, status, join_date, departure_date, notes, expected_join_date, planning_country, planning_status")
      .in("vessel_id", vesselIds)
      .order("created_at", { ascending: false });

    const list = allCrew || [];
    activeCrew = list.filter((c) => (c.status as string) === "active");
    historyCrew = list.filter((c) => (c.status as string) === "signed_off").slice(0, 10);
    plannedCrew = list.filter((c) => (c.status as string) === "planned");

    activeCrew.forEach((c) => {
      const vid = c.vessel_id as string;
      crewCountMap[vid] = (crewCountMap[vid] || 0) + 1;
    });
  }

  const fmtDwt = (d: number | null) => (d ? Number(d).toLocaleString("en-US") + " DWT" : null);
  const fmtDate = (d: string | null) =>
    d
      ? new Date(d + "T00:00:00").toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  const rankSet = new Set<string>();
  historyCrew.forEach((c) => { if (c.rank) rankSet.add(c.rank as string); });
  plannedCrew.forEach((c) => { if (c.rank) rankSet.add(c.rank as string); });
  const rankOptions = Array.from(rankSet).sort();

  const historyCrewFiltered = historyCrew.filter((c) => {
    if (fVessel && (c.vessel_id as string) !== fVessel) return false;
    if (fRank && (c.rank as string) !== fRank) return false;
    return true;
  });
  const plannedCrewFiltered = plannedCrew.filter((c) => {
    if (fVessel && (c.vessel_id as string) !== fVessel) return false;
    if (fRank && (c.rank as string) !== fRank) return false;
    return true;
  });

  let alertPassport = 0;
  let alertHealth = 0;
  let alertVisa = 0;
  let alertStcw = 0;
  if (vesselIds.length > 0) {
    const { data: expiryRows } = await supabase
      .from("fleet_crew")
      .select("passport_expiry, health_report_expiry, visa_expiry, stcw_endorsement_expiry")
      .in("vessel_id", vesselIds)
      .eq("status", "active");

    const today2 = new Date();
    today2.setHours(0, 0, 0, 0);
    const dayMs2 = 24 * 3600 * 1000;
    const isSoonOrExpired = (d: string | null) => {
      if (!d) return false;
      const days = Math.round((new Date(d + "T00:00:00").getTime() - today2.getTime()) / dayMs2);
      return days <= 30;
    };

    (expiryRows || []).forEach((r) => {
      if (isSoonOrExpired(r.passport_expiry as string | null)) alertPassport++;
      if (isSoonOrExpired(r.health_report_expiry as string | null)) alertHealth++;
      if (isSoonOrExpired(r.visa_expiry as string | null)) alertVisa++;
      if (isSoonOrExpired(r.stcw_endorsement_expiry as string | null)) alertStcw++;
    });
  }
  const totalAlerts = alertPassport + alertHealth + alertVisa + alertStcw;
  const { data: auditRows } = await supabase
    .from("fleet_audit_log")
    .select("action, detail, actor_email, created_at")
    .eq("company_id", user.id)
    .order("created_at", { ascending: false })
    .limit(6);

  const actionIcon = (a: string) => {
    if (a.includes("added")) return "➕";
    if (a.includes("deleted") || a.includes("removed")) return "🗑️";
    if (a.includes("signed_off")) return "📤";
    if (a.includes("rehired")) return "🔄";
    if (a.includes("activated")) return "📥";
    if (a.includes("updated")) return "✏️";
    return "•";
  };

  const fmtWhen = (d: string) => {
    const diffMs = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return mins + "m ago";
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + "h ago";
    const days = Math.floor(hrs / 24);
    return days + "d ago";
  };

  return (
    <>
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:940px;margin:0 auto;padding:0 20px}
  .fl-hero{position:relative;padding:36px 0 20px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:16px}
  .back:hover{color:var(--gold)}
  h1{font-family:var(--disp);font-size:clamp(1.7rem,4.2vw,2.5rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:8px}
  .sub{font-size:14px;color:var(--tx2);line-height:1.6}
  section{padding:20px 0 44px}
  .stitle{display:flex;align-items:center;gap:9px;font-size:12.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin:28px 0 12px}
  .banner{border-radius:13px;padding:13px 17px;font-size:13px;margin-bottom:16px;border:1px solid;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .banner.ok{color:var(--grn);border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.08)}
  .banner.err{color:#f87171;border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
  .banner.info{color:var(--gold);border-color:rgba(251,191,36,.3);background:rgba(251,191,36,.08)}
  .alertpanel{display:flex;align-items:flex-start;gap:14px;border:1.5px solid rgba(239,68,68,.35);background:rgba(239,68,68,.07);border-radius:15px;padding:16px 18px;margin-bottom:18px}
  .alertpanel .ai{font-size:20px;flex-shrink:0;margin-top:1px}
  .alertpanel b{font-family:var(--disp);font-size:14px;display:block;margin-bottom:4px;color:var(--tx)}
  .alertpanel p{font-size:12.5px;color:var(--tx2);line-height:1.6}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:12.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:9px 16px;font-family:var(--body);white-space:nowrap}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-gold:hover{transform:translateY(-2px)}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:22px 24px;margin-bottom:20px}
  .card h2{font-family:var(--disp);font-size:16px;font-weight:800;margin-bottom:14px}
  .frow{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr 1fr auto;gap:10px;align-items:end}
  @media(max-width:900px){.frow{grid-template-columns:1fr 1fr}}
  label{display:block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--tx3);margin-bottom:6px}
  input[type=text],input[type=number],input[type=date],select{width:100%;background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:11px;padding:11px 13px;font-family:var(--body);font-size:13.5px;outline:none}
  input:focus,select:focus{border-color:var(--gold)}
  input:disabled{opacity:.5;cursor:not-allowed}
  select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23fbbf24' d='M6 8L0 0h12z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 0.85rem center;padding-right:2.2rem}
  .btn-add{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:13.5px;cursor:pointer;transition:.18s;border:none;padding:11px 19px;font-family:var(--body)}
  .btn-add.on{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-add.on:hover{transform:translateY(-2px)}
  .vgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}
  .vcard{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:16px;padding:20px;text-decoration:none;color:var(--tx);transition:.2s;display:block;position:relative}
  .vcard:hover{transform:translateY(-3px);border-color:var(--gold)}
  .vcard .vi{font-size:24px;margin-bottom:10px}
  .vcard b{font-family:var(--disp);font-size:16px;display:block;margin-bottom:4px}
  .vcard p{font-size:12px;color:var(--tx3);line-height:1.6}
  .vdel{position:absolute;top:14px;right:14px}
  .vdel button{background:none;border:1px solid var(--line2);color:var(--tx3);border-radius:8px;padding:5px 9px;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--body)}
  .vdel button:hover{color:#f87171;border-color:rgba(239,68,68,.4)}
  .empty{text-align:center;padding:30px 12px;font-size:13.5px;color:var(--tx2);line-height:1.7}
  .plist{display:flex;flex-direction:column;gap:9px}
  .prow{display:flex;align-items:center;gap:12px;border:1px solid var(--line2);border-radius:13px;padding:12px 14px;background:rgba(255,255,255,.02);flex-wrap:wrap}
  .pavatar{flex-shrink:0;width:38px;height:38px;border-radius:11px;background:rgba(251,191,36,.13);border:1px solid rgba(251,191,36,.3);display:grid;place-items:center;font-family:var(--disp);font-weight:800;font-size:13px;color:var(--gold)}
  .pinfo{flex:1;min-width:160px}
  .pname{font-family:var(--disp);font-weight:700;font-size:13.5px}
  .pmeta{font-size:11.5px;color:var(--tx3);margin-top:2px}
  .ppill{font-size:10px;font-weight:800;border-radius:999px;padding:4px 10px;border:1px solid;white-space:nowrap}
  .ppill.confirmed{color:var(--grn);border-color:rgba(52,211,153,.35);background:rgba(52,211,153,.08)}
  .ppill.tentative{color:var(--gold);border-color:rgba(251,191,36,.35);background:rgba(251,191,36,.08)}
  .ppill.docs{color:#f87171;border-color:rgba(239,68,68,.35);background:rgba(239,68,68,.08)}
  .pacts{display:flex;gap:6px;flex-shrink:0}
  .pacts button{background:none;border:1px solid var(--line2);color:var(--tx3);border-radius:8px;padding:6px 11px;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--body)}
  .pacts button.go{color:var(--grn);border-color:rgba(52,211,153,.4)}
  .pacts button.go:hover{background:rgba(52,211,153,.1)}
  .pacts button.x:hover{color:#f87171;border-color:rgba(239,68,68,.4)}
  .ptarget{font-family:var(--disp);font-weight:800;font-size:13px;color:var(--gold);margin-top:2px}
  .rehireform{display:flex;gap:7px;align-items:center;flex-shrink:0}
  .rehiresel{background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:8px;padding:6px 9px;font-size:11.5px;font-family:var(--body);cursor:pointer;max-width:130px}
  .rehiresel:focus{border-color:var(--gold)}
  .alist{display:flex;flex-direction:column;gap:2px}
  .arow{display:flex;align-items:center;gap:10px;padding:9px 4px;border-bottom:1px solid var(--line2);font-size:12.5px}
  .arow:last-child{border-bottom:none}
  .aic{flex-shrink:0;font-size:13px}
  .atext{flex:1;color:var(--tx2)}
  .awhen{flex-shrink:0;color:var(--tx3);font-size:11px;white-space:nowrap}
  .filterbar{display:flex;gap:10px;align-items:center;margin-bottom:6px;flex-wrap:wrap}
  .filtersel{background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:10px;padding:9px 13px;font-size:12.5px;font-family:var(--body);cursor:pointer;min-width:140px}
  .filtersel:focus{border-color:var(--gold)}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader isLoggedIn={true} userType="company" unreadCount={unreadCount || 0} active={null} />
      <div className="fl-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/dashboard" className="back">← Back to dashboard</Link>
          <h1>My <span style={{ color: "var(--gold)" }}>Fleet</span></h1>
          <p className="sub">
            {vesselCount} vessel{vesselCount === 1 ? "" : "s"}
            {access.vesselLimit !== null ? ` · ${access.vesselLimit} included on your plan` : " · unlimited on Fleet plan"} — manage crew records for each one.
          </p>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {totalAlerts > 0 ? (
            <div className="alertpanel">
              <div className="alertpanel">
              <span className="ai">⚠️</span>
              <div style={{ flex: 1, minWidth: 200 }}>
                <b>{totalAlerts} document{totalAlerts === 1 ? "" : "s"} expiring within 30 days across your fleet</b>
                <p>
                  {alertPassport > 0 ? alertPassport + " passport" + (alertPassport === 1 ? "" : "s") + " · " : ""}
                  {alertHealth > 0 ? alertHealth + " health report" + (alertHealth === 1 ? "" : "s") + " · " : ""}
                  {alertVisa > 0 ? alertVisa + " visa" + (alertVisa === 1 ? "" : "s") + " · " : ""}
                  {alertStcw > 0 ? alertStcw + " STCW endorsement" + (alertStcw === 1 ? "" : "s") : ""}
                </p>
              </div>
            </div>
          ) : null}
          {added === "1" ? <div className="banner ok">Vessel added.</div> : null}
          {deleted === "1" ? <div className="banner ok">Removed.</div> : null}
          {planned === "1" ? <div className="banner ok">Planned crew member added.</div> : null}
          {error === "missing" ? <div className="banner err">Please fill in the required fields.</div> : null}
          {error === "failed" ? <div className="banner err">Something went wrong — please try again.</div> : null}
          {error === "limit" ? (
            <div className="banner err">
              <span>You&apos;ve used your {access.vesselLimit} free vessel — upgrade to Fleet for unlimited vessels.</span>
              <Link href="/upgrade" className="btn btn-gold">Upgrade to Fleet →</Link>
            </div>
          ) : null}
          {!atLimit && access.vesselLimit !== null && vesselCount === 0 ? (
            <div className="banner info">
              You can add 1 vessel free and use every Fleet feature on it. Add a second vessel anytime with the Fleet plan.
            </div>
          ) : null}

          <div className="card">
            <h2>+ Add a vessel</h2>
            {atLimit ? (
              <div className="frow">
                <div>
                  <label htmlFor="name">Vessel name</label>
                  <input id="name" type="text" disabled placeholder="Upgrade to add another vessel" />
                </div>
                <div>
                  <label htmlFor="vesselType">Type</label>
                  <input id="vesselType" type="text" disabled />
                </div>
                <div>
                  <label htmlFor="flag">Flag</label>
                  <input id="flag" type="text" disabled />
                </div>
                <div>
                  <label htmlFor="dwt">DWT</label>
                  <input id="dwt" type="text" disabled />
                </div>
                <div>
                  <label htmlFor="imoNumber">IMO number</label>
                  <input id="imoNumber" type="text" disabled />
                </div>
                <Link href="/upgrade" className="btn-add on" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                  Upgrade →
                </Link>
              </div>
            ) : (
              <form action={addVessel}>
                <div className="frow">
                  <div>
                    <label htmlFor="name">Vessel name</label>
                    <input id="name" name="name" type="text" required maxLength={100} placeholder="e.g. MV Ocean Star" />
                  </div>
                  <div>
                    <label htmlFor="vesselType">Type</label>
                    <input id="vesselType" name="vesselType" type="text" maxLength={60} placeholder="e.g. Bulk Carrier" />
                  </div>
                  <div>
                    <label htmlFor="flag">Flag</label>
                    <input id="flag" name="flag" type="text" maxLength={60} placeholder="e.g. Panama" />
                  </div>
                  <div>
                    <label htmlFor="dwt">DWT</label>
                    <input id="dwt" name="dwt" type="number" min="0" placeholder="e.g. 55000" />
                  </div>
                  <div>
                    <label htmlFor="imoNumber">IMO number</label>
                    <input id="imoNumber" name="imoNumber" type="text" maxLength={20} placeholder="Optional" />
                  </div>
                  <button type="submit" className="btn-add on">+ Add</button>
                </div>
              </form>
            )}
          </div>

          {vesselList.length === 0 ? (
            <div className="empty">
              No vessels yet — add your first one above to start tracking crew.
            </div>
          ) : (
            <div className="vgrid">
              {vesselList.map((v) => {
                const dwtLabel = fmtDwt(v.dwt as number | null);
                const metaParts = [
                  (v.vessel_type as string) || null,
                  (v.flag as string) ? "Flag: " + (v.flag as string) : null,
                  dwtLabel,
                ].filter(Boolean);
                return (
                  <div key={v.id as string} style={{ position: "relative" }}>
                    <Link href={`/fleet/${v.id}`} className="vcard">
                      <div className="vi">🚢</div>
                      <b>{v.name as string}</b>
                      <p>
                        {metaParts.length > 0 ? metaParts.join(" · ") : "Vessel details not set"}
                        <br />
                        {crewCountMap[v.id as string] || 0} active crew
                      </p>
                    </Link>
                    <div className="vdel">
                      <form action={deleteVessel}>
                        <input type="hidden" name="vesselId" value={v.id as string} />
                        <button type="submit">✕</button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {vesselList.length > 0 ? (
            <>
              <div className="filterbar">
                <form method="get" style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: 1 }}>
                  <select name="fVessel" defaultValue={fVessel} className="filtersel">
                    <option value="">All vessels</option>
                    {vesselList.map((v) => (
                      <option key={v.id as string} value={v.id as string}>{v.name as string}</option>
                    ))}
                  </select>
                  <select name="fRank" defaultValue={fRank} className="filtersel">
                    <option value="">All ranks</option>
                    {rankOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <button type="submit" className="btn btn-gold" style={{ padding: "9px 16px" }}>Filter</button>
                  {(fVessel || fRank) ? (
                    <Link href="/fleet" className="btn" style={{ color: "var(--tx3)", border: "1px solid var(--line2)" }}>Clear</Link>
                  ) : null}
                </form>
              </div>

              <div className="stitle">📜 Crew history — all vessels</div>
              <div className="card">
                {historyCrewFiltered.length === 0 ? (
                  <div className="empty">{historyCrew.length === 0 ? "No sign-offs recorded yet." : "No results match your filter."}</div>
                ) : (
              <div className="plist">
                    {historyCrewFiltered.map((c) => (
                      <div key={c.id as string} className="prow">
                        <div className="pavatar">{(c.full_name as string || "?").charAt(0).toUpperCase()}</div>
                        <div className="pinfo">
                          <Link href={`/fleet/${c.vessel_id}/${c.id}`} className="pname" style={{ textDecoration: "none" }}>
                            {c.full_name as string}
                          </Link>
                          <div className="pmeta">
                            {(c.rank as string) || "Crew"} · was on {vesselNameMap[c.vessel_id as string] || "Unknown vessel"} · signed off {fmtDate(c.departure_date as string | null)}
                            {c.notes ? " · has notes" : ""}
                          </div>
                        </div>
                        <form action={rehireCrew} className="rehireform">
                          <input type="hidden" name="crewId" value={c.id as string} />
                          <select name="targetVesselId" required defaultValue="" className="rehiresel">
                            <option value="" disabled>Rehire to…</option>
                            {vesselList.map((v) => (
                              <option key={v.id as string} value={v.id as string}>{v.name as string}</option>
                            ))}
                          </select>
                          <button type="submit" className="go">🔄 Rehire</button>
                        </form>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="stitle">📅 Planned sign-on — all vessels</div>
              <div className="card">
                <form action={addPlannedCrew} style={{ marginBottom: 16 }}>
                  <div className="frow">
                    <div>
                      <label htmlFor="pFullName">Full name</label>
                      <input id="pFullName" name="fullName" type="text" required maxLength={100} placeholder="e.g. Ahmed Yilmaz" />
                    </div>
                    <div>
                      <label htmlFor="pRank">Rank</label>
                      <input id="pRank" name="rank" type="text" maxLength={60} placeholder="e.g. 2nd Engineer" />
                    </div>
                    <div>
                      <label htmlFor="pVessel">Vessel</label>
                      <select id="pVessel" name="vesselId" required defaultValue="">
                        <option value="" disabled>Select vessel</option>
                        {vesselList.map((v) => (
                          <option key={v.id as string} value={v.id as string}>{v.name as string}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="pDate">Expected join</label>
                      <input id="pDate" name="expectedJoinDate" type="date" />
                    </div>
                    <div>
                      <label htmlFor="pCountry">Country</label>
                      <input id="pCountry" name="planningCountry" type="text" maxLength={60} placeholder="e.g. Philippines" />
                    </div>
                    <button type="submit" className="btn-add on">+ Plan</button>
                  </div>
                </form>

                {plannedCrewFiltered.length === 0 ? (
                  <div className="empty">{plannedCrew.length === 0 ? "No planned sign-ons yet — use the form above." : "No results match your filter."}</div>
                ) : (
                  <div className="plist">
                    {plannedCrewFiltered.map((c) => {
                      const statusRaw = ((c.planning_status as string) || "Tentative").toLowerCase();
                      const pillClass =
                        statusRaw.includes("confirm") ? "confirmed" : statusRaw.includes("doc") ? "docs" : "tentative";
                      return (
                        <div key={c.id as string} className="prow">
                          <div className="pavatar">{(c.full_name as string || "?").charAt(0).toUpperCase()}</div>
                          <div className="pinfo">
                            <div className="pname">{c.full_name as string}</div>
                            <div className="ptarget">→ {vesselNameMap[c.vessel_id as string] || "Unknown vessel"}</div>
                            <div className="pmeta">
                              {(c.rank as string) || "Crew"} · expected {fmtDate(c.expected_join_date as string | null)}
                              {c.planning_country ? " · " + (c.planning_country as string) : ""}
                            </div>
                          </div>
                          <span className={`ppill ${pillClass}`}>{(c.planning_status as string) || "Tentative"}</span>
                          <div className="pacts">
                            <form action={activatePlannedCrew}>
                              <input type="hidden" name="crewId" value={c.id as string} />
                              <input type="hidden" name="vesselId" value={c.vessel_id as string} />
                              <button type="submit" className="go">Sign on</button>
                            </form>
                            <form action={deletePlannedCrew}>
                              <input type="hidden" name="crewId" value={c.id as string} />
                              <button type="submit" className="x">✕</button>
                            </form>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : null}

          {auditRows && auditRows.length > 0 ? (
            <>
              <div className="stitle">🕐 Recent activity</div>
              <div className="card">
                <div className="alist">
                  {auditRows.map((a, idx) => (
                    <div key={idx} className="arow">
                      <span className="aic">{actionIcon(a.action as string)}</span>
                      <span className="atext">{a.detail as string}</span>
                      <span className="awhen">{fmtWhen(a.created_at as string)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <footer>
        <div className="wrap">© 2026 ShipCrewFinder · <Link href="/dashboard">Dashboard</Link></div>
      </footer>
    </>
  );
}
