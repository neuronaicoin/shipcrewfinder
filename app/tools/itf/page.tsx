'use client';
import { useState } from 'react';
import Link from 'next/link';

type SectionKey = 'what' | 'agreements' | 'inspectors' | 'scenarios' | 'contact';

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'what', label: 'What Is the ITF' },
  { key: 'agreements', label: 'ITF Agreements Explained' },
  { key: 'inspectors', label: 'ITF Inspectors' },
  { key: 'scenarios', label: 'Common Scenarios' },
  { key: 'contact', label: 'Getting Help' },
];

export default function ItfPage() {
  const [tab, setTab] = useState<SectionKey>('what');

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .iz-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .iz-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .iz-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .iz-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .iz-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .iz-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
        .iz-tab{background:transparent;color:#6b83a0;border:1px solid rgba(255,255,255,.12);padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;border-radius:9px;font-family:inherit}
        .iz-tab.active{background:#fbbf24;color:#0b0e13;border-color:#fbbf24}
        .iz-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:12px}
        .iz-h{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:14px;color:#fbbf24;margin-bottom:8px}
        .iz-p{font-size:12.5px;color:#a8bdd2;line-height:1.7;margin-bottom:8px}
        .iz-list{padding-left:18px;margin-bottom:0}
        .iz-list li{font-size:12.5px;color:#a8bdd2;line-height:1.7;margin-bottom:4px}
        .iz-contact-card{background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.25);border-radius:14px;padding:16px;margin-bottom:10px}
      `}</style>

      <div className="iz-wrap">
        <Link href="/tools" className="iz-back">← All Tools</Link>
        <div className="iz-title">ITF Guide</div>
        <p className="iz-sub">
          What the International Transport Workers&apos; Federation actually does for seafarers, how ITF agreements work, and how to get help.
        </p>
        <div className="iz-warn">
          ⚠ <b>General guidance.</b> ITF structures, regional contacts and campaign focus areas evolve over time — always verify current contact details directly via the ITF before relying on specifics for an urgent situation.
        </div>

        <div className="iz-tabs">
          {SECTIONS.map((s) => (
            <button key={s.key} className={`iz-tab ${tab === s.key ? 'active' : ''}`} onClick={() => setTab(s.key)}>{s.label}</button>
          ))}
        </div>

        {tab === 'what' && (
          <div className="iz-card">
            <div className="iz-h">What Is the ITF</div>
            <p className="iz-p">The International Transport Workers&apos; Federation (ITF) is a global federation of trade unions representing workers across all transport sectors, including seafarers. It is not a government body or a flag state authority — it is a union federation that advocates for fair wages, safe conditions and decent treatment of transport workers worldwide.</p>
            <p className="iz-p">For seafarers specifically, the ITF is best known for two things: negotiating minimum-standard employment agreements (ITF agreements) that shipowners can sign onto, and running a global network of inspectors who check vessels in port for compliance and can assist individual seafarers with disputes.</p>
            <p className="iz-p">The ITF has historically focused significant attention on vessels registered under &quot;flags of convenience&quot; (FOC) — flag states seen as offering lighter regulatory oversight — as these ships have sometimes seen a higher incidence of substandard conditions.</p>
          </div>
        )}

        {tab === 'agreements' && (
          <div className="iz-card">
            <div className="iz-h">ITF Agreements Explained</div>
            <p className="iz-p">An &quot;ITF agreement&quot; (sometimes referred to informally as a &quot;Blue Certificate&quot; ship) is a collective bargaining agreement between a shipowner and a seafarers&apos; union that meets ITF minimum standards for wages and conditions.</p>
            <p className="iz-p">Being on an ITF-covered ship generally means:</p>
            <ul className="iz-list">
              <li>Your wages meet or exceed ITF minimum benchmark rates for your rank</li>
              <li>Your employment terms have been reviewed against ITF standards</li>
              <li>ITF inspectors can verify compliance when the ship calls at a port with an ITF inspector present</li>
            </ul>
            <p className="iz-p" style={{ marginTop: 8 }}><b style={{ color: '#eef4fa' }}>Important:</b> not every ship has an ITF agreement — coverage depends on whether the shipowner has signed one, often influenced by flag state and trade route. ITF inspectors can still board and inspect any vessel in port, whether or not it holds an ITF agreement, particularly if there&apos;s a specific complaint or concern.</p>
          </div>
        )}

        {tab === 'inspectors' && (
          <div className="iz-card">
            <div className="iz-h">ITF Inspectors</div>
            <p className="iz-p">ITF inspectors are based at major ports worldwide and are typically former seafarers or maritime professionals employed by affiliated unions to represent ITF in that region.</p>
            <p className="iz-p">When a ship calls at a port with an active ITF inspector, they may board to:</p>
            <ul className="iz-list">
              <li>Check wages actually paid against the seafarer&apos;s employment agreement and, where applicable, the ITF agreement</li>
              <li>Speak confidentially with crew about conditions on board</li>
              <li>Investigate specific complaints raised by crew, directly or through a union</li>
              <li>Assist with cases of unpaid wages, abandonment, or contract disputes</li>
            </ul>
            <p className="iz-p" style={{ marginTop: 8 }}>Speaking with an ITF inspector does not require your ship to have an ITF agreement — if you have a genuine concern, you can request contact with the local ITF inspector when in port.</p>
          </div>
        )}

        {tab === 'scenarios' && (
          <div className="iz-card">
            <div className="iz-h">Common Scenarios</div>
            <p className="iz-p"><b style={{ color: '#eef4fa' }}>Unpaid or short-paid wages:</b> The ITF can help verify what you should be paid, contact the employer, and if necessary support a formal wage claim, particularly on ITF-covered vessels.</p>
            <p className="iz-p"><b style={{ color: '#eef4fa' }}>Abandonment:</b> If a crew is abandoned — left without wages, provisions, or means of repatriation, often due to shipowner insolvency — the ITF is one of the key organizations that can help, alongside the flag state, port state and the IMO/ILO joint database of abandonment cases.</p>
            <p className="iz-p"><b style={{ color: '#eef4fa' }}>Contract disputes:</b> If your actual working conditions don&apos;t match your signed SEA, or you believe your rights under MLC 2006 are being violated, the ITF can advise and, where appropriate, intervene.</p>
            <p className="iz-p"><b style={{ color: '#eef4fa' }}>Recruitment fee issues:</b> Manning agencies charging seafarers a fee to secure employment is a violation of MLC 2006 — the ITF is a useful point of contact if you believe this has happened to you.</p>
          </div>
        )}

        {tab === 'contact' && (
          <div>
            <div className="iz-contact-card">
              <div style={{ fontWeight: 800, color: '#34d399', marginBottom: 6, fontSize: 13 }}>In Port</div>
              <p className="iz-p" style={{ marginBottom: 0 }}>Ask your agent or search for the ITF inspector covering the port you&apos;re calling at — most major ports have one. Many inspectors can be contacted discreetly, without going through the ship&apos;s management.</p>
            </div>
            <div className="iz-contact-card">
              <div style={{ fontWeight: 800, color: '#34d399', marginBottom: 6, fontSize: 13 }}>Online</div>
              <p className="iz-p" style={{ marginBottom: 0 }}>The ITF maintains a public website with regional office contacts and seafarer-specific resources — search &quot;ITF seafarers&quot; for the current official site and contact directory.</p>
            </div>
            <div className="iz-contact-card">
              <div style={{ fontWeight: 800, color: '#34d399', marginBottom: 6, fontSize: 13 }}>Before You Contact</div>
              <p className="iz-p" style={{ marginBottom: 0 }}>Keep copies of your SEA, wage slips, and any relevant correspondence — having documentation ready significantly speeds up how quickly the ITF or an inspector can help with your specific case.</p>
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
