"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Vessel } from "./vessel-map";

const VesselMap = dynamic(() => import("./vessel-map"), {
  ssr: false,
  loading: () => (
    <div className="vt-maploading">Harita yükleniyor...</div>
  ),
});

export default function VesselTrackerClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Vessel[]>([]);
  const [focused, setFocused] = useState<Vessel | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/ais/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      const vessels: Vessel[] = data.vessels || [];
      setResults(vessels);
      setFocused(vessels[0] || null);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="vt-wrap">
      <style>{`
  .vt-wrap{display:flex;flex-direction:column;height:calc(100dvh - 60px)}
  .vt-searchbar{padding:14px 16px;background:var(--navy2,#141845);border-bottom:1px solid var(--line2,rgba(255,255,255,.08));flex-shrink:0}
  .vt-form{display:flex;gap:8px;max-width:640px;margin:0 auto}
  .vt-input{flex:1;background:rgba(255,255,255,.05);border:1.5px solid var(--line2,rgba(255,255,255,.1));
    border-radius:12px;padding:12px 16px;color:var(--tx,#eef4fa);font-size:15px;outline:none}
  .vt-input:focus{border-color:var(--gold,#fbbf24)}
  .vt-btn{background:linear-gradient(135deg,var(--gold,#fbbf24),var(--gold2,#e0a010));
    color:#0b0e13;border:none;border-radius:12px;padding:0 20px;font-weight:800;font-size:14px;cursor:pointer;white-space:nowrap}
  .vt-btn:disabled{opacity:.6}
  .vt-hint{font-size:11.5px;color:var(--tx3,#6b83a0);text-align:center;margin-top:8px;max-width:640px;margin-left:auto;margin-right:auto}
  .vt-results{max-width:640px;margin:10px auto 0;display:flex;gap:8px;overflow-x:auto;padding-bottom:2px}
  .vt-rescard{flex-shrink:0;background:rgba(255,255,255,.04);border:1px solid var(--line2,rgba(255,255,255,.08));
    border-radius:10px;padding:8px 13px;font-size:12.5px;color:var(--tx2,#a8bdd2);cursor:pointer;white-space:nowrap}
  .vt-rescard.on{border-color:var(--gold,#fbbf24);color:var(--gold,#fbbf24)}
  .vt-empty{font-size:12.5px;color:var(--tx3,#6b83a0);text-align:center;margin-top:10px}
  .vt-mapbox{flex:1;position:relative;min-height:0}
  .vt-maploading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--tx3,#6b83a0);font-size:13px}
      `}</style>

      <div className="vt-searchbar">
        <form className="vt-form" onSubmit={handleSearch}>
          <input
            className="vt-input"
            type="text"
            placeholder="Enter ship name (e.g. MAERSK KANSAS)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="vt-btn" type="submit" disabled={loading}>
            {loading ? "..." : "Search"}
          </button>
        </form>
        <p className="vt-hint">
          Only vessels currently transmitting AIS signal (last 30 min) can be found — ships
          docked in port or with AIS off may not appear.
        </p>

        {searched && results.length > 0 && (
          <div className="vt-results">
            {results.map((v) => (
              <div
                key={v.mmsi}
                className={"vt-rescard" + (focused?.mmsi === v.mmsi ? " on" : "")}
                onClick={() => setFocused(v)}
              >
                🚢 {v.ship_name || v.mmsi} · {v.speed ?? 0} kn
              </div>
            ))}
          </div>
        )}
        {searched && !loading && results.length === 0 && (
          <p className="vt-empty">No vessel currently transmitting matches that name.</p>
        )}
      </div>

      <div className="vt-mapbox">
        <VesselMap vessels={results} focusedVessel={focused} />
      </div>
    </div>
  );
}
