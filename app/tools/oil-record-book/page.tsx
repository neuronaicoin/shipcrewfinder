'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

function parseNum(v: any) {
if (v === undefined || v === null || v === '') return 0;
const n = parseFloat(String(v).replace(',', '.'));
return isNaN(n) ? 0 : n;
}
function fmt(n: number) { return (n || 0).toFixed(2); }
function hoursBetween(t1: string, t2: string) {
if (!t1 || !t2) return 0;
const [h1, m1] = t1.split(':').map(Number);
const [h2, m2] = t2.split(':').map(Number);
let mins = (h2 * 60 + m2) - (h1 * 60 + m1);
if (mins < 0) mins += 24 * 60;
return mins / 60;
}
function formatDate(d: string) {
if (!d) return '';
const dt = new Date(d + 'T00:00:00');
return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase().replace(/ /g, '-');
}

const CODE_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

const OPERATIONS = [
{ key: 'c11_inventory', tankType: 'sludge', code: 'C', label: 'Weekly Inventory of Sludge Tank', tankMode: 'single', extraFields: [],
buildLines: (v: any, tanks: any) => { const t = tanks.find((x: any) => String(x.id) === String(v.tankId)); if (!t) return null;
return [{ item: '11.1', text: t.name }, { item: '11.2', text: `${t.capacity} m³` }, { item: '11.3', text: `${fmt(t.qty)} m³` }]; } },
{ key: 'c122_transfer', tankType: 'sludge', code: 'C', label: 'Transfer Between Sludge Tank', tankMode: 'transfer', extraFields: [],
buildLines: (v: any, tanks: any) => { const from = tanks.find((x: any) => String(x.id) === String(v.fromTankId)); const to = tanks.find((x: any) => String(x.id) === String(v.toTankId)); if (!from || !to) return null;
return [{ item: '12.2', text: `${v.delta || '—'} m³ transferred from ${from.name}, ${fmt(from.qty)} m³ retained,` }, { item: '', text: `to ${to.name} retained in tank(s) ${fmt(to.qty)} m³` }]; } },
{ key: 'c121_shore', tankType: 'sludge', code: 'C', label: 'Disposal of Sludge via Shore Connection', tankMode: 'from-only',
extraFields: [{ key: 'receiver', label: 'Receiver', kind: 'text', placeholder: 'e.g. barge / tank truck / shore facility' }, { key: 'port', label: 'Port', kind: 'text' }],
buildLines: (v: any, tanks: any) => { const from = tanks.find((x: any) => String(x.id) === String(v.fromTankId)); if (!from) return null;
return [{ item: '12.1', text: `${v.delta || '—'} m³ sludge from ${from.name}, ${fmt(from.qty)} m³ retained,` }, { item: '', text: `to "${v.receiver || '[RECEIVER]'}" during port stay (${v.port || '[PORT]'})` }]; } },
{ key: 'c123_incinerator', tankType: 'sludge', code: 'C', label: 'Incineration of Sludge', tankMode: 'from-only', extraFields: [{ key: 'hours', label: 'Hours burned' }],
buildLines: (v: any, tanks: any) => { const from = tanks.find((x: any) => String(x.id) === String(v.fromTankId)); if (!from) return null;
return [{ item: '12.3', text: `${v.delta || '—'} m³ sludge from ${from.name}, ${fmt(from.qty)} m³ retained,` }, { item: '', text: `Burned in Incinerator for ${v.hours || '—'} hours` }]; } },
{ key: 'c124_boiler', tankType: 'sludge', code: 'C', label: 'Burning of Sludge in Boiler', tankMode: 'from-only', extraFields: [{ key: 'hours', label: 'Hours burned' }],
buildLines: (v: any, tanks: any) => { const from = tanks.find((x: any) => String(x.id) === String(v.fromTankId)); if (!from) return null;
return [{ item: '12.4', text: `${v.delta || '—'} m³ sludge from ${from.name}, ${fmt(from.qty)} m³ retained,` }, { item: '', text: `Burned in Boiler for ${v.hours || '—'} hours` }]; } },
{ key: 'c124_evap', tankType: 'sludge', code: 'C', label: 'Evaporation of Water from', tankMode: 'from-only', extraFields: [],
buildLines: (v: any, tanks: any) => { const from = tanks.find((x: any) => String(x.id) === String(v.fromTankId)); if (!from) return null;
return [{ item: '12.4', text: `${v.delta || '—'} m³ water evaporated from ${from.name}, ${fmt(from.qty)} m³ retained.` }]; } },

{ key: 'd_overboard', tankType: 'bilge', code: 'D', label: 'Pumping Bilge Water Overboard (15ppm equipment)', tankMode: 'from-only',
extraFields: [{ key: 't1', label: 'Start time', kind: 'time' }, { key: 't2', label: 'Stop time', kind: 'time' }, { key: 'posStart', label: 'Position at start', kind: 'text', placeholder: "e.g. 41°00'N, 029°00'E" }, { key: 'posStop', label: 'Position at stop', kind: 'text', placeholder: "e.g. 41°05'N, 029°10'E" }],
buildLines: (v: any, tanks: any) => { const from = tanks.find((x: any) => String(x.id) === String(v.fromTankId)); if (!from) return null;
return [{ item: '13', text: `${from.name}, Capacity ${from.capacity} m³, ${fmt(from.qty)} m³ retained` }, { item: '14', text: `Start: ${v.t1 || '—'}, stop: ${v.t2 || '—'}` }, { item: '15.1', text: `Through 15 ppm equipment overboard, ${v.delta || '—'} m³ discharged` }, { item: '', text: `Position start: ${v.posStart || '—'}` }, { item: '', text: `Position stop: ${v.posStop || '—'}` }]; } },
{ key: 'd_to_tank', tankType: 'bilge', code: 'D', label: 'Pumping Bilge Water (from Bilge Wells) to Tank', tankMode: 'to-only',
extraFields: [{ key: 't1', label: 'Start time', kind: 'time' }, { key: 't2', label: 'Stop time', kind: 'time' }],
buildLines: (v: any, tanks: any) => { const to = tanks.find((x: any) => String(x.id) === String(v.toTankId)); if (!to) return null;
return [{ item: '13', text: `${v.delta || '—'} m³ bilge water from engine-room bilge wells,` }, { item: '14', text: `Start: ${v.t1 || '—'}, stop: ${v.t2 || '—'}` }, { item: '15.3', text: `To ${to.name}, retained in tank(s) ${fmt(to.qty)} m³` }]; } },
{ key: 'd_slop', tankType: 'bilge', code: 'D', label: 'Transfer of Bilge Water to Deck Slop Tank', tankMode: 'transfer',
extraFields: [{ key: 't1', label: 'Start time', kind: 'time' }, { key: 't2', label: 'Stop time', kind: 'time' }],
buildLines: (v: any, tanks: any) => { const from = tanks.find((x: any) => String(x.id) === String(v.fromTankId)); const to = tanks.find((x: any) => String(x.id) === String(v.toTankId)); if (!from || !to) return null;
return [{ item: '13', text: `${from.name}, Capacity ${from.capacity} m³, ${fmt(from.qty)} m³ retained` }, { item: '14', text: `Start: ${v.t1 || '—'}, stop: ${v.t2 || '—'}` }, { item: '15.3', text: `Transferred to ${to.name}, now containing ${fmt(to.qty)} m³` }]; } },
{ key: 'bilge_weekly', tankType: 'bilge', code: 'I', label: 'Weekly Inventory of Bilge Water Tank (voluntary)', tankMode: 'single', extraFields: [],
buildLines: (v: any, tanks: any) => { const t = tanks.find((x: any) => String(x.id) === String(v.tankId)); if (!t) return null;
return [{ item: '', text: 'Weekly Inventory of Bilge Water Tanks (listed under item 3.3)' }, { item: '', text: `${t.name}` }, { item: '', text: `capacity ${t.capacity} m³, ${fmt(t.qty)} m³ retained` }]; } },

{ key: 'h_fuel', tankType: 'bunker', code: 'H', label: 'Bunkering of Fuel Oil', tankMode: 'to-only',
extraFields: [{ key: 'port', label: 'Port', kind: 'text' }, { key: 'd1', label: 'Start date', kind: 'date' }, { key: 'd2', label: 'Stop date', kind: 'date' }, { key: 'grade', label: 'Grade / ISO', kind: 'text', placeholder: 'e.g. ISO-8217 VLSFO' }, { key: 'sulphur', label: 'Sulphur %' }],
buildLines: (v: any, tanks: any) => { const to = tanks.find((x: any) => String(x.id) === String(v.toTankId)); if (!to) return null;
return [{ item: '26.1', text: v.port || '[PORT]' }, { item: '26.2', text: `Start ${v.d1 ? formatDate(v.d1) : '—'}  Stop ${v.d2 ? formatDate(v.d2) : '—'}` }, { item: '26.3', text: `${v.delta || '—'} MT of ${v.grade || '[GRADE]'} ${v.sulphur || '—'}%S bunkered in tanks:` }, { item: '', text: `${v.delta || '—'} MT added to ${to.name}, now containing ${fmt(to.qty)} MT` }]; } },

{ key: 'h_lube', tankType: 'lo', code: 'H', label: 'Bunkering of Bulk Lubricating Oil', tankMode: 'to-only',
extraFields: [{ key: 'port', label: 'Port', kind: 'text' }, { key: 'd1', label: 'Start date', kind: 'date' }, { key: 'd2', label: 'Stop date', kind: 'date' }, { key: 'type', label: 'Type of oil', kind: 'text', placeholder: 'e.g. SAE 40 System Oil' }],
buildLines: (v: any, tanks: any) => { const to = tanks.find((x: any) => String(x.id) === String(v.toTankId)); if (!to) return null;
return [{ item: '26.1', text: v.port || '[PORT]' }, { item: '26.2', text: `Start ${v.d1 ? formatDate(v.d1) : '—'}  Stop ${v.d2 ? formatDate(v.d2) : '—'}` }, { item: '26.4', text: `${v.delta || '—'} MT ${v.type || '[TYPE]'} bunkered in tanks:` }, { item: '', text: `${v.delta || '—'} MT added to ${to.name}, now containing ${fmt(to.qty)} MT` }]; } },

{ key: 'f_failure', tankType: 'other', code: 'F', label: 'Failure / Restoration of Oil Filtering Equipment (OWS/OCM)', tankMode: 'none',
extraFields: [{ key: 't1', label: 'Time of failure', kind: 'time' }, { key: 't2', label: 'Time restored (leave blank if still down)', kind: 'time' }, { key: 'reason', label: 'Reason (if known)', kind: 'text', placeholder: 'e.g. spare parts ordered' }],
buildLines: (v: any) => [{ item: '19', text: v.t1 || '—' }, { item: '20', text: v.t2 || '(unknown / still pending)' }, { item: '21', text: v.reason || '[REASON, IF KNOWN]' }] },

{ key: 'g_accidental', tankType: 'other', code: 'G', label: 'Accidental / Exceptional Discharge of Oil', tankMode: 'none',
extraFields: [{ key: 't1', label: 'Time', kind: 'time' }, { key: 'pos', label: 'Position', kind: 'text', placeholder: "e.g. 41°00'N, 029°00'E" }, { key: 'qty', label: 'Quantity of oily residue (if known)', kind: 'text' }, { key: 'circ', label: 'Circumstances', kind: 'text', placeholder: 'e.g. ruptured bunkering hose/flange' }],
buildLines: (v: any) => [{ item: '22', text: v.t1 || '—' }, { item: '23', text: `Position: ${v.pos || '[POSITION]'}` }, { item: '24', text: v.qty || '[QUANTITY IF KNOWN]' }, { item: '25', text: v.circ || '[CIRCUMSTANCES]' }] },

{ key: 'free_text', tankType: 'other', code: null, label: 'Free Text / Custom Entry', tankMode: 'freetext', extraFields: [], buildLines: null },
];

const OTHER_PRESETS = [
  { label: '15ppm Equipment Test', text: 'OWS unit 15 ppm alarm device and 3-way valve tested. Found satisfactory.' },
  { label: 'Valve Sealed', text: 'Overboard valve [VALVE NO.] from 15 ppm bilge water separator unit sealed, seal no.: [SEAL NO.]' },
  { label: 'Valve Unsealed', text: 'Overboard valve [VALVE NO.] from 15 ppm bilge water separator unit unsealed for normal operation of 15 ppm unit, seal no.: [SEAL NO.]' },
  { label: 'Cargo Hold Bilge to Tank', text: '[QTY] m³ oily bilge water from Cargo Hold bilge holding tank to [TANK NAME]' },
  { label: 'Missed Entry Note', text: 'Entry pertaining to an earlier missed operational entry, dated [DATE].' },
  { label: 'De-Bunkering Notice', text: 'De-bunkering carried out at [PORT]. See separate entry for details.' },
];

const CATEGORIES = [
{ key: 'sludge', label: '🛢️ Sludge Operations' },
{ key: 'bilge', label: '💧 Bilge Water Operations' },
{ key: 'bunker', label: '⛽ Bunkering (Fuel)' },
{ key: 'lo', label: '🧴 Lub Oil (LO)' },
{ key: 'other', label: '📝 Other / Free Text' },
];

const LINES_PER_PAGE = 25;
const selStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', background: '#141845', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, padding: '9px 11px', color: '#eef4fa', fontSize: 13, fontFamily: 'inherit' };

function reverseEffect(tanks: any[], entry: any) {
if (!entry.effect) return tanks;
const { mode, fromTankId, toTankId, delta } = entry.effect;
return tanks.map((t) => {
if (mode === 'transfer') {
if (String(t.id) === String(fromTankId)) return { ...t, qty: t.qty + delta };
if (String(t.id) === String(toTankId)) return { ...t, qty: t.qty - delta };
} else if (mode === 'from-only' && String(t.id) === String(fromTankId)) return { ...t, qty: t.qty + delta };
else if (mode === 'to-only' && String(t.id) === String(toTankId)) return { ...t, qty: t.qty - delta };
return t;
});
}
function applyEffect(tanks: any[], mode: any, fromTankId: any, toTankId: any, delta: number) {
return tanks.map((t) => {
if (mode === 'transfer') {
if (String(t.id) === String(fromTankId)) return { ...t, qty: t.qty - delta };
if (String(t.id) === String(toTankId)) return { ...t, qty: t.qty + delta };
} else if (mode === 'from-only' && String(t.id) === String(fromTankId)) return { ...t, qty: t.qty - delta };
else if (mode === 'to-only' && String(t.id) === String(toTankId)) return { ...t, qty: t.qty + delta };
return t;
});
}

const TRIAL_MAX_TANKS = 2;
const TRIAL_MAX_LOGS = 2;
const TRIAL_HOURS = 100;
const TRIAL_STORAGE_KEY = 'scf-orb-trial';

export default function OilRecordBookPage() {
const [step, setStep] = useState('setup');
const [vessel, setVessel] = useState({ name: '', gt: '', imo: '', official: '' });
const [equipment, setEquipment] = useState({ incineratorRate: '', owsCapacity: '' });
const [officers, setOfficers] = useState<any[]>([]);
const [tanks, setTanks] = useState<any[]>([]);

const [newOfficerRank, setNewOfficerRank] = useState('');
const [newOfficerName, setNewOfficerName] = useState('');
const [trialTankCount, setTrialTankCount] = useState(0);
const [trialLogCount, setTrialLogCount] = useState(0);
const [trialStartedAt, setTrialStartedAt] = useState<number | null>(null);
const [showUpgrade, setShowUpgrade] = useState(false);
const [newTankName, setNewTankName] = useState('');
const [newTankCap, setNewTankCap] = useState('');
const [newTankQty, setNewTankQty] = useState('0');

const [entries, setEntries] = useState<any[]>([]);
const [fDate, setFDate] = useState('');
const [category, setCategory] = useState('sludge');
const [opKey, setOpKey] = useState('c11_inventory');
const [values, setValues] = useState<any>({});
const [officerId, setOfficerId] = useState('');
const [saved, setSaved] = useState(false);
const [pdfBusy, setPdfBusy] = useState(false);
const [warning, setWarning] = useState('');
const [page, setPage] = useState(1);
const [editingId, setEditingId] = useState<string | null>(null);

const [otherTime, setOtherTime] = useState('');
const [otherCode, setOtherCode] = useState('I');
const [otherItem, setOtherItem] = useState('');
const [otherText, setOtherText] = useState('');

const opsInCategory = OPERATIONS.filter((o) => o.tankType === category);
const op = opsInCategory.find((o) => o.key === opKey) || opsInCategory[0];
const tanksInCategory = tanks.filter((t) => t.type === category);

function addOfficer() { if (!newOfficerRank.trim() || !newOfficerName.trim()) return; setOfficers([...officers, { id: Date.now(), rank: newOfficerRank.trim(), name: newOfficerName.trim() }]); setNewOfficerRank(''); setNewOfficerName(''); }
function addTank(type: any) {
  if (!newTankName.trim() || !newTankCap) return;
  if (!canAddTank()) { setShowUpgrade(true); return; }
  setTanks([...tanks, { id: Date.now(), type, name: newTankName.trim(), capacity: parseNum(newTankCap), qty: parseNum(newTankQty) }]);
  setNewTankName(''); setNewTankCap(''); setNewTankQty('0');
  registerTrialTankUse();
}
function removeOfficer(id: any) { setOfficers(officers.filter((o: any) => o.id !== id)); }
function removeTank(id: any) { setTanks(tanks.filter((t: any) => t.id !== id)); }
function setVal(k: string, v: any) { setValues((prev: any) => ({ ...prev, [k]: v })); }

useEffect(() => {
  try {
    const raw = localStorage.getItem(TRIAL_STORAGE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      setTrialTankCount(d.tankCount || 0);
      setTrialLogCount(d.logCount || 0);
      setTrialStartedAt(d.startedAt || null);
    }
  } catch { /* ignore */ }
}, []);

function persistTrial(tankCount: number, logCount: number, startedAt: number | null) {
  try {
    localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify({ tankCount, logCount, startedAt }));
  } catch { /* ignore */ }
}

function getTrialHoursElapsed() {
  if (!trialStartedAt) return 0;
  return (Date.now() - trialStartedAt) / (1000 * 60 * 60);
}

function isTrialExpiredByTime() {
  return trialStartedAt != null && getTrialHoursElapsed() >= TRIAL_HOURS;
}

function canAddTank() {
  return trialTankCount < TRIAL_MAX_TANKS && !isTrialExpiredByTime();
}

function canAddLog() {
  return trialLogCount < TRIAL_MAX_LOGS && !isTrialExpiredByTime();
}

function registerTrialTankUse() {
  const startedAt = trialStartedAt || Date.now();
  const nextCount = trialTankCount + 1;
  setTrialStartedAt(startedAt);
  setTrialTankCount(nextCount);
  persistTrial(nextCount, trialLogCount, startedAt);
}

function registerTrialLogUse() {
  const startedAt = trialStartedAt || Date.now();
  const nextCount = trialLogCount + 1;
  setTrialStartedAt(startedAt);
  setTrialLogCount(nextCount);
  persistTrial(trialTankCount, nextCount, startedAt);
}

function changeCategory(cat: any) {
setCategory(cat);
const firstOp = OPERATIONS.find((o) => o.tankType === cat);
setOpKey(firstOp ? firstOp.key : '');
setValues({}); setWarning(''); setEditingId(null);
}

function resetForm() {
setValues({}); setOfficerId(''); setFDate(''); setWarning(''); setEditingId(null);
setOtherTime(''); setOtherCode('I'); setOtherItem(''); setOtherText('');
}

function addEntry() {
setWarning('');
if (!canAddLog()) { setShowUpgrade(true); return; }
if (!fDate) { setWarning('⚠ Please select a date first.'); return; }

if (op && op.tankMode === 'freetext') {
  if (!otherText.trim()) { setWarning('⚠ Please enter the record text.'); return; }
  if (!officerId) { setWarning('⚠ Please select the officer in charge.'); return; }
  const officer = officers.find((o) => String(o.id) === String(officerId));
  const officerLabel = officer ? `${officer.rank} ${officer.name}` : '';
  const lines = [{ item: otherItem || '', text: otherText.trim() }];
  const entry = { id: Date.now(), date: fDate, code: otherCode, lines, officer: officerLabel, opKey: 'other', effect: null, rawValues: { otherTime, otherCode, otherItem, otherText }, officerId };
  setEntries((prev) => {
    const filtered = prev.filter((e) => e.id !== entry.id);
    return [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date));
  });
  resetForm();
  registerTrialLogUse();
  setSaved(true); setTimeout(() => setSaved(false), 1200);
  return;
}

if (!op) { setWarning('⚠ Please select an operation.'); return; }
if (op.tankMode === 'single' && !values.tankId) { setWarning('⚠ Please select a tank.'); return; }
if ((op.tankMode === 'from-only' || op.tankMode === 'transfer') && !values.fromTankId) { setWarning('⚠ Please select the "From" tank.'); return; }
if ((op.tankMode === 'to-only' || op.tankMode === 'transfer') && !values.toTankId) { setWarning('⚠ Please select the "To" tank.'); return; }
if ((op.tankMode === 'from-only' || op.tankMode === 'to-only' || op.tankMode === 'transfer') && !values.delta) { setWarning('⚠ Please enter a quantity.'); return; }
if (!officerId) { setWarning('⚠ Please select the officer in charge.'); return; }

const delta = parseNum(values.delta);

if (op.tankMode === 'transfer' || op.tankMode === 'to-only') {
  const to = tanks.find((t) => String(t.id) === String(values.toTankId));
  if (to && to.qty + delta > to.capacity + 0.001) {
    setWarning(`⚠ This exceeds ${to.name}'s capacity (${to.capacity} m³). Resulting quantity would be ${fmt(to.qty + delta)} m³.`);
    return;
  }
}
if (op.tankMode === 'transfer' || op.tankMode === 'from-only') {
  const from = tanks.find((t) => String(t.id) === String(values.fromTankId));
  if (from && from.qty - delta < -0.001) {
    setWarning(`⚠ ${from.name} only has ${fmt(from.qty)} m³ — cannot remove ${delta} m³.`);
    return;
  }
}
if (op.key === 'c123_incinerator' && equipment.incineratorRate) {
  const hours = parseNum(values.hours);
  const rate = parseNum(equipment.incineratorRate);
  if (hours > 0 && rate > 0 && delta / hours > rate + 0.001) {
    setWarning(`⚠ This exceeds the incinerator's hourly rate (${rate} m³/hr). ${delta} m³ in ${hours} hr = ${fmt(delta / hours)} m³/hr.`);
    return;
  }
}
if (op.key === 'd_overboard' && equipment.owsCapacity) {
  const hrs = hoursBetween(values.t1, values.t2);
  const cap = parseNum(equipment.owsCapacity);
  if (hrs > 0 && cap > 0 && delta / hrs > cap + 0.001) {
    setWarning(`⚠ This exceeds the OWS pump's hourly capacity (${cap} m³/hr). ${delta} m³ over ${fmt(hrs)} hr = ${fmt(delta / hrs)} m³/hr.`);
    return;
  }
}

const newTanks = applyEffect(tanks, op.tankMode, values.fromTankId, values.toTankId, delta);
setTanks(newTanks);

const lines = op.buildLines!(values, newTanks);
const officer = officers.find((o) => String(o.id) === String(officerId));
const officerLabel = officer ? `${officer.rank} ${officer.name}` : '';
const effect = (op.tankMode === 'from-only' || op.tankMode === 'to-only' || op.tankMode === 'transfer') ? { mode: op.tankMode, fromTankId: values.fromTankId, toTankId: values.toTankId, delta } : null;
const entry = { id: Date.now(), date: fDate, code: op.code, lines, officer: officerLabel, opKey: op.key, effect, rawValues: values, officerId };

setEntries((prev) => {
  const filtered = prev.filter((e) => e.id !== entry.id);
  return [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date));
});
resetForm();
registerTrialLogUse();
setSaved(true); setTimeout(() => setSaved(false), 1200);
}

function deleteEntry(entry: any) {
setTanks((prev) => reverseEffect(prev, entry));
setEntries((prev) => prev.filter((e) => e.id !== entry.id));
}

const logRows: any[] = [];
entries.forEach((e) => {
(e.lines || []).forEach((ln: any, i: number) => { logRows.push({ entryId: e.id, date: i === 0 ? formatDate(e.date) : '', code: i === 0 ? e.code : '', item: ln.item, text: ln.text }); });
if (e.officer) logRows.push({ entryId: e.id, date: '', code: '', item: '', text: `signed: ${e.officer}, ${formatDate(e.date)}`, isSign: true });
});

const totalPages = Math.max(1, Math.ceil(logRows.length / LINES_PER_PAGE));
const pageRows = logRows.slice((page - 1) * LINES_PER_PAGE, page * LINES_PER_PAGE);
const totalSludge = tanks.filter((t) => t.type === 'sludge').reduce((s, t) => s + t.qty, 0);
const totalBilge = tanks.filter((t) => t.type === 'bilge').reduce((s, t) => s + t.qty, 0);

function printLog() { window.print(); }

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

async function generatePdfBlob() {
  const { jsPDF } = await loadJsPdf();
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 40;
  const maxWidth = 595 - margin * 2;
  doc.setFont('Courier', 'normal');
  doc.setFontSize(9);
  let y = margin;
  const lineHeight = 12;

  function addLine(text: string) {
    const wrapped = doc.splitTextToSize(text, maxWidth);
    for (const w of wrapped) {
      if (y > 800) { doc.addPage(); y = margin; }
      doc.text(w, margin, y);
      y += lineHeight;
    }
  }

  addLine(`Name of ship: ${vessel.name || '—'}`);
  addLine(`Gross Tonnage: ${vessel.gt || '—'}    IMO: ${vessel.imo || '—'}    Official No.: ${vessel.official || '—'}`);
  addLine('');
  addLine('MACHINERY SPACE OPERATIONS');
  addLine('');

  entries.forEach((e) => {
    addLine(`${formatDate(e.date)}   Code ${e.code}`);
    (e.lines || []).forEach((ln: any) => {
      addLine(`${ln.item ? ln.item + '  ' : ''}${ln.text}`);
    });
    if (e.officer) addLine(`signed: ${e.officer}, ${formatDate(e.date)}`);
    addLine('');
  });

  return doc.output('blob');
}

async function handleDownloadPdf(setBusy: any, vesselName: string) {
  setBusy(true);
  try {
    const blob = await generatePdfBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ORB-${(vesselName || 'vessel').replace(/\s+/g, '')}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) { /* ignore */ }
  setBusy(false);
}

async function handleSharePdf(setBusy: any, vesselName: string) {
  setBusy(true);
  try {
    const blob = await generatePdfBlob();
    const fileName = `ORB-${(vesselName || 'vessel').replace(/\s+/g, '')}.pdf`;
    const file = new File([blob], fileName, { type: 'application/pdf' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: fileName });
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  } catch (err) { /* ignore */ }
  setBusy(false);
}

const previewLines = op && op.tankMode !== 'freetext' ? op.buildLines!(values, tanks) : null;

const dateTimeIconFix = (
  <style>{`
    input[type="date"]::-webkit-calendar-picker-indicator,
    input[type="time"]::-webkit-calendar-picker-indicator {
      filter: invert(1) brightness(1.6);
      cursor: pointer;
    }
    .orb-g2{display:grid;grid-template-columns:1fr 1fr}
    .orb-g12{display:grid;grid-template-columns:1fr 2fr}
    .orb-g2a{display:grid;grid-template-columns:1fr 1fr auto}
    .orb-g21{display:grid;grid-template-columns:2fr 1fr}
    .orb-g1a{display:grid;grid-template-columns:1fr auto}
    @media(max-width:640px){
      .orb-g2,.orb-g12,.orb-g21,.orb-g1a{grid-template-columns:1fr}
      .orb-g2a{grid-template-columns:1fr 1fr}
    }
  `}</style>
);

if (step === 'setup') {
return (
<div style={outerStyle}>
{dateTimeIconFix}
<div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 60px' }}>
<Link href="/tools" style={{ color: '#a8bdd2', textDecoration: 'none', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 20 }}>← All Tools</Link>
<div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Oil Record Book Setup</div>
<p style={{ color: '#a8bdd2', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>Use a dot (.) for decimals, e.g. 0.55</p>

      {showUpgrade && (
        <div style={{ background: 'linear-gradient(160deg,rgba(251,191,36,.12),#050716)', border: '2px solid rgba(251,191,36,.4)', borderRadius: 14, padding: 20, marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>🔒 Free trial limit reached</div>
          <p style={{ fontSize: 12.5, color: '#a8bdd2', lineHeight: 1.6, marginBottom: 14 }}>
            {isTrialExpiredByTime()
              ? 'Your 100-hour free trial has ended.'
              : `You've used your free ${TRIAL_MAX_TANKS} tank entries and ${TRIAL_MAX_LOGS} log entries.`}
            {' '}Upgrade to keep using the full Oil Record Book tool.
          </p>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fbbf24', marginBottom: 4 }}>$29.90 / year</div>
          <button style={{ background: 'linear-gradient(135deg,#fbbf24,#e0a010)', color: '#0b0e13', border: 'none', borderRadius: 9, padding: '11px 22px', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', marginTop: 8 }} onClick={() => { window.location.href = '/upgrade?tool=orb'; }}>
            Upgrade Now
          </button>
          <div style={{ marginTop: 10 }}>
            <button style={{ background: 'none', border: 'none', color: '#6b83a0', fontSize: 11.5, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowUpgrade(false)}>Maybe later</button>
          </div>
        </div>
      )}

      {!showUpgrade && (trialTankCount > 0 || trialLogCount > 0) && !isTrialExpiredByTime() && (
        <div style={{ background: 'rgba(90,166,232,.08)', border: '1px solid rgba(90,166,232,.25)', borderRadius: 9, padding: '9px 12px', marginBottom: 16, fontSize: 11.5, color: '#7db8ea', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
          <span>🎁 Free trial: {trialTankCount}/{TRIAL_MAX_TANKS} tanks · {trialLogCount}/{TRIAL_MAX_LOGS} log entries used</span>
          <span>{Math.max(0, Math.ceil(TRIAL_HOURS - getTrialHoursElapsed()))}h remaining</span>
        </div>
      )}

      <div style={cardStyle}>
        <span style={labelStyle}>Vessel Details</span>
        <div className="orb-g2" style={{ gap: 10 }}>
          <div><span style={fieldLabelStyle}>Name of ship</span><input style={inpStyle} value={vessel.name} onChange={(e) => setVessel({ ...vessel, name: e.target.value })} /></div>
          <div><span style={fieldLabelStyle}>Gross Tonnage</span><input style={inpStyle} value={vessel.gt} onChange={(e) => setVessel({ ...vessel, gt: e.target.value })} /></div>
          <div><span style={fieldLabelStyle}>IMO Number</span><input style={inpStyle} value={vessel.imo} onChange={(e) => setVessel({ ...vessel, imo: e.target.value })} /></div>
          <div><span style={fieldLabelStyle}>Official Number</span><input style={inpStyle} value={vessel.official} onChange={(e) => setVessel({ ...vessel, official: e.target.value })} /></div>
        </div>
      </div>

      <div style={cardStyle}>
        <span style={labelStyle}>⚙️ Equipment Capacities (for overuse warnings)</span>
        <div className="orb-g2" style={{ gap: 10 }}>
          <div><span style={fieldLabelStyle}>Incinerator sludge burn rate (m³/hour)</span><input style={inpStyle} value={equipment.incineratorRate} onChange={(e) => setEquipment({ ...equipment, incineratorRate: e.target.value })} placeholder="e.g. 0.60" /></div>
          <div><span style={fieldLabelStyle}>OWS pump capacity (m³/hour)</span><input style={inpStyle} value={equipment.owsCapacity} onChange={(e) => setEquipment({ ...equipment, owsCapacity: e.target.value })} placeholder="e.g. 5" /></div>
        </div>
      </div>

      <div style={cardStyle}>
        <span style={labelStyle}>Officers</span>
        {officers.map((o) => (<div key={o.id} style={rowChipStyle}><span>{o.rank} — {o.name}</span><button onClick={() => removeOfficer(o.id)} style={delBtnStyle}>✕</button></div>))}
        <div className="orb-g2a" style={{ gap: 8, marginTop: 8 }}>
          <input style={inpStyle} placeholder="Rank (e.g. C/E)" value={newOfficerRank} onChange={(e) => setNewOfficerRank(e.target.value)} />
          <input style={inpStyle} placeholder="Name" value={newOfficerName} onChange={(e) => setNewOfficerName(e.target.value)} />
          <button onClick={addOfficer} style={addBtnStyle}>+ Add</button>
        </div>
      </div>

      {[{ type: 'sludge', icon: '🛢️', label: 'Sludge Tanks' }, { type: 'bilge', icon: '💧', label: 'Bilge Water Tanks' }, { type: 'bunker', icon: '⛽', label: 'Fuel Bunker Tanks' }, { type: 'lo', icon: '🧴', label: 'Lub Oil Tanks' }].map((cat) => (
        <div style={cardStyle} key={cat.type}>
          <span style={labelStyle}>{cat.icon} {cat.label}</span>
          {tanks.filter((t) => t.type === cat.type).map((t) => (
            <div key={t.id} style={rowChipStyle}><span>{t.name} — Cap {t.capacity} m³ — start {t.qty} m³</span><button onClick={() => removeTank(t.id)} style={delBtnStyle}>✕</button></div>
          ))}
          <TankAddForm onAdd={() => addTank(cat.type)} name={newTankName} setName={setNewTankName} cap={newTankCap} setCap={setNewTankCap} qty={newTankQty} setQty={setNewTankQty} label={`+ Add ${cat.label.replace(' Tanks', '')} Tank`} />
        </div>
      ))}

      <button onClick={() => setStep('main')} style={{ ...addBtnStyle, width: '100%', padding: 14, fontSize: 14 }}>Continue →</button>
    </div>
  </div>
);
}

return (
<div style={outerStyle}>
{dateTimeIconFix}
<div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 60px' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
<div>
<Link href="/tools" style={{ color: '#a8bdd2', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>← All Tools</Link>
<div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{vessel.name || 'Vessel'} — ORB Part I</div>
</div>
<button onClick={() => setStep('setup')} style={{ ...delBtnStyle, fontSize: 11 }}>⚙ Edit Setup</button>
</div>

    <div style={{ background: 'rgba(248,113,113,.1)', border: '2px solid rgba(248,113,113,.4)', borderRadius: 10, padding: 12, fontSize: 12, color: '#fca5a5', lineHeight: 1.5, marginBottom: 16, fontWeight: 600 }}>
      🚨 Draft assistant only — not the official Oil Record Book.
    </div>

    {showUpgrade && (
      <div style={{ background: 'linear-gradient(160deg,rgba(251,191,36,.12),#050716)', border: '2px solid rgba(251,191,36,.4)', borderRadius: 14, padding: 20, marginBottom: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>🔒 Free trial limit reached</div>
        <p style={{ fontSize: 12.5, color: '#a8bdd2', lineHeight: 1.6, marginBottom: 14 }}>
          {isTrialExpiredByTime()
            ? 'Your 100-hour free trial has ended.'
            : `You've used your free ${TRIAL_MAX_TANKS} tank entries and ${TRIAL_MAX_LOGS} log entries.`}
          {' '}Upgrade to keep using the full Oil Record Book tool.
        </p>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fbbf24', marginBottom: 4 }}>$29.90 / year</div>
        <button style={{ background: 'linear-gradient(135deg,#fbbf24,#e0a010)', color: '#0b0e13', border: 'none', borderRadius: 9, padding: '11px 22px', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', marginTop: 8 }} onClick={() => { window.location.href = '/upgrade?tool=orb'; }}>
          Upgrade Now
        </button>
        <div style={{ marginTop: 10 }}>
          <button style={{ background: 'none', border: 'none', color: '#6b83a0', fontSize: 11.5, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowUpgrade(false)}>Maybe later</button>
        </div>
      </div>
    )}

    {!showUpgrade && (trialTankCount > 0 || trialLogCount > 0) && !isTrialExpiredByTime() && (
      <div style={{ background: 'rgba(90,166,232,.08)', border: '1px solid rgba(90,166,232,.25)', borderRadius: 9, padding: '9px 12px', marginBottom: 16, fontSize: 11.5, color: '#7db8ea', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
        <span>🎁 Free trial: {trialTankCount}/{TRIAL_MAX_TANKS} tanks · {trialLogCount}/{TRIAL_MAX_LOGS} log entries used</span>
        <span>{Math.max(0, Math.ceil(TRIAL_HOURS - getTrialHoursElapsed()))}h remaining</span>
      </div>
    )}

    <div style={cardStyle}>
      <span style={labelStyle}>Add Entry</span>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {CATEGORIES.map((c) => (<button key={c.key} onClick={() => changeCategory(c.key)} style={{ ...catBtnStyle, ...(category === c.key ? catBtnActiveStyle : {}) }}>{c.label}</button>))}
      </div>

      <div className="orb-g12" style={{ gap: 10, marginBottom: 12 }}>
        <div><span style={fieldLabelStyle}>Date</span><input type="date" style={inpStyle} value={fDate} onChange={(e) => setFDate(e.target.value)} /></div>
        <div>
          <span style={fieldLabelStyle}>Operation</span>
          <select style={selStyle} value={opKey} onChange={(e) => { setOpKey(e.target.value); setValues({}); setWarning(''); }}>
            {opsInCategory.map((o) => <option key={o.key} value={o.key} style={{ background: '#141845', color: '#eef4fa' }}>{o.label}</option>)}
          </select>
        </div>
      </div>
      {op && op.tankMode === 'freetext' && (
        <div style={{ marginBottom: 12 }}><span style={fieldLabelStyle}>Time (optional)</span><input type="time" style={inpStyle} value={otherTime} onChange={(e) => setOtherTime(e.target.value)} /></div>
      )}

      {op && op.tankMode === 'freetext' ? (
        <>
          <div className="orb-g2" style={{ gap: 10, marginBottom: 12 }}>
            <div>
              <span style={fieldLabelStyle}>Code</span>
              <select style={selStyle} value={otherCode} onChange={(e) => setOtherCode(e.target.value)}>
                {CODE_OPTIONS.map((c) => <option key={c} value={c} style={{ background: '#141845', color: '#eef4fa' }}>{c}</option>)}
              </select>
            </div>
            <div><span style={fieldLabelStyle}>Item No. (optional)</span><input style={inpStyle} value={otherItem} onChange={(e) => setOtherItem(e.target.value)} placeholder="e.g. leave blank" /></div>
          </div>
          <span style={fieldLabelStyle}>Quick templates (click to fill)</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {OTHER_PRESETS.map((p) => (
              <button key={p.label} onClick={() => setOtherText(p.text)} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', color: '#a8bdd2', borderRadius: 8, padding: '5px 10px', fontSize: 11, cursor: 'pointer' }}>{p.label}</button>
            ))}
          </div>
          <span style={fieldLabelStyle}>Record text</span>
          <textarea style={{ ...inpStyle, resize: 'vertical', minHeight: 70, marginBottom: 12 }} value={otherText} onChange={(e) => setOtherText(e.target.value)} placeholder="e.g. OWS unit 15 ppm alarm device and 3-way valve tested. Found satisfactory." />
        </>
      ) : op && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: '#fbbf24', background: 'rgba(251,191,36,.1)', padding: '4px 10px', borderRadius: 6 }}>Code {op.code}</span>
          </div>
          {(op.tankMode === 'from-only' || op.tankMode === 'transfer' || op.tankMode === 'single') && (
            <div style={{ marginBottom: 10 }}>
              <span style={fieldLabelStyle}>{op.tankMode === 'single' ? 'Tank' : 'From tank'}</span>
              <select style={selStyle} value={op.tankMode === 'single' ? (values.tankId || '') : (values.fromTankId || '')} onChange={(e) => setVal(op.tankMode === 'single' ? 'tankId' : 'fromTankId', e.target.value)}>
                <option value="" style={{ background: '#141845' }}>Select tank...</option>
                {(op.key === 'c124_evap' ? tanks : tanksInCategory).map((t) => <option key={t.id} value={t.id} style={{ background: '#141845', color: '#eef4fa' }}>{t.name} (now {fmt(t.qty)} / {t.capacity} m³)</option>)}
              </select>
            </div>
          )}
          {(op.tankMode === 'to-only' || op.tankMode === 'transfer') && (
            <div style={{ marginBottom: 10 }}>
              <span style={fieldLabelStyle}>To tank</span>
              <select style={selStyle} value={values.toTankId || ''} onChange={(e) => setVal('toTankId', e.target.value)}>
                <option value="" style={{ background: '#141845' }}>Select tank...</option>
                {(op.key === 'c122_transfer' ? tanks.filter((t) => t.type === 'sludge' || t.type === 'bilge') : tanksInCategory).map((t) => <option key={t.id} value={t.id} style={{ background: '#141845', color: '#eef4fa' }}>{t.name} (now {fmt(t.qty)} / {t.capacity} m³)</option>)}
              </select>
            </div>
          )}
          {(op.tankMode === 'from-only' || op.tankMode === 'to-only' || op.tankMode === 'transfer') && (
            <div style={{ marginBottom: 10 }}>
              <span style={fieldLabelStyle}>Quantity (delta) — use a dot for decimals</span>
              <input style={inpStyle} value={values.delta || ''} onChange={(e) => setVal('delta', e.target.value)} placeholder="e.g. 0.55" />
            </div>
          )}
          <div className="orb-g2" style={{ gap: 10, marginBottom: 10 }}>
            {op.extraFields.map((f) => (
              <div key={f.key}>
                <span style={fieldLabelStyle}>{f.label}</span>
                <input style={inpStyle} type={f.kind === 'time' ? 'time' : f.kind === 'date' ? 'date' : 'text'} placeholder={f.placeholder} value={values[f.key] || ''} onChange={(e) => setVal(f.key, e.target.value)} />
              </div>
            ))}
          </div>
        </>
      )}

      <span style={fieldLabelStyle}>Officer in charge</span>
      <select style={{ ...selStyle, marginBottom: 12 }} value={officerId} onChange={(e) => setOfficerId(e.target.value)}>
        <option value="" style={{ background: '#141845' }}>Select officer...</option>
        {officers.map((o) => <option key={o.id} value={o.id} style={{ background: '#141845', color: '#eef4fa' }}>{o.rank} {o.name}</option>)}
      </select>

      {op && op.tankMode !== 'freetext' && (
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px dashed rgba(255,255,255,.15)', borderRadius: 9, padding: 12, marginBottom: 12, fontSize: 11.5, color: '#a8bdd2', lineHeight: 1.6 }}>
          <span style={{ color: '#6b83a0', fontSize: 10, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Preview</span>
          {previewLines ? previewLines.map((ln, i) => (<div key={i}>{ln.item && <b style={{ color: '#fbbf24' }}>{ln.item}  </b>}{ln.text}</div>)) : '⚠ Fill in the fields above to see the preview.'}
        </div>
      )}

      {warning && <div style={{ color: '#fca5a5', fontSize: 12, marginBottom: 10, fontWeight: 600 }}>{warning}</div>}

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={addEntry} style={{ ...addBtnStyle, padding: '10px 20px' }}>{saved ? '✓ Added to Log' : '+ Add to Log'}</button>
      </div>
    </div>

    {logRows.length > 0 && (
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ ...labelStyle, marginBottom: 0 }}>Log — Page {page} of {totalPages}</span>
          <button onClick={printLog} style={delBtnStyle}>🖨 Print</button>
          <button onClick={() => handleDownloadPdf(setPdfBusy, vessel.name)} disabled={pdfBusy} style={{ ...delBtnStyle, marginLeft: 8, opacity: pdfBusy ? 0.6 : 1 }}>📄 {pdfBusy ? 'Working...' : 'Download PDF'}</button>
          <button onClick={() => handleSharePdf(setPdfBusy, vessel.name)} disabled={pdfBusy} style={{ ...addBtnStyle, marginLeft: 8, opacity: pdfBusy ? 0.6 : 1 }}>📤 {pdfBusy ? 'Working...' : 'Share'}</button>
        </div>
        <div style={{ background: '#fff', color: '#111', borderRadius: 8, overflow: 'hidden', border: '1px solid #ccc' }}>
          <div style={{ padding: '10px 14px', borderBottom: '2px solid #333', fontSize: 11 }}>
            <div><b>Name of ship:</b> {vessel.name || '—'}</div>
            <div><b>IMO / Official No.:</b> {vessel.imo || '—'} / {vessel.official || '—'}</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 480, borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ ...thStyle, width: 82, whiteSpace: 'nowrap' }}>Date</th>
                <th style={{ ...thStyle, width: 36 }}>Code<br/><span style={{ fontSize: 8, fontWeight: 400, color: '#888' }}>(letter)</span></th>
                <th style={{ ...thStyle, width: 46 }}>Item<br/><span style={{ fontSize: 8, fontWeight: 400, color: '#888' }}>Item Number</span></th>
                <th style={{ ...thStyle, textAlign: 'left' }}>Record of operations</th>
                <th style={{ ...thStyle, width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, i) => {
                const isFirstOfEntry = r.date !== '';
                const entryObj = entries.find((e) => e.id === r.entryId);
                return (
                  <tr key={`${r.entryId}-${i}`} style={{ borderTop: '1px solid #ddd' }}>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap', fontSize: 10 }}>{r.date}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{r.code}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: '#0066aa', fontWeight: 700 }}>{r.item}</td>
                    <td style={{ ...tdStyle, textAlign: 'left', fontStyle: r.isSign ? 'italic' : 'normal' }}>{r.text}</td>
                    <td style={tdStyle}>
                      {isFirstOfEntry && entryObj && (
                        <button onClick={() => deleteEntry(entryObj)} style={miniBtnStyle}>🗑️</button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {Array.from({ length: Math.max(0, LINES_PER_PAGE - pageRows.length) }).map((_, i) => (
                <tr key={`empty-${i}`} style={{ borderTop: '1px solid #eee' }}><td style={tdStyle}>&nbsp;</td><td style={tdStyle}></td><td style={tdStyle}></td><td style={tdStyle}></td><td style={tdStyle}></td></tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {Array.from({ length: totalPages }).map((_, i) => (<button key={i} onClick={() => setPage(i + 1)} style={{ ...delBtnStyle, background: page === i + 1 ? '#fbbf24' : 'rgba(255,255,255,.06)', color: page === i + 1 ? '#0b0e13' : '#eef4fa' }}>{i + 1}</button>))}
          </div>
        )}
      </div>
    )}

    {tanks.length > 0 && (
      <div style={cardStyle}>
        <span style={labelStyle}>Tank Balances</span>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, background: 'rgba(251,191,36,.08)', border: '1px solid rgba(251,191,36,.3)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 10.5, color: '#fbbf24', textTransform: 'uppercase' }}>Total Sludge on Board</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fbbf24' }}>{fmt(totalSludge)} m³</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(90,166,232,.08)', border: '1px solid rgba(90,166,232,.3)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 10.5, color: '#7db8ea', textTransform: 'uppercase' }}>Total Bilge Water on Board</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#7db8ea' }}>{fmt(totalBilge)} m³</div>
          </div>
        </div>
        <div className="orb-g2" style={{ gap: 8 }}>
          {tanks.map((t) => (<div key={t.id} style={{ background: 'rgba(255,255,255,.03)', padding: '8px 10px', borderRadius: 8, fontSize: 12 }}><div style={{ color: '#a8bdd2' }}>{t.name}</div><div style={{ color: '#fbbf24', fontWeight: 700 }}>{fmt(t.qty)} / {t.capacity} m³</div></div>))}
        </div>
      </div>
    )}
  </div>
</div>
);
}

function TankAddForm({ onAdd, name, setName, cap, setCap, qty, setQty, label }: { onAdd: any; name: any; setName: any; cap: any; setCap: any; qty: any; setQty: any; label: any }) {
return (
<div style={{ marginTop: 8 }}>
<div className="orb-g21" style={{ gap: 8, marginBottom: 8 }}>
<input style={inpStyle} placeholder="e.g. Sludge Tank (FR 122-124)" value={name} onChange={(e) => setName(e.target.value)} />
<input style={inpStyle} placeholder="Capacity m³" value={cap} onChange={(e) => setCap(e.target.value)} />
</div>
<div className="orb-g1a" style={{ gap: 8 }}>
<input style={inpStyle} placeholder="Starting quantity m³" value={qty} onChange={(e) => setQty(e.target.value)} />
<button onClick={onAdd} style={addBtnStyle}>{label}</button>
</div>
</div>
);
}

const outerStyle: React.CSSProperties = { minHeight: '100vh', background: '#0d1030', color: '#eef4fa', fontFamily: 'system-ui, sans-serif' };
const cardStyle: React.CSSProperties = { background: 'linear-gradient(165deg,#141845,#050716)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 18, marginBottom: 14 };
const labelStyle: React.CSSProperties = { fontSize: 11, color: '#6b83a0', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700, display: 'block', marginBottom: 10 };
const fieldLabelStyle: React.CSSProperties = { fontSize: 12, color: '#c5d3e8', fontWeight: 700, display: 'block', marginBottom: 5, letterSpacing: '.01em' };
const inpStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, padding: '9px 11px', color: '#eef4fa', fontSize: 13, fontFamily: 'inherit' };
const addBtnStyle: React.CSSProperties = { background: 'linear-gradient(135deg,#fbbf24,#e0a010)', color: '#0b0e13', border: 'none', borderRadius: 9, padding: '9px 14px', fontWeight: 700, fontSize: 12.5, cursor: 'pointer' };
const delBtnStyle: React.CSSProperties = { background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.15)', color: '#eef4fa', borderRadius: 8, padding: '6px 12px', fontWeight: 700, fontSize: 11.5, cursor: 'pointer' };
const miniBtnStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 2 };
const thStyle: React.CSSProperties = { padding: '8px 6px', textAlign: 'center', borderBottom: '1px solid #ccc', fontWeight: 700 };
const tdStyle: React.CSSProperties = { padding: '5px 6px', verticalAlign: 'top' };
const rowChipStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(255,255,255,.03)', borderRadius: 8, marginBottom: 6, fontSize: 12.5 };
const catBtnStyle: React.CSSProperties = { background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', color: '#a8bdd2', borderRadius: 9, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' };
const catBtnActiveStyle: React.CSSProperties = { background: '#fbbf24', color: '#0b0e13', borderColor: '#fbbf24' };
