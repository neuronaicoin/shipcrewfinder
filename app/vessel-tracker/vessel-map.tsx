"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

export type Vessel = {
  mmsi: number;
  ship_name: string | null;
  latitude: number;
  longitude: number;
  speed: number | null;
  course: number | null;
  updated_at: string;
};

// Leaflet'in varsayılan marker PNG'leri bundler'larda kırılıyor (bilinen sorun) —
// bunun yerine gemi temalı, marka renklerine uygun bir divIcon kullanıyoruz.
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
}: {
  vessels: Vessel[];
  focusedVessel: Vessel | null;
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
      {vessels.map((v) => (
        <Marker key={v.mmsi} position={[v.latitude, v.longitude]} icon={shipIcon()}>
          <Popup>
            <strong>{v.ship_name || "İsimsiz gemi"}</strong>
            <br />
            Hız: {v.speed ?? "-"} knot
            <br />
            Rota: {v.course ?? "-"}°
            <br />
            Son sinyal: {new Date(v.updated_at).toLocaleTimeString("tr-TR")}
          </Popup>
        </Marker>
      ))}
      <FlyToVessel vessel={focusedVessel} />
    </MapContainer>
  );
}
