import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getPlanAccess } from "@/lib/plan-access";
import { updateFleetCrew } from "@/lib/actions/fleet";

export const metadata = {
  title: "Crew Member — ShipCrewFinder",
};

export default async function CrewMemberPage({
  params,
  searchParams,
}: {
  params: Promise<{ vesselId: string; crewId: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { vesselId, crewId } = await params;
  const sp = await searchParams;
  const saved = sp.saved;
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

  const access = getPlanAccess((profile.plan as string) as never);
  if (!access.canUseFleetManager) redirect("/fleet");

  const { data: vessel } = await supabase
    .from("vessels")
    .select("id, name")
    .eq("id", vesselId)
    .eq("company_id", user.id)
    .maybeSingle();

  if (!vessel) notFound();

  const { data: crew } = await supabase
    .from("fleet_crew")
    .select("*")
    .eq("id", crewId)
    .eq("vessel_id", vesselId)
    .eq("company_id", user.id)
    .maybeSingle();

  if (!crew) notFound();

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
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:720px;margin:0 auto;padding:0 20px}
  .cm-hero{position:relative;padding:36px 0 8px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:16px}
  .back:hover{color:var(--gold)}
  h1{font-family:var(--disp);font-size:clamp(1.6rem,4vw,2.2rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:6px}
  .sub{font-size:13.5px;color:var(--tx2)}
  section{padding:20px 0 44px}
  .banner{border-radius:13px;padding:13px 17px;font-size:13px;margin-bottom:16px;border:1px solid}
  .banner.ok{color:var(--grn);border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.08)}
  .banner.err{color:#f87171;border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:22px 24px;margin-bottom:16px}
  .card h2{font-family:var(--disp);font-size:15px;font-weight:800;margin-bottom:14px;color:var(--gold);text-transform:uppercase;letter-spacing:.06em;font-size:11.5px}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media(max-width:560px){.grid2{grid-template-columns:1fr}}
  label{display:block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--tx3);margin-bottom:6px}
  input[type=text],input[type=date],input[type=number],select,textarea{width:100%;background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:11px;padding:11px 13px;font-family:var(--body);font-size:13.5px;outline:none;margin-bottom:14px}
  input:focus,select:focus,textarea:focus{border-color:var(--gold)}
  textarea{resize:vertical;min-height:100px;line-height:1.6}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:13px 24px;font-family:var(--body);width:100%}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-gold:hover{transform:translateY(-2px)}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader isLoggedIn={true} userType="company" unreadCount={unreadCount || 0} active={null} />

      <div className="cm-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href={`/fleet/${vesselId}`} className="back">← {vessel.name as string}</Link>
          <h1>{crew.full_name as string}</h1>
          <p className="sub">Crew record — edit any field and save.</p>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {saved === "1" ? <div className="banner ok">Saved.</div> : null}
          {error === "missing" ? <div className="banner err">Full name is required.</div> : null}
          {error === "failed" ? <div className="banner err">Something went wrong — please try again.</div> : null}

          <form action={updateFleetCrew}>
            <input type="hidden" name="crewId" value={crewId} />
            <input type="hidden" name="vesselId" value={vesselId} />

            <div className="card">
              <h2>Identity</h2>
              <div className="grid2">
                <div>
                  <label htmlFor="fullName">Full name</label>
                  <input id="fullName" name="fullName" type="text" required maxLength={100} defaultValue={(crew.full_name as string) || ""} />
                </div>
                <div>
                  <label htmlFor="rank">Rank</label>
                  <input id="rank" name="rank" type="text" maxLength={60} defaultValue={(crew.rank as string) || ""} />
                </div>
                <div>
                  <label htmlFor="nationality">Nationality</label>
                  <input id="nationality" name="nationality" type="text" maxLength={60} defaultValue={(crew.nationality as string) || ""} />
                </div>
                <div>
                  <label htmlFor="passportNumber">Passport number</label>
                  <input id="passportNumber" name="passportNumber" type="text" maxLength={40} defaultValue={(crew.passport_number as string) || ""} />
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Documents &amp; Health</h2>
              <div className="grid2">
                <div>
                  <label htmlFor="passportExpiry">Passport expiry</label>
                  <input id="passportExpiry" name="passportExpiry" type="date" defaultValue={(crew.passport_expiry as string) || ""} />
                </div>
                <div>
                  <label htmlFor="healthReportExpiry">Health report expiry</label>
                  <input id="healthReportExpiry" name="healthReportExpiry" type="date" defaultValue={(crew.health_report_expiry as string) || ""} />
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Contract</h2>
              <div className="grid2">
                <div>
                  <label htmlFor="joinDate">Join date</label>
                  <input id="joinDate" name="joinDate" type="date" defaultValue={(crew.join_date as string) || ""} />
                </div>
                <div>
                  <label htmlFor="departureDate">Departure date</label>
                  <input id="departureDate" name="departureDate" type="date" defaultValue={(crew.departure_date as string) || ""} />
                </div>
                <div>
                  <label htmlFor="salaryAmount">Salary amount</label>
                  <input id="salaryAmount" name="salaryAmount" type="number" min="0" defaultValue={(crew.salary_amount as number) ?? ""} />
                </div>
                <div>
                  <label htmlFor="salaryCurrency">Currency</label>
                  <select id="salaryCurrency" name="salaryCurrency" defaultValue={(crew.salary_currency as string) || "USD"}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Notes</h2>
              <textarea name="notes" maxLength={2000} placeholder="Any additional notes about this crew member..." defaultValue={(crew.notes as string) || ""} />
            </div>

            <button type="submit" className="btn btn-gold">Save changes</button>
          </form>
        </div>
      </section>

      <footer>
        <div className="wrap">© 2026 ShipCrewFinder · <Link href="/fleet">My Fleet</Link> · <Link href="/dashboard">Dashboard</Link></div>
      </footer>
    </>
  );
}
