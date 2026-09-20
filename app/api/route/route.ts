// app/api/route/route.ts
// İki liman arasında gerçek deniz rotası hesaplar (karadan geçmez).
// searoute-ts kütüphanesi Eurostat'ın deniz yolu ağını kullanıyor.
// via=<lon>,<lat> verilirse rota o noktadan geçecek şekilde yeniden
// hesaplanır (kullanıcı rota çizgisini sürükleyip özelleştirdiğinde).

import { NextRequest, NextResponse } from "next/server";
import "searoute-ts/ports"; // UN/LOCODE çözümlemeyi aktif eder
import "searoute-ts/eca"; // ECA/SECA bölge verisini aktif eder (emissions için)
import { seaRoute, seaRouteMulti, NoRouteError, SnapFailedError } from "searoute-ts";
import { DEFAULT_MARNET as MARNET_20KM } from "searoute-ts/marnet-20km";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from"); // UN/LOCODE, örn CNSHA
  const to = req.nextUrl.searchParams.get("to");
  const speedParam = req.nextUrl.searchParams.get("speed");
  const draftParam = req.nextUrl.searchParams.get("draft");
  const viaParam = req.nextUrl.searchParams.get("via"); // "lon,lat;lon,lat;..."

  if (!from || !to) {
    return NextResponse.json(
      { error: "from ve to (liman kodu) gerekli." },
      { status: 400 }
    );
  }

  const speedKnots = speedParam ? Number(speedParam) : undefined;
  const vesselDraftMeters = draftParam ? Number(draftParam) : undefined;

  const options = {
    units: "nauticalmiles" as const,
    speedKnots,
    vesselDraftMeters,
    returnPassages: true,
    emissions: true,
    network: MARNET_20KM, // 100km yerine 20km ağ — kıyıya yakın karadan geçmeyi azaltır
  };

  try {
    let route;

    if (viaParam) {
      const viaPoints = viaParam.split(";").map((pair) => {
        const [lon, lat] = pair.split(",").map(Number);
        return [lon, lat] as [number, number];
      });
      if (viaPoints.some(([lon, lat]) => Number.isNaN(lon) || Number.isNaN(lat))) {
        return NextResponse.json({ error: "Geçersiz via noktası." }, { status: 400 });
      }
      route = seaRouteMulti([from, ...viaPoints, to], options);
    } else {
      route = seaRoute(from, to, options);
    }

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
        { error: "Bu noktalar arasında deniz rotası bulunamadı." },
        { status: 404 }
      );
    }
    if (err instanceof SnapFailedError) {
      return NextResponse.json(
        { error: "Konum deniz ağına bağlanamadı." },
        { status: 400 }
      );
    }
    console.error("[route] error:", err);
    return NextResponse.json({ error: "Rota hesaplanamadı." }, { status: 500 });
  }
}
