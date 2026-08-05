import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getPlanAccess } from "@/lib/plan-access";
import { addVessel, deleteVessel } from "@/lib/actions/fleet";

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

  const myPlan = (profile.plan as string) || "free";
  const access = getPlanAccess(myPlan as never);

  const styles = `
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --navy:#0d1030;--navy2:#141845;--ink:#050716;
    --gold:#fbbf24;--gold2:#e0a010;--line:rgba(251,191,36,.16);--line2:rgba(255,255,255,.08);
    --tx:#eef4fa;--tx2:#a8bdd2;--tx3:#6b83a0;--grn:#34d399;
    --disp:var(--font-bricolage),sans-serif;--body:var(--font-jakarta),sans-serif;
  }
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:880px;margin:0 auto;padding:0 20px}
  .fl-hero{position:relative;padding:36px 0 20px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:16px}
  .back:hover{color:var(--gold)}
  h1{font-family:var(--disp);font-size:clamp(1.7rem,4.2vw,2.5rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:8px}
  .sub{font-size:14px;color:var(--tx2);line-height:1.6}
  section{padding:20px 0 44px}
  .banner{border-radius:13px;padding:13px 17px;font-size:13px;margin-bottom:16px;border:1px solid}
  .banner.ok{color:var(--grn);border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.08)}
  .banner.err{color:#f87171;border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
  .lock{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1.5px solid var(--line);border-radius:20px;padding:36px 26px;text-align:center}
  .lock .lic{width:56px;height:56px;margin:0 auto 18px;border-radius:16px;background:rgba(251,191,36,.13);border:1px solid rgba(251,191,36,.3);display:grid;place-items:center;font-size:24px}
  .lock h2{font-family:var(--disp);font-size:22px;font-weight:800;margin-bottom:10px}
  .lock p{font-size:13.5px;color:var(--tx2);line-height:1.65;max-width:48ch;margin:0 auto 22px}
  .lock .feats{display:flex;flex-direction:column;gap:9px;max-width:340px;margin:0 auto 24px;text-align:left}
  .lock .feats span{font-size:13px;color:var(--tx2);display:flex;gap:9px;align-items:center}
  .lock .feats span::before{content:'✓';color:var(--grn);font-weight:800}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:12px 22px;font-family:var(--body)}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-gold:hover{transform:translateY(-2px)}
  .btn-ghost{color:var(--tx);border:1px solid var(--line2);background:transparent}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:22px 24px;margin-bottom:20px}
  .card h2{font-family:var(--disp);font-size:16px;font-weight:800;margin-bottom:14px}
  .frow{display:grid;grid-template-columns:2fr 1fr 1fr auto;gap:10px;align-items:end}
  @media(max-width:700px){.frow{grid-template-columns:1fr}}
  label{display:block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--tx3);margin-bottom:6px}
  input[type=text]{width:100%;background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:11px;padding:11px 13px;font-family:var(--body);font-size:13.5px;outline:none}
  input:focus{border-color:var(--gold)}
  .vgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
  .vcard{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:16px;padding:20px;text-decoration:none;color:var(--tx);transition:.2s;display:block;position:relative}
  .vcard:hover{transform:translateY(-3px);border-color:var(--gold)}
  .vcard .vi{font-size:24px;margin-bottom:10px}
  .vcard b{font-family:var(--disp);font-size:16px;display:block;margin-bottom:4px}
  .vcard p{font-size:12px;color:var(--tx3);line-height:1.5}
  .vdel{position:absolute;top:14px;right:14px}
  .vdel button{background:none;border:1px solid var(--line2);color:var(--tx3);border-radius:8px;padding:5px 9px;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--body)}
  .vdel button:hover{color:#f87171;border-color:rgba(239,68,68,.4)}
  .empty{text-align:center;padding:30px 12px;font-size:13.5px;color:var(--tx2);line-height:1.7}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`;

  // ── Fleet planı yoksa: kilit ekranı ──
  if (!access.canUseFleetManager) {
    return (
      <>
        <style>{styles}</style>
        <SiteHeader isLoggedIn={true} userType="company" unreadCount={unreadCount || 0} active={null} />
        <div className="fl-hero">
          <div className="aur"></div>
          <div className="wrap" style={{ position: "relative" }}>
            <Link href="/dashboard" className="back">← Back to dashboard</Link>
            <h1>My <span style={{ color: "var(--gold)" }}>Fleet</span></h1>
            <p className="sub">Manage every vessel and crew member from one place.</p>
          </div>
        </div>
        <section style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="lock">
              <div className="lic">🚢</div>
              <h2>Fleet Crew Manager</h2>
              <p>
                Track every vessel and crew member — passports, health reports, certificates,
                salaries and notes — all in one place. This is a Fleet plan feature.
              </p>
              <div className="feats">
                <span>Unlimited vessels and crew records</span>
                <span>Passport &amp; certificate expiry tracking</span>
                <span>Health report and salary records</span>
                <span>Notes per crew member</span>
              </div>
              <Link href="/upgrade" className="btn btn-gold">Upgrade to Fleet →</Link>
            </div>
          </div>
        </section>
        <footer>
          <div className="wrap">© 2026 ShipCrewFinder · <Link href="/dashboard">Dashboard</Link></div>
        </footer>
      </>
    );
  }

  // ── Fleet planı var: gemi listesi ──
  const { data: vessels } = await supabase
    .from("vessels")
    .select("id, name, imo_number, vessel_type, created_at")
    .eq("company_id", user.id)
    .order("created_at", { ascending: false });

  const vesselIds = (vessels || []).map((v) => v.id as string);
  const crewCountMap: Record<string, number> = {};
  if (vesselIds.length > 0) {
    const { data: crewRows } = await supabase
      .from("fleet_crew")
      .select("vessel_id")
      .in("vessel_id", vesselIds);
    (crewRows || []).forEach((c) => {
      const vid = c.vessel_id as string;
      crewCountMap[vid] = (crewCountMap[vid] || 0) + 1;
    });
  }

  return (
    <>
      <style>{styles}</style>
      <SiteHeader isLoggedIn={true} userType="company" unreadCount={unreadCount || 0} active={null} />
      <div className="fl-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/dashboard" className="back">← Back to dashboard</Link>
          <h1>My <span style={{ color: "var(--gold)" }}>Fleet</span></h1>
          <p className="sub">{(vessels || []).length} vessel{(vessels || []).length === 1 ? "" : "s"} · manage crew records for each one.</p>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {added === "1" ? <div className="banner ok">Vessel added.</div> : null}
          {deleted === "1" ? <div className="banner ok">Vessel removed.</div> : null}
          {error === "missing" ? <div className="banner err">Vessel name is required.</div> : null}
          {error === "failed" ? <div className="banner err">Something went wrong — please try again.</div> : null}

          <div className="card">
            <h2>+ Add a vessel</h2>
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
                  <label htmlFor="imoNumber">IMO number</label>
                  <input id="imoNumber" name="imoNumber" type="text" maxLength={20} placeholder="Optional" />
                </div>
                <button type="submit" className="btn btn-gold">+ Add</button>
              </div>
            </form>
          </div>

          {!vessels || vessels.length === 0 ? (
            <div className="empty">
              No vessels yet — add your first one above to start tracking crew.
            </div>
          ) : (
            <div className="vgrid">
              {vessels.map((v) => (
                <div key={v.id as string} style={{ position: "relative" }}>
                  <Link href={`/fleet/${v.id}`} className="vcard">
                    <div className="vi">🚢</div>
                    <b>{v.name as string}</b>
                    <p>
                      {(v.vessel_type as string) || "Vessel type not set"} ·{" "}
                      {crewCountMap[v.id as string] || 0} crew
                    </p>
                  </Link>
                  <div className="vdel">
                    <form action={deleteVessel}>
                      <input type="hidden" name="vesselId" value={v.id as string} />
                      <button type="submit">✕</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="wrap">© 2026 ShipCrewFinder · <Link href="/dashboard">Dashboard</Link></div>
      </footer>
    </>
  );
}
