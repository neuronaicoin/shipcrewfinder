import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type AppRow = {
  id: string;
  job_id: string;
  company_id: string;
  status: string;
  created_at: string;
};

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "Sent", color: "#a8bdd2", bg: "rgba(255,255,255,.06)" },
  contacted: { label: "Contacted", color: "#60a5fa", bg: "rgba(96,165,250,.1)" },
  shortlisted: { label: "Shortlisted", color: "#fbbf24", bg: "rgba(251,191,36,.1)" },
  hired: { label: "Hired 🎉", color: "#34d399", bg: "rgba(52,211,153,.1)" },
  rejected: { label: "Closed", color: "#6b83a0", bg: "rgba(255,255,255,.04)" },
};

export default async function MyApplications({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: apps } = await supabase
    .from("job_applications")
    .select("id, job_id, company_id, status, created_at")
    .eq("applicant_id", userId)
    .order("created_at", { ascending: false })
    .limit(6);

  const list = (apps || []) as AppRow[];
  if (list.length === 0) return null;

  // İlan başlıkları + şirket adları
  const jobIds = Array.from(new Set(list.map((a) => a.job_id)));
  const companyIds = Array.from(new Set(list.map((a) => a.company_id)));

  const [{ data: jobs }, { data: companies }] = await Promise.all([
    supabase.from("jobs").select("id, title, position").in("id", jobIds),
    supabase.from("profiles").select("id, full_name").in("id", companyIds),
  ]);

  const jobMap = new Map((jobs || []).map((j) => [j.id as string, j]));
  const coMap = new Map((companies || []).map((c) => [c.id as string, (c.full_name as string) || "Verified company"]));

  const fmtD = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div
      style={{
        background: "linear-gradient(165deg,var(--navy2),var(--ink))",
        border: "1px solid var(--line2)",
        borderRadius: 18,
        padding: "20px 22px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--disp)",
          fontSize: 12.5,
          fontWeight: 700,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "var(--gold)",
          marginBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span>📨 My applications</span>
        <span style={{ fontSize: 10.5, color: "var(--tx3)", letterSpacing: 0, textTransform: "none", fontWeight: 600 }}>
          {list.length} recent
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((a) => {
          const job = jobMap.get(a.job_id);
          const meta = STATUS_META[a.status] || STATUS_META.new;
          return (
            <Link
              key={a.id}
              href={"/jobs/" + a.job_id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 13px",
                border: "1px solid var(--line2)",
                borderRadius: 12,
                textDecoration: "none",
                color: "var(--tx)",
                background: "rgba(255,255,255,.02)",
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>⚓</span>
              <span style={{ minWidth: 0, flex: 1 }}>
                <span style={{ display: "block", fontFamily: "var(--disp)", fontWeight: 800, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {(job?.title as string) || "Job posting"}
                </span>
                <span style={{ display: "block", fontSize: 11.5, color: "var(--tx3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {coMap.get(a.company_id) || "Verified company"} · applied {fmtD(a.created_at)}
                </span>
              </span>
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: ".05em",
                  textTransform: "uppercase",
                  color: meta.color,
                  background: meta.bg,
                  border: "1px solid " + meta.color + "44",
                  borderRadius: 999,
                  padding: "4px 10px",
                }}
              >
                {meta.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
