"use client";

import { MapContainer, TileLayer, Marker, Popup, GeoJSON, Rectangle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { ECA_ZONES } from "searoute-ts/eca";
import { MARPOL_SPECIAL_AREAS } from "@/lib/eca-marpol-areas";

export type Vessel = {
  mmsi: number;
  ship_name: string | null;
  latitude: number;
  longitude: number;
  speed: number | null;
  course: number | null;
  updated_at: string;
};

export type RouteFeature = {
  type: "Feature";
  properties: Record<string, any>;
  geometry: { type: "LineString"; coordinates: [number, number][] };
};

function shipIcon() {
  return L.divIcon({
    className: "scf-ship-marker",
    html: `<div style="
      width:30px;height:30px;border-radius:50%;
      background:linear-gradient(135deg,#fbbf24,#e0a010);
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 10px rgba(0,0,0,.4);border:2px solid #0d1030;
      font-size:15px;">🚢</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
}

function portIcon(color: string) {
  return L.divIcon({
    className: "scf-port-marker",
    html: `<div style="
      width:22px;height:22px;border-radius:50%;
      background:${color};display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,.4);border:2px solid #0d1030;
      font-size:11px;color:#0b0e13;font-weight:800;">⚓</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11],
  });
}

function FlyToVessel({ vessel }: { vessel: Vessel | null }) {
  const map = useMap();
  useEffect(() => {
    if (vessel) {
      map.flyTo([vessel.latitude, vessel.longitude], 8, { duration: 1.2 });
    }
  }, [vessel, map]);
  return null;
}

function FitToRoute({ route }: { route: RouteFeature | null }) {
  const map = useMap();
  useEffect(() => {
    if (route) {
      const latlngs = route.geometry.coordinates.map(
        ([lon, lat]) => [lat, lon] as [number, number]
      );
      const bounds = L.latLngBounds(latlngs);
      map.flyToBounds(bounds, { padding: [40, 40], duration: 1.2 });
    }
  }, [route, map]);
  return null;
}

export default function VesselMap({
  vessels,
  focusedVessel,
  showEcaSeca,
  showMarpolSpecial,
  route,
}: {
  vessels: Vessel[];
  focusedVessel: Vessel | null;
  showEcaSeca: boolean;
  showMarpolSpecial: boolean;
  route: RouteFeature | null;
}) {
  return (
    <MapContainer
      center={[20, 10]}
      zoom={2}
      minZoom={2}
      style={{ width: "100%", height: "100%" }}
      worldCopyJump
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* ECA/SECA — searoute-ts'in kendi verisi (bbox yaklaşıklaması,
          Baltık, Kuzey Denizi, Akdeniz, Kuzey Amerika, ABD Karayipleri) */}
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
                pathOptions={{
                  color: "#34d399",
                  weight: 1.5,
                  fillOpacity: 0.1,
                  dashArray: "5,4",
                }}
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

      {route && (
        <>
          <GeoJSON
            data={route as any}
            style={{ color: "#fbbf24", weight: 3, opacity: 0.9 }}
          />
          <Marker
            position={[
              route.geometry.coordinates[0][1],
              route.geometry.coordinates[0][0],
            ]}
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
        </>
      )}

      {vessels.map((v) => (
        <Marker key={v.mmsi} position={[v.latitude, v.longitude]} icon={shipIcon()}>
          <Popup>
            <strong>{v.ship_name || "Unknown vessel"}</strong>
            <br />
            Speed: {v.speed ?? "-"} kn
            <br />
            Course: {v.course ?? "-"}°
            <br />
            Last signal: {new Date(v.updated_at).toLocaleTimeString("en-GB")}
          </Popup>
        </Marker>
      ))}
      <FlyToVessel vessel={focusedVessel} />
      <FitToRoute route={route} />
    </MapContainer>
  );
}
