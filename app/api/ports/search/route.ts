// app/api/ports/search/route.ts
// Liman adıyla arama — otomatik tamamlama için. UN/LOCODE veritabanı
// searoute-ts paketinden geliyor (~1600 liman).

import { NextRequest, NextResponse } from "next/server";
import { PORTS } from "searoute-ts/ports";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim().toLowerCase();

  if (!q || q.length < 2) {
    return NextResponse.json({ ports: [] });
  }

  const matches = Object.entries(PORTS)
    .filter(
      ([code, p]) =>
        p.name.toLowerCase().includes(q) || code.toLowerCase().includes(q)
    )
    .slice(0, 15)
    .map(([code, p]) => ({
      code,
      name: p.name,
      country: p.country,
      coordinates: p.coordinates,
    }));

  return NextResponse.json({ ports: matches });
}
