import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Unsubscribe — ShipCrewFinder",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const token = sp.token || "";

  let heading = "Invalid link";
  let message = "This unsubscribe link is not valid. It may have been copied incorrectly.";
  let success = false;

  if (token) {
    try {
      const admin = createAdminClient();
      const { data, error } = await admin
        .from("job_alerts")
        .update({ active: false })
        .eq("token", token)
        .select("rank")
        .maybeSingle();

      if (error) {
        heading = "Something went wrong";
        message = "We could not process your request right now. Please try again in a moment.";
      } else if (data) {
        heading = "Unsubscribed";
        message = `You will no longer receive email alerts for ${data.rank as string} positions.`;
        success = true;
      } else {
        heading = "Already unsubscribed";
        message = "This alert has already been turned off. No further emails will be sent.";
        success = true;
      }
    } catch {
      heading = "Something went wrong";
      message = "We could not process your request right now. Please try again in a moment.";
    }
  }

  return (
    <main className="min-h-screen bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
            <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 14 Q10 6, 20 14 T38 14" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
              <path d="M2 20 Q10 12, 20 20 T38 20" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              <path d="M2 26 Q10 18, 20 26 T38 26" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-white font-display font-bold text-lg tracking-tight">
              Ship<span className="text-accent">Crew</span>Finder
            </span>
          </Link>

          <div className="bg-primary-dark border border-white/10 rounded-2xl p-8">
            <div className="text-3xl mb-4">{success ? "✓" : "!"}</div>
            <h1 className="font-display text-2xl font-bold text-white mb-3">{heading}</h1>
            <p className="text-white/60 text-sm leading-relaxed">{message}</p>

            <div className="mt-8 space-y-3">
              <Link
                href="/jobs"
                className="block w-full px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-bold text-sm rounded-lg transition"
              >
                Browse Jobs
              </Link>
              <Link
                href="/dashboard"
                className="block w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white/70 font-bold text-sm rounded-lg transition border border-white/10"
              >
                Manage My Alerts
              </Link>
            </div>
          </div>

          <p className="text-white/30 text-xs mt-6">
            Changed your mind? You can re-enable alerts anytime from the jobs page.
          </p>
        </div>
      </div>
    </main>
  );
}
