'use client';
import { useState } from 'react';
import Link from 'next/link';

type SectionKey = 'what' | 'planning' | 'measures' | 'attack';

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'what', label: 'What Is BMP5' },
  { key: 'planning', label: 'Before Transit' },
  { key: 'measures', label: 'Ship Protection Measures' },
  { key: 'attack', label: 'If Approached / Boarded' },
];

export default function Bmp5Page() {
  const [tab, setTab] = useState<SectionKey>('what');

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .bm-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .bm-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .bm-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .bm-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .bm-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .bm-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
        .bm-tab{background:transparent;color:#6b83a0;border:1px solid rgba(255,255,255,.12);padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;border-radius:9px;font-family:inherit}
        .bm-tab.active{background:#fbbf24;color:#0b0e13;border-color:#fbbf24}
        .bm-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:12px}
        .bm-h{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:14px;color:#fbbf24;margin-bottom:8px}
        .bm-p{font-size:12.5px;color:#a8bdd2;line-height:1.7;margin-bottom:8px}
        .bm-step{display:flex;gap:12px;margin-bottom:10px;align-items:flex-start}
        .bm-num{width:24px;height:24px;border-radius:50%;background:rgba(251,191,36,.15);border:1px solid rgba(251,191,36,.4);color:#fbbf24;font-weight:800;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .bm-text{font-size:12.5px;color:#eef4fa;line-height:1.6;padding-top:2px}
        .bm-critical{background:rgba(248,113,113,.1);border:2px solid rgba(248,113,113,.4);border-radius:14px;padding:18px;margin-bottom:12px}
      `}</style>

      <div className="bm-wrap">
        <Link href="/tools" className="bm-back">← All Tools</Link>
        <div className="bm-title">BMP5 / Piracy Risk Guide</div>
        <p className="bm-sub">
          Industry Best Management Practices for protection against piracy and armed robbery — planning, ship protection measures, and citadel procedures.
        </p>
        <div className="bm-warn">
          ⚠ <b>General guidance only.</b> BMP is industry guidance, not a regulatory convention. Always follow your company&apos;s specific voyage risk assessment, current UKMTO/naval force guidance for the transit area, and your vessel&apos;s Ship Security Plan.
        </div>

        <div className="bm-tabs">
          {SECTIONS.map((s) => (
            <button key={s.key} className={`bm-tab ${tab === s.key ? 'active' : ''}`} onClick={() => setTab(s.key)}>{s.label}</button>
          ))}
        </div>

        {tab === 'what' && (
          <div className="bm-card">
            <div className="bm-h">What Is BMP5</div>
            <p className="bm-p">Best Management Practices (currently in its fifth edition, BMP5) is industry guidance — developed by shipping organizations and endorsed by IMO — providing practical self-protection measures for vessels transiting areas with piracy or armed robbery risk.</p>
            <p className="bm-p">BMP is not a mandatory convention like SOLAS, but is very widely adopted across the industry and referenced in company voyage planning and Ship Security Plans for relevant transits.</p>
            <p className="bm-p">Historically most closely associated with the Gulf of Aden / Horn of Africa region, BMP-style guidance is now applied more broadly wherever piracy or armed robbery risk is assessed, including parts of the Gulf of Guinea and Strait of Malacca/Singapore, with region-specific guidance updated as the risk picture changes.</p>
          </div>
        )}

        {tab === 'planning' && (
          <div className="bm-card">
            <div className="bm-h">Before Transit</div>
            <div className="bm-step"><div className="bm-num">1</div><div className="bm-text">Company conducts a voyage-specific risk assessment before entering any designated high-risk area, informed by current threat guidance.</div></div>
            <div className="bm-step"><div className="bm-num">2</div><div className="bm-text">Register the vessel and voyage details with UKMTO (UK Maritime Trade Operations) or the relevant regional reporting centre before transit — this is a widely used voluntary reporting scheme that improves situational awareness for naval forces.</div></div>
            <div className="bm-step"><div className="bm-num">3</div><div className="bm-text">Plan the route considering current guidance on preferred transit corridors, timing, and any group transit arrangements available for the region.</div></div>
            <div className="bm-step"><div className="bm-num">4</div><div className="bm-text">Brief the full crew before entering the high-risk area — roles, muster points, and the citadel plan if fitted.</div></div>
            <div className="bm-step"><div className="bm-num">5</div><div className="bm-text">Confirm all ship protection measures are rigged and tested before entering the area, not after a threat is sighted.</div></div>
          </div>
        )}

        {tab === 'measures' && (
          <div className="bm-card">
            <div className="bm-h">Ship Protection Measures</div>
            <p className="bm-p"><b style={{ color: '#eef4fa' }}>Enhanced watchkeeping:</b> Additional lookouts posted, covering all-round visibility, particularly during dawn/dusk when attacks have historically been more common.</p>
            <p className="bm-p"><b style={{ color: '#eef4fa' }}>Physical barriers:</b> Razor wire and physical barriers at vulnerable access points, as fitted per the vessel&apos;s specific protection plan.</p>
            <p className="bm-p"><b style={{ color: '#eef4fa' }}>Maximum safe speed:</b> Maintaining the highest safe speed the vessel can sustain significantly reduces vulnerability, as small skiffs struggle to board faster-moving vessels.</p>
            <p className="bm-p"><b style={{ color: '#eef4fa' }}>Do not stop voluntarily:</b> A vessel underway and maintaining speed is far harder to board than a stopped one — never stop in response to non-official approaches.</p>
            <p className="bm-p"><b style={{ color: '#eef4fa' }}>Citadel:</b> Many vessels transiting high-risk areas designate a citadel — a hardened, secure space with communications equipment where the crew can muster and lock down if boarding cannot be prevented, until military or naval assistance arrives.</p>
          </div>
        )}

        {tab === 'attack' && (
          <div className="bm-critical">
            <div style={{ fontFamily: "'Bricolage Grotesque',system-ui,sans-serif", fontWeight: 800, fontSize: 15, color: '#f87171', marginBottom: 10 }}>🚨 If Approached or Boarded</div>
            <div className="bm-step"><div className="bm-num" style={{ background: 'rgba(248,113,113,.15)', borderColor: 'rgba(248,113,113,.4)', color: '#fca5a5' }}>1</div><div className="bm-text">Sound the emergency alarm and alert the bridge/company immediately when a suspicious approach is identified.</div></div>
            <div className="bm-step"><div className="bm-num" style={{ background: 'rgba(248,113,113,.15)', borderColor: 'rgba(248,113,113,.4)', color: '#fca5a5' }}>2</div><div className="bm-text">Activate the Ship Security Alert System (SSAS) — this silently alerts authorities without alerting the attackers.</div></div>
            <div className="bm-step"><div className="bm-num" style={{ background: 'rgba(248,113,113,.15)', borderColor: 'rgba(248,113,113,.4)', color: '#fca5a5' }}>3</div><div className="bm-text">Report to UKMTO and any relevant naval/military coordination centre for the area with position, course, speed, and description of the threat.</div></div>
            <div className="bm-step"><div className="bm-num" style={{ background: 'rgba(248,113,113,.15)', borderColor: 'rgba(248,113,113,.4)', color: '#fca5a5' }}>4</div><div className="bm-text">If boarding cannot be prevented and the vessel has a citadel plan, muster crew to the citadel per the pre-briefed plan and secure it — do not attempt to fight or negotiate directly.</div></div>
            <div className="bm-step"><div className="bm-num" style={{ background: 'rgba(248,113,113,.15)', borderColor: 'rgba(248,113,113,.4)', color: '#fca5a5' }}>5</div><div className="bm-text">Maintain communication with authorities from the citadel where possible, and await rescue/response — priority is crew safety over the vessel or cargo.</div></div>
          </div>
        )}

        <div style={{ marginTop: 16, background: 'linear-gradient(160deg,rgba(251,191,36,.08),#050716)', border: '1.5px solid rgba(251,191,36,.2)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontFamily: "'Bricolage Grotesque',system-ui,sans-serif", fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Built for verified crew and companies</div>
          <p style={{ fontSize: 12, color: '#a8bdd2', marginBottom: 14 }}>Free tools for everyone — plus a verified profile that gets you found directly.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/signup/crew" style={{ flex: '1 1 140px', textAlign: 'center', padding: '11px 16px', borderRadius: 11, fontWeight: 700, fontSize: 13, textDecoration: 'none', background: 'linear-gradient(135deg,#fbbf24,#e0a010)', color: '#0b0e13' }}>⚓ I&apos;m Crew — Join Free</Link>
            <Link href="/signup/company" style={{ flex: '1 1 140px', textAlign: 'center', padding: '11px 16px', borderRadius: 11, fontWeight: 700, fontSize: 13, textDecoration: 'none', color: '#eef4fa', border: '1px solid rgba(255,255,255,.14)' }}>🏢 Hiring? Find Crew</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
