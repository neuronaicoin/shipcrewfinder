// app/api/weather/route.ts
// Belirli bir koordinat için anlık hava + deniz durumu.
// Open-Meteo — ücretsiz, API key gerektirmiyor.
// Kara üzerindeki noktalarda "marine" (dalga) verisi olmayabilir, bu normal.

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat ve lon gerekli." }, { status: 400 });
  }

  try {
    const [weatherRes, marineRes] = await Promise.allSettled([
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code&wind_speed_unit=kn`
      ),
      fetch(
        `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_direction,wave_period,swell_wave_height,sea_surface_temperature`
      ),
    ]);

    let weather = null;
    let marine = null;

    if (weatherRes.status === "fulfilled" && weatherRes.value.ok) {
      const data = await weatherRes.value.json();
      weather = data.current ?? null;
    }
    if (marineRes.status === "fulfilled" && marineRes.value.ok) {
      const data = await marineRes.value.json();
      marine = data.current ?? null;
    }

    return NextResponse.json({ weather, marine });
  } catch (err) {
    console.error("[weather] error:", err);
    return NextResponse.json({ error: "Hava durumu alınamadı." }, { status: 500 });
  }
}
