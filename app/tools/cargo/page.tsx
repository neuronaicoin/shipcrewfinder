'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CARGOES, CARGO_CATEGORIES, type Cargo, type ImsbcGroup } from '@/lib/cargo-data';

function groupBadge(group: ImsbcGroup): { label: string; color: string; bg: string } {
  switch (group) {
    case 'A': return { label: 'A', color: '#fca5a5', bg: 'rgba(248,113,113,.14)' };
    case 'B': return { label: 'B', color: '#e8b85a', bg: 'rgba(232,184,90,.14)' };
    case 'A&B': return { label: 'A&B', color: '#fca5a5', bg: 'rgba(248,113,113,.14)' };
    case 'C': return { label: 'C', color: '#34d399', bg: 'rgba(52,211,153,.14)' };
    default: return { label: 'GEN', color: '#5aa6e8', bg: 'rgba(90,166,232,.14)' };
  }
}

export default function CargoPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [selected, setSelected] = useState<Cargo | null>(null);

  const [calcMode, setCalcMode] = useState<'qty' | 'vol'>('qty');
  const [calcSf, setCalcSf] = useState('');
  const [calcQty, setCalcQty] = useState('');
  const [calcVol, setCalcVol] = useState('');
  const [brokenStowage, setBrokenStowage] = useState('0');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CARGOES.filter((c) => {
      if (category !== 'all' && c.category !== category) return false;
      if (groupFilter !== 'all' && c.group !== groupFilter) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.hazards.some((h) => h.toLowerCase().includes(q));
    });
  }, [query, category, groupFilter]);

  const calcResult = useMemo(() => {
    const sf = parseFloat(calcSf) || 0;
    const bs = (parseFloat(brokenStowage) || 0) / 100;
    if (sf <= 0) return null;
    if (calcMode === 'qty') {
      const qty = parseFloat(calcQty) || 0;
      return { kind: 'vol' as const, value: qty * sf * (1 + bs) };
    } else {
      const vol = parseFloat(calcVol) || 0;
      const usableVol = vol / (1 + bs);
      return { kind: 'qty' as const, value: sf > 0 ? usableVol / sf : 0 };
    }
  }, [calcMode, calcSf, calcQty, calcVol, brokenStowage]);

  function useCargoInCalc(c: Cargo) {
    setCalcSf(((c.sfMin + c.sfMax) / 2).toFixed(3));
    setSelected(c);
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .cg-wrap{max-width:760px;margin:0 auto;padding:28px 18px 60px}
        .cg-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .cg-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .cg-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:18px}
        .cg-legend{display:flex;gap:12px;flex-wrap:wrap;font-size:11.5px;color:#a8bdd2;background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px 14px;margin-bottom:14px}
        .cg-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:14px}
        .cg-label{font-size:11px;color:#6b83a0;text-transform:uppercase;letter-spacing:.06em;font-weight:700;display:block;margin-bottom:10px}
        .cg-field-label{font-size:11px;color:#6b83a0;display:block;margin-bottom:4px}
        .cg-inp,.cg-sel{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:9px 11px;color:#eef4fa;font-size:13px;font-family:inherit}
        .cg-sel option{background:#141845;color:#eef4fa}
        .cg-inp:focus,.cg-sel:focus{outline:none;border-color:#fbbf24}
        .cg-row2{display:grid;grid-template-columns:2fr 1fr;gap:10px;margin-bottom:10px}
        .cg-item{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px 16px;margin-bottom:10px;cursor:pointer}
        .cg-item:hover{border-color:rgba(251,191,36,.35)}
        .cg-item-name{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:700;font-size:13.5px}
        .cg-badge{font-size:10px;font-weight:800;padding:3px 8px;border-radius:6px;margin-left:8px}
        .cg-sf{font-size:12px;color:#a8bdd2;margin-top:4px}
        .cg-detail{background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.25);border-radius:14px;padding:16px;margin-bottom:14px}
        .cg-detail-row{font-size:12.5px;margin-bottom:8px;line-height:1.5}
        .cg-detail-row b{color:#fbbf24}
        .cg-tabs{display:flex;gap:8px;margin-bottom:12px}
        .cg-tab{background:transparent;color:#6b83a0;border:1px solid rgba(255,255,255,.12);padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;border-radius:9px;font-family:inherit}
        .cg-tab.active{background:#fbbf24;color:#0b0e13;border-color:#fbbf24}
        .cg-result{background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.35);border-radius:12px;padding:16px;text-align:center;margin-top:10px}
        .cg-result-val{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;color:#34d399}
        @media(max-width:560px){ .cg-row2{grid-template-columns:1fr} }
      `}</style>

      <div className="cg-wrap">
        <Link href="/tools" className="cg-back">← All Tools</Link>
        <div className="cg-title">Cargo Database</div>
        <p className="cg-sub">
          Stowage factors, IMSBC groups, hazards and carriage notes for {CARGOES.length}+ bulk and break-bulk cargoes, plus a hold-volume calculator. Always verify against the shipper&apos;s declaration.
        </p>

        <div className="cg-legend">
          <b style={{ color: '#fbbf24' }}>IMSBC:</b>
          <span><b style={{ color: '#fca5a5' }}>A</b> may liquefy</span>
          <span><b style={{ color: '#e8b85a' }}>B</b> chemical hazard</span>
          <span><b style={{ color: '#34d399' }}>C</b> no special hazard</span>
          <span><b style={{ color: '#5aa6e8' }}>GEN</b> break bulk</span>
        </div>

        <div className="cg-card">
          <span className="cg-label">Stowage calculator</span>
          <div className="cg-tabs">
            <button className={`cg-tab ${calcMode === 'qty' ? 'active' : ''}`} onClick={() => setCalcMode('qty')}>Qty → Volume</button>
            <button className={`cg-tab ${calcMode === 'vol' ? 'active' : ''}`} onClick={() => setCalcMode('vol')}>Volume → Qty</button>
          </div>
          <div className="cg-row2">
            <div>
              <span className="cg-field-label">Stowage factor (m³/MT)</span>
              <input className="cg-inp" value={calcSf} onChange={(e) => setCalcSf(e.target.value)} inputMode="decimal" placeholder="e.g. 0.42" />
            </div>
            <div>
              <span className="cg-field-label">Broken stowage %</span>
              <input className="cg-inp" value={brokenStowage} onChange={(e) => setBrokenStowage(e.target.value)} inputMode="decimal" />
            </div>
          </div>
          {calcMode === 'qty' ? (
            <div>
              <span className="cg-field-label">Cargo quantity (MT)</span>
              <input className="cg-inp" value={calcQty} onChange={(e) => setCalcQty(e.target.value)} inputMode="decimal" />
            </div>
          ) : (
            <div>
              <span className="cg-field-label">Available hold volume (m³)</span>
              <input className="cg-inp" value={calcVol} onChange={(e) => setCalcVol(e.target.value)} inputMode="decimal" />
            </div>
          )}
          {calcResult && (
            <div className="cg-result">
              <div className="cg-result-val">{calcResult.value.toFixed(1)} {calcResult.kind === 'vol' ? 'm³' : 'MT'}</div>
            </div>
          )}
        </div>

        <div className="cg-card">
          <span className="cg-label">Search &amp; filter</span>
          <input className="cg-inp" style={{ marginBottom: 10 }} placeholder="e.g. iron ore, nickel, liquefaction..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="cg-row2" style={{ marginBottom: 0 }}>
            <select className="cg-sel" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All categories</option>
              {CARGO_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="cg-sel" value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
              <option value="all">All groups</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="A&B">A&amp;B</option>
              <option value="C">C</option>
              <option value="GENERAL">General</option>
            </select>
          </div>
        </div>

        {selected && (
          <div className="cg-detail">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: "'Bricolage Grotesque',system-ui,sans-serif", fontWeight: 800 }}>{selected.name}</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#6b83a0', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="cg-detail-row"><b>SF range:</b> {selected.sfMin}–{selected.sfMax} m³/MT</div>
            {selected.angleOfRepose && <div className="cg-detail-row"><b>Angle of repose:</b> {selected.angleOfRepose}°</div>}
            {selected.unNo && <div className="cg-detail-row"><b>UN No:</b> {selected.unNo}</div>}
            <div className="cg-detail-row"><b>Hazards:</b> {selected.hazards.join(', ')}</div>
            <div className="cg-detail-row"><b>Care:</b> {selected.care}</div>
          </div>
        )}

        {filtered.map((c) => {
          const badge = groupBadge(c.group);
          return (
            <div key={c.name} className="cg-item" onClick={() => useCargoInCalc(c)}>
              <span className="cg-item-name">{c.name}</span>
              <span className="cg-badge" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
              <div className="cg-sf">SF {c.sfMin}–{c.sfMax} m³/MT · {c.category}</div>
            </div>
          );
        })}

        <div style={{ marginTop: 24, background: 'linear-gradient(160deg,rgba(251,191,36,.08),#050716)', border: '1.5px solid rgba(251,191,36,.2)', borderRadius: 16, padding: 20 }}>
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
