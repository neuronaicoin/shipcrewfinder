'use client';
import { useState } from 'react';
import Link from 'next/link';

type ScenKey = 'fire' | 'flooding' | 'mob' | 'abandon';

interface Step { n: number; text: string; }
interface Scenario { key: ScenKey; name: string; icon: string; steps: Step[]; }

const SCENARIOS: Scenario[] = [
  {
    key: 'fire', name: 'Fire', icon: '🔥',
    steps: [
      { n: 1, text: 'Raise the alarm immediately — general alarm, inform the bridge, state location and nature of fire.' },
      { n: 2, text: 'Proceed to muster station; fire party dons appropriate PPE and BA sets as required.' },
      { n: 3, text: 'Locate and confirm the fire. Close boundaries — doors, ventilation, fuel supply to the affected space where safe to do so.' },
      { n: 4, text: 'Match the extinguishing method to the fire class — never use water on an electrical or oil fire.' },
      { n: 5, text: 'Never fight a fire alone — always work in a buddy system with a clear line of retreat.' },
      { n: 6, text: 'Apply boundary cooling to adjacent structure if the fire is significant, to prevent spread.' },
      { n: 7, text: 'Continuously reassess — if the fire is not controlled, prepare for evacuation of the space and, if necessary, escalate toward abandon ship readiness.' },
    ],
  },
  {
    key: 'flooding', name: 'Flooding', icon: '🌊',
    steps: [
      { n: 1, text: 'Sound the alarm and inform the bridge immediately — location and apparent severity.' },
      { n: 2, text: 'Locate the source of flooding as quickly as possible.' },
      { n: 3, text: 'Close all relevant watertight doors, valves and openings to contain the flooding to the smallest possible space.' },
      { n: 4, text: 'If safe to do so, attempt to stop or slow the ingress at source — shoring, plugging, or patching.' },
      { n: 5, text: 'Activate bilge/ballast pumps to the affected space.' },
      { n: 6, text: 'The bridge team assesses the impact on stability and trim continuously — this may require immediate consultation of the stability book or loading computer.' },
      { n: 7, text: 'If flooding cannot be controlled and stability is threatened, prepare for possible abandon ship.' },
    ],
  },
  {
    key: 'mob', name: 'Man Overboard', icon: '🆘',
    steps: [
      { n: 1, text: 'Shout "Man Overboard" and immediately throw the nearest lifebuoy (with self-igniting light/smoke signal) toward the person.' },
      { n: 2, text: 'Post a dedicated lookout to maintain continuous visual contact with the person in the water — this is their only job until relieved.' },
      { n: 3, text: 'Sound the alarm and alert the bridge with position if known.' },
      { n: 4, text: 'The bridge executes a recovery manoeuvre — commonly the Williamson Turn (returns the vessel down its own track) or Anderson Turn (faster, single-turn recovery), depending on vessel type and situation.' },
      { n: 5, text: 'Launch the rescue boat if conditions and time allow, or manoeuvre the vessel itself alongside the person.' },
      { n: 6, text: 'On recovery, provide immediate first aid — treat for possible hypothermia and near-drowning/secondary drowning even if the person appears initially well.' },
      { n: 7, text: 'Log the time, position and circumstances accurately for the incident report.' },
    ],
  },
  {
    key: 'abandon', name: 'Abandon Ship', icon: '🛟',
    steps: [
      { n: 1, text: 'The abandon ship signal is more than 6 short blasts followed by 1 long blast on the whistle/siren, repeated, plus the general alarm — this is only sounded on the Master\'s order.' },
      { n: 2, text: 'Muster at your assigned station per the muster list, wearing lifejackets and immersion suits if provided and time allows.' },
      { n: 3, text: 'The radio officer/bridge team sends a distress signal and ensures the vessel\'s position is broadcast before communications are lost.' },
      { n: 4, text: 'Launch survival craft per your specific muster list assignment — do not deviate from your assigned station and role.' },
      { n: 5, text: 'Take the satellite EPIRB (if not already float-free activated) and SART if safely accessible.' },
      { n: 6, text: 'A headcount is taken and confirmed at each survival craft, and reported to the person in charge as soon as possible.' },
      { n: 7, text: 'Once in survival craft, move clear of the vessel, stream a sea anchor if applicable, and prepare for a potentially extended wait for rescue.' },
    ],
  },
];

export default function EmergencyPage() {
  const [tab, setTab] = useState<ScenKey>('fire');
  const active = SCENARIOS.find((s) => s.key === tab)!;

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .em-wrap{max-width:680px;margin:0 auto;padding:28px 18px 60px}
        .em-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .em-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .em-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .em-warn{background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#fca5a5;line-height:1.5;margin-bottom:16px}
        .em-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}
        .em-tab{background:linear-gradient(165deg,#141845,#050716);color:#a8bdd2;border:1px solid rgba(255,255,255,.1);padding:12px 16px;font-size:13px;font-weight:700;cursor:pointer;border-radius:12px;font-family:inherit;display:flex;align-items:center;gap:6px}
        .em-tab.active{border-color:#f87171;color:#f87171;background:rgba(248,113,113,.08)}
        .em-step{display:flex;gap:12px;margin-bottom:12px;align-items:flex-start}
        .em-num{width:26px;height:26px;border-radius:50%;background:rgba(248,113,113,.15);border:1px solid rgba(248,113,113,.4);color:#fca5a5;font-weight:800;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .em-text{font-size:13px;color:#eef4fa;line-height:1.6;padding-top:2px}
      `}</style>

      <div className="em-wrap">
        <Link href="/tools" className="em-back">← All Tools</Link>
        <div className="em-title">Emergency Procedures</div>
        <p className="em-sub">
          Quick-reference response steps for the four most critical shipboard emergencies.
        </p>
        <div className="em-warn">
          ⚠ <b>Quick reference only.</b> Always follow your vessel&apos;s specific emergency procedures, muster list and SMS — this is a general reminder, not a replacement for drills and vessel-specific training.
        </div>

        <div className="em-tabs">
          {SCENARIOS.map((s) => (
            <button key={s.key} className={`em-tab ${tab === s.key ? 'active' : ''}`} onClick={() => setTab(s.key)}>{s.icon} {s.name}</button>
          ))}
        </div>

        {active.steps.map((step) => (
          <div className="em-step" key={step.n}>
            <div className="em-num">{step.n}</div>
            <div className="em-text">{step.text}</div>
          </div>
        ))}

        <div style={{ marginTop: 20, background: 'linear-gradient(160deg,rgba(251,191,36,.08),#050716)', border: '1.5px solid rgba(251,191,36,.2)', borderRadius: 16, padding: 20 }}>
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
