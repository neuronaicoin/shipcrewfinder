'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type CategoryKey = 'power' | 'speed' | 'volume' | 'weight' | 'length' | 'pressure' | 'temp';

const FACTORS: Record<CategoryKey, { label: string; units: Record<string, number> }> = {
  power: { label: 'Power', units: { kW: 1, HP: 1.34102, BHP: 1.34102 } },
  speed: { label: 'Speed', units: { Knots: 1, 'km/h': 1.852, mph: 1.15078 } },
  volume: { label: 'Volume', units: { 'm³': 1, Barrel: 6.28981, 'US Gal': 264.172 } },
  weight: { label: 'Weight', units: { MT: 1, LT: 0.984207, kg: 1000, lbs: 2204.62 } },
  length: { label: 'Length', units: { Metre: 1, Feet: 3.28084, Fathom: 0.546807 } },
  pressure: { label: 'Pressure', units: { Bar: 1, PSI: 14.5038, kPa: 100 } },
  temp: { label: 'Temperature', units: { '°C': 1, '°F': 1 } },
};

export default function UnitConverterPage() {
  const [cat, setCat] = useState<CategoryKey>('power');
  const [fromVal, setFromVal] = useState('100');
  const [fromUnit, setFromUnit] = useState('kW');
  const [toUnit, setToUnit] = useState('HP');

  const units = Object.keys(FACTORS[cat].units);

  useEffect(() => {
    setFromUnit(units[0]);
    setToUnit(units.length > 1 ? units[1] : units[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat]);

  const v = parseFloat(fromVal);
  let result: number | null = null;
  if (!isNaN(v)) {
    if (cat === 'temp') {
      const c = fromUnit === '°C' ? v : ((v - 32) * 5) / 9;
      result = toUnit === '°C' ? c : (c * 9) / 5 + 32;
    } else {
      const u = FACTORS[cat].units;
      const base = v / u[fromUnit];
      result = base * u[toUnit];
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .uc-wrap{max-width:460px;margin:0 auto;padding:28px 18px 60px}
        .uc-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .uc-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .uc-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:24px}
        .uc-label{font-size:11.5px;color:#6b83a0;display:block;margin-bottom:5px}
        .uc-select,.uc-inp{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:11px 13px;color:#eef4fa;font-size:15px;font-family:inherit}
        .uc-select:focus,.uc-inp:focus{outline:none;border-color:#fbbf24}
        .uc-cat{margin-bottom:18px}
        .uc-row{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:end;margin-bottom:16px}
        .uc-arrow{padding-bottom:11px;color:#6b83a0;font-size:18px;text-align:center}
        .uc-gap{height:6px}
        .uc-result-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(251,191,36,.25);border-radius:14px;padding:22px;text-align:center}
        .uc-result-val{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:30px;font-weight:800;color:#fbbf24}
        .uc-result-unit{font-size:15px;color:#a8bdd2;margin-left:8px;font-weight:600}
      `}</style>

      <div className="uc-wrap">
        <Link href="/tools" className="uc-back">← All Tools</Link>
        <div className="uc-title">Unit Converter</div>
        <p className="uc-sub">Power, speed, volume, weight, length, temperature and pressure — the conversions you need on watch.</p>

        <div className="uc-cat">
          <span className="uc-label">Category</span>
          <select className="uc-select" value={cat} onChange={(e) => setCat(e.target.value as CategoryKey)}>
            {(Object.keys(FACTORS) as CategoryKey[]).map((k) => (
              <option key={k} value={k}>{FACTORS[k].label}</option>
            ))}
          </select>
        </div>

        <div className="uc-row">
          <div>
            <span className="uc-label">From</span>
            <input className="uc-inp" value={fromVal} onChange={(e) => setFromVal(e.target.value)} inputMode="decimal" style={{ marginBottom: 6 }} />
            <select className="uc-select" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
              {units.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="uc-arrow">→</div>
          <div>
            <span className="uc-label">To</span>
            <div className="uc-gap" style={{ height: 43 }} />
            <select className="uc-select" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
              {units.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="uc-result-card">
          <span className="uc-result-val">{result !== null ? result.toFixed(3) : '—'}</span>
          {result !== null && <span className="uc-result-unit">{toUnit}</span>}
        </div>
      </div>
    </main>
  );
}
