import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createJob } from "@/lib/actions/jobs";
import { SHIP_RANKS, YACHT_POSITIONS } from "@/lib/constants/ranks";
import { getSortedCountries } from "@/lib/constants/countries";
import SiteHeader from "@/app/components/site-header";

export const metadata = {
  title: "Post a Job — ShipCrewFinder",
};

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const error = sp.error;

  const supabase = await createClient();

  // getSession: çerezden okur — ekstra ağ turu yok
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!user) redirect("/login");

  const [{ data: profile }, { count: unreadCount }] = await Promise.all([
    supabase.from("profiles").select("user_type").eq("id", user.id).single(),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false),
  ]);

  if (!profile || profile.user_type !== "company") redirect("/dashboard");

  const countries = getSortedCountries();

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
  .wrap{max-width:720px;margin:0 auto;padding:0 20px}
  .nj-hero{position:relative;padding:36px 0 8px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:16px}
  .back:hover{color:var(--gold)}
  h1{font-family:var(--disp);font-size:clamp(1.7rem,4.2vw,2.5rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:8px}
  .sub{font-size:14px;color:var(--tx2);line-height:1.6}
  section{padding:20px 0 44px}
  .banner{border-radius:13px;padding:13px 17px;font-size:13px;margin-bottom:16px;border:1px solid;color:#f87171;border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:22px 24px;margin-bottom:14px}
  .flabel{display:block;font-family:var(--disp);font-weight:700;font-size:14.5px;margin-bottom:12px}
  .flabel .req{color:var(--gold)}
  .hint{font-size:11.5px;color:var(--tx3);margin-top:8px;line-height:1.5}
  select,input[type=text],input[type=number],textarea{width:100%;background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:11px;padding:12px 13px;font-family:var(--body);font-size:13.5px;font-weight:500;outline:none}
  select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23fbbf24' d='M6 8L0 0h12z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 0.85rem center;padding-right:2.2rem}
  select:focus,input:focus,textarea:focus{border-color:var(--gold)}
  textarea{resize:vertical;min-height:160px;line-height:1.6}
  .radio2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .rlab{display:flex;align-items:center;gap:9px;padding:12px 15px;background:var(--navy);border:1px solid var(--line2);border-radius:11px;cursor:pointer;transition:.15s;font-size:13.5px;font-weight:600}
  .rlab:has(:checked){border-color:var(--gold);background:rgba(251,191,36,.08)}
  .rlab input{accent-color:var(--gold);width:15px;height:15px}
  .opt3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
  @media(max-width:560px){.opt3{grid-template-columns:1fr}}
  .slabel{display:block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--tx3);margin-bottom:6px}
  .osec{font-size:11.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:12px 24px;font-family:var(--body)}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;box-shadow:0 4px 20px rgba(251,191,36,.25)}
  .btn-gold:hover{transform:translateY(-2px)}
  .factions{display:flex;align-items:center;justify-content:space-between;gap:14px;padding-top:6px}
  .cancel{color:var(--tx3);font-size:13px;text-decoration:none;transition:.15s}
  .cancel:hover{color:var(--gold)}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader
        isLoggedIn={true}
        userType="company"
        unreadCount={unreadCount || 0}
        active={null}
      />

      <div className="nj-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/jobs/mine" className="back">← My Job Posts</Link>
          <h1>Post a <span style={{ color: "var(--gold)" }}>Job</span></h1>
          <p className="sub">
            Create a listing — matching crew get an instant email and in-app alert the moment you publish.
          </p>
        </div>
      </div>
      <section style={{ paddingTop: 8 }}>
        <div className="wrap">
          {error === "missing" ? (
            <div className="banner">Please fill in the required fields: crew type, rank, title, and description.</div>
          ) : null}
          {error === "failed" ? (
            <div className="banner">Something went wrong while posting the job. Please try again.</div>
          ) : null}

          <form action={createJob}>
            {/* Crew Type */}
            <div className="card">
              <label className="flabel">Crew Type <span className="req">*</span></label>
              <div className="radio2">
                <label className="rlab">
                  <input type="radio" name="jobType" value="seafarer" defaultChecked />
                  <span>⚓ Ship Crew</span>
                </label>
                <label className="rlab">
                  <input type="radio" name="jobType" value="yacht" />
                  <span>🛥️ Yacht Crew</span>
                </label>
              </div>
              <p className="hint">Pick the rank list below accordingly.</p>
            </div>

            {/* Rank */}
            <div className="card">
              <label htmlFor="rank" className="flabel">Rank / Position <span className="req">*</span></label>
              <select id="rank" name="rank" required defaultValue="">
                <option value="" disabled>-- Select rank --</option>
                <optgroup label="Ship — Deck">
                  {SHIP_RANKS["Deck Department"].map((r) => <option key={r} value={r}>{r}</option>)}
                </optgroup>
                <optgroup label="Ship — Engine">
                  {SHIP_RANKS["Engine Department"].map((r) => <option key={r} value={r}>{r}</option>)}
                </optgroup>
                <optgroup label="Ship — Catering">
                  {SHIP_RANKS["Catering Department"].map((r) => <option key={r} value={r}>{r}</option>)}
                </optgroup>
                <optgroup label="Ship — Other">
                  {SHIP_RANKS["Other"].map((r) => <option key={r} value={r}>{r}</option>)}
                </optgroup>
                <optgroup label="Yacht — Deck">
                  {YACHT_POSITIONS["Deck"].map((r) => <option key={r} value={r}>{r}</option>)}
                </optgroup>
                <optgroup label="Yacht — Interior">
                  {YACHT_POSITIONS["Interior"].map((r) => <option key={r} value={r}>{r}</option>)}
                </optgroup>
                <optgroup label="Yacht — Engineering">
                  {YACHT_POSITIONS["Engineering"].map((r) => <option key={r} value={r}>{r}</option>)}
                </optgroup>
                <optgroup label="Yacht — Galley">
                  {YACHT_POSITIONS["Galley"].map((r) => <option key={r} value={r}>{r}</option>)}
                </optgroup>
                <optgroup label="Yacht — Other">
                  {YACHT_POSITIONS["Other"].map((r) => <option key={r} value={r}>{r}</option>)}
                </optgroup>
              </select>
            </div>

            {/* Title */}
            <div className="card">
              <label htmlFor="title" className="flabel">Job Title <span className="req">*</span></label>
              <input id="title" name="title" type="text" required maxLength={120} placeholder="e.g. Chief Engineer for LNG Carrier" />
            </div>

            {/* Country + City */}
            <div className="card">
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="country" className="flabel">Country</label>
                <select id="country" name="country" defaultValue="">
                  <option value="">-- Any / Not specified --</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="city" className="flabel">City / Port (optional)</label>
                <input id="city" name="city" type="text" maxLength={80} placeholder="e.g. Rotterdam" />
              </div>
            </div>

            {/* Description */}
            <div className="card">
              <label htmlFor="description" className="flabel">Description <span className="req">*</span></label>
              <textarea id="description" name="description" required rows={8}
                placeholder="Describe the role, vessel, requirements, rotation, and anything else candidates should know..." />
              <p className="hint">Write whatever you want candidates to know — requirements, conditions, certificates, rotation, etc.</p>
            </div>

            {/* Optional: salary + contract */}
            <div className="card">
              <div className="osec">Optional details</div>
              <div className="opt3" style={{ marginBottom: 14 }}>
                <div>
                  <label htmlFor="salaryMin" className="slabel">Salary min</label>
                  <input id="salaryMin" name="salaryMin" type="number" min="0" placeholder="e.g. 6000" />
                </div>
                <div>
                  <label htmlFor="salaryMax" className="slabel">Salary max</label>
                  <input id="salaryMax" name="salaryMax" type="number" min="0" placeholder="e.g. 8000" />
                </div>
                <div>
                  <label htmlFor="salaryCurrency" className="slabel">Currency</label>
                  <select id="salaryCurrency" name="salaryCurrency" defaultValue="USD">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="contractDuration" className="slabel">Contract duration</label>
                <input id="contractDuration" name="contractDuration" type="text" maxLength={60} placeholder="e.g. 4 months on / 2 months off" />
              </div>
              <p className="hint">Jobs with a visible salary range get significantly more applications.</p>
            </div>

            <div className="factions">
              <Link href="/jobs/mine" className="cancel">Cancel</Link>
              <button type="submit" className="btn btn-gold">Publish Job →</button>
            </div>
          </form>
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/jobs/mine">My Job Posts</Link> ·{" "}
          <Link href="/browse">Search Crew</Link> · <Link href="/dashboard">Dashboard</Link>
        </div>
      </footer>
    </>
  );
}
