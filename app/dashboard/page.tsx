import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import Link from "next/link";

export const metadata = {
  title: "Dashboard — ShipCrewFinder",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ onboarding?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get user type details to calculate profile completion
  let detailsCompletion = 0;
  let detailsData: Record<string, unknown> | null = null;

  if (profile?.user_type === "seafarer") {
    const { data } = await supabase
      .from("seafarer_details")
      .select("*")
      .eq("id", user.id)
      .single();
    detailsData = data;
  } else if (profile?.user_type === "yacht") {
    const { data } = await supabase
      .from("yacht_details")
      .select("*")
      .eq("id", user.id)
      .single();
    detailsData = data;
  } else if (profile?.user_type === "company") {
    const { data } = await supabase
      .from("company_details")
      .select("*")
      .eq("id", user.id)
      .single();
    detailsData = data;
  }

  // Calculate profile completion
  // Base: account created (20%)
  // Each filled field adds more
  let completion = 20; // account exists

  if (profile?.user_type === "seafarer" || profile?.user_type === "yacht") {
    if (detailsData?.rank || detailsData?.position) completion += 15;
    if (detailsData?.years_experience !== undefined && detailsData?.years_experience !== null) completion += 15;
    if (detailsData?.nationality || profile?.country) completion += 15;
    if (detailsData?.cv_url) completion += 15;
    if (detailsData?.availability) completion += 10;
    if (profile?.phone) completion += 10;
  } else if (profile?.user_type === "company") {
    if (detailsData?.headquarters_country) completion += 20;
    if (detailsData?.company_type) completion += 20;
    if (detailsData?.hiring_for_ranks && Array.isArray(detailsData.hiring_for_ranks) && detailsData.hiring_for_ranks.length > 0) completion += 20;
    if (detailsData?.company_logo_url) completion += 10;
    if (detailsData?.description) completion += 10;
  }

  completion = Math.min(completion, 100);
  const isComplete = completion === 100;

  // Onboarding URL based on user type
  const onboardingUrl =
    profile?.user_type === "company"
      ? "/onboarding/company/step-1"
      : "/onboarding/crew/step-1";

  const params = await searchParams;
  const justCompleted = params?.onboarding === "complete";

  // Account type label
  const accountTypeLabel =
    profile?.user_type === "company"
      ? "Company Account"
      : profile?.user_type === "yacht"
      ? "Yacht Crew"
      : "Ship Crew";

  return (
    <main className="min-h-screen bg-primary relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
      <header className="relative border-b border-white/10 backdrop-blur-md bg-primary/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 14 Q10 6, 20 14 T38 14" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
              <path d="M2 20 Q10 12, 20 20 T38 20" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              <path d="M2 26 Q10 18, 20 26 T38 26" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-white font-display font-bold text-lg tracking-tight">
              Ship<span className="text-accent">Crew</span>Finder
            </span>
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-lg transition border border-white/10"
            >
              Log Out
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Onboarding success banner */}
        {justCompleted && (
          <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl p-5 mb-8 flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/20 border border-emerald-500/40 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-emerald-400 font-bold text-lg mb-1">
                🎉 Profile Complete!
              </h3>
              <p className="text-white/70 text-sm">
                Your profile is now public and discoverable by maritime {profile?.user_type === "company" ? "talent" : "companies"} worldwide.
              </p>
            </div>
          </div>
        )}

        {/* Welcome */}
        <div className="mb-10">
          <div className="inline-block px-4 py-1.5 bg-accent/15 border border-accent/30 rounded-full mb-4">
            <span className="text-accent text-xs font-extrabold tracking-wider uppercase">
              {accountTypeLabel}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Welcome, {profile?.full_name || "there"}!
          </h1>
          <p className="text-white/60 text-lg">
            {isComplete
              ? "Your profile is live and ready."
              : "Let's complete your profile to start receiving offers."}
          </p>
        </div>

        {/* Profile Status Card */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 md:p-8 mb-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                Profile Status
              </h2>
              <p className="text-white/60 text-sm">
                {isComplete
                  ? "Your profile is complete and live"
                  : "Complete your profile to unlock all features"}
              </p>
            </div>
            <div
              className={`px-3 py-1 border rounded-full ${
                isComplete
                  ? "bg-emerald-500/15 border-emerald-500/30"
                  : "bg-amber-500/15 border-amber-500/30"
              }`}
            >
              <span
                className={`text-xs font-bold uppercase tracking-wide ${
                  isComplete ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {isComplete ? "Complete" : "Incomplete"}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm font-bold">Profile completion</span>
              <span className="text-white/70 text-sm">{completion}%</span>
            </div>
            <div className="h-2 bg-primary border border-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          {/* Action */}
          {!isComplete ? (
            <Link
              href={onboardingUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition shadow-lg shadow-accent/20"
            >
              Complete Profile
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" />
              </svg>
            </Link>
          ) : (
            <Link
              href={onboardingUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg transition border border-white/10"
            >
              Edit Profile
            </Link>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 md:p-8">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            Account Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-white/60 text-sm">Email</span>
              <span className="text-white font-medium text-sm">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-white/60 text-sm">Account Type</span>
              <span className="text-white font-medium text-sm">
                {accountTypeLabel}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-white/60 text-sm">Member Since</span>
              <span className="text-white font-medium text-sm">
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-white/60 text-sm">Profile Visibility</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold uppercase border ${
                  profile?.visibility === "public"
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                    : "bg-white/5 border-white/10 text-white/60"
                }`}
              >
                {profile?.visibility === "public" ? "Public" : "Hidden"}
              </span>
            </div>
          </div>
        </div>

        {/* Coming Soon Note */}
        <p className="text-center text-white/40 text-sm mt-8">
          Job search, candidate browsing, and messaging coming soon
        </p>
      </div>
    </main>
  );
}
