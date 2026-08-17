'use client';
import { useState } from 'react';
import Link from 'next/link';

type IntervalType = 'hours' | 'days';
interface Equipment { id: number; name: string; currentHours: string; }
interface Task { id: number; equipment: string; task: string; intervalType: IntervalType; interval: string; lastDate: string; lastHours: string; critical: boolean; }

function newTask(id: number): Task {
  return { id, equipment: '', task: '', intervalType: 'hours', interval: '500', lastDate: '', lastHours: '0', critical: false };
}

const STATE_META: Record<string, { label: string; color: string; bg: string }> = {
  overdue: { label: 'OVERDUE', color: '#f87171', bg: 'rgba(248,113,113,.14)' },
  soon: { label: 'DUE SOON', color: '#e8b85a', bg: 'rgba(232,184,90,.14)' },
  ok: { label: 'OK', color: '#34d399', bg: 'rgba(52,211,153,.14)' },
  unset: { label: 'SET UP', color: '#6b83a0', bg: 'rgba(107,131,160,.14)' },
};

function taskStatus(t: Task, equipment: Equipment[]) {
  const interval = parseFloat(t.interval) || 0;
  if (t.intervalType === 'hours') {
    const eq = equipment.find((e) => e.name === t.equipment);
    if (!eq || !t.equipment) return { state: 'unset', detail: 'link equipment' };
    const currentHours = parseFloat(eq.currentHours) || 0;
    const lastHours = parseFloat(t.lastHours) || 0;
    const dueAt = lastHours + interval;
    const remaining = dueAt - currentHours;
    let state = 'ok';
    if (remaining < 0) state = 'overdue';
    else if (remaining <= interval * 0.1) state = 'soon';
    return { state, detail: `due at ${dueAt.toLocaleString()}h (now ${currentHours.toLocaleString()}h)` };
  } else {
    if (!t.lastDate) return { state: 'unset', detail: 'set last date' };
    const ld = new Date(t.lastDate + 'T00:00:00');
    const due = new Date(ld);
    due.setDate(due.getDate() + interval);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const remaining = Math.round((due.getTime() - now.getTime()) / 86400000);
    let state = 'ok';
    if (remaining < 0) state = 'overdue';
    else if (remaining <= Math.max(3, interval * 0.1)) state = 'soon';
    return { state, detail: `due ${due.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` };
  }
}

export default function MaintenancePage() {
  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: 1, name: 'Main Engine', currentHours: '0' },
    { id: 2, name: 'Aux Engine 1', currentHours: '0' },
  ]);
  const [tasks, setTasks] = useState<Task[]>([newTask(1)]);

  const addEquip = () => setEquipment((e) => [...e, { id: (e[e.length - 1]?.id || 0) + 1, name: '', currentHours: '0' }]);
  const delEquip = (id: number) => setEquipment((e) => (e.length > 1 ? e.filter((x) => x.id !== id) : e));
  const updEquip = (id: number, patch: Partial<Equipment>) => setEquipment((e) => e.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const addTask = () => setTasks((t) => [...t, newTask((t[t.length - 1]?.id || 0) + 1)]);
  const delTask = (id: number) => setTasks((t) => (t.length > 1 ? t.filter((x) => x.id !== id) : t));
  const updTask = (id: number, patch: Partial<Task>) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const sortedTasks = [...tasks].sort((a, b) => {
    const order = { overdue: 0, soon: 1, ok: 2, unset: 3 };
    return order[taskStatus(a, equipment).state as keyof typeof order] - order[taskStatus(b, equipment).state as keyof typeof order];
  });

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .mt-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .mt-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .mt-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .mt-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:20px}
        .mt-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:14px}
        .mt-label{font-size:11px;color:#6b83a0;text-transform:uppercase;letter-spacing:.06em;font-weight:700;display:block;margin-bottom:10px}
        .mt-inp,.mt-sel{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:8px 10px;color:#eef4fa;font-size:12.5px;font-family:inherit}
        .mt-inp:focus,.mt-sel:focus{outline:none;border-color:#fbbf24}
        .mt-eq-row{display:grid;grid-template-columns:2fr 1fr 26px;gap:8px;margin-bottom:8px;align-items:center}
        .mt-eq-row input{width:100%}
        .mt-rm{background:none;border:none;color:#6b83a0;cursor:pointer;font-size:15px}
        .mt-rm:hover{color:#f87171}
        .mt-add{background:rgba(255,255,255,.04);border:1px dashed rgba(255,255,255,.2);color:#a8bdd2;border-radius:9px;padding:9px;width:100%;cursor:pointer;font-size:12.5px;font-weight:600;font-family:inherit}
        .mt-add:hover{border-color:#fbbf24;color:#fbbf24}
        .mt-task-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px;margin-bottom:10px}
        .mt-task-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
        .mt-badge{font-size:10px;font-weight:800;letter-spacing:.05em;padding:4px 10px;border-radius:7px}
        .mt-row2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
        .mt-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px}
        .mt-detail{font-size:11.5px;color:#a8bdd2;margin-top:6px}
        @media(max-width:560px){ .mt-row3{grid-template-columns:1fr 1fr} }
      `}</style>

      <div className="mt-wrap">
        <Link href="/tools" className="mt-back">← All Tools</Link>
        <div className="mt-title">Maintenance Tracker</div>
        <p className="mt-sub">
          Set up your equipment running hours and maintenance tasks — status updates automatically. Nothing is saved between visits.
        </p>

        <div className="mt-card">
          <span className="mt-label">Equipment (running hours)</span>
          {equipment.map((e) => (
            <div className="mt-eq-row" key={e.id}>
              <input className="mt-inp" placeholder="Equipment name" value={e.name} onChange={(ev) => updEquip(e.id, { name: ev.target.value })} />
              <input className="mt-inp" placeholder="Hours" value={e.currentHours} onChange={(ev) => updEquip(e.id, { currentHours: ev.target.value })} inputMode="decimal" />
              <button className="mt-rm" onClick={() => delEquip(e.id)} aria-label="Remove">✕</button>
            </div>
          ))}
          <button className="mt-add" onClick={addEquip}>+ Add equipment</button>
        </div>

        <div className="mt-label" style={{ marginBottom: 10 }}>Maintenance tasks (sorted by urgency)</div>
        {sortedTasks.map((t) => {
          const status = taskStatus(t, equipment);
          const meta = STATE_META[status.state];
          return (
            <div className="mt-task-card" key={t.id}>
              <div className="mt-task-top">
                <input className="mt-inp" style={{ flex: 1, marginRight: 10, fontWeight: 700 }} placeholder="Task description" value={t.task} onChange={(e) => updTask(t.id, { task: e.target.value })} />
                <span className="mt-badge" style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
              </div>
              <div className="mt-row3">
                <select className="mt-sel" value={t.equipment} onChange={(e) => updTask(t.id, { equipment: e.target.value })}>
                  <option value="">Equipment...</option>
                  {equipment.map((e) => <option key={e.id} value={e.name}>{e.name}</option>)}
                </select>
                <select className="mt-sel" value={t.intervalType} onChange={(e) => updTask(t.id, { intervalType: e.target.value as IntervalType })}>
                  <option value="hours">By running hours</option>
                  <option value="days">By calendar days</option>
                </select>
                <input className="mt-inp" placeholder="Interval" value={t.interval} onChange={(e) => updTask(t.id, { interval: e.target.value })} inputMode="numeric" />
              </div>
              {t.intervalType === 'hours' ? (
                <div className="mt-row2">
                  <div><span style={{ fontSize: 10.5, color: '#6b83a0' }}>Last done @ hours</span><input className="mt-inp" style={{ width: '100%', marginTop: 3 }} value={t.lastHours} onChange={(e) => updTask(t.id, { lastHours: e.target.value })} inputMode="decimal" /></div>
                  <button className="mt-rm" style={{ justifySelf: 'end', alignSelf: 'end' }} onClick={() => delTask(t.id)}>Remove task ✕</button>
                </div>
              ) : (
                <div className="mt-row2">
                  <div><span style={{ fontSize: 10.5, color: '#6b83a0' }}>Last done date</span><input className="mt-inp" type="date" style={{ width: '100%', marginTop: 3 }} value={t.lastDate} onChange={(e) => updTask(t.id, { lastDate: e.target.value })} /></div>
                  <button className="mt-rm" style={{ justifySelf: 'end', alignSelf: 'end' }} onClick={() => delTask(t.id)}>Remove task ✕</button>
                </div>
              )}
              <div className="mt-detail">{status.detail}</div>
            </div>
          );
        })}
        <button className="mt-add" onClick={addTask} style={{ marginBottom: 16 }}>+ Add task</button>

        <div style={{ background: 'linear-gradient(160deg,rgba(251,191,36,.08),#050716)', border: '1.5px solid rgba(251,191,36,.2)', borderRadius: 16, padding: 20 }}>
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
