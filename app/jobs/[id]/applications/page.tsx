import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import SiteHeader from "@/app/components/site-header";
import ApplicationControls from "@/app/components/application-controls";
import { getSortedCountries } from "@/lib/constants/countries";
import Link from "next/link";

export const metadata = {
  title: "Applications — ShipCrewFinder",
};

const STATUS_META: Record<string, { label: string; icon: string; cls: string }> = {
  new: { label: "New", icon: "🆕", cls: "st-new" },
  contacted: { label: "Contacted", icon: "💬", cls: "st-con" },
  shortlisted: { label: "Shortlisted", icon: "⭐", cls: "st-short" },
  hired: { label: "Hired", icon: "✅", cls: "st-hired" },
  rejected: { label: "Rejected", icon: "✕", cls: "st-rej" },
};

const STATUS_ORDER = ["new", "contacted", "shortlisted", "hired", "rejected"];

type ProfEntry = { full_name: string; user_type: string; country: string | null; cv_share_code: string | null };
type DetEntry = { rank: string | null; availability: string | null; nationality: string | null };

export default async function JobApplicationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const filter = sp.status || "all";

  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!user) redirect("/login");

  const [{ data: job }, { count: unreadCount }] = await Promise.all([
    supabase
      .from("jobs")
      .select("id, title, position, job_type, company_id, status")
      .eq("id", id)
      .eq("company_id", user.id)
      .single(),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false),
  ]);

  if (!job) notFound();

  // Başvurular
  const { data: applications } = await supabase
    .from("job_applications")
    .select("id, applicant_id, message, status, company_note, created_at")
    .eq("job_id", job.id)
    .order("created_at", { ascending: false });

  const apps = applications || [];

  // Başvuran profilleri + detayları (tek turda)
  const applicantIds = [...new Set(apps.map((a) => a.applicant_id as string))];
  const profileMap: Record<string, ProfEntry> = {};
  const detailMap: Record<string, DetEntry> = {};

  if (applicantIds.length > 0) {
    const [{ data: profiles }, { data: sfDetails }, { data: ytDetails }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, user_type, country, cv_share_code")
        .in("id", applicantIds),
      supabase
        .from("seafarer_details")
        .select("id, rank, availability, nationality")
        .in("id", applicantIds),
      supabase
        .from("yacht_details")
        .select("id, position, availability")
        .in("id", applicantIds),
    ]);
    (profiles || []).forEach((p) => {
      profileMap[p.id as string] = {
        full_name: (p.full_name as string) || "A candidate",
        user_type: (p.user_type as string) || "seafarer",
        country: (p.country as string) || null,
        cv_share_code: (p.cv_share_code as string) || null,
      };
    });
    (sfDetails || []).forEach((d) => {
      detailMap[d.id as string] = {
        rank: (d.rank as string) || null,
        availability: (d.availability as string) || null,
        nationality: (d.nationality as string) || null,
      };
    });
    (ytDetails || []).forEach((d) => {
      if (!detailMap[d.id as string]) {
        detailMap[d.id as string] = {
          rank: (d.position as string) || null,
          availability: (d.availability as string) || null,
          nationality: null,
        };
      }
    });
  }

  // Sayaçlar
  const counts: Record<string, number> = { all: apps.length };
  STATUS_ORDER.forEach((s) => {
    counts[s] = apps.filter((a) => ((a.status as string) || "new") === s).length;
  });

  // Filtre + sıralama (rejected en alta)
  let shown = apps;
  if (filter !== "all") {
    shown = apps.filter((a) => ((a.status as string) || "new") === filter);
  }
  shown = [...shown].sort((a, b) => {
    const sa = ((a.status as string) || "new") === "rejected" ? 1 : 0;
    const sb = ((b.status as string) || "new") === "rejected" ? 1 : 0;
    return sa - sb;
  });

  const countries = getSortedCountries();
  const countryLabel = (code: string | null) => {
    if (!code) return null;
    const c = countries.find((x) => x.code === code || x.name === code);
    return c ? c.flag + " " + c.name : code;
  };

  const availLabel = (v: string | null) => {
    if (!v) return null;
    if (v === "immediate") return "Available now";
    if (v === "1-3_months") return "Available in 1–3m";
    if (v === "3+_months") return "Available in 3+m";
    return v;
  };

  const ago = (d: string) => {
    const mins = Math.round((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 60) return mins + "m ago";
    const h = Math.round(mins / 60);
    if (h < 24) return h + "h ago";
    const days = Math.round(h / 24);
    if (days < 30) return days + "d ago";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const filterHref = (s: string) =>
    "/jobs/" + job.id + "/applications" + (s === "all" ? "" : "?status=" + s);
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
  .wrap{max-width:860px;margin:0 auto;padding:0 20px}
  .a-hero{position:relative;padding:34px 0 10px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:14px}
  .back:hover{color:var(--gold)}
  .jtag{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(251,191,36,.35);background:rgba(251,191,36,.08);border-radius:999px;padding:4px 12px;margin-bottom:10px}
  h1{font-family:var(--disp);font-size:clamp(1.6rem,4vw,2.3rem);font-weight:800;line-height:1.12;letter-spacing:-.02em;margin-bottom:6px}
  .sub{font-size:13.5px;color:var(--tx2)}
  section{padding:16px 0 44px}
  .tabs{display:flex;gap:7px;overflow-x:auto;padding-bottom:6px;margin-bottom:14px;-webkit-overflow-scrolling:touch}
  .tab{display:inline-flex;align-items:center;gap:6px;white-space:nowrap;text-decoration:none;font-size:12px;font-weight:700;border-radius:999px;padding:7px 14px;border:1px solid var(--line2);color:var(--tx2);transition:.15s;font-family:var(--body)}
  .tab:hover{border-color:var(--gold);color:var(--gold)}
  .tab.on{background:rgba(251,191,36,.12);border-color:rgba(251,191,36,.45);color:var(--gold)}
  .tab .n{font-size:10.5px;background:rgba(255,255,255,.07);border-radius:999px;padding:1px 7px}
  .alist{display:flex;flex-direction:column;gap:11px}
  .acard{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:16px;padding:16px 18px;transition:.15s}
  .acard.rej{opacity:.55}
  .acard.hired{border-color:rgba(52,211,153,.4)}
  .acard.short{border-color:rgba(251,191,36,.4)}
  .a-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;margin-bottom:5px}
  .aname{font-family:var(--disp);font-weight:700;font-size:15.5px}
  .aname small{color:var(--gold);font-size:12.5px;font-weight:700}
  .stpill{font-size:10px;font-weight:800;letter-spacing:.05em;border-radius:999px;padding:4px 11px;border:1px solid;white-space:nowrap}
  .st-new{color:var(--gold);border-color:rgba(251,191,36,.4);background:rgba(251,191,36,.09)}
  .st-con{color:#60a5fa;border-color:rgba(96,165,250,.4);background:rgba(96,165,250,.09)}
  .st-short{color:var(--gold);border-color:rgba(251,191,36,.55);background:rgba(251,191,36,.14)}
  .st-hired{color:var(--grn);border-color:rgba(52,211,153,.45);background:rgba(52,211,153,.1)}
  .st-rej{color:var(--red);border-color:rgba(239,68,68,.4);background:rgba(239,68,68,.09)}
  .ameta{font-size:12px;color:var(--tx2);margin-bottom:9px}
  .ameta .dot{color:var(--tx3)}
  .amsg{font-size:12.5px;color:var(--tx2);line-height:1.6;border-left:3px solid var(--line);padding-left:11px;margin-bottom:11px;white-space:pre-line}
  .abtns{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:11px}
  .abtn{display:inline-flex;align-items:center;gap:6px;border-radius:10px;font-weight:700;font-size:12px;text-decoration:none;padding:8px 14px;transition:.15s;font-family:var(--body)}
  .abtn.gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .abtn.gold:hover{transform:translateY(-1px)}
  .abtn.ghost{color:var(--tx);border:1px solid var(--line2)}
  .abtn.ghost:hover{border-color:var(--gold);color:var(--gold)}
  .empty{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:36px;text-align:center;font-size:13.5px;color:var(--tx2);line-height:1.7}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader isLoggedIn={true} userType="company" unreadCount={unreadCount || 0} active={null} />

      <div className="a-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/jobs/mine" className="back">← My Job Posts</Link>
          <div style={{ height: 2 }} />
          <span className="jtag">{job.position}</span>
          <h1>Applications</h1>
          <p className="sub">{job.title} · {apps.length} applicant{apps.length === 1 ? "" : "s"} · track every candidate from first contact to hire</p>
        </div>
      </div>

      <section style={{ paddingTop: 6 }}>
        <div className="wrap">
          {/* Durum sekmeleri */}
          <div className="tabs">
            <Link href={filterHref("all")} className={"tab" + (filter === "all" ? " on" : "")}>All <span className="n">{counts.all}</span></Link>
            {STATUS_ORDER.map((s) => (
              <Link key={s} href={filterHref(s)} className={"tab" + (filter === s ? " on" : "")}>{STATUS_META[s].icon} {STATUS_META[s].label} <span className="n">{counts[s]}</span></Link>
            ))}
          </div>

          {shown.length === 0 ? (
            <div className="empty">
              {filter === "all"
                ? "No applications yet. Crew with matching job alerts were notified when you posted — applications will land here."
                : "No applicants in this stage."}
            </div>
          ) : (
            <div className="alist">
              {shown.map((a) => {
                const st = ((a.status as string) || "new");
                const meta = STATUS_META[st] || STATUS_META.new;
                const prof = profileMap[a.applicant_id as string];
                const det = detailMap[a.applicant_id as string];
                const cardCls = "acard" + (st === "rejected" ? " rej" : st === "hired" ? " hired" : st === "shortlisted" ? " short" : "");
                const natText = countryLabel(det?.nationality || prof?.country || null) || "—";
                const avText = availLabel(det?.availability || null);
                return (
                  <div key={a.id as string} className={cardCls}>
                    <div className="a-top">
                      <div className="aname">{prof?.full_name || "A candidate"} {det?.rank ? <small>— {det.rank}</small> : null}</div>
                      <span className={"stpill " + meta.cls}>{meta.icon} {meta.label.toUpperCase()}</span>
                    </div>
                    <div className="ameta">
                      {natText}
                      {avText ? <> <span className="dot">·</span> <span style={{ color: "var(--grn)" }}>{avText}</span></> : null}
                      <span className="dot"> · </span>applied {ago(a.created_at as string)}
                    </div>

                    {a.message ? <div className="amsg">{a.message as string}</div> : null}

                    <div className="abtns">
                      <Link href={"/candidate/" + (a.applicant_id as string)} className="abtn gold">View profile →</Link>
                      {prof?.cv_share_code ? (
                        <a href={"/cv/share/" + prof.cv_share_code} target="_blank" rel="noopener noreferrer" className="abtn ghost">📄 SCF CV</a>
                      ) : null}
                    </div>

                    <ApplicationControls applicationId={a.id as string} status={st} note={(a.company_note as string) || null} />
                  </div>
                );
              })}
            </div>
          )}
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
