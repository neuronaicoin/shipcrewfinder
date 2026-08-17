'use client';
import { useState } from 'react';
import Link from 'next/link';

type ChapKey = 'I' | 'II2' | 'III' | 'IV' | 'V' | 'other';

interface Item { title: string; body: string[]; }
interface Chap { key: ChapKey; name: string; items: Item[]; }

const CHAPTERS: Chap[] = [
  {
    key: 'I', name: 'Chapter I — General Provisions',
    items: [
      { title: 'Survey and Certification', body: ['Ships must undergo periodic surveys — initial, renewal, intermediate and annual, depending on the certificate — carried out by the flag state or a recognized organization (classification society) acting on its behalf.', 'Key certificates include the Cargo Ship Safety Construction Certificate, Cargo Ship Safety Equipment Certificate, Cargo Ship Safety Radio Certificate (or a combined Cargo Ship Safety Certificate), and the Load Line Certificate.'] },
      { title: 'Control (Port State Control)', body: ['A ship in a foreign port may be inspected by Port State Control to verify that the ship and its equipment substantially comply with the certificates on board. Deficiencies can result in rectification requirements or, for serious cases, detention.'] },
    ],
  },
  {
    key: 'II2', name: 'Chapter II-2 — Fire Protection & Fire Extinction',
    items: [
      { title: 'Structural Fire Protection', body: ['Ships are divided into fire-resistant zones using A-class and B-class divisions, designed to contain a fire to its area of origin and protect escape routes.'] },
      { title: 'Detection and Extinction Systems', body: ['Fixed fire detection and alarm systems, fixed fire-extinguishing systems (e.g. CO2 or water-based systems in machinery spaces), and portable extinguishers are required according to ship type and space.', 'Fire pumps, fire mains, hydrants and hoses must be maintained ready for immediate use at all times.'] },
      { title: 'Means of Escape', body: ['At least two widely separated means of escape must be provided from all normally occupied spaces, kept clear and clearly marked at all times.'] },
    ],
  },
  {
    key: 'III', name: 'Chapter III — Life-Saving Appliances',
    items: [
      { title: 'Lifeboats, Liferafts & Rescue Boats', body: ['Ships must carry sufficient survival craft to accommodate all persons on board, per the specific requirements for the ship type (typically lifeboats and/or liferafts on each side, or a total capacity requirement).', 'Davit-launched liferafts, free-fall lifeboats and rescue boats each have specific launching and maintenance requirements.'] },
      { title: 'Personal Life-Saving Equipment', body: ['Lifejackets must be provided for every person on board, plus a percentage of spares, and immersion suits or anti-exposure suits are required depending on the trading area and ship type.', 'Lifebuoys with self-igniting lights and buoyant lines must be positioned around the ship, readily available for immediate use.'] },
      { title: 'Drills', body: ['Abandon ship and fire drills must be held at least monthly for the crew, with each drill including different scenarios where practicable.', 'Every crew member must participate in an abandon ship drill and a fire drill at least once every month — new crew joining should be drilled within 24 hours of sailing if more than 25% of the crew has not participated in the previous month\u2019s drills.', 'Lifeboats and rescue boats must be lowered and manoeuvred in water where practicable, and liferaft launching must be demonstrated periodically per the required schedule.'] },
      { title: 'EPIRBs and SARTs', body: ['At least one satellite EPIRB (Emergency Position-Indicating Radio Beacon) must be carried, capable of manual and float-free automatic activation.', 'Search and Rescue Transponders (SART) or AIS-SART units are required to help locate survival craft.'] },
    ],
  },
  {
    key: 'IV', name: 'Chapter IV — Radiocommunications (GMDSS)',
    items: [
      { title: 'GMDSS Equipment', body: ['Ships must carry radio equipment appropriate to their sea area of operation (A1–A4), enabling distress alerting and communication via VHF, MF, HF and/or satellite systems as applicable.', 'Required equipment typically includes VHF DSC radio, NAVTEX receiver (where applicable), satellite EPIRB, and — depending on sea area — MF/HF DSC equipment or Inmarsat terminals.'] },
      { title: 'Watchkeeping and Testing', body: ['A continuous radio watch must be maintained on appropriate distress and safety frequencies while at sea.', 'GMDSS equipment must be tested regularly per the required schedule, and radio logs kept.'] },
    ],
  },
  {
    key: 'V', name: 'Chapter V — Safety of Navigation',
    items: [
      { title: 'Voyage Planning', body: ['Before proceeding to sea, the master must ensure the intended voyage is planned using appropriate nautical charts and publications, taking into account relevant routing and reporting systems, and identified hazards.'] },
      { title: 'Bridge Equipment', body: ['Depending on ship size and type, required equipment includes ECDIS (Electronic Chart Display and Information System) or paper chart backup, radar, AIS (Automatic Identification System), Voyage Data Recorder (VDR), and gyro/magnetic compasses.', 'ECDIS carriage has become mandatory for most SOLAS ships engaged in international voyages, with a phased implementation schedule that varied by ship type and size.'] },
      { title: 'Bridge Navigational Watch', body: ['A safe navigational watch must be maintained at all times, in accordance with STCW watchkeeping principles, with the officer of the watch having full responsibility for safe navigation.'] },
      { title: 'Ship Reporting and LRIT', body: ['Ships must comply with applicable Vessel Traffic Service (VTS) and mandatory ship reporting system requirements, and carry Long-Range Identification and Tracking (LRIT) equipment where required.'] },
    ],
  },
  {
    key: 'other', name: 'Other Key Chapters (Overview)',
    items: [
      { title: 'Chapter VI & VII — Cargoes & Dangerous Goods', body: ['Cover safe carriage of solid bulk cargoes (linked to the IMSBC Code) and dangerous goods (linked to the IMDG Code).'] },
      { title: 'Chapter IX — ISM Code', body: ['Requires shipowners and operators to maintain a Safety Management System (SMS), certified via the Document of Compliance (company level) and Safety Management Certificate (ship level).'] },
      { title: 'Chapter XI-2 — ISPS Code', body: ['Establishes ship and port facility security requirements, including security levels, Ship Security Plans, and the International Ship Security Certificate (ISSC).'] },
      { title: 'Chapter XII — Bulk Carrier Safety', body: ['Additional structural and survey requirements specific to bulk carriers, reflecting historical loss experience with this ship type.'] },
      { title: 'Chapter XIV — Polar Code', body: ['Additional safety (and separately, environmental) requirements for ships operating in polar waters, covering structure, stability, equipment, and crew training.'] },
    ],
  },
];

export default function SolasPage() {
  const [tab, setTab] = useState<ChapKey>('I');
  const active = CHAPTERS.find((c) => c.key === tab)!;

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .sl-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .sl-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .sl-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .sl-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .sl-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .sl-tabs{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
        .sl-tab{background:linear-gradient(165deg,#141845,#050716);color:#a8bdd2;border:1px solid rgba(255,255,255,.08);padding:12px 14px;font-size:12.5px;font-weight:700;cursor:pointer;border-radius:11px;text-align:left;font-family:inherit}
        .sl-tab.active{border-color:#fbbf24;color:#fbbf24;background:rgba(251,191,36,.06)}
        .sl-item{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px;margin-bottom:10px}
        .sl-item-title{font-weight:700;font-size:13.5px;margin-bottom:8px;color:#fbbf24}
        .sl-p{font-size:12.5px;color:#a8bdd2;line-height:1.6;margin-bottom:6px}
      `}</style>

      <div className="sl-wrap">
        <Link href="/tools" className="sl-back">← All Tools</Link>
        <div className="sl-title">SOLAS Guide</div>
        <p className="sl-sub">
          The Safety of Life at Sea convention — fire protection, life-saving appliances, drills, GMDSS radio and navigation safety, focused on what matters day-to-day on board.
        </p>
        <div className="sl-warn">
          ⚠ <b>General guidance only.</b> Specific equipment and manning requirements vary by ship type, size, keel-laying date, and trading area. Always confirm against your vessel&apos;s actual certificates and Safety Management System.
        </div>

        <div className="sl-tabs">
          {CHAPTERS.map((c) => (
            <button key={c.key} className={`sl-tab ${tab === c.key ? 'active' : ''}`} onClick={() => setTab(c.key)}>{c.name}</button>
          ))}
        </div>

        {active.items.map((item) => (
          <div className="sl-item" key={item.title}>
            <div className="sl-item-title">{item.title}</div>
            {item.body.map((p, i) => <p className="sl-p" key={i}>{p}</p>)}
          </div>
        ))}

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
