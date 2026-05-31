import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import Link from "next/link";

export const metadata = {
  title: "My Profile — ShipCrewFinder",
};

export default async function MyProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/dashboard");
  }

  // Load type-specific details
  let detailsData: Record<string, unknown> | null = null;

  if (profile.user_type === "seafarer") {
    const { data } = await supabase
      .from("seafarer_details")
      .select("*")
      .eq("id", user.id)
      .single();
    detailsData = data;
  } else if (profile.user_type === "yacht") {
    const { data } = await supabase
      .from("yacht_details")
      .select("*")
      .eq("id", user.id)
      .single();
    detailsData = data;
  } else if (profile.user_type === "company") {
    const { data } = await supabase
      .from("company_details")
      .select("*")
      .eq("id", user.id)
      .single();
    detailsData = data;
  }

  const isCrew =
    profile.user_type === "seafarer" || profile.user_type === "yacht";

  const accountTypeLabel =
    profile.user_type === "company"
      ? "Company"
      : profile.user_type === "yacht"
      ? "Yacht Crew"
      : "Ship Crew";

  const onboardingUrl =
    profile.user_type === "company"
      ? "/onboarding/company/step-1"
      : "/onboarding/crew/step-1";

  // Display helpers
  const experienceLabel = (() => {
    const y = detailsData?.years_experience as number | undefined | null;
    if (y === undefined || y === null) return null;
    if (y <= 1) return "0–1 years";
    if (y <= 3) return "1–3 years";
    return "3+ years";
  })();

  const availabilityLabel = (() => {
    const a = detailsData?.availability as string | undefined | null;
    if (!a) return null;
    if (a === "immediate") return "Available within 1 month";
    if (a === "1-3_months") return "Available in 1–3 months";
    if (a === "3+_months") return "Available in 3+ months";
    return a;
  })();

  const languages = Array.isArray(detailsData?.languages)
    ? (detailsData?.languages as string[])
    : [];

  const hiringRanks = Array.isArray(detailsData?.hiring_for_ranks)
    ? (detailsData?.hiring_for_ranks as string[])
    : [];

  const fleetTypes = Array.isArray(detailsData?.fleet_types)
    ? (detailsData?.fleet_types as string[])
    : [];

  const displayName = profile.full_name || "Your Profile";
  const initial = (profile.full_name || user.email || "U")
    .charAt(0)
    .toUpperCase();

  const isPublic = profile.visibility === "public";

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

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-lg transition border border-white/10"
            >
              Dashboard
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
        </div>
      </header>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/60 text-sm transition mb-6"
        >
          ← Back to Dashboard
        </Link>

        {/* Profile Header Card */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 md:p-8 mb-6">
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center">
              <span className="font-display text-3xl font-bold text-accent">
                {initial}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-block px-3 py-1 bg-accent/15 border border-accent/30 rounded-full mb-2">
                <span className="text-accent text-xs font-extrabold tracking-wider uppercase">
                  {accountTypeLabel}
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight break-words">
                {displayName}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold uppercase border ${
                    isPublic
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "bg-white/5 border-white/10 text-white/60"
                  }`}
                >
                  {isPublic ? "Public" : "Hidden"}
                </span>
                <span className="text-white/40 text-xs">
                  {isPublic
                    ? "Visible to verified companies"
                    : "Not visible in search"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={onboardingUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg transition border border-white/10 text-sm"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Crew details */}
        {isCrew && (
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 md:p-8 mb-6">
            <h2 className="font-display text-xl font-bold text-white mb-4">
              Professional Details
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-white/60 text-sm">
                  {profile.user_type === "yacht" ? "Position" : "Rank"}
                </span>
                <span className="text-white font-medium text-sm">
                  {(detailsData?.rank as string) ||
                    (detailsData?.position as string) ||
                    "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-white/60 text-sm">Experience</span>
                <span className="text-white font-medium text-sm">
                  {experienceLabel || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-white/60 text-sm">Nationality</span>
                <span className="text-white font-medium text-sm">
                  {(detailsData?.nationality as string) ||
                    profile.country ||
                    "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-white/60 text-sm">Languages</span>
                <span className="text-white font-medium text-sm text-right">
                  {languages.length > 0 ? languages.join(", ") : "—"}
                </span>
              </div>
              {detailsData?.english_level ? (
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-white/60 text-sm">English Level</span>
                  <span className="text-white font-medium text-sm">
                    {detailsData.english_level as string}
                  </span>
                </div>
              ) : null}
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-white/60 text-sm">Availability</span>
                <span className="text-white font-medium text-sm">
                  {availabilityLabel || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-white/60 text-sm">CV</span>
                <span className="text-white font-medium text-sm">
                  {detailsData?.cv_url ? (
                    
                      href={detailsData.cv_url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent-light underline underline-offset-2"
                    >
                      View CV
                    </a>
                  ) : (
                    "Not uploaded"
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Company details */}
        {profile.user_type === "company" && (
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 md:p-8 mb-6">
            <h2 className="font-display text-xl font-bold text-white mb-4">
              Company Details
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-white/60 text-sm">Company Type</span>
                <span className="text-white font-medium text-sm">
                  {(detailsData?.company_type as string) || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-white/60 text-sm">Headquarters</span>
                <span className="text-white font-medium text-sm">
                  {(detailsData?.headquarters_country as string) || "—"}
                </span>
              </div>
              {detailsData?.website ? (
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-white/60 text-sm">Website</span>
                  
                    href={detailsData.website as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-light underline underline-offset-2 text-sm font-medium break-all text-right"
                  >
                    {detailsData.website as string}
                  </a>
                </div>
              ) : null}
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-white/60 text-sm">Hiring For</span>
                <span className="text-white font-medium text-sm text-right">
                  {hiringRanks.length > 0 ? hiringRanks.join(", ") : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-white/60 text-sm">Fleet Types</span>
                <span className="text-white font-medium text-sm text-right">
                  {fleetTypes.length > 0 ? fleetTypes.join(", ") : "—"}
                </span>
              </div>
            </div>
            {detailsData?.description ? (
              <div className="mt-4 pt-4 border-t border-white/5">
                <span className="text-white/60 text-sm block mb-2">About</span>
                <p className="text-white/80 text-sm leading-relaxed">
                  {detailsData.description as string}
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* Contact */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 md:p-8">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            Contact
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-white/60 text-sm">Email</span>
              <span className="text-white font-medium text-sm">
                {user.email}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-white/60 text-sm">Phone</span>
              <span className="text-white font-medium text-sm">
                {profile.phone || "—"}
              </span>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-4">
            Your contact details are only shared with companies after they
            unlock your profile.
          </p>
        </div>
      </div>
    </main>
  );
}
