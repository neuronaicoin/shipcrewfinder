'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function DraftSurveyPage() {
  const [dFwd, setDFwd] = useState('');
  const [dMid, setDMid] = useState('');
  const [dAft, setDAft] = useState('');
  const [lbp, setLbp] = useState('');
  const [lcf, setLcf] = useState('');
  const [tpc, setTpc] = useState('');
  const [dispTable, setDispTable] = useState('');
  const [actualDensity, setActualDensity] = useState('1.025');
  const [lightship, setLightship] = useState('');
  const [constant, setConstant] = useState('');
  const [fuelOil, setFuelOil] = useState('');
  const [dieselOil, setDieselOil] = useState('');
  const [freshWater, setFreshWater] = useState('');
  const [ballastWater, setBallastWater] = useState('');
  const [otherDeduct, setOtherDeduct] = useState('');

  const n = (v: string) => parseFloat(v) || 0;

  const fwd = n(dFwd), mid = n(dMid), aft = n(dAft);
  const hasDrafts = dFwd !== '' && dMid !== '' && dAft !== '';

  // Trim (m) — positive = trim by stern
  const trim = aft - fwd;

  // Quadratic mean draft (Nemoto's formula) — corrects for hog/sag
  const quadraticMean = mid + (fwd + aft - 2 * mid) / 6;

  // First trim correction (cm), applied at LCF position
  const lbpN = n(lbp), lcfN = n(lcf), tpcN = n(tpc);
  const firstTrimCorrCm = lbpN > 0 ? (lcfN * trim * 100) / lbpN : 0;
  const correctedMeanDraft = quadraticMean + firstTrimCorrCm / 100;

  // Density correction on displacement
  const dispTableN = n(dispTable);
  const densityN = n(actualDensity) || 1.025;
  const densityCorrectedDisp = dispTableN > 0 ? dispTableN * (densityN / 1.025) : 0;

  // Deductibles
  const lightshipN = n(lightship);
  const constantN = n(constant);
  const deductibles = n(fuelOil) + n(dieselOil) + n(freshWater) + n(ballastWater) + n(otherDeduct);
  const cargoQty = densityCorrectedDisp - lightshipN - constantN - deductibles;

  const hasResult = hasDrafts && lbpN > 0 && dispTableN > 0;

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .ds-wrap{max-width:680px;margin:0 auto;padding:28px 18px 60px}
        .ds-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .ds-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .ds-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:22px}
        .ds-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:14px}
        .ds-label{font-size:11px;color:#6b83a0;text-transform:uppercase;letter-spacing:.06em;font-weight:700;display:block;margin-bottom:10px}
        .ds-step{font-size:9.5px;color:#fbbf24;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:2px}
        .ds-field-label{font-size:11px;color:#6b83a0;display:block;margin-bottom:4px}
        .ds-inp{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:9px 11px;color:#eef4fa;font-size:13px;font-family:inherit}
        .ds-inp:focus{outline:none;border-color:#fbbf24}
        .ds-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px}
        .ds-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
        .ds-calc-line{display:flex;justify-content:space-between;font-size:12.5px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.06)}
        .ds-calc-line b{color:#fbbf24;font-weight:700}
        .ds-hero{border-radius:16px;padding:24px;text-align:center;margin:14px 0;background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.35)}
        .ds-hero-val{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:32px;font-weight:800;color:#34d399}
        .ds-hero-lbl{font-size:11.5px;color:#34d399;margin-top:4px}
        @media(max-width:560px){ .ds-row3,.ds-row2{grid-template-columns:1fr} }
      `}</style>

      <div className="ds-wrap">
        <Link href="/tools" className="ds-back">← All Tools</Link>
        <div className="ds-title">Draft Survey Calculator</div>
        <p className="ds-sub">
          Standard draft survey method — quadratic mean draft (hog/sag corrected), first trim correction, density correction, and final cargo quantity. Every step shown so you can verify against your vessel&apos;s procedure. Nothing is saved.
        </p>

        <div className="ds-card">
          <div className="ds-step">Step 1</div>
          <span className="ds-label">Observed drafts (m)</span>
          <div className="ds-row3" style={{ marginBottom: 0 }}>
            <div>
              <span className="ds-field-label">Forward</span>
              <input className="ds-inp" value={dFwd} onChange={(e) => setDFwd(e.target.value)} inputMode="decimal" placeholder="e.g. 8.42" />
            </div>
            <div>
              <span className="ds-field-label">Midship</span>
              <input className="ds-inp" value={dMid} onChange={(e) => setDMid(e.target.value)} inputMode="decimal" placeholder="e.g. 8.90" />
            </div>
            <div>
              <span className="ds-field-label">Aft</span>
              <input className="ds-inp" value={dAft} onChange={(e) => setDAft(e.target.value)} inputMode="decimal" placeholder="e.g. 9.38" />
            </div>
          </div>
        </div>

        <div className="ds-card">
          <div className="ds-step">Step 2</div>
          <span className="ds-label">Vessel particulars (from stability book, at approx. draft)</span>
          <div className="ds-row3" style={{ marginBottom: 0 }}>
            <div>
              <span className="ds-field-label">LBP (m)</span>
              <input className="ds-inp" value={lbp} onChange={(e) => setLbp(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="ds-field-label">LCF (m from midship)</span>
              <input className="ds-inp" value={lcf} onChange={(e) => setLcf(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="ds-field-label">TPC</span>
              <input className="ds-inp" value={tpc} onChange={(e) => setTpc(e.target.value)} inputMode="decimal" />
            </div>
          </div>
        </div>

        {hasDrafts && lbpN > 0 && (
          <div className="ds-card">
            <span className="ds-label">Corrected mean draft</span>
            <div className="ds-calc-line"><span>Trim (Aft − Fwd)</span><b>{trim.toFixed(3)} m</b></div>
            <div className="ds-calc-line"><span>Quadratic mean draft (hog/sag corrected)</span><b>{quadraticMean.toFixed(3)} m</b></div>
            <div className="ds-calc-line"><span>First trim correction</span><b>{firstTrimCorrCm.toFixed(2)} cm</b></div>
            <div className="ds-calc-line" style={{ borderBottom: 'none' }}><span>Corrected mean draft (look this up in your hydrostatic table)</span><b>{correctedMeanDraft.toFixed(3)} m</b></div>
          </div>
        )}

        <div className="ds-card">
          <div className="ds-step">Step 3</div>
          <span className="ds-label">Displacement at corrected mean draft</span>
          <span className="ds-field-label">Look up displacement in your ship&apos;s hydrostatic table at the corrected mean draft above, then enter it here</span>
          <div className="ds-row2">
            <div>
              <span className="ds-field-label">Displacement from table (MT)</span>
              <input className="ds-inp" value={dispTable} onChange={(e) => setDispTable(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="ds-field-label">Actual dock water density (t/m³)</span>
              <input className="ds-inp" value={actualDensity} onChange={(e) => setActualDensity(e.target.value)} inputMode="decimal" />
            </div>
          </div>
          {dispTableN > 0 && (
            <div className="ds-calc-line" style={{ borderBottom: 'none', marginTop: 4 }}>
              <span>Density-corrected displacement</span><b>{densityCorrectedDisp.toFixed(1)} MT</b>
            </div>
          )}
        </div>

        <div className="ds-card">
          <div className="ds-step">Step 4</div>
          <span className="ds-label">Deductibles</span>
          <div className="ds-row3">
            <div>
              <span className="ds-field-label">Lightship (MT)</span>
              <input className="ds-inp" value={lightship} onChange={(e) => setLightship(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="ds-field-label">Constant (MT)</span>
              <input className="ds-inp" value={constant} onChange={(e) => setConstant(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="ds-field-label">Fuel oil (MT)</span>
              <input className="ds-inp" value={fuelOil} onChange={(e) => setFuelOil(e.target.value)} inputMode="decimal" />
            </div>
          </div>
          <div className="ds-row3" style={{ marginBottom: 0 }}>
            <div>
              <span className="ds-field-label">Diesel oil (MT)</span>
              <input className="ds-inp" value={dieselOil} onChange={(e) => setDieselOil(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="ds-field-label">Fresh water (MT)</span>
              <input className="ds-inp" value={freshWater} onChange={(e) => setFreshWater(e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <span className="ds-field-label">Ballast water (MT)</span>
              <input className="ds-inp" value={ballastWater} onChange={(e) => setBallastWater(e.target.value)} inputMode="decimal" />
            </div>
          </div>
          <span className="ds-field-label" style={{ marginTop: 8 }}>Other deductibles (MT)</span>
          <input className="ds-inp" value={otherDeduct} onChange={(e) => setOtherDeduct(e.target.value)} inputMode="decimal" />
        </div>

        {hasResult && (
          <div className="ds-hero">
            <div className="ds-hero-val">{cargoQty.toFixed(1)} MT</div>
            <div className="ds-hero-lbl">Estimated cargo quantity</div>
          </div>
        )}

        <p style={{ fontSize: 11, color: '#4a5568', lineHeight: 1.6, marginTop: 8 }}>
          Method: quadratic mean draft (Nemoto&apos;s formula) + first trim correction at LCF. This does not include the second trim correction (layer correction for change of TPC with draft) — for high-precision surveys, apply this manually per your vessel&apos;s hydrostatic particulars. Always cross-check against your approved draft survey procedure; this tool is for planning and verification support only.
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
