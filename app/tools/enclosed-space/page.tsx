'use client';
import { useState } from 'react';
import Link from 'next/link';

type SectionKey = 'what' | 'before' | 'testing' | 'during' | 'rescue';

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'what', label: 'What Counts as Enclosed Space' },
  { key: 'before', label: 'Before Entry' },
  { key: 'testing', label: 'Gas Testing Sequence' },
  { key: 'during', label: 'During Occupation' },
  { key: 'rescue', label: 'If Someone Is Incapacitated' },
];

export default function EnclosedSpacePage() {
  const [tab, setTab] = useState<SectionKey>('what');

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .es-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .es-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .es-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .es-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .es-warn{background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.35);border-radius:10px;padding:14px;font-size:12.5px;color:#fca5a5;line-height:1.6;margin-bottom:16px;font-weight:600}
        .es-tabs{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
        .es-tab{background:linear-gradient(165deg,#141845,#050716);color:#a8bdd2;border:1px solid rgba(255,255,255,.08);padding:12px 14px;font-size:12.5px;font-weight:700;cursor:pointer;border-radius:11px;text-align:left;font-family:inherit}
        .es-tab.active{border-color:#fbbf24;color:#fbbf24;background:rgba(251,191,36,.06)}
        .es-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:12px}
        .es-h{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:14px;color:#fbbf24;margin-bottom:8px}
        .es-p{font-size:12.5px;color:#a8bdd2;line-height:1.7;margin-bottom:8px}
        .es-step{display:flex;gap:12px;margin-bottom:10px;align-items:flex-start}
        .es-num{width:24px;height:24px;border-radius:50%;background:rgba(251,191,36,.15);border:1px solid rgba(251,191,36,.4);color:#fbbf24;font-weight:800;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .es-text{font-size:12.5px;color:#eef4fa;line-height:1.6;padding-top:2px}
        .es-critical{background:rgba(248,113,113,.12);border:2px solid rgba(248,113,113,.5);border-radius:14px;padding:18px;margin-bottom:12px}
      `}</style>

      <div className="es-wrap">
        <Link href="/tools" className="es-back">← All Tools</Link>
        <div className="es-title">Enclosed Space Entry</div>
        <p className="es-sub">
          Gas testing sequence, permit requirements, and the single most important rule if someone is found incapacitated inside.
        </p>
        <div className="es-warn">
          ⚠ Enclosed space entry remains one of the leading causes of multiple-fatality incidents at sea — often because a would-be rescuer enters without protection to help a colleague who has collapsed. Follow this procedure every time, without exception.
        </div>

        <div className="es-tabs">
          {SECTIONS.map((s) => (
            <button key={s.key} className={`es-tab ${tab === s.key ? 'active' : ''}`} onClick={() => setTab(s.key)}>{s.label}</button>
          ))}
        </div>

        {tab === 'what' && (
          <div className="es-card">
            <div className="es-h">What Counts as an Enclosed Space</div>
            <p className="es-p">An enclosed space has limited openings for entry and exit, unfavourable natural ventilation, and is not designed for continuous worker occupancy.</p>
            <p className="es-p">Common examples on board include: cargo holds, ballast tanks, fuel tanks, cofferdams, duct keels, pump rooms, chain lockers, void spaces, and inerted spaces on tankers.</p>
            <p className="es-p">Some spaces are less obviously "enclosed" but still qualify — always check your vessel&apos;s specific list rather than assuming based on appearance alone.</p>
          </div>
        )}

        {tab === 'before' && (
          <div className="es-card">
            <div className="es-h">Before Entry</div>
            <div className="es-step"><div className="es-num">1</div><div className="es-text">A risk assessment must be carried out and a permit to work issued by the responsible officer before any entry.</div></div>
            <div className="es-step"><div className="es-num">2</div><div className="es-text">Ventilate the space mechanically for a sufficient period before testing and entry — natural ventilation alone is not sufficient.</div></div>
            <div className="es-step"><div className="es-num">3</div><div className="es-text">A designated standby person must be posted at the entrance at all times, with a reliable means of communication with those inside.</div></div>
            <div className="es-step"><div className="es-num">4</div><div className="es-text">Rescue equipment — harness, lifeline, and where required additional breathing apparatus — must be ready at the entrance before anyone goes in.</div></div>
            <div className="es-step"><div className="es-num">5</div><div className="es-text">The permit specifies the conditions and time limit for entry — it is not a one-time formality, and entry should stop if conditions change.</div></div>
          </div>
        )}

        {tab === 'testing' && (
          <div className="es-card">
            <div className="es-h">Gas Testing Sequence</div>
            <div className="es-step"><div className="es-num">1</div><div className="es-text">Test the atmosphere from outside the space first, where possible, using a calibrated multi-gas detector.</div></div>
            <div className="es-step"><div className="es-num">2</div><div className="es-text">Check oxygen level first — normal atmospheric oxygen is approximately 20.9%. Both oxygen deficiency and oxygen enrichment are dangerous.</div></div>
            <div className="es-step"><div className="es-num">3</div><div className="es-text">Check for flammable gases (% LEL — Lower Explosive Limit) — this must read zero or within your vessel&apos;s permitted safe threshold.</div></div>
            <div className="es-step"><div className="es-num">4</div><div className="es-text">Check for toxic gases relevant to the space and its cargo history — commonly H₂S and CO, plus any cargo-specific gases documented in the cargo declaration.</div></div>
            <div className="es-step"><div className="es-num">5</div><div className="es-text">Test at multiple levels within the space (top, middle, bottom) where practicable — gas concentrations can vary significantly by depth.</div></div>
            <div className="es-step"><div className="es-num">6</div><div className="es-text">Only proceed with entry if all readings are within safe limits per your vessel&apos;s procedure — if in doubt, do not enter.</div></div>
          </div>
        )}

        {tab === 'during' && (
          <div className="es-card">
            <div className="es-h">During Occupation</div>
            <p className="es-p">Continuous or frequent re-testing of the atmosphere is required throughout occupation — conditions inside an enclosed space can change even after an initially safe reading.</p>
            <p className="es-p">Maintain continuous mechanical ventilation for the duration of the work.</p>
            <p className="es-p">Maintain regular, positive communication between those inside and the standby person — a missed check-in is a signal to investigate immediately, not to wait.</p>
            <p className="es-p">Anyone inside must exit immediately if gas readings change, ventilation fails, or communication with the standby person is lost.</p>
          </div>
        )}

        {tab === 'rescue' && (
          <div className="es-critical">
            <div style={{ fontFamily: "'Bricolage Grotesque',system-ui,sans-serif", fontWeight: 800, fontSize: 15, color: '#f87171', marginBottom: 10 }}>🚨 The Single Most Important Rule</div>
            <p className="es-p" style={{ color: '#fca5a5', fontWeight: 600 }}>NEVER enter an enclosed space to rescue someone without proper breathing apparatus and rescue equipment — even if they are a close colleague and even if seconds feel critical.</p>
            <p className="es-p">A large share of enclosed space fatalities are rescuers who entered without protection, believing the space was safe because their colleague had just been in it — and were overcome by the same atmosphere.</p>
            <p className="es-p"><b style={{ color: '#eef4fa' }}>What to actually do:</b> raise the alarm immediately, do not enter, don appropriate self-contained breathing apparatus if trained and equipped to do so, and follow your vessel&apos;s emergency response team procedure for enclosed space rescue.</p>
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
