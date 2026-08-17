'use client';
import { useState } from 'react';
import Link from 'next/link';

type SectionKey = 'what' | 'roles' | 'certs' | 'reporting';

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'what', label: 'What Is ISM' },
  { key: 'roles', label: 'Key Roles' },
  { key: 'certs', label: 'Certificates' },
  { key: 'reporting', label: 'Reporting & Your Role' },
];

export default function IsmPage() {
  const [tab, setTab] = useState<SectionKey>('what');

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .im-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .im-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .im-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .im-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .im-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .im-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
        .im-tab{background:transparent;color:#6b83a0;border:1px solid rgba(255,255,255,.12);padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;border-radius:9px;font-family:inherit}
        .im-tab.active{background:#fbbf24;color:#0b0e13;border-color:#fbbf24}
        .im-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:12px}
        .im-h{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:14px;color:#fbbf24;margin-bottom:8px}
        .im-p{font-size:12.5px;color:#a8bdd2;line-height:1.7;margin-bottom:8px}
        .im-list{padding-left:18px;margin-bottom:0}
        .im-list li{font-size:12.5px;color:#a8bdd2;line-height:1.7;margin-bottom:4px}
        .im-note{background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.25);border-radius:14px;padding:16px;margin-bottom:10px}
      `}</style>

      <div className="im-wrap">
        <Link href="/tools" className="im-back">← All Tools</Link>
        <div className="im-title">ISM Code Guide</div>
        <p className="im-sub">
          The International Safety Management Code — how your company's Safety Management System (SMS) actually works, who's responsible for what, and your role in it.
        </p>
        <div className="im-warn">
          ⚠ <b>General guidance only.</b> Your specific company's SMS procedures take precedence over this general overview — always follow your own SMS documentation and reporting channels.
        </div>

        <div className="im-tabs">
          {SECTIONS.map((s) => (
            <button key={s.key} className={`im-tab ${tab === s.key ? 'active' : ''}`} onClick={() => setTab(s.key)}>{s.label}</button>
          ))}
        </div>

        {tab === 'what' && (
          <div className="im-card">
            <div className="im-h">What Is the ISM Code</div>
            <p className="im-p">The International Safety Management (ISM) Code is a SOLAS Chapter IX requirement obliging shipowners and operators to establish, implement and maintain a Safety Management System (SMS) — a structured set of procedures covering safety, pollution prevention, and emergency preparedness across the whole company, not just individual ships.</p>
            <p className="im-p">The core idea behind ISM is that safety failures are usually organizational, not just individual — the Code exists to make sure the company itself (not only the crew on the day) has systems in place that actually prevent accidents, and that lessons from incidents get fed back into how the company operates.</p>
            <p className="im-p">Every SMS should cover: a documented safety and environmental protection policy, defined levels of authority and communication, procedures for reporting accidents and non-conformities, procedures for emergency situations, and a system for internal audits and management review.</p>
          </div>
        )}

        {tab === 'roles' && (
          <div className="im-card">
            <div className="im-h">Key Roles</div>
            <p className="im-p"><b style={{ color: '#eef4fa' }}>The Designated Person Ashore (DPA):</b> Every company must nominate a DPA, who has direct access to the highest level of company management and serves as the link between the company and those on board. The DPA monitors the safety and pollution-prevention aspects of ship operation and ensures adequate resources are provided.</p>
            <p className="im-p">If you have a serious safety concern that isn&apos;t being addressed through normal shipboard channels, the DPA is a legitimate point of contact — their details should be posted on board.</p>
            <p className="im-p"><b style={{ color: '#eef4fa' }}>The Master&apos;s Authority:</b> The Master has overriding authority and responsibility to make decisions regarding safety and pollution prevention, and to request company assistance as necessary. The company must not constrain the Master&apos;s authority in matters of safety.</p>
          </div>
        )}

        {tab === 'certs' && (
          <div className="im-card">
            <div className="im-h">Certificates</div>
            <p className="im-p"><b style={{ color: '#eef4fa' }}>Document of Compliance (DOC):</b> Issued to the company (not the ship) once the flag state confirms the company&apos;s SMS meets ISM requirements — typically valid 5 years, subject to annual verification.</p>
            <p className="im-p"><b style={{ color: '#eef4fa' }}>Safety Management Certificate (SMC):</b> Issued to the individual ship, confirming the company and shipboard management operate in accordance with the approved SMS — typically valid 5 years, subject to at least one intermediate verification.</p>
            <p className="im-p">Both certificates can be withdrawn if there is a major non-conformity — meaning ISM compliance is directly linked to a ship&apos;s ability to trade legally.</p>
          </div>
        )}

        {tab === 'reporting' && (
          <div>
            <div className="im-note">
              <div style={{ fontWeight: 800, color: '#34d399', marginBottom: 6, fontSize: 13 }}>Non-Conformity Reporting</div>
              <p className="im-p" style={{ marginBottom: 0 }}>A non-conformity is any observed situation where objective evidence shows a requirement (in the SMS, or applicable regulation) has not been met. Crew are expected to report non-conformities, accidents and hazardous occurrences — this is not "telling on" anyone, it&apos;s literally how the system is designed to work and improve.</p>
            </div>
            <div className="im-note">
              <div style={{ fontWeight: 800, color: '#34d399', marginBottom: 6, fontSize: 13 }}>Your Role as Crew</div>
              <p className="im-p" style={{ marginBottom: 0 }}>Follow the procedures in your company&apos;s SMS, participate honestly in drills and audits, and report hazards or near-misses through the proper channel — usually via the Master or the ship&apos;s safety officer, ultimately reaching the DPA if needed.</p>
            </div>
            <div className="im-note">
              <div style={{ fontWeight: 800, color: '#34d399', marginBottom: 6, fontSize: 13 }}>Internal Audits</div>
              <p className="im-p" style={{ marginBottom: 0 }}>Companies must carry out internal audits to verify the SMS is actually working as intended — being asked questions during an internal audit is a normal, expected part of the system, not something to be defensive about.</p>
            </div>
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
