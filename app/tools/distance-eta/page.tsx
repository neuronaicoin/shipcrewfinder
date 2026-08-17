'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  PORTS_SORTED,
  searchPorts,
  haversineDistance,
  initialBearing,
  bearingToCompass,
  type PortCoord,
} from '@/lib/ports-data';

function consumptionAtSpeed(baseRate: number, baseSpeed: number, targetSpeed: number): number {
  if (baseSpeed === 0) return 0;
  const ratio = targetSpeed / baseSpeed;
  return baseRate * Math.pow(ratio, 3);
}

export default function DistanceEtaPage() {
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromPort, setFromPort] = useState<PortCoord | null>(null);
  const [toPort, setToPort] = useState<PortCoord | null>(null);
  const [showFromList, setShowFromList] = useState(false);
  const [showToList, setShowToList] = useState(false);

  const [baseSpeed, setBaseSpeed] = useState('12.5');
  const [consumptionRate, setConsumptionRate] = useState('28');
  const [bunkerPrice, setBunkerPrice] = useState('580');
  const [departure, setDeparture] = useState('');

  const fromResults = useMemo(() => (fromQuery ? searchPorts(fromQuery) : PORTS_SORTED.slice(0, 10)), [fromQuery]);
  const toResults = useMemo(() => (toQuery ? searchPorts(toQuery) : PORTS_SORTED.slice(0, 10)), [toQuery]);

  const distance = fromPort && toPort ? haversineDistance(fromPort.lat, fromPort.lon, toPort.lat, toPort.lon) : null;
  const bearing = fromPort && toPort ? initialBearing(fromPort.lat, fromPort.lon, toPort.lat, toPort.lon) : null;

  const speeds = [10, 12, 14, 16];
  const base = parseFloat(baseSpeed) || 12.5;
  const cons = parseFloat(consumptionRate) || 0;
  const price = parseFloat(bunkerPrice) || 0;

  const speedRows = distance
    ? speeds.map((s) => {
        const days = s > 0 ? distance / (s * 24) : 0;
        const rate = consumptionAtSpeed(cons, base, s);
        const totalFuel = rate * days;
        const totalCost = totalFuel * price;
        let etaLabel = '';
        if (departure && days > 0) {
          const d = new Date(departure);
          d.setTime(d.getTime() + days * 24 * 3600 * 1000);
          etaLabel = d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
        return { speed: s, days, rate, totalFuel, totalCost, etaLabel };
      })
    : [];

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .dz-wrap{max-width:640px;margin:0 auto;padding:28px 18px 60px}
        .dz-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .dz-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .dz-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:22px}
        .dz-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:14px}
        .dz-label{font-size:11.5px;color:#6b83a0;display:block;margin-bottom:5px}
        .dz-inp,.dz-sel{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:11px 13px;color:#eef4fa;font-size:14px;font-family:inherit}
        .dz-inp:focus,.dz-sel:focus{outline:none;border-color:#fbbf24}
        .dz-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .dz-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
        .dz-field{position:relative;margin-bottom:12px}
        .dz-dropdown{position:absolute;top:100%;left:0;right:0;background:#141845;border:1px solid rgba(255,255,255,.12);border-radius:9px;margin-top:4px;max-height:220px;overflow-y:auto;z-index:20}
        .dz-opt{padding:10px 13px;cursor:pointer;font-size:13px;border-bottom:1px solid rgba(255,255,255,.04)}
        .dz-opt:hover{background:rgba(251,191,36,.08)}
        .dz-opt small{color:#6b83a0;display:block;font-size:11px;margin-top:2px}
        .dz-stat-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:6px}
        .dz-stat{flex:1;min-width:120px;background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:12px}
        .dz-stat-label{font-size:10.5px;color:#a8bdd2;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
        .dz-stat-val{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:19px;font-weight:800;color:#fbbf24}
        .dz-tbl{width:100%;border-collapse:collapse;font-size:12.5px}
        .dz-tbl th{text-align:left;color:#6b83a0;font-weight:600;font-size:10.5px;text-transform:uppercase;letter-spacing:.04em;padding:8px 6px;border-bottom:1px solid rgba(255,255,255,.1)}
        .dz-tbl td{padding:9px 6px;border-bottom:1px solid rgba(255,255,255,.05)}
        .dz-tbl td:first-child,.dz-tbl th:first-child{color:#fbbf24;font-weight:700}
        @media(max-width:560px){
          .dz-row3{grid-template-columns:1fr}
          .dz-tbl{font-size:11px}
          .dz-tbl th,.dz-tbl td{padding:7px 4px}
        }
      `}</style>

      <div className="dz-wrap">
        <Link href="/tools" className="dz-back">← All Tools</Link>
        <div className="dz-title">Distance &amp; ETA</div>
        <p className="dz-sub">
          Great-circle distance between two ports, speed/consumption comparison, and estimated arrival if you enter a departure time. Nothing is saved.
        </p>

        <div className="dz-card">
          <div className="dz-field">
            <span className="dz-label">From port</span>
            <input
              className="dz-inp"
              placeholder="Search a port..."
              value={fromPort ? fromPort.name : fromQuery}
              onChange={(e) => { setFromQuery(e.target.value); setFromPort(null); setShowFromList(true); }}
              onFocus={() => setShowFromList(true)}
            />
            {showFromList && !fromPort && (
              <div className="dz-dropdown">
                {fromResults.map((p) => (
                  <div key={p.name + p.country} className="dz-opt" onClick={() => { setFromPort(p); setShowFromList(false); }}>
                    {p.name}<small>{p.country}</small>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dz-field" style={{ marginBottom: 0 }}>
            <span className="dz-label">To port</span>
            <input
              className="dz-inp"
              placeholder="Search a port..."
              value={toPort ? toPort.name : toQuery}
              onChange={(e) => { setToQuery(e.target.value); setToPort(null); setShowToList(true); }}
              onFocus={() => setShowToList(true)}
            />
            {showToList && !toPort && (
              <div className="dz-dropdown">
                {toResults.map((p) => (
                  <div key={p.name + p.country} className="dz-opt" onClick={() => { setToPort(p); setShowToList(false); }}>
                    {p.name}<small>{p.country}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {distance !== null && bearing !== null && (
          <div className="dz-stat-row">
            <div className="dz-stat">
              <div className="dz-stat-label">Distance</div>
              <div className="dz-stat-val">{Math.round(distance).toLocaleString()} nm</div>
            </div>
            <div className="dz-stat">
              <div className="dz-stat-label">Initial bearing</div>
              <div className="dz-stat-val">{Math.round(bearing)}° {bearingToCompass(bearing)}</div>
            </div>
          </div>
        )}

        <div className="dz-card">
          <span className="dz-label">Voyage parameters</span>
          <div className="dz-row3" style={{ marginBottom: 12 }}>
            <div>
              <span className="dz-label">Base speed (kn)</span>
              <input className="dz-inp" value={baseSpeed} onChange={(e) => setBaseSpeed(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="dz-label">Cons. @ base (MT/day)</span>
              <input className="dz-inp" value={consumptionRate} onChange={(e) => setConsumptionRate(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="dz-label">Bunker price ($/MT)</span>
              <input className="dz-inp" value={bunkerPrice} onChange={(e) => setBunkerPrice(e.target.value)} inputMode="decimal" />
            </div>
          </div>
          <span className="dz-label">Departure (optional, for ETA)</span>
          <input className="dz-inp" type="datetime-local" value={departure} onChange={(e) => setDeparture(e.target.value)} />
        </div>

        {speedRows.length > 0 && (
          <div className="dz-card" style={{ overflowX: 'auto' }}>
            <span className="dz-label" style={{ marginBottom: 12, display: 'block' }}>Speed comparison</span>
            <table className="dz-tbl">
              <thead>
                <tr>
                  <th>Speed</th>
                  <th>Days</th>
                  <th>MT/day</th>
                  <th>Total fuel</th>
                  <th>Fuel cost</th>
                  {departure && <th>ETA</th>}
                </tr>
              </thead>
              <tbody>
                {speedRows.map((r) => (
                  <tr key={r.speed}>
                    <td>{r.speed} kn</td>
                    <td>{r.days.toFixed(1)}</td>
                    <td>{r.rate.toFixed(1)}</td>
                    <td>{Math.round(r.totalFuel)} MT</td>
                    <td>${Math.round(r.totalCost).toLocaleString()}</td>
                    {departure && <td>{r.etaLabel}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
