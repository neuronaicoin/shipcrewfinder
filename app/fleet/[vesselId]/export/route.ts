import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ vesselId: string }> }
) {
  const { vesselId } = await params;
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: vessel } = await supabase
    .from("vessels")
    .select("id, name")
    .eq("id", vesselId)
    .eq("company_id", user.id)
    .maybeSingle();

  if (!vessel) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: crewRows } = await supabase
    .from("fleet_crew")
    .select("full_name, sex, rank, nationality, date_of_birth, place_of_birth, place_of_sign_on, join_date, passport_number, passport_expiry, seaman_book_number, seaman_book_expiry, visa_type, visa_expiry, health_report_expiry, blood_type, emergency_contact_name, emergency_contact_phone")
    .eq("vessel_id", vesselId)
    .eq("company_id", user.id)
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  const rows = crewRows || [];

  const headers = [
    "No",
    "Surname and Name",
    "Sex",
    "Rank",
    "Nationality",
    "Date of Birth",
    "Place of Birth",
    "Place of Sign On",
    "Date of Sign On",
    "Passport No",
    "Passport Exp",
    "Seaman Book No",
    "Seaman Book Exp",
    "Visa Type",
    "Visa Exp",
    "Health Report Exp",
    "Blood Type",
    "Emergency Contact",
    "Emergency Phone",
  ];

  const csvEscape = (val: unknown): string => {
    const s = val === null || val === undefined ? "" : String(val);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const lines = [headers.join(",")];

  rows.forEach((c, idx) => {
    lines.push(
      [
        idx + 1,
        c.full_name,
        c.sex,
        c.rank,
        c.nationality,
        c.date_of_birth,
        c.place_of_birth,
        c.place_of_sign_on,
        c.join_date,
        c.passport_number,
        c.passport_expiry,
        c.seaman_book_number,
        c.seaman_book_expiry,
        c.visa_type,
        c.visa_expiry,
        c.health_report_expiry,
        c.blood_type,
        c.emergency_contact_name,
        c.emergency_contact_phone,
      ]
        .map(csvEscape)
        .join(",")
    );
  });

  const csv = lines.join("\n");
  const safeVesselName = (vessel.name as string).replace(/[^a-zA-Z0-9]/g, "_");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${safeVesselName}_crew_list.csv"`,
    },
  });
}
