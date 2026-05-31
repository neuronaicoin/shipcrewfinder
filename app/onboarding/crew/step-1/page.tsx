import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SHIP_RANKS, YACHT_POSITIONS } from "@/lib/constants/ranks";
import { updateCrewRank } from "@/lib/actions/profile";
import Link from "next/link";

export const metadata = {
  title: "Select your rank — ShipCrewFinder",
};

export default async function CrewStep1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get user type
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type, full_name")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/dashboard");

  const isShip = profile.user_type === "seafarer";
  const ranks = isShip ? SHIP_RANKS : YACHT_POSITIONS;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm font-bold">Step 1 of 5</span>
          <span className="text-white/60 text-sm">20% complete</span>
        </div>
        <div className="h-2 bg-primary-dark border border-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: "20%" }} />
        </div>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <div className="inline-block px-4 py-1.5 bg-accent/15 border border-accent/30 rounded-full mb-4">
          <span className="text-accent text-xs font-extrabold tracking-wider uppercase">
            {isShip ? "Ship Crew" : "Yacht Crew"}
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
          What's your rank?
        </h1>
        <p className="text-white/60 text-lg">
          Hi {profile.full_name}! Select your current or most recent {isShip ? "rank" : "position"}.
        </p>
      </div>

      {/* Form */}
      <form action={updateCrewRank} className="space-y-6">
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 md:p-8">
          <label htmlFor="rank" className="block text-white font-bold mb-4">
            Select {isShip ? "Rank" : "Position"}
          </label>
          <select
            id="rank"
            name="rank"
            required
            defaultValue=""
            className="w-full px-4 py-3 bg-primary border border-white/15 rounded-lg text-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23fbbf24' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              paddingRight: "2.5rem",
            }}
          >
            <option value="" disabled>
              -- Select your {isShip ? "rank" : "position"} --
            </option>
            {Object.entries(ranks).map(([department, ranksList]) => (
              <optgroup key={department} label={department}>
                {ranksList.map((rank) => (
                  <option key={rank} value={rank} className="bg-primary-dark">
                    {rank}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="text-white/40 text-xs mt-3">
            Choose the rank you currently hold or held in your most recent contract
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-white/40 hover:text-white/60 text-sm transition">
            ← Skip for now
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
