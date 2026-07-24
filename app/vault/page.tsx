import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SiteHeader from "@/app/components/site-header";
import { addDocument, deleteDocument } from "@/lib/actions/documents";
import Link from "next/link";

export const metadata = {
  title: "Document Vault — ShipCrewFinder",
};

const DOC_TYPES = [
  "STCW Certificate",
  "COC / License",
  "GMDSS / Endorsement",
  "Medical Certificate",
  "Passport",
  "Seaman's Book",
  "Visa",
  "Flag State Endorsement",
  "Vaccination / Health",
  "Other",
];

export default async function VaultPage({
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

  const [{ data: profile }, { count: unreadCount }, { data: docs }] =
    await Promise.all([
      supabase.from("profiles").select("user_type").eq("id", user.id).single(),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false),
      supabase
        .from("crew_documents")
        .select("id, doc_type, name, expiry_date, file_url, created_at")
        .eq("user_id", user.id)
        .order("expiry_date", { ascending: true, nullsFirst: false }),
    ]);

  const userType =
    (profile?.user_type as "seafarer" | "yacht" | "company" | null) || null;

  const docList = docs || [];

  // Durum hesabı: expired / soon (90 gün) / valid / none
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMs = 24 * 3600 * 1000;

  const statusOf = (expiry: string | null) => {
    if (!expiry) return { key: "none", days: null as number | null };
    const d = new Date(expiry + "T00:00:00");
    const days = Math.round((d.getTime() - today.getTime()) / dayMs);
    if (days < 0) return { key: "expired", days };
    if (days <= 90) return { key: "soon", days };
    return { key: "valid", days };
  };

  let cValid = 0, cSoon = 0, cExpired = 0;
  docList.forEach((doc) => {
    const s = statusOf(doc.expiry_date as string | null);
    if (s.key === "expired") cExpired++;
    else if (s.key === "soon") cSoon++;
    else if (s.key === "valid") cValid++;
    else cValid++;
  });

  const fmtDate = (d: string | null) =>
    d
      ? new Date(d + "T00:00:00").toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "No expiry";

  const expiryLine = (doc: { expiry_date: string | null }) => {
    const s = statusOf(doc.expiry_date);
    if (s.key === "none") return "No expiry date";
    if (s.key === "expired")
      return "Expired " + Math.abs(s.days as number) + " days ago · " + fmtDate(doc.expiry_date);
    if (s.key === "soon")
      return "Expires in " + s.days + " days · " + fmtDate(doc.expiry_date);
    return "Expires " + fmtDate(doc.expiry_date);
  };

  return (
    <>
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --navy:#0d1030;--navy2:#141845;--ink:#050716;
    --gold:#fbbf24;--gold2:#e0a010;--line:rgba(251,191,36,.16);--line2:rgba(255,255,255,.08);
    --tx:#eef4fa;--tx2:#a8bdd2;--tx3:#6b83a0;--grn:#34d399;--amb:#fbbf24;--red:#f87171;
    --disp:var(--font-bricolage),sans-serif;--body:var(--font-jakarta),sans-serif;
  }
  body.light{
    --navy:#f2f4fb;--navy2:#ffffff;--ink:#ffffff;
    --tx:#0e1730;--tx2:#2e3c5e;--tx3:#57678a;
    --line:rgba(224,160,16,.4);--line2:rgba(15,25,60,.12);--red:#dc2626;
  }
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:1000px;margin:0 auto;padding:0 20px}
  .v-hero{position:relative;padding:36px 0 18px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:16px}
  .back:hover{color:var(--gold)}
  h1{font-family:var(--disp);font-size:clamp(1.7rem,4.2vw,2.5rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:8px}
  .sub{font-size:14px;color:var(--tx2);line-height:1.6;max-width:60ch}
  section{padding:18px 0 44px}
  .banner{border-radius:13px;padding:13px 17px;font-size:13px;margin-bottom:16px;border:1px solid}
  .banner.ok{color:var(--grn);border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.08)}
  .banner.info{color:var(--tx2);border-color:var(--line2);background:rgba(255,255,255,.03)}
  .banner.err{color:var(--red);border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
  .sumgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px}
  @media(max-width:560px){.sumgrid{grid-template-columns:1fr 1fr}.sumgrid .sum:last-child{grid-column:span 2}}
  .sum{border-radius:14px;padding:14px 16px;border:1px solid}
  .sum p{font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px}
  .sum b{font-family:var(--disp);font-size:26px;font-weight:800}
  .sum.g{border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.07)}
  .sum.g p,.sum.g b{color:var(--grn)}
  .sum.a{border-color:rgba(251,191,36,.35);background:rgba(251,191,36,.07)}
  .sum.a p,.sum.a b{color:var(--gold)}
  .sum.r{border-color:rgba(239,68,68,.35);background:rgba(239,68,68,.07)}
  .sum.r p,.sum.r b{color:var(--red)}
  .vgrid{display:grid;grid-template-columns:1.1fr .9fr;gap:16px;align-items:start}
  @media(max-width:860px){.vgrid{grid-template-columns:1fr}}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:20px 22px}
  .card h2{font-family:var(--disp);font-size:16.5px;font-weight:800;margin-bottom:12px}
  .dlist{display:flex;flex-direction:column;gap:9px}
  .drow{display:flex;align-items:center;gap:12px;border:1px solid var(--line2);border-radius:13px;padding:12px 14px;background:rgba(255,255,255,.02)}
  .drow.soon{border-color:rgba(251,191,36,.4)}
  .drow.expired{border-color:rgba(239,68,68,.4)}
  .dic{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;font-size:16px;flex-shrink:0;border:1px solid}
  .dic.g{color:var(--grn);border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.08)}
  .dic.a{color:var(--gold);border-color:rgba(251,191,36,.35);background:rgba(251,191,36,.08)}
  .dic.r{color:var(--red);border-color:rgba(239,68,68,.35);background:rgba(239,68,68,.08)}
  .dinfo{flex:1;min-width:0}
  .dname{font-family:var(--disp);font-weight:700;font-size:13.5px}
  .dtype{font-size:10.5px;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em;font-weight:700}
  .dexp{font-size:12px;margin-top:2px}
  .dexp.g{color:var(--tx2)}
  .dexp.a{color:var(--gold);font-weight:600}
  .dexp.r{color:var(--red);font-weight:600}
  .dacts{display:flex;align-items:center;gap:8px;flex-shrink:0}
  .dacts a{color:var(--gold);font-size:11.5px;font-weight:700;text-decoration:none}
  .dacts a:hover{text-decoration:underline}
  .delbtn{background:none;border:1px solid var(--line2);color:var(--tx3);border-radius:8px;padding:5px 9px;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--body);transition:.15s}
  .delbtn:hover{color:var(--red);border-color:rgba(239,68,68,.4)}
  .empty{text-align:center;padding:26px 10px;font-size:13px;color:var(--tx2);line-height:1.6}
  label{display:block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--tx3);margin-bottom:6px}
  select,input[type=text],input[type=date]{width:100%;background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:11px;padding:11px 13px;font-family:var(--body);font-size:13.5px;font-weight:500;outline:none;margin-bottom:14px}
  select:focus,input:focus{border-color:var(--gold)}
  select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23fbbf24' d='M6 8L0 0h12z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 0.85rem center;padding-right:2.2rem}
  input[type=file]{width:100%;color:var(--tx3);font-size:12px;margin-bottom:14px;font-family:var(--body)}
  .hint{font-size:11px;color:var(--tx3);margin-top:-8px;margin-bottom:14px;line-height:1.5}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:12px 20px;font-family:var(--body)}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-gold:hover{transform:translateY(-2px)}
  .remind{display:flex;gap:11px;align-items:flex-start;background:rgba(251,191,36,.07);border:1px solid var(--line);border-radius:13px;padding:13px 15px;margin-top:16px}
  .remind .ri{font-size:16px;flex-shrink:0;margin-top:1px}
  .remind p{font-size:12px;color:var(--tx2);line-height:1.6}
  .remind b{color:var(--gold)}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader
        isLoggedIn={true}
        userType={userType}
        unreadCount={unreadCount || 0}
        active={null}
      />
      <div className="v-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/dashboard" className="back">← Back to dashboard</Link>
          <h1>Document <span style={{ color: "var(--gold)" }}>Vault</span></h1>
          <p className="sub">
            Keep every certificate in one place. We email you 90, 30 and 7 days before anything expires — so a lapsed medical never costs you a contract.
          </p>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {added === "1" ? <div className="banner ok">Document saved. Expiry reminders are active for it.</div> : null}
          {deleted === "1" ? <div className="banner info">Document removed.</div> : null}
          {error === "missing" ? <div className="banner err">Document type and name are required.</div> : null}
          {error === "file_too_large" ? <div className="banner err">File too large — maximum 5 MB.</div> : null}
          {error === "invalid_type" ? <div className="banner err">Only PDF files are accepted.</div> : null}
          {error === "upload_failed" ? <div className="banner err">Upload failed. Please try again.</div> : null}
          {error === "failed" ? <div className="banner err">Something went wrong. Please try again.</div> : null}

          {/* Özet */}
          <div className="sumgrid">
            <div className="sum g"><p>Valid</p><b>{cValid}</b></div>
            <div className="sum a"><p>Expiring ≤ 90 days</p><b>{cSoon}</b></div>
            <div className="sum r"><p>Expired</p><b>{cExpired}</b></div>
          </div>

          <div className="vgrid">
            {/* Belge listesi */}
            <div className="card">
              <h2>Your documents</h2>
              {docList.length === 0 ? (
                <div className="empty">
                  No documents yet.<br />
                  Add your STCW, COC, medical and passport — takes a minute, saves a contract.
                </div>
              ) : (
                <div className="dlist">
                  {docList.map((doc) => {
                    const s = statusOf(doc.expiry_date as string | null);
                    const cls = s.key === "expired" ? "r" : s.key === "soon" ? "a" : "g";
                    const rowCls = s.key === "expired" ? "drow expired" : s.key === "soon" ? "drow soon" : "drow";
                    const icon = s.key === "expired" ? "⚠️" : s.key === "soon" ? "⏳" : "📄";
                    return (
                      <div key={doc.id as string} className={rowCls}>
                        <div className={"dic " + cls}>{icon}</div>
                        <div className="dinfo">
                          <div className="dtype">{doc.doc_type as string}</div>
                          <div className="dname">{doc.name as string}</div>
                          <div className={"dexp " + cls}>{expiryLine({ expiry_date: doc.expiry_date as string | null })}</div>
                        </div>
                        <div className="dacts">
                          {doc.file_url ? (
                            <a href={doc.file_url as string} target="_blank" rel="noopener noreferrer">View</a>
                          ) : null}
                          <form action={deleteDocument} style={{ display: "inline" }}>
                            <input type="hidden" name="docId" value={doc.id as string} />
                            <button type="submit" className="delbtn">✕</button>
                          </form>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="remind">
                <span className="ri">🔔</span>
                <p><b>Expiry radar is on.</b> You get an email 90, 30 and 7 days before each expiry date — plus an in-app alert. Documents are private: only you can see them.</p>
              </div>
            </div>

            {/* Ekleme formu */}
            <div className="card" style={{ borderColor: "var(--line)" }}>
              <h2>Add document</h2>
              <form action={addDocument}>
                <label htmlFor="docType">Document type</label>
                <select id="docType" name="docType" required defaultValue="">
                  <option value="" disabled>-- Select type --</option>
                  {DOC_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                <label htmlFor="name">Name / description</label>
                <input id="name" name="name" type="text" required maxLength={100} placeholder="e.g. STCW Basic Training, Panama COC" />

                <label htmlFor="expiryDate">Expiry date</label>
                <input id="expiryDate" name="expiryDate" type="date" />
                <p className="hint">Leave empty if the document never expires (e.g. Seaman's Book in some flags).</p>

                <label htmlFor="file">PDF copy (optional)</label>
                <input id="file" name="file" type="file" accept="application/pdf" />
                <p className="hint">Max 5 MB · PDF only · visible only to you.</p>

                <button type="submit" className="btn btn-gold" style={{ width: "100%" }}>+ Save document</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/dashboard">Dashboard</Link> ·{" "}
          <Link href="/jobs">Jobs</Link> · <Link href="/salary">Salary Index</Link>
        </div>
      </footer>
    </>
  );
}
