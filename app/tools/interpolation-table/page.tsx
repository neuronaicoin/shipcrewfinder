'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function InterpolationToolPage() {
  const [trimA, setTrimA] = useState('-0.50');
  const [trimB, setTrimB] = useState('1.00');
  const [targetTrim, setTargetTrim] = useState('0.20');
  const [valueA, setValueA] = useState('245.3');
  const [valueB, setValueB] = useState('251.8');

  const tA = parseFloat(trimA);
  const tB = parseFloat(trimB);
  const tT = parseFloat(targetTrim);
  const vA = parseFloat(valueA);
  const vB = parseFloat(valueB);
  const ok = [tA, tB, tT, vA, vB].every((n) => !isNaN(n)) && tA !== tB;
  const result = ok ? (vA + ((vB - vA) * (tT - tA)) / (tB - tA)).toFixed(3) : null;

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .itp-wrap{max-width:460px;margin:0 auto;padding:28px 18px 60px}
        .itp-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .itp-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .itp-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:24px}
        .itp-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
        .itp-label{font-size:11.5px;color:#6b83a0;display:block;margin-bottom:5px}
        .itp-inp{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:11px 13px;color:#eef4fa;font-size:15px;font-family:inherit}
        .itp-inp:focus{outline:none;border-color:#fbbf24}
        .itp-target{margin-bottom:14px}
        .itp-result-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(251,191,36,.25);border-radius:14px;padding:22px;text-align:center;margin-top:6px}
        .itp-result-label{font-size:11.5px;color:#6b83a0;margin-bottom:6px}
        .itp-result-val{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:32px;font-weight:800;color:#fbbf24}
        .itp-formula{font-size:11px;color:#4a5568;margin-top:18px;line-height:1.5;text-align:center}
      `}</style>

      <div className="itp-wrap">
        <Link href="/tools" className="itp-back">← All Tools</Link>
        <div className="itp-title">Interpolation Calculator</div>
        <p className="itp-sub">
          Fuel, oil, ballast, sounding tables and more — enter two known reference points and their table values, get the interpolated result instantly. Nothing is saved.
        </p>

        <div className="itp-row2">
          <div>
            <span className="itp-label">Trim A</span>
            <input className="itp-inp" value={trimA} onChange={(e) => setTrimA(e.target.value)} inputMode="decimal" />
          </div>
          <div>
            <span className="itp-label">Trim B</span>
            <input className="itp-inp" value={trimB} onChange={(e) => setTrimB(e.target.value)} inputMode="decimal" />
          </div>
        </div>

        <div className="itp-target">
          <span className="itp-label">Your actual trim</span>
          <input className="itp-inp" value={targetTrim} onChange={(e) => setTargetTrim(e.target.value)} inputMode="decimal" />
        </div>

        <div className="itp-row2">
          <div>
            <span className="itp-label">Table value @ A</span>
            <input className="itp-inp" value={valueA} onChange={(e) => setValueA(e.target.value)} inputMode="decimal" />
          </div>
          <div>
            <span className="itp-label">Table value @ B</span>
            <input className="itp-inp" value={valueB} onChange={(e) => setValueB(e.target.value)} inputMode="decimal" />
          </div>
        </div>

        <div className="itp-result-card">
          <div className="itp-result-label">Interpolated result</div>
          <div className="itp-result-val">{result ?? '—'}</div>
        </div>

        <p className="itp-formula">
          Result = A + (B − A) × (Target − TrimA) / (TrimB − TrimA)
        </p>
      </div>
    </main>
  );
}
