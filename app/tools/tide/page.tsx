'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

interface TideEvent { id: number; type: 'HW' | 'LW'; time: string; height: string; }
function newEvent(id: number, type: 'HW' | 'LW' = 'HW'): TideEvent { return { id, type, time: '', height: '' }; }

function toMin(t: string): number | null {
  if (!t || !/^\d{1,2}:\d{2}$/.test(t)) return null;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function fromMin(m: number): string {
  m = ((m % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60), mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
function heightAt(min: number, events: { t: number; h: number }[]): number | null {
  if (events.length < 2) return null;
  for (let i = 0; i < events.length - 1; i++) {
    const a = events[i], b = events[i + 1];
    if (min >= a.t && min <= b.t) {
      const dur = b.t - a.t;
      if (dur <= 0) return a.h;
      const frac = (min - a.t) / dur;
      const cos = (1 - Math.cos(Math.PI * frac)) / 2;
      return a.h + (b.h - a.h) * cos;
    }
  }
  return null;
}

export default function TidePage() {
  const [events, setEvents] = useState<TideEvent[]>([newEvent(1, 'LW'), newEvent(2, 'HW'), newEvent(3, 'LW'), newEvent(4, 'HW')]);
  const [draft, setDraft] = useState('');
  const [requiredUkc, setRequiredUkc] = useState('');
  const [chartedDepth, setChartedDepth] = useState('');
  const [queryTime, setQueryTime] = useState('');

  const addEvent = () => setEvents((p) => [...p, newEvent((p[p.length - 1]?.id || 0) + 1)]);
  const delEvent = (id: number) => setEvents((p) => (p.length > 2 ? p.filter((e) => e.id !== id) : p));
  const upd = (id: number, patch: Partial<TideEvent>) => setEvents((p) => p.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const n = (v: string) => parseFloat(v) || 0;

  const sorted = useMemo(() => {
    return events
      .map((e) => ({ t: toMin(e.time), h: n(e.height) }))
      .filter((e): e is { t: number; h: number } => e.t != null)
      .sort((a, b) => a.t - b.t);
  }, [events]);

  const required = n(draft) + n(requiredUkc);
  const chartedN = n(chartedDepth);

  const queryMin = toMin(queryTime);
  const queryHeight = queryMin != null ? heightAt(queryMin, sorted) : null;
  const queryAvailable = queryHeight != null ? chartedN + queryHeight : null;
  const queryOk = queryAvailable != null ? queryAvailable >= required : null;

  const windows = useMemo(() => {
    if (sorted.length < 2 || required <= 0) return [];
    const start = sorted[0].t, end = sorted[sorted.length - 1].t;
    const res: { from: number; to: number }[] = [];
    let curStart: number | null = null;
    for (let m = start; m <= end; m += 10) {
      const h = heightAt(m, sorted);
      const avail = h != null ? chartedN + h : null;
      const ok = avail != null && avail >= required;
      if (ok && curStart == null) curStart = m;
      if (!ok && curStart != null) { res.push({ from: curStart, to: m - 10 }); curStart = null; }
    }
    if (curStart != null) res.push({ from: curStart, to: end });
    return res;
  }, [sorted, required, chartedN]);

  const chartPts = useMemo(() => {
    if (sorted.length < 2) return [];
    const start = sorted[0].t, end = sorted[sorted.length - 1].t;
    const pts: { m: number; h: number }[] = [];
    for (let m = start; m <= end; m += 15) {
      const h = heightAt(m, sorted);
      if (h != null) pts.push({ m, h });
    }
    return pts;
  }, [sorted]);

  const W = 600, H = 140, pad = 24;
  const heights = chartPts.map((p) => p.h);
  const minH = Math.min(0, ...heights), maxH = Math.max(1, ...heights);
  const tMin = sorted.length ? sorted[0].t : 0, tMax = sorted.length ? sorted[sorted.length - 1].t : 1;
  const px = (m: number) => pad + ((m - tMin) / Math.max(1, tMax - tMin)) * (W - 2 * pad);
  const py = (h: number) => H - pad - ((h - minH) / Math.max(0.1, maxH - minH)) * (H - 2 * pad);
  const pathD = chartPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(p.m).toFixed(1)} ${py(p.h).toFixed(1)}`).join(' ');
  const reqLineY = required > 0 && required - chartedN >= minH && required - chartedN <= maxH ? py(required - chartedN) : null;

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .tz-wrap{max-width:680px;margin:0 auto;padding:28px 18px 60px}
        .tz-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .tz-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .tz-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .tz-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .tz-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:14px}
        .tz-label{font-size:11px;color:#6b83a0;text-transform:uppercase;letter-spacing:.06em;font-weight:700;display:block;margin-bottom:10px}
        .tz-field-label{font-size:11px;color:#6b83a0;display:block;margin-bottom:4px}
        .tz-inp,.tz-sel{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:8px 10px;color:#eef4fa;font-size:13px;font-family:inherit}
        .tz-inp:focus,.tz-sel:focus{outline:none;border-color:#fbbf24}
        .tz-event-row{display:grid;grid-template-columns:80px 1fr 1fr 26px;gap:8px;align-items:center;margin-bottom:8px}
        .tz-rm{background:none;border:none;color:#6b83a0;cursor:pointer;font-size:15px}
        .tz-rm:hover{color:#f87171}
        .tz-add{background:rgba(255,255,255,.04);border:1px dashed rgba(255,255,255,.2);color:#a8bdd2;border-radius:9px;padding:9px;width:100%;cursor:pointer;font-size:12.5px;font-weight:600;font-family:inherit}
        .tz-add:hover{border-color:#fbbf24;color:#fbbf24}
        .tz-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
        .tz-query-result{margin-top:10px;padding:12px;border-radius:10px;text-align:center;font-weight:800;font-size:14px}
        .tz-window{display:flex;justify-content:space-between;padding:8px 12px;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.25);border-radius:8px;margin-bottom:6px;font-size:12.5px}
        @media(max-width:560px){ .tz-row3{grid-template-columns:1fr} }
      `}</style>

      <div className="tz-wrap">
        <Link href="/tools" className="tz-back">← All Tools</Link>
        <div className="tz-title">Tide Calculator</div>
        <p className="tz-sub">
          Enter the day&apos;s HW/LW from your tide table — this interpolates the tide height at any time and finds your safe under-keel clearance window.
        </p>
        <div className="tz-warn">
          ⚠ <b>Interpolation aid only.</b> Use official predictions (Admiralty TotalTide, NOAA, hydrographic office). This uses a smooth curve between HW/LW and ignores surge, meteorological effects and secondary-port corrections.
        </div>

        <div className="tz-card">
          <span className="tz-label">HW / LW events (from your tide table)</span>
          <div className="tz-event-row" style={{ marginBottom: 4, fontSize: 10, color: '#4a5568', textTransform: 'uppercase' }}>
            <span>Type</span><span>Time</span><span>Height (m)</span><span></span>
          </div>
          {events.map((e) => (
            <div className="tz-event-row" key={e.id}>
              <select className="tz-sel" value={e.type} onChange={(ev) => upd(e.id, { type: ev.target.value as 'HW' | 'LW' })}>
                <option value="HW">HW</option>
                <option value="LW">LW</option>
              </select>
              <input className="tz-inp" type="time" value={e.time} onChange={(ev) => upd(e.id, { time: ev.target.value })} />
              <input className="tz-inp" value={e.height} onChange={(ev) => upd(e.id, { height: ev.target.value })} inputMode="decimal" placeholder="m" />
              <button className="tz-rm" onClick={() => delEvent(e.id)} aria-label="Remove">✕</button>
            </div>
          ))}
          <button className="tz-add" onClick={addEvent}>+ Add event</button>
        </div>

        <div className="tz-card">
          <span className="tz-label">Under-keel clearance requirement</span>
          <div className="tz-row3">
            <div>
              <span className="tz-field-label">Draft (m)</span>
              <input className="tz-inp" value={draft} onChange={(e) => setDraft(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="tz-field-label">Required UKC (m)</span>
              <input className="tz-inp" value={requiredUkc} onChange={(e) => setRequiredUkc(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="tz-field-label">Charted depth (m, chart datum)</span>
              <input className="tz-inp" value={chartedDepth} onChange={(e) => setChartedDepth(e.target.value)} inputMode="decimal" />
            </div>
          </div>
        </div>

        {chartPts.length > 0 && (
          <div className="tz-card">
            <span className="tz-label">Tide curve</span>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
              <path d={pathD} fill="none" stroke="#fbbf24" strokeWidth="2" />
              {reqLineY !== null && (
                <line x1={pad} y1={reqLineY} x2={W - pad} y2={reqLineY} stroke="#f87171" strokeWidth="1" strokeDasharray="4,4" />
              )}
              {sorted.map((e, i) => (
                <circle key={i} cx={px(e.t)} cy={py(e.h)} r="3" fill="#eef4fa" />
              ))}
            </svg>
            {reqLineY !== null && <p style={{ fontSize: 10.5, color: '#f87171', marginTop: 4 }}>- - - required tide height for safe UKC</p>}
          </div>
        )}

        <div className="tz-card">
          <span className="tz-label">Check a specific time</span>
          <input className="tz-inp" type="time" value={queryTime} onChange={(e) => setQueryTime(e.target.value)} />
          {queryAvailable !== null && (
            <div className="tz-query-result" style={{ background: queryOk ? 'rgba(52,211,153,.12)' : 'rgba(248,113,113,.12)', color: queryOk ? '#34d399' : '#f87171' }}>
              {queryOk ? '✓ SAFE' : '✗ INSUFFICIENT'} — {queryAvailable.toFixed(2)}m available vs {required.toFixed(2)}m required
            </div>
          )}
        </div>

        {windows.length > 0 && (
          <div className="tz-card">
            <span className="tz-label">Safe windows (available ≥ required)</span>
            {windows.map((w, i) => (
              <div className="tz-window" key={i}>
                <span>{fromMin(w.from)} – {fromMin(w.to)}</span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>{((w.to - w.from) / 60).toFixed(1)}h</span>
              </div>
            ))}
          </div>
        )}

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
