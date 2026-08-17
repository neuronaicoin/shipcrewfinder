'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  DEFICIENCIES,
  DEFICIENCY_CATEGORIES,
  MOUS,
  PLATFORMS,
  CICS,
  ACTION_CODES,
  searchDeficiencies,
  type DeficiencyCode,
} from '@/lib/psc-data';

const RISK_COLORS: Record<string, string> = { low: '#6b83a0', medium: '#e89c5a', high: '#fca5a5', very_high: '#f87171' };
const RISK_LABELS: Record<string, string> = { low: 'Low', medium: 'Medium', high: 'High', very_high: 'Very High' };

type Tab = 'codes' | 'mous' | 'cics' | 'actions';

export default function PSCPage() {
  const [tab, setTab] = useState<Tab>('codes');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedDef, setSelectedDef] = useState<DeficiencyCode | null>(null);

  const filtered = useMemo(() => {
    let results = search ? searchDeficiencies(search) : DEFICIENCIES;
    if (filterCategory !== 'all') results = results.filter((d) => d.category === filterCategory);
    if (filterRisk !== 'all') results = results.filter((d) => d.detentionRisk === filterRisk);
    return results.slice(0, 50);
  }, [search, filterCategory, filterRisk]);

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .pz-wrap{max-width:760px;margin:0 auto;padding:28px 18px 60px}
        .pz-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .pz-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .pz-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:20px}
        .pz-tabs{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap}
        .pz-tab{background:transparent;color:#6b83a0;border:1px solid rgba(255,255,255,.12);padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;border-radius:9px;font-family:inherit}
        .pz-tab.active{background:#fbbf24;color:#0b0e13;border-color:#fbbf24}
        .pz-inp,.pz-sel{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:10px 12px;color:#eef4fa;font-size:13px;font-family:inherit}
        .pz-inp:focus,.pz-sel:focus{outline:none;border-color:#fbbf24}
        .pz-filters{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
        .pz-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px 16px;margin-bottom:10px;cursor:pointer;transition:.15s}
        .pz-card:hover{border-color:rgba(251,191,36,.35)}
        .pz-code{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:13px;color:#fbbf24}
        .pz-risk-badge{font-size:9.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:3px 8px;border-radius:6px;margin-left:8px}
        .pz-desc{font-size:13px;margin-top:6px;line-height:1.4}
        .pz-meta{font-size:11px;color:#6b83a0;margin-top:4px}
        .pz-detail{background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.25);border-radius:14px;padding:16px;margin-bottom:16px}
        .pz-detail-row{font-size:12.5px;margin-bottom:8px;line-height:1.5}
        .pz-detail-row b{color:#fbbf24}
        .pz-mou-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px;margin-bottom:10px}
        .pz-mou-name{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:14px;margin-bottom:4px}
        .pz-mou-region{font-size:11.5px;color:#6b83a0;margin-bottom:8px}
        .pz-mou-desc{font-size:12.5px;color:#a8bdd2;line-height:1.5;margin-bottom:10px}
        .pz-link{color:#fbbf24;font-size:12px;font-weight:700;text-decoration:none;display:inline-block;margin-right:14px}
        .pz-link:hover{text-decoration:underline}
        @media(max-width:560px){ .pz-filters{flex-direction:column} .pz-inp,.pz-sel{width:100%} }
      `}</style>

      <div className="pz-wrap">
        <Link href="/tools" className="pz-back">← All Tools</Link>
        <div className="pz-title">PSC Preparation</div>
        <p className="pz-sub">
          Deficiency code database, MoU inspection portals, action codes and CIC campaigns — built from public IMO, Paris MoU, Tokyo MoU and GISIS sources.
        </p>

        <div className="pz-tabs">
          {[
            { key: 'codes' as Tab, label: `🔢 Deficiency Codes (${DEFICIENCIES.length})` },
            { key: 'mous' as Tab, label: `🌍 MoU Databases (${MOUS.length + PLATFORMS.length})` },
            { key: 'cics' as Tab, label: `🎯 CIC Campaigns (${CICS.length})` },
            { key: 'actions' as Tab, label: `⚙️ Action Codes (${ACTION_CODES.length})` },
          ].map((t) => (
            <button key={t.key} className={`pz-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>

        {tab === 'codes' && (
          <>
            <div className="pz-filters">
              <input className="pz-inp" style={{ flex: 1, minWidth: 160 }} placeholder="Search code, description, convention..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <select className="pz-sel" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="all">All categories</option>
                {DEFICIENCY_CATEGORIES.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
              </select>
              <select className="pz-sel" value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
                <option value="all">All risk levels</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="very_high">Very High</option>
              </select>
            </div>

            {selectedDef && (
              <div className="pz-detail">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="pz-code">{selectedDef.code}</span>
                  <button onClick={() => setSelectedDef(null)} style={{ background: 'none', border: 'none', color: '#6b83a0', cursor: 'pointer' }}>✕</button>
                </div>
                <div className="pz-detail-row"><b>Description:</b> {selectedDef.description}</div>
                <div className="pz-detail-row"><b>Convention:</b> {selectedDef.convention}</div>
                <div className="pz-detail-row"><b>Typical action:</b> {selectedDef.typicalAction}</div>
                <div className="pz-detail-row"><b>Rectification:</b> {selectedDef.rectification}</div>
                <div className="pz-detail-row"><b>Detention risk:</b> <span style={{ color: RISK_COLORS[selectedDef.detentionRisk] }}>{RISK_LABELS[selectedDef.detentionRisk]}</span></div>
              </div>
            )}

            {filtered.map((d) => (
              <div key={d.code} className="pz-card" onClick={() => setSelectedDef(d)}>
                <span className="pz-code">{d.code}</span>
                <span className="pz-risk-badge" style={{ background: `${RISK_COLORS[d.detentionRisk]}22`, color: RISK_COLORS[d.detentionRisk] }}>{RISK_LABELS[d.detentionRisk]}</span>
                <div className="pz-desc">{d.description}</div>
                <div className="pz-meta">{d.convention} · {d.subcategory}</div>
              </div>
            ))}
          </>
        )}

        {tab === 'mous' && (
          <>
            {[...MOUS, ...PLATFORMS].map((m: any) => (
              <div key={m.key || m.name} className="pz-mou-card">
                <div className="pz-mou-name">{m.name} {m.region2}</div>
                <div className="pz-mou-region">{m.region}</div>
                <div className="pz-mou-desc">{m.description}</div>
                {m.homepage && <a href={m.homepage} target="_blank" rel="noopener noreferrer" className="pz-link">Homepage →</a>}
                {m.inspectionSearch && <a href={m.inspectionSearch} target="_blank" rel="noopener noreferrer" className="pz-link">Inspection search →</a>}
                {m.detentionList && <a href={m.detentionList} target="_blank" rel="noopener noreferrer" className="pz-link">Detention list →</a>}
              </div>
            ))}
          </>
        )}

        {tab === 'cics' && (
          <>
            {CICS.map((c: any, i: number) => (
              <div key={i} className="pz-mou-card">
                <div className="pz-mou-name">{c.topic} ({c.year})</div>
                <div className="pz-mou-region">{c.period} · {(c.mous || []).join(', ')}</div>
                <div className="pz-mou-desc">{c.focus}</div>
                {c.checklistItems && (
                  <ul style={{ fontSize: 12, color: '#a8bdd2', lineHeight: 1.7, paddingLeft: 18, marginTop: 8 }}>
                    {c.checklistItems.map((item: string, j: number) => <li key={j}>{item}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </>
        )}

        {tab === 'actions' && (
          <>
            {ACTION_CODES.map((a: any, i: number) => (
              <div key={i} className="pz-mou-card">
                <div className="pz-mou-name">Code {a.code}</div>
                <div className="pz-mou-desc">{a.description || a.meaning}</div>
              </div>
            ))}
          </>
        )}

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
