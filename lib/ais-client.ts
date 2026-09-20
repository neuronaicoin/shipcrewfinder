// lib/ais-client.ts
// Sürekli çalışan AIS WebSocket bağlantısı. Sunucu ayağa kalkarken
// instrumentation.ts üzerinden bir kere başlatılır.

import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const AIS_API_KEY = process.env.AISSTREAM_API_KEY!;

// Global kapsam — tüm dünya. aisstream.io'nun ücretsiz katmanı bu yoğunluğu
// kaldırmazsa loglardan takip et, gerekirse daralt.
const BOUNDING_BOX = [[[-90, -180], [90, 180]]]; // global kapsam

let started = false;

// Aynı gemi için 5 saniyede bir yazma limiti (Supabase'i gereksiz doldurmamak için)
const lastWrite = new Map<number, number>();
const WRITE_INTERVAL_MS = 5000;

export function startAisStream() {
  if (started) return; // aynı process içinde iki kere başlatma
  started = true;
  connect();
}

function connect() {
  const WebSocket = require("ws");
  const ws = new WebSocket("wss://stream.aisstream.io/v0/stream");
  const supabase = createAdminClient();

  ws.on("open", () => {
    console.log("[AIS] Connected, subscribing...");
    ws.send(
      JSON.stringify({
        APIKey: AIS_API_KEY,
        BoundingBoxes: BOUNDING_BOX,
        FilterMessageTypes: ["PositionReport"],
      })
    );
  });

  ws.on("message", async (data: Buffer) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.MessageType !== "PositionReport") return;

      const report = msg.Message.PositionReport;
      const mmsi = report.UserID;
      const now = Date.now();
      const last = lastWrite.get(mmsi) || 0;
      if (now - last < WRITE_INTERVAL_MS) return;
      lastWrite.set(mmsi, now);

      await supabase.from("vessel_positions").upsert({
        mmsi,
        ship_name: msg.MetaData?.ShipName?.trim() || null,
        latitude: report.Latitude,
        longitude: report.Longitude,
        speed: report.Sog,
        course: report.Cog,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("[AIS] message parse error:", err);
    }
  });

  ws.on("close", () => {
    console.warn("[AIS] Connection closed, reconnecting in 5s...");
    started = false;
    setTimeout(() => {
      started = true;
      connect();
    }, 5000);
  });

  ws.on("error", (err: Error) => {
    console.error("[AIS] WebSocket error:", err);
  });
}
