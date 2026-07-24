import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSortedCountries } from "@/lib/constants/countries";

export const metadata = {
  title: "Maritime CV — ShipCrewFinder",
  robots: { index: false, follow: false },
};

type SharedCv = {
  full_name: string | null;
  country: string | null;
  photo_url: string | null;
  phone: string | null;
  email: string | null;
  details: {
    rank?: string | null;
    years_experience?: number | null;
    nationality?: string | null;
    languages?: string[] | null;
    english_level?: string | null;
    availability?: string | null;
    vessel_types?: string[] | null;
    contract_end_date?: string | null;
  } | null;
  contracts: {
    vessel_name: string;
    vessel_type: string;
    dwt: number | null;
    main_engine: string | null;
    rank: string;
    sign_on: string;
    sign_off: string;
  }[];
  documents: {
    doc_type: string;
    name: string;
    expiry_date: string | null;
  }[];
};

export default async function SharedCvPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const clean = (code || "").trim().toUpperCase();
  if (!clean || clean.length < 6 || clean.length > 16) notFound();

  const supabase = await createClient();
  const { data } = await supabase.rpc("get_shared_cv", { share_code: clean });

  if (!data) notFound();
  const cv = data as SharedCv;

  const d = cv.details || {};
  const rank = (d.rank as string) || "—";

  const countries = getSortedCountries();
  const nat = (d.nationality as string) || cv.country || "";
  const natCountry = countries.find((c) => c.code === nat || c.name === nat);
  const natLabel = natCountry ? natCountry.flag + " " + natCountry.name : nat || "—";

  const availLabel = (() => {
    const a = d.availability as string | undefined;
    if (a === "immediate") return "Available now / within 1 month";
    if (a === "1-3_months") return "Available in 1–3 months";
    if (a === "3+_months") return "Available in 3+ months";
    return null;
  })();

  const langs = Array.isArray(d.languages) ? (d.languages as string[]) : [];
  const engLevel = (d.english_level as string) || null;
  const vesselTypes = Array.isArray(d.vessel_types) ? (d.vessel_types as string[]) : [];

  const contracts = cv.contracts || [];
  const docs = cv.documents || [];

  const dayMs = 24 * 3600 * 1000;
  const durOf = (on: string, off: string) => {
    const days = Math.max(0, Math.round((new Date(off + "T00:00:00").getTime() - new Date(on + "T00:00:00").getTime()) / dayMs) + 1);
    const m = Math.floor(days / 30);
    if (m >= 1) return m + "m";
    return days + "d";
  };
  let totalDays = 0;
  contracts.forEach((c) => {
    totalDays += Math.max(0, Math.round((new Date(c.sign_off + "T00:00:00").getTime() - new Date(c.sign_on + "T00:00:00").getTime()) / dayMs) + 1);
  });
  const totalDur = (() => {
    const y = Math.floor(totalDays / 365);
    const m = Math.floor((totalDays % 365) / 30);
    if (y > 0) return y + "Y " + m + "M";
    return m + "M";
  })();

  const period = (on: string, off: string) => {
    const f = (x: string) => {
      const dt = new Date(x + "T00:00:00");
      return String(dt.getMonth() + 1).padStart(2, "0") + "/" + String(dt.getFullYear()).slice(2);
    };
    return f(on) + "–" + f(off);
  };

  const fmtDwtK = (n: number | null) => (n ? (n >= 1000 ? Math.round(n / 1000) + "k" : String(n)) : "");
  const expYear = (x: string | null) => (x ? " (" + new Date(x + "T00:00:00").getFullYear() + ")" : "");
  return (
    <>
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --disp:var(--font-bricolage),sans-serif;--body:var(--font-jakarta),sans-serif;
  }
  body{font-family:var(--body);background:#0d1030;color:#eef4fa;overflow-x:hidden}
  .wrap{max-width:860px;margin:0 auto;padding:0 16px}
  .sh-top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 0;flex-wrap:wrap}
  .sh-logo{display:flex;align-items:center;gap:9px;text-decoration:none;color:#eef4fa}
  .sh-logo .ic{width:32px;height:32px;border-radius:9px;background:linear-gradient(145deg,#fbbf24,#e0a010);display:grid;place-items:center}
  .sh-logo b{font-family:var(--disp);font-size:16px;font-weight:700}
  .sh-logo b span{color:#fbbf24}
  .printbtn{display:inline-flex;align-items:center;gap:7px;border-radius:11px;font-weight:700;font-size:12.5px;cursor:pointer;border:none;padding:10px 16px;font-family:var(--body);background:linear-gradient(135deg,#fbbf24,#e0a010);color:#0b0e13;text-decoration:none}

  .cv-sheet{background:#ffffff;color:#1a2340;border-radius:10px;overflow:hidden;max-width:794px;margin:0 auto 16px;box-shadow:0 24px 60px rgba(0,0,0,.45)}
  .cv-head{display:flex;gap:18px;align-items:center;padding:26px 30px 20px;border-bottom:3px solid #e0a010}
  .cv-photo{width:92px;height:112px;border-radius:7px;object-fit:cover;flex-shrink:0;border:1px solid #dfe5f0}
  .cv-photo-empty{width:92px;height:112px;border-radius:7px;background:#eef1f8;flex-shrink:0;display:grid;place-items:center;font-size:30px;color:#9aa7c4;border:1px dashed #c9d3e6}
  .cv-name{font-family:var(--disp);font-size:25px;font-weight:800;color:#0d1030;letter-spacing:.01em;line-height:1.1}
  .cv-rank{font-family:var(--disp);font-size:14.5px;font-weight:700;color:#b8860b;margin-top:3px;letter-spacing:.04em}
  .cv-sub{font-size:11.5px;color:#5a6785;margin-top:7px;line-height:1.7}
  .cv-sub .av{color:#0e9f6e;font-weight:700}
  .cv-body{padding:16px 30px 22px}
  .cv-sec{margin-bottom:15px}
  .cv-sec h4{font-family:var(--disp);font-size:11px;font-weight:800;letter-spacing:.11em;color:#0d1030;border-bottom:1.5px solid #e5e9f2;padding-bottom:5px;margin-bottom:8px}
  .cv-sec h4 small{font-weight:600;color:#9aa7c4;letter-spacing:.02em;text-transform:none;font-size:9.5px}
  table.cv-tab{width:100%;border-collapse:collapse;font-size:11px;color:#3a4664}
  table.cv-tab th{text-align:left;font-size:9px;font-weight:700;letter-spacing:.06em;color:#9aa7c4;padding:0 8px 5px 0}
  table.cv-tab th:last-child{text-align:right;padding-right:0}
  table.cv-tab td{padding:4px 8px 4px 0;border-top:1px solid #f0f3f9;vertical-align:top}
  table.cv-tab td:last-child{text-align:right;white-space:nowrap;padding-right:0;color:#5a6785}
  table.cv-tab td.rk{font-weight:800;color:#0d1030;white-space:nowrap}
  .cv-line{font-size:11.5px;color:#3a4664;line-height:1.75}
  .cv-foot{text-align:center;font-size:9.5px;color:#9aa7c4;padding:0 30px 18px}
  .cv-foot b{color:#b8860b}

  .viral{background:linear-gradient(160deg,#141845,#050716);border:1.5px solid rgba(251,191,36,.3);border-radius:16px;padding:18px 22px;margin:0 auto 30px;max-width:794px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .viral p{font-size:13px;color:#a8bdd2;line-height:1.6}
  .viral b{color:#eef4fa;font-family:var(--disp);display:block;font-size:14.5px;margin-bottom:2px}
  .viral a{display:inline-flex;align-items:center;gap:7px;border-radius:11px;font-weight:700;font-size:13px;padding:11px 19px;background:linear-gradient(135deg,#fbbf24,#e0a010);color:#0b0e13;text-decoration:none;white-space:nowrap}

  @media print{
    body{background:#ffffff !important}
    .sh-top,.viral,.gtabs{display:none !important}
    .cv-sheet{box-shadow:none;border-radius:0;max-width:none;margin:0}
    .wrap{max-width:none;padding:0}
    @page{margin:8mm}
  }
  @media(max-width:560px){
    .cv-head{padding:18px 16px 14px;gap:12px}
    .cv-body{padding:12px 16px 16px}
    .cv-name{font-size:19px}
    .cv-photo,.cv-photo-empty{width:70px;height:86px}
    table.cv-tab{font-size:9.5px}
    .cv-foot{padding:0 16px 14px}
  }
`}</style>

      <div className="wrap">
        <div className="sh-top">
          <Link href="/" className="sh-logo">
            <span className="ic">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0b0e13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2.4"/><line x1="12" y1="7.4" x2="12" y2="20.5"/><line x1="7.5" y1="10.4" x2="16.5" y2="10.4"/><path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7"/><path d="M4.5 14.8l-1.6-1.2M4.5 14.8l2-.4"/><path d="M19.5 14.8l1.6-1.2M19.5 14.8l-2-.4"/></svg>
            </span>
            <b>Ship<span>Crew</span>Finder</b>
          </Link>
          <a href="#" className="printbtn" onClick={undefined} id="print-link">🖨 Print / Save PDF</a>
        </div>

        {/* A4 CV */}
        <div className="cv-sheet">
          <div className="cv-head">
            {cv.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cv.photo_url} alt="" className="cv-photo" />
            ) : (
              <div className="cv-photo-empty">👤</div>
            )}
            <div style={{ minWidth: 0 }}>
              <div className="cv-name">{cv.full_name || "Maritime Professional"}</div>
              <div className="cv-rank">{rank.toUpperCase()}</div>
              <div className="cv-sub">
                {natLabel}
                {availLabel ? <> · <span className="av">● {availLabel}</span></> : null}
                {(cv.phone || cv.email) ? <br /> : null}
                {cv.phone ? <>📱 {cv.phone} · </> : null}
                {cv.email ? <>✉ {cv.email}</> : null}
              </div>
            </div>
          </div>

          <div className="cv-body">
            <div className="cv-sec">
              <h4>SEA SERVICE{totalDays > 0 ? " — " + totalDur + " TOTAL" : ""} <small>· verified log</small></h4>
              {contracts.length === 0 ? (
                <p className="cv-line" style={{ color: "#9aa7c4" }}>No sea service records shared.</p>
              ) : (
                <table className="cv-tab">
                  <thead>
                    <tr>
                      <th>RANK</th>
                      <th>VESSEL</th>
                      <th>TYPE / DWT</th>
                      <th>MAIN ENGINE</th>
                      <th>PERIOD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((c, i) => (
                      <tr key={i}>
                        <td className="rk">{c.rank}</td>
                        <td>{c.vessel_name}</td>
                        <td>
                          {c.vessel_type.replace(" Carrier", "").replace(" Ship", "")}
                          {c.dwt ? " " + fmtDwtK(c.dwt) : ""}
                        </td>
                        <td>{c.main_engine || "—"}</td>
                        <td>{period(c.sign_on, c.sign_off)} · {durOf(c.sign_on, c.sign_off)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="cv-sec">
              <h4>CERTIFICATES <small>· valid documents only</small></h4>
              {docs.length === 0 ? (
                <p className="cv-line" style={{ color: "#9aa7c4" }}>No certificates shared.</p>
              ) : (
                <p className="cv-line">
                  {docs.map((doc, i) => (
                    <span key={i}>
                      {i > 0 ? " · " : ""}
                      {doc.name}{expYear(doc.expiry_date)}
                    </span>
                  ))}
                </p>
              )}
            </div>

            <div className="cv-sec" style={{ marginBottom: 6 }}>
              <h4>LANGUAGES {vesselTypes.length > 0 ? "& VESSEL EXPERIENCE" : ""}</h4>
              <p className="cv-line">
                {engLevel ? "English (" + engLevel + ")" : null}
                {langs.filter((l) => l.toLowerCase() !== "english").map((l) => " · " + l)}
                {vesselTypes.length > 0 ? <> — {vesselTypes.join(" · ")}</> : null}
              </p>
            </div>
          </div>

          <div className="cv-foot">
            ⚓ Verified maritime profile on <b>ShipCrewFinder</b> — this CV updates live from the member&apos;s account.
          </div>
        </div>

        {/* Viral şerit */}
        <div className="viral">
          <div>
            <b>Hiring crew like this?</b>
            <p>Verified profiles, direct contact, zero commission — first month free.</p>
          </div>
          <Link href="/signup/company">Find verified crew →</Link>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `document.getElementById('print-link').addEventListener('click',function(e){e.preventDefault();window.print();});`,
        }}
      />
    </>
  );
}
