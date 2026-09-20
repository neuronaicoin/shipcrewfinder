// app/api/ais/search/route.ts
// Kullanıcı gemi adı yazınca çağrılır: /api/ais/search?q=ersoy
// Sadece son 15 dakika içinde AIS sinyali gelen (yani şu an "görünür" olan)
// gemilerde isimle arama yapar. Bounding box dışındaki veya sinyal vermeyen
// gemiler bulunamaz — bu global AIS'in doğası, elimizdeki tek veri budur.

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json(
      { error: "En az 2 karakter gir." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("vessel_positions")
    .select("*")
    .ilike("ship_name", `%${q}%`)
    .gte("updated_at", fifteenMinAgo)
    .order("updated_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ vessels: data, found: data.length > 0 });
}
