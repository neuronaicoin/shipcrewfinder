import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const [{ data: seafarerRanks }, { data: yachtPositions }] = await Promise.all([
      supabase
        .from('seafarer_details')
        .select('rank, profiles!inner(visibility)')
        .not('rank', 'is', null),
      supabase
        .from('yacht_details')
        .select('position, profiles!inner(visibility)')
        .not('position', 'is', null),
    ]);

    const ranks = new Set<string>();
    (seafarerRanks || []).forEach((r) => {
      const vis = (r as { profiles?: { visibility?: string } }).profiles?.visibility;
      if (vis === 'public' && r.rank) ranks.add(r.rank as string);
    });
    (yachtPositions || []).forEach((r) => {
      const vis = (r as { profiles?: { visibility?: string } }).profiles?.visibility;
      if (vis === 'public' && r.position) ranks.add(r.position as string);
    });

    return NextResponse.json({ ranks: Array.from(ranks) });
  } catch (err) {
    console.error('live-roster error:', err);
    return NextResponse.json({ ranks: [] });
  }
}
