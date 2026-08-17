'use client';
import { useState } from 'react';
import Link from 'next/link';

type ClaimType = 'demurrage' | 'offhire' | 'speedcons' | 'other';

interface Claim {
  id: number;
  type: ClaimType;
  title: string;
  eventDate: string;
  timeBarDays: string;
  notes: string;
  // demurrage
  allowedLaytime: string;
  usedLaytime: string;
  demurrageRate: string;
  despatchRate: string;
  // offhire
  hours: string;
  hireRate: string;
  bunkerValue: string;
  // speedcons
  gwDays: string;
  warrantedSpeed: string;
  actualSpeed: string;
  warrantedCons: string;
  actualCons: string;
  bunkerPrice: string;
  // other
  amount: string;
  dir: 'owner' | 'charterer';
}

function newClaim(id: number): Claim {
  return {
    id, type: 'demurrage', title: '', eventDate: '', timeBarDays: '90', notes: '',
    allowedLaytime: '', usedLaytime: '', demurrageRate: '', despatchRate: '',
    hours: '', hireRate: '', bunkerValue: '',
    gwDays: '', warrantedSpeed: '', actualSpeed: '', warrantedCons: '', actualCons: '', bunkerPrice: '',
    amount: '', dir: 'owner',
  };
}

const n = (v: string) => parseFloat(v) || 0;

function claimValue(c: Claim): number {
  switch (c.type) {
    case 'demurrage': {
      const overHours = n(c.usedLaytime) - n(c.allowedLaytime);
      if (overHours > 0) return (overHours / 24) * n(c.demurrageRate);
      return -((-overHours / 24) * n(c.despatchRate));
    }
    case 'offhire':
      return -((n(c.hours) / 24) * n(c.hireRate) + n(c.bunkerValue));
    case 'speedcons': {
      const excessConsPerDay = n(c.actualCons) - n(c.warrantedCons);
      const excessFuel = excessConsPerDay * n(c.gwDays);
      const fuelClaim = excessFuel > 0 ? excessFuel * n(c.bunkerPrice) : 0;
      let timeClaim = 0;
      const ws = n(c.warrantedSpeed), as = n(c.actualSpeed), gw = n(c.gwDays);
      if (as > 0 && ws > 0 && as < ws) {
        const distance = as * 24 * gw;
        const timeAtWarranted = distance / (ws * 24);
        timeClaim = (gw - timeAtWarranted) * n(c.hireRate);
      }
      return -(fuelClaim + timeClaim);
    }
    case 'other':
      return c.dir === 'owner' ? Math.abs(n(c.amount)) : -Math.abs(n(c.amount));
  }
}

function timeBarStatus(c: Claim): { daysLeft: number | null; deadline: string | null } {
  if (!c.eventDate || !c.timeBarDays) return { daysLeft: null, deadline: null };
  const ev = new Date(c.eventDate + 'T00:00:00');
  if (isNaN(ev.getTime())) return { daysLeft: null, deadline: null };
  const dl = new Date(ev);
  dl.setDate(dl.getDate() + (parseInt(c.timeBarDays) || 0));
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const daysLeft = Math.round((dl.getTime() - now.getTime()) / 86400000);
  return { daysLeft, deadline: dl.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) };
}

function money(v: number) { return (v < 0 ? '-$' : '$') + Math.abs(v).toLocaleString('en-US', { maximumFractionDigits: 0 }); }

const CLAIM_LABELS: Record<ClaimType, string> = { demurrage: 'Demurrage / Despatch', offhire: 'Off-Hire', speedcons: 'Speed / Consumption', other: 'Other' };

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([newClaim(1)]);

  const addClaim = () => setClaims((c) => [...c, newClaim((c[c.length - 1]?.id || 0) + 1)]);
  const delClaim = (id: number) => setClaims((c) => (c.length > 1 ? c.filter((x) => x.id !== id) : c));
  const upd = (id: number, patch: Partial<Claim>) => setClaims((c) => c.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const totalNet = claims.reduce((sum, c) => sum + claimValue(c), 0);

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .cl-wrap{max-width:760px;margin:0 auto;padding:28px 18px 60px}
        .cl-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .cl-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .cl-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:20px}
        .cl-summary{background:linear-gradient(165deg,#141845,#050716);border:1.5px solid rgba(251,191,36,.25);border-radius:16px;padding:20px;text-align:center;margin-bottom:16px}
        .cl-summary-val{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:30px;font-weight:800}
        .cl-summary-lbl{font-size:12px;color:#a8bdd2;margin-top:4px}
        .cl-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:16px;margin-bottom:14px}
        .cl-card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
        .cl-rm{background:none;border:none;color:#6b83a0;cursor:pointer;font-size:16px}
        .cl-rm:hover{color:#f87171}
        .cl-label{font-size:11px;color:#6b83a0;display:block;margin-bottom:4px}
        .cl-inp,.cl-sel{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:8px 10px;color:#eef4fa;font-size:12.5px;font-family:inherit}
        .cl-sel option{background:#141845;color:#eef4fa}
        .cl-inp:focus,.cl-sel:focus{outline:none;border-color:#fbbf24}
        .cl-row2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
        .cl-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px}
        .cl-value-row{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.08)}
        .cl-value{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:16px}
        .cl-timebar{font-size:11px;padding:4px 10px;border-radius:6px;font-weight:700}
        .cl-add{background:rgba(255,255,255,.04);border:1px dashed rgba(255,255,255,.2);color:#a8bdd2;border-radius:12px;padding:12px;width:100%;cursor:pointer;font-size:13px;font-weight:700;font-family:inherit;margin-bottom:16px}
        .cl-add:hover{border-color:#fbbf24;color:#fbbf24}
        @media(max-width:560px){ .cl-row3{grid-template-columns:1fr 1fr} }
      `}</style>

      <div className="cl-wrap">
        <Link href="/tools" className="cl-back">← All Tools</Link>
        <div className="cl-title">Claim Center</div>
        <p className="cl-sub">
          Track demurrage/despatch, off-hire, speed/consumption and other claims — with automatic time-bar countdown. Nothing is saved.
        </p>

        <div className="cl-summary">
          <div className="cl-summary-val" style={{ color: totalNet >= 0 ? '#34d399' : '#f87171' }}>{money(totalNet)}</div>
          <div className="cl-summary-lbl">Net position ({totalNet >= 0 ? 'Charterer owes Owner' : 'Owner owes Charterer'})</div>
        </div>

        {claims.map((c) => {
          const val = claimValue(c);
          const tb = timeBarStatus(c);
          const tbColor = tb.daysLeft === null ? '#6b83a0' : tb.daysLeft < 0 ? '#f87171' : tb.daysLeft <= 14 ? '#e89c5a' : '#34d399';
          const tbBg = tb.daysLeft === null ? 'rgba(107,131,160,.12)' : tb.daysLeft < 0 ? 'rgba(248,113,113,.12)' : tb.daysLeft <= 14 ? 'rgba(232,156,90,.12)' : 'rgba(52,211,153,.12)';

          return (
            <div className="cl-card" key={c.id}>
              <div className="cl-card-head">
                <select className="cl-sel" style={{ width: 'auto', fontWeight: 700 }} value={c.type} onChange={(e) => upd(c.id, { type: e.target.value as ClaimType })}>
                  {(Object.keys(CLAIM_LABELS) as ClaimType[]).map((k) => <option key={k} value={k}>{CLAIM_LABELS[k]}</option>)}
                </select>
                <button className="cl-rm" onClick={() => delClaim(c.id)} aria-label="Remove">✕</button>
              </div>

              <input className="cl-inp" style={{ marginBottom: 8 }} placeholder="Title / reference (optional)" value={c.title} onChange={(e) => upd(c.id, { title: e.target.value })} />

              {c.type === 'demurrage' && (
                <div className="cl-row2">
                  <div><span className="cl-label">Allowed laytime (hrs)</span><input className="cl-inp" value={c.allowedLaytime} onChange={(e) => upd(c.id, { allowedLaytime: e.target.value })} inputMode="decimal" /></div>
                  <div><span className="cl-label">Used laytime (hrs)</span><input className="cl-inp" value={c.usedLaytime} onChange={(e) => upd(c.id, { usedLaytime: e.target.value })} inputMode="decimal" /></div>
                  <div><span className="cl-label">Demurrage rate ($/day)</span><input className="cl-inp" value={c.demurrageRate} onChange={(e) => upd(c.id, { demurrageRate: e.target.value })} inputMode="decimal" /></div>
                  <div><span className="cl-label">Despatch rate ($/day)</span><input className="cl-inp" value={c.despatchRate} onChange={(e) => upd(c.id, { despatchRate: e.target.value })} inputMode="decimal" /></div>
                </div>
              )}

              {c.type === 'offhire' && (
                <div className="cl-row3">
                  <div><span className="cl-label">Hours off-hire</span><input className="cl-inp" value={c.hours} onChange={(e) => upd(c.id, { hours: e.target.value })} inputMode="decimal" /></div>
                  <div><span className="cl-label">Hire rate ($/day)</span><input className="cl-inp" value={c.hireRate} onChange={(e) => upd(c.id, { hireRate: e.target.value })} inputMode="decimal" /></div>
                  <div><span className="cl-label">Bunker value ($)</span><input className="cl-inp" value={c.bunkerValue} onChange={(e) => upd(c.id, { bunkerValue: e.target.value })} inputMode="decimal" /></div>
                </div>
              )}

              {c.type === 'speedcons' && (
                <>
                  <div className="cl-row3">
                    <div><span className="cl-label">Good weather days</span><input className="cl-inp" value={c.gwDays} onChange={(e) => upd(c.id, { gwDays: e.target.value })} inputMode="decimal" /></div>
                    <div><span className="cl-label">Warranted speed (kn)</span><input className="cl-inp" value={c.warrantedSpeed} onChange={(e) => upd(c.id, { warrantedSpeed: e.target.value })} inputMode="decimal" /></div>
                    <div><span className="cl-label">Actual speed (kn)</span><input className="cl-inp" value={c.actualSpeed} onChange={(e) => upd(c.id, { actualSpeed: e.target.value })} inputMode="decimal" /></div>
                  </div>
                  <div className="cl-row3">
                    <div><span className="cl-label">Warranted cons (MT/day)</span><input className="cl-inp" value={c.warrantedCons} onChange={(e) => upd(c.id, { warrantedCons: e.target.value })} inputMode="decimal" /></div>
                    <div><span className="cl-label">Actual cons (MT/day)</span><input className="cl-inp" value={c.actualCons} onChange={(e) => upd(c.id, { actualCons: e.target.value })} inputMode="decimal" /></div>
                    <div><span className="cl-label">Bunker price ($/MT)</span><input className="cl-inp" value={c.bunkerPrice} onChange={(e) => upd(c.id, { bunkerPrice: e.target.value })} inputMode="decimal" /></div>
                  </div>
                  <div><span className="cl-label">Hire rate ($/day, for time value)</span><input className="cl-inp" value={c.hireRate} onChange={(e) => upd(c.id, { hireRate: e.target.value })} inputMode="decimal" /></div>
                </>
              )}

              {c.type === 'other' && (
                <div className="cl-row2">
                  <div><span className="cl-label">Amount ($)</span><input className="cl-inp" value={c.amount} onChange={(e) => upd(c.id, { amount: e.target.value })} inputMode="decimal" /></div>
                  <div>
                    <span className="cl-label">Owed to</span>
                    <select className="cl-sel" value={c.dir} onChange={(e) => upd(c.id, { dir: e.target.value as 'owner' | 'charterer' })}>
                      <option value="owner">Owner</option>
                      <option value="charterer">Charterer</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="cl-row2" style={{ marginTop: 4 }}>
                <div><span className="cl-label">Event end date (time-bar starts)</span><input className="cl-inp" type="date" value={c.eventDate} onChange={(e) => upd(c.id, { eventDate: e.target.value })} /></div>
                <div><span className="cl-label">Time-bar (days per CP)</span><input className="cl-inp" value={c.timeBarDays} onChange={(e) => upd(c.id, { timeBarDays: e.target.value })} inputMode="numeric" /></div>
              </div>

              <div className="cl-value-row">
                <span className="cl-value" style={{ color: val >= 0 ? '#34d399' : '#f87171' }}>{money(val)}</span>
                {tb.daysLeft !== null && (
                  <span className="cl-timebar" style={{ background: tbBg, color: tbColor }}>
                    {tb.daysLeft < 0 ? `Expired ${Math.abs(tb.daysLeft)}d ago` : `${tb.daysLeft}d left · ${tb.deadline}`}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        <button className="cl-add" onClick={addClaim}>+ Add claim</button>

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
