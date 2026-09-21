// app/api/voyages/route.ts
// Kullanıcının kaydettiği rotaları listeler (GET) veya yeni bir rota kaydeder (POST).
// createClient (cookie-tabanlı) kullanıyoruz — RLS otomatik olarak sadece
// giriş yapan kullanıcının kendi verisine erişmesini sağlıyor.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("voyage_plans")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ voyages: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const body = await req.json();

  const { data, error } = await supabase
    .from("voyage_plans")
    .insert({
      user_id: user.id,
      label: body.label || null,
      origin_code: body.originCode,
      origin_name: body.originName,
      destination_code: body.destinationCode,
      destination_name: body.destinationName,
      speed: body.speed || null,
      draft: body.draft || null,
      daily_consumption: body.dailyConsumption || null,
      rob: body.rob || null,
      bunker_price: body.bunkerPrice || null,
      via_points: body.viaPoints || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ voyage: data });
}
