"use client";

import { MapContainer, TileLayer, Marker, Popup, GeoJSON, Rectangle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { ECA_ZONES } from "searoute-ts/eca";
import { MARPOL_SPECIAL_AREAS } from "@/lib/eca-marpol-areas";
import { HIGH_RISK_AREAS } from "@/lib/high-risk-areas";

export type RouteFeature = {
  type: "Feature";
  properties: Record<string, any>;
  geometry: { type: "LineString"; coordinates: [number, number][] };
};

export type ViaPoint = { lon: number; lat: number };

export type WeatherReading = {
  weather: {
    temperature_2m?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    wind_gusts_10m?: number;
  } | null;
  marine: {
    wave_height?: number;
    wave_direction?: number;
    wave_period?: number;
    swell_wave_height?: number;
    sea_surface_temperature?: number;
  } | null;
};

function portIcon(color: string) {
  return L.divIcon({
    className: "scf-port-marker",
    html: `<div style="
      width:24px;height:24px;border-radius:50%;
      background:${color};display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,.4);border:2px solid #0d1030;
      font-size:12px;color:#0b0e13;font-weight:800;">⚓</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

function dragHandleIcon() {
  return L.divIcon({
    className: "scf-drag-handle",
    html: `<div style="
      width:18px;height:18px;border-radius:50%;
      background:#fff;border:3px solid #fbbf24;
      box-shadow:0 2px 8px rgba(0,0,0,.5);cursor:grab;"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function weatherPinIcon() {
  return L.divIcon({
    className: "scf-weather-pin",
    html: `<div style="
      width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      background:linear-gradient(135deg,#60a5fa,#3b82f6);
      box-shadow:0 2px 8px rgba(0,0,0,.5);border:2px solid #0d1030;
      display:flex;align-items:center;justify-content:center;">
      <span style="transform:rotate(45deg);font-size:12px;">🌊</span>
    </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26],
  });
}

function FitToRoute({ route, fitTrigger }: { route: RouteFeature | null; fitTrigger: number }) {
  const map = useMap();
  useEffect(() => {
    if (route) {
      const latlngs = route.geometry.coordinates.map(
        ([lon, lat]) => [lat, lon] as [number, number]
      );
      const bounds = L.latLngBounds(latlngs);
      map.flyToBounds(bounds, { padding: [40, 40], duration: 1.2 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitTrigger, map]);
  return null;
}

// Rota çizgisinin herhangi bir yerine çift tıklanınca oraya yeni bir
// sürüklenebilir "via" noktası eklenir.
function EditableRouteLine({
  route,
  onAddViaPoint,
}: {
  route: RouteFeature;
  onAddViaPoint: (lat: number, lon: number) => void;
}) {
  return (
    <GeoJSON
      data={route as any}
      style={{ color: "#fbbf24", weight: 4, opacity: 0.9 }}
      eventHandlers={{
        dblclick: (e: any) => {
          L.DomEvent.stop(e);
          onAddViaPoint(e.latlng.lat, e.latlng.lng);
        },
      }}
    />
  );
}

function ViaPointHandles({
  viaPoints,
  onDrag,
  onRemove,
}: {
  viaPoints: ViaPoint[];
  onDrag: (index: number, lat: number, lon: number) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <>
      {viaPoints.map((p, i) => (
        <Marker
          key={i}
          position={[p.lat, p.lon]}
          icon={dragHandleIcon()}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const pos = e.target.getLatLng();
              onDrag(i, pos.lat, pos.lng);
            },
            dblclick: (e: any) => {
              L.DomEvent.stop(e);
              onRemove(i);
            },
          }}
        >
          <Popup>Drag to move · double-click to remove</Popup>
        </Marker>
      ))}
    </>
  );
}

function WeatherClickHandler({
  active,
  onClick,
}: {
  active: boolean;
  onClick: (lat: number, lon: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (active) onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function degToCompass(deg?: number) {
  if (deg === undefined || deg === null) return "-";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function WeatherMarker({
  point,
}: {
  point: { lat: number; lon: number; data: WeatherReading } | null;
}) {
  if (!point) return null;
  const { data } = point;
  return (
    <Marker position={[point.lat, point.lon]} icon={weatherPinIcon()}>
      <Popup>
        <div style={{ fontSize: 12.5, lineHeight: 1.6 }}>
          <strong>Live conditions</strong>
          <br />
          {data.weather && (
            <>
              💨 Wind: {data.weather.wind_speed_10m ?? "-"} kn from{" "}
              {degToCompass(data.weather.wind_direction_10m)} (gusts{" "}
              {data.weather.wind_gusts_10m ?? "-"} kn)
              <br />
              🌡 Air temp: {data.weather.temperature_2m ?? "-"}°C
              <br />
            </>
          )}
          {data.marine ? (
            <>
              🌊 Wave height: {data.marine.wave_height ?? "-"} m from{" "}
              {degToCompass(data.marine.wave_direction)}
              <br />
              〰 Swell: {data.marine.swell_wave_height ?? "-"} m, period{" "}
              {data.marine.wave_period ?? "-"} s
              <br />
              🌊 Sea temp: {data.marine.sea_surface_temperature ?? "-"}°C
            </>
          ) : (
            <em>No marine data at this point (likely inland).</em>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export default function VesselMap({
  showEcaSeca,
  showMarpolSpecial,
  showHighRisk,
  route,
  fitTrigger,
  viaPoints,
  onAddViaPoint,
  onDragViaPoint,
  onRemoveViaPoint,
  weatherMode,
  onMapClickWeather,
  weatherPoint,
}: {
  showEcaSeca: boolean;
  showMarpolSpecial: boolean;
  showHighRisk: boolean;
  route: RouteFeature | null;
  fitTrigger: number;
  viaPoints: ViaPoint[];
  onAddViaPoint: (lat: number, lon: number) => void;
  onDragViaPoint: (index: number, lat: number, lon: number) => void;
  onRemoveViaPoint: (index: number) => void;
  weatherMode: boolean;
  onMapClickWeather: (lat: number, lon: number) => void;
  weatherPoint: { lat: number; lon: number; data: WeatherReading } | null;
}) {
  return (
    <MapContainer
      center={[20, 10]}
      zoom={2}
      minZoom={2}
      style={{ width: "100%", height: "100%", cursor: weatherMode ? "crosshair" : "" }}
      worldCopyJump
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {showEcaSeca &&
        ECA_ZONES.flatMap((zone) =>
          zone.bboxes.map((bbox, i) => {
            const [minLon, minLat, maxLon, maxLat] = bbox;
            return (
              <Rectangle
                key={zone.name + i}
                bounds={[
                  [minLat, minLon],
                  [maxLat, maxLon],
                ]}
                pathOptions={{ color: "#34d399", weight: 1.5, fillOpacity: 0.1, dashArray: "5,4" }}
              >
                <Popup>
                  <strong>{zone.name}</strong>
                  <br />
                  <em>Approximate bounding box — reference only, verify with official charts.</em>
                </Popup>
              </Rectangle>
            );
          })
        )}

      {showMarpolSpecial && (
        <GeoJSON
          data={MARPOL_SPECIAL_AREAS as any}
          style={(feature: any) => ({
            color: feature.properties.color,
            weight: 1.5,
            fillOpacity: 0.1,
            dashArray: "2,6",
          })}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(
              `<strong>${feature.properties.name}</strong><br/><em>Approximate boundary — verify with official charts</em>`
            );
          }}
        />
      )}

      {showHighRisk && (
        <GeoJSON
          data={HIGH_RISK_AREAS as any}
          style={(feature: any) => ({
            color: feature.properties.color,
            weight: 1.5,
            fillOpacity: 0.08,
            dashArray: "1,5",
          })}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(
              `<strong>⚠ ${feature.properties.name}</strong><br/>${feature.properties.note}<br/><em>Historical awareness only — not real-time. Check UKMTO / IMB PRC for current advisories.</em>`
            );
          }}
        />
      )}

      {route && (
        <>
          <EditableRouteLine route={route} onAddViaPoint={onAddViaPoint} />
          <Marker
            position={[route.geometry.coordinates[0][1], route.geometry.coordinates[0][0]]}
            icon={portIcon("#34d399")}
          >
            <Popup>Origin</Popup>
          </Marker>
          <Marker
            position={[
              route.geometry.coordinates[route.geometry.coordinates.length - 1][1],
              route.geometry.coordinates[route.geometry.coordinates.length - 1][0],
            ]}
            icon={portIcon("#f87171")}
          >
            <Popup>Destination</Popup>
          </Marker>
          <ViaPointHandles viaPoints={viaPoints} onDrag={onDragViaPoint} onRemove={onRemoveViaPoint} />
        </>
      )}

      <WeatherClickHandler active={weatherMode} onClick={onMapClickWeather} />
      <WeatherMarker point={weatherPoint} />

      <FitToRoute route={route} fitTrigger={fitTrigger} />
    </MapContainer>
  );
}
