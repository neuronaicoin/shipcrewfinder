'use client';
import { useState } from 'react';
import Link from 'next/link';

type SectionKey = 'rules' | 'recognize' | 'help' | 'reporting';

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'rules', label: 'The Rest Hour Rules' },
  { key: 'recognize', label: 'Recognizing Fatigue' },
  { key: 'help', label: 'What Actually Helps' },
  { key: 'reporting', label: 'Reporting a Concern' },
];

export default function FatiguePage() {
  const [tab, setTab] = useState<SectionKey>('rules');

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .ft-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .ft-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .ft-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .ft-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .ft-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .ft-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
        .ft-tab{background:transparent;color:#6b83a0;border:1px solid rgba(255,255,255,.12);padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;border-radius:9px;font-family:inherit}
        .ft-tab.active{background:#fbbf24;color:#0b0e13;border-color:#fbbf24}
        .ft-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:12px}
        .ft-h{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:14px;color:#fbbf24;margin-bottom:8px}
        .ft-p{font-size:12.5px;color:#a8bdd2;line-height:1.7;margin-bottom:8px}
        .ft-symptom{background:rgba(232,184,90,.06);border-left:3px solid rgba(232,184,90,.5);padding:10px 12px;margin-bottom:8px;font-size:12.5px;color:#eef4fa;line-height:1.5;border-radius:4px}
      `}</style>

      <div className="ft-wrap">
        <Link href="/tools" className="ft-back">← All Tools</Link>
        <div className="ft-title">Fatigue Management Guide</div>
        <p className="ft-sub">
          The rest hour rules, how to recognize genuine fatigue in yourself and others, and what actually helps.
        </p>
        <div className="ft-warn">
          ⚠ Fatigue is a documented, major contributing factor in maritime incidents — treating it seriously isn&apos;t weakness, it&apos;s good seamanship.
        </div>

        <div className="ft-tabs">
          {SECTIONS.map((s) => (
            <button key={s.key} className={`ft-tab ${tab === s.key ? 'active' : ''}`} onClick={() => setTab(s.key)}>{s.label}</button>
          ))}
        </div>

        {tab === 'rules' && (
          <div className="ft-card">
            <div className="ft-h">The Rest Hour Rules</div>
            <p className="ft-p">Under STCW and MLC 2006, minimum rest is commonly set at <b style={{ color: '#eef4fa' }}>10 hours in any 24-hour period</b> and <b style={{ color: '#eef4fa' }}>77 hours in any 7-day period</b>.</p>
            <p className="ft-p">Rest should not be divided into more than two periods, one of which must be at least 6 hours, with no more than 14 hours between the start of consecutive rest periods.</p>
            <p className="ft-p">Records of actual hours of work or rest must be kept and are routinely checked during Port State Control inspections — these aren&apos;t just paperwork, they're a genuine safety requirement.</p>
            <p className="ft-p">See our MLC 2006 Guide for the full regulatory detail behind these rules.</p>
          </div>
        )}

        {tab === 'recognize' && (
          <div className="ft-card">
            <div className="ft-h">Recognizing Fatigue</div>
            <p className="ft-p" style={{ color: '#eef4fa' }}>In yourself or a colleague, watch for:</p>
            <div className="ft-symptom">Difficulty concentrating or keeping focus on a task</div>
            <div className="ft-symptom">Slowed reaction time to instructions, alarms, or changing situations</div>
            <div className="ft-symptom">Increased irritability or uncharacteristic short temper</div>
            <div className="ft-symptom">Microsleeps — brief, unintended lapses of attention, sometimes just seconds long</div>
            <div className="ft-symptom">Poor judgment or decision-making that seems out of character</div>
            <p className="ft-p" style={{ marginTop: 8 }}>Cumulative fatigue builds over days and weeks — feeling "okay" on any single day doesn&apos;t rule out significant accumulated fatigue over a longer period, particularly on demanding watch rotations.</p>
          </div>
        )}

        {tab === 'help' && (
          <div className="ft-card">
            <div className="ft-h">What Actually Helps</div>
            <p className="ft-p">Protect your rest periods as genuinely as possible — minimize non-essential interruptions, and treat scheduled rest as a real operational requirement, not flexible time.</p>
            <p className="ft-p">Good sleep environment matters — noise, vibration, temperature, and light all affect sleep quality, not just quantity. Small, practical fixes (earplugs, eye mask, room-darkening where possible) genuinely help.</p>
            <p className="ft-p">Consistency in sleep timing, where your watch pattern allows it, supports better sleep quality than highly irregular timing.</p>
            <p className="ft-p">Port calls are a common, underrated fatigue risk — the combination of watchkeeping duties plus cargo operations plus admin work during a port call can erode rest more than a normal sea passage.</p>
          </div>
        )}

        {tab === 'reporting' && (
          <div className="ft-card">
            <div className="ft-h">Reporting a Concern</div>
            <p className="ft-p">If you or a colleague are genuinely too fatigued to safely perform a duty, this is a legitimate safety concern to raise — through your normal SMS non-conformity or safety reporting channel, or directly with the Master if urgent.</p>
            <p className="ft-p">Reporting fatigue is not the same as complaining about workload in general — it's specifically flagging a safety-relevant condition, exactly the kind of hazard reporting your company's Safety Management System is designed to capture and act on.</p>
            <p className="ft-p">If rest hour violations are a persistent pattern rather than an occasional exception, this is worth raising formally — see our MLC 2006 Guide and ITF Guide for how to escalate if it isn&apos;t addressed through normal channels.</p>
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
