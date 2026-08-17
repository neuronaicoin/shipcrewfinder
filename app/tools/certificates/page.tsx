'use client';
import { useState } from 'react';
import Link from 'next/link';

type RankKey = 'common' | 'deck_officer' | 'engine_officer' | 'deck_rating' | 'engine_rating' | 'eto';

interface CertGroup { rank: string; stcwRef: string; certs: string[]; }
interface RankTab { key: RankKey; name: string; groups: CertGroup[]; }

const TABS: RankTab[] = [
  {
    key: 'common', name: 'Common to All Ranks',
    groups: [
      { rank: 'Basic Safety Training (STCW A-VI/1)', stcwRef: 'A-VI/1', certs: ['Personal Survival Techniques', 'Fire Prevention and Fire Fighting', 'Elementary First Aid', 'Personal Safety and Social Responsibilities'] },
      { rank: 'Security', stcwRef: 'A-VI/6', certs: ['Security Awareness Training', 'Seafarer with Designated Security Duties (if applicable)'] },
      { rank: 'Medical & Identity', stcwRef: '—', certs: ['Valid Medical Fitness Certificate (e.g. ENG1 or flag state equivalent)', 'Seafarer\'s Identity Document / Discharge Book', 'Valid passport'] },
    ],
  },
  {
    key: 'deck_officer', name: 'Deck Officers',
    groups: [
      { rank: 'Master (Unlimited)', stcwRef: 'STCW II/2', certs: ['Certificate of Competency — Master Mariner (unlimited)', 'GMDSS General Operator\'s Certificate (GOC)', 'ARPA (Automatic Radar Plotting Aids)', 'ECDIS (Electronic Chart Display and Information System)', 'Advanced Fire Fighting', 'Medical Care on Board Ship', 'Ship Security Officer (SSO), typically required'] },
      { rank: 'Chief Officer', stcwRef: 'STCW II/2', certs: ['Certificate of Competency — Chief Mate (unlimited)', 'Same core package as Master: GMDSS GOC, ARPA, ECDIS, Advanced Fire Fighting, Medical Care'] },
      { rank: '2nd / 3rd Officer (OOW)', stcwRef: 'STCW II/1', certs: ['Certificate of Competency — Officer in Charge of a Navigational Watch', 'GMDSS GOC', 'ARPA', 'ECDIS', 'Proficiency in Survival Craft and Rescue Boats'] },
    ],
  },
  {
    key: 'engine_officer', name: 'Engine Officers',
    groups: [
      { rank: 'Chief Engineer', stcwRef: 'STCW III/2', certs: ['Certificate of Competency — Chief Engineer Officer', 'Advanced Fire Fighting', 'Medical Care on Board Ship', 'High Voltage training (if applicable to the vessel\'s systems)'] },
      { rank: '2nd Engineer', stcwRef: 'STCW III/2', certs: ['Certificate of Competency — Second Engineer Officer', 'Same core package as Chief Engineer'] },
      { rank: '3rd / 4th Engineer (OOW)', stcwRef: 'STCW III/1', certs: ['Certificate of Competency — Officer in Charge of an Engineering Watch', 'Advanced Fire Fighting (commonly required)'] },
    ],
  },
  {
    key: 'eto', name: 'ETO',
    groups: [
      { rank: 'Electro-Technical Officer', stcwRef: 'STCW III/6', certs: ['Certificate of Competency — Electro-Technical Officer', 'High Voltage training (commonly required, given modern shipboard electrical systems)', 'Advanced Fire Fighting (commonly required)'] },
    ],
  },
  {
    key: 'deck_rating', name: 'Deck Ratings',
    groups: [
      { rank: 'Bosun / AB (Deck)', stcwRef: 'STCW II/5', certs: ['Certificate — Able Seafarer Deck', 'Proficiency in Survival Craft and Rescue Boats (commonly required)'] },
      { rank: 'Ordinary Seaman (OS)', stcwRef: 'STCW II/4', certs: ['Certificate — Rating Forming Part of a Navigational Watch (or basic training only, depending on role and flag state)'] },
    ],
  },
  {
    key: 'engine_rating', name: 'Engine Ratings',
    groups: [
      { rank: 'Oiler / AB (Engine)', stcwRef: 'STCW III/5', certs: ['Certificate — Able Seafarer Engine'] },
      { rank: 'Fitter', stcwRef: 'STCW III/4 or III/5', certs: ['Certificate — Rating Forming Part of an Engineering Watch, or Able Seafarer Engine, depending on the specific role'] },
    ],
  },
];

const VESSEL_ADD: { type: string; note: string }[] = [
  { type: 'Oil Tankers', note: 'Basic Training for Oil and Chemical Tanker Cargo Operations, plus Advanced Training for officers with cargo responsibility.' },
  { type: 'Chemical Tankers', note: 'Basic and Advanced Chemical Tanker training, specific to the vessel\'s cargo types.' },
  { type: 'Gas Carriers (LNG/LPG)', note: 'Basic and Advanced Liquefied Gas Tanker training — a genuinely specialist qualification.' },
  { type: 'Passenger Ships', note: 'Crowd Management, Crisis Management and Human Behaviour training, plus Passenger Ship Safety Training.' },
  { type: 'Ships in Polar Waters', note: 'Basic and/or Advanced Polar Code training, depending on role and ice conditions.' },
];

export default function CertsPage() {
  const [tab, setTab] = useState<RankKey>('common');
  const active = TABS.find((t) => t.key === tab)!;

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .ct-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .ct-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .ct-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .ct-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .ct-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .ct-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
        .ct-tab{background:transparent;color:#6b83a0;border:1px solid rgba(255,255,255,.12);padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;border-radius:9px;font-family:inherit}
        .ct-tab.active{background:#fbbf24;color:#0b0e13;border-color:#fbbf24}
        .ct-group{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px;margin-bottom:10px}
        .ct-group-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px}
        .ct-rank{font-weight:700;font-size:13.5px}
        .ct-ref{font-size:10.5px;color:#fbbf24;font-weight:700;background:rgba(251,191,36,.1);padding:2px 8px;border-radius:6px}
        .ct-cert{font-size:12.5px;color:#a8bdd2;line-height:1.7;padding-left:16px;position:relative}
        .ct-cert:before{content:'✓';position:absolute;left:0;color:#34d399;font-weight:700}
        .ct-vessel-card{background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.25);border-radius:12px;padding:12px 14px;margin-bottom:8px}
        .ct-vessel-type{font-weight:700;font-size:12.5px;color:#fbbf24;margin-bottom:4px}
        .ct-vessel-note{font-size:12px;color:#a8bdd2;line-height:1.5}
      `}</style>

      <div className="ct-wrap">
        <Link href="/tools" className="ct-back">← All Tools</Link>
        <div className="ct-title">Certificate Requirements by Rank</div>
        <p className="ct-sub">
          The STCW certificates typically required for each rank, plus vessel-specific additions (tankers, gas carriers, passenger ships).
        </p>
        <div className="ct-warn">
          ⚠ <b>General guidance only.</b> Exact requirements vary by flag state and specific vessel — always confirm against your flag administration&apos;s requirements and your vessel&apos;s Safe Manning Document.
        </div>

        <div className="ct-tabs">
          {TABS.map((t) => (
            <button key={t.key} className={`ct-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.name}</button>
          ))}
        </div>

        {active.groups.map((g) => (
          <div className="ct-group" key={g.rank}>
            <div className="ct-group-head">
              <span className="ct-rank">{g.rank}</span>
              <span className="ct-ref">{g.stcwRef}</span>
            </div>
            {g.certs.map((c, i) => <div className="ct-cert" key={i} style={{ marginBottom: i < g.certs.length - 1 ? 4 : 0 }}>{c}</div>)}
          </div>
        ))}

        <div style={{ marginTop: 16, marginBottom: 10 }}>
          <div style={{ fontFamily: "'Bricolage Grotesque',system-ui,sans-serif", fontWeight: 800, fontSize: 14, color: '#fbbf24', marginBottom: 10 }}>+ Additional Requirements by Vessel Type</div>
          {VESSEL_ADD.map((v) => (
            <div className="ct-vessel-card" key={v.type}>
              <div className="ct-vessel-type">{v.type}</div>
              <div className="ct-vessel-note">{v.note}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 8, background: 'linear-gradient(160deg,rgba(251,191,36,.08),#050716)', border: '1.5px solid rgba(251,191,36,.2)', borderRadius: 16, padding: 20 }}>
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
