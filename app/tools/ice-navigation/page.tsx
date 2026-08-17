'use client';
import { useState } from 'react';
import Link from 'next/link';

type SectionKey = 'polar' | 'classes' | 'practical' | 'training';

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'polar', label: 'The Polar Code' },
  { key: 'classes', label: 'Ice Classes' },
  { key: 'practical', label: 'Practical Navigation' },
  { key: 'training', label: 'Crew Training' },
];

export default function IcePage() {
  const [tab, setTab] = useState<SectionKey>('polar');

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .ic-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .ic-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .ic-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .ic-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .ic-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .ic-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
        .ic-tab{background:transparent;color:#6b83a0;border:1px solid rgba(255,255,255,.12);padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;border-radius:9px;font-family:inherit}
        .ic-tab.active{background:#fbbf24;color:#0b0e13;border-color:#fbbf24}
        .ic-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:12px}
        .ic-h{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:14px;color:#fbbf24;margin-bottom:8px}
        .ic-p{font-size:12.5px;color:#a8bdd2;line-height:1.7;margin-bottom:8px}
        .ic-class-row{display:flex;justify-content:space-between;align-items:center;padding:9px 12px;background:rgba(255,255,255,.03);border-radius:8px;margin-bottom:6px;font-size:12px}
        .ic-class-code{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;color:#fbbf24;min-width:60px}
      `}</style>

      <div className="ic-wrap">
        <Link href="/tools" className="ic-back">← All Tools</Link>
        <div className="ic-title">Ice Navigation Guide</div>
        <p className="ic-sub">
          The Polar Code, ice classification systems, and practical navigation considerations for ice-affected waters.
        </p>
        <div className="ic-warn">
          ⚠ <b>General guidance only.</b> Ice navigation requires specific training and your vessel's Polar Water Operational Manual (PWOM) — this is background reference, not operational guidance.
        </div>

        <div className="ic-tabs">
          {SECTIONS.map((s) => (
            <button key={s.key} className={`ic-tab ${tab === s.key ? 'active' : ''}`} onClick={() => setTab(s.key)}>{s.label}</button>
          ))}
        </div>

        {tab === 'polar' && (
          <div className="ic-card">
            <div className="ic-h">The Polar Code</div>
            <p className="ic-p">The International Code for Ships Operating in Polar Waters (Polar Code) is mandatory under both SOLAS and MARPOL for vessels operating in defined Arctic and Antarctic waters, covering safety and environmental protection requirements specific to polar operations.</p>
            <p className="ic-p"><b style={{ color: '#eef4fa' }}>Polar Ship Certificate:</b> Required for applicable vessels, classifying the ship into Category A, B, or C based on the ice conditions it's designed to operate in.</p>
            <p className="ic-p"><b style={{ color: '#eef4fa' }}>Polar Water Operational Manual (PWOM):</b> A ship-specific document detailing the vessel's operational capabilities and limitations in polar conditions, and the specific procedures to follow — this is the actual operational reference, not this general guide.</p>
          </div>
        )}

        {tab === 'classes' && (
          <>
            <div className="ic-card">
              <div className="ic-h">Polar Ship Categories (Polar Code)</div>
              <div className="ic-class-row"><span className="ic-class-code">Category A</span><span style={{ color: '#a8bdd2' }}>Ships designed for operation in at least medium first-year ice, potentially including old ice inclusions.</span></div>
              <div className="ic-class-row"><span className="ic-class-code">Category B</span><span style={{ color: '#a8bdd2' }}>Ships designed for at least thin first-year ice, potentially including old ice inclusions.</span></div>
              <div className="ic-class-row"><span className="ic-class-code">Category C</span><span style={{ color: '#a8bdd2' }}>Ships designed for open water or less severe ice conditions than Categories A/B.</span></div>
            </div>
            <div className="ic-card">
              <div className="ic-h">IACS Polar Classes (PC1–PC7)</div>
              <p className="ic-p">A separate classification society system, running from PC1 (year-round operation in all polar waters, the most capable) through PC7 (summer/autumn operation in thin first-year ice, the least demanding) — used by class societies to specify structural and machinery requirements.</p>
            </div>
          </>
        )}

        {tab === 'practical' && (
          <div className="ic-card">
            <div className="ic-h">Practical Navigation</div>
            <p className="ic-p">Reduce speed in ice-affected waters — appropriate speed depends heavily on ice concentration, type, and your vessel's specific ice class capability.</p>
            <p className="ic-p">Use available ice information services — many regions have dedicated ice charting services (satellite-derived ice concentration and type charts) that should inform routing decisions well before entering ice-affected areas.</p>
            <p className="ic-p">Multi-year ice and pressure ridges present significantly greater risk than first-year ice — avoid these unless your vessel's ice class specifically supports it.</p>
            <p className="ic-p">In some regions, icebreaker escort is available or required for certain ice conditions — confirm current requirements for your specific route and season.</p>
            <p className="ic-p">Cold weather affects equipment and crew — anticipate reduced equipment reliability, increased fatigue from cold-weather operations, and the need for appropriate cold-weather PPE.</p>
          </div>
        )}

        {tab === 'training' && (
          <div className="ic-card">
            <div className="ic-h">Crew Training Requirements</div>
            <p className="ic-p">STCW requires Basic Training for Ships Operating in Polar Waters for masters, chief mates, and officers in charge of a navigational watch on Polar Code ships operating in polar waters.</p>
            <p className="ic-p">Advanced Training for Ships Operating in Polar Waters is additionally required for masters and chief mates on ships operating in conditions beyond open water.</p>
            <p className="ic-p">These are genuine, specific qualifications — do not assume general STCW watchkeeping certification is sufficient for polar operations.</p>
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
