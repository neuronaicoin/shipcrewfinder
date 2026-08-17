'use client';
import { useState } from 'react';
import Link from 'next/link';

type SectionKey = 'what' | 'standards' | 'docs' | 'practical';

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'what', label: 'What Is the BWM Convention' },
  { key: 'standards', label: 'D-1 vs D-2 Standards' },
  { key: 'docs', label: 'Documentation' },
  { key: 'practical', label: 'Practical Notes' },
];

export default function BwmPage() {
  const [tab, setTab] = useState<SectionKey>('what');

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .bw-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .bw-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .bw-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .bw-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .bw-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .bw-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
        .bw-tab{background:transparent;color:#6b83a0;border:1px solid rgba(255,255,255,.12);padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;border-radius:9px;font-family:inherit}
        .bw-tab.active{background:#fbbf24;color:#0b0e13;border-color:#fbbf24}
        .bw-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:12px}
        .bw-h{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:14px;color:#fbbf24;margin-bottom:8px}
        .bw-p{font-size:12.5px;color:#a8bdd2;line-height:1.7;margin-bottom:8px}
        .bw-compare{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
        .bw-std{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:14px}
        .bw-std-name{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;color:#fbbf24;font-size:14px;margin-bottom:6px}
        @media(max-width:560px){ .bw-compare{grid-template-columns:1fr} }
      `}</style>

      <div className="bw-wrap">
        <Link href="/tools" className="bw-back">← All Tools</Link>
        <div className="bw-title">Ballast Water Management</div>
        <p className="bw-sub">
          The BWM Convention explained — D-1 exchange vs D-2 treatment standards, documentation, and practical notes.
        </p>
        <div className="bw-warn">
          ⚠ <b>General guidance only.</b> Always follow your vessel&apos;s approved Ballast Water Management Plan (BWMP) for the exact procedures that apply to your ship.
        </div>

        <div className="bw-tabs">
          {SECTIONS.map((s) => (
            <button key={s.key} className={`bw-tab ${tab === s.key ? 'active' : ''}`} onClick={() => setTab(s.key)}>{s.label}</button>
          ))}
        </div>

        {tab === 'what' && (
          <div className="bw-card">
            <div className="bw-h">What Is the BWM Convention</div>
            <p className="bw-p">The International Convention for the Control and Management of Ships&apos; Ballast Water and Sediments (BWM Convention) exists to prevent the spread of harmful aquatic organisms and pathogens carried in ballast water from one region to another — a genuine and well-documented ecological problem historically caused by ships taking on ballast in one port and discharging it, along with whatever organisms it contains, in a completely different ecosystem.</p>
            <p className="bw-p">The Convention entered into force in 2017 and now applies broadly across the international merchant fleet, requiring ships to manage their ballast water according to one of two standards, moving over time from an interim exchange-based approach toward mandatory treatment.</p>
          </div>
        )}

        {tab === 'standards' && (
          <>
            <div className="bw-compare">
              <div className="bw-std">
                <div className="bw-std-name">D-1 Standard</div>
                <p className="bw-p" style={{ marginBottom: 0 }}>Ballast Water Exchange Standard — exchange at least 95% of ballast water volume, or use the flow-through method pumping three times the tank volume. Exchange must be conducted at least 200 nautical miles from the nearest land, in water at least 200 metres deep (with a fallback of at least 50nm from land if this isn&apos;t achievable on the voyage).</p>
              </div>
              <div className="bw-std">
                <div className="bw-std-name">D-2 Standard</div>
                <p className="bw-p" style={{ marginBottom: 0 }}>Ballast Water Performance Standard — sets maximum limits on viable organisms permitted in discharged ballast water, including specific limits on indicator microbes. Achieving D-2 requires an approved Ballast Water Treatment System (BWTS) fitted on board.</p>
              </div>
            </div>
            <div className="bw-card">
              <div className="bw-h">The Transition</div>
              <p className="bw-p">D-1 (exchange) served as the interim standard during the Convention&apos;s phase-in period. Ships were required to move to D-2 (treatment) compliance by dates tied to their IOPP Certificate renewal survey schedule — the practical result is that essentially all ships trading internationally today are expected to be D-2 compliant, with a fitted BWTS, rather than relying on exchange alone.</p>
            </div>
          </>
        )}

        {tab === 'docs' && (
          <div className="bw-card">
            <div className="bw-h">Documentation</div>
            <p className="bw-p"><b style={{ color: '#eef4fa' }}>Ballast Water Management Certificate:</b> Required for ships of 400 GT and above engaged in international voyages, confirming the ship complies with the Convention.</p>
            <p className="bw-p"><b style={{ color: '#eef4fa' }}>Ballast Water Management Plan (BWMP):</b> A ship-specific, flag-state-approved plan detailing exactly how ballast operations are to be conducted on that vessel, including the BWTS operating procedures if fitted.</p>
            <p className="bw-p"><b style={{ color: '#eef4fa' }}>Ballast Water Record Book:</b> A log of all ballast water operations — uptake, exchange/treatment, and discharge — including dates, positions, and volumes. This is routinely checked during Port State Control inspections.</p>
          </div>
        )}

        {tab === 'practical' && (
          <div className="bw-card">
            <div className="bw-h">Practical Notes</div>
            <p className="bw-p">Some port states and regions apply additional local ballast water requirements beyond the base Convention — always check for region-specific rules before arrival, particularly for environmentally sensitive areas.</p>
            <p className="bw-p">BWTS malfunctions do happen — most flag states have a process for reporting and managing a "same risk area" or alternative compliance approach if your treatment system fails and exchange isn&apos;t practicable. Report any BWTS issue promptly through your normal SMS non-conformity channel.</p>
            <p className="bw-p">PSC inspectors commonly check the Ballast Water Record Book entries against the actual voyage track and BWTS operating logs — keeping accurate, consistent records genuinely matters at inspection.</p>
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
