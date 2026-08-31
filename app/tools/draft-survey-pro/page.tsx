'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function n(v: string) { const x = parseFloat(String(v).replace(',', '.')); return isNaN(x) ? 0 : x; }
function r(v: number, d: number) { const m = Math.pow(10, d); return Math.round(v * m) / m; }

interface HydroRow { draft: number; disp: number; tpc: number; mtc: number; lcf: number; }

function interp(table: HydroRow[], draft: number, key: 'disp' | 'tpc' | 'mtc' | 'lcf'): number | null {
  if (table.length === 0) return null;
  const sorted = [...table].sort((a, b) => a.draft - b.draft);
  if (draft <= sorted[0].draft) return sorted[0][key];
  if (draft >= sorted[sorted.length - 1].draft) return sorted[sorted.length - 1][key];
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i], b = sorted[i + 1];
    if (a.draft <= draft && draft <= b.draft) {
      if (b.draft === a.draft) return a[key];
      return a[key] + (b[key] - a[key]) / (b.draft - a.draft) * (draft - a.draft);
    }
  }
  return null;
}

interface SideInputs {
  stbdFwd: string; stbdMid: string; stbdAft: string;
  portFwd: string; portMid: string; portAft: string;
  distFwd: string; distMid: string; distAft: string;
  density: string; listHeel: string;
  waterBallast: string; freshWater: string; bunkers: string; others: string;
}

function emptySide(): SideInputs {
  return { stbdFwd: '', stbdMid: '', stbdAft: '', portFwd: '', portMid: '', portAft: '', distFwd: '', distMid: '', distAft: '', density: '1.025', listHeel: '0', waterBallast: '', freshWater: '', bunkers: '', others: '0' };
}

function calcSide(s: SideInputs, lbp: number, keel: number, lcfRef: number, hydro: HydroRow[]) {
  const mean = { fwd: (n(s.stbdFwd) + n(s.portFwd)) / 2, mid: (n(s.stbdMid) + n(s.portMid)) / 2, aft: (n(s.stbdAft) + n(s.portAft)) / 2 };
  const LBDM = lbp + n(s.distFwd) - n(s.distAft);
  const trimRaw = mean.aft - mean.fwd;
  const corr = { fwd: r(n(s.distFwd) * trimRaw / LBDM, 3), mid: r(n(s.distMid) * trimRaw / LBDM, 3), aft: r(n(s.distAft) * trimRaw / LBDM, 3) };
  const corrected = { fwd: mean.fwd + corr.fwd, mid: mean.mid + corr.mid, aft: mean.aft + corr.aft };
  const meanFA = r((corrected.fwd + corrected.aft) / 2, 3);
  const hogSag: 'Hogging' | 'Sagging' = meanFA > corrected.mid ? 'Hogging' : 'Sagging';
  const hogSagVal = Math.abs(corrected.mid - meanFA);
  const quarterMean = r((6 * corrected.mid + corrected.fwd + corrected.aft) / 8, 3);
  const qmTablet = quarterMean - keel;
  const trimPrime = corrected.aft - corrected.fwd;

  const dispAtQM = interp(hydro, qmTablet, 'disp');
  const TPC = interp(hydro, qmTablet, 'tpc');
  const LCF = interp(hydro, qmTablet, 'lcf');
  const MCTCplus = interp(hydro, qmTablet + 0.5, 'mtc');
  const MCTCminus = interp(hydro, qmTablet - 0.5, 'mtc');
  const DMDZ = (MCTCplus != null && MCTCminus != null) ? MCTCplus - MCTCminus : null;

  const trim1corr = (TPC != null && LCF != null) ? r(trimPrime * TPC * LCF * 100 / lbp, 1) : null;
  const trim2corr = (DMDZ != null) ? r(trimPrime * trimPrime * DMDZ * 50 / lbp, 1) : null;
  const trimCorrDisp = (dispAtQM != null && trim1corr != null && trim2corr != null) ? dispAtQM + trim1corr + trim2corr : null;

  const densObs = n(s.density);
  const densCorr = trimCorrDisp != null ? r(((densObs - 1.025) / 1.025) * trimCorrDisp, 1) : null;
  const correctedDisp = (trimCorrDisp != null && densCorr != null) ? trimCorrDisp + densCorr : null;

  const deductibles = n(s.waterBallast) + n(s.freshWater) + n(s.bunkers) + n(s.others);
  const netDisp = correctedDisp != null ? correctedDisp - deductibles : null;

  const warnings: string[] = [];
  if (Math.abs(trimRaw) > lbp * 0.06) warnings.push(`Unusually large trim (${trimRaw.toFixed(2)}m) — please double-check FWD/AFT readings.`);
  if (hogSagVal > 0.15) warnings.push(`${hogSag} of ${hogSagVal.toFixed(3)}m is larger than typically expected — verify MID draft reading.`);
  if (Math.abs(n(s.stbdFwd) - n(s.portFwd)) > 0.3) warnings.push('Large STBD/PORT difference at FWD — check for misread or genuine list.');
  if (Math.abs(n(s.stbdMid) - n(s.portMid)) > 0.3) warnings.push('Large STBD/PORT difference at MID — check for misread or genuine list.');
  if (Math.abs(n(s.stbdAft) - n(s.portAft)) > 0.3) warnings.push('Large STBD/PORT difference at AFT — check for misread or genuine list.');
  if (Math.abs(n(s.listHeel)) > 0.5) warnings.push(`List/Heel of ${n(s.listHeel)}° recorded — this tool averages PORT/STBD readings, which compensates for small list, but a significant list should be verified against your vessel's stability booklet procedure.`);

  return { mean, LBDM, trimRaw, corr, corrected, meanFA, hogSag, hogSagVal, quarterMean, qmTablet, trimPrime, dispAtQM, TPC, LCF, MCTCplus, MCTCminus, DMDZ, trim1corr, trim2corr, trimCorrDisp, densCorr, correctedDisp, deductibles, netDisp, warnings };
}

async function loadJsPdf() {
  if ((window as any).jspdf) return (window as any).jspdf;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load PDF library'));
    document.body.appendChild(script);
  });
  return (window as any).jspdf;
}

const DS_TRIAL_MAX_SURVEYS = 1;
const DS_TRIAL_PRICE = '$29.90 / year';
const DS_TRIAL_STORAGE_KEY = 'scf-draft-survey-trial';

export default function DraftSurveyCalcPage() {
  const [step, setStep] = useState<'setup' | 'main'>('setup');

  const [vessel, setVessel] = useState({ name: '', imo: '', grt: '', nrt: '', loa: '', lbp: '', breadth: '', dwt: '', summerDraft: '', yearBuilt: '', shipyard: '' });
  const [keel, setKeel] = useState('0.018');
  const [lcfRefOverride, setLcfRefOverride] = useState('');
  const [hydro, setHydro] = useState<HydroRow[]>([]);
  const [pasteText, setPasteText] = useState('');
  const [pasteError, setPasteError] = useState('');
  const [profiles, setProfiles] = useState<Array<{ id: string; label: string; vessel: typeof vessel; keel: string; lcfRefOverride: string; hydro: HydroRow[] }>>([]);
  const [activeProfileId, setActiveProfileId] = useState('');

  const [location, setLocation] = useState('');
  const [fileNo, setFileNo] = useState('');
  const [cargoDesc, setCargoDesc] = useState('');
  const [initDate, setInitDate] = useState('');
  const [finalDate, setFinalDate] = useState('');
  const [initSea, setInitSea] = useState('');
  const [finalSea, setFinalSea] = useState('');

  const [initial, setInitial] = useState<SideInputs>(emptySide());
  const [final_, setFinal] = useState<SideInputs>(emptySide());
  const [lightShip, setLightShip] = useState('');
  const [declaredConstant, setDeclaredConstant] = useState('');
  const [blQty, setBlQty] = useState('');
  const [commenceDate, setCommenceDate] = useState('');
  const [completeDate, setCompleteDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [chiefOfficerName, setChiefOfficerName] = useState('');
  const [surveyorName, setSurveyorName] = useState('');
  const [pdfBusy, setPdfBusy] = useState(false);
  const [history, setHistory] = useState<Array<{ id: string; date: string; vessel: string; location: string; cargo: number }>>([]);
  const [trialSurveyCount, setTrialSurveyCount] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [surveySaved, setSurveySaved] = useState(false);

  useEffect(() => {
    try {
      const rawProfiles = localStorage.getItem('scf-draft-survey-profiles');
      if (rawProfiles) setProfiles(JSON.parse(rawProfiles));
      const rawActive = localStorage.getItem('scf-draft-survey-active-id');
      if (rawActive) setActiveProfileId(rawActive);
      const rawSurvey = localStorage.getItem('scf-draft-survey-current');
      if (rawSurvey) {
        const s = JSON.parse(rawSurvey);
        if (s.location) setLocation(s.location);
        if (s.fileNo) setFileNo(s.fileNo);
        if (s.cargoDesc) setCargoDesc(s.cargoDesc);
        if (s.initDate) setInitDate(s.initDate);
        if (s.finalDate) setFinalDate(s.finalDate);
        if (s.initSea) setInitSea(s.initSea);
        if (s.finalSea) setFinalSea(s.finalSea);
        if (s.initial) setInitial(s.initial);
        if (s.final_) setFinal(s.final_);
        if (s.lightShip) setLightShip(s.lightShip);
        if (s.declaredConstant) setDeclaredConstant(s.declaredConstant);
        if (s.blQty) setBlQty(s.blQty);
        if (s.commenceDate) setCommenceDate(s.commenceDate);
        if (s.completeDate) setCompleteDate(s.completeDate);
        if (s.remarks) setRemarks(s.remarks);
        if (s.chiefOfficerName) setChiefOfficerName(s.chiefOfficerName);
        if (s.surveyorName) setSurveyorName(s.surveyorName);
      }
      const rawHistory = localStorage.getItem('scf-draft-survey-history');
      if (rawHistory) setHistory(JSON.parse(rawHistory));
      const rawTrial = localStorage.getItem(DS_TRIAL_STORAGE_KEY);
      if (rawTrial) setTrialSurveyCount(Number(rawTrial) || 0);
      if (rawProfiles && rawActive) {
        const list = JSON.parse(rawProfiles);
        const active = list.find((p: any) => p.id === rawActive);
        if (active) {
          setVessel(active.vessel); setKeel(active.keel); setLcfRefOverride(active.lcfRefOverride); setHydro(active.hydro);
        }
      }
    } catch { /* ignore */ }
  }, []);

  function saveProfile(asNew: boolean) {
    const id = asNew ? `p_${Date.now()}` : (activeProfileId || `p_${Date.now()}`);
    const label = vessel.name || 'Unnamed Vessel';
    const newProfile = { id, label, vessel, keel, lcfRefOverride, hydro };
    const next = asNew ? [...profiles, newProfile] : profiles.map((p) => (p.id === id ? newProfile : p));
    const finalList = next.some((p) => p.id === id) ? next : [...next, newProfile];
    setProfiles(finalList);
    setActiveProfileId(id);
    try {
      localStorage.setItem('scf-draft-survey-profiles', JSON.stringify(finalList));
      localStorage.setItem('scf-draft-survey-active-id', id);
    } catch { /* ignore */ }
  }

  function loadProfile(id: string) {
    const p = profiles.find((x) => x.id === id);
    if (!p) return;
    setVessel(p.vessel); setKeel(p.keel); setLcfRefOverride(p.lcfRefOverride); setHydro(p.hydro);
    setActiveProfileId(id);
    try { localStorage.setItem('scf-draft-survey-active-id', id); } catch { /* ignore */ }
  }

  function deleteProfile(id: string) {
    const next = profiles.filter((p) => p.id !== id);
    setProfiles(next);
    if (activeProfileId === id) setActiveProfileId('');
    try { localStorage.setItem('scf-draft-survey-profiles', JSON.stringify(next)); } catch { /* ignore */ }
  }

  function saveSurveyProgress() {
    try {
      localStorage.setItem('scf-draft-survey-current', JSON.stringify({
        location, fileNo, cargoDesc, initDate, finalDate, initSea, finalSea, initial, final_,
        lightShip, declaredConstant, blQty, commenceDate, completeDate, remarks, chiefOfficerName, surveyorName,
      }));
      setSurveySaved(true);
      setTimeout(() => setSurveySaved(false), 1500);
    } catch { /* ignore */ }
  }

  function saveToHistory() {
    if (cargoQty == null) return;
    if (trialSurveyCount >= DS_TRIAL_MAX_SURVEYS) { setShowUpgrade(true); return; }
    const entry = { id: `h_${Date.now()}`, date: finalDate || new Date().toISOString(), vessel: vessel.name || 'Unnamed', location: location || '—', cargo: cargoQty };
    const next = [entry, ...history];
    setHistory(next);
    const nextCount = trialSurveyCount + 1;
    setTrialSurveyCount(nextCount);
    try {
      localStorage.setItem('scf-draft-survey-history', JSON.stringify(next));
      localStorage.setItem(DS_TRIAL_STORAGE_KEY, String(nextCount));
    } catch { /* ignore */ }
  }

  function deleteHistoryEntry(id: string) {
    const next = history.filter((h) => h.id !== id);
    setHistory(next);
    try { localStorage.setItem('scf-draft-survey-history', JSON.stringify(next)); } catch { /* ignore */ }
  }

  function parsePaste() {
    setPasteError('');
    const lines = pasteText.trim().split('\n').filter((l) => l.trim());
    const rows: HydroRow[] = [];
    for (const line of lines) {
      const parts = line.split(/[\t,;]+/).map((p) => p.trim()).filter((p) => p !== '');
      if (parts.length < 5) continue;
      const [d, disp, tpc, mtc, lcf] = parts.map((p) => n(p));
      if (isNaN(d)) continue;
      rows.push({ draft: d, disp, tpc, mtc, lcf });
    }
    if (rows.length < 2) {
      setPasteError('⚠ Need at least 2 valid rows. Format: Draft, Displacement, TPC, MTC, LCF (one row per line, tab/comma separated).');
      return;
    }
    rows.sort((a, b) => a.draft - b.draft);
    setHydro(rows);
    setPasteText('');
  }

  function removeHydroRow(idx: number) {
    setHydro((prev) => prev.filter((_, i) => i !== idx));
  }

  const lbpN = n(vessel.lbp);
  const keelN = n(keel);
  const lcfRef = lcfRefOverride ? n(lcfRefOverride) : lbpN / 2;

  const calcI = calcSide(initial, lbpN, keelN, lcfRef, hydro);
  const calcF = calcSide(final_, lbpN, keelN, lcfRef, hydro);

  const cargoQty = (calcI.netDisp != null && calcF.netDisp != null) ? r(Math.abs(calcF.netDisp - calcI.netDisp), 2) : null;
  const calculatedConstant = (calcI.netDisp != null && lightShip) ? calcI.netDisp - n(lightShip) : null;

  const hydroReady = hydro.length >= 2 && lbpN > 0;

  function buildReportText() {
    const lines: string[] = [];
    lines.push(`File No.: ${fileNo || '—'}`);
    lines.push(`Date: ${finalDate ? new Date(finalDate).toLocaleDateString('en-GB') : '—'}`);
    lines.push('');
    lines.push('DRAFT SURVEY REPORT');
    lines.push(`VESSEL: ${vessel.name || '—'}`);
    lines.push('');
    lines.push(`This is to report that, ship's staff had carried out initial and final draft survey, whilst vessel was lying at port ${location || '[LOCATION]'}, for loading/discharging of ${cargoDesc || '[CARGO]'}.`);
    lines.push('');
    lines.push('The calculation as follows:');
    lines.push('');
    lines.push(`Loading/discharging commenced on ${commenceDate ? new Date(commenceDate).toLocaleString('en-GB') : '—'}`);
    lines.push(`And completed on ${completeDate ? new Date(completeDate).toLocaleString('en-GB') : '—'}`);
    lines.push(`Initial Draft Survey conducted on ${initDate ? new Date(initDate).toLocaleString('en-GB') : '—'}`);
    lines.push(`Final Draft Survey conducted on ${finalDate ? new Date(finalDate).toLocaleString('en-GB') : '—'}`);
    lines.push('');
    lines.push('                                   Initial              Final');
    lines.push(`State of Sea                      ${initSea || '—'}    ${finalSea || '—'}`);
    lines.push(`Dock Water Density (t/m3)          ${initial.density}    ${final_.density}`);
    lines.push(`Forward Mean (corrected) (m)       ${calcI.corrected.fwd.toFixed(3)}    ${calcF.corrected.fwd.toFixed(3)}`);
    lines.push(`Aft Mean (corrected) (m)           ${calcI.corrected.aft.toFixed(3)}    ${calcF.corrected.aft.toFixed(3)}`);
    lines.push(`Midship Mean (corrected) (m)       ${calcI.corrected.mid.toFixed(3)}    ${calcF.corrected.mid.toFixed(3)}`);
    lines.push(`Quarter Mean (m)                   ${calcI.quarterMean.toFixed(3)}    ${calcF.quarterMean.toFixed(3)}`);
    lines.push(`Apparent Displacement (MT)         ${calcI.dispAtQM != null ? calcI.dispAtQM.toFixed(1) : '—'}    ${calcF.dispAtQM != null ? calcF.dispAtQM.toFixed(1) : '—'}`);
    lines.push(`Trim Correction (MT)               ${(calcI.trim1corr != null && calcI.trim2corr != null) ? (calcI.trim1corr + calcI.trim2corr).toFixed(1) : '—'}    ${(calcF.trim1corr != null && calcF.trim2corr != null) ? (calcF.trim1corr + calcF.trim2corr).toFixed(1) : '—'}`);
    lines.push(`Density Correction (MT)            ${calcI.densCorr ?? '—'}    ${calcF.densCorr ?? '—'}`);
    lines.push(`Corrected Displacement (MT)        ${calcI.correctedDisp != null ? calcI.correctedDisp.toFixed(1) : '—'}    ${calcF.correctedDisp != null ? calcF.correctedDisp.toFixed(1) : '—'}`);
    lines.push(`Bunkers (MT)                       ${initial.bunkers || 0}    ${final_.bunkers || 0}`);
    lines.push(`Fresh Water (MT)                   ${initial.freshWater || 0}    ${final_.freshWater || 0}`);
    lines.push(`Water Ballast (MT)                 ${initial.waterBallast || 0}    ${final_.waterBallast || 0}`);
    lines.push(`Others (MT)                        ${initial.others || 0}    ${final_.others || 0}`);
    lines.push(`Total Known Weights (MT)           ${calcI.deductibles.toFixed(1)}    ${calcF.deductibles.toFixed(1)}`);
    lines.push(`Net Displacement (MT)              ${calcI.netDisp != null ? calcI.netDisp.toFixed(1) : '—'}    ${calcF.netDisp != null ? calcF.netDisp.toFixed(1) : '—'}`);
    lines.push('');
    lines.push(`Calculated Quantity of Cargo Loaded/Discharged: ${cargoQty != null ? cargoQty.toLocaleString() : '—'} MT`);
    if (blQty) lines.push(`B/L Quantity: ${n(blQty).toLocaleString()} MT (difference: ${cargoQty != null ? (cargoQty - n(blQty)).toFixed(2) : '—'} MT)`);
    lines.push('');
    lines.push('All tanks were sounded by the representatives of vessel\'s Chief Officer and independent surveyor, jointly.');
    if (remarks) { lines.push(''); lines.push(`Remarks: ${remarks}`); }
    lines.push('');
    lines.push(`CHIEF OFFICER: ${chiefOfficerName || '_______________'}          SURVEYORS: ${surveyorName || '_______________'}`);
    return lines.join('\n');
  }

  async function generatePdfBlob() {
    const { jsPDF } = await loadJsPdf();
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 42;
    const maxWidth = 595 - margin * 2;
    doc.setFont('Courier', 'normal');
    doc.setFontSize(9);
    let y = margin;
    const lineHeight = 12;
    const text = buildReportText();
    for (const rawLine of text.split('\n')) {
      const wrapped = doc.splitTextToSize(rawLine || ' ', maxWidth);
      for (const w of wrapped) {
        if (y > 800) { doc.addPage(); y = margin; }
        doc.text(w, margin, y);
        y += lineHeight;
      }
    }
    return doc.output('blob');
  }

  async function handleDownloadPdf() {
    setPdfBusy(true);
    try {
      const blob = await generatePdfBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DraftSurvey-${(vessel.name || 'vessel').replace(/\s+/g, '')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* ignore */ }
    setPdfBusy(false);
  }

  async function handleSharePdf() {
    setPdfBusy(true);
    try {
      const blob = await generatePdfBlob();
      const fileName = `DraftSurvey-${(vessel.name || 'vessel').replace(/\s+/g, '')}.pdf`;
      const file = new File([blob], fileName, { type: 'application/pdf' });
      if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({ files: [file], title: fileName });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch { /* ignore */ }
    setPdfBusy(false);
  }

  function printReport() { window.print(); }

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        input[type="date"]::-webkit-calendar-picker-indicator,input[type="time"]::-webkit-calendar-picker-indicator{filter:invert(1) brightness(1.6);cursor:pointer}
        .ds-wrap{max-width:900px;margin:0 auto;padding:24px 16px 60px}
        .ds-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .ds-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .ds-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:16px}
        .ds-warn{background:rgba(248,113,113,.1);border:2px solid rgba(248,113,113,.4);border-radius:10px;padding:14px;font-size:12.5px;color:#fca5a5;line-height:1.6;margin-bottom:16px;font-weight:600}
        .ds-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:14px}
        .ds-label{font-size:11px;color:#6b83a0;text-transform:uppercase;letter-spacing:.06em;font-weight:700;display:block;margin-bottom:10px}
        .ds-fl{font-size:12px;color:#c5d3e8;font-weight:700;display:block;margin-bottom:5px}
        .ds-inp,.ds-sel,.ds-txt{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:9px 11px;color:#eef4fa;font-size:13px;font-family:inherit}
        .ds-txt{resize:vertical;min-height:100px;font-family:monospace;font-size:12px}
        .ds-inp:focus,.ds-txt:focus{outline:none;border-color:#fbbf24}
        .ds-grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px}
        .ds-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
        .ds-add{background:linear-gradient(135deg,#fbbf24,#e0a010);color:#0b0e13;border:none;border-radius:9px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer}
        .ds-sec{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);color:#eef4fa;border-radius:9px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer}
        .ds-hydro-row{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr 24px;gap:6px;font-size:11px;padding:6px 0;border-top:1px solid rgba(255,255,255,.06);align-items:center}
        .ds-hydro-head{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr 24px;gap:6px;font-size:9.5px;color:#6b83a0;text-transform:uppercase;font-weight:700;padding-bottom:6px}
        .ds-side-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:15px;color:#fbbf24;margin-bottom:12px}
        .ds-calc-line{display:flex;justify-content:space-between;font-size:12px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06)}
        .ds-calc-line b{color:#eef4fa;font-weight:700}
        .ds-hero{border-radius:16px;padding:24px;text-align:center;margin:16px 0;background:rgba(52,211,153,.1);border:1.5px solid rgba(52,211,153,.4)}
        .ds-hero-val{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:34px;font-weight:800;color:#34d399}
        .ds-hero-lbl{font-size:12px;color:#34d399;margin-top:4px}
        .ds-grid4{display:grid;grid-template-columns:50px 1fr 1fr 1fr;gap:6px}
        @media(max-width:640px){ .ds-grid2,.ds-grid3{grid-template-columns:1fr} .ds-grid4{grid-template-columns:34px 1fr 1fr 1fr} .ds-hydro-row,.ds-hydro-head{grid-template-columns:1fr 1fr;row-gap:2px} }
      `}</style>

      <div className="ds-wrap">
        <Link href="/tools" className="ds-back">← All Tools</Link>
        <div className="ds-title">Draft Survey Calculator</div>
        <p className="ds-sub">Full quadratic-mean draft survey — for any bulk carrier, using your vessel's own hydrostatic particulars.</p>
        <div className="ds-warn">
          🚨 <b>Planning and cross-check tool — not a replacement for your vessel's approved loading computer or stability booklet.</b> Verify against your ship's own hydrostatic data before relying on the result for cargo settlement.
        </div>

        {step === 'setup' && (
          <>
            {profiles.length > 0 && (
              <div className="ds-card">
                <span className="ds-label">Saved Vessel Profiles</span>
                {profiles.map((p) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: p.id === activeProfileId ? 'rgba(251,191,36,.1)' : 'rgba(255,255,255,.03)', border: p.id === activeProfileId ? '1px solid rgba(251,191,36,.35)' : '1px solid transparent', borderRadius: 8, marginBottom: 6, fontSize: 12.5, cursor: 'pointer' }} onClick={() => loadProfile(p.id)}>
                    <span>{p.label} {p.id === activeProfileId && <span style={{ color: '#fbbf24', fontSize: 11 }}>(active)</span>}</span>
                    <button onClick={(e) => { e.stopPropagation(); deleteProfile(p.id); }} style={{ background: 'none', border: 'none', color: '#6b83a0', cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="ds-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span className="ds-label" style={{ marginBottom: 0 }}>Vessel Particulars</span>
                <button className="ds-sec" onClick={() => saveProfile(true)}>+ Save as New Profile</button>
              </div>
              <div className="ds-grid3">
                <div><span className="ds-fl">Name of ship</span><input className="ds-inp" value={vessel.name} onChange={(e) => setVessel({ ...vessel, name: e.target.value })} /></div>
                <div><span className="ds-fl">IMO Number</span><input className="ds-inp" value={vessel.imo} onChange={(e) => setVessel({ ...vessel, imo: e.target.value })} /></div>
                <div><span className="ds-fl">GRT</span><input className="ds-inp" value={vessel.grt} onChange={(e) => setVessel({ ...vessel, grt: e.target.value })} inputMode="decimal" /></div>
              </div>
              <div className="ds-grid3">
                <div><span className="ds-fl">NRT</span><input className="ds-inp" value={vessel.nrt} onChange={(e) => setVessel({ ...vessel, nrt: e.target.value })} inputMode="decimal" /></div>
                <div><span className="ds-fl">LOA (m)</span><input className="ds-inp" value={vessel.loa} onChange={(e) => setVessel({ ...vessel, loa: e.target.value })} inputMode="decimal" /></div>
                <div><span className="ds-fl">LBP (m) — critical</span><input className="ds-inp" value={vessel.lbp} onChange={(e) => setVessel({ ...vessel, lbp: e.target.value })} inputMode="decimal" placeholder="e.g. 194.5" /></div>
              </div>
              <div className="ds-grid3" style={{ marginBottom: 0 }}>
                <div><span className="ds-fl">Breadth (m)</span><input className="ds-inp" value={vessel.breadth} onChange={(e) => setVessel({ ...vessel, breadth: e.target.value })} inputMode="decimal" /></div>
                <div><span className="ds-fl">DWT</span><input className="ds-inp" value={vessel.dwt} onChange={(e) => setVessel({ ...vessel, dwt: e.target.value })} inputMode="decimal" /></div>
                <div><span className="ds-fl">Summer Draft (m)</span><input className="ds-inp" value={vessel.summerDraft} onChange={(e) => setVessel({ ...vessel, summerDraft: e.target.value })} inputMode="decimal" /></div>
              </div>
            </div>

            <div className="ds-card">
              <span className="ds-label">Reference Constants</span>
              <div className="ds-grid3" style={{ marginBottom: 0 }}>
                <div><span className="ds-fl">Keel Thickness (m)</span><input className="ds-inp" value={keel} onChange={(e) => setKeel(e.target.value)} inputMode="decimal" /></div>
                <div><span className="ds-fl">LCF Reference (m) — blank = LBP/2</span><input className="ds-inp" value={lcfRefOverride} onChange={(e) => setLcfRefOverride(e.target.value)} inputMode="decimal" placeholder={lbpN > 0 ? `auto: ${(lbpN/2).toFixed(3)}` : 'auto: LBP/2'} /></div>
                <div><span className="ds-fl">Current LCF Ref Used</span><input className="ds-inp" value={lcfRef ? lcfRef.toFixed(3) : '—'} disabled /></div>
              </div>
            </div>

            <div className="ds-card">
              <span className="ds-label">Hydrostatic Table (from your ship's stability booklet)</span>
              <p style={{ fontSize: 11.5, color: '#a8bdd2', lineHeight: 1.6, marginBottom: 10 }}>
                Paste rows from your ship's own hydrostatic table — one row per line: <b style={{ color: '#eef4fa' }}>Draft, Displacement, TPC, MTC, LCF</b> (tab, comma, or semicolon separated). You don't need every 0.05m step — the tool interpolates between whatever points you give it. More points = more accuracy, especially near your operating draft range.
              </p>
              <textarea className="ds-txt" value={pasteText} onChange={(e) => setPasteText(e.target.value)} placeholder={'5.0\t28500.4\t54.2\t650.1\t2.15\n5.5\t31600.8\t54.8\t670.3\t1.95\n6.0\t34720.1\t55.4\t689.7\t1.72'} />
              <button className="ds-add" style={{ marginTop: 10 }} onClick={parsePaste}>+ Add rows to table</button>
              {pasteError && <div style={{ color: '#fca5a5', fontSize: 12, marginTop: 8 }}>{pasteError}</div>}

              {hydro.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <span className="ds-fl">{hydro.length} rows loaded (range: {hydro[0].draft}m – {hydro[hydro.length - 1].draft}m)</span>
                  <div className="ds-hydro-head"><span>Draft</span><span>Disp</span><span>TPC</span><span>MTC</span><span>LCF</span><span></span></div>
                  {hydro.map((row, i) => (
                    <div className="ds-hydro-row" key={i}>
                      <span>{row.draft}</span><span>{row.disp}</span><span>{row.tpc}</span><span>{row.mtc}</span><span>{row.lcf}</span>
                      <button onClick={() => removeHydroRow(i)} style={{ background: 'none', border: 'none', color: '#6b83a0', cursor: 'pointer' }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="ds-add" style={{ width: '100%', padding: 14, fontSize: 14 }} disabled={!hydroReady} onClick={() => { saveProfile(false); setStep('main'); }}>
              {hydroReady ? 'Continue to Survey →' : 'Enter LBP and at least 2 hydrostatic rows to continue'}
            </button>
          </>
        )}

        {step === 'main' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{vessel.name || 'Vessel'} — Draft Survey</div>
              <button className="ds-sec" onClick={() => setStep('setup')}>⚙ Edit Vessel Profile</button>
            </div>

            {showUpgrade && (
              <div style={{ background: 'linear-gradient(160deg,rgba(251,191,36,.12),#050716)', border: '2px solid rgba(251,191,36,.4)', borderRadius: 14, padding: 20, marginBottom: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>🔒 Free trial limit reached</div>
                <p style={{ fontSize: 12.5, color: '#a8bdd2', lineHeight: 1.6, marginBottom: 14 }}>
                  You've saved your free {DS_TRIAL_MAX_SURVEYS} survey to history. Upgrade to save unlimited surveys and keep full access to the Draft Survey Calculator.
                </p>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fbbf24', marginBottom: 4 }}>{DS_TRIAL_PRICE}</div>
                <button style={{ background: 'linear-gradient(135deg,#fbbf24,#e0a010)', color: '#0b0e13', border: 'none', borderRadius: 9, padding: '11px 22px', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', marginTop: 8 }} onClick={() => { window.location.href = '/upgrade?tool=draft-survey'; }}>
                  Upgrade Now
                </button>
                <div style={{ marginTop: 10 }}>
                  <button style={{ background: 'none', border: 'none', color: '#6b83a0', fontSize: 11.5, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowUpgrade(false)}>Maybe later</button>
                </div>
              </div>
            )}

            {!showUpgrade && trialSurveyCount < DS_TRIAL_MAX_SURVEYS && (
              <div style={{ background: 'rgba(90,166,232,.08)', border: '1px solid rgba(90,166,232,.25)', borderRadius: 9, padding: '9px 12px', marginBottom: 16, fontSize: 11.5, color: '#7db8ea' }}>
                🎁 Free trial: save your first complete survey to history at no cost — {DS_TRIAL_MAX_SURVEYS - trialSurveyCount} of {DS_TRIAL_MAX_SURVEYS} remaining
              </div>
            )}

            <div className="ds-card">
              <span className="ds-label">Survey Details</span>
              <div className="ds-grid3" style={{ marginBottom: 0 }}>
                <div><span className="ds-fl">File No.</span><input className="ds-inp" value={fileNo} onChange={(e) => setFileNo(e.target.value)} /></div>
                <div><span className="ds-fl">Location</span><input className="ds-inp" value={location} onChange={(e) => setLocation(e.target.value)} /></div>
                <div><span className="ds-fl">Cargo</span><input className="ds-inp" value={cargoDesc} onChange={(e) => setCargoDesc(e.target.value)} placeholder="e.g. Gypsum" /></div>
              </div>
            </div>

            {[{ label: 'INITIAL', data: initial, setData: setInitial, date: initDate, setDate: setInitDate, sea: initSea, setSea: setInitSea, calc: calcI },
              { label: 'FINAL', data: final_, setData: setFinal, date: finalDate, setDate: setFinalDate, sea: finalSea, setSea: setFinalSea, calc: calcF }].map((side) => (
              <div className="ds-card" key={side.label}>
                <div className="ds-side-title">{side.label} SURVEY</div>
                <div className="ds-grid2">
                  <div><span className="ds-fl">Date / Time</span><input className="ds-inp" type="datetime-local" value={side.date} onChange={(e) => side.setDate(e.target.value)} /></div>
                  <div><span className="ds-fl">Sea Condition</span><input className="ds-inp" value={side.sea} onChange={(e) => side.setSea(e.target.value)} placeholder="e.g. Swell ± 0.2m" /></div>
                </div>

                <span className="ds-fl" style={{ marginTop: 6 }}>Observed Drafts (m)</span>
                <div className="ds-grid4" style={{ fontSize: 9.5, color: '#6b83a0', textTransform: 'uppercase', fontWeight: 700, paddingBottom: 6 }}><span></span><span>FWD</span><span>MID</span><span>AFT</span></div>
                <div className="ds-grid4" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 11.5, color: '#a8bdd2', alignSelf: 'center' }}>STBD</span>
                  <input className="ds-inp" value={side.data.stbdFwd} onChange={(e) => side.setData({ ...side.data, stbdFwd: e.target.value })} inputMode="decimal" />
                  <input className="ds-inp" value={side.data.stbdMid} onChange={(e) => side.setData({ ...side.data, stbdMid: e.target.value })} inputMode="decimal" />
                  <input className="ds-inp" value={side.data.stbdAft} onChange={(e) => side.setData({ ...side.data, stbdAft: e.target.value })} inputMode="decimal" />
                </div>
                <div className="ds-grid4" style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 11.5, color: '#a8bdd2', alignSelf: 'center' }}>PORT</span>
                  <input className="ds-inp" value={side.data.portFwd} onChange={(e) => side.setData({ ...side.data, portFwd: e.target.value })} inputMode="decimal" />
                  <input className="ds-inp" value={side.data.portMid} onChange={(e) => side.setData({ ...side.data, portMid: e.target.value })} inputMode="decimal" />
                  <input className="ds-inp" value={side.data.portAft} onChange={(e) => side.setData({ ...side.data, portAft: e.target.value })} inputMode="decimal" />
                </div>

                <span className="ds-fl">Distance of Draft Marks from Perpendiculars (m, + = inside)</span>
                <div className="ds-grid3" style={{ marginBottom: 10 }}>
                  <input className="ds-inp" placeholder="FWD" value={side.data.distFwd} onChange={(e) => side.setData({ ...side.data, distFwd: e.target.value })} inputMode="decimal" />
                  <input className="ds-inp" placeholder="MID" value={side.data.distMid} onChange={(e) => side.setData({ ...side.data, distMid: e.target.value })} inputMode="decimal" />
                  <input className="ds-inp" placeholder="AFT" value={side.data.distAft} onChange={(e) => side.setData({ ...side.data, distAft: e.target.value })} inputMode="decimal" />
                </div>

                <div className="ds-grid2">
                  <div><span className="ds-fl">Observed Density (t/m³)</span><input className="ds-inp" value={side.data.density} onChange={(e) => side.setData({ ...side.data, density: e.target.value })} inputMode="decimal" /></div>
                  <div><span className="ds-fl">List/Heel (°, + = Stbd)</span><input className="ds-inp" value={side.data.listHeel} onChange={(e) => side.setData({ ...side.data, listHeel: e.target.value })} inputMode="decimal" /></div>
                </div>
                <div className="ds-grid3">
                  <div><span className="ds-fl">Water Ballast (MT)</span><input className="ds-inp" value={side.data.waterBallast} onChange={(e) => side.setData({ ...side.data, waterBallast: e.target.value })} inputMode="decimal" /></div>
                  <div><span className="ds-fl">Fresh Water (MT)</span><input className="ds-inp" value={side.data.freshWater} onChange={(e) => side.setData({ ...side.data, freshWater: e.target.value })} inputMode="decimal" /></div>
                  <div><span className="ds-fl">Bunkers (MT)</span><input className="ds-inp" value={side.data.bunkers} onChange={(e) => side.setData({ ...side.data, bunkers: e.target.value })} inputMode="decimal" /></div>
                </div>
                <span className="ds-fl">Others (MT)</span>
                <input className="ds-inp" style={{ marginBottom: 12 }} value={side.data.others} onChange={(e) => side.setData({ ...side.data, others: e.target.value })} inputMode="decimal" />

                <span className="ds-label" style={{ marginTop: 6 }}>Calculation Breakdown ({side.label})</span>
                <div className="ds-calc-line"><span>Corrected drafts (Fwd / Mid / Aft)</span><b>{side.calc.corrected.fwd.toFixed(3)} / {side.calc.corrected.mid.toFixed(3)} / {side.calc.corrected.aft.toFixed(3)} m</b></div>
                <div className="ds-calc-line"><span>Mean F&A / {side.calc.hogSag}</span><b>{side.calc.meanFA.toFixed(3)} m ({side.calc.hogSagVal.toFixed(3)})</b></div>
                <div className="ds-calc-line"><span>Quarter Mean / Q.M. Tablet</span><b>{side.calc.quarterMean.toFixed(3)} / {side.calc.qmTablet.toFixed(3)} m</b></div>
                <div className="ds-calc-line"><span>Displacement at Q.M.</span><b>{side.calc.dispAtQM != null ? side.calc.dispAtQM.toFixed(1) : '—'} MT</b></div>
                <div className="ds-calc-line"><span>TPC / LCF (interpolated)</span><b>{side.calc.TPC != null ? side.calc.TPC.toFixed(2) : '—'} / {side.calc.LCF != null ? side.calc.LCF.toFixed(3) : '—'}</b></div>
                <div className="ds-calc-line"><span>1st / 2nd Trim Correction</span><b>{side.calc.trim1corr ?? '—'} / {side.calc.trim2corr ?? '—'} MT</b></div>
                <div className="ds-calc-line"><span>Trim-Corrected Displacement</span><b>{side.calc.trimCorrDisp != null ? side.calc.trimCorrDisp.toFixed(1) : '—'} MT</b></div>
                <div className="ds-calc-line"><span>Density Correction</span><b>{side.calc.densCorr ?? '—'} MT</b></div>
                <div className="ds-calc-line"><span>Corrected Displacement</span><b>{side.calc.correctedDisp != null ? side.calc.correctedDisp.toFixed(1) : '—'} MT</b></div>
                <div className="ds-calc-line" style={{ borderBottom: 'none' }}><span>Net Displacement (after deductibles)</span><b style={{ color: '#fbbf24' }}>{side.calc.netDisp != null ? side.calc.netDisp.toFixed(1) : '—'} MT</b></div>
                {side.calc.warnings.length > 0 && (
                  <div style={{ marginTop: 12, background: 'rgba(232,184,90,.08)', border: '1px solid rgba(232,184,90,.3)', borderRadius: 9, padding: 10 }}>
                    {side.calc.warnings.map((w, i) => (<div key={i} style={{ fontSize: 11.5, color: '#e8c87a', lineHeight: 1.5, marginBottom: i < side.calc.warnings.length - 1 ? 4 : 0 }}>⚠ {w}</div>))}
                  </div>
                )}
              </div>
            ))}

            <div className="ds-card">
              <span className="ds-label">Constant & Reference</span>
              <div className="ds-grid3" style={{ marginBottom: 0 }}>
                <div><span className="ds-fl">Light Ship Weight (MT)</span><input className="ds-inp" value={lightShip} onChange={(e) => setLightShip(e.target.value)} inputMode="decimal" /></div>
                <div><span className="ds-fl">Declared Constant (MT, optional)</span><input className="ds-inp" value={declaredConstant} onChange={(e) => setDeclaredConstant(e.target.value)} inputMode="decimal" /></div>
                <div><span className="ds-fl">B/L Quantity (MT, optional)</span><input className="ds-inp" value={blQty} onChange={(e) => setBlQty(e.target.value)} inputMode="decimal" /></div>
              </div>
            </div>

            {cargoQty != null && (
              <div className="ds-hero">
                <div className="ds-hero-val">{cargoQty.toLocaleString()} MT</div>
                <div className="ds-hero-lbl">Calculated Cargo Loaded / Discharged</div>
                {calculatedConstant != null && (
                  <div style={{ marginTop: 10, fontSize: 12, color: '#a8bdd2' }}>
                    Calculated Constant: <b style={{ color: '#eef4fa' }}>{calculatedConstant.toFixed(2)} MT</b>
                    {declaredConstant && <> — Declared: <b style={{ color: '#eef4fa' }}>{n(declaredConstant).toFixed(2)} MT</b> (diff: {(calculatedConstant - n(declaredConstant)).toFixed(2)} MT)</>}
                  </div>
                )}
                {blQty && cargoQty != null && (
                  <div style={{ marginTop: 4, fontSize: 12, color: '#a8bdd2' }}>
                    vs B/L {n(blQty).toLocaleString()} MT — difference: <b style={{ color: Math.abs(cargoQty - n(blQty)) > n(blQty) * 0.005 ? '#fca5a5' : '#34d399' }}>{(cargoQty - n(blQty)).toFixed(2)} MT ({(((cargoQty - n(blQty)) / n(blQty)) * 100).toFixed(3)}%)</b>
                    <span style={{ marginLeft: 8, fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: Math.abs((cargoQty - n(blQty)) / n(blQty)) <= 0.005 ? 'rgba(52,211,153,.15)' : 'rgba(248,113,113,.15)', color: Math.abs((cargoQty - n(blQty)) / n(blQty)) <= 0.005 ? '#34d399' : '#f87171' }}>
                      {Math.abs((cargoQty - n(blQty)) / n(blQty)) <= 0.005 ? '✓ PASS (within 0.5%)' : '⚠ CHECK (exceeds 0.5%)'}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="ds-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="ds-label" style={{ marginBottom: 0 }}>Report Details</span>
                <button className="ds-sec" onClick={saveSurveyProgress}>{surveySaved ? '✓ Saved' : '💾 Save Survey Progress'}</button>
              </div>
              <div className="ds-grid2">
                <div><span className="ds-fl">Loading/Discharging Commenced</span><input className="ds-inp" type="datetime-local" value={commenceDate} onChange={(e) => setCommenceDate(e.target.value)} /></div>
                <div><span className="ds-fl">Completed</span><input className="ds-inp" type="datetime-local" value={completeDate} onChange={(e) => setCompleteDate(e.target.value)} /></div>
              </div>
              <div className="ds-grid2">
                <div><span className="ds-fl">Chief Officer Name</span><input className="ds-inp" value={chiefOfficerName} onChange={(e) => setChiefOfficerName(e.target.value)} /></div>
                <div><span className="ds-fl">Surveyor Name</span><input className="ds-inp" value={surveyorName} onChange={(e) => setSurveyorName(e.target.value)} /></div>
              </div>
              <span className="ds-fl">Remarks (optional)</span>
              <textarea className="ds-txt" style={{ minHeight: 60 }} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
              <p style={{ fontSize: 10.5, color: '#6b83a0', marginTop: 8, lineHeight: 1.5 }}>Save your progress any time — Initial and Final surveys are often days apart, so this keeps your readings safe if you close the browser in between.</p>
            </div>

            {history.length > 0 && (
              <div className="ds-card">
                <span className="ds-label">Survey History</span>
                {history.map((h) => (
                  <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(255,255,255,.03)', borderRadius: 8, marginBottom: 6, fontSize: 12 }}>
                    <span>{new Date(h.date).toLocaleDateString('en-GB')} — {h.vessel} @ {h.location}: <b style={{ color: '#fbbf24' }}>{h.cargo.toLocaleString()} MT</b></span>
                    <button onClick={() => deleteHistoryEntry(h.id)} style={{ background: 'none', border: 'none', color: '#6b83a0', cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {cargoQty != null && (
              <div className="ds-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                  <span className="ds-label" style={{ marginBottom: 0 }}>Draft Survey Report</span>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="ds-sec" onClick={saveToHistory}>📋 Save to History</button>
                    <button className="ds-sec" onClick={printReport}>🖨 Print</button>
                    <button className="ds-sec" disabled={pdfBusy} onClick={handleDownloadPdf} style={{ opacity: pdfBusy ? 0.6 : 1 }}>📄 {pdfBusy ? 'Working...' : 'Download PDF'}</button>
                    <button className="ds-add" disabled={pdfBusy} onClick={handleSharePdf} style={{ opacity: pdfBusy ? 0.6 : 1 }}>📤 {pdfBusy ? 'Working...' : 'Share'}</button>
                  </div>
                </div>

                <div style={{ background: '#fff', color: '#111', borderRadius: 10, padding: '24px 22px', fontFamily: 'Georgia, Times New Roman, serif' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 16 }}>
                    <span>File No.: <b>{fileNo || '—'}</b></span>
                    <span>Date: <b>{finalDate ? new Date(finalDate).toLocaleDateString('en-GB') : '—'}</b></span>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 700, letterSpacing: '.03em', marginBottom: 4 }}>DRAFT SURVEY REPORT</div>
                  <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, marginBottom: 18 }}>VESSEL: {vessel.name || '—'}</div>

                  <p style={{ fontSize: 12, lineHeight: 1.7, marginBottom: 14 }}>
                    This is to report that, ship&apos;s staff had carried out initial and final draft survey, whilst vessel was lying at port <b>{location || '[LOCATION]'}</b>, for loading/discharging of <b>{cargoDesc || '[CARGO]'}</b>.
                  </p>
                  <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>The calculation as follows:</p>

                  <table style={{ fontSize: 11.5, marginBottom: 16, borderCollapse: 'collapse', width: '100%' }}>
                    <tbody>
                      <tr><td style={{ padding: '3px 0' }}>Loading/discharging commenced on</td><td style={{ padding: '3px 0' }}><b>{commenceDate ? new Date(commenceDate).toLocaleString('en-GB') : '—'}</b></td></tr>
                      <tr><td style={{ padding: '3px 0' }}>And completed on</td><td style={{ padding: '3px 0' }}><b>{completeDate ? new Date(completeDate).toLocaleString('en-GB') : '—'}</b></td></tr>
                      <tr><td style={{ padding: '3px 0' }}>Initial Draft Survey conducted on</td><td style={{ padding: '3px 0' }}><b>{initDate ? new Date(initDate).toLocaleString('en-GB') : '—'}</b></td></tr>
                      <tr><td style={{ padding: '3px 0' }}>Final Draft Survey conducted on</td><td style={{ padding: '3px 0' }}><b>{finalDate ? new Date(finalDate).toLocaleString('en-GB') : '—'}</b></td></tr>
                    </tbody>
                  </table>

                  <table style={{ fontSize: 11, width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #333' }}>
                        <th style={{ textAlign: 'left', padding: '5px 4px' }}></th>
                        <th style={{ textAlign: 'right', padding: '5px 4px' }}>Initial</th>
                        <th style={{ textAlign: 'right', padding: '5px 4px' }}>Final</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['State of Sea', initSea || '—', finalSea || '—'],
                        ['Dock Water Density (t/m³)', initial.density, final_.density],
                        ['Forward Mean (corrected) (m)', calcI.corrected.fwd.toFixed(3), calcF.corrected.fwd.toFixed(3)],
                        ['Aft Mean (corrected) (m)', calcI.corrected.aft.toFixed(3), calcF.corrected.aft.toFixed(3)],
                        ['Midship Mean (corrected) (m)', calcI.corrected.mid.toFixed(3), calcF.corrected.mid.toFixed(3)],
                        ['Quarter Mean (m)', calcI.quarterMean.toFixed(3), calcF.quarterMean.toFixed(3)],
                        ['Apparent Displacement (MT)', calcI.dispAtQM != null ? calcI.dispAtQM.toFixed(1) : '—', calcF.dispAtQM != null ? calcF.dispAtQM.toFixed(1) : '—'],
                        ['Trim Correction (MT)', (calcI.trim1corr != null && calcI.trim2corr != null) ? (calcI.trim1corr + calcI.trim2corr).toFixed(1) : '—', (calcF.trim1corr != null && calcF.trim2corr != null) ? (calcF.trim1corr + calcF.trim2corr).toFixed(1) : '—'],
                        ['Density Correction (MT)', String(calcI.densCorr ?? '—'), String(calcF.densCorr ?? '—')],
                        ['Corrected Displacement (MT)', calcI.correctedDisp != null ? calcI.correctedDisp.toFixed(1) : '—', calcF.correctedDisp != null ? calcF.correctedDisp.toFixed(1) : '—'],
                        ['Bunkers (MT)', initial.bunkers || '0', final_.bunkers || '0'],
                        ['Fresh Water (MT)', initial.freshWater || '0', final_.freshWater || '0'],
                        ['Water Ballast (MT)', initial.waterBallast || '0', final_.waterBallast || '0'],
                        ['Others (MT)', initial.others || '0', final_.others || '0'],
                        ['Total Known Weights (MT)', calcI.deductibles.toFixed(1), calcF.deductibles.toFixed(1)],
                        ['Net Displacement (MT)', calcI.netDisp != null ? calcI.netDisp.toFixed(1) : '—', calcF.netDisp != null ? calcF.netDisp.toFixed(1) : '—'],
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #ddd', fontWeight: row[0].startsWith('Net') || row[0].startsWith('Total') ? 700 : 400 }}>
                          <td style={{ padding: '4px' }}>{row[0]}</td>
                          <td style={{ padding: '4px', textAlign: 'right' }}>{row[1]}</td>
                          <td style={{ padding: '4px', textAlign: 'right' }}>{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ textAlign: 'center', background: '#f4f4f4', padding: 12, borderRadius: 6, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em' }}>Calculated Quantity of Cargo Loaded/Discharged</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{cargoQty.toLocaleString()} MT</div>
                    {blQty && <div style={{ fontSize: 11, marginTop: 4 }}>vs B/L {n(blQty).toLocaleString()} MT — difference {(cargoQty - n(blQty)).toFixed(2)} MT</div>}
                  </div>

                  <p style={{ fontSize: 10.5, lineHeight: 1.6, marginBottom: 16 }}>All tanks were sounded by the representatives of vessel&apos;s Chief Officer and independent surveyor, jointly.</p>
                  {remarks && <p style={{ fontSize: 10.5, lineHeight: 1.6, marginBottom: 16 }}><b>Remarks:</b> {remarks}</p>}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30, fontSize: 11 }}>
                    <div>_______________________<br />CHIEF OFFICER{chiefOfficerName ? ` — ${chiefOfficerName}` : ''}</div>
                    <div>_______________________<br />SURVEYORS{surveyorName ? ` — ${surveyorName}` : ''}</div>
                  </div>
                </div>
              </div>
            )}

            <p style={{ fontSize: 11, color: '#4a5568', lineHeight: 1.6, marginTop: 8 }}>
              Method: quadratic mean draft (hog/sag corrected), first & second trim correction referenced to LBP, density correction against table density 1.025 t/m³. This standard method applies to any bulk carrier — enter your own vessel's LBP and hydrostatic table for accurate results. Formula chain verified against a real vessel's certified draft survey worksheet — matched to the last decimal.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
