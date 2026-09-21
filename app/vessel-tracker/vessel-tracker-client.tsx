"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { ECA_ZONES } from "searoute-ts/eca";
import type { RouteFeature, ViaPoint, WeatherReading } from "./vessel-map";

const VesselMap = dynamic(() => import("./vessel-map"), {
  ssr: false,
  loading: () => <div className="vt-maploading">Loading map...</div>,
});

type PortOption = { code: string; name: string; country: string; coordinates: [number, number] };

function ecaZonesFor(lon: number, lat: number): string[] {
  const matches: string[] = [];
  for (const zone of ECA_ZONES) {
    for (const [minLon, minLat, maxLon, maxLat] of zone.bboxes) {
      if (lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat) {
        matches.push(zone.name);
        break;
      }
    }
  }
  return matches;
}

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
    }, 200);
  }

  function startEditing() {
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
          placeholder="Type a port name or UN/LOCODE..."
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

function PortInfoCard({ label, port }: { label: string; port: PortOption }) {
  const [weather, setWeather] = useState<WeatherReading | null>(null);
  const [loadingWx, setLoadingWx] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingWx(true);
    const [lon, lat] = port.coordinates;
    fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setWeather(d);
      })
      .catch(() => {
        if (!cancelled) setWeather(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingWx(false);
      });
    return () => {
      cancelled = true;
    };
  }, [port.code]);

  const zones = ecaZonesFor(port.coordinates[0], port.coordinates[1]);

  return (
    <div className="vt-portcard">
      <div className="vt-portcard-head">
        <span className="vt-portcard-tag">{label}</span>
        <h3>{port.name}</h3>
        <span className="vt-portcard-code">{port.code} · {port.country}</span>
      </div>

      <div className="vt-portcard-grid">
        <div className="vt-pc-item">
          <span className="vt-pc-label">Coordinates</span>
          <span className="vt-pc-value">
            {port.coordinates[1].toFixed(3)}, {port.coordinates[0].toFixed(3)}
          </span>
        </div>
        <div className="vt-pc-item">
          <span className="vt-pc-label">Emission control zone</span>
          <span className="vt-pc-value">{zones.length > 0 ? zones.join(", ") : "None on record"}</span>
        </div>
        <div className="vt-pc-item">
          <span className="vt-pc-label">Wind</span>
          <span className="vt-pc-value">
            {loadingWx
              ? "Loading..."
              : weather?.weather
              ? `${weather.weather.wind_speed_10m ?? "-"} kn`
              : "N/A"}
          </span>
        </div>
        <div className="vt-pc-item">
          <span className="vt-pc-label">Sea state</span>
          <span className="vt-pc-value">
            {loadingWx
              ? "Loading..."
              : weather?.marine
              ? `${weather.marine.wave_height ?? "-"} m waves`
              : "Inland / N/A"}
          </span>
        </div>
      </div>

      <p className="vt-portcard-note">
        Draft restrictions, tidal windows and channel/pilotage requirements are not available
        here — verify with the official port authority or Admiralty Sailing Directions before
        making operational decisions.
      </p>
    </div>
  );
}

export default function VesselTrackerClient() {
  const [origin, setOrigin] = useState<PortOption | null>(null);
  const [destination, setDestination] = useState<PortOption | null>(null);
  const [speed, setSpeed] = useState("14");
  const [dailyConsumption, setDailyConsumption] = useState("");
  const [rob, setRob] = useState("");
  const [route, setRoute] = useState<RouteFeature | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distanceNm: number;
    durationHours: number | null;
    passages: string[];
  } | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [viaPoints, setViaPoints] = useState<(ViaPoint & { sortKey: number })[]>([]);
  const [fitTrigger, setFitTrigger] = useState(0);
  const [showEcaSeca, setShowEcaSeca] = useState(false);
  const [showMarpolSpecial, setShowMarpolSpecial] = useState(false);
  const [weatherMode, setWeatherMode] = useState(false);
  const [weatherPoint, setWeatherPoint] = useState<{
    lat: number;
    lon: number;
    data: WeatherReading;
  } | null>(null);

  async function fetchRoute(via: (ViaPoint & { sortKey: number })[]) {
    if (!origin || !destination) return;
    setRouteLoading(true);
    setRouteError(null);
    try {
      const params = new URLSearchParams({ from: origin.code, to: destination.code, speed });
      if (via.length > 0) {
        params.set("via", via.map((v) => `${v.lon},${v.lat}`).join(";"));
      }
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
    setViaPoints([]);
    setRoute(null);
    setRouteInfo(null);
    setFitTrigger((n) => n + 1);
    await fetchRoute([]);
  }

  function nearestIndex(lat: number, lon: number): number {
    if (!route) return 0;
    let best = 0;
    let bestDist = Infinity;
    route.geometry.coordinates.forEach((c, i) => {
      const d = (c[0] - lon) ** 2 + (c[1] - lat) ** 2;
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  }

  async function handleAddViaPoint(lat: number, lon: number) {
    const sortKey = nearestIndex(lat, lon);
    const next = [...viaPoints, { lon, lat, sortKey }].sort((a, b) => a.sortKey - b.sortKey);
    setViaPoints(next);
    await fetchRoute(next);
  }

  async function handleDragViaPoint(index: number, lat: number, lon: number) {
    const next = [...viaPoints];
    next[index] = { ...next[index], lon, lat };
    setViaPoints(next);
    await fetchRoute(next);
  }

  async function handleRemoveViaPoint(index: number) {
    const next = viaPoints.filter((_, i) => i !== index);
    setViaPoints(next);
    await fetchRoute(next);
  }

  async function handleMapClickWeather(lat: number, lon: number) {
    setWeatherPoint({ lat, lon, data: { weather: null, marine: null } });
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      setWeatherPoint({ lat, lon, data });
    } catch {
      setWeatherPoint(null);
    }
  }

  const hasCustomRoute = viaPoints.length > 0;
  const dailyCons = parseFloat(dailyConsumption);
  const robStart = parseFloat(rob);
  const voyageDays = routeInfo?.durationHours != null ? routeInfo.durationHours / 24 : null;
  const totalFuelBurned =
    voyageDays != null && !Number.isNaN(dailyCons) ? dailyCons * voyageDays : null;
  const robAtArrival =
    totalFuelBurned != null && !Number.isNaN(robStart) ? robStart - totalFuelBurned : null;

  return (
    <div className="vt-wrap">
      <style>{`
  .vt-wrap{display:flex;flex-direction:column;height:calc(100dvh - 60px);overflow-y:auto}
  .vt-searchbar{padding:16px;background:var(--navy2,#141845);border-bottom:1px solid var(--line2,rgba(255,255,255,.08));flex-shrink:0}
  .vt-title{max-width:760px;margin:0 auto 12px;text-align:center}
  .vt-title h1{font-family:var(--disp,var(--font-bricolage),sans-serif);font-size:1.3rem;font-weight:800;margin-bottom:2px}
  .vt-title p{font-size:12px;color:var(--tx3,#6b83a0)}
  .vt-plan{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:12px}
  .vt-planrow{display:flex;gap:8px;flex-wrap:wrap}
  .vt-portwrap{position:relative;flex:1;min-width:200px}
  .vt-portlabel{font-size:11px;color:var(--tx3,#6b83a0);margin-bottom:4px;display:block;font-weight:600;letter-spacing:.02em}
  .vt-portinputrow{position:relative;display:flex;align-items:center}
  .vt-input{width:100%;background:rgba(255,255,255,.05);border:1.5px solid var(--line2,rgba(255,255,255,.1));
    border-radius:12px;padding:12px 16px;color:var(--tx,#eef4fa);font-size:15px;outline:none}
  .vt-input:focus{border-color:var(--gold,#fbbf24)}
  .vt-portclear{position:absolute;right:10px;background:none;border:none;color:var(--tx3,#6b83a0);cursor:pointer;font-size:13px;padding:4px}
  .vt-portclear:hover{color:var(--gold,#fbbf24)}
  .vt-dropdown{position:absolute;top:100%;left:0;right:0;background:var(--navy2,#141845);
    border:1px solid var(--line2,rgba(255,255,255,.12));border-radius:10px;margin-top:4px;
    max-height:240px;overflow-y:auto;z-index:1000;box-shadow:0 10px 30px rgba(0,0,0,.4)}
  .vt-dropitem{padding:9px 13px;cursor:pointer;font-size:13px;color:var(--tx,#eef4fa);border-bottom:1px solid rgba(255,255,255,.05)}
  .vt-dropitem:hover{background:rgba(251,191,36,.08)}
  .vt-dropcode{color:var(--gold,#fbbf24);font-size:11px;margin-left:4px}
  .vt-dropcountry{font-size:11px;color:var(--tx3,#6b83a0)}
  .vt-numwrap{width:132px}
  .vt-plancta{display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap}
  .vt-btn{background:linear-gradient(135deg,var(--gold,#fbbf24),var(--gold2,#e0a010));
    color:#0b0e13;border:none;border-radius:12px;padding:0 20px;height:44px;font-weight:800;font-size:14px;cursor:pointer;white-space:nowrap}
  .vt-btn:disabled{opacity:.6}
  .vt-btn-ghost{background:transparent;border:1.5px solid var(--line2,rgba(255,255,255,.15));color:var(--tx2,#a8bdd2)}
  .vt-btn-weather{background:rgba(96,165,250,.12);border:1.5px solid rgba(96,165,250,.4);color:#93c5fd}
  .vt-btn-weather.on{background:linear-gradient(135deg,#60a5fa,#3b82f6);color:#0b0e13;border-color:transparent}
  .vt-routeerr{font-size:12.5px;color:#f87171;text-align:center}

  .vt-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}
  .vt-stat{background:rgba(255,255,255,.04);border:1px solid var(--line2,rgba(255,255,255,.08));
    border-radius:12px;padding:12px 14px}
  .vt-stat-label{display:block;font-size:10.5px;color:var(--tx3,#6b83a0);text-transform:uppercase;
    letter-spacing:.05em;font-weight:700;margin-bottom:4px}
  .vt-stat-value{display:block;font-size:17px;font-weight:800;color:var(--tx,#eef4fa)}
  .vt-stat.gold .vt-stat-value{color:var(--gold,#fbbf24)}
  .vt-stat.warn{border-color:rgba(248,113,113,.5);background:rgba(248,113,113,.08)}
  .vt-stat.warn .vt-stat-value{color:#f87171}

  .vt-hint{font-size:11.5px;color:var(--tx3,#6b83a0);text-align:center}

  .vt-layers{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;padding-top:4px;border-top:1px solid var(--line2,rgba(255,255,255,.06))}
  .vt-layer{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--tx2,#a8bdd2);cursor:pointer;user-select:none}
  .vt-layer input{accent-color:var(--gold,#fbbf24)}
  .vt-layer .sw{width:10px;height:10px;border-radius:2px;flex-shrink:0}
  .vt-layernote{font-size:10.5px;color:var(--tx3,#6b83a0);text-align:center}

  .vt-portcards{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  @media(max-width:640px){.vt-portcards{grid-template-columns:1fr}}
  .vt-portcard{background:rgba(255,255,255,.035);border:1px solid var(--line2,rgba(255,255,255,.09));border-radius:14px;padding:14px 16px}
  .vt-portcard-head{margin-bottom:10px}
  .vt-portcard-tag{font-size:10px;font-weight:800;letter-spacing:.08em;color:var(--gold,#fbbf24);text-transform:uppercase}
  .vt-portcard-head h3{font-size:15px;font-weight:800;margin:2px 0}
  .vt-portcard-code{font-size:11px;color:var(--tx3,#6b83a0)}
  .vt-portcard-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 12px;margin-bottom:10px}
  .vt-pc-item{display:flex;flex-direction:column}
  .vt-pc-label{font-size:10px;color:var(--tx3,#6b83a0);text-transform:uppercase;letter-spacing:.04em}
  .vt-pc-value{font-size:12.5px;color:var(--tx,#eef4fa);font-weight:600}
  .vt-portcard-note{font-size:10px;color:var(--tx3,#6b83a0);line-height:1.5;border-top:1px solid var(--line2,rgba(255,255,255,.06));padding-top:8px}

  .vt-mapbox{flex-shrink:0;position:relative;height:55vh;min-height:380px}
  .vt-maploading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--tx3,#6b83a0);font-size:13px}
      `}</style>

      <div className="vt-searchbar">
        <div className="vt-title">
          <h1>🧭 Voyage Planner</h1>
          <p>Real sea-route distance, ETA, fuel and live conditions between any two ports</p>
        </div>

        <div className="vt-plan">
          <div className="vt-planrow">
            <PortInput label="From" value={origin} onSelect={setOrigin} onClear={() => setOrigin(null)} />
            <PortInput
              label="To"
              value={destination}
              onSelect={setDestination}
              onClear={() => setDestination(null)}
            />
          </div>

          <div className="vt-planrow vt-plancta">
            <div className="vt-numwrap">
              <label className="vt-portlabel">Speed (kn)</label>
              <input className="vt-input" type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} />
            </div>
            <div className="vt-numwrap">
              <label className="vt-portlabel">Consumption (t/day)</label>
              <input
                className="vt-input"
                type="number"
                placeholder="optional"
                value={dailyConsumption}
                onChange={(e) => setDailyConsumption(e.target.value)}
              />
            </div>
            <div className="vt-numwrap">
              <label className="vt-portlabel">ROB at departure (t)</label>
              <input
                className="vt-input"
                type="number"
                placeholder="optional"
                value={rob}
                onChange={(e) => setRob(e.target.value)}
              />
            </div>
            <button
              className="vt-btn"
              onClick={handleCalculateRoute}
              disabled={!origin || !destination || routeLoading}
            >
              {routeLoading ? "Calculating..." : "Calculate Route"}
            </button>
            {hasCustomRoute && (
              <button
                className="vt-btn vt-btn-ghost"
                onClick={() => {
                  setViaPoints([]);
                  fetchRoute([]);
                }}
              >
                Reset to shortest
              </button>
            )}
            <button
              className={"vt-btn vt-btn-weather" + (weatherMode ? " on" : "")}
              onClick={() => setWeatherMode((m) => !m)}
            >
              🌦 {weatherMode ? "Weather mode on" : "Check weather"}
            </button>
          </div>

          {routeError && <p className="vt-routeerr">{routeError}</p>}

          {routeInfo && (
            <div className="vt-stats">
              <div className="vt-stat gold">
                <span className="vt-stat-label">Distance</span>
                <span className="vt-stat-value">{routeInfo.distanceNm.toFixed(0)} nm</span>
              </div>
              {routeInfo.durationHours != null && (
                <div className="vt-stat gold">
                  <span className="vt-stat-label">Duration</span>
                  <span className="vt-stat-value">{(routeInfo.durationHours / 24).toFixed(1)} days</span>
                </div>
              )}
              {routeInfo.passages.length > 0 && (
                <div className="vt-stat">
                  <span className="vt-stat-label">Passages</span>
                  <span className="vt-stat-value" style={{ fontSize: 13 }}>
                    {routeInfo.passages.join(", ")}
                  </span>
                </div>
              )}
              {totalFuelBurned !== null && (
                <div className="vt-stat">
                  <span className="vt-stat-label">Fuel burned</span>
                  <span className="vt-stat-value">{totalFuelBurned.toFixed(1)} t</span>
                </div>
              )}
              {robAtArrival !== null && (
                <div className={"vt-stat" + (robAtArrival < 0 ? " warn" : "")}>
                  <span className="vt-stat-label">ROB at arrival</span>
                  <span className="vt-stat-value">
                    {robAtArrival.toFixed(1)} t{robAtArrival < 0 ? " ⚠" : ""}
                  </span>
                </div>
              )}
            </div>
          )}

          <p className="vt-hint">
            Sea-only route avoiding land, based on major shipping lanes — not for navigation.
            {route && " Double-click anywhere on the route to add a point, drag it to reshape, double-click a point to remove it."}
          </p>

          {origin && destination && (
            <div className="vt-portcards">
              <PortInfoCard label="Departure" port={origin} />
              <PortInfoCard label="Arrival" port={destination} />
            </div>
          )}

          <div className="vt-layers">
            <label className="vt-layer">
              <input type="checkbox" checked={showEcaSeca} onChange={(e) => setShowEcaSeca(e.target.checked)} />
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
      </div>

      <div className="vt-mapbox">
        <VesselMap
          showEcaSeca={showEcaSeca}
          showMarpolSpecial={showMarpolSpecial}
          route={route}
          fitTrigger={fitTrigger}
          viaPoints={viaPoints}
          onAddViaPoint={handleAddViaPoint}
          onDragViaPoint={handleDragViaPoint}
          onRemoveViaPoint={handleRemoveViaPoint}
          weatherMode={weatherMode}
          onMapClickWeather={handleMapClickWeather}
          weatherPoint={weatherPoint}
        />
      </div>
    </div>
  );
}
