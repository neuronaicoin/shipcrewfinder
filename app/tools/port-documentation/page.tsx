'use client';
import { useState } from 'react';
import Link from 'next/link';

type SectionKey = 'fal' | 'us' | 'eu' | 'other';

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'fal', label: 'IMO FAL Documents (Universal)' },
  { key: 'us', label: 'United States' },
  { key: 'eu', label: 'European Union' },
  { key: 'other', label: 'General Tips' },
];

const FAL_FORMS = [
  { n: '1', name: 'General Declaration', desc: 'Basic ship, voyage and crew/passenger summary information for the port call.' },
  { n: '2', name: 'Cargo Declaration', desc: 'Details of cargo carried on board.' },
  { n: '3', name: "Ship's Stores Declaration", desc: 'Declaration of stores carried on board — provisions, bonded stores, etc.' },
  { n: '4', name: "Crew's Effects Declaration", desc: 'Declaration of crew members\' personal effects, primarily for customs purposes.' },
  { n: '5', name: 'Crew List', desc: 'Full list of all crew on board with relevant personal and document details.' },
  { n: '6', name: 'Passenger List', desc: 'Full list of passengers on board, where applicable.' },
  { n: '7', name: 'Dangerous Goods Manifest', desc: 'Details of any dangerous goods carried, per the IMDG Code.' },
];

export default function PortDocsPage() {
  const [tab, setTab] = useState<SectionKey>('fal');

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .pd-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .pd-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .pd-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .pd-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .pd-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .pd-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
        .pd-tab{background:transparent;color:#6b83a0;border:1px solid rgba(255,255,255,.12);padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;border-radius:9px;font-family:inherit}
        .pd-tab.active{background:#fbbf24;color:#0b0e13;border-color:#fbbf24}
        .pd-form{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px 14px;margin-bottom:8px;display:flex;gap:12px;align-items:flex-start}
        .pd-form-num{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;color:#fbbf24;font-size:14px;min-width:24px}
        .pd-form-name{font-weight:700;font-size:13px;margin-bottom:2px}
        .pd-form-desc{font-size:12px;color:#a8bdd2;line-height:1.5}
        .pd-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:12px}
        .pd-h{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:14px;color:#fbbf24;margin-bottom:8px}
        .pd-p{font-size:12.5px;color:#a8bdd2;line-height:1.7;margin-bottom:8px}
      `}</style>

      <div className="pd-wrap">
        <Link href="/tools" className="pd-back">← All Tools</Link>
        <div className="pd-title">Port Entry Documentation</div>
        <p className="pd-sub">
          The universal IMO FAL documents every port call needs, plus region-specific requirements for the US and EU.
        </p>
        <div className="pd-warn">
          ⚠ <b>General guidance only.</b> Specific port and terminal requirements change — always confirm current requirements with your agent well before arrival.
        </div>

        <div className="pd-tabs">
          {SECTIONS.map((s) => (
            <button key={s.key} className={`pd-tab ${tab === s.key ? 'active' : ''}`} onClick={() => setTab(s.key)}>{s.label}</button>
          ))}
        </div>

        {tab === 'fal' && (
          <>
            <p className="pd-p" style={{ marginBottom: 12 }}>The IMO Facilitation (FAL) Convention standardizes the core documents required for a port call, used as the baseline framework in most countries worldwide.</p>
            {FAL_FORMS.map((f) => (
              <div className="pd-form" key={f.n}>
                <span className="pd-form-num">{f.n}</span>
                <div>
                  <div className="pd-form-name">{f.name}</div>
                  <div className="pd-form-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'us' && (
          <div className="pd-card">
            <div className="pd-h">United States</div>
            <p className="pd-p"><b style={{ color: '#eef4fa' }}>Advance Notice of Arrival (ANOA):</b> Vessels must submit an Advance Notice of Arrival to the National Vessel Movement Center (NVMC), typically 96 hours before arrival — this includes vessel, voyage, cargo and crew information.</p>
            <p className="pd-p"><b style={{ color: '#eef4fa' }}>Automated Manifest System (AMS):</b> Cargo manifest information must be filed with US Customs and Border Protection (CBP), generally in advance of arrival.</p>
            <p className="pd-p"><b style={{ color: '#eef4fa' }}>Crew Visas:</b> Foreign crew typically require a C1/D visa for US port calls involving shore leave or crew change — apply well in advance, as processing can take significant time.</p>
            <p className="pd-p"><b style={{ color: '#eef4fa' }}>Ballast Water Reporting:</b> Specific ballast water reporting requirements apply to the US Coast Guard, in addition to the general BWM Convention requirements.</p>
          </div>
        )}

        {tab === 'eu' && (
          <div className="pd-card">
            <div className="pd-h">European Union</div>
            <p className="pd-p"><b style={{ color: '#eef4fa' }}>SafeSeaNet Reporting:</b> The EU's Reporting Formalities Directive requires pre-arrival information to be submitted electronically, typically via national single-window systems connected to SafeSeaNet.</p>
            <p className="pd-p"><b style={{ color: '#eef4fa' }}>FAL Forms via Single Window:</b> EU ports generally implement the IMO FAL documents through a national electronic single-window system rather than paper forms.</p>
            <p className="pd-p"><b style={{ color: '#eef4fa' }}>Schengen Considerations:</b> Crew movements involving Schengen area ports have specific immigration considerations for shore leave and crew change — your agent should confirm current requirements for the specific port.</p>
          </div>
        )}

        {tab === 'other' && (
          <div className="pd-card">
            <div className="pd-h">General Tips</div>
            <p className="pd-p">Always confirm the exact timeline for pre-arrival documentation with your agent well before the deadline — many requirements (like the US 96-hour ANOA) are strict, and late submission can cause real delays.</p>
            <p className="pd-p">Keep a consistent, accurate crew list maintained throughout the voyage — discrepancies between your crew list and actual crew on board are a common, avoidable source of delay and scrutiny.</p>
            <p className="pd-p">Dangerous goods documentation (FAL 7 / IMDG manifest) is one of the most closely checked documents at many ports — ensure it's complete and accurate well before arrival, not compiled at the last minute.</p>
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
