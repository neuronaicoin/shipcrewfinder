'use client';
import { useState } from 'react';
import Link from 'next/link';

type SectionKey = 'what' | 'areas' | 'prep' | 'observations';

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'what', label: 'What Is SIRE / CDI' },
  { key: 'areas', label: 'Common Inspection Areas' },
  { key: 'prep', label: 'Preparation Checklist' },
  { key: 'observations', label: 'Understanding Observations' },
];

export default function VettingPage() {
  const [tab, setTab] = useState<SectionKey>('what');

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .vt-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .vt-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .vt-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .vt-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .vt-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .vt-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
        .vt-tab{background:transparent;color:#6b83a0;border:1px solid rgba(255,255,255,.12);padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;border-radius:9px;font-family:inherit}
        .vt-tab.active{background:#fbbf24;color:#0b0e13;border-color:#fbbf24}
        .vt-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:12px}
        .vt-h{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:14px;color:#fbbf24;margin-bottom:8px}
        .vt-p{font-size:12.5px;color:#a8bdd2;line-height:1.7;margin-bottom:8px}
        .vt-check{display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;font-size:12.5px;color:#eef4fa;line-height:1.5}
        .vt-check:before{content:'☐';color:#fbbf24;flex-shrink:0}
      `}</style>

      <div className="vt-wrap">
        <Link href="/tools" className="vt-back">← All Tools</Link>
        <div className="vt-title">Tanker Vetting Prep</div>
        <p className="vt-sub">
          SIRE and CDI inspections explained — what's actually checked, and how to prepare so observations are minimized.
        </p>
        <div className="vt-warn">
          ⚠ <b>General guidance only.</b> Always follow your company's specific vetting preparation procedures and the current SIRE/CDI question sets, which are periodically updated.
        </div>

        <div className="vt-tabs">
          {SECTIONS.map((s) => (
            <button key={s.key} className={`vt-tab ${tab === s.key ? 'active' : ''}`} onClick={() => setTab(s.key)}>{s.label}</button>
          ))}
        </div>

        {tab === 'what' && (
          <div className="vt-card">
            <div className="vt-h">What Is SIRE / CDI</div>
            <p className="vt-p"><b style={{ color: '#eef4fa' }}>SIRE (Ship Inspection Report Programme):</b> OCIMF's standardized tanker inspection system — accredited inspectors assess the vessel against a detailed question set, and the report is shared with subscribing oil majors and charterers to inform their chartering decisions.</p>
            <p className="vt-p">SIRE 2.0, the current generation of the programme, places significant emphasis on human factors and crew competence alongside physical vessel condition — not just equipment and paperwork.</p>
            <p className="vt-p"><b style={{ color: '#eef4fa' }}>CDI (Chemical Distribution Institute):</b> A parallel inspection system specifically for chemical tankers and chemical parcel carriers, run independently but serving a similar function — informing charterer risk assessment before fixing a vessel.</p>
            <p className="vt-p">A clean inspection report doesn't guarantee acceptance — vetting is a risk assessment process, and charterers make their own judgement based on the report alongside other factors.</p>
          </div>
        )}

        {tab === 'areas' && (
          <div className="vt-card">
            <div className="vt-h">Common Inspection Areas</div>
            <p className="vt-p">Navigation equipment, procedures, and passage planning practices.</p>
            <p className="vt-p">Cargo and ballast systems — condition, operation, and crew familiarity with emergency procedures.</p>
            <p className="vt-p">Mooring equipment and procedures.</p>
            <p className="vt-p">Safety management system implementation — not just the paperwork existing, but crew genuinely following it in practice.</p>
            <p className="vt-p">Crew competence and familiarization — inspectors commonly ask crew members direct questions about their specific duties and emergency roles.</p>
            <p className="vt-p">General maintenance condition and housekeeping throughout the vessel.</p>
            <p className="vt-p">Pollution prevention equipment and procedures.</p>
            <p className="vt-p">Documentation — certificates current, properly filed, and consistent with what's actually on board.</p>
          </div>
        )}

        {tab === 'prep' && (
          <div className="vt-card">
            <div className="vt-h">Preparation Checklist</div>
            <div className="vt-check">Confirm all certificates are current and properly organized — nothing expired, nothing missing.</div>
            <div className="vt-check">Review the current SIRE/CDI question set with the crew ahead of the inspection — familiarity with what will actually be asked reduces surprises.</div>
            <div className="vt-check">Ensure crew members can clearly explain their specific emergency roles and duties if asked directly — this is a genuine, common inspection focus, not a formality.</div>
            <div className="vt-check">Complete a thorough housekeeping pass — general tidiness and evident care create a strong first impression that colors the whole inspection.</div>
            <div className="vt-check">Verify safety equipment is in date, properly stowed, and crew can demonstrate its use if asked.</div>
            <div className="vt-check">Check that logbooks and records are consistent, complete, and genuinely reflect actual operations — inconsistencies are a common source of observations.</div>
          </div>
        )}

        {tab === 'observations' && (
          <div className="vt-card">
            <div className="vt-h">Understanding Observations</div>
            <p className="vt-p">An observation is a recorded finding from the inspector — not automatically a failure, but a documented item that becomes part of the vessel's inspection history reviewed by future charterers.</p>
            <p className="vt-p">The goal in preparation isn't achieving a perfect zero-observation report at all costs — it's ensuring the vessel is genuinely well-run and that any observations reflect isolated, minor issues rather than systemic problems.</p>
            <p className="vt-p">A pattern of repeated similar observations across multiple inspections is generally viewed more negatively than a single isolated observation — addressing root causes, not just the specific finding, matters for long-term vetting performance.</p>
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
