// lib/ais-client.ts
// Sürekli çalışan AIS WebSocket bağlantısı. Sunucu ayağa kalkarken
// instrumentation.ts üzerinden bir kere başlatılır.
//
// ÖNEMLİ: Global kapsamda saniyede yüzlerce/binlerce AIS mesajı gelir.
// Her mesaj için ayrı Supabase isteği atmak (eski yöntem) ücretsiz
// Supabase katmanını tıkar. Bunun yerine mesajları bellekte biriktirip
// belirli aralıklarla TEK bir toplu (batch) yazma yapıyoruz.

import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const AIS_API_KEY = process.env.AISSTREAM_API_KEY!;

// Global kapsam — tüm dünya.
const BOUNDING_BOX = [[[-90, -180], [90, 180]]];

const FLUSH_INTERVAL_MS = 10000; // 10 saniyede bir toplu yazma

let started = false;

type PendingVessel = {
  mmsi: number;
  ship_name: string | null;
  latitude: number;
  longitude: number;
  speed: number | null;
  course: number | null;
  updated_at: string;
};

// Her gemi için SADECE en son konumu tutuyoruz (mmsi -> son veri).
// Flush anında bu map'in tamamı tek istekte yazılır, sonra temizlenir.
const pending = new Map<number, PendingVessel>();

// Bir kere öğrenilen gemi adını process ömrü boyunca saklıyoruz.
// Bazı AIS PositionReport mesajları isim içermez — isim içermeyen bir
// mesaj geldiğinde önceden bilinen ismi SIFIRLAMAMAK için bu cache'i
// kullanıyoruz (aksi halde arama isimle yapıldığı için gemi "kaybolur").
const knownNames = new Map<number, string>();

export function startAisStream() {
  if (started) return;
  started = true;
  connect();
  startFlushLoop();
}

function startFlushLoop() {
  setInterval(async () => {
    if (pending.size === 0) return;

    const batch = Array.from(pending.values());
    pending.clear();

    try {
      const supabase = createAdminClient();
      const CHUNK_SIZE = 500;

      for (let i = 0; i < batch.length; i += CHUNK_SIZE) {
        const chunk = batch.slice(i, i + CHUNK_SIZE);
        const { error } = await supabase.from("vessel_positions").upsert(chunk);
        if (error) {
          console.error("[AIS] batch upsert error:", error.message, "chunk size:", chunk.length);
        }
      }
      console.log("[AIS] flushed", batch.length, "vessels");
    } catch (err) {
      console.error("[AIS] flush exception:", err);
    }
  }, FLUSH_INTERVAL_MS);
}

function connect() {
  const WebSocket = require("ws");
  const ws = new WebSocket("wss://stream.aisstream.io/v0/stream");

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

  ws.on("message", (data: Buffer) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.MessageType !== "PositionReport") return;

      const report = msg.Message.PositionReport;
      const mmsi = report.UserID;

      const incomingName = msg.MetaData?.ShipName?.trim() || null;
      if (incomingName) knownNames.set(mmsi, incomingName);
      const shipName = incomingName || knownNames.get(mmsi) || null;

      // Sadece belleğe yaz — Supabase'e gitmiyor, flush loop hallediyor.
      pending.set(mmsi, {
        mmsi,
        ship_name: shipName,
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
