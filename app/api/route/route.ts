// app/api/route/route.ts
// İki liman arasında gerçek deniz rotası hesaplar (karadan geçmez).
// searoute-ts kütüphanesi Eurostat'ın deniz yolu ağını kullanıyor.

import { NextRequest, NextResponse } from "next/server";
import "searoute-ts/ports"; // UN/LOCODE çözümlemeyi aktif eder
import "searoute-ts/eca"; // ECA/SECA bölge verisini aktif eder (emissions için)
import { seaRoute, NoRouteError } from "searoute-ts";
import { SnapFailedError } from "searoute-ts";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from"); // UN/LOCODE, örn CNSHA
  const to = req.nextUrl.searchParams.get("to");
  const speedParam = req.nextUrl.searchParams.get("speed");
  const draftParam = req.nextUrl.searchParams.get("draft");

  if (!from || !to) {
    return NextResponse.json(
      { error: "from ve to (liman kodu) gerekli." },
      { status: 400 }
    );
  }

  const speedKnots = speedParam ? Number(speedParam) : undefined;
  const vesselDraftMeters = draftParam ? Number(draftParam) : undefined;

  try {
    const route = seaRoute(from, to, {
      units: "nauticalmiles",
      speedKnots,
      vesselDraftMeters,
      returnPassages: true,
      emissions: true,
    });

    return NextResponse.json({
      route,
      distanceNm: route.properties.length,
      durationHours: route.properties.durationHours ?? null,
      passages: route.properties.passages ?? [],
      ecaFraction: route.properties.ecaFraction ?? null,
    });
  } catch (err) {
    if (err instanceof NoRouteError) {
      return NextResponse.json(
        { error: "Bu iki liman arasında deniz rotası bulunamadı." },
        { status: 404 }
      );
    }
    if (err instanceof SnapFailedError) {
      return NextResponse.json(
        { error: "Liman konumu deniz ağına bağlanamadı." },
        { status: 400 }
      );
    }
    console.error("[route] error:", err);
    return NextResponse.json(
      { error: "Rota hesaplanamadı." },
      { status: 500 }
    );
  }
}
