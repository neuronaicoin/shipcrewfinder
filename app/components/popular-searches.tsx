import Link from "next/link";

const LINKS: { href: string; label: string }[] = [
  { href: "/crew/chief-engineer", label: "Chief Engineer Salary & Jobs" },
  { href: "/crew/master", label: "Master / Captain Jobs" },
  { href: "/crew/chief-officer", label: "Chief Officer Jobs" },
  { href: "/crew/2nd-engineer", label: "2nd Engineer Salary" },
  { href: "/crew/able-seaman", label: "Able Seaman (AB) Jobs" },
  { href: "/crew/eto", label: "ETO Jobs & Salary" },
  { href: "/crew/chief-engineer/lng", label: "Chief Engineer — LNG Carrier" },
  { href: "/crew/master/tanker", label: "Master — Tanker" },
  { href: "/crew/2nd-engineer/container", label: "2nd Engineer — Container Ship" },
  { href: "/crew/chief-officer/bulk-carrier", label: "Chief Officer — Bulk Carrier" },
  { href: "/crew/cook", label: "Ship Cook Jobs" },
  { href: "/crew/bosun", label: "Bosun Jobs & Salary" },
  { href: "/salary", label: "2026 Salary Index — 15 Ranks" },
  { href: "/jobs", label: "All Maritime Jobs" },
  { href: "/vessels", label: "Browse Vessels" },
  { href: "/companies", label: "Shipping Companies" },
];

export default function PopularSearches() {
  return (
    <section className="psrch">
      <style>{`
  .psrch{padding:30px 0 8px}
  .psrch .wrap{max-width:1180px;margin:0 auto;padding:0 20px}
  .ps-head{font-family:var(--disp,var(--font-bricolage),sans-serif);font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold,#fbbf24);margin-bottom:14px}
  .ps-grid{display:flex;flex-wrap:wrap;gap:9px}
  .ps-grid a{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:var(--tx2,#a8bdd2);text-decoration:none;border:1px solid var(--line2,rgba(255,255,255,.08));border-radius:999px;padding:8px 15px;background:rgba(255,255,255,.02);transition:.15s}
  .ps-grid a:hover{color:var(--gold,#fbbf24);border-color:var(--gold,#fbbf24);background:rgba(251,191,36,.06)}
  .ps-grid a::before{content:'⚓';font-size:10px;opacity:.5}
  body.light .ps-grid a{background:rgba(255,255,255,.6);border-color:rgba(15,25,60,.13)}
`}</style>
      <div className="wrap">
        <div className="ps-head">🔍 Popular searches</div>
        <div className="ps-grid">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}
