"use client";

import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { ECA_SECA_AREAS, MARPOL_SPECIAL_AREAS } from "@/lib/eca-marpol-areas";

export type Vessel = {
  mmsi: number;
  ship_name: string | null;
  latitude: number;
  longitude: number;
  speed: number | null;
  course: number | null;
  updated_at: string;
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

function FlyToVessel({ vessel }: { vessel: Vessel | null }) {
  const map = useMap();
  useEffect(() => {
    if (vessel) {
      map.flyTo([vessel.latitude, vessel.longitude], 8, { duration: 1.2 });
    }
  }, [vessel, map]);
  return null;
}

export default function VesselMap({
  vessels,
  focusedVessel,
  showEcaSeca,
  showMarpolSpecial,
}: {
  vessels: Vessel[];
  focusedVessel: Vessel | null;
  showEcaSeca: boolean;
  showMarpolSpecial: boolean;
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

      {showEcaSeca && (
        <GeoJSON
          data={ECA_SECA_AREAS as any}
          style={(feature: any) => ({
            color: feature.properties.color,
            weight: 1.5,
            fillOpacity: 0.12,
            dashArray: "5,4",
          })}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(
              `<strong>${feature.properties.name}</strong><br/>Sulfur limit: ${feature.properties.sulfurLimit}<br/><em>Approximate boundary — verify with official charts</em>`
            );
          }}
        />
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
    </MapContainer>
  );
}
