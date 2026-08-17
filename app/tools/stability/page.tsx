'use client';
import { useState } from 'react';
import Link from 'next/link';

interface WeightItem {
  id: number;
  label: string;
  weight: string;
  lcg: string;
  vcg: string;
  tcg: string;
  fsm: string;
}

function newItem(id: number, label = ''): WeightItem {
  return { id, label, weight: '', lcg: '', vcg: '', tcg: '', fsm: '' };
}

const DEFAULT_LABELS = ['Cargo Hold 1', 'Cargo Hold 2', 'Cargo Hold 3', 'VLSFO Bunkers', 'MGO Bunkers', 'Fresh Water', 'Ballast Water', 'Constant'];
const IMO_MIN_GM = 0.15;

export default function StabilityPage() {
  const [lightship, setLightship] = useState('');
  const [lightshipLcg, setLightshipLcg] = useState('');
  const [lightshipVcg, setLightshipVcg] = useState('');
  const [km, setKm] = useState('');
  const [mtc, setMtc] = useState('');
  const [tpc, setTpc] = useState('');
  const [lcf, setLcf] = useState('');
  const [lightshipDraft, setLightshipDraft] = useState('');
  const [items, setItems] = useState<WeightItem[]>(DEFAULT_LABELS.map((l, i) => newItem(i + 1, l)));

  const addItem = () => setItems((p) => [...p, newItem((p[p.length - 1]?.id || 0) + 1)]);
  const delItem = (id: number) => setItems((p) => (p.length > 1 ? p.filter((i) => i.id !== id) : p));
  const upd = (id: number, field: keyof WeightItem, val: string) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, [field]: val } : i)));

  const n = (v: string) => parseFloat(v) || 0;

  const rows = [
    { weight: n(lightship), lcg: n(lightshipLcg), vcg: n(lightshipVcg), tcg: 0, fsm: 0 },
    ...items.map((i) => ({ weight: n(i.weight), lcg: n(i.lcg), vcg: n(i.vcg), tcg: n(i.tcg), fsm: n(i.fsm) })),
  ];

  const displacement = rows.reduce((s, r) => s + r.weight, 0);
  const momentLong = rows.reduce((s, r) => s + r.weight * r.lcg, 0);
  const momentVert = rows.reduce((s, r) => s + r.weight * r.vcg, 0);
  const momentTrans = rows.reduce((s, r) => s + r.weight * r.tcg, 0);
  const totalFsm = rows.reduce((s, r) => s + r.fsm, 0);

  const lcg = displacement > 0 ? momentLong / displacement : 0;
  const tcg = displacement > 0 ? momentTrans / displacement : 0;
  const kgSolid = displacement > 0 ? momentVert / displacement : 0;
  const fsCorrection = displacement > 0 ? totalFsm / displacement : 0;
  const kgFluid = kgSolid + fsCorrection;

  const kmN = n(km);
  const gmSolid = kmN > 0 ? kmN - kgSolid : 0;
  const gmFluid = kmN > 0 ? kmN - kgFluid : 0;

  const lcfN = n(lcf);
  const mtcN = n(mtc);
  const trimMoment = displacement * (lcg - lcfN);
  const trimCm = mtcN > 0 ? trimMoment / mtcN : 0;
  const trimM = trimCm / 100;

  // List angle from transverse moment: tan(list) = TCG_total_moment / (Displacement × GM)
  const listRad = displacement > 0 && gmFluid > 0 ? Math.atan(tcg / gmFluid) : 0;
  const listDeg = (listRad * 180) / Math.PI;

  // Approx mean draft change from lightship draft using TPC
  const tpcN = n(tpc);
  const lightshipDraftN = n(lightshipDraft);
  const deadweight = displacement - n(lightship);
  const draftChange = tpcN > 0 ? deadweight / (tpcN * 100) : 0;
  const meanDraft = lightshipDraftN > 0 ? lightshipDraftN + draftChange : 0;

  const gmOk = kmN > 0 && gmFluid >= IMO_MIN_GM;
  const gmNegative = kmN > 0 && gmFluid < 0;
  const hasData = displacement > 0 && kmN > 0;

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .sz-wrap{max-width:700px;margin:0 auto;padding:28px 18px 60px}
        .sz-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .sz-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .sz-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:22px}
        .sz-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:14px}
        .sz-label{font-size:11px;color:#6b83a0;text-transform:uppercase;letter-spacing:.06em;font-weight:700;display:block;margin-bottom:10px}
        .sz-field-label{font-size:11px;color:#6b83a0;display:block;margin-bottom:4px}
        .sz-inp,.sz-sel{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:8px 10px;color:#eef4fa;font-size:12.5px;font-family:inherit}
        .sz-inp:focus{outline:none;border-color:#fbbf24}
        .sz-row4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}
        .sz-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
        .sz-item-head{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr 1fr 1fr 26px;gap:6px;font-size:9.5px;color:#4a5568;text-transform:uppercase;letter-spacing:.03em;padding:0 2px 6px;font-weight:700}
        .sz-item-row{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr 1fr 1fr 26px;gap:6px;align-items:center;margin-bottom:6px}
        .sz-rm{background:none;border:none;color:#6b83a0;cursor:pointer;font-size:15px}
        .sz-rm:hover{color:#f87171}
        .sz-add{background:rgba(255,255,255,.04);border:1px dashed rgba(255,255,255,.2);color:#a8bdd2;border-radius:9px;padding:9px;width:100%;cursor:pointer;font-size:12.5px;font-weight:600;font-family:inherit}
        .sz-add:hover{border-color:#fbbf24;color:#fbbf24}
        .sz-result-hero{border-radius:16px;padding:22px;text-align:center;margin-bottom:14px}
        .sz-result-val{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:34px;font-weight:800}
        .sz-result-lbl{font-size:11.5px;margin-top:4px;opacity:.85}
        .sz-stat-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px}
        .sz-stat{flex:1;min-width:140px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px}
        .sz-stat-label{font-size:10.5px;color:#a8bdd2;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}
        .sz-stat-val{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:17px;font-weight:800;color:#fbbf24}
        .sz-warn{background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#fca5a5;line-height:1.5;margin-bottom:14px}
        .sz-info{background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.2);border-radius:10px;padding:12px 14px;font-size:12px;color:#a7f3d0;line-height:1.5;margin-bottom:14px}
        @media(max-width:640px){
          .sz-row4{grid-template-columns:1fr 1fr}
          .sz-item-head{display:none}
          .sz-item-row{grid-template-columns:1fr;gap:5px;background:rgba(255,255,255,.02);padding:10px;border-radius:9px;margin-bottom:10px}
          .sz-rm{justify-self:end}
        }
      `}</style>

      <div className="sz-wrap">
        <Link href="/tools" className="sz-back">← All Tools</Link>
        <div className="sz-title">Stability Calculator</div>
        <p className="sz-sub">
          Weight-table stability: displacement, GM (solid and free-surface corrected), list, trim and an approximate mean draft — from your ship&apos;s stability book figures. Nothing is saved.
        </p>

        <div className="sz-card">
          <span className="sz-label">Hydrostatic data (from your stability book, at approx. draft)</span>
          <div className="sz-row4">
            <div>
              <span className="sz-field-label">KM (m)</span>
              <input className="sz-inp" value={km} onChange={(e) => setKm(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="sz-field-label">MTC (t·m/cm)</span>
              <input className="sz-inp" value={mtc} onChange={(e) => setMtc(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="sz-field-label">TPC (t/cm)</span>
              <input className="sz-inp" value={tpc} onChange={(e) => setTpc(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="sz-field-label">LCF (m)</span>
              <input className="sz-inp" value={lcf} onChange={(e) => setLcf(e.target.value)} inputMode="decimal" />
            </div>
          </div>
          <span className="sz-label" style={{ marginTop: 4 }}>Lightship</span>
          <div className="sz-row4" style={{ marginBottom: 0 }}>
            <div>
              <span className="sz-field-label">Weight (MT)</span>
              <input className="sz-inp" value={lightship} onChange={(e) => setLightship(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="sz-field-label">LCG (m)</span>
              <input className="sz-inp" value={lightshipLcg} onChange={(e) => setLightshipLcg(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="sz-field-label">VCG / KG (m)</span>
              <input className="sz-inp" value={lightshipVcg} onChange={(e) => setLightshipVcg(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="sz-field-label">Lightship draft (m)</span>
              <input className="sz-inp" value={lightshipDraft} onChange={(e) => setLightshipDraft(e.target.value)} inputMode="decimal" />
            </div>
          </div>
        </div>

        <div className="sz-card">
          <span className="sz-label">Deadweight items</span>
          <div className="sz-item-head">
            <span>Item</span><span>Wt (MT)</span><span>LCG (m)</span><span>VCG (m)</span><span>TCG (m)</span><span>FSM (t·m)</span><span></span>
          </div>
          {items.map((i) => (
            <div className="sz-item-row" key={i.id}>
              <input className="sz-inp" placeholder="Item" value={i.label} onChange={(e) => upd(i.id, 'label', e.target.value)} />
              <input className="sz-inp" placeholder="MT" value={i.weight} onChange={(e) => upd(i.id, 'weight', e.target.value)} inputMode="decimal" />
              <input className="sz-inp" placeholder="LCG" value={i.lcg} onChange={(e) => upd(i.id, 'lcg', e.target.value)} inputMode="decimal" />
              <input className="sz-inp" placeholder="VCG" value={i.vcg} onChange={(e) => upd(i.id, 'vcg', e.target.value)} inputMode="decimal" />
              <input className="sz-inp" placeholder="TCG" value={i.tcg} onChange={(e) => upd(i.id, 'tcg', e.target.value)} inputMode="decimal" />
              <input className="sz-inp" placeholder="FSM" value={i.fsm} onChange={(e) => upd(i.id, 'fsm', e.target.value)} inputMode="decimal" />
              <button className="sz-rm" onClick={() => delItem(i.id)} aria-label="Remove">✕</button>
            </div>
          ))}
          <button className="sz-add" onClick={addItem}>+ Add item</button>
          <p style={{ fontSize: 10.5, color: '#4a5568', marginTop: 8, lineHeight: 1.5 }}>
            LCG/TCG/VCG: positive LCG = forward of midship, positive TCG = to starboard. FSM = free surface moment (tanks only, from your tank sounding tables).
          </p>
        </div>

        {hasData && (
          <>
            <div
              className="sz-result-hero"
              style={{
                background: gmNegative ? 'rgba(248,113,113,.1)' : gmOk ? 'rgba(52,211,153,.1)' : 'rgba(251,191,36,.1)',
                border: `1px solid ${gmNegative ? 'rgba(248,113,113,.4)' : gmOk ? 'rgba(52,211,153,.4)' : 'rgba(251,191,36,.4)'}`,
              }}
            >
              <div className="sz-result-val" style={{ color: gmNegative ? '#f87171' : gmOk ? '#34d399' : '#fbbf24' }}>
                GM {gmFluid.toFixed(2)}m
              </div>
              <div className="sz-result-lbl" style={{ color: gmNegative ? '#f87171' : gmOk ? '#34d399' : '#fbbf24' }}>
                Fluid GM (free-surface corrected) · IMO minimum {IMO_MIN_GM}m
              </div>
            </div>

            {gmNegative && (
              <div className="sz-warn">
                ⚠ <b>Negative GM</b> — this indicates a potentially unstable condition (vessel may list to one side or capsize risk under disturbance). Verify all entries and consult the ship&apos;s stability book / master before proceeding. This tool does not replace approved loading computer software.
              </div>
            )}
            {!gmNegative && !gmOk && (
              <div className="sz-warn">
                ⚠ GM is below the IMO intact stability minimum of {IMO_MIN_GM}m. Review loading condition before departure.
              </div>
            )}
            {gmOk && (
              <div className="sz-info">
                ✓ GM meets the IMO intact stability minimum of {IMO_MIN_GM}m for this loading condition.
              </div>
            )}

            <div className="sz-stat-row">
              <div className="sz-stat">
                <div className="sz-stat-label">Displacement</div>
                <div className="sz-stat-val">{displacement.toFixed(0)} MT</div>
              </div>
              <div className="sz-stat">
                <div className="sz-stat-label">GM solid (no FS correction)</div>
                <div className="sz-stat-val">{gmSolid.toFixed(2)} m</div>
              </div>
              <div className="sz-stat">
                <div className="sz-stat-label">Free surface correction</div>
                <div className="sz-stat-val">{fsCorrection.toFixed(3)} m</div>
              </div>
            </div>
            <div className="sz-stat-row">
              <div className="sz-stat">
                <div className="sz-stat-label">Trim</div>
                <div className="sz-stat-val">{Math.abs(trimM).toFixed(2)}m {trimM > 0 ? 'by head' : trimM < 0 ? 'by stern' : 'even keel'}</div>
              </div>
              <div className="sz-stat">
                <div className="sz-stat-label">List</div>
                <div className="sz-stat-val">{Math.abs(listDeg).toFixed(1)}° {listDeg > 0.05 ? 'stbd' : listDeg < -0.05 ? 'port' : 'upright'}</div>
              </div>
              {tpcN > 0 && lightshipDraftN > 0 && (
                <div className="sz-stat">
                  <div className="sz-stat-label">Approx. mean draft</div>
                  <div className="sz-stat-val">{meanDraft.toFixed(2)} m</div>
                </div>
              )}
            </div>
          </>
        )}

        <p style={{ fontSize: 11, color: '#4a5568', lineHeight: 1.6, marginTop: 8 }}>
          Standard weight-table method (displacement, LCG, KG, GM). Trim and mean draft are simplified estimates for planning — always confirm against your vessel&apos;s approved loading computer / stability book before any operation affecting stability.
        </p>
      </div>
    </main>
  );
}
