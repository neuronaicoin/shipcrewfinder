import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Profile Complete — ShipCrewFinder",
};

export default async function OnboardingCompletePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, user_type")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/dashboard");

  const firstName = profile.full_name?.split(" ")[0] || null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
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
