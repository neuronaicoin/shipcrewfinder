'use client';
import { useState } from 'react';
import Link from 'next/link';

interface FuelType { key: string; name: string; co2Factor: number; lcv: number; wtwFactor: number; }
const FUELS: FuelType[] = [
  { key: 'HFO', name: 'HFO (Heavy Fuel Oil)', co2Factor: 3.114, lcv: 40.5, wtwFactor: 91.7 },
  { key: 'VLSFO', name: 'VLSFO (0.5% sulphur)', co2Factor: 3.114, lcv: 40.5, wtwFactor: 91.7 },
  { key: 'ULSFO', name: 'ULSFO (0.1% sulphur)', co2Factor: 3.114, lcv: 40.5, wtwFactor: 91.4 },
  { key: 'LSMGO', name: 'LSMGO', co2Factor: 3.206, lcv: 42.7, wtwFactor: 94.4 },
  { key: 'MGO', name: 'MGO', co2Factor: 3.206, lcv: 42.7, wtwFactor: 94.4 },
  { key: 'MDO', name: 'MDO', co2Factor: 3.206, lcv: 42.7, wtwFactor: 94.4 },
  { key: 'LNG', name: 'LNG', co2Factor: 2.75, lcv: 50.0, wtwFactor: 76.4 },
  { key: 'LPG_P', name: 'LPG (Propane)', co2Factor: 3.0, lcv: 46.0, wtwFactor: 76.3 },
  { key: 'METHANOL_F', name: 'Methanol (Fossil)', co2Factor: 1.375, lcv: 19.9, wtwFactor: 99.1 },
  { key: 'B30', name: 'B30 Biofuel Blend', co2Factor: 2.18, lcv: 41.0, wtwFactor: 63.0 },
];

interface VesselTypeData { key: string; name: string; a: number; c: number; capacityType: 'DWT' | 'GT'; }
const VESSEL_TYPES: VesselTypeData[] = [
  { key: 'BULK', name: 'Bulk Carrier', a: 4745, c: 0.622, capacityType: 'DWT' },
  { key: 'TANKER', name: 'Tanker (Crude/Product)', a: 5247, c: 0.610, capacityType: 'DWT' },
  { key: 'CONTAINER', name: 'Container Ship', a: 1984, c: 0.489, capacityType: 'DWT' },
  { key: 'GAS', name: 'Gas Carrier', a: 8104, c: 0.639, capacityType: 'DWT' },
  { key: 'LNG', name: 'LNG Carrier', a: 9.827, c: 0.0, capacityType: 'GT' },
  { key: 'GENERAL', name: 'General Cargo', a: 31948, c: 0.792, capacityType: 'DWT' },
  { key: 'RORO_CARGO', name: 'Ro-Ro Cargo Ship', a: 10952, c: 0.629, capacityType: 'GT' },
];

const CII_REDUCTION: Record<number, number> = { 2023: 0.05, 2024: 0.07, 2025: 0.09, 2026: 0.11, 2027: 0.135, 2028: 0.16, 2029: 0.185, 2030: 0.21 };
const RATING_THRESHOLDS = { A: 0.86, B: 0.94, C: 1.07, D: 1.19 };
const ETS_PHASE_IN: Record<number, number> = { 2024: 0.4, 2025: 0.7, 2026: 1.0, 2027: 1.0 };
const FUELEU_BASELINE = 91.16;
const FUELEU_REDUCTION: Record<number, number> = { 2025: 0.02, 2026: 0.02, 2027: 0.02, 2028: 0.02, 2029: 0.02, 2030: 0.06, 2035: 0.145, 2040: 0.31, 2045: 0.62, 2050: 0.80 };
const FUELEU_PENALTY = 2400;
const GRADE_COLORS: Record<string, string> = { A: '#34d399', B: '#7ec47d', C: '#fbbf24', D: '#e89c5a', E: '#f87171' };

interface FuelEntry { id: number; fuelType: string; consumption: string; }

export default function CIICalculatorPage() {
  const [vesselType, setVesselType] = useState('BULK');
  const [dwt, setDwt] = useState('76000');
  const [gt, setGt] = useState('42500');
  const [reportingYear, setReportingYear] = useState(2026);
  const [annualDistance, setAnnualDistance] = useState('60000');
  const [voyageDistance, setVoyageDistance] = useState('0');
  const [voyageType, setVoyageType] = useState<'EU_EU' | 'EU_NONEU' | 'NON_EU'>('EU_EU');
  const [euaPrice, setEuaPrice] = useState('78');
  const [applyFuelEU, setApplyFuelEU] = useState(true);
  const [fuels, setFuels] = useState<FuelEntry[]>([{ id: 1, fuelType: 'VLSFO', consumption: '1000' }]);

  const addFuel = () => setFuels((f) => [...f, { id: (f[f.length - 1]?.id || 0) + 1, fuelType: 'VLSFO', consumption: '' }]);
  const removeFuel = (id: number) => setFuels((f) => (f.length > 1 ? f.filter((x) => x.id !== id) : f));
  const updateFuel = (id: number, field: 'fuelType' | 'consumption', val: string) =>
    setFuels((f) => f.map((x) => (x.id === id ? { ...x, [field]: val } : x)));

  let totalCo2Mt = 0, totalEnergyMJ = 0, totalWtwCo2eqG = 0;
  fuels.forEach((f) => {
    const fuel = FUELS.find((x) => x.key === f.fuelType);
    const cons = parseFloat(f.consumption) || 0;
    if (!fuel || !cons) return;
    totalCo2Mt += cons * fuel.co2Factor;
    totalEnergyMJ += cons * 1000 * fuel.lcv;
    totalWtwCo2eqG += cons * 1000 * fuel.lcv * fuel.wtwFactor;
  });

  const vType = VESSEL_TYPES.find((v) => v.key === vesselType)!;
  const capacity = vType.capacityType === 'DWT' ? parseFloat(dwt) || 0 : parseFloat(gt) || 0;
  const annDist = parseFloat(annualDistance) || 0;
  const voyDist = parseFloat(voyageDistance) || 0;

  let ciiGrade: 'A' | 'B' | 'C' | 'D' | 'E' | null = null;
  let attainedCII = 0, requiredCII = 0, ciiRatio = 0;
  if (capacity > 0 && annDist > 0) {
    const ciiRef = vType.a * Math.pow(capacity, -vType.c);
    const reduction = CII_REDUCTION[reportingYear] || 0.11;
    requiredCII = ciiRef * (1 - reduction);
    const distanceFactor = voyDist > 0 ? annDist / voyDist : 1;
    const annualCo2Mt = totalCo2Mt * distanceFactor;
    const transportWork = capacity * annDist;
    if (transportWork > 0) {
      attainedCII = (annualCo2Mt * 1_000_000) / transportWork;
      ciiRatio = requiredCII > 0 ? attainedCII / requiredCII : 0;
      if (ciiRatio < RATING_THRESHOLDS.A) ciiGrade = 'A';
      else if (ciiRatio < RATING_THRESHOLDS.B) ciiGrade = 'B';
      else if (ciiRatio < RATING_THRESHOLDS.C) ciiGrade = 'C';
      else if (ciiRatio < RATING_THRESHOLDS.D) ciiGrade = 'D';
      else ciiGrade = 'E';
    }
  }

  const etsCoveragePct = voyageType === 'EU_EU' ? 1.0 : voyageType === 'EU_NONEU' ? 0.5 : 0;
  const etsPhaseIn = ETS_PHASE_IN[reportingYear] || 1.0;
  const etsCoveredCo2 = totalCo2Mt * etsCoveragePct * etsPhaseIn;
  const etsCost = etsCoveredCo2 * (parseFloat(euaPrice) || 0);

  let fuelEuStatus: 'compliant' | 'deficit' | 'na' = 'na';
  let fuelEuPenalty = 0;
  let fuelEuActualIntensity = 0;
  if (applyFuelEU && totalEnergyMJ > 0) {
    fuelEuActualIntensity = totalWtwCo2eqG / totalEnergyMJ;
    const reduction = FUELEU_REDUCTION[reportingYear] || 0.02;
    const fuelEuRequiredIntensity = FUELEU_BASELINE * (1 - reduction);
    const compliance = fuelEuRequiredIntensity - fuelEuActualIntensity;
    if (compliance < 0) {
      const deficitMJ = -compliance * totalEnergyMJ;
      const vlsfoEquivMt = deficitMJ / 40.5 / 1000;
      fuelEuPenalty = vlsfoEquivMt * FUELEU_PENALTY;
      fuelEuStatus = 'deficit';
    } else {
      fuelEuStatus = 'compliant';
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .cz-wrap{max-width:640px;margin:0 auto;padding:28px 18px 60px}
        .cz-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .cz-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .cz-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:22px}
        .cz-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:14px}
        .cz-label{font-size:11px;color:#6b83a0;text-transform:uppercase;letter-spacing:.06em;font-weight:700;display:block;margin-bottom:10px}
        .cz-field-label{font-size:11.5px;color:#6b83a0;display:block;margin-bottom:5px}
        .cz-inp,.cz-sel{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:10px 12px;color:#eef4fa;font-size:13.5px;font-family:inherit}
        .cz-sel option{background:#141845;color:#eef4fa}
        .cz-inp:focus,.cz-sel:focus{outline:none;border-color:#fbbf24}
        .cz-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
        .cz-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px}
        .cz-fuel-row{display:grid;grid-template-columns:2fr 1fr 32px;gap:8px;align-items:center;margin-bottom:8px}
        .cz-rm{background:none;border:none;color:#6b83a0;cursor:pointer;font-size:16px}
        .cz-rm:hover{color:#f87171}
        .cz-add{background:rgba(255,255,255,.04);border:1px dashed rgba(255,255,255,.2);color:#a8bdd2;border-radius:9px;padding:9px;width:100%;cursor:pointer;font-size:12.5px;font-weight:600;font-family:inherit}
        .cz-add:hover{border-color:#fbbf24;color:#fbbf24}
        .cz-toggle{display:flex;align-items:center;gap:10px;margin-top:4px}
        .cz-grade-card{border-radius:16px;padding:22px;text-align:center;margin-bottom:14px}
        .cz-grade-letter{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:52px;font-weight:800;line-height:1}
        .cz-grade-sub{font-size:12px;margin-top:4px;opacity:.85}
        .cz-stat-row{display:flex;gap:10px;flex-wrap:wrap}
        .cz-stat{flex:1;min-width:130px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px}
        .cz-stat-label{font-size:10.5px;color:#a8bdd2;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}
        .cz-stat-val{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:17px;font-weight:800}
        @media(max-width:560px){ .cz-row2,.cz-row3{grid-template-columns:1fr} }
      `}</style>

      <div className="cz-wrap">
        <Link href="/tools" className="cz-back">← All Tools</Link>
        <div className="cz-title">CII / EU ETS / FuelEU Calculator</div>
        <p className="cz-sub">
          Carbon Intensity Indicator rating, EU ETS cost estimate, and FuelEU Maritime compliance — based on IMO MEPC.353(78) and current EU regulation. Nothing is saved.
        </p>

        <div className="cz-card">
          <span className="cz-label">Vessel</span>
          <div className="cz-row2">
            <div>
              <span className="cz-field-label">Vessel type</span>
              <select className="cz-sel" value={vesselType} onChange={(e) => setVesselType(e.target.value)}>
                {VESSEL_TYPES.map((v) => <option key={v.key} value={v.key}>{v.name}</option>)}
              </select>
            </div>
            <div>
              <span className="cz-field-label">Reporting year</span>
              <select className="cz-sel" value={reportingYear} onChange={(e) => setReportingYear(parseInt(e.target.value))}>
                {[2024, 2025, 2026, 2027, 2028].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div className="cz-row2">
            <div>
              <span className="cz-field-label">DWT</span>
              <input className="cz-inp" value={dwt} onChange={(e) => setDwt(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="cz-field-label">GT</span>
              <input className="cz-inp" value={gt} onChange={(e) => setGt(e.target.value)} inputMode="decimal" />
            </div>
          </div>
          <div className="cz-row2" style={{ marginBottom: 0 }}>
            <div>
              <span className="cz-field-label">Annual distance (nm)</span>
              <input className="cz-inp" value={annualDistance} onChange={(e) => setAnnualDistance(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="cz-field-label">This voyage distance (nm)</span>
              <input className="cz-inp" value={voyageDistance} onChange={(e) => setVoyageDistance(e.target.value)} inputMode="decimal" />
            </div>
          </div>
        </div>

        <div className="cz-card">
          <span className="cz-label">Fuel consumption</span>
          {fuels.map((f) => (
            <div className="cz-fuel-row" key={f.id}>
              <select className="cz-sel" value={f.fuelType} onChange={(e) => updateFuel(f.id, 'fuelType', e.target.value)}>
                {FUELS.map((fl) => <option key={fl.key} value={fl.key}>{fl.name}</option>)}
              </select>
              <input className="cz-inp" placeholder="MT" value={f.consumption} onChange={(e) => updateFuel(f.id, 'consumption', e.target.value)} inputMode="decimal" />
              <button className="cz-rm" onClick={() => removeFuel(f.id)} aria-label="Remove">✕</button>
            </div>
          ))}
          <button className="cz-add" onClick={addFuel}>+ Add fuel</button>
        </div>

        <div className="cz-card">
          <span className="cz-label">EU ETS</span>
          <div className="cz-row2">
            <div>
              <span className="cz-field-label">Voyage type</span>
              <select className="cz-sel" value={voyageType} onChange={(e) => setVoyageType(e.target.value as typeof voyageType)}>
                <option value="EU_EU">Intra-EU (100% covered)</option>
                <option value="EU_NONEU">EU ↔ Non-EU (50% covered)</option>
                <option value="NON_EU">Non-EU (0% covered)</option>
              </select>
            </div>
            <div>
              <span className="cz-field-label">EUA price (€/tCO₂)</span>
              <input className="cz-inp" value={euaPrice} onChange={(e) => setEuaPrice(e.target.value)} inputMode="decimal" />
            </div>
          </div>
          <div className="cz-toggle">
            <input type="checkbox" checked={applyFuelEU} onChange={(e) => setApplyFuelEU(e.target.checked)} id="fueleu" />
            <label htmlFor="fueleu" style={{ fontSize: 12.5, color: '#a8bdd2' }}>Include FuelEU Maritime compliance</label>
          </div>
        </div>

        {ciiGrade && (
          <div className="cz-grade-card" style={{ background: `${GRADE_COLORS[ciiGrade]}18`, border: `1px solid ${GRADE_COLORS[ciiGrade]}55` }}>
            <div className="cz-grade-letter" style={{ color: GRADE_COLORS[ciiGrade] }}>{ciiGrade}</div>
            <div className="cz-grade-sub" style={{ color: GRADE_COLORS[ciiGrade] }}>
              CII rating · {attainedCII.toFixed(2)} vs required {requiredCII.toFixed(2)} gCO₂/DWT·nm ({(ciiRatio * 100).toFixed(0)}%)
            </div>
          </div>
        )}

        <div className="cz-stat-row" style={{ marginBottom: 14 }}>
          <div className="cz-stat">
            <div className="cz-stat-label">Total CO₂ (this voyage)</div>
            <div className="cz-stat-val" style={{ color: '#fbbf24' }}>{totalCo2Mt.toFixed(1)} MT</div>
          </div>
          <div className="cz-stat">
            <div className="cz-stat-label">Est. EU ETS cost</div>
            <div className="cz-stat-val" style={{ color: '#fbbf24' }}>€{Math.round(etsCost).toLocaleString()}</div>
          </div>
        </div>

        {applyFuelEU && fuelEuStatus !== 'na' && (
          <div className="cz-card" style={{ borderColor: fuelEuStatus === 'compliant' ? 'rgba(52,211,153,.3)' : 'rgba(248,113,113,.3)' }}>
            <span className="cz-label">FuelEU Maritime</span>
            <div className="cz-stat-row">
              <div className="cz-stat">
                <div className="cz-stat-label">GHG intensity</div>
                <div className="cz-stat-val">{fuelEuActualIntensity.toFixed(1)} gCO₂eq/MJ</div>
              </div>
              <div className="cz-stat">
                <div className="cz-stat-label">Status</div>
                <div className="cz-stat-val" style={{ color: fuelEuStatus === 'compliant' ? '#34d399' : '#f87171' }}>
                  {fuelEuStatus === 'compliant' ? 'Compliant' : `Deficit — €${Math.round(fuelEuPenalty).toLocaleString()}`}
                </div>
              </div>
            </div>
          </div>
        )}

        <p style={{ fontSize: 11, color: '#4a5568', lineHeight: 1.6, marginTop: 8 }}>
          Reference: IMO MEPC.353(78) CII formula, MEPC.339(76) rating boundaries, EU ETS Directive 2023/959, FuelEU Maritime Regulation (EU) 2023/1805. Figures are estimates for planning purposes.
        </p>

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
