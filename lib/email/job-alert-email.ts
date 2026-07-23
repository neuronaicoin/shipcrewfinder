export type AlertJob = {
  id: string;
  title: string;
  rank_required: string | null;
  position: string | null;
  vessel_type: string | null;
  location_country: string | null;
  location_city: string | null;
  contract_duration: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  description: string | null;
};

const SITE = "https://shipcrewfinder.com";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function salaryLine(job: AlertJob): string | null {
  if (!job.salary_min && !job.salary_max) return null;
  const cur = job.salary_currency || "USD";
  if (job.salary_min && job.salary_max) {
    return `${cur} ${job.salary_min.toLocaleString("en-US")} – ${job.salary_max.toLocaleString("en-US")} / month`;
  }
  const single = job.salary_min || job.salary_max;
  return `${cur} ${(single as number).toLocaleString("en-US")} / month`;
}

export function buildJobAlertEmail(
  job: AlertJob,
  companyName: string,
  token: string
): { subject: string; html: string; text: string } {
  const rank = job.rank_required || job.position || "";
  const jobUrl = `${SITE}/jobs/${job.id}`;
  const unsubUrl = `${SITE}/unsubscribe?token=${token}`;
  const location = [job.location_city, job.location_country].filter(Boolean).join(", ");
  const pay = salaryLine(job);

  const rawSnippet = (job.description || "").replace(/\s+/g, " ").trim();
  const snippet = rawSnippet.length > 200 ? `${rawSnippet.slice(0, 200)}…` : rawSnippet;

  const chipValues = [job.vessel_type, location || null, job.contract_duration].filter(
    Boolean
  ) as string[];

  const chips = chipValues
    .map(
      (c) =>
        `<span style="display:inline-block;background:#1a1f45;color:#c9cde4;border-radius:999px;padding:6px 13px;font-size:12px;margin:0 6px 6px 0;">${esc(c)}</span>`
    )
    .join("");

  const subject = rank
    ? `New ${rank} position${location ? ` — ${location}` : ""}`
    : `New position: ${job.title}`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#0d1030;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d1030;padding:32px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#12163a;border:1px solid #232a55;border-radius:16px;">
        <tr>
          <td style="padding:26px 28px 6px;">
            <div style="color:#fbbf24;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">ShipCrewFinder</div>
            <div style="color:#8f97bd;font-size:13px;margin-top:8px;">A new position matching your job alert has just been posted.</div>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 28px 0;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;line-height:1.35;font-weight:700;">${esc(job.title)}</h1>
            <div style="color:#fbbf24;font-size:14px;margin-top:8px;font-weight:600;">${esc(companyName)}</div>
            ${pay ? `<div style="color:#6ee7a8;font-size:15px;margin-top:12px;font-weight:700;">${esc(pay)}</div>` : ""}
            ${chips ? `<div style="margin-top:16px;">${chips}</div>` : ""}
            ${snippet ? `<p style="color:#a8afd0;font-size:14px;line-height:1.65;margin:16px 0 0;">${esc(snippet)}</p>` : ""}
          </td>
        </tr>
        <tr>
          <td style="padding:26px 28px 26px;">
            <a href="${jobUrl}" style="display:block;background:#fbbf24;color:#0d1030;text-decoration:none;text-align:center;padding:15px 20px;border-radius:10px;font-weight:700;font-size:15px;">View Position &amp; Apply</a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 28px 26px;border-top:1px solid #232a55;">
            <p style="color:#6b7299;font-size:12px;line-height:1.7;margin:0;">
              You are receiving this because you created a job alert${rank ? ` for <strong style="color:#8f97bd;">${esc(rank)}</strong>` : ""}.<br>
              <a href="${unsubUrl}" style="color:#8f97bd;">Unsubscribe from this alert</a>
              &nbsp;·&nbsp;
              <a href="${SITE}/jobs" style="color:#8f97bd;">Browse all jobs</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  const textParts = [
    subject,
    "",
    job.title,
    companyName,
    pay || "",
    location || "",
    job.contract_duration || "",
    "",
    snippet,
    "",
    `View & apply: ${jobUrl}`,
    "",
    `Unsubscribe: ${unsubUrl}`,
  ].filter((line) => line !== "" || true);

  const text = textParts.join("\n").replace(/\n{3,}/g, "\n\n");

  return { subject, html, text };
}
