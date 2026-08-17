'use client';
import { useState } from 'react';
import Link from 'next/link';

type SectionKey = 'levels' | 'roles' | 'docs' | 'alert';

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'levels', label: 'Security Levels' },
  { key: 'roles', label: 'Key Roles' },
  { key: 'docs', label: 'Certificates & Plans' },
  { key: 'alert', label: 'Declaration of Security & SSAS' },
];

export default function IspsPage() {
  const [tab, setTab] = useState<SectionKey>('levels');

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .ip-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .ip-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .ip-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .ip-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .ip-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .ip-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
        .ip-tab{background:transparent;color:#6b83a0;border:1px solid rgba(255,255,255,.12);padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;border-radius:9px;font-family:inherit}
        .ip-tab.active{background:#fbbf24;color:#0b0e13;border-color:#fbbf24}
        .ip-level{border-radius:14px;padding:16px;margin-bottom:10px}
        .ip-level-name{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:15px;margin-bottom:6px}
        .ip-level-p{font-size:12.5px;line-height:1.6}
        .ip-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:12px}
        .ip-h{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:14px;color:#fbbf24;margin-bottom:8px}
        .ip-p{font-size:12.5px;color:#a8bdd2;line-height:1.7;margin-bottom:8px}
      `}</style>

      <div className="ip-wrap">
        <Link href="/tools" className="ip-back">← All Tools</Link>
        <div className="ip-title">ISPS Code Guide</div>
        <p className="ip-sub">
          Ship and port facility security — the three security levels, who's responsible for what, and how the Declaration of Security and SSAS actually work.
        </p>
        <div className="ip-warn">
          ⚠ <b>General guidance only.</b> Your ship's Ship Security Plan (SSP) is confidential and takes precedence over this general overview — this guide is deliberately non-specific about sensitive security procedures.
        </div>

        <div className="ip-tabs">
          {SECTIONS.map((s) => (
            <button key={s.key} className={`ip-tab ${tab === s.key ? 'active' : ''}`} onClick={() => setTab(s.key)}>{s.label}</button>
          ))}
        </div>

        {tab === 'levels' && (
          <>
            <div className="ip-level" style={{ background: 'rgba(52,211,153,.1)', border: '1px solid rgba(52,211,153,.35)' }}>
              <div className="ip-level-name" style={{ color: '#34d399' }}>Security Level 1 — Normal</div>
              <p className="ip-level-p" style={{ color: '#a8bdd2' }}>The default level, maintained at all times. Minimum appropriate protective security measures — controlled access, monitoring, and standard security awareness.</p>
            </div>
            <div className="ip-level" style={{ background: 'rgba(232,184,90,.1)', border: '1px solid rgba(232,184,90,.35)' }}>
              <div className="ip-level-name" style={{ color: '#e8c87a' }}>Security Level 2 — Heightened</div>
              <p className="ip-level-p" style={{ color: '#a8bdd2' }}>Additional protective security measures maintained for a period as a result of heightened risk of a security incident — increased monitoring, more restrictive access control, additional patrols.</p>
            </div>
            <div className="ip-level" style={{ background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.35)' }}>
              <div className="ip-level-name" style={{ color: '#f87171' }}>Security Level 3 — Exceptional</div>
              <p className="ip-level-p" style={{ color: '#a8bdd2' }}>Further specific protective security measures maintained for a limited period when a security incident is probable or imminent — the highest level, involving the most restrictive measures.</p>
            </div>
          </>
        )}

        {tab === 'roles' && (
          <div className="ip-card">
            <div className="ip-h">Key Roles</div>
            <p className="ip-p"><b style={{ color: '#eef4fa' }}>Ship Security Officer (SSO):</b> Designated on board, responsible for implementing and maintaining the Ship Security Plan, liaising with the Company Security Officer and Port Facility Security Officers.</p>
            <p className="ip-p"><b style={{ color: '#eef4fa' }}>Company Security Officer (CSO):</b> A shore-based role designated by the company, responsible for ensuring a Ship Security Assessment is carried out and that Ship Security Plans are developed, submitted for approval, and implemented across the fleet.</p>
            <p className="ip-p"><b style={{ color: '#eef4fa' }}>Port Facility Security Officer (PFSO):</b> The equivalent role at a port facility, responsible for that facility's security plan and liaison with visiting vessels.</p>
          </div>
        )}

        {tab === 'docs' && (
          <div className="ip-card">
            <div className="ip-h">Certificates & Plans</div>
            <p className="ip-p"><b style={{ color: '#eef4fa' }}>International Ship Security Certificate (ISSC):</b> Issued after verification that the ship complies with ISPS requirements — typically valid 5 years, and checked routinely during Port State Control.</p>
            <p className="ip-p"><b style={{ color: '#eef4fa' }}>Ship Security Plan (SSP):</b> A confidential, flag-state-approved document detailing the ship's specific security procedures — access to the full SSP is restricted, but crew should know their own role within it.</p>
            <p className="ip-p"><b style={{ color: '#eef4fa' }}>Continuous Synopsis Record (CSR):</b> A history of the ship — ownership, flag, class, and other key details — required to be kept on board and updated when changes occur.</p>
          </div>
        )}

        {tab === 'alert' && (
          <div className="ip-card">
            <div className="ip-h">Declaration of Security & SSAS</div>
            <p className="ip-p"><b style={{ color: '#eef4fa' }}>Declaration of Security (DoS):</b> A documented agreement between a ship and a port facility (or between two ships) on the security measures each will implement during their interface — required at higher security levels, or when either party assesses genuine risk in the interaction.</p>
            <p className="ip-p"><b style={{ color: '#eef4fa' }}>Ship Security Alert System (SSAS):</b> A covert alarm that, when activated, silently transmits the ship's identity and position to a designated authority ashore — without alerting anyone on board who might pose the threat, or anyone monitoring the ship's normal communications. Know where your ship's activation point is and when it's appropriate to use it.</p>
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
