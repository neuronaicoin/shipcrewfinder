'use client';
import { useState } from 'react';
import Link from 'next/link';

type Friction = 'steel-steel' | 'steel-wood' | 'wood-wood' | 'rubber-mat' | 'custom';
const FRICTION: Record<Friction, number> = { 'steel-steel': 0.1, 'steel-wood': 0.3, 'wood-wood': 0.4, 'rubber-mat': 0.6, custom: 0.3 };
const FRICTION_LABEL: Record<Friction, string> = {
  'steel-steel': 'Steel – Steel (μ 0.10)',
  'steel-wood': 'Steel – Wood/dunnage (μ 0.30)',
  'wood-wood': 'Wood – Wood (μ 0.40)',
  'rubber-mat': 'Rubber anti-slip mat (μ 0.60)',
  custom: 'Custom',
};
const BASE_ACC = { transverse: 0.5, longitudinal: 0.3, vertical: 0.5 };
const G = 9.81;

interface LashingItem { id: number; label: string; msl: string; angleV: string; angleH: string; count: string; }
function newLashing(id: number, label = ''): LashingItem {
  return { id, label, msl: '', angleV: '30', angleH: '0', count: '1' };
}

export default function LashingPage() {
  const [weight, setWeight] = useState('');
  const [position, setPosition] = useState<'fwd' | 'mid' | 'aft'>('mid');
  const [frictionType, setFrictionType] = useState<Friction>('steel-wood');
  const [customMu, setCustomMu] = useState('0.3');
  const [gm, setGm] = useState('');
  const [cogHeight, setCogHeight] = useState('');
  const [baseWidth, setBaseWidth] = useState('');
  const [lashings, setLashings] = useState<LashingItem[]>([newLashing(1, 'Wire lashing')]);

  const addLashing = () => setLashings((p) => [...p, newLashing((p[p.length - 1]?.id || 0) + 1)]);
  const delLashing = (id: number) => setLashings((p) => (p.length > 1 ? p.filter((l) => l.id !== id) : p));
  const upd = (id: number, field: keyof LashingItem, val: string) =>
    setLashings((p) => p.map((l) => (l.id === id ? { ...l, [field]: val } : l)));

  const n = (v: string) => parseFloat(v) || 0;

  const mu = frictionType === 'custom' ? n(customMu) : FRICTION[frictionType];
  const W = n(weight);
  const weightForce = W * G;
  const posFactor = position === 'mid' ? 1.0 : 1.1;
  const gmN = n(gm);
  const gmFactor = gmN > 0 ? Math.min(1.3, Math.max(0.8, gmN / 1.0)) : 1.0;

  const accT = BASE_ACC.transverse * posFactor * gmFactor;
  const accL = BASE_ACC.longitudinal * posFactor;

  const Ft = W * G * accT;
  const Fl = W * G * accL;
  const frictionHold = mu * weightForce;

  let lashingTransverse = 0;
  let totalMsl = 0;
  lashings.forEach((l) => {
    const cs = n(l.msl);
    const count = n(l.count) || 0;
    const av = (n(l.angleV) * Math.PI) / 180;
    const ah = (n(l.angleH) * Math.PI) / 180;
    const horiz = cs * Math.cos(av) * Math.cos(ah);
    const vertFrictionAdd = mu * cs * Math.sin(av);
    lashingTransverse += (horiz + vertFrictionAdd) * count;
    totalMsl += cs * count;
  });

  const totalTransverseResistance = frictionHold + lashingTransverse;
  const slidingMargin = totalTransverseResistance - Ft;
  const slidingOk = slidingMargin >= 0;
  const longOk = frictionHold >= Fl;

  const hN = n(cogHeight);
  const bN = n(baseWidth);
  const hasTippingData = hN > 0 && bN > 0;
  const tippingMoment = Ft * hN;
  const rightingMoment = weightForce * (bN / 2);
  const tippingMargin = rightingMoment - tippingMoment;
  const tippingOk = tippingMargin >= 0;

  const hasResult = W > 0 && lashings.some((l) => n(l.msl) > 0);
  const overallOk = slidingOk && longOk && (!hasTippingData || tippingOk);

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .lz-wrap{max-width:680px;margin:0 auto;padding:28px 18px 60px}
        .lz-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .lz-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .lz-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:22px}
        .lz-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:14px}
        .lz-label{font-size:11px;color:#6b83a0;text-transform:uppercase;letter-spacing:.06em;font-weight:700;display:block;margin-bottom:10px}
        .lz-field-label{font-size:11px;color:#6b83a0;display:block;margin-bottom:4px}
        .lz-inp,.lz-sel{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:9px 11px;color:#eef4fa;font-size:13px;font-family:inherit}
        .lz-inp:focus,.lz-sel:focus{outline:none;border-color:#fbbf24}
        .lz-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px}
        .lz-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
        .lz-item-head{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr .8fr 26px;gap:6px;font-size:9.5px;color:#4a5568;text-transform:uppercase;letter-spacing:.03em;padding:0 2px 6px;font-weight:700}
        .lz-item-row{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr .8fr 26px;gap:6px;align-items:center;margin-bottom:6px}
        .lz-rm{background:none;border:none;color:#6b83a0;cursor:pointer;font-size:15px}
        .lz-rm:hover{color:#f87171}
        .lz-add{background:rgba(255,255,255,.04);border:1px dashed rgba(255,255,255,.2);color:#a8bdd2;border-radius:9px;padding:9px;width:100%;cursor:pointer;font-size:12.5px;font-weight:600;font-family:inherit}
        .lz-add:hover{border-color:#fbbf24;color:#fbbf24}
        .lz-check{border-radius:14px;padding:16px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center}
        .lz-check-name{font-size:13px;font-weight:700}
        .lz-check-val{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:15px;font-weight:800}
        .lz-warn{background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#fca5a5;line-height:1.5;margin-bottom:14px}
        @media(max-width:640px){
          .lz-row3{grid-template-columns:1fr 1fr}
          .lz-item-head{display:none}
          .lz-item-row{grid-template-columns:1fr;gap:5px;background:rgba(255,255,255,.02);padding:10px;border-radius:9px;margin-bottom:10px}
          .lz-rm{justify-self:end}
        }
      `}</style>

      <div className="lz-wrap">
        <Link href="/tools" className="lz-back">← All Tools</Link>
        <div className="lz-title">Cargo Securing / Lashing Calculator</div>
        <p className="lz-sub">
          CSS Code simplified method — sliding and tipping checks against your lashing arrangement. Enter your cargo, friction surface, and lashing setup below. Nothing is saved.
        </p>

        <div className="lz-card">
          <span className="lz-label">Cargo</span>
          <div className="lz-row3" style={{ marginBottom: 0 }}>
            <div>
              <span className="lz-field-label">Weight (MT)</span>
              <input className="lz-inp" value={weight} onChange={(e) => setWeight(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="lz-field-label">Deck position</span>
              <select className="lz-sel" value={position} onChange={(e) => setPosition(e.target.value as typeof position)}>
                <option value="fwd">Forward</option>
                <option value="mid">Midships</option>
                <option value="aft">Aft</option>
              </select>
            </div>
            <div>
              <span className="lz-field-label">Vessel GM (m, optional)</span>
              <input className="lz-inp" value={gm} onChange={(e) => setGm(e.target.value)} inputMode="decimal" />
            </div>
          </div>
        </div>

        <div className="lz-card">
          <span className="lz-label">Friction surface</span>
          <select className="lz-sel" value={frictionType} onChange={(e) => setFrictionType(e.target.value as Friction)}>
            {(Object.keys(FRICTION_LABEL) as Friction[]).map((k) => <option key={k} value={k}>{FRICTION_LABEL[k]}</option>)}
          </select>
          {frictionType === 'custom' && (
            <>
              <span className="lz-field-label" style={{ marginTop: 10 }}>Custom μ (friction coefficient)</span>
              <input className="lz-inp" value={customMu} onChange={(e) => setCustomMu(e.target.value)} inputMode="decimal" />
            </>
          )}
        </div>

        <div className="lz-card">
          <span className="lz-label">Lashings</span>
          <div className="lz-item-head">
            <span>Description</span><span>MSL (kN)</span><span>Vert. angle°</span><span>Horiz. angle°</span><span>Count</span><span></span>
          </div>
          {lashings.map((l) => (
            <div className="lz-item-row" key={l.id}>
              <input className="lz-inp" placeholder="e.g. Wire lashing" value={l.label} onChange={(e) => upd(l.id, 'label', e.target.value)} />
              <input className="lz-inp" placeholder="MSL" value={l.msl} onChange={(e) => upd(l.id, 'msl', e.target.value)} inputMode="decimal" />
              <input className="lz-inp" placeholder="°" value={l.angleV} onChange={(e) => upd(l.id, 'angleV', e.target.value)} inputMode="decimal" />
              <input className="lz-inp" placeholder="°" value={l.angleH} onChange={(e) => upd(l.id, 'angleH', e.target.value)} inputMode="decimal" />
              <input className="lz-inp" placeholder="#" value={l.count} onChange={(e) => upd(l.id, 'count', e.target.value)} inputMode="numeric" />
              <button className="lz-rm" onClick={() => delLashing(l.id)} aria-label="Remove">✕</button>
            </div>
          ))}
          <button className="lz-add" onClick={addLashing}>+ Add lashing</button>
        </div>

        <div className="lz-card">
          <span className="lz-label">Tipping check (optional — leave blank to skip)</span>
          <div className="lz-row2" style={{ marginBottom: 0 }}>
            <div>
              <span className="lz-field-label">Cargo height to CoG (m)</span>
              <input className="lz-inp" value={cogHeight} onChange={(e) => setCogHeight(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="lz-field-label">Cargo base width, transverse (m)</span>
              <input className="lz-inp" value={baseWidth} onChange={(e) => setBaseWidth(e.target.value)} inputMode="decimal" />
            </div>
          </div>
        </div>

        {hasResult && (
          <>
            <div className="lz-check" style={{ background: slidingOk ? 'rgba(52,211,153,.1)' : 'rgba(248,113,113,.1)', border: `1px solid ${slidingOk ? 'rgba(52,211,153,.35)' : 'rgba(248,113,113,.35)'}` }}>
              <span className="lz-check-name" style={{ color: slidingOk ? '#34d399' : '#f87171' }}>Sliding (transverse) — {slidingOk ? 'PASS' : 'FAIL'}</span>
              <span className="lz-check-val" style={{ color: slidingOk ? '#34d399' : '#f87171' }}>{totalTransverseResistance.toFixed(0)} / {Ft.toFixed(0)} kN</span>
            </div>
            <div className="lz-check" style={{ background: longOk ? 'rgba(52,211,153,.1)' : 'rgba(248,113,113,.1)', border: `1px solid ${longOk ? 'rgba(52,211,153,.35)' : 'rgba(248,113,113,.35)'}` }}>
              <span className="lz-check-name" style={{ color: longOk ? '#34d399' : '#f87171' }}>Sliding (longitudinal) — {longOk ? 'PASS' : 'FAIL'}</span>
              <span className="lz-check-val" style={{ color: longOk ? '#34d399' : '#f87171' }}>{frictionHold.toFixed(0)} / {Fl.toFixed(0)} kN</span>
            </div>
            {hasTippingData && (
              <div className="lz-check" style={{ background: tippingOk ? 'rgba(52,211,153,.1)' : 'rgba(248,113,113,.1)', border: `1px solid ${tippingOk ? 'rgba(52,211,153,.35)' : 'rgba(248,113,113,.35)'}` }}>
                <span className="lz-check-name" style={{ color: tippingOk ? '#34d399' : '#f87171' }}>Tipping — {tippingOk ? 'PASS' : 'FAIL'}</span>
                <span className="lz-check-val" style={{ color: tippingOk ? '#34d399' : '#f87171' }}>{rightingMoment.toFixed(0)} / {tippingMoment.toFixed(0)} kN·m</span>
              </div>
            )}

            {!overallOk && (
              <div className="lz-warn">
                ⚠ <b>One or more checks failed.</b> Add more lashings, increase MSL, improve the friction surface, or reduce estimated accelerations by re-checking cargo position and vessel GM. This tool uses the CSS Code simplified rule-of-thumb method — for critical or heavy cargo, use the full Annex 13 direct calculation or consult a naval architect.
              </div>
            )}
          </>
        )}

        <p style={{ fontSize: 11, color: '#4a5568', lineHeight: 1.6, marginTop: 8 }}>
          Method: CSS Code simplified securing calculation with typical accelerations for unrestricted service. This is a planning aid, not a substitute for the vessel&apos;s approved Cargo Securing Manual.
        </p>
      </div>
    </main>
  );
}
