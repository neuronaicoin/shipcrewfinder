"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import type { Vessel, RouteFeature } from "./vessel-map";

const VesselMap = dynamic(() => import("./vessel-map"), {
  ssr: false,
  loading: () => <div className="vt-maploading">Loading map...</div>,
});

type PortOption = { code: string; name: string; country: string; coordinates: [number, number] };

function PortInput({
  label,
  value,
  onSelect,
  onClear,
}: {
  label: string;
  value: PortOption | null;
  onSelect: (p: PortOption) => void;
  onClear: () => void;
}) {
  const [text, setText] = useState("");
  const [options, setOptions] = useState<PortOption[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(v: string) {
    setText(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (v.trim().length < 2) {
      setOptions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/ports/search?q=${encodeURIComponent(v.trim())}`);
        const data = await res.json();
        setOptions(data.ports || []);
        setOpen(true);
      } catch {
        setOptions([]);
      }
    }, 250);
  }

  function startEditing() {
    // Bir liman seçiliyken tekrar odaklanınca alanı temizle, yeniden aranabilsin.
    if (value) {
      onClear();
      setText("");
      setEditing(true);
    }
  }

  const showingSelected = value && !editing;

  return (
    <div className="vt-portwrap">
      <label className="vt-portlabel">{label}</label>
      <div className="vt-portinputrow">
        <input
          className="vt-input"
          type="text"
          placeholder="Port name or UN/LOCODE"
          value={showingSelected ? `${value!.name} (${value!.code})` : text}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={startEditing}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {value && (
          <button
            type="button"
            className="vt-portclear"
            onMouseDown={(e) => {
              e.preventDefault();
              onClear();
              setText("");
              setEditing(true);
            }}
            aria-label={`Clear ${label}`}
          >
            ✕
          </button>
        )}
      </div>
      {open && options.length > 0 && (
        <div className="vt-dropdown">
          {options.map((p) => (
            <div
              key={p.code}
              className="vt-dropitem"
              onMouseDown={() => {
                onSelect(p);
                setText("");
                setOpen(false);
                setEditing(false);
              }}
            >
              <strong>{p.name}</strong> <span className="vt-dropcode">{p.code}</span>
              <div className="vt-dropcountry">{p.country}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VesselTrackerClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Vessel[]>([]);
  const [focused, setFocused] = useState<Vessel | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showEcaSeca, setShowEcaSeca] = useState(false);
  const [showMarpolSpecial, setShowMarpolSpecial] = useState(false);

  // Voyage planner state
  const [mode, setMode] = useState<"track" | "plan">("track");
  const [origin, setOrigin] = useState<PortOption | null>(null);
  const [destination, setDestination] = useState<PortOption | null>(null);
  const [speed, setSpeed] = useState("14");
  const [route, setRoute] = useState<RouteFeature | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distanceNm: number;
    durationHours: number | null;
    passages: string[];
  } | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [viaPoint, setViaPoint] = useState<[number, number] | null>(null); // [lon, lat]
  const [fitTrigger, setFitTrigger] = useState(0);

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

  async function fetchRoute(via: [number, number] | null) {
    if (!origin || !destination) return;
    setRouteLoading(true);
    setRouteError(null);
    try {
      const params = new URLSearchParams({
        from: origin.code,
        to: destination.code,
        speed,
      });
      if (via) params.set("via", `${via[0]},${via[1]}`);

      const res = await fetch(`/api/route?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setRouteError(data.error || "Route could not be calculated.");
        return;
      }
      setRoute(data.route);
      setRouteInfo({
        distanceNm: data.distanceNm,
        durationHours: data.durationHours,
        passages: data.passages || [],
      });
    } catch {
      setRouteError("Route could not be calculated.");
    } finally {
      setRouteLoading(false);
    }
  }

  async function handleCalculateRoute() {
    setViaPoint(null);
    setRoute(null);
    setRouteInfo(null);
    setFitTrigger((n) => n + 1); // yeni rota hesaplanınca haritayı ona odakla
    await fetchRoute(null);
  }

  async function handleDragRoute(lat: number, lon: number) {
    const via: [number, number] = [lon, lat];
    setViaPoint(via);
    await fetchRoute(via); // fitTrigger artmıyor — harita sürükleme sırasında zıplamasın
  }

  return (
    <div className="vt-wrap">
      <style>{`
  .vt-wrap{display:flex;flex-direction:column;height:calc(100dvh - 60px)}
  .vt-searchbar{padding:14px 16px;background:var(--navy2,#141845);border-bottom:1px solid var(--line2,rgba(255,255,255,.08));flex-shrink:0}
  .vt-tabs{display:flex;gap:6px;max-width:640px;margin:0 auto 10px}
  .vt-tab{flex:1;text-align:center;padding:9px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;
    background:rgba(255,255,255,.04);color:var(--tx2,#a8bdd2);border:1px solid var(--line2,rgba(255,255,255,.08))}
  .vt-tab.on{background:linear-gradient(135deg,var(--gold,#fbbf24),var(--gold2,#e0a010));color:#0b0e13;border-color:transparent}
  .vt-form{display:flex;gap:8px;max-width:640px;margin:0 auto}
  .vt-input{width:100%;background:rgba(255,255,255,.05);border:1.5px solid var(--line2,rgba(255,255,255,.1));
    border-radius:12px;padding:12px 16px;color:var(--tx,#eef4fa);font-size:15px;outline:none}
  .vt-input:focus{border-color:var(--gold,#fbbf24)}
  .vt-btn{background:linear-gradient(135deg,var(--gold,#fbbf24),var(--gold2,#e0a010));
    color:#0b0e13;border:none;border-radius:12px;padding:0 20px;font-weight:800;font-size:14px;cursor:pointer;white-space:nowrap}
  .vt-btn:disabled{opacity:.6}
  .vt-btn-ghost{background:transparent;border:1.5px solid var(--line2,rgba(255,255,255,.15));color:var(--tx2,#a8bdd2)}
  .vt-hint{font-size:11.5px;color:var(--tx3,#6b83a0);text-align:center;margin-top:8px;max-width:640px;margin-left:auto;margin-right:auto}
  .vt-results{max-width:640px;margin:10px auto 0;display:flex;gap:8px;overflow-x:auto;padding-bottom:2px}
  .vt-rescard{flex-shrink:0;background:rgba(255,255,255,.04);border:1px solid var(--line2,rgba(255,255,255,.08));
    border-radius:10px;padding:8px 13px;font-size:12.5px;color:var(--tx2,#a8bdd2);cursor:pointer;white-space:nowrap}
  .vt-rescard.on{border-color:var(--gold,#fbbf24);color:var(--gold,#fbbf24)}
  .vt-empty{font-size:12.5px;color:var(--tx3,#6b83a0);text-align:center;margin-top:10px}
  .vt-layers{max-width:640px;margin:10px auto 0;display:flex;gap:14px;flex-wrap:wrap;justify-content:center}
  .vt-layer{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--tx2,#a8bdd2);cursor:pointer;user-select:none}
  .vt-layer input{accent-color:var(--gold,#fbbf24)}
  .vt-layer .sw{width:10px;height:10px;border-radius:2px;flex-shrink:0}
  .vt-layernote{font-size:10.5px;color:var(--tx3,#6b83a0);text-align:center;margin-top:4px;max-width:640px;margin-left:auto;margin-right:auto}
  .vt-mapbox{flex:1;position:relative;min-height:0}
  .vt-maploading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--tx3,#6b83a0);font-size:13px}

  .vt-plan{max-width:640px;margin:0 auto;display:flex;flex-direction:column;gap:10px}
  .vt-planrow{display:flex;gap:8px;flex-wrap:wrap}
  .vt-portwrap{position:relative;flex:1;min-width:180px}
  .vt-portlabel{font-size:11px;color:var(--tx3,#6b83a0);margin-bottom:4px;display:block}
  .vt-portinputrow{position:relative;display:flex;align-items:center}
  .vt-portclear{position:absolute;right:10px;background:none;border:none;color:var(--tx3,#6b83a0);
    cursor:pointer;font-size:13px;padding:4px}
  .vt-portclear:hover{color:var(--gold,#fbbf24)}
  .vt-dropdown{position:absolute;top:100%;left:0;right:0;background:var(--navy2,#141845);
    border:1px solid var(--line2,rgba(255,255,255,.12));border-radius:10px;margin-top:4px;
    max-height:220px;overflow-y:auto;z-index:1000;box-shadow:0 10px 30px rgba(0,0,0,.4)}
  .vt-dropitem{padding:9px 13px;cursor:pointer;font-size:13px;color:var(--tx,#eef4fa);border-bottom:1px solid rgba(255,255,255,.05)}
  .vt-dropitem:hover{background:rgba(251,191,36,.08)}
  .vt-dropcode{color:var(--gold,#fbbf24);font-size:11px;margin-left:4px}
  .vt-dropcountry{font-size:11px;color:var(--tx3,#6b83a0)}
  .vt-speedwrap{width:110px}
  .vt-plancta{display:flex;gap:8px;align-items:flex-end}
  .vt-routeinfo{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;font-size:12.5px;color:var(--tx2,#a8bdd2);
    background:rgba(255,255,255,.04);border:1px solid var(--line2,rgba(255,255,255,.08));border-radius:10px;padding:10px 14px}
  .vt-routeinfo b{color:var(--gold,#fbbf24)}
  .vt-routeerr{font-size:12.5px;color:#f87171;text-align:center}
      `}</style>

      <div className="vt-searchbar">
        <div className="vt-tabs">
          <div className={"vt-tab" + (mode === "track" ? " on" : "")} onClick={() => setMode("track")}>
            🚢 Track a Vessel
          </div>
          <div className={"vt-tab" + (mode === "plan" ? " on" : "")} onClick={() => setMode("plan")}>
            🧭 Plan a Voyage
          </div>
        </div>

        {mode === "track" ? (
          <>
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
          </>
        ) : (
          <div className="vt-plan">
            <div className="vt-planrow">
              <PortInput
                label="From"
                value={origin}
                onSelect={setOrigin}
                onClear={() => setOrigin(null)}
              />
              <PortInput
                label="To"
                value={destination}
                onSelect={setDestination}
                onClear={() => setDestination(null)}
              />
            </div>
            <div className="vt-planrow vt-plancta">
              <div className="vt-speedwrap">
                <label className="vt-portlabel">Speed (kn)</label>
                <input
                  className="vt-input"
                  type="number"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                />
              </div>
              <button
                className="vt-btn"
                onClick={handleCalculateRoute}
                disabled={!origin || !destination || routeLoading}
              >
                {routeLoading ? "Calculating..." : "Calculate Route"}
              </button>
              {viaPoint && (
                <button
                  className="vt-btn vt-btn-ghost"
                  onClick={() => {
                    setViaPoint(null);
                    fetchRoute(null);
                  }}
                >
                  Reset to shortest
                </button>
              )}
            </div>
            {routeError && <p className="vt-routeerr">{routeError}</p>}
            {routeInfo && (
              <div className="vt-routeinfo">
                <span>Distance: <b>{routeInfo.distanceNm.toFixed(0)} nm</b></span>
                {routeInfo.durationHours && (
                  <span>
                    Duration: <b>{(routeInfo.durationHours / 24).toFixed(1)} days</b> (
                    {routeInfo.durationHours.toFixed(0)} h)
                  </span>
                )}
                {routeInfo.passages.length > 0 && (
                  <span>Via: <b>{routeInfo.passages.join(", ")}</b></span>
                )}
              </div>
            )}
            <p className="vt-hint">
              Sea-only route avoiding land, based on major shipping lanes — not for navigation.
              {route && " Drag the white circle on the route to route it through a custom point."}
            </p>
          </div>
        )}

        <div className="vt-layers">
          <label className="vt-layer">
            <input
              type="checkbox"
              checked={showEcaSeca}
              onChange={(e) => setShowEcaSeca(e.target.checked)}
            />
            <span className="sw" style={{ background: "#34d399" }} />
            ECA / SECA zones
          </label>
          <label className="vt-layer">
            <input
              type="checkbox"
              checked={showMarpolSpecial}
              onChange={(e) => setShowMarpolSpecial(e.target.checked)}
            />
            <span className="sw" style={{ background: "#f87171" }} />
            MARPOL Special Areas
          </label>
        </div>
        {(showEcaSeca || showMarpolSpecial) && (
          <p className="vt-layernote">
            Boundaries are simplified approximations for reference only — always verify with
            official charts before making compliance decisions.
          </p>
        )}
      </div>

      <div className="vt-mapbox">
        <VesselMap
          vessels={results}
          focusedVessel={focused}
          showEcaSeca={showEcaSeca}
          showMarpolSpecial={showMarpolSpecial}
          route={route}
          fitTrigger={fitTrigger}
          onDragRoute={handleDragRoute}
        />
      </div>
    </div>
  );
}
