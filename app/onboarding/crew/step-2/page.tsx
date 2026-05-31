import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateCrewExperience } from "@/lib/actions/profile";
import Link from "next/link";

export const metadata = {
  title: "Experience — ShipCrewFinder",
};

export default async function CrewStep2Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/dashboard");

  const isShip = profile.user_type === "seafarer";

  const experienceOptions = [
    {
      value: "0-1",
      title: "Just Starting",
      subtitle: "0-1 year",
      description: isShip
        ? "New to maritime industry or first contract"
        : "New to yachting or first season",
    },
    {
      value: "1-3",
      title: "Building Experience",
      subtitle: "1-3 years",
      description: isShip
        ? "Few contracts completed, gaining sea time"
        : "Multiple seasons, growing your skills",
    },
    {
      value: "3+",
      title: "Experienced",
      subtitle: "3+ years",
      description: isShip
        ? "Seasoned professional with extensive sea time"
        : "Veteran with extensive yachting experience",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm font-bold">Step 2 of 5</span>
          <span className="text-white/60 text-sm">40% complete</span>
        </div>
        <div className="h-2 bg-primary-dark border border-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: "40%" }} />
        </div>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
          How much experience do you have?
        </h1>
        <p className="text-white/60 text-lg">
          This helps companies find the right candidates for their positions.
        </p>
      </div>

      {/* Form */}
      <form action={updateCrewExperience} className="space-y-6">
        <div className="space-y-3">
          {experienceOptions.map((option) => (
            <label
              key={option.value}
              className="block cursor-pointer group"
            >
              <input
                type="radio"
                name="experience"
                value={option.value}
                required
                className="peer sr-only"
              />
              <div className="bg-primary-dark border-2 border-white/10 hover:border-white/20 peer-checked:border-accent peer-checked:bg-accent/5 rounded-2xl p-6 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-1">
                      <h3 className="font-display text-xl font-bold text-white">
                        {option.title}
                      </h3>
                      <span className="text-accent font-bold text-sm">
                        {option.subtitle}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-white/30 peer-checked:border-green-500 peer-checked:bg-green-500 flex items-center justify-center mt-1 group-hover:border-white/50 transition">
                    <svg
                      className="w-3 h-3 text-primary opacity-0 peer-checked:opacity-100"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                    >
                      <path d="M10.293 3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L5 7.586l4.293-4.293z" />
                    </svg>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/onboarding/crew/step-1"
            className="text-white/40 hover:text-white/60 text-sm transition"
          >
            ← Back
          </Link>
          <button
            type="submit"
            className="px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition shadow-lg shadow-accent/20"
          >
            Continue →
          </button>
        </div>
      </form>
    </div>
  );
}
