import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SiteHeader from "@/app/components/site-header";
import { getSortedCountries } from "@/lib/constants/countries";
import Link from "next/link";

export const metadata = {
  title: "Rotation Radar — ShipCrewFinder",
};

export default async function RadarPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!user) redirect("/login");

  const [{ data: me }, { data: myCompany }, { count: unreadCount }, { data: blockedRows }] =
    await Promise.all([
      supabase.from("profiles").select("user_type").eq("id", user.id).single(),
      supabase
        .from("company_details")
        .select("hiring_for_ranks")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false),
      supabase.from("blocked_companies").select("user_id").eq("company_id", user.id),
    ]);

  if (!me || me.user_type !== "company") redirect("/dashboard");

  const hiringRanks: string[] = Array.isArray(myCompany?.hiring_for_ranks)
    ? (myCompany?.hiring_for_ranks as string[])
    : [];
  const blockedByIds = (blockedRows || []).map((r) => r.user_id as string);

  // 90 gün penceresi
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMs = 24 * 3600 * 1000;
  const todayKey = today.toISOString().slice(0, 10);
  const endKey = new Date(today.getTime() + 90 * dayMs).toISOString().slice(0, 10);

  // Kontratı 90 gün içinde biten seafarer detayları
  const { data: rawDetails } = await supabase
    .from("seafarer_details")
    .select("id, rank, nationality, contract_end_date, years_experience")
    .gte("contract_end_date", todayKey)
    .lte("contract_end_date", endKey)
    .order("contract_end_date", { ascending: true });

  let detailList = (rawDetails || []) as Record<string, unknown>[];

  // Şirketin işe aldığı ranklara filtrele (liste boşsa hepsi)
  if (hiringRanks.length > 0) {
    const upper = hiringRanks.map((r) => r.toUpperCase());
    detailList = detailList.filter((d) =>
      upper.includes(((d.rank as string) || "").toUpperCase())
    );
  }

  // Public + engelsiz profillere indirge
  const ids = detailList.map((d) => d.id as string).filter((id) => !blockedByIds.includes(id));
  const profileMap: Record<string, { full_name: string | null; country: string | null }> = {};
  if (ids.length > 0) {
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, full_name, country, visibility, user_type")
      .in("id", ids)
      .eq("visibility", "public")
      .eq("user_type", "seafarer");
    (profs || []).forEach((p) => {
      profileMap[p.id as string] = {
        full_name: (p.full_name as string) || null,
        country: (p.country as string) || null,
      };
    });
  }
  detailList = detailList.filter((d) => profileMap[d.id as string]);

  const daysTo = (dateStr: string) =>
    Math.round((new Date(dateStr + "T00:00:00").getTime() - today.getTime()) / dayMs);

  let c30 = 0, c90 = 0;
  detailList.forEach((d) => {
    const days = daysTo(d.contract_end_date as string);
    if (days <= 30) c30++;
    else c90++;
  });

  const countries = getSortedCountries();
  const countryName = (code: string | null) => {
    if (!code) return "—";
    const c = countries.find((x) => x.code === code);
    return c ? c.flag + " " + c.name : code;
  };

  const fmtDate = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const initialsOf = (rank: string) => {
    const map: Record<string, string> = {
      "MASTER": "MK", "CHIEF OFFICER": "CO", "2ND OFFICER": "2O", "3RD OFFICER": "3O",
      "CHIEF ENGINEER": "CE", "2ND ENGINEER": "2E", "3RD ENGINEER": "3E", "4TH ENGINEER": "4E",
      "ETO": "ET", "ELECTRICIAN": "EL", "BOSUN": "BSN", "A/B": "AB", "O/S": "OS",
      "OILER": "OL", "WIPER": "WP", "MOTORMAN": "MM", "CHIEF COOK": "CK", "COOK": "CK",
      "MESSMAN": "MS", "STEWARD": "ST", "PUMPMAN": "PM",
    };
    const key = (rank || "").toUpperCase();
    return map[key] || key.slice(0, 2) || "??";
  };

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
  .wrap{max-width:880px;margin:0 auto;padding:0 20px}
  .r-hero{position:relative;padding:36px 0 18px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:16px}
  .back:hover{color:var(--gold)}
  h1{font-family:var(--disp);font-size:clamp(1.7rem,4.2vw,2.5rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:8px}
  .sub{font-size:14px;color:var(--tx2);line-height:1.6;max-width:62ch}
  .rtag{display:inline-block;font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(251,191,36,.35);background:rgba(251,191,36,.08);border-radius:999px;padding:4px 12px;margin-bottom:12px}
  section{padding:18px 0 44px}
  .sumgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}
  .sum{border-radius:14px;padding:14px 16px;border:1px solid var(--line2);background:linear-gradient(165deg,var(--navy2),var(--ink))}
  .sum p{font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--tx3);margin-bottom:4px}
  .sum b{font-family:var(--disp);font-size:26px;font-weight:800;color:var(--grn)}
  .sum.later b{color:var(--gold)}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:20px 22px}
  .card h2{font-family:var(--disp);font-size:16.5px;font-weight:800;margin-bottom:12px}
  .rlist{display:flex;flex-direction:column;gap:9px}
  .rrow{display:flex;align-items:center;gap:12px;border:1px solid var(--line2);border-radius:13px;padding:12px 14px;background:rgba(255,255,255,.02);text-decoration:none;color:var(--tx);transition:.18s}
  .rrow:hover{border-color:var(--gold);transform:translateY(-1px)}
  .ravatar{width:42px;height:42px;border-radius:12px;background:rgba(251,191,36,.13);border:1px solid rgba(251,191,36,.3);display:grid;place-items:center;font-family:var(--disp);font-weight:800;font-size:14px;color:var(--gold);flex-shrink:0}
  .rinfo{flex:1;min-width:0}
  .rrank{font-family:var(--disp);font-weight:700;font-size:14px}
  .rmeta{font-size:12px;color:var(--tx2);margin-top:2px}
  .rdate{font-size:12px;color:var(--tx3);margin-top:2px}
  .rpill{flex-shrink:0;font-size:10.5px;font-weight:800;border-radius:999px;padding:4px 11px;border:1px solid;white-space:nowrap}
  .rpill.soon{color:var(--grn);border-color:rgba(52,211,153,.35);background:rgba(52,211,153,.08)}
  .rpill.later{color:var(--gold);border-color:rgba(251,191,36,.35);background:rgba(251,191,36,.08)}
  .empty{text-align:center;padding:30px 12px;font-size:13.5px;color:var(--tx2);line-height:1.7}
  .empty b{color:var(--gold)}
  .mailcard{display:flex;gap:12px;align-items:flex-start;background:rgba(251,191,36,.07);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin-top:16px}
  .mailcard .mi{font-size:17px;flex-shrink:0;margin-top:1px}
  .mailcard b{font-family:var(--disp);font-size:13.5px;display:block;margin-bottom:3px}
  .mailcard p{font-size:12px;color:var(--tx2);line-height:1.6}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader
        isLoggedIn={true}
        userType="company"
        unreadCount={unreadCount || 0}
        active={null}
      />
      <div className="r-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/dashboard" className="back">← Back to dashboard</Link>
          <div style={{ height: 2 }} />
          <span className="rtag">
            {hiringRanks.length > 0 ? "Filtered to your hiring ranks" : "All ranks — set hiring ranks in your profile to filter"}
          </span>
          <h1>Rotation <span style={{ color: "var(--gold)" }}>Radar</span></h1>
          <p className="sub">
            Crew whose current contracts end within 90 days — sorted by sign-off date. Contact them before they even start looking.
          </p>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {/* Özet */}
          <div className="sumgrid">
            <div className="sum">
              <p>Free within 30 days</p>
              <b>{c30}</b>
            </div>
            <div className="sum later">
              <p>Free in 31–90 days</p>
              <b>{c90}</b>
            </div>
          </div>

          {/* Liste */}
          <div className="card">
            <h2>Coming available</h2>
            {detailList.length === 0 ? (
              <div className="empty">
                No upcoming sign-offs match your hiring ranks yet.<br />
                As crew members add their <b>contract end dates</b>, they&apos;ll appear here automatically — sorted by who&apos;s free first.
              </div>
            ) : (
              <div className="rlist">
                {detailList.map((d) => {
                  const id = d.id as string;
                  const prof = profileMap[id];
                  const endDate = d.contract_end_date as string;
                  const days = daysTo(endDate);
                  const soon = days <= 30;
                  const rank = (d.rank as string) || "Crew";
                  const nat = (d.nationality as string) || prof?.country || null;
                  return (
                    <Link key={id} href={"/candidate/" + id} className="rrow">
                      <div className="ravatar">{initialsOf(rank)}</div>
                      <div className="rinfo">
                        <div className="rrank">{rank}</div>
                        <div className="rmeta">{countryName(nat)}</div>
                        <div className="rdate">📅 Contract ends {fmtDate(endDate)} · in {days} day{days === 1 ? "" : "s"}</div>
                      </div>
                      <span className={"rpill " + (soon ? "soon" : "later")}>
                        {soon ? "Soon" : "Upcoming"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="mailcard">
              <span className="mi">📬</span>
              <div>
                <b>Weekly radar email — every Monday</b>
                <p>A summary of who in your hiring ranks becomes available in the next 90 days lands in your inbox at the start of each week. No action needed — it&apos;s on automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/browse">Search Crew</Link> ·{" "}
          <Link href="/jobs/new">Post a Job</Link> · <Link href="/dashboard">Dashboard</Link>
        </div>
      </footer>
    </>
  );
}
