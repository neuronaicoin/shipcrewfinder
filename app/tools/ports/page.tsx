'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { DIRECTORY_PORTS, REGIONS, type Port, type Region } from '@/lib/port-directory';

const PILOT_META: Record<Port['pilotage'], { label: string; color: string }> = {
  compulsory: { label: 'Compulsory', color: '#fca5a5' },
  recommended: { label: 'Recommended', color: '#e8b85a' },
  optional: { label: 'Optional', color: '#34d399' },
};

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '8px 10px' }}>
      <div style={{ fontSize: 9.5, color: '#6b83a0', letterSpacing: '.05em', textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 12.5, color: '#eef4fa', fontWeight: 600, marginTop: 2 }}>{value}</div>
    </div>
  );
}

export default function PortsPage() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<'all' | Region>('all');
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DIRECTORY_PORTS
      .filter((p) => region === 'all' || p.region === region)
      .filter((p) => !q || [p.name, p.country, p.locode].some((f) => f.toLowerCase().includes(q)))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query, region]);

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .pd-wrap{max-width:680px;margin:0 auto;padding:28px 18px 60px}
        .pd-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .pd-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .pd-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .pd-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .pd-inp{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:10px 12px;color:#eef4fa;font-size:13px;font-family:inherit;margin-bottom:10px}
        .pd-inp:focus{outline:none;border-color:#fbbf24}
        .pd-chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
        .pd-chip{padding:5px 12px;background:transparent;color:#6b83a0;border:1px solid rgba(255,255,255,.14);font-size:11px;font-weight:700;cursor:pointer;border-radius:8px;font-family:inherit}
        .pd-chip.active{background:#fbbf24;color:#0b0e13;border-color:#fbbf24}
        .pd-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:16px 18px;margin-bottom:12px}
        .pd-head{display:flex;justify-content:space-between;align-items:center;cursor:pointer;gap:10px}
        .pd-name{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:700;font-size:15px}
        .pd-meta{font-size:11px;color:#6b83a0;margin-top:2px}
        .pd-quickfacts{display:flex;gap:12px;margin-top:10px;flex-wrap:wrap;font-size:11.5px;color:#a8bdd2}
        .pd-detail{margin-top:12px;padding-top:12px;border-top:1px dashed rgba(255,255,255,.1)}
        .pd-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
        .pd-tag{font-size:10.5px;background:rgba(255,255,255,.04);color:#a8bdd2;padding:3px 9px;border-radius:6px;border:1px solid rgba(255,255,255,.08);margin-right:5px;margin-bottom:5px;display:inline-block}
        .pd-notes{font-size:12px;color:#a8bdd2;line-height:1.6;margin-top:8px;margin-bottom:12px}
        .pd-linkbtn{display:inline-block;background:rgba(90,166,232,.08);color:#7db8ea;border:1px solid rgba(90,166,232,.3);padding:6px 11px;border-radius:8px;font-size:11px;font-weight:700;text-decoration:none;margin-right:6px;margin-bottom:6px}
        .pd-goldlink{display:inline-block;background:rgba(251,191,36,.1);color:#fbbf24;border:1px solid rgba(251,191,36,.3);padding:6px 11px;border-radius:8px;font-size:11px;font-weight:700;text-decoration:none;margin-right:6px}
        @media(max-width:560px){ .pd-grid{grid-template-columns:1fr} }
      `}</style>

      <div className="pd-wrap">
        <Link href="/tools" className="pd-back">← All Tools</Link>
        <div className="pd-title">Port Database</div>
        <p className="pd-sub">
          Quick reference for 26 major hub ports — draft, terminals, pilotage and VHF, plus direct links to official PSC inspection history.
        </p>
        <div className="pd-warn">
          ⚠ <b>Reference only.</b> Drafts, restrictions, VHF channels and working hours change. Confirm against current Notices to Mariners, the port authority, and your agent before arrival.
        </div>

        <input className="pd-inp" placeholder="Search — e.g. Singapore, Rotterdam, SGSIN..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="pd-chips">
          <button className={`pd-chip ${region === 'all' ? 'active' : ''}`} onClick={() => setRegion('all')}>All regions</button>
          {REGIONS.map((r) => <button key={r} className={`pd-chip ${region === r ? 'active' : ''}`} onClick={() => setRegion(r)}>{r}</button>)}
        </div>

        {filtered.map((p) => {
          const isOpen = open === p.id;
          const pm = PILOT_META[p.pilotage];
          return (
            <div key={p.id} className="pd-card" style={{ borderColor: isOpen ? 'rgba(251,191,36,.4)' : 'rgba(255,255,255,.08)' }}>
              <div className="pd-head" onClick={() => setOpen(isOpen ? null : p.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <span style={{ fontSize: 20 }}>{p.flag}</span>
                  <div>
                    <div className="pd-name">{p.name}</div>
                    <div className="pd-meta">{p.country} · {p.locode} · {p.region}</div>
                  </div>
                </div>
                <span style={{ color: '#fbbf24', fontSize: 12 }}>{isOpen ? '▲' : '▼'}</span>
              </div>

              <div className="pd-quickfacts">
                {p.maxDraftM > 0 && <span>🌊 Max draft <b style={{ color: '#eef4fa' }}>{p.maxDraftM}m</b></span>}
                {p.maxLoaM > 0 && <span>📏 LOA <b style={{ color: '#eef4fa' }}>{p.maxLoaM}m</b></span>}
                <span>🧭 Pilotage <b style={{ color: pm.color }}>{pm.label}</b></span>
                <span>📻 {p.vhf}</span>
              </div>

              {isOpen && (
                <div className="pd-detail">
                  <div className="pd-grid">
                    <Fact label="Coordinates" value={`${p.lat.toFixed(3)}, ${p.lon.toFixed(3)}`} />
                    <Fact label="Timezone" value={p.timezone} />
                    <Fact label="Working hours" value={p.working} />
                    <Fact label="Pilotage" value={pm.label} />
                  </div>
                  <div style={{ fontSize: 10, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700, marginBottom: 6 }}>Terminals</div>
                  <div style={{ marginBottom: 10 }}>{p.terminals.map((t) => <span key={t} className="pd-tag">{t}</span>)}</div>
                  <p className="pd-notes">{p.notes}</p>

                  <div style={{ fontSize: 10, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700, marginBottom: 6 }}>PSC Inspection History (official sources)</div>
                  <div style={{ marginBottom: 10 }}>
                    <a href="https://www.equasis.org/" target="_blank" rel="noopener noreferrer" className="pd-linkbtn">Equasis ↗</a>
                    <a href="https://parismou.org/inspection-search/inspection-search" target="_blank" rel="noopener noreferrer" className="pd-linkbtn">Paris MoU ↗</a>
                    <a href="https://apcis.tmou.org/public/" target="_blank" rel="noopener noreferrer" className="pd-linkbtn">Tokyo MoU (APCIS) ↗</a>
                    <a href="https://gisis.imo.org/" target="_blank" rel="noopener noreferrer" className="pd-linkbtn">IMO GISIS ↗</a>
                  </div>

                  <div>
                    <Link href="/tools/visa" className="pd-goldlink">🛂 Visa Requirements →</Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && <div className="pd-card" style={{ textAlign: 'center', color: '#6b83a0' }}>No port matches your search.</div>}

        <div style={{ marginTop: 8, background: 'linear-gradient(160deg,rgba(251,191,36,.08),#050716)', border: '1.5px solid rgba(251,191,36,.2)', borderRadius: 16, padding: 20 }}>
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
