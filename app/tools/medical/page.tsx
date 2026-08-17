'use client';
import { useState } from 'react';
import Link from 'next/link';

type SectionKey = 'first' | 'tmas' | 'redflags' | 'resources';

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'first', label: 'What To Do First' },
  { key: 'tmas', label: 'Getting Real Medical Help (TMAS)' },
  { key: 'redflags', label: 'Recognizing Serious Emergencies' },
  { key: 'resources', label: "Your Ship's Medical Resources" },
];

export default function MedicalPage() {
  const [tab, setTab] = useState<SectionKey>('first');

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .md-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .md-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .md-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .md-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .md-warn{background:rgba(248,113,113,.1);border:2px solid rgba(248,113,113,.4);border-radius:10px;padding:14px;font-size:12.5px;color:#fca5a5;line-height:1.6;margin-bottom:16px;font-weight:600}
        .md-tabs{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
        .md-tab{background:linear-gradient(165deg,#141845,#050716);color:#a8bdd2;border:1px solid rgba(255,255,255,.08);padding:12px 14px;font-size:12.5px;font-weight:700;cursor:pointer;border-radius:11px;text-align:left;font-family:inherit}
        .md-tab.active{border-color:#fbbf24;color:#fbbf24;background:rgba(251,191,36,.06)}
        .md-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:12px}
        .md-h{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:14px;color:#fbbf24;margin-bottom:8px}
        .md-p{font-size:12.5px;color:#a8bdd2;line-height:1.7;margin-bottom:8px}
        .md-step{display:flex;gap:12px;margin-bottom:10px;align-items:flex-start}
        .md-num{width:24px;height:24px;border-radius:50%;background:rgba(251,191,36,.15);border:1px solid rgba(251,191,36,.4);color:#fbbf24;font-weight:800;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .md-text{font-size:12.5px;color:#eef4fa;line-height:1.6;padding-top:2px}
        .md-symptom{background:rgba(248,113,113,.06);border-left:3px solid rgba(248,113,113,.5);padding:10px 12px;margin-bottom:8px;font-size:12.5px;color:#eef4fa;line-height:1.5;border-radius:4px}
      `}</style>

      <div className="md-wrap">
        <Link href="/tools" className="md-back">← All Tools</Link>
        <div className="md-title">Medical Emergency Guide</div>
        <p className="md-sub">
          What to do first, how to reach real medical help, and warning signs of a genuine emergency.
        </p>
        <div className="md-warn">
          🚨 This is not medical treatment guidance. For any real medical emergency, the priority is always getting a trained crew member and real medical advice (via TMAS) involved as fast as possible — this page helps you do that quickly, not replace it.
        </div>

        <div className="md-tabs">
          {SECTIONS.map((s) => (
            <button key={s.key} className={`md-tab ${tab === s.key ? 'active' : ''}`} onClick={() => setTab(s.key)}>{s.label}</button>
          ))}
        </div>

        {tab === 'first' && (
          <div className="md-card">
            <div className="md-h">What To Do First</div>
            <div className="md-step"><div className="md-num">1</div><div className="md-text">Ensure the scene is safe before approaching — do not become a second casualty.</div></div>
            <div className="md-step"><div className="md-num">2</div><div className="md-text">Call for help immediately — alert the bridge/master and get your ship's designated medical care provider (the officer with Medical Care training) involved right away.</div></div>
            <div className="md-step"><div className="md-num">3</div><div className="md-text">If the person is unresponsive, check breathing — if trained in CPR and it's needed, begin immediately; every minute of delay reduces survival chances significantly.</div></div>
            <div className="md-step"><div className="md-num">4</div><div className="md-text">Do not move an injured person unnecessarily, particularly if a spinal injury is possible, unless there's an immediate danger requiring it.</div></div>
            <div className="md-step"><div className="md-num">5</div><div className="md-text">Get real medical advice via TMAS as soon as possible — don't attempt to guess at treatment beyond basic first aid you're actually trained in.</div></div>
          </div>
        )}

        {tab === 'tmas' && (
          <div className="md-card">
            <div className="md-h">Getting Real Medical Help (TMAS)</div>
            <p className="md-p">Telemedical Assistance Service (TMAS) provides seafarers with real, qualified medical advice from shore-based doctors, by radio or satellite communication — this is the actual authoritative source of treatment guidance for a shipboard medical situation, not a general reference like this page.</p>
            <p className="md-p">Most flag states have a nominated TMAS provider or radio medical advice service — your vessel's communication procedures should have the current contact details posted and readily accessible.</p>
            <p className="md-p">When contacting TMAS, be ready to describe: the patient's symptoms, vital signs if measurable (pulse, breathing rate, consciousness level), what happened, and any treatment already given — clear, accurate information significantly speeds up getting the right advice.</p>
          </div>
        )}

        {tab === 'redflags' && (
          <div className="md-card">
            <div className="md-h">Recognizing Serious Emergencies</div>
            <p className="md-p" style={{ color: '#eef4fa' }}>These signs suggest a genuine emergency requiring immediate TMAS contact and, where the vessel's position allows, medical evacuation consideration:</p>
            <div className="md-symptom">Loss of consciousness or unresponsiveness</div>
            <div className="md-symptom">Difficulty breathing or absent breathing</div>
            <div className="md-symptom">Severe or uncontrolled bleeding</div>
            <div className="md-symptom">Chest pain, particularly with sweating, nausea, or pain spreading to the arm/jaw</div>
            <div className="md-symptom">Sudden severe headache, confusion, slurred speech, or weakness on one side of the body</div>
            <div className="md-symptom">Severe burns, or any burn affecting the face, airway, or a large body area</div>
            <div className="md-symptom">Suspected fracture with visible deformity, or any injury following a significant fall</div>
            <p className="md-p" style={{ marginTop: 8 }}>If in doubt, treat it as serious and contact TMAS — the cost of an unnecessary call is far lower than the cost of a delayed one.</p>
          </div>
        )}

        {tab === 'resources' && (
          <div className="md-card">
            <div className="md-h">Your Ship's Medical Resources</div>
            <p className="md-p"><b style={{ color: '#eef4fa' }}>Ship's Medical Guide:</b> Vessels are required to carry an approved medical guide (such as the International Medical Guide for Ships) — this is the actual reference for treatment guidance on board, used alongside TMAS advice.</p>
            <p className="md-p"><b style={{ color: '#eef4fa' }}>Medicine Chest:</b> A stocked medicine chest appropriate to the vessel's trade, maintained and checked regularly.</p>
            <p className="md-p"><b style={{ color: '#eef4fa' }}>Trained Personnel:</b> At least one crew member (often the Master or a senior officer) holds Medical Care training under STCW — know who this is on your vessel before you need them.</p>
            <p className="md-p"><b style={{ color: '#eef4fa' }}>MLC 4.1:</b> Your rights to medical care on board and ashore are covered under MLC 2006 Title 4 — see our MLC Guide for details.</p>
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
