'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { VISA_COUNTRIES, REQ_META, type Requirement } from '@/lib/visa-data';

function ReqPill({ label, req }: { label: string; req: Requirement }) {
  const m = REQ_META[req];
  return (
    <div style={{ background: 'rgba(255,255,255,.04)', border: `1px solid ${m.color}40`, borderRadius: 8, padding: '8px 10px', textAlign: 'center', flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 9.5, letterSpacing: '.05em', textTransform: 'uppercase', color: '#6b83a0', fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: m.color, lineHeight: 1.2 }}>{m.label}</div>
    </div>
  );
}

export default function VisaPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return VISA_COUNTRIES;
    return VISA_COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }, [query]);

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .vz-wrap{max-width:680px;margin:0 auto;padding:28px 18px 60px}
        .vz-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .vz-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .vz-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .vz-warn{background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#fca5a5;line-height:1.5;margin-bottom:16px}
        .vz-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:16px 18px;margin-bottom:12px}
        .vz-legend{display:flex;gap:12px;flex-wrap:wrap;font-size:11px;color:#a8bdd2;margin-bottom:16px}
        .vz-inp{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:10px 12px;color:#eef4fa;font-size:13px;font-family:inherit}
        .vz-inp:focus{outline:none;border-color:#fbbf24}
        .vz-country-head{display:flex;justify-content:space-between;align-items:center;cursor:pointer}
        .vz-name{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:700;font-size:15px}
        .vz-pills{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
        .vz-detail{margin-top:12px;padding-top:12px;border-top:1px dashed rgba(255,255,255,.1)}
        .vz-doc-tag{font-size:10.5px;background:rgba(255,255,255,.04);color:#a8bdd2;padding:3px 9px;border-radius:6px;border:1px solid rgba(255,255,255,.08);margin-right:5px;margin-bottom:5px;display:inline-block}
        .vz-notes{font-size:12px;color:#a8bdd2;line-height:1.6;margin-top:8px}
        .vz-basics{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px 18px;margin-top:16px}
        .vz-basics li{font-size:11.5px;color:#a8bdd2;line-height:1.7;margin-bottom:4px}
        @media(max-width:560px){ .vz-pills{flex-direction:column} }
      `}</style>

      <div className="vz-wrap">
        <Link href="/tools" className="vz-back">← All Tools</Link>
        <div className="vz-title">Visa Requirements</div>
        <p className="vz-sub">
          Seafarer entry guidance for major maritime countries — shore leave, sign-on/off and airport transit. General reference only.
        </p>
        <div className="vz-warn">
          ⚠ <b>General guidance only.</b> Visa requirements depend on the seafarer&apos;s nationality, the vessel&apos;s flag, and purpose of entry, and change frequently. Always confirm with the local agent and the relevant embassy/consulate before any crew change, shore leave or transit.
        </div>

        <div className="vz-legend">
          {(Object.keys(REQ_META) as Requirement[]).map((k) => (
            <span key={k}><b style={{ color: REQ_META[k].color }}>●</b> {REQ_META[k].label}</span>
          ))}
        </div>

        <input className="vz-inp" style={{ marginBottom: 16 }} placeholder="Search country — e.g. United States, Schengen, UAE..." value={query} onChange={(e) => setQuery(e.target.value)} />

        {filtered.map((c) => {
          const open = selected === c.code;
          return (
            <div key={c.code} className="vz-card" style={{ borderColor: open ? 'rgba(251,191,36,.4)' : 'rgba(255,255,255,.08)' }}>
              <div className="vz-country-head" onClick={() => setSelected(open ? null : c.code)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{c.flag}</span>
                  <span className="vz-name">{c.name}</span>
                </div>
                <span style={{ color: '#fbbf24', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
              </div>
              <div className="vz-pills">
                <ReqPill label="Shore Leave" req={c.shoreLeave} />
                <ReqPill label="Sign On/Off" req={c.signOnOff} />
                <ReqPill label="Airport Transit" req={c.transit} />
              </div>
              {open && (
                <div className="vz-detail">
                  <div style={{ fontSize: 10, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700, marginBottom: 6 }}>Typical Documents</div>
                  <div>{c.docs.map((d) => <span key={d} className="vz-doc-tag">{d}</span>)}</div>
                  <div style={{ fontSize: 10, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700, marginTop: 10, marginBottom: 4 }}>Notes</div>
                  <p className="vz-notes">{c.notes}</p>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && <div className="vz-card" style={{ textAlign: 'center', color: '#6b83a0' }}>No country matches your search.</div>}

        <div className="vz-basics">
          <div style={{ fontSize: 12, fontWeight: 800, color: '#fbbf24', marginBottom: 10 }}>📖 Seafarer Entry Basics</div>
          <ul style={{ paddingLeft: 18 }}>
            <li>The IMO FAL Convention encourages shore leave for seafarers regardless of nationality, but each state applies its own immigration rules.</li>
            <li>A valid <b style={{ color: '#eef4fa' }}>Seafarer&apos;s Identity Document / discharge book</b> plus passport is the baseline everywhere.</li>
            <li>&quot;Shore leave&quot; is usually easier than &quot;sign-on/off&quot; or &quot;airport transit&quot;.</li>
            <li>The US (C1/D) and Australia (MCV) require a visa in advance for essentially all foreign crew — plan early.</li>
            <li>This is orientation only. The agent and the embassy/consulate give the binding answer for a specific nationality and date.</li>
          </ul>
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
