'use client';
import { useState } from 'react';
import Link from 'next/link';

type SectionKey = 'prep' | 'routing' | 'during' | 'risks';

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'prep', label: 'Preparation' },
  { key: 'routing', label: 'Route & Weather Routing' },
  { key: 'during', label: 'During Heavy Weather' },
  { key: 'risks', label: 'Key Risks to Understand' },
];

export default function HeavyWeatherPage() {
  const [tab, setTab] = useState<SectionKey>('prep');

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .hw-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .hw-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .hw-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .hw-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .hw-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .hw-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
        .hw-tab{background:transparent;color:#6b83a0;border:1px solid rgba(255,255,255,.12);padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;border-radius:9px;font-family:inherit}
        .hw-tab.active{background:#fbbf24;color:#0b0e13;border-color:#fbbf24}
        .hw-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:12px}
        .hw-h{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:14px;color:#fbbf24;margin-bottom:8px}
        .hw-p{font-size:12.5px;color:#a8bdd2;line-height:1.7;margin-bottom:8px}
        .hw-step{display:flex;gap:12px;margin-bottom:10px;align-items:flex-start}
        .hw-num{width:24px;height:24px;border-radius:50%;background:rgba(251,191,36,.15);border:1px solid rgba(251,191,36,.4);color:#fbbf24;font-weight:800;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .hw-text{font-size:12.5px;color:#eef4fa;line-height:1.6;padding-top:2px}
      `}</style>

      <div className="hw-wrap">
        <Link href="/tools" className="hw-back">← All Tools</Link>
        <div className="hw-title">Heavy Weather Guide</div>
        <p className="hw-sub">
          Preparation, routing considerations, and the specific risks — parametric rolling, synchronous rolling, pooping — every watchkeeper should understand.
        </p>
        <div className="hw-warn">
          ⚠ <b>General guidance only.</b> Always follow your master's judgement, company weather routing advice, and your vessel's specific stability and heavy weather procedures.
        </div>

        <div className="hw-tabs">
          {SECTIONS.map((s) => (
            <button key={s.key} className={`hw-tab ${tab === s.key ? 'active' : ''}`} onClick={() => setTab(s.key)}>{s.label}</button>
          ))}
        </div>

        {tab === 'prep' && (
          <div className="hw-card">
            <div className="hw-h">Preparation</div>
            <div className="hw-step"><div className="hw-num">1</div><div className="hw-text">Monitor weather forecasts continuously — NAVTEX, weather fax, and satellite weather services — well before the system is expected to arrive.</div></div>
            <div className="hw-step"><div className="hw-num">2</div><div className="hw-text">Secure all loose equipment on deck and in accommodation spaces — anything that can move will move.</div></div>
            <div className="hw-step"><div className="hw-num">3</div><div className="hw-text">Double-check cargo securing and lashings, particularly for deck cargo and containers.</div></div>
            <div className="hw-step"><div className="hw-num">4</div><div className="hw-text">Close all watertight doors, portholes, and deck openings that aren&apos;t required for immediate access.</div></div>
            <div className="hw-step"><div className="hw-num">5</div><div className="hw-text">Review stability — avoid slack tanks where possible, since free surface effect reduces GM exactly when you need stability most.</div></div>
            <div className="hw-step"><div className="hw-num">6</div><div className="hw-text">Brief the crew, restrict unnecessary deck work, and confirm muster/emergency procedures are fresh in everyone's mind.</div></div>
          </div>
        )}

        {tab === 'routing' && (
          <div className="hw-card">
            <div className="hw-h">Route & Weather Routing</div>
            <p className="hw-p">Where a commercial weather routing service is available, their advice on avoiding the worst of a system — rather than simply pushing through it — is usually worth following closely, balancing safety against schedule pressure.</p>
            <p className="hw-p">Where possible, plan to route around the most intense part of a system rather than through it — even a modest course adjustment early can mean a significantly better weather encounter later.</p>
            <p className="hw-p">Factor in the vessel's specific characteristics — a smaller or lighter vessel, or one with known rolling tendencies, may need a wider safety margin than routing advice generically suggests.</p>
          </div>
        )}

        {tab === 'during' && (
          <div className="hw-card">
            <div className="hw-h">During Heavy Weather</div>
            <p className="hw-p"><b style={{ color: '#eef4fa' }}>Reduce speed:</b> Slamming and pounding stress on the hull increases sharply with speed in heavy seas — reducing speed is often the single most effective way to reduce structural risk and crew injury risk.</p>
            <p className="hw-p"><b style={{ color: '#eef4fa' }}>Adjust heading:</b> The angle between the vessel's heading and the wave direction significantly affects motion — beam seas often produce the worst rolling, while head or following seas change the character of motion differently depending on wave period relative to the ship.</p>
            <p className="hw-p"><b style={{ color: '#eef4fa' }}>Restrict deck access:</b> Crew movement on deck should be minimized and, where necessary, only with appropriate safety lines and PPE.</p>
            <p className="hw-p"><b style={{ color: '#eef4fa' }}>Increase monitoring:</b> More frequent checks for cargo shift, water ingress, and lashing integrity throughout the heavy weather period.</p>
          </div>
        )}

        {tab === 'risks' && (
          <div className="hw-card">
            <div className="hw-h">Key Risks to Understand</div>
            <p className="hw-p"><b style={{ color: '#eef4fa' }}>Synchronous Rolling:</b> Occurs when the wave encounter period matches the vessel's natural roll period, causing rolling amplitude to build dangerously — changing course or speed to break this synchronization is the standard response.</p>
            <p className="hw-p"><b style={{ color: '#eef4fa' }}>Parametric Rolling:</b> A more complex phenomenon, particularly relevant to certain hull forms (notably some container ships), where rolling can build rapidly in head or near-head seas due to periodic changes in stability as the hull moves through wave crests and troughs — can develop faster and more severely than synchronous rolling.</p>
            <p className="hw-p"><b style={{ color: '#eef4fa' }}>Pooping:</b> A dangerous following-sea condition where a wave breaks over the stern — a particular risk for vessels with low freeboard aft, running with the sea in following or quartering conditions.</p>
            <p className="hw-p"><b style={{ color: '#eef4fa' }}>Broaching:</b> Loss of directional control in following/quartering seas, where the vessel is turned broadside to the waves against the helm — a serious stability risk, particularly for smaller vessels.</p>
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
