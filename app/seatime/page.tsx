import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SiteHeader from "@/app/components/site-header";
import { addSeaContract, deleteSeaContract } from "@/lib/actions/seatime";
import { SHIP_RANKS } from "@/lib/constants/ranks";
import Link from "next/link";

export const metadata = {
  title: "Sea Time Tracker — ShipCrewFinder",
};

const VESSEL_TYPES = [
  "Bulk Carrier",
  "Oil Tanker",
  "Chemical Tanker",
  "Gas Carrier (LNG/LPG)",
  "Container Ship",
  "General Cargo",
  "Ro-Ro",
  "Reefer",
  "Passenger Ship",
  "Cruise Ship",
  "Yacht / Superyacht",
  "Offshore Vessel",
  "Tugboat",
  "Fishing Vessel",
  "Other",
];

export default async function SeaTimePage({
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

  const [
    { data: profile },
    { count: unreadCount },
    { data: contracts },
    { data: sfDetails },
    { data: ytDetails },
  ] = await Promise.all([
    supabase.from("profiles").select("user_type").eq("id", user.id).single(),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false),
    supabase
      .from("sea_contracts")
      .select("id, vessel_name, vessel_type, dwt, main_engine, rank, sign_on, sign_off")
      .eq("user_id", user.id)
      .order("sign_off", { ascending: false }),
    supabase.from("seafarer_details").select("rank").eq("id", user.id).maybeSingle(),
    supabase.from("yacht_details").select("position").eq("id", user.id).maybeSingle(),
  ]);

  const userType =
    (profile?.user_type as "seafarer" | "yacht" | "company" | null) || null;
  if (userType === "company") redirect("/dashboard");

  const currentRank =
    (sfDetails?.rank as string) || (ytDetails?.position as string) || null;

  const list = contracts || [];
  const dayMs = 24 * 3600 * 1000;

  const daysOf = (on: string, off: string) =>
    Math.max(0, Math.round((new Date(off + "T00:00:00").getTime() - new Date(on + "T00:00:00").getTime()) / dayMs) + 1);

  // Toplam + rank bazlı + son 5 yıl toplamı
  let totalDays = 0;
  let rankDays = 0;
  let last5yDays = 0;
  const fiveYearsAgo = Date.now() - 5 * 365 * dayMs;

  list.forEach((c) => {
    const d = daysOf(c.sign_on as string, c.sign_off as string);
    totalDays += d;
    if (currentRank && (c.rank as string).toUpperCase() === currentRank.toUpperCase()) {
      rankDays += d;
    }
    // Son 5 yıl kesişimi (kontratın 5 yıl penceresine düşen kısmı)
    const onT = new Date((c.sign_on as string) + "T00:00:00").getTime();
    const offT = new Date((c.sign_off as string) + "T00:00:00").getTime();
    const clippedOn = Math.max(onT, fiveYearsAgo);
    if (offT > clippedOn) {
      last5yDays += Math.round((offT - clippedOn) / dayMs) + 1;
    }
  });

  const fmtDur = (days: number) => {
    if (days <= 0) return "0d";
    const y = Math.floor(days / 365);
    const m = Math.floor((days % 365) / 30);
    const d = days % 365 % 30;
    if (y > 0) return y + "y " + m + "m";
    if (m > 0) return m + "m " + d + "d";
    return d + "d";
  };

  // Yenileme şartı: son 5 yılda 12 ay (≈365 gün)
  const REQUIRED_DAYS = 365;
  const renewalOk = last5yDays >= REQUIRED_DAYS;
  const missingDays = Math.max(0, REQUIRED_DAYS - last5yDays);

  const fmtDate = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

  const fmtDwt = (n: number | null) =>
    n ? n.toLocaleString("en-US") + " DWT" : null;

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
    --line:rgba(224,160,16,.4);--line2:rgba(15,25,60,.12);--red:#dc2626;
  }
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:1000px;margin:0 auto;padding:0 20px}
  .s-hero{position:relative;padding:36px 0 18px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:16px}
  .back:hover{color:var(--gold)}
  h1{font-family:var(--disp);font-size:clamp(1.7rem,4.2vw,2.5rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:8px}
  .sub{font-size:14px;color:var(--tx2);line-height:1.6;max-width:62ch}
  section{padding:18px 0 44px}
  .banner{border-radius:13px;padding:13px 17px;font-size:13px;margin-bottom:16px;border:1px solid}
  .banner.ok{color:var(--grn);border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.08)}
  .banner.info{color:var(--tx2);border-color:var(--line2);background:rgba(255,255,255,.03)}
  .banner.err{color:var(--red);border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
  .sumgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px}
  @media(max-width:560px){.sumgrid{grid-template-columns:1fr 1fr}.sumgrid .sum:first-child{grid-column:span 2}}
  .sum{border-radius:14px;padding:14px 16px;border:1px solid var(--line2);background:linear-gradient(165deg,var(--navy2),var(--ink))}
  .sum p{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--tx3);margin-bottom:4px}
  .sum b{font-family:var(--disp);font-size:24px;font-weight:800}
  .sum.hl{border-color:var(--line);background:linear-gradient(160deg,rgba(251,191,36,.12),var(--ink))}
  .sum.hl p,.sum.hl b{color:var(--gold)}
  .renew{display:flex;gap:11px;align-items:flex-start;border-radius:13px;padding:13px 16px;margin-bottom:18px;border:1px solid;font-size:12.5px;line-height:1.6}
  .renew.ok{color:var(--grn);border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.07)}
  .renew.warn{color:var(--gold);border-color:rgba(251,191,36,.35);background:rgba(251,191,36,.07)}
  .renew .ri{font-size:16px;flex-shrink:0;margin-top:1px}
  .renew b{font-family:var(--disp)}
  .vgrid{display:grid;grid-template-columns:1.1fr .9fr;gap:16px;align-items:start}
  @media(max-width:860px){.vgrid{grid-template-columns:1fr}}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:20px 22px}
  .card h2{font-family:var(--disp);font-size:16.5px;font-weight:800;margin-bottom:12px}
  .clist{display:flex;flex-direction:column;gap:9px}
  .crow{border:1px solid var(--line2);border-radius:13px;padding:12px 14px;background:rgba(255,255,255,.02)}
  .crow-top{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:3px}
  .cname{font-family:var(--disp);font-weight:700;font-size:14px}
  .crank{font-size:10px;font-weight:800;letter-spacing:.06em;border-radius:999px;padding:3px 10px;border:1px solid rgba(251,191,36,.35);background:rgba(251,191,36,.08);color:var(--gold);white-space:nowrap}
  .cmeta{font-size:12px;color:var(--tx2)}
  .cdates{font-size:12px;color:var(--tx3);margin-top:2px;display:flex;justify-content:space-between;align-items:center;gap:10px}
  .cdates b{color:var(--tx)}
  .delbtn{background:none;border:1px solid var(--line2);color:var(--tx3);border-radius:8px;padding:4px 9px;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--body);transition:.15s}
  .delbtn:hover{color:var(--red);border-color:rgba(239,68,68,.4)}
  .empty{text-align:center;padding:26px 10px;font-size:13px;color:var(--tx2);line-height:1.7}
  .empty b{color:var(--gold)}
  label{display:block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--tx3);margin-bottom:6px}
  select,input[type=text],input[type=number],input[type=date]{width:100%;background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:11px;padding:11px 13px;font-family:var(--body);font-size:13.5px;font-weight:500;outline:none;margin-bottom:13px}
  select:focus,input:focus{border-color:var(--gold)}
  select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23fbbf24' d='M6 8L0 0h12z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .85rem center;padding-right:2.2rem}
  .frow{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  @media(max-width:480px){.frow{grid-template-columns:1fr}}
  .hint{font-size:11px;color:var(--tx3);margin-top:-7px;margin-bottom:13px;line-height:1.5}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:12px 20px;font-family:var(--body)}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-gold:hover{transform:translateY(-2px)}
  .cvlink{display:flex;gap:11px;align-items:flex-start;background:rgba(251,191,36,.07);border:1px solid var(--line);border-radius:13px;padding:13px 15px;margin-top:16px}
  .cvlink .ci{font-size:16px;flex-shrink:0;margin-top:1px}
  .cvlink p{font-size:12px;color:var(--tx2);line-height:1.6}
  .cvlink a{color:var(--gold);font-weight:700;text-decoration:none}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader
        isLoggedIn={true}
        userType={userType}
        unreadCount={unreadCount || 0}
        active={null}
      />
      <div className="s-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/dashboard" className="back">← Back to dashboard</Link>
          <h1>Sea Time <span style={{ color: "var(--gold)" }}>Tracker</span></h1>
          <p className="sub">
            Log every contract once — total sea service, rank time and licence renewal eligibility calculate themselves. Your contracts also power your professional CV.
          </p>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {added === "1" ? <div className="banner ok">Contract saved. Your totals and CV are updated.</div> : null}
          {deleted === "1" ? <div className="banner info">Contract removed.</div> : null}
          {error === "missing" ? <div className="banner err">Vessel name, type, rank and both dates are required.</div> : null}
          {error === "dates" ? <div className="banner err">Sign-off date must be after sign-on date.</div> : null}
          {error === "failed" ? <div className="banner err">Something went wrong. Please try again.</div> : null}

          {/* Özet */}
          <div className="sumgrid">
            <div className="sum hl">
              <p>Total sea time</p>
              <b>{fmtDur(totalDays)}</b>
            </div>
            <div className="sum">
              <p>{currentRank ? "As " + currentRank : "Current rank"}</p>
              <b>{currentRank ? fmtDur(rankDays) : "—"}</b>
            </div>
            <div className="sum">
              <p>Contracts</p>
              <b>{list.length}</b>
            </div>
          </div>

          {/* Yenileme şeridi */}
          {list.length > 0 ? (
            <div className={"renew " + (renewalOk ? "ok" : "warn")}>
              <span className="ri">{renewalOk ? "✅" : "⏳"}</span>
              <div>
                <b>Sea service for licence renewal:</b>{" "}
                {renewalOk
                  ? "12 months required in the last 5 years — you have " + fmtDur(last5yDays) + " ✓"
                  : "you have " + fmtDur(last5yDays) + " in the last 5 years — " + fmtDur(missingDays) + " more needed for the typical 12-month requirement."}
                <span style={{ display: "block", fontSize: 11, color: "var(--tx3)", marginTop: 3 }}>
                  Requirements vary by flag state — always confirm with your administration.
                </span>
              </div>
            </div>
          ) : null}

          <div className="vgrid">
            {/* Kontrat listesi */}
            <div className="card">
              <h2>Contract history</h2>
              {list.length === 0 ? (
                <div className="empty">
                  No contracts yet.<br />
                  Add your voyages — <b>sea time totals, licence renewal checks and your CV</b> all build from here.
                </div>
              ) : (
                <div className="clist">
                  {list.map((c) => (
                    <div key={c.id as string} className="crow">
                      <div className="crow-top">
                        <div className="cname">{c.vessel_name as string}</div>
                        <span className="crank">{c.rank as string}</span>
                      </div>
                      <div className="cmeta">
                        {c.vessel_type as string}
                        {fmtDwt(c.dwt as number | null) ? " · " + fmtDwt(c.dwt as number | null) : ""}
                        {c.main_engine ? " · ⚙️ " + (c.main_engine as string) : ""}
                      </div>
                      <div className="cdates">
                        <span>
                          {fmtDate(c.sign_on as string)} – {fmtDate(c.sign_off as string)} ·{" "}
                          <b>{fmtDur(daysOf(c.sign_on as string, c.sign_off as string))}</b>
                        </span>
                        <form action={deleteSeaContract} style={{ display: "inline" }}>
                          <input type="hidden" name="contractId" value={c.id as string} />
                          <button type="submit" className="delbtn">✕</button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="cvlink">
                <span className="ci">📄</span>
                <p>
                  Every contract here appears automatically in your <b>SEA SERVICE</b> table on your professional CV.{" "}
                  <Link href="/cv">Open CV Builder →</Link>
                </p>
              </div>
            </div>

            {/* Ekleme formu */}
            <div className="card" style={{ borderColor: "var(--line)" }}>
              <h2>Add contract</h2>
              <form action={addSeaContract}>
                <label htmlFor="vesselName">Vessel name</label>
                <input id="vesselName" name="vesselName" type="text" required maxLength={80} placeholder="e.g. MV Golden Horizon" />

                <div className="frow">
                  <div>
                    <label htmlFor="vesselType">Vessel type</label>
                    <select id="vesselType" name="vesselType" required defaultValue="">
                      <option value="" disabled>-- Select --</option>
                      {VESSEL_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="dwt">DWT (optional)</label>
                    <input id="dwt" name="dwt" type="number" min={0} max={600000} placeholder="82000" />
                  </div>
                </div>

                <label htmlFor="rank">Rank on board</label>
                <select id="rank" name="rank" required defaultValue={currentRank || ""}>
                  <option value="" disabled>-- Select rank --</option>
                  {Object.entries(SHIP_RANKS).map(([group, ranks]) => (
                    <optgroup key={group} label={group}>
                      {(ranks as string[]).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                <label htmlFor="mainEngine">Main engine (optional)</label>
                <input id="mainEngine" name="mainEngine" type="text" maxLength={80} placeholder="e.g. MAN B&W 6S60MC · 12,240 kW" />
                <p className="hint">Valuable for engine department CVs — leave empty for deck ranks.</p>

                <div className="frow">
                  <div>
                    <label htmlFor="signOn">Sign-on</label>
                    <input id="signOn" name="signOn" type="date" required />
                  </div>
                  <div>
                    <label htmlFor="signOff">Sign-off</label>
                    <input id="signOff" name="signOff" type="date" required />
                  </div>
                </div>

                <button type="submit" className="btn btn-gold" style={{ width: "100%" }}>+ Save contract</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/dashboard">Dashboard</Link> ·{" "}
          <Link href="/vault">Document Vault</Link> · <Link href="/cv">CV Builder</Link>
        </div>
      </footer>
    </>
  );
}
