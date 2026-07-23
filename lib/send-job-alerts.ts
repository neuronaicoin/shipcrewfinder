import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildJobAlertEmail, type AlertJob } from "@/lib/email/job-alert-email";

const FROM = "ShipCrewFinder <jobs@shipcrewfinder.com>";
const RESEND_ENDPOINT = "https://api.resend.com/emails";

type SendResult = {
  sent: number;
  failed: number;
  total: number;
  reason?: string;
};

/**
 * Yeni ilan yayınlandığında, o rank'e alarm kurmuş crew üyelerine mail gönderir.
 * Hata durumunda asla throw etmez — ilan verme akışını bozmamalı.
 */
export async function sendJobAlerts(jobId: string): Promise<SendResult> {
  const empty: SendResult = { sent: 0, failed: 0, total: 0 };

  if (!process.env.RESEND_API_KEY) {
    return { ...empty, reason: "RESEND_API_KEY missing" };
  }

  try {
    const admin = createAdminClient();

    const { data: job, error: jobError } = await admin
      .from("jobs")
      .select(
        "id, title, rank_required, position, vessel_type, location_country, location_city, contract_duration, salary_min, salary_max, salary_currency, description, status, company_id"
      )
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return { ...empty, reason: "job not found" };
    }
    if (job.status !== "active") {
      return { ...empty, reason: "job not active" };
    }

    const rank = (job.rank_required as string) || (job.position as string) || "";
    if (!rank) {
      return { ...empty, reason: "job has no rank" };
    }

    const { data: alerts, error: alertError } = await admin
      .from("job_alerts")
      .select("id, email, token")
      .eq("rank", rank)
      .eq("active", true);

    if (alertError) {
      return { ...empty, reason: `alert query failed: ${alertError.message}` };
    }
    if (!alerts || alerts.length === 0) {
      return { ...empty, reason: "no subscribers" };
    }

    let companyName = "A verified shipping company";
    if (job.company_id) {
      const { data: company } = await admin
        .from("profiles")
        .select("full_name")
        .eq("id", job.company_id)
        .single();
      if (company?.full_name) {
        companyName = company.full_name as string;
      }
    }

    let sent = 0;
    let failed = 0;
    const deliveredIds: string[] = [];

    for (const alert of alerts) {
      if (!alert.email) {
        failed++;
        continue;
      }

      const { subject, html, text } = buildJobAlertEmail(
        job as unknown as AlertJob,
        companyName,
        alert.token as string
      );

      try {
        const res = await fetch(RESEND_ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: FROM,
            to: [alert.email],
            subject,
            html,
            text,
          }),
        });

        if (res.ok) {
          sent++;
          deliveredIds.push(alert.id as string);
        } else {
          failed++;
          const detail = await res.text();
          console.error("[job-alerts] resend rejected", alert.email, res.status, detail);
        }
      } catch (err) {
        failed++;
        console.error("[job-alerts] resend threw", alert.email, err);
      }

      // Resend rate limit koruması (saniyede ~10 istek)
      await new Promise((resolve) => setTimeout(resolve, 120));
    }

    if (deliveredIds.length > 0) {
      await admin
        .from("job_alerts")
        .update({ last_sent_at: new Date().toISOString() })
        .in("id", deliveredIds);
    }

    console.log(`[job-alerts] job=${jobId} rank=${rank} sent=${sent} failed=${failed}`);

    return { sent, failed, total: alerts.length };
  } catch (err) {
    console.error("[job-alerts] fatal", err);
    return { ...empty, reason: "fatal error" };
  }
}
