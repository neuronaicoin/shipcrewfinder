import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { addFleetCrew, deleteFleetCrew, activatePlannedCrew, deletePlannedCrew, rehireCrew, updateCrewNote } from "@/lib/actions/fleet";

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

  const { data: allVessels } = await supabase
    .from("vessels")
    .select("id, name")
    .eq("company_id", user.id)
    .order("created_at", { ascending: false });
  const vesselList = allVessels || [];

  const { data: allCrew } = await supabase
    .from("fleet_crew")
    .select("id, full_name, rank, nationality, sex, date_of_birth, join_date, departure_date, passport_number, passport_expiry, seaman_book_number, seaman_book_expiry, health_report_expiry, visa_expiry, status, notes, expected_join_date, planning_country, planning_status")
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
            <>
              <div className="ttwrap">
                <table className="ctable">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Surname and Name</th>
                      <th>Sex</th>
                      <th>Rank</th>
                      <th>Nationality</th>
                      <th>Date of Birth</th>
                      <th>Join Date</th>
                      <th>Passport No</th>
                      <th>Passport Exp</th>
                      <th>Seaman Book No</th>
                      <th>Seaman Book Exp</th>
                      <th>Health Exp</th>
                      <th>Visa Exp</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {crewList.map((c, idx) => {
                      const passportSt = expiryStatus(c.passport_expiry as string | null);
                      const seamanSt = expiryStatus(c.seaman_book_expiry as string | null);
                      const healthSt = expiryStatus(c.health_report_expiry as string | null);
                      const visaSt = expiryStatus(c.visa_expiry as string | null);
                      return (
                        <tr key={c.id as string}>
                          <td>{idx + 1}</td>
                          <td>
                            <Link href={`/fleet/${vesselId}/${c.id}`} className="tname">
                              {c.full_name as string}
                            </Link>
                          </td>
                          <td>{(c.sex as string) || "—"}</td>
                          <td>{(c.rank as string) || "—"}</td>
                          <td>{(c.nationality as string) || "—"}</td>
                          <td>{fmtDate(c.date_of_birth as string | null)}</td>
                          <td>{fmtDate(c.join_date as string | null)}</td>
                          <td>{(c.passport_number as string) || "—"}</td>
                          <td className={`texp ${passportSt}`}>{fmtDate(c.passport_expiry as string | null)}</td>
                          <td>{(c.seaman_book_number as string) || "—"}</td>
                          <td className={`texp ${seamanSt}`}>{fmtDate(c.seaman_book_expiry as string | null)}</td>
                          <td className={`texp ${healthSt}`}>{fmtDate(c.health_report_expiry as string | null)}</td>
                          <td className={`texp ${visaSt}`}>{fmtDate(c.visa_expiry as string | null)}</td>
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
                      );
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
                      <form action={rehireCrew} className="rehireform">
                        <input type="hidden" name="crewId" value={c.id as string} />
                        <select name="targetVesselId" required defaultValue={vesselId} className="rehiresel">
                          {vesselList.map((v) => (
                            <option key={v.id as string} value={v.id as string}>{v.name as string}</option>
                          ))}
                        </select>
                        <button type="submit" className="go">🔄 Rehire</button>
                      </form>
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
