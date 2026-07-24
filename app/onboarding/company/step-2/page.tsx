import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SHIP_RANKS, YACHT_POSITIONS } from "@/lib/constants/ranks";
import { updateCompanyHiring } from "@/lib/actions/profile";
import Link from "next/link";

export const metadata = {
  title: "Hiring Preferences — ShipCrewFinder",
};

export default async function CompanyStep2Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Mevcut değerleri çek — edit modunda işaretli göster
  const { data: details } = await supabase
    .from("company_details")
    .select("hiring_for_ranks, fleet_types")
    .eq("id", user.id)
    .maybeSingle();

  const savedRanks: string[] = Array.isArray(details?.hiring_for_ranks)
    ? (details?.hiring_for_ranks as string[])
    : [];
  const savedFleets: string[] = Array.isArray(details?.fleet_types)
    ? (details?.fleet_types as string[])
    : [];
  const isEditing = savedRanks.length > 0 || savedFleets.length > 0;

  const fleetTypes = [
    "Container Ships",
    "Bulk Carriers",
    "Oil Tankers",
    "Chemical Tankers",
    "Gas Carriers (LNG/LPG)",
    "General Cargo",
    "Ro-Ro",
    "Reefer",
    "Passenger Ships",
    "Cruise Ships",
    "Yachts / Superyachts",
    "Offshore Vessels",
    "Tugboats",
    "Fishing Vessels",
    "Specialized / Other",
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm font-bold">Step 2 of 3</span>
          <span className="text-white/60 text-sm">66% complete</span>
        </div>
        <div className="h-2 bg-primary-dark border border-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: "66%" }} />
        </div>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
          What are you hiring for?
        </h1>
        <p className="text-white/60 text-lg">
          {isEditing
            ? "Your saved selections are checked — adjust them or continue."
            : "Select the positions and vessel types you typically recruit for. This helps us match you with the right candidates."}
        </p>
      </div>

      {/* Form */}
      <form action={updateCompanyHiring} className="space-y-6">
        {/* Fleet Types */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
          <label className="block text-white font-bold mb-2">
            Vessel Types You Operate
          </label>
          <p className="text-white/40 text-xs mb-4">
            Select all that apply
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {fleetTypes.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 px-3 py-2 bg-primary border border-white/10 hover:border-white/20 rounded-lg cursor-pointer transition has-[:checked]:border-accent has-[:checked]:bg-accent/10"
              >
                <input
                  type="checkbox"
                  name="fleetTypes"
                  value={type}
                  defaultChecked={savedFleets.includes(type)}
                  className="w-4 h-4 accent-accent cursor-pointer"
                />
                <span className="text-white/80 text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ship Ranks */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
          <label className="block text-white font-bold mb-2">
            Ship Crew Positions You Hire
          </label>
          <p className="text-white/40 text-xs mb-4">
            Select all positions you typically recruit for
          </p>
          <div className="space-y-4">
            {Object.entries(SHIP_RANKS).map(([department, ranks]) => (
              <div key={department}>
                <h4 className="text-accent text-xs font-extrabold tracking-wider uppercase mb-2">
                  {department}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ranks.map((rank) => (
                    <label
                      key={rank}
                      className="flex items-center gap-2 px-3 py-2 bg-primary border border-white/10 hover:border-white/20 rounded-lg cursor-pointer transition has-[:checked]:border-accent has-[:checked]:bg-accent/10"
                    >
                      <input
                        type="checkbox"
                        name="hiringRanks"
                        value={rank}
                        defaultChecked={savedRanks.includes(rank)}
                        className="w-4 h-4 accent-accent cursor-pointer"
                      />
                      <span className="text-white/80 text-sm truncate">{rank}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Yacht Positions */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
          <label className="block text-white font-bold mb-2">
            Yacht Crew Positions You Hire
          </label>
          <p className="text-white/40 text-xs mb-4">
            Skip if you don't recruit yacht crew
          </p>
          <div className="space-y-4">
            {Object.entries(YACHT_POSITIONS).map(([department, positions]) => (
              <div key={department}>
                <h4 className="text-accent text-xs font-extrabold tracking-wider uppercase mb-2">
                  {department}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {positions.map((position) => (
                    <label
                      key={position}
                      className="flex items-center gap-2 px-3 py-2 bg-primary border border-white/10 hover:border-white/20 rounded-lg cursor-pointer transition has-[:checked]:border-accent has-[:checked]:bg-accent/10"
                    >
                      <input
                        type="checkbox"
                        name="hiringRanks"
                        value={position}
                        defaultChecked={savedRanks.includes(position)}
                        className="w-4 h-4 accent-accent cursor-pointer"
                      />
                      <span className="text-white/80 text-sm truncate">{position}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/onboarding/company/step-1"
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
