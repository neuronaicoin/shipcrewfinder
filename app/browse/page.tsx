import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SiteHeader from "@/app/components/site-header";
import { SHIP_RANKS } from "@/lib/constants/ranks";
import { getSortedCountries } from "@/lib/constants/countries";
import { getSortedLanguages } from "@/lib/constants/languages";
import Link from "next/link";

export const metadata = {
  title: "Search for Crew — ShipCrewFinder",
};

type ProfileRow = {
  id: string;
  user_type: string;
  full_name: string | null;
  country: string | null;
  avatar_url: string | null;
  visibility: string | null;
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const fRank = sp.rank || "";
  const fCountry = sp.country || "";
  const fExp = sp.exp || "";
  const fAvail = sp.avail || "";
  const fLang = sp.lang || "";

  const supabase = await createClient();

  // getSession: çerezden okur — ekstra ağ turu yok
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!user) redirect("/login");

  const [{ data: me }, { count: unreadCount }, { data: blockedRows }] =
    await Promise.all([
      supabase.from("profiles").select("user_type").eq("id", user.id).single(),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false),
      supabase.from("blocked_companies").select("user_id").eq("company_id", user.id),
    ]);

  if (!me || me.user_type !== "company") redirect("/dashboard");

  const blockedByIds = (blockedRows || []).map((r) => r.user_id as string);

  // Base profile query
  let query = supabase
    .from("profiles")
    .select("id, user_type, full_name, country, avatar_url, visibility")
    .eq("visibility", "public");

  query = query.eq("user_type", "seafarer");

  if (fCountry) {
    query = query.eq("country", fCountry);
  }

  if (blockedByIds.length > 0) {
    query = query.not("id", "in", `(${blockedByIds.join(",")})`);
  }

  const { data: profiles } = await query;
  let profileList = (profiles || []) as ProfileRow[];

  // Fetch details
  const seafarerIds = profileList.map((p) => p.id);

  const detailsMap: Record<string, Record<string, unknown>> = {};

  if (seafarerIds.length > 0) {
    const { data } = await supabase
      .from("seafarer_details")
      .select("id, rank, years_experience, nationality, availability, languages")
      .in("id", seafarerIds);
    (data || []).forEach((d) => {
      detailsMap[d.id as string] = d as Record<string, unknown>;
    });
  }

  // Apply detail-based filters in code
  profileList = profileList.filter((p) => {
    const d = detailsMap[p.id] || {};

    if (fRank) {
      const role = ((d.rank as string) || (d.position as string) || "").toUpperCase();
      if (!role.includes(fRank.toUpperCase())) return false;
    }

    if (fExp) {
      const y = (d.years_experience as number) ?? -1;
      if (fExp === "0-1" && !(y >= 0 && y <= 1)) return false;
      if (fExp === "1-3" && !(y >= 2 && y <= 3)) return false;
      if (fExp === "3+" && !(y >= 4)) return false;
    }

    if (fAvail) {
      if ((d.availability as string) !== fAvail) return false;
    }

    if (fLang) {
      const langs = Array.isArray(d.languages) ? (d.languages as string[]) : [];
      if (!langs.includes(fLang)) return false;
    }

    return true;
  });

  const expLabel = (y: unknown) => {
    const n = y as number | null | undefined;
    if (n === undefined || n === null) return "—";
    if (n <= 1) return "0–1 yrs";
    if (n <= 3) return "1–3 yrs";
    return "3+ yrs";
  };

  const availLabel = (a: unknown) => {
    const v = a as string | null | undefined;
    if (!v) return null;
    if (v === "immediate") return "Available now";
    if (v === "1-3_months") return "1–3 months";
    if (v === "3+_months") return "3+ months";
    return v;
  };

  const countries = getSortedCountries();
  const languages = getSortedLanguages();
  const countryName = (code: string | null) => {
    if (!code) return "—";
    const c = countries.find((x) => x.code === code);
    return c ? `${c.flag} ${c.name}` : code;
  };

  const hasFilter = fRank || fCountry || fExp || fAvail || fLang;

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
  .wrap{max-width:1080px;margin:0 auto;padding:0 20px}
  .br-hero{position:relative;padding:38px 0 22px;overflow:hidden}
  .aur{position:absolute;width:460px;height:460px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.45;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:16px}
  .back:hover{color:var(--gold)}
  h1{font-family:var(--disp);font-size:clamp(1.8rem,4.4vw,2.8rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:8px}
  .sub{font-size:14.5px;color:var(--tx2)}
  section{padding:20px 0 44px}
  .fcard{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:20px;margin-bottom:22px}
  .frow{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
  @media(max-width:860px){.frow{grid-template-columns:1fr 1fr}}
  @media(max-width:560px){.frow{grid-template-columns:1fr}}
  label{display:block;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--tx3);margin-bottom:7px}
  select,input[type=text]{width:100%;background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:11px;padding:11px 13px;font-family:var(--body);font-size:13.5px;font-weight:500;outline:none}
  select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23fbbf24' d='M6 8L0 0h12z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 0.85rem center;padding-right:2.2rem}
  select:focus,input[type=text]:focus{border-color:var(--gold)}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:11px 19px;font-family:var(--body)}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-gold:hover{transform:translateY(-2px)}
  .btn-ghost{color:var(--tx);border:1px solid var(--line2);background:transparent}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
  .cgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  @media(max-width:960px){.cgrid{grid-template-columns:1fr 1fr}}
  @media(max-width:620px){.cgrid{grid-template-columns:1fr}}
  .ccard{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:16px;padding:20px;display:flex;flex-direction:column;transition:.2s}
  .ccard:hover{transform:translateY(-2px);border-color:var(--gold)}
  .chead{display:flex;align-items:flex-start;gap:12px;margin-bottom:14px}
  .avatar{flex-shrink:0;width:46px;height:46px;border-radius:13px;background:rgba(251,191,36,.13);border:1px solid rgba(251,191,36,.3);display:grid;place-items:center;font-family:var(--disp);font-weight:800;font-size:18px;color:var(--gold)}
  .cname{font-family:var(--disp);font-weight:700;font-size:15.5px;line-height:1.25}
  .crole{color:var(--gold);font-size:12.5px;font-weight:700;margin-top:2px}
  .crows{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;font-size:12.5px}
  .crow{display:flex;justify-content:space-between;gap:10px}
  .crow span{color:var(--tx3)}
  .crow b{font-weight:600;text-align:right;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .crow b.av{color:var(--grn)}
  .empty{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:40px;text-align:center;font-size:14px;color:var(--tx2)}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader
        isLoggedIn={true}
        userType="company"
        unreadCount={unreadCount || 0}
        active="browse"
      />
      <div className="br-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/dashboard" className="back">← Back to dashboard</Link>
          <h1>Search for <span style={{ color: "var(--gold)" }}>Crew</span></h1>
          <p className="sub">
            {profileList.length} verified maritime professional{profileList.length === 1 ? "" : "s"} found — contact directly, zero commission.
          </p>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {/* Filters */}
          <form method="get" className="fcard">
            <div className="frow">
              <div>
                <label>Rank / Position</label>
                <select name="rank" defaultValue={fRank}>
                  <option value="">All ranks</option>
                  <optgroup label="Deck Department">
                    {SHIP_RANKS["Deck Department"].map((r) => <option key={r} value={r}>{r}</option>)}
                  </optgroup>
                  <optgroup label="Engine Department">
                    {SHIP_RANKS["Engine Department"].map((r) => <option key={r} value={r}>{r}</option>)}
                  </optgroup>
                  <optgroup label="Catering Department">
                    {SHIP_RANKS["Catering Department"].map((r) => <option key={r} value={r}>{r}</option>)}
                  </optgroup>
                </select>
              </div>
              <div>
                <label>Country</label>
                <select name="country" defaultValue={fCountry}>
                  <option value="">All countries</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Experience</label>
                <select name="exp" defaultValue={fExp}>
                  <option value="">All</option>
                  <option value="0-1">0–1 years</option>
                  <option value="1-3">1–3 years</option>
                  <option value="3+">3+ years</option>
                </select>
              </div>
              <div>
                <label>Availability</label>
                <select name="avail" defaultValue={fAvail}>
                  <option value="">All</option>
                  <option value="immediate">Within 1 month</option>
                  <option value="1-3_months">1–3 months</option>
                  <option value="3+_months">3+ months</option>
                </select>
              </div>
              <div>
                <label>Language</label>
                <select name="lang" defaultValue={fLang}>
                  <option value="">All</option>
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button type="submit" className="btn btn-gold">Apply Filters</button>
              {hasFilter ? (
                <Link href="/browse" className="btn btn-ghost">Clear</Link>
              ) : null}
            </div>
          </form>

          {/* Results */}
          {profileList.length === 0 ? (
            <div className="empty">
              No candidates match your filters. Try widening your search — new verified profiles join every week.
            </div>
          ) : (
            <div className="cgrid">
              {profileList.map((p) => {
                const d = detailsMap[p.id] || {};
                const roleTitle = (d.rank as string) || (d.position as string) || "Maritime Professional";
                const langs = Array.isArray(d.languages) ? (d.languages as string[]) : [];
                const avail = availLabel(d.availability);

                return (
                  <div key={p.id} className="ccard">
                    <div className="chead">
                      <div className="avatar">
                        {(p.full_name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div className="cname">{p.full_name || "Unnamed"}</div>
                        <div className="crole">{roleTitle}</div>
                      </div>
                    </div>

                    <div className="crows">
                      <div className="crow">
                        <span>Experience</span>
                        <b>{expLabel(d.years_experience)}</b>
                      </div>
                      <div className="crow">
                        <span>Country</span>
                        <b>{countryName((d.nationality as string) || p.country)}</b>
                      </div>
                      {langs.length > 0 ? (
                        <div className="crow">
                          <span>Languages</span>
                          <b>{langs.join(", ")}</b>
                        </div>
                      ) : null}
                      {avail ? (
                        <div className="crow">
                          <span>Availability</span>
                          <b className="av">{avail}</b>
                        </div>
                      ) : null}
                    </div>

                    <Link
                      href={`/candidate/${p.id}`}
                      className="btn btn-gold"
                      style={{ marginTop: "auto", width: "100%" }}
                    >
                      View Profile →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/jobs/new">Post a Job</Link> ·{" "}
          <Link href="/salary">Salary Index</Link> · <Link href="/dashboard">Dashboard</Link>
        </div>
      </footer>
    </>
  );
}
