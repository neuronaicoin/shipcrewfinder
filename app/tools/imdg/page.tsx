'use client';
import { useState } from 'react';
import Link from 'next/link';

type SectionKey = 'classes' | 'docs' | 'segregation' | 'emergency';

interface ClassItem { num: string; name: string; sub?: string; desc: string; }

const CLASSES: ClassItem[] = [
  { num: '1', name: 'Explosives', desc: 'Substances and articles with a risk of mass explosion, projection, or fire — subdivided into divisions 1.1 through 1.6 by hazard type.' },
  { num: '2.1', name: 'Flammable Gases', desc: 'Gases that ignite readily on contact with an ignition source, e.g. acetylene, LPG.' },
  { num: '2.2', name: 'Non-Flammable, Non-Toxic Gases', desc: 'Includes compressed, liquefied or refrigerated liquefied gases that are not flammable or toxic, e.g. nitrogen, carbon dioxide.' },
  { num: '2.3', name: 'Toxic Gases', desc: 'Gases known to be toxic or corrosive to humans, requiring particular care in handling and ventilation.' },
  { num: '3', name: 'Flammable Liquids', desc: 'Liquids with a flash point low enough to be readily ignitable, e.g. petrol, many solvents, some paints.' },
  { num: '4.1', name: 'Flammable Solids', desc: 'Solids readily combustible, or which may cause fire through friction.' },
  { num: '4.2', name: 'Spontaneously Combustible', desc: 'Substances liable to spontaneous heating and ignition under normal transport conditions.' },
  { num: '4.3', name: 'Dangerous When Wet', desc: 'Substances that emit flammable gases when in contact with water — must be kept strictly dry.' },
  { num: '5.1', name: 'Oxidizing Substances', desc: 'Substances that may cause or contribute to combustion of other material by yielding oxygen.' },
  { num: '5.2', name: 'Organic Peroxides', desc: 'Thermally unstable substances that may undergo exothermic decomposition — often require temperature control.' },
  { num: '6.1', name: 'Toxic Substances', desc: 'Substances liable to cause death or serious injury if swallowed, inhaled, or by skin contact.' },
  { num: '6.2', name: 'Infectious Substances', desc: 'Substances known or reasonably believed to contain pathogens.' },
  { num: '7', name: 'Radioactive Material', desc: 'Material with radionuclide concentrations exceeding defined limits — requires specific packaging and handling per Class 7 rules.' },
  { num: '8', name: 'Corrosive Substances', desc: 'Substances that cause severe damage to living tissue, or materially damage other freight or the ship itself, e.g. acids, alkalis.' },
  { num: '9', name: 'Miscellaneous Dangerous Substances', desc: 'Substances presenting a danger not covered by other classes — includes environmentally hazardous substances (marine pollutants), lithium batteries, dry ice, and more.' },
];

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'classes', label: 'Hazard Classes' },
  { key: 'docs', label: 'Documentation' },
  { key: 'segregation', label: 'Segregation' },
  { key: 'emergency', label: 'Emergency Response' },
];

export default function ImdgPage() {
  const [tab, setTab] = useState<SectionKey>('classes');

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .dg-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .dg-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .dg-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .dg-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .dg-warn{background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#fca5a5;line-height:1.5;margin-bottom:16px}
        .dg-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
        .dg-tab{background:transparent;color:#6b83a0;border:1px solid rgba(255,255,255,.12);padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;border-radius:9px;font-family:inherit}
        .dg-tab.active{background:#fbbf24;color:#0b0e13;border-color:#fbbf24}
        .dg-class{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px 14px;margin-bottom:8px;display:flex;gap:12px;align-items:flex-start}
        .dg-class-num{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;color:#fbbf24;font-size:14px;min-width:32px}
        .dg-class-name{font-weight:700;font-size:13px;margin-bottom:2px}
        .dg-class-desc{font-size:12px;color:#a8bdd2;line-height:1.5}
        .dg-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:12px}
        .dg-h{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:14px;color:#fbbf24;margin-bottom:8px}
        .dg-p{font-size:12.5px;color:#a8bdd2;line-height:1.7;margin-bottom:8px}
      `}</style>

      <div className="dg-wrap">
        <Link href="/tools" className="dg-back">← All Tools</Link>
        <div className="dg-title">IMDG Code / Dangerous Goods Guide</div>
        <p className="dg-sub">
          The 9 UN hazard classes, documentation requirements, segregation basics, and emergency response references for dangerous goods at sea.
        </p>
        <div className="dg-warn">
          ⚠ <b>Reference only — not a substitute for the IMDG Code itself.</b> Always consult the current IMDG Code, the specific Dangerous Goods List entry, EmS Guide and MFAG for the exact substance you are handling, and follow your company&apos;s SMS procedures.
        </div>

        <div className="dg-tabs">
          {SECTIONS.map((s) => (
            <button key={s.key} className={`dg-tab ${tab === s.key ? 'active' : ''}`} onClick={() => setTab(s.key)}>{s.label}</button>
          ))}
        </div>

        {tab === 'classes' && (
          <>
            {CLASSES.map((c) => (
              <div className="dg-class" key={c.num}>
                <span className="dg-class-num">{c.num}</span>
                <div>
                  <div className="dg-class-name">{c.name}</div>
                  <div className="dg-class-desc">{c.desc}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'docs' && (
          <div className="dg-card">
            <div className="dg-h">Documentation Requirements</div>
            <p className="dg-p"><b style={{ color: '#eef4fa' }}>Dangerous Goods Declaration:</b> The shipper must provide a signed declaration for each dangerous goods shipment, stating the UN number, proper shipping name, class, packing group, and quantity.</p>
            <p className="dg-p"><b style={{ color: '#eef4fa' }}>Container Packing Certificate:</b> For containerized dangerous goods, a packing certificate confirms the container was properly packed and secured, and that incompatible goods were not packed together.</p>
            <p className="dg-p"><b style={{ color: '#eef4fa' }}>Dangerous Goods Manifest:</b> The vessel must carry a special list or manifest of all dangerous goods on board, or a detailed stowage plan identifying their location by class and UN number.</p>
            <p className="dg-p"><b style={{ color: '#eef4fa' }}>Marine Pollutant Marking:</b> Substances classified as environmentally hazardous (marine pollutants) require specific marking, in addition to any primary hazard class marking.</p>
          </div>
        )}

        {tab === 'segregation' && (
          <div className="dg-card">
            <div className="dg-h">Segregation Basics</div>
            <p className="dg-p">The IMDG Code includes a segregation table specifying minimum separation requirements between different classes of dangerous goods — some combinations must be kept "away from" each other, others "separated from", and some require complete isolation.</p>
            <p className="dg-p">Common segregation concerns include keeping oxidizing substances (Class 5.1) away from flammables, and acids away from alkalis within Class 8 — but the specific requirement always depends on the exact substances and packing groups involved.</p>
            <p className="dg-p">Segregation requirements apply both within a single hold/container and between different stowage locations on board — always consult the segregation table for the specific classes you are carrying together.</p>
          </div>
        )}

        {tab === 'emergency' && (
          <div className="dg-card">
            <div className="dg-h">Emergency Response References</div>
            <p className="dg-p"><b style={{ color: '#eef4fa' }}>EmS (Emergency Schedules):</b> Each dangerous goods entry references specific Fire (F) and Spillage (S) schedules, giving guidance on how to respond to a fire or spill involving that substance.</p>
            <p className="dg-p"><b style={{ color: '#eef4fa' }}>MFAG (Medical First Aid Guide):</b> Provides first-aid guidance for injuries and exposure involving dangerous goods, referenced by substance where applicable.</p>
            <p className="dg-p">Both the EmS Guide and MFAG should be readily available on board wherever dangerous goods are carried — know where they are kept before you need them, not after.</p>
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
