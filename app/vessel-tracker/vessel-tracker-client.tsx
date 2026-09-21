"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { ECA_ZONES } from "searoute-ts/eca";
import type { RouteFeature, ViaPoint, WeatherReading } from "./vessel-map";

const VesselMap = dynamic(() => import("./vessel-map"), {
  ssr: false,
  loading: () => <div className="vt-maploading">Loading map...</div>,
});

type PortOption = { code: string; name: string; country: string; coordinates: [number, number] };
type SavedVoyage = {
  id: string;
  label: string | null;
  origin_code: string;
  origin_name: string;
  destination_code: string;
  destination_name: string;
  speed: number | null;
  draft: number | null;
  daily_consumption: number | null;
  rob: number | null;
  bunker_price: number | null;
  via_points: { lon: number; lat: number }[] | null;
  created_at: string;
};

const CO2_FACTOR = 3.114;

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

function estimateLocalTime(fromNowHours: number, lon: number): string {
  const utcOffsetHours = Math.round(lon / 15);
  const arrival = new Date(Date.now() + fromNowHours * 3600 * 1000);
  const local = new Date(arrival.getTime() + utcOffsetHours * 3600 * 1000);
  const hh = String(local.getUTCHours()).padStart(2, "0");
  const mm = String(local.getUTCMinutes()).padStart(2, "0");
  const dateStr = local.toISOString().slice(0, 10);
  const sign = utcOffsetHours >= 0 ? "+" : "";
  return `${dateStr} ${hh}:${mm} (est. UTC${sign}${utcOffsetHours})`;
}

async function resolvePort(code: string): Promise<PortOption | null> {
  const res = await fetch(`/api/ports/search?q=${code}`);
  const data = await res.json();
  return data.ports?.find((p: PortOption) => p.code === code) || null;
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
          <span className="vt-pc-value">{port.coordinates[1].toFixed(3)}, {port.coordinates[0].toFixed(3)}</span>
        </div>
        <div className="vt-pc-item">
          <span className="vt-pc-label">Emission control zone</span>
          <span className="vt-pc-value">{zones.length > 0 ? zones.join(", ") : "None on record"}</span>
        </div>
        <div className="vt-pc-item">
          <span className="vt-pc-label">Wind</span>
          <span className="vt-pc-value">
            {loadingWx ? "Loading..." : weather?.weather ? `${weather.weather.wind_speed_10m ?? "-"} kn` : "N/A"}
          </span>
        </div>
        <div className="vt-pc-item">
          <span className="vt-pc-label">Sea state</span>
          <span className="vt-pc-value">
            {loadingWx ? "Loading..." : weather?.marine ? `${weather.marine.wave_height ?? "-"} m waves` : "Inland / N/A"}
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

export default function VesselTrackerClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [origin, setOrigin] = useState<PortOption | null>(null);
  const [destination, setDestination] = useState<PortOption | null>(null);
  const [speed, setSpeed] = useState("14");
  const [draft, setDraft] = useState("");
  const [dailyConsumption, setDailyConsumption] = useState("");
  const [rob, setRob] = useState("");
  const [bunkerPrice, setBunkerPrice] = useState("");
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
  const [showHighRisk, setShowHighRisk] = useState(false);
  const [weatherMode, setWeatherMode] = useState(false);
  const [weatherPoint, setWeatherPoint] = useState<{ lat: number; lon: number; data: WeatherReading } | null>(null);
  const [copyLabel, setCopyLabel] = useState("🔗 Copy link");

  const [savedVoyages, setSavedVoyages] = useState<SavedVoyage[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveLabel, setSaveLabel] = useState("💾 Save this voyage");

  const fetchRoute = useCallback(
    async (via: (ViaPoint & { sortKey: number })[], o?: PortOption | null, d?: PortOption | null) => {
      const org = o ?? origin;
      const dst = d ?? destination;
      if (!org || !dst) return;
      setRouteLoading(true);
      setRouteError(null);
      try {
        const params = new URLSearchParams({ from: org.code, to: dst.code, speed });
        if (draft) params.set("draft", draft);
        if (via.length > 0) params.set("via", via.map((v) => `${v.lon},${v.lat}`).join(";"));
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
    },
    [origin, destination, speed, draft]
  );

  const loadVoyageParams = useCallback(
    async (params: {
      fromCode: string;
      toCode: string;
      speed?: string;
      draft?: string;
      cons?: string;
      rob?: string;
      price?: string;
      via?: { lon: number; lat: number }[];
    }) => {
      const [fromPort, toPort] = await Promise.all([
        resolvePort(params.fromCode),
        resolvePort(params.toCode),
      ]);
      if (!fromPort || !toPort) return;

      setOrigin(fromPort);
      setDestination(toPort);
      if (params.speed) setSpeed(params.speed);
      if (params.draft) setDraft(params.draft);
      if (params.cons) setDailyConsumption(params.cons);
      if (params.rob) setRob(params.rob);
      if (params.price) setBunkerPrice(params.price);

      const via = (params.via || []).map((v, i) => ({ ...v, sortKey: i }));
      setViaPoints(via);
      setFitTrigger((n) => n + 1);
      await fetchRoute(via, fromPort, toPort);
    },
    [fetchRoute]
  );

  // URL'de paylaşılan bir rota varsa otomatik yükle
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromCode = params.get("from");
    const toCode = params.get("to");
    if (!fromCode || !toCode) return;
    const viaParam = params.get("via");
    const via = viaParam
      ? viaParam.split(";").map((pair) => {
          const [lon, lat] = pair.split(",").map(Number);
          return { lon, lat };
        })
      : undefined;
    loadVoyageParams({
      fromCode,
      toCode,
      speed: params.get("speed") || undefined,
      draft: params.get("draft") || undefined,
      cons: params.get("cons") || undefined,
      rob: params.get("rob") || undefined,
      price: params.get("price") || undefined,
      via,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Giriş yapmışsa kayıtlı rotaları yükle
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/voyages")
      .then((r) => r.json())
      .then((d) => setSavedVoyages(d.voyages || []))
      .catch(() => {});
  }, [isLoggedIn]);

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

  function handleCopyLink() {
    if (!origin || !destination) return;
    const params = new URLSearchParams({ from: origin.code, to: destination.code, speed });
    if (draft) params.set("draft", draft);
    if (dailyConsumption) params.set("cons", dailyConsumption);
    if (rob) params.set("rob", rob);
    if (bunkerPrice) params.set("price", bunkerPrice);
    if (viaPoints.length > 0) params.set("via", viaPoints.map((v) => `${v.lon},${v.lat}`).join(";"));
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyLabel("✓ Copied");
      setTimeout(() => setCopyLabel("🔗 Copy link"), 2000);
    });
  }

  async function handleSaveVoyage() {
    if (!origin || !destination) return;
    setSaving(true);
    try {
      const res = await fetch("/api/voyages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originCode: origin.code,
          originName: origin.name,
          destinationCode: destination.code,
          destinationName: destination.name,
          speed: parseFloat(speed) || null,
          draft: draft ? parseFloat(draft) : null,
          dailyConsumption: dailyConsumption ? parseFloat(dailyConsumption) : null,
          rob: rob ? parseFloat(rob) : null,
          bunkerPrice: bunkerPrice ? parseFloat(bunkerPrice) : null,
          viaPoints: viaPoints.length > 0 ? viaPoints.map((v) => ({ lon: v.lon, lat: v.lat })) : null,
        }),
      });
      if (res.ok) {
        setSaveLabel("✓ Saved");
        const listRes = await fetch("/api/voyages");
        const listData = await listRes.json();
        setSavedVoyages(listData.voyages || []);
        setTimeout(() => setSaveLabel("💾 Save this voyage"), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleLoadSaved(v: SavedVoyage) {
    setShowSaved(false);
    await loadVoyageParams({
      fromCode: v.origin_code,
      toCode: v.destination_code,
      speed: v.speed?.toString(),
      draft: v.draft?.toString(),
      cons: v.daily_consumption?.toString(),
      rob: v.rob?.toString(),
      price: v.bunker_price?.toString(),
      via: v.via_points || undefined,
    });
  }

  async function handleDeleteSaved(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    await fetch(`/api/voyages/${id}`, { method: "DELETE" });
    setSavedVoyages((prev) => prev.filter((v) => v.id !== id));
  }

  const hasCustomRoute = viaPoints.length > 0;
  const dailyCons = parseFloat(dailyConsumption);
  const robStart = parseFloat(rob);
  const price = parseFloat(bunkerPrice);
  const voyageDays = routeInfo?.durationHours != null ? routeInfo.durationHours / 24 : null;
  const totalFuelBurned = voyageDays != null && !Number.isNaN(dailyCons) ? dailyCons * voyageDays : null;
  const robAtArrival = totalFuelBurned != null && !Number.isNaN(robStart) ? robStart - totalFuelBurned : null;
  const co2Tons = totalFuelBurned != null ? totalFuelBurned * CO2_FACTOR : null;
  const bunkerCost = totalFuelBurned != null && !Number.isNaN(price) ? totalFuelBurned * price : null;
  const etaLocal =
    routeInfo?.durationHours != null && destination
      ? estimateLocalTime(routeInfo.durationHours, destination.coordinates[0])
      : null;

  const speedNum = parseFloat(speed) || 14;
  const speedOptions = [Math.max(6, speedNum - 2), speedNum, speedNum + 2];

  return (
    <div className="vt-wrap">
      <style>{`
  .vt-wrap{display:flex;flex-direction:column;height:calc(100dvh - 60px);overflow-y:auto}
  .vt-controls{padding:16px 16px 12px;background:var(--navy2,#141845);border-bottom:1px solid var(--line2,rgba(255,255,255,.08));flex-shrink:0}
  .vt-title{max-width:800px;margin:0 auto 12px;text-align:center;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap}
  .vt-title h1{font-family:var(--disp,var(--font-bricolage),sans-serif);font-size:1.25rem;font-weight:800}
  .vt-title p{font-size:11.5px;color:var(--tx3,#6b83a0);width:100%}
  .vt-plan{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:10px}
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
  .vt-numwrap{width:124px}
  .vt-plancta{display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap}
  .vt-btn{background:linear-gradient(135deg,var(--gold,#fbbf24),var(--gold2,#e0a010));
    color:#0b0e13;border:none;border-radius:12px;padding:0 18px;height:42px;font-weight:800;font-size:13px;cursor:pointer;white-space:nowrap}
  .vt-btn:disabled{opacity:.6}
  .vt-btn-ghost{background:transparent;border:1.5px solid var(--line2,rgba(255,255,255,.15));color:var(--tx2,#a8bdd2)}
  .vt-btn-weather{background:rgba(96,165,250,.12);border:1.5px solid rgba(96,165,250,.4);color:#93c5fd}
  .vt-btn-weather.on{background:linear-gradient(135deg,#60a5fa,#3b82f6);color:#0b0e13;border-color:transparent}
  .vt-btn-saved{background:rgba(167,139,250,.12);border:1.5px solid rgba(167,139,250,.4);color:#c4b5fd;position:relative}
  .vt-routeerr{font-size:12.5px;color:#f87171;text-align:center}

  .vt-savedpanel{position:absolute;top:100%;right:0;margin-top:6px;width:280px;max-height:320px;overflow-y:auto;
    background:var(--navy2,#141845);border:1px solid var(--line2,rgba(255,255,255,.12));border-radius:12px;
    box-shadow:0 10px 30px rgba(0,0,0,.4);z-index:1100;text-align:left}
  .vt-savedwrap{position:relative}
  .vt-saveditem{padding:10px 13px;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px}
  .vt-saveditem:hover{background:rgba(251,191,36,.06)}
  .vt-saveditem-txt{font-size:12px;color:var(--tx,#eef4fa)}
  .vt-saveditem-sub{font-size:10.5px;color:var(--tx3,#6b83a0)}
  .vt-saveditem-del{background:none;border:none;color:var(--tx3,#6b83a0);cursor:pointer;font-size:12px;flex-shrink:0}
  .vt-saveditem-del:hover{color:#f87171}
  .vt-savedempty{padding:14px;font-size:12px;color:var(--tx3,#6b83a0);text-align:center}

  .vt-mapbox{flex-shrink:0;position:relative;height:52vh;min-height:360px}
  .vt-maploading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--tx3,#6b83a0);font-size:13px}

  .vt-details{padding:16px;max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:12px;width:100%}

  .vt-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}
  .vt-stat{background:rgba(255,255,255,.04);border:1px solid var(--line2,rgba(255,255,255,.08));border-radius:12px;padding:12px 14px}
  .vt-stat-label{display:block;font-size:10.5px;color:var(--tx3,#6b83a0);text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-bottom:4px}
  .vt-stat-value{display:block;font-size:17px;font-weight:800;color:var(--tx,#eef4fa)}
  .vt-stat.gold .vt-stat-value{color:var(--gold,#fbbf24)}
  .vt-stat.warn{border-color:rgba(248,113,113,.5);background:rgba(248,113,113,.08)}
  .vt-stat.warn .vt-stat-value{color:#f87171}

  .vt-speedtable{width:100%;border-collapse:collapse;font-size:12.5px}
  .vt-speedtable th{text-align:left;font-size:10px;color:var(--tx3,#6b83a0);text-transform:uppercase;letter-spacing:.04em;padding:6px 8px;border-bottom:1px solid var(--line2,rgba(255,255,255,.1))}
  .vt-speedtable td{padding:7px 8px;color:var(--tx2,#a8bdd2);border-bottom:1px solid rgba(255,255,255,.04)}
  .vt-speedtable tr.current td{color:var(--gold,#fbbf24);font-weight:700}
  .vt-speedbox{background:rgba(255,255,255,.03);border:1px solid var(--line2,rgba(255,255,255,.08));border-radius:12px;padding:10px 14px}
  .vt-speedbox-title{font-size:11px;font-weight:700;color:var(--tx2,#a8bdd2);margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em}

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
      `}</style>

      <div className="vt-controls">
        <div className="vt-title">
          <h1>🧭 Voyage Planner</h1>
          <p>Real sea-route distance, ETA, fuel and live conditions between any two ports</p>
        </div>

        <div className="vt-plan">
          <div className="vt-planrow">
            <PortInput label="From" value={origin} onSelect={setOrigin} onClear={() => setOrigin(null)} />
            <PortInput label="To" value={destination} onSelect={setDestination} onClear={() => setDestination(null)} />
          </div>

          <div className="vt-planrow">
            <div className="vt-numwrap">
              <label className="vt-portlabel">Speed (kn)</label>
              <input className="vt-input" type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} />
            </div>
            <div className="vt-numwrap">
              <label className="vt-portlabel">Draft (m)</label>
              <input className="vt-input" type="number" placeholder="optional" value={draft} onChange={(e) => setDraft(e.target.value)} />
            </div>
            <div className="vt-numwrap">
              <label className="vt-portlabel">Cons. (t/day)</label>
              <input className="vt-input" type="number" placeholder="optional" value={dailyConsumption} onChange={(e) => setDailyConsumption(e.target.value)} />
            </div>
            <div className="vt-numwrap">
              <label className="vt-portlabel">ROB depart (t)</label>
              <input className="vt-input" type="number" placeholder="optional" value={rob} onChange={(e) => setRob(e.target.value)} />
            </div>
            <div className="vt-numwrap">
              <label className="vt-portlabel">Bunker ($/t)</label>
              <input className="vt-input" type="number" placeholder="optional" value={bunkerPrice} onChange={(e) => setBunkerPrice(e.target.value)} />
            </div>
          </div>

          <div className="vt-planrow vt-plancta">
            <button className="vt-btn" onClick={handleCalculateRoute} disabled={!origin || !destination || routeLoading}>
              {routeLoading ? "Calculating..." : "Calculate Route"}
            </button>
            {hasCustomRoute && (
              <button className="vt-btn vt-btn-ghost" onClick={() => { setViaPoints([]); fetchRoute([]); }}>
                Reset to shortest
              </button>
            )}
            <button className={"vt-btn vt-btn-weather" + (weatherMode ? " on" : "")} onClick={() => setWeatherMode((m) => !m)}>
              🌦 {weatherMode ? "Weather on" : "Check weather"}
            </button>
            {route && (
              <button className="vt-btn vt-btn-ghost" onClick={handleCopyLink}>{copyLabel}</button>
            )}
            {isLoggedIn && route && (
              <button className="vt-btn vt-btn-ghost" onClick={handleSaveVoyage} disabled={saving}>
                {saveLabel}
              </button>
            )}
            {isLoggedIn && (
              <div className="vt-savedwrap">
                <button className="vt-btn vt-btn-saved" onClick={() => setShowSaved((s) => !s)}>
                  ⭐ My Voyages ({savedVoyages.length})
                </button>
                {showSaved && (
                  <div className="vt-savedpanel">
                    {savedVoyages.length === 0 ? (
                      <div className="vt-savedempty">No saved voyages yet — calculate a route and save it.</div>
                    ) : (
                      savedVoyages.map((v) => (
                        <div key={v.id} className="vt-saveditem" onClick={() => handleLoadSaved(v)}>
                          <div>
                            <div className="vt-saveditem-txt">{v.origin_code} → {v.destination_code}</div>
                            <div className="vt-saveditem-sub">
                              {v.origin_name} → {v.destination_name}
                            </div>
                          </div>
                          <button className="vt-saveditem-del" onClick={(e) => handleDeleteSaved(v.id, e)}>✕</button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {routeError && <p className="vt-routeerr">{routeError}</p>}
          {!isLoggedIn && (
            <p className="vt-hint">Log in to save voyages and revisit them anytime.</p>
          )}
        </div>
      </div>

      <div className="vt-mapbox">
        <VesselMap
          showEcaSeca={showEcaSeca}
          showMarpolSpecial={showMarpolSpecial}
          showHighRisk={showHighRisk}
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

      <div className="vt-details">
        {routeInfo && (
          <>
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
              {etaLocal && (
                <div className="vt-stat">
                  <span className="vt-stat-label">Est. arrival (local)</span>
                  <span className="vt-stat-value" style={{ fontSize: 13 }}>{etaLocal}</span>
                </div>
              )}
              {routeInfo.passages.length > 0 && (
                <div className="vt-stat">
                  <span className="vt-stat-label">Passages</span>
                  <span className="vt-stat-value" style={{ fontSize: 13 }}>{routeInfo.passages.join(", ")}</span>
                </div>
              )}
              {totalFuelBurned !== null && (
                <div className="vt-stat">
                  <span className="vt-stat-label">Fuel burned</span>
                  <span className="vt-stat-value">{totalFuelBurned.toFixed(1)} t</span>
                </div>
              )}
              {co2Tons !== null && (
                <div className="vt-stat">
                  <span className="vt-stat-label">CO₂ emissions</span>
                  <span className="vt-stat-value">{co2Tons.toFixed(1)} t</span>
                </div>
              )}
              {bunkerCost !== null && (
                <div className="vt-stat">
                  <span className="vt-stat-label">Bunker cost</span>
                  <span className="vt-stat-value">${bunkerCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              )}
              {robAtArrival !== null && (
                <div className={"vt-stat" + (robAtArrival < 0 ? " warn" : "")}>
                  <span className="vt-stat-label">ROB at arrival</span>
                  <span className="vt-stat-value">{robAtArrival.toFixed(1)} t{robAtArrival < 0 ? " ⚠" : ""}</span>
                </div>
              )}
            </div>

            <div className="vt-speedbox">
              <div className="vt-speedbox-title">Speed comparison (same route)</div>
              <table className="vt-speedtable">
                <thead>
                  <tr><th>Speed</th><th>Duration</th><th>ETA date</th></tr>
                </thead>
                <tbody>
                  {speedOptions.map((s) => {
                    const hours = routeInfo.distanceNm / s;
                    const days = hours / 24;
                    const etaDate = new Date(Date.now() + hours * 3600 * 1000).toISOString().slice(0, 10);
                    return (
                      <tr key={s} className={s === speedNum ? "current" : ""}>
                        <td>{s.toFixed(0)} kn</td>
                        <td>{days.toFixed(1)} days</td>
                        <td>{etaDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
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
            <input type="checkbox" checked={showMarpolSpecial} onChange={(e) => setShowMarpolSpecial(e.target.checked)} />
            <span className="sw" style={{ background: "#f87171" }} />
            MARPOL Special Areas
          </label>
          <label className="vt-layer">
            <input type="checkbox" checked={showHighRisk} onChange={(e) => setShowHighRisk(e.target.checked)} />
            <span className="sw" style={{ background: "#fb923c" }} />
            High-risk security areas
          </label>
        </div>
        {(showEcaSeca || showMarpolSpecial || showHighRisk) && (
          <p className="vt-layernote">
            Boundaries are simplified approximations for reference only — always verify with
            official charts and current UKMTO / IMB advisories before making compliance or
            security decisions.
          </p>
        )}
      </div>
    </div>
  );
}
