import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Profile Complete — ShipCrewFinder",
};

async function sendReferralWelcomeEmail(
  userId: string,
  email: string | null,
  fullName: string | null,
  referralCode: string | null
) {
  try {
    const admin = createAdminClient();

    const { data: secretRow } = await admin
      .from("app_secrets")
      .select("value")
      .eq("key", "resend_api_key")
      .single();
    const resendKey = secretRow?.value as string | undefined;

    const refCode = referralCode || "";
    const link = `https://shipcrewfinder.com/signup/crew?ref=${refCode}`;
    const firstName = (fullName || "there").split(" ")[0];

    await admin.from("notifications").insert({
      user_id: userId,
      type: "referral",
      title: "🌟 Invite 2 friends, get Premium — free, forever",
      message:
        "2 friends join with your link and finish their profile — you get Premium, free forever. Check your dashboard for your link.",
      link: "/dashboard",
      read: false,
    });

    if (email && resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ShipCrewFinder <jobs@shipcrewfinder.com>",
          to: [email],
          subject: "🌟 Invite 2 friends, get Premium — free, forever",
          html:
            '<div style="font-family:Arial,sans-serif;max-width:560px">' +
            '<h2 style="color:#0d1030">⚓ Get Premium for free</h2>' +
            "<p>Hi " + firstName + ",</p>" +
            "<p>Welcome aboard ShipCrewFinder. Here's a fast way to unlock more from your profile: invite <b>2 friends</b> with your personal link below. Once they join and finish their profile, you get <b>Premium — free, forever</b>:</p>" +
            "<ul><li>Show up first in company searches</li><li>Get new jobs before anyone else</li></ul>" +
            "<p>Your link:</p>" +
            '<p style="background:#f4f4f4;padding:12px;border-radius:8px;word-break:break-all;font-family:monospace;font-size:13px;">' + link + "</p>" +
            '<p><a href="' + link + '" style="background:#fbbf24;color:#0b0e13;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">Copy your link →</a></p>' +
            '<p style="color:#888;font-size:12px;margin-top:18px">You\'re receiving this because you just joined ShipCrewFinder.</p>' +
            "</div>",
          text: "Invite 2 friends with your link, get Premium free forever. Your link: " + link,
        }),
      });
    }
  } catch {
    // Mail gonderimi basarisiz olsa bile kullanicinin sayfayi gormesini engelleme
  }
}

export default async function OnboardingCompletePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, user_type, email, referral_code")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/dashboard");

  const firstName = profile.full_name?.split(" ")[0] || null;
  const userType = (profile.user_type as string) || "unknown";

  if (userType === "seafarer" || userType === "yacht") {
    await sendReferralWelcomeEmail(
      user.id,
      (profile.email as string) || user.email || null,
      profile.full_name as string,
      profile.referral_code as string
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <script
        dangerouslySetInnerHTML={{
          __html: `if (typeof window.gtag === 'function') { window.gtag('event', 'sign_up', { method: '${userType}' }); } if (typeof window.fbq === 'function') { window.fbq('track', 'CompleteRegistration', { content_name: '${userType}' }); }`,
        }}
      />
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/15 border-2 border-green-500/40 rounded-3xl mb-6">
          <svg
            className="w-11 h-11 text-green-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Profile Complete! 🎉
        </h1>

        <p className="text-white/60 text-lg mb-2">
          {firstName ? `Welcome aboard, ${firstName}.` : "Welcome aboard."}
        </p>
        <p className="text-white/60 text-lg mb-10">
          Your profile is now{" "}
          <strong className="text-white">live</strong> and discoverable by
          verified maritime companies worldwide.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 bg-accent hover:bg-accent-dark text-primary font-extrabold rounded-lg transition shadow-lg shadow-accent/30 text-center"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/profile/me"
            className="w-full sm:w-auto px-8 py-3.5 bg-primary-dark border-2 border-white/15 hover:border-white/30 text-white font-bold rounded-lg transition text-center"
          >
            View My Profile
          </Link>
        </div>

        {/* Subtle hint */}
        <p className="text-white/40 text-sm mt-8">
          You can edit your profile anytime from your dashboard.
        </p>
      </div>
    </div>
  );
}
