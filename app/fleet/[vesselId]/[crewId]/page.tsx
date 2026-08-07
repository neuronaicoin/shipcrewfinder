import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { updateFleetCrew, signOffCrew } from "@/lib/actions/fleet";

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

  const isSignedOff = (crew.status as string) === "signed_off";

  return (
    <>
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:760px;margin:0 auto;padding:0 20px}
  .cm-hero{position:relative;padding:36px 0 8px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .hrow{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:16px}
  .back:hover{color:var(--gold)}
  h1{font-family:var(--disp);font-size:clamp(1.6rem,4vw,2.2rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:6px}
  .sub{font-size:13.5px;color:var(--tx2)}
  .statuspill{display:inline-block;font-size:10.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;border-radius:999px;padding:5px 12px;border:1px solid}
  .statuspill.off{color:var(--tx3);border-color:var(--line2);background:rgba(255,255,255,.04)}
  section{padding:20px 0 44px}
  .banner{border-radius:13px;padding:13px 17px;font-size:13px;margin-bottom:16px;border:1px solid}
  .banner.ok{color:var(--grn);border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.08)}
  .banner.err{color:var(--red);border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
  .banner.warn{color:var(--tx3);border-color:var(--line2);background:rgba(255,255,255,.03)}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:22px 24px;margin-bottom:16px}
  .card h2{font-family:var(--disp);font-weight:800;margin-bottom:14px;color:var(--gold);text-transform:uppercase;letter-spacing:.06em;font-size:11.5px}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
  @media(max-width:560px){.grid2,.grid3{grid-template-columns:1fr}}
  label{display:block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--tx3);margin-bottom:6px}
  input[type=text],input[type=date],input[type=number],input[type=tel],select,textarea{width:100%;background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:11px;padding:11px 13px;font-family:var(--body);font-size:13.5px;outline:none;margin-bottom:14px}
  input:focus,select:focus,textarea:focus{border-color:var(--gold)}
  select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23fbbf24' d='M6 8L0 0h12z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 0.85rem center;padding-right:2.2rem}
  textarea{resize:vertical;min-height:100px;line-height:1.6}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:13px 24px;font-family:var(--body);width:100%}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-gold:hover{transform:translateY(-2px)}
  .signoff-box{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-top:8px}
  .signoff-box p{font-size:12.5px;color:var(--tx3);line-height:1.5;max-width:40ch}
  .btn-signoff{background:transparent;border:1px solid rgba(239,68,68,.35);color:var(--red);border-radius:11px;padding:10px 18px;font-weight:700;font-size:12.5px;cursor:pointer;font-family:var(--body);white-space:nowrap}
  .btn-signoff:hover{background:rgba(239,68,68,.08)}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader isLoggedIn={true} userType="company" unreadCount={unreadCount || 0} active={null} />

      <div className="cm-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href={`/fleet/${vesselId}`} className="back">← {vessel.name as string}</Link>
          <div className="hrow">
            <div>
              <h1>{crew.full_name as string}</h1>
              <p className="sub">Crew record — edit any field and save.</p>
            </div>
            {isSignedOff ? <span className="statuspill off">Signed off</span> : null}
          </div>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {saved === "1" ? <div className="banner ok">Saved.</div> : null}
          {sp.signedoff === "1" ? <div className="banner warn">Moved to crew history.</div> : null}
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
              </div>
              <div className="grid3">
                <div>
                  <label htmlFor="sex">Sex</label>
                  <select id="sex" name="sex" defaultValue={(crew.sex as string) || ""}>
                    <option value="">—</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dateOfBirth">Date of birth</label>
                  <input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={(crew.date_of_birth as string) || ""} />
                </div>
                <div>
                  <label htmlFor="nationality">Nationality</label>
                  <input id="nationality" name="nationality" type="text" maxLength={60} defaultValue={(crew.nationality as string) || ""} />
                </div>
              </div>
              <div className="grid2">
                <div>
                  <label htmlFor="placeOfBirth">Place of birth</label>
                  <input id="placeOfBirth" name="placeOfBirth" type="text" maxLength={100} defaultValue={(crew.place_of_birth as string) || ""} />
                </div>
                <div>
                  <label htmlFor="placeOfSignOn">Place of sign on</label>
                  <input id="placeOfSignOn" name="placeOfSignOn" type="text" maxLength={100} defaultValue={(crew.place_of_sign_on as string) || ""} />
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Documents &amp; Health</h2>
              <div className="grid2">
                <div>
                  <label htmlFor="passportNumber">Passport number</label>
                  <input id="passportNumber" name="passportNumber" type="text" maxLength={40} defaultValue={(crew.passport_number as string) || ""} />
                </div>
                <div>
                  <label htmlFor="passportExpiry">Passport expiry</label>
                  <input id="passportExpiry" name="passportExpiry" type="date" defaultValue={(crew.passport_expiry as string) || ""} />
                </div>
                <div>
                  <label htmlFor="seamanBookNumber">Seaman&apos;s book number</label>
                  <input id="seamanBookNumber" name="seamanBookNumber" type="text" maxLength={40} defaultValue={(crew.seaman_book_number as string) || ""} />
                </div>
                <div>
                  <label htmlFor="seamanBookExpiry">Seaman&apos;s book expiry</label>
                  <input id="seamanBookExpiry" name="seamanBookExpiry" type="date" defaultValue={(crew.seaman_book_expiry as string) || ""} />
                </div>
                <div>
                  <label htmlFor="healthReportExpiry">Health report expiry</label>
                  <input id="healthReportExpiry" name="healthReportExpiry" type="date" defaultValue={(crew.health_report_expiry as string) || ""} />
                </div>
                <div>
                  <label htmlFor="stcwEndorsementExpiry">STCW endorsement expiry</label>
                  <input id="stcwEndorsementExpiry" name="stcwEndorsementExpiry" type="date" defaultValue={(crew.stcw_endorsement_expiry as string) || ""} />
                </div>
                <div>
                  <label htmlFor="visaType">Visa type</label>
                  <input id="visaType" name="visaType" type="text" maxLength={60} placeholder="e.g. Schengen" defaultValue={(crew.visa_type as string) || ""} />
                </div>
                <div>
                  <label htmlFor="visaExpiry">Visa expiry</label>
                  <input id="visaExpiry" name="visaExpiry" type="date" defaultValue={(crew.visa_expiry as string) || ""} />
                </div>
                <div>
                  <label htmlFor="bloodType">Blood type</label>
                  <input id="bloodType" name="bloodType" type="text" maxLength={10} placeholder="e.g. O+" defaultValue={(crew.blood_type as string) || ""} />
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Emergency Contact</h2>
              <div className="grid3">
                <div>
                  <label htmlFor="emergencyContactName">Name</label>
                  <input id="emergencyContactName" name="emergencyContactName" type="text" maxLength={100} defaultValue={(crew.emergency_contact_name as string) || ""} />
                </div>
                <div>
                  <label htmlFor="emergencyContactPhone">Phone</label>
                  <input id="emergencyContactPhone" name="emergencyContactPhone" type="tel" maxLength={40} defaultValue={(crew.emergency_contact_phone as string) || ""} />
                </div>
                <div>
                  <label htmlFor="emergencyContactRelationship">Relationship</label>
                  <input id="emergencyContactRelationship" name="emergencyContactRelationship" type="text" maxLength={60} placeholder="e.g. Spouse" defaultValue={(crew.emergency_contact_relationship as string) || ""} />
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

          {!isSignedOff ? (
            <div className="card" style={{ marginTop: 16 }}>
              <div className="signoff-box">
                <p>Signing off moves this crew member to Crew History and marks them inactive on this vessel.</p>
                <form action={signOffCrew}>
                  <input type="hidden" name="crewId" value={crewId} />
                  <input type="hidden" name="vesselId" value={vesselId} />
                  <button type="submit" className="btn-signoff">Sign off →</button>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <footer>
        <div className="wrap">© 2026 ShipCrewFinder · <Link href="/fleet">My Fleet</Link> · <Link href="/dashboard">Dashboard</Link></div>
      </footer>
    </>
  );
}
