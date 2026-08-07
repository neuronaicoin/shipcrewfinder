import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { addFleetCrew, deleteFleetCrew, activatePlannedCrew, deletePlannedCrew, rehireCrew, updateCrewNote, addCustomColumn, removeCustomColumn, moveToPlannedFromHistory, moveColumn, renameColumn } from "@/lib/actions/fleet";
import { getEffectiveColumns } from "@/lib/fleet-columns";

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
  const noteFor = sp.noteFor || "";
  const noteadded = sp.noteadded;
  const ccadded = sp.ccadded;
  const ccremoved = sp.ccremoved;
  const ccerror = sp.ccerror;
  const colrenamed = sp.colrenamed;

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
    .select("id, name, imo_number, vessel_type, flag, dwt, custom_columns, column_order, column_labels")
    .eq("id", vesselId)
    .eq("company_id", user.id)
    .maybeSingle();

  if (!vessel) notFound();

  const { data: allVessels } = await supabase
    .from("vessels")
    .select("id, name")
    .eq("company_id", user.id)
    .order("created_at", { ascending: false });
  const vesselList = allVessels || [];

  const { data: allCrew } = await supabase
    .from("fleet_crew")
    .select("id, full_name, rank, nationality, sex, date_of_birth, join_date, departure_date, passport_number, passport_expiry, seaman_book_number, seaman_book_expiry, health_report_expiry, visa_expiry, status, notes, custom_values, expected_join_date, planning_country, planning_status, emergency_contact_name, emergency_contact_phone")
    .eq("vessel_id", vesselId)
    .order("sort_order", { ascending: true });

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

  const customColumns: string[] = Array.isArray(vessel.custom_columns) ? (vessel.custom_columns as string[]) : [];
  const columnOrder: string[] = Array.isArray(vessel.column_order) ? (vessel.column_order as string[]) : [];
  const columnLabels: Record<string, string> = (vessel.column_labels as Record<string, string>) || {};
  const effectiveColumns = getEffectiveColumns(columnOrder, columnLabels, customColumns).filter(
    (c) => c.key !== "name"
  );

  const getCellValue = (key: string, c: Record<string, unknown>): { value: string; expClass: string | null } => {
    switch (key) {
      case "sex":
        return { value: (c.sex as string) || "—", expClass: null };
      case "rank":
        return { value: (c.rank as string) || "—", expClass: null };
      case "nationality":
        return { value: (c.nationality as string) || "—", expClass: null };
      case "dob":
        return { value: fmtDate(c.date_of_birth as string | null), expClass: null };
      case "join_date":
        return { value: fmtDate(c.join_date as string | null), expClass: null };
      case "passport_no":
        return { value: (c.passport_number as string) || "—", expClass: null };
      case "passport_exp":
        return { value: fmtDate(c.passport_expiry as string | null), expClass: expiryStatus(c.passport_expiry as string | null) };
      case "seaman_no":
        return { value: (c.seaman_book_number as string) || "—", expClass: null };
      case "seaman_exp":
        return { value: fmtDate(c.seaman_book_expiry as string | null), expClass: expiryStatus(c.seaman_book_expiry as string | null) };
      case "health_exp":
        return { value: fmtDate(c.health_report_expiry as string | null), expClass: expiryStatus(c.health_report_expiry as string | null) };
      case "visa_exp":
        return { value: fmtDate(c.visa_expiry as string | null), expClass: expiryStatus(c.visa_expiry as string | null) };
      default: {
        const cv = (c.custom_values as Record<string, string>) || {};
        return { value: cv[key] || "—", expClass: null };
      }
    }
  };

  const getReadiness = (c: Record<string, unknown>): number => {
    const checks: boolean[] = [];
    checks.push(!!(c.passport_number && expiryStatus(c.passport_expiry as string | null) !== "expired" && c.passport_expiry));
    checks.push(!!(c.seaman_book_number && expiryStatus(c.seaman_book_expiry as string | null) !== "expired" && c.seaman_book_expiry));
    checks.push(!!(c.health_report_expiry && expiryStatus(c.health_report_expiry as string | null) !== "expired"));
    checks.push(!!(c.emergency_contact_name && c.emergency_contact_phone));
    checks.push(!!c.nationality);
    const passed = checks.filter(Boolean).length;
    return Math.round((passed / checks.length) * 100);
  };

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
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:920px;margin:0 auto;padding:0 20px}
  .vc-hero{position:relative;padding:36px 0 20px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:16px}
  .back:hover{color:var(--gold)}
  h1{font-family:var(--disp);font-size:clamp(1.7rem,4.2vw,2.4rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:6px}
  .sub{font-size:14px;color:var(--tx2)}
  .hrow{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .btn-export{display:inline-flex;align-items:center;gap:7px;background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.35);color:var(--gold);border-radius:10px;padding:9px 15px;font-weight:700;font-size:12.5px;text-decoration:none;white-space:nowrap;flex-shrink:0;margin-top:4px}
  .btn-export:hover{background:rgba(251,191,36,.18)}
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
  .ttwrap{overflow-x:auto;-webkit-overflow-scrolling:touch;border-radius:14px;border:1px solid var(--line2)}
  table.ctable{width:100%;border-collapse:collapse;min-width:920px;font-size:12.5px}
  table.ctable thead th{text-align:left;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--tx3);padding:11px 12px;background:rgba(255,255,255,.03);border-bottom:1px solid var(--line2);white-space:nowrap}
  table.ctable tbody td{padding:11px 12px;border-bottom:1px solid var(--line2);white-space:nowrap;color:var(--tx2)}
  table.ctable tbody tr:last-child td{border-bottom:none}
  table.ctable tbody tr:hover{background:rgba(251,191,36,.04)}
  table.ctable .tname{color:var(--tx);font-weight:700;text-decoration:none;font-family:var(--disp)}
  table.ctable .tname:hover{color:var(--gold)}
  table.ctable .texp{font-weight:700}
  table.ctable .texp.expired{color:var(--red)}
  table.ctable .texp.soon{color:var(--gold)}
  table.ctable .texp.ok{color:var(--tx2);font-weight:500}
  table.ctable .tdel{background:none;border:1px solid var(--line2);color:var(--tx3);border-radius:7px;padding:4px 9px;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--body)}
  table.ctable .tdel:hover{color:var(--red);border-color:rgba(239,68,68,.4)}
  .tnote{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;font-size:15px;padding:4px 6px;border-radius:6px}
  .tnote:hover{background:rgba(251,191,36,.1)}
  .notepanel{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1.5px solid rgba(251,191,36,.35);border-radius:16px;padding:20px 22px;margin-top:14px}
  .notepanel-head{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:12px}
  .notepanel-head b{font-family:var(--disp);font-size:14px}
  .noteclose{color:var(--tx3);text-decoration:none;font-size:12px;font-weight:700}
  .noteclose:hover{color:var(--gold)}
  .notepanel textarea{width:100%;background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:11px;padding:12px 14px;font-family:var(--body);font-size:13.5px;outline:none;min-height:110px;resize:vertical;margin-bottom:12px}
  .notepanel textarea:focus{border-color:var(--gold)}
  .thint{font-size:11px;color:var(--tx3);margin-top:8px;text-align:center}
  .empty{text-align:center;padding:30px 12px;font-size:13.5px;color:var(--tx2);line-height:1.7}
  .pacts{display:flex;gap:6px;flex-shrink:0}
  .pacts button{background:none;border:1px solid var(--line2);color:var(--tx3);border-radius:8px;padding:6px 11px;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--body)}
  .pacts button.go{color:var(--grn);border-color:rgba(52,211,153,.4)}
  .pacts button.go:hover{background:rgba(52,211,153,.1)}
  .rehireform{display:flex;gap:7px;align-items:center;flex-shrink:0}
  .rehiresel{background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:8px;padding:6px 9px;font-size:11.5px;font-family:var(--body);cursor:pointer;max-width:150px}
  .rehiresel:focus{border-color:var(--gold)}
  .histacts{display:flex;flex-direction:column;gap:6px;flex-shrink:0}
  .planbtn{background:rgba(96,165,250,.1);border:1px solid rgba(96,165,250,.4);color:#60a5fa;border-radius:8px;padding:6px 11px;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--body)}
  .planbtn:hover{background:rgba(96,165,250,.18)}
  .filehint{font-size:11px;color:var(--tx3)}
  .cclist{display:flex;flex-wrap:wrap;gap:8px}
  .ccchip{display:flex;align-items:center;gap:8px;background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.3);border-radius:999px;padding:6px 8px 6px 14px;font-size:12px;font-weight:700;color:var(--gold)}
  .ccchip button{background:none;border:none;color:var(--tx3);cursor:pointer;font-size:11px;width:20px;height:20px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center}
  .ccchip button:hover{color:var(--red);background:rgba(239,68,68,.1)}
  .colmglist{display:flex;flex-direction:column;gap:8px}
  .colmgrow{display:flex;align-items:center;gap:12px;border:1px solid var(--line2);border-radius:12px;padding:9px 12px;background:rgba(255,255,255,.02)}
  .colmgmove{display:flex;gap:4px;flex-shrink:0}
  .colmgmove button{width:28px;height:28px;background:var(--navy);border:1px solid var(--line2);color:var(--tx2);border-radius:7px;cursor:pointer;font-size:13px;font-weight:800}
  .colmgmove button:hover:not(:disabled){border-color:var(--gold);color:var(--gold)}
  .colmgmove button:disabled{opacity:.3;cursor:not-allowed}
  .colmgrename{display:flex;gap:8px;flex:1;align-items:center}
  .colmgrename input{background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:8px;padding:7px 11px;font-size:12.5px;font-family:var(--body);flex:1}
  .colmgrename input:focus{border-color:var(--gold);outline:none}
  .colmgrename button{background:none;border:1px solid var(--line2);color:var(--tx3);border-radius:8px;padding:7px 13px;font-size:11.5px;font-weight:700;cursor:pointer;font-family:var(--body);white-space:nowrap}
  .colmgrename button:hover{color:var(--gold);border-color:var(--gold)}
  .rdybadge{display:inline-block;font-size:11px;font-weight:800;border-radius:999px;padding:3px 10px;border:1px solid}
  .rdybadge.rdy-high{color:var(--grn);border-color:rgba(52,211,153,.4);background:rgba(52,211,153,.1)}
  .rdybadge.rdy-mid{color:var(--gold);border-color:rgba(251,191,36,.4);background:rgba(251,191,36,.1)}
  .rdybadge.rdy-low{color:var(--red);border-color:rgba(239,68,68,.4);background:rgba(239,68,68,.1)}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader isLoggedIn={true} userType="company" unreadCount={unreadCount || 0} active={null} />

      <div className="vc-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <div className="hrow">
            <div>
              <Link href="/fleet" className="back">← My Fleet</Link>
              <h1>🚢 {vessel.name as string}</h1>
              <p className="sub">
                {metaParts.length > 0 ? metaParts.join(" · ") : "Vessel details not set"} ·{" "}
                {crewList.length} active crew member{crewList.length === 1 ? "" : "s"}
              </p>
            </div>
            {crewList.length > 0 ? (
              <a href={`/fleet/${vesselId}/export`} className="btn-export">⬇ Export crew list</a>
            ) : null}
          </div>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {added === "1" ? <div className="banner ok">Crew member added.</div> : null}
          {deleted === "1" ? <div className="banner ok">Crew member removed.</div> : null}
          {signedoff === "1" ? <div className="banner ok">Moved to crew history.</div> : null}
          {noteadded === "1" ? <div className="banner ok">Note saved.</div> : null}
          {error === "missing" ? <div className="banner err">Full name is required.</div> : null}
          {error === "failed" ? <div className="banner err">Something went wrong — please try again.</div> : null}

          <div className="card">
            <h2>+ Add crew member</h2>
            <form action={addFleetCrew}>
              <input type="hidden" name="vesselId" value={vesselId} />
              <div className="frow">
                <div>
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

          {ccadded === "1" ? <div className="banner ok">Column added.</div> : null}
          {ccremoved === "1" ? <div className="banner ok">Column removed.</div> : null}
          {ccerror === "limit" ? <div className="banner err">Maximum 8 custom columns per vessel.</div> : null}
          {ccerror === "dupe" ? <div className="banner err">A column with that name already exists.</div> : null}

          <div className="card">
            <h2>Custom columns</h2>
            <form action={addCustomColumn} style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: customColumns.length > 0 ? 14 : 0 }}>
              <input type="hidden" name="vesselId" value={vesselId} />
              <input type="text" name="columnName" maxLength={40} placeholder="e.g. Cabin Number" style={{ flex: 1, minWidth: 180, marginBottom: 0 }} />
              <button type="submit" className="btn btn-gold" style={{ width: "auto", padding: "11px 20px" }}>+ Add column</button>
            </form>
            {customColumns.length > 0 ? (
              <div className="cclist">
                {customColumns.map((col) => (
                  <div key={col} className="ccchip">
                    <span>{col}</span>
                    <form action={removeCustomColumn}>
                      <input type="hidden" name="vesselId" value={vesselId} />
                      <input type="hidden" name="columnName" value={col} />
                      <button type="submit">✕</button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="filehint">No custom columns yet — add one above (e.g. Cabin Number, Union Membership).</p>
            )}
          </div>

          {colrenamed === "1" ? <div className="banner ok">Column renamed.</div> : null}

          <div className="card">
            <h2>Manage columns</h2>
            <p className="filehint" style={{ marginBottom: 12 }}>
              Reorder or rename table columns. &quot;No&quot; and name always stay first.
            </p>
            <div className="colmglist">
              {effectiveColumns.map((col, idx) => (
                <div key={col.key} className="colmgrow">
                  <div className="colmgmove">
                    <form action={moveColumn}>
                      <input type="hidden" name="vesselId" value={vesselId} />
                      <input type="hidden" name="columnKey" value={col.key} />
                      <input type="hidden" name="direction" value="up" />
                      <button type="submit" disabled={idx === 0}>↑</button>
                    </form>
                    <form action={moveColumn}>
                      <input type="hidden" name="vesselId" value={vesselId} />
                      <input type="hidden" name="columnKey" value={col.key} />
                      <input type="hidden" name="direction" value="down" />
                      <button type="submit" disabled={idx === effectiveColumns.length - 1}>↓</button>
                    </form>
                  </div>
                  <form action={renameColumn} className="colmgrename">
                    <input type="hidden" name="vesselId" value={vesselId} />
                    <input type="hidden" name="columnKey" value={col.key} />
                    <input type="text" name="newLabel" defaultValue={col.label} maxLength={40} />
                    <button type="submit">Rename</button>
                  </form>
                </div>
              ))}
            </div>
          </div>

          {crewList.length === 0 ? (
            <div className="empty">
              No active crew members yet — use the form above to add your first one.
            </div>
          ) : (
            <>
              <div className="ttwrap">
                <table className="ctable">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Surname and Name</th>
                      <th>Ready</th>
                      {effectiveColumns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {crewList.map((c, idx) => {
                      return (
                        <tr key={c.id as string}>
                          <td>{idx + 1}</td>
                          <td>
                            <Link href={`/fleet/${vesselId}/${c.id}`} className="tname">
                              {c.full_name as string}
                            </Link>
                          </td>
                          <td>
                            {(() => {
                              const r = getReadiness(c);
                              const cls = r >= 80 ? "rdy-high" : r >= 50 ? "rdy-mid" : "rdy-low";
                              return <span className={`rdybadge ${cls}`}>{r}%</span>;
                            })()}
                          </td>
                          {effectiveColumns.map((col) => {
                            const cell = getCellValue(col.key, c);
                            return (
                              <td key={col.key} className={cell.expClass ? `texp ${cell.expClass}` : undefined}>
                                {cell.value}
                              </td>
                            );
                          })}
                          <td>
                            <a href={`?noteFor=${c.id}`} className="tnote" title={c.notes ? "Has notes" : "Add note"}>
                              {c.notes ? "📝" : "📄"}
                            </a>
                          </td>
                          <td>
                            <form action={deleteFleetCrew}>
                              <input type="hidden" name="crewId" value={c.id as string} />
                              <input type="hidden" name="vesselId" value={vesselId} />
                              <button type="submit" className="tdel">✕</button>
                            </form>
                          </td>
                        </tr>
                        })}
                  </tbody>
                </table>
              </div>
              <p className="thint">← Scroll sideways to see all columns · tap a name to view full record →</p>
            </>
          )}

          {noteFor ? (() => {
            const noteCrew = crewList.find((c) => (c.id as string) === noteFor);
            if (!noteCrew) return null;
            return (
              <div className="notepanel">
                <div className="notepanel-head">
                  <b>📝 Note — {noteCrew.full_name as string}</b>
                  <Link href={`/fleet/${vesselId}`} className="noteclose">✕ Close</Link>
                </div>
                <form action={updateCrewNote}>
                  <input type="hidden" name="crewId" value={noteFor} />
                  <input type="hidden" name="vesselId" value={vesselId} />
                  <textarea name="notes" maxLength={2000} placeholder="Add a note about this crew member..." defaultValue={(noteCrew.notes as string) || ""} />
                  <button type="submit" className="btn btn-gold" style={{ width: "auto", padding: "10px 20px" }}>Save note</button>
                </form>
              </div>
            );
          })() : null}

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
                      <div className="histacts">
                        <form action={rehireCrew} className="rehireform">
                          <input type="hidden" name="crewId" value={c.id as string} />
                          <select name="targetVesselId" required defaultValue={vesselId} className="rehiresel">
                            {vesselList.map((v) => (
                              <option key={v.id as string} value={v.id as string}>{v.name as string}</option>
                            ))}
                          </select>
                          <button type="submit" className="go">🔄 Rehire</button>
                        </form>
                        <form action={moveToPlannedFromHistory} className="rehireform">
                          <input type="hidden" name="crewId" value={c.id as string} />
                          <select name="targetVesselId" required defaultValue={vesselId} className="rehiresel">
                            {vesselList.map((v) => (
                              <option key={v.id as string} value={v.id as string}>{v.name as string}</option>
                            ))}
                          </select>
                          <button type="submit" className="planbtn">📅 Add to Planned</button>
                        </form>
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
