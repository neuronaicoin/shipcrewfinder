// app/api/ais/route.ts
// Frontend bu endpoint'i çağırır, Supabase'deki en güncel gemi konumlarını döner.
// WebSocket bağlantısını YÖNETMEZ — sadece okur.

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();

  // Son 15 dakika içinde güncellenmiş gemileri getir
  const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("vessel_positions")
    .select("*")
    .gte("updated_at", fifteenMinAgo)
    .order("updated_at", { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ vessels: data });
}
