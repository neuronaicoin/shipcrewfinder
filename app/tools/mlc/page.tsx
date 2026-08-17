'use client';
import { useState } from 'react';
import Link from 'next/link';

type TitleKey = 'T1' | 'T2' | 'T3' | 'T4' | 'T5';

interface Reg { code: string; title: string; body: string[]; }
interface TitleInfo { key: TitleKey; name: string; regs: Reg[]; }

const TITLES: TitleInfo[] = [
  {
    key: 'T1',
    name: 'Title 1 — Minimum Requirements to Work on a Ship',
    regs: [
      { code: '1.1', title: 'Minimum Age', body: ['No person below the minimum age (16) may be employed or engaged to work on a ship.', 'Night work and hazardous work are restricted for seafarers under 18 — check the specific limits under your flag state.'] },
      { code: '1.2', title: 'Medical Certificate', body: ['Seafarers must hold a valid medical certificate attesting fitness for the duties they are to perform.', 'Certificates are generally valid for up to 2 years (1 year for seafarers under 18), issued by a qualified medical practitioner recognized by the flag state.'] },
      { code: '1.3', title: 'Training and Qualifications', body: ['Seafarers must be trained and certified competent to perform their duties, in line with STCW requirements.', 'Personal safety training (e.g. basic safety training) is required before assignment to any shipboard duties.'] },
      { code: '1.4', title: 'Recruitment and Placement', body: ['Recruitment and placement services used by seafarers must not charge the seafarer, directly or indirectly, any fee for finding employment — this includes so-called "placement fees".', 'If you are asked to pay a manning agency to secure a job, this is a red flag — legitimate MLC-compliant recruitment does not charge job-seeking seafarers.'] },
    ],
  },
  {
    key: 'T2',
    name: 'Title 2 — Conditions of Employment',
    regs: [
      { code: '2.1', title: "Seafarers' Employment Agreement (SEA)", body: ['Every seafarer is entitled to a written employment agreement, signed by both the seafarer and the shipowner/representative, before or upon engagement.', 'The SEA should be clear on wages, leave, repatriation, and other entitlements — keep a copy on board and in your own possession.'] },
      { code: '2.2', title: 'Wages', body: ['Seafarers must be paid at no greater than monthly intervals, in accordance with their employment agreement.', 'Seafarers have the right to allot part of their wages to family members or dependants at no or minimal cost.'] },
      { code: '2.3', title: 'Hours of Work or Rest', body: ['Flag states set either a maximum hours of work or a minimum hours of rest standard. Common minimum rest standards are 10 hours in any 24-hour period and 77 hours in any 7-day period.', 'Rest periods should not be divided into more than two periods, one of which is at least 6 hours, with no more than 14 hours between consecutive rest periods.', 'Records of daily hours of work or rest must be kept and are subject to inspection.'] },
      { code: '2.4', title: 'Entitlement to Leave', body: ['Seafarers are entitled to paid annual leave, commonly calculated at a minimum of 2.5 calendar days per month of employment.', 'Shore leave should be granted for health and wellbeing, consistent with operational requirements.'] },
      { code: '2.5', title: 'Repatriation', body: ['Seafarers are entitled to repatriation at no cost to themselves in specified circumstances — including expiry of the SEA, illness or injury requiring return home, the ship\u2019s sale or loss, or the shipowner\u2019s inability to continue fulfilling obligations.', 'Flag states set a maximum period of service on board before entitlement to repatriation arises — commonly around 12 months.', 'Financial security must be in place (typically insurance or equivalent) to guarantee repatriation costs are actually covered.'] },
      { code: '2.6', title: "Seafarer Compensation for Ship's Loss or Foundering", body: ['If a ship is lost or founders, seafarers are entitled to compensation against unemployment resulting from that loss.'] },
      { code: '2.7', title: 'Manning Levels', body: ['Ships must be sufficiently, safely and efficiently manned, taking into account minimum safe manning documents and MLC requirements together.'] },
      { code: '2.8', title: 'Career and Skill Development', body: ['Flag states are encouraged to promote career and skill development, and employment opportunities, for seafarers.'] },
    ],
  },
  {
    key: 'T3',
    name: 'Title 3 — Accommodation, Recreation, Food and Catering',
    regs: [
      { code: '3.1', title: 'Accommodation and Recreational Facilities', body: ['Ships must provide decent accommodation and recreational facilities, meeting minimum standards for space, heating, ventilation, lighting, sanitary facilities and noise/vibration control.', 'Specific cubic-metre and layout requirements vary by ship size, type and build date — always check your vessel\u2019s Declaration of Maritime Labour Compliance (DMLC) for the exact standards that apply.'] },
      { code: '3.2', title: 'Food and Catering', body: ['Food and drinking water must be provided free of charge to seafarers during the period of engagement, and must be of appropriate quality, nutritional value and quantity.', 'Ships must carry a qualified cook where crew size requires one, appropriately trained in food safety and nutrition.'] },
    ],
  },
  {
    key: 'T4',
    name: 'Title 4 — Health, Medical Care, Welfare and Social Security',
    regs: [
      { code: '4.1', title: 'Medical Care On Board and Ashore', body: ['Seafarers are entitled to medical care on board and prompt access to medical facilities ashore while in port, comparable as far as possible to care available to workers ashore.', 'Ships must carry a medicine chest, medical equipment and a guide, appropriate to the vessel\u2019s trade.'] },
      { code: '4.2', title: "Shipowner's Liability", body: ['Shipowners are liable for the costs of sickness and injury occurring between the date of joining and the date of termination of the SEA — including medical care, board and lodging, and wages during incapacity.', 'This includes the cost of repatriation for medical reasons, and — in the event of death in service — burial expenses.'] },
      { code: '4.3', title: 'Health and Safety Protection', body: ['Shipowners must maintain occupational health and safety programmes, with risk assessment and reporting of occupational accidents, injuries and diseases.'] },
      { code: '4.4', title: 'Access to Shore-Based Welfare Facilities', body: ['Seafarers should have access to welfare facilities and services in port, where they exist, regardless of nationality, race, colour, sex, religion or political opinion.'] },
      { code: '4.5', title: 'Social Security', body: ['Flag states must ensure seafarers, and their dependants where applicable, have access to social security protection no less favourable than that enjoyed by shoreworkers.'] },
    ],
  },
  {
    key: 'T5',
    name: 'Title 5 — Compliance and Enforcement',
    regs: [
      { code: '5.1', title: 'Flag State Responsibilities', body: ['Ships of 500 GT and above engaged in international voyages must carry a Maritime Labour Certificate and a Declaration of Maritime Labour Compliance (DMLC Parts I and II), evidencing MLC compliance.', 'The DMLC Part II, prepared by the shipowner, sets out how the flag state\u2019s requirements are actually met on board — worth reading if you want specifics for your vessel.'] },
      { code: '5.2', title: 'Port State Responsibilities', body: ['Port State Control officers can inspect MLC compliance. A valid Maritime Labour Certificate is normally accepted as prima facie evidence of compliance, but PSC can still inspect if there are clear grounds a serious issue exists.', 'Serious or repeated MLC breaches can result in detention.'] },
      { code: '5.3', title: "On-Board Complaint Procedures", body: ['Seafarers have the right to complain about any matter alleged to constitute a breach of MLC requirements, without fear of penalization.', 'Ships must have an on-board complaint (grievance) procedure. If unresolved on board, seafarers can complain to the master, the flag state, or — while in a foreign port — to the port state\u2019s authorities.', 'Keep records of any complaint raised and the response received.'] },
    ],
  },
];

export default function MlcPage() {
  const [tab, setTab] = useState<TitleKey>('T1');
  const active = TITLES.find((t) => t.key === tab)!;

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .mz-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .mz-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .mz-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .mz-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .mz-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .mz-tabs{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
        .mz-tab{background:linear-gradient(165deg,#141845,#050716);color:#a8bdd2;border:1px solid rgba(255,255,255,.08);padding:12px 14px;font-size:12.5px;font-weight:700;cursor:pointer;border-radius:11px;text-align:left;font-family:inherit}
        .mz-tab.active{border-color:#fbbf24;color:#fbbf24;background:rgba(251,191,36,.06)}
        .mz-reg{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px;margin-bottom:10px}
        .mz-reg-head{display:flex;align-items:baseline;gap:8px;margin-bottom:8px}
        .mz-reg-code{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;color:#fbbf24;font-size:13px}
        .mz-reg-title{font-weight:700;font-size:13.5px}
        .mz-reg-p{font-size:12.5px;color:#a8bdd2;line-height:1.6;margin-bottom:6px}
        .mz-complaint{background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.25);border-radius:14px;padding:18px;margin-top:16px}
      `}</style>

      <div className="mz-wrap">
        <Link href="/tools" className="mz-back">← All Tools</Link>
        <div className="mz-title">MLC 2006 Guide</div>
        <p className="mz-sub">
          The Maritime Labour Convention, 2006 — your rights covering employment, wages, rest hours, accommodation, food, medical care, and the on-board complaint process.
        </p>
        <div className="mz-warn">
          ⚠ <b>General guidance only.</b> Specific numeric thresholds (accommodation dimensions, exact leave accrual, etc.) can vary by flag state implementation and ship build date. Always check your vessel&apos;s Declaration of Maritime Labour Compliance (DMLC) and your own Seafarers&apos; Employment Agreement (SEA) for the figures that actually apply to you.
        </div>

        <div className="mz-tabs">
          {TITLES.map((t) => (
            <button key={t.key} className={`mz-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.name}</button>
          ))}
        </div>

        {active.regs.map((r) => (
          <div className="mz-reg" key={r.code}>
            <div className="mz-reg-head">
              <span className="mz-reg-code">{r.code}</span>
              <span className="mz-reg-title">{r.title}</span>
            </div>
            {r.body.map((p, i) => <p className="mz-reg-p" key={i}>{p}</p>)}
          </div>
        ))}

        <div className="mz-complaint">
          <div style={{ fontFamily: "'Bricolage Grotesque',system-ui,sans-serif", fontWeight: 800, fontSize: 14, color: '#34d399', marginBottom: 8 }}>⚖️ If You Need to Complain</div>
          <p style={{ fontSize: 12.5, color: '#a8bdd2', lineHeight: 1.7 }}>
            You have the right to raise a complaint about an MLC breach without fear of penalization. Start with the on-board procedure (usually via the master). If unresolved, you can contact your flag state, or — while in a foreign port — the port state authorities. Keep a written record of what you raised and any response.
          </p>
        </div>

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
