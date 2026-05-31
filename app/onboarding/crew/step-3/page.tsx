import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSortedCountries } from "@/lib/constants/countries";
import { getSortedLanguages, ENGLISH_LEVELS } from "@/lib/constants/languages";
import { updateCrewNationality } from "@/lib/actions/profile";
import Link from "next/link";

export const metadata = {
  title: "Nationality — ShipCrewFinder",
};

export default async function CrewStep3Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const countries = getSortedCountries();
  const languages = getSortedLanguages();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm font-bold">Step 3 of 5</span>
          <span className="text-white/60 text-sm">60% complete</span>
        </div>
        <div className="h-2 bg-primary-dark border border-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: "60%" }} />
        </div>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
          Tell us about yourself
        </h1>
        <p className="text-white/60 text-lg">
          Your nationality and language skills help match you with the right opportunities.
        </p>
      </div>

      {/* Form */}
      <form action={updateCrewNationality} className="space-y-5">
        {/* Nationality */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
          <label htmlFor="nationality" className="block text-white font-bold mb-3">
            Nationality <span className="text-accent">*</span>
          </label>
          <select
            id="nationality"
            name="nationality"
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
              -- Select your nationality --
            </option>
            <optgroup label="Popular Maritime Nations">
              {countries.slice(0, 14).map((country) => (
                <option key={country.code} value={country.code} className="bg-primary-dark">
                  {country.flag} {country.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="All Countries">
              {countries.slice(14).map((country) => (
                <option key={country.code} value={country.code} className="bg-primary-dark">
                  {country.flag} {country.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* English Level */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
          <label htmlFor="englishLevel" className="block text-white font-bold mb-3">
            English Proficiency
          </label>
          <select
            id="englishLevel"
            name="englishLevel"
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
              -- Select level --
            </option>
            {ENGLISH_LEVELS.map((level) => (
              <option key={level.value} value={level.value} className="bg-primary-dark">
                {level.label}
              </option>
            ))}
          </select>
          <p className="text-white/40 text-xs mt-2">Required for most international positions</p>
        </div>

        {/* Languages (multi-select) */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
          <label className="block text-white font-bold mb-3">
            Other Languages
          </label>
          <p className="text-white/40 text-xs mb-4">
            Select all languages you can communicate in
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-2">
            {languages.map((language) => (
              <label
                key={language.code}
                className="flex items-center gap-2 px-3 py-2 bg-primary border border-white/10 hover:border-white/20 rounded-lg cursor-pointer transition group has-[:checked]:border-accent has-[:checked]:bg-accent/10"
              >
                <input
                  type="checkbox"
                  name="languages"
                  value={language.code}
                  className="w-4 h-4 accent-accent cursor-pointer"
                />
                <span className="text-white/80 text-sm group-hover:text-white transition truncate">
                  {language.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/onboarding/crew/step-2"
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
