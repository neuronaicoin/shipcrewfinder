import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildJobAlertEmail, type AlertJob } from "@/lib/email/job-alert-email";

const FROM = "ShipCrewFinder <jobs@shipcrewfinder.com>";
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const RESEND_KEY_TEST = "re_SZ5scTKb_67qooMuit4okD7BghU2JwW5K";

export async function sendJobAlerts(jobId: string): Promise<string> {
  const steps: string[] = [];

  const resendKey = process.env.RESEND_API_KEY || RESEND_KEY_TEST;
  steps.push(`KEY_SOURCE=${process.env.RESEND_API_KEY ? "ENV" : "HARDCODED"}`);

  try {
    const admin = createAdminClient();
    steps.push("admin=OK");

    const { data: job, error: jobErr } = await admin
      .from("jobs")
      .select("id, title, rank_required, position, vessel_type, location_country, location_city, contract_duration, salary_min, salary_max, salary_currency, description, status, company_id")
      .eq("id", jobId)
      .single();

    if (jobErr) return steps.join(" | ") + ` | JOB_ERR=${jobErr.message}`;
    if (!job) return steps.join(" | ") + " | JOB=NOT_FOUND";

    const rank = (job.rank_required as string) || (job.position as string) || "";

    const { data: alerts, error: alertErr } = await admin
      .from("job_alerts")
      .select("id, email, token")
      .eq("rank", rank)
      .eq("active", true);

    if (alertErr) return steps.join(" | ") + ` | ALERT_ERR=${alertErr.message}`;
    if (!alerts || alerts.length === 0) return steps.join(" | ") + " | NO_SUBSCRIBERS";
    steps.push(`alerts=${alerts.length}`);

    let companyName = "A verified shipping company";
    if (job.company_id) {
      const { data: c } = await admin.from("profiles").select("full_name").eq("id", job.company_id).single();
      if (c?.full_name) companyName = c.full_name as string;
    }

    for (const a of alerts) {
      const { subject, html, text } = buildJobAlertEmail(job as unknown as AlertJob, companyName, a.token as string);
      const res = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: FROM, to: [a.email], subject, html, text }),
      });
      const body = await res.text();
      steps.push(`resend=${res.status}:${body.slice(0, 150)}`);
    }

    return steps.join(" | ");
  } catch (e) {
    return steps.join(" | ") + ` | FATAL=${e instanceof Error ? e.message : String(e)}`;
  }
}
