import Link from 'next/link';

export const metadata = {
  title: 'Crew Toolkit — Free Maritime Calculators & Reference Guides | ShipCrewFinder',
  description:
    'Free maritime tools for seafarers — trim interpolation, unit conversion, and in-depth reference guides on MLC, SOLAS, ITF and more. Built for crew, by crew.',
};

type Tool = { name: string; desc: string; href?: string; icon: string };
type Category = { title: string; tools: Tool[] };

const CATEGORIES: Category[] = [
  {
    title: 'Calculators',
    tools: [
      { name: 'Interpolation Calculator', desc: 'Fuel, oil, ballast, sounding tables and more — interpolate any two-point table.', href: '/tools/interpolation-table', icon: '📐' },
      { name: 'Unit Converter', desc: 'Power, speed, volume, weight, length, temperature, pressure.', href: '/tools/unit-converter', icon: '🔄' },
      { name: 'Port-to-Port Distance & ETA', desc: 'Distance, speed table, ETA and fuel consumption.', href: '/tools/distance-eta', icon: '🧭' },
      { name: 'CII Calculator', desc: 'Carbon Intensity Indicator rating and projections.', href: '/tools/cii-calculator', icon: '🌍' },
      { name: 'Stability Calculator', desc: 'Displacement, GM, list, trim and draft from your stability book figures.', href: '/tools/stability', icon: '⚖️' },
      { name: 'Cargo Securing / Lashing', desc: 'CSS Code sliding and tipping checks for your lashing arrangement.', href: '/tools/lashing', icon: '🔗' },
    ],
  },
  {
    title: 'Tracking Tools',
    tools: [
      { name: 'Cargo Database', desc: 'Stowage factors, IMSBC groups, hazards for 68+ cargoes, plus hold volume calculator.', href: '/tools/cargo', icon: '📦' },
      { name: 'Documents Generator', desc: 'NOR, SOF, LOI and 14 Letter of Protest scenarios — delay, damage, short-landed and more.', href: '/tools/documents', icon: '📄' },
      { name: 'Maintenance', desc: 'Planned maintenance and job tracking.', icon: '🔧' },
      { name: 'Ports Database', desc: 'Draft, terminals, pilotage, VHF for 26 major ports, plus official PSC history links.', href: '/tools/ports', icon: '⚓' },
      { name: 'Spares', desc: 'Spare parts inventory and reorder tracking.', icon: '🛠️' },
      { name: 'Tide Calculator', desc: 'HW/LW interpolation, UKC check, safe window finder, with tide curve chart.', href: '/tools/tide', icon: '🌊' },
      { name: 'Visa Requirements', desc: 'Shore leave, sign-on/off and transit guidance for 14 major maritime countries.', href: '/tools/visa', icon: '🛂' },
      { name: 'Claim Center', desc: 'Demurrage, off-hire, speed/consumption and other claims with time-bar tracking.', href: '/tools/claims', icon: '📋' },
    ],
  },
  {
    title: 'Reference Guides',
    tools: [
      { name: 'PSC Preparation', desc: 'Deficiency code database, MoU portals, CIC campaigns, action codes.', href: '/tools/psc', icon: '🔍' },
      { name: 'MLC 2006 Guide', desc: 'All 5 Titles — employment, wages, rest hours, accommodation, complaints.', href: '/tools/mlc', icon: '⚖️' },
      { name: 'ITF Guide', desc: 'Agreements, inspectors, common scenarios (unpaid wages, abandonment) and how to get help.', href: '/tools/itf', icon: '🤝' },
      { name: 'SOLAS Guide', desc: 'Fire safety, life-saving appliances & drills, GMDSS, navigation safety.', href: '/tools/solas', icon: '🛟' },
      { name: 'COLREGs Quick Reference', desc: 'Look-out, steering rules, lights & shapes, sound signals for watchkeepers.', href: '/tools/colregs', icon: '🧭' },
      { name: 'ISM Code Guide', desc: 'DPA, Master authority, DOC/SMC certificates, non-conformity reporting.', href: '/tools/ism', icon: '📘' },
      { name: 'IMDG / Dangerous Goods', desc: 'All 9 UN hazard classes, documentation, segregation, EmS/MFAG references.', href: '/tools/imdg', icon: '☢️' },
      { name: 'Certificate Requirements by Rank', desc: 'Exactly which certificates you need for your rank.', icon: '🎓' },
      { name: 'Flag State Comparison', desc: 'Endorsement differences across major flags.', icon: '🏴' },
      { name: 'Enclosed Space Entry', desc: 'Gas testing sequence and permit requirements.', icon: '🚪' },
      { name: 'Emergency Procedures', desc: 'Fire, flooding, man overboard, abandon ship.', icon: '🚨' },
      { name: 'BMP5 / Piracy Risk Guide', desc: 'Precautions for high-risk area transits.', icon: '🛡️' },
      { name: 'Ballast Water Management', desc: 'D-1/D-2 standards, exchange vs treatment.', icon: '💧' },
      { name: 'Port Entry Documentation', desc: 'Requirements by region — US, EU and more.', icon: '📑' },
      { name: 'Medical Emergency Guide', desc: 'Standard procedure reference for common emergencies.', icon: '🏥' },
      { name: 'ISPS Code Guide', desc: 'Security levels and required actions.', icon: '🔐' },
      { name: 'Heavy Weather Guide', desc: 'Routing and preparation for storm avoidance.', icon: '🌀' },
      { name: 'Ice Navigation Guide', desc: 'Procedures for transiting ice-affected waters.', icon: '❄️' },
      { name: 'Tanker Vetting Prep', desc: 'SIRE / CDI inspection readiness checklist.', icon: '🛢️' },
      { name: 'Draft Survey Calculator', desc: 'Quadratic mean draft, trim and density correction, cargo quantity.', href: '/tools/draft-survey', icon: '📏' },
      { name: 'Fatigue Management Guide', desc: 'Rest hour compliance rules explained.', icon: '😴' },
    ],
  },
];

const totalLive = CATEGORIES.flatMap((c) => c.tools).filter((t) => t.href).length;
const totalPlanned = CATEGORIES.flatMap((c) => c.tools).length;

export default function CrewToolkitPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .tk-top{position:sticky;top:0;z-index:50;background:rgba(10,37,64,.85);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.08)}
        .tk-top-in{max-width:1180px;margin:0 auto;padding:0 20px;height:66px;display:flex;align-items:center;justify-content:space-between}
        .tk-logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:#eef4fa;font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:700;font-size:18px}
        .tk-logo span{color:#fbbf24}
        .tk-hero{max-width:1180px;margin:0 auto;padding:44px 20px 8px}
        .tk-tag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#fbbf24;background:rgba(251,191,36,.09);border:1px solid rgba(251,191,36,.16);border-radius:8px;padding:5px 12px;margin-bottom:14px}
        .tk-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;letter-spacing:-.02em;line-height:1.1;margin-bottom:14px}
        .tk-title em{color:#fbbf24;font-style:normal}
        .tk-sub{font-size:15px;color:#a8bdd2;line-height:1.7;max-width:62ch;margin-bottom:8px}
        .tk-stat{font-size:12.5px;color:#6b83a0;margin-bottom:30px}
        .tk-cat{max-width:1180px;margin:0 auto;padding:26px 20px}
        .tk-cat-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:19px;font-weight:800;margin-bottom:16px;letter-spacing:-.01em}
        .tk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
        .tk-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;text-decoration:none;color:#eef4fa;transition:.18s;display:block;position:relative}
        .tk-card.live:hover{transform:translateY(-3px);border-color:#fbbf24;box-shadow:0 10px 28px rgba(251,191,36,.12)}
        .tk-card.soon{opacity:.5;cursor:default}
        .tk-icon{font-size:24px;margin-bottom:10px}
        .tk-card-name{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:700;font-size:14.5px;margin-bottom:5px}
        .tk-card-desc{font-size:12px;color:#a8bdd2;line-height:1.5}
        .tk-badge{position:absolute;top:14px;right:14px;font-size:9.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:3px 8px;border-radius:5px}
        .tk-badge.live{background:rgba(52,211,153,.14);color:#34d399;border:1px solid rgba(52,211,153,.3)}
        .tk-badge.soon{background:rgba(255,255,255,.06);color:#6b83a0;border:1px solid rgba(255,255,255,.1)}
        .tk-cta{max-width:1180px;margin:40px auto 0;padding:0 20px 60px}
        .tk-cta-box{background:linear-gradient(160deg,rgba(251,191,36,.08),#050716);border:1.5px solid rgba(251,191,36,.2);border-radius:20px;padding:28px;display:flex;gap:16px;flex-wrap:wrap;align-items:center;justify-content:space-between}
        .tk-cta-text b{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:16px;display:block;margin-bottom:4px}
        .tk-cta-text p{font-size:12.5px;color:#a8bdd2}
        .tk-cta-btns{display:flex;gap:10px;flex-wrap:wrap}
        .tk-btn{padding:11px 20px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;white-space:nowrap}
        .tk-btn-gold{background:linear-gradient(135deg,#fbbf24,#e0a010);color:#0b0e13}
        .tk-btn-ghost{color:#eef4fa;border:1px solid rgba(255,255,255,.14)}
        @media(max-width:640px){
          .tk-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
          .tk-card{padding:14px}
          .tk-hero{padding:30px 16px 4px}
        }
      `}</style>

      <header className="tk-top">
        <div className="tk-top-in">
          <Link href="/" className="tk-logo">⚓ Ship<span>Crew</span>Finder</Link>
          <Link href="/dashboard" className="tk-btn tk-btn-ghost" style={{ padding: '9px 16px', fontSize: 13 }}>Dashboard</Link>
        </div>
      </header>

      <div className="tk-hero">
        <div className="tk-tag">Free · No Signup Required</div>
        <h1 className="tk-title">The <em>Crew Toolkit</em></h1>
        <p className="tk-sub">
          Calculators, tracking tools and in-depth reference guides — built for the day-to-day reality of life at sea.
          Everything a working seafarer actually reaches for, in one place.
        </p>
        <p className="tk-stat">{totalLive} tools live now · {totalPlanned - totalLive} more in active development</p>
      </div>

      {CATEGORIES.map((cat) => (
        <div className="tk-cat" key={cat.title}>
          <div className="tk-cat-title">{cat.title}</div>
          <div className="tk-grid">
            {cat.tools.map((t) =>
              t.href ? (
                <Link key={t.name} href={t.href} className="tk-card live">
                  <span className="tk-badge live">Live</span>
                  <div className="tk-icon">{t.icon}</div>
                  <div className="tk-card-name">{t.name}</div>
                  <div className="tk-card-desc">{t.desc}</div>
                </Link>
              ) : (
                <div key={t.name} className="tk-card soon">
                  <span className="tk-badge soon">Coming soon</span>
                  <div className="tk-icon">{t.icon}</div>
                  <div className="tk-card-name">{t.name}</div>
                  <div className="tk-card-desc">{t.desc}</div>
                </div>
              )
            )}
          </div>
        </div>
      ))}

      <div className="tk-cta">
        <div className="tk-cta-box">
          <div className="tk-cta-text">
            <b>Built for verified crew and companies</b>
            <p>Free tools for everyone — plus a verified profile that gets you found directly by shipping companies.</p>
          </div>
          <div className="tk-cta-btns">
            <Link href="/signup/crew" className="tk-btn tk-btn-gold">⚓ I&apos;m Crew — Join Free</Link>
            <Link href="/signup/company" className="tk-btn tk-btn-ghost">🏢 Hiring? Find Crew</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
