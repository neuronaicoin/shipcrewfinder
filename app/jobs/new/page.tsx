import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createJob } from "@/lib/actions/jobs";
import { SHIP_RANKS, YACHT_POSITIONS } from "@/lib/constants/ranks";
import { getSortedCountries } from "@/lib/constants/countries";

export const metadata = {
  title: "Post a Job — ShipCrewFinder",
};

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const error = sp.error;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();
  if (!profile || profile.user_type !== "company") redirect("/dashboard");

  const countries = getSortedCountries();

  const inputStyle = {
    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23fbbf24' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 1rem center",
    paddingRight: "2.5rem",
  };

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
          <Link href="/dashboard" className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-lg transition border border-white/10">
            Dashboard
          </Link>
        </div>
      </header>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link href="/jobs/mine" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/60 text-sm transition mb-6">
          ← My Job Posts
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
          Post a Job
        </h1>
        <p className="text-white/60 text-base mb-8">
          Create a job listing. Crew will see the title and details, and can contact you through the platform.
        </p>

        {error === "missing" && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
            Please fill in the required fields: crew type, rank, title, and description.
          </div>
        )}
        {error === "failed" && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
            Something went wrong while posting the job. Please try again.
          </div>
        )}

        <form action={createJob} className="space-y-5">
          {/* Crew Type */}
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
            <label className="block text-white font-bold mb-3">
              Crew Type <span className="text-accent">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 px-4 py-3 bg-primary border border-white/15 rounded-lg cursor-pointer transition has-[:checked]:border-accent has-[:checked]:bg-accent/10">
                <input type="radio" name="jobType" value="seafarer" defaultChecked className="w-4 h-4 accent-accent" />
                <span className="text-white text-sm font-medium">Ship Crew</span>
              </label>
              <label className="flex items-center gap-2 px-4 py-3 bg-primary border border-white/15 rounded-lg cursor-pointer transition has-[:checked]:border-accent has-[:checked]:bg-accent/10">
                <input type="radio" name="jobType" value="yacht" className="w-4 h-4 accent-accent" />
                <span className="text-white text-sm font-medium">Yacht Crew</span>
              </label>
            </div>
            <p className="text-white/40 text-xs mt-2">Pick the rank list below accordingly.</p>
          </div>

          {/* Rank */}
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
            <label htmlFor="rank" className="block text-white font-bold mb-3">
              Rank / Position <span className="text-accent">*</span>
            </label>
            <select id="rank" name="rank" required defaultValue="" style={inputStyle}
              className="w-full px-4 py-3 bg-primary border border-white/15 rounded-lg text-white focus:border-accent focus:outline-none appearance-none">
              <option value="" disabled>-- Select rank --</option>
              <optgroup label="Ship — Deck">
                {SHIP_RANKS["Deck Department"].map((r) => <option key={r} value={r}>{r}</option>)}
              </optgroup>
              <optgroup label="Ship — Engine">
                {SHIP_RANKS["Engine Department"].map((r) => <option key={r} value={r}>{r}</option>)}
              </optgroup>
              <optgroup label="Ship — Catering">
                {SHIP_RANKS["Catering Department"].map((r) => <option key={r} value={r}>{r}</option>)}
              </optgroup>
              <optgroup label="Ship — Other">
                {SHIP_RANKS["Other"].map((r) => <option key={r} value={r}>{r}</option>)}
              </optgroup>
              <optgroup label="Yacht — Deck">
                {YACHT_POSITIONS["Deck"].map((r) => <option key={r} value={r}>{r}</option>)}
              </optgroup>
              <optgroup label="Yacht — Interior">
                {YACHT_POSITIONS["Interior"].map((r) => <option key={r} value={r}>{r}</option>)}
              </optgroup>
              <optgroup label="Yacht — Engineering">
                {YACHT_POSITIONS["Engineering"].map((r) => <option key={r} value={r}>{r}</option>)}
              </optgroup>
              <optgroup label="Yacht — Galley">
                {YACHT_POSITIONS["Galley"].map((r) => <option key={r} value={r}>{r}</option>)}
              </optgroup>
              <optgroup label="Yacht — Other">
                {YACHT_POSITIONS["Other"].map((r) => <option key={r} value={r}>{r}</option>)}
              </optgroup>
            </select>
          </div>

          {/* Title */}
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
            <label htmlFor="title" className="block text-white font-bold mb-3">
              Job Title <span className="text-accent">*</span>
            </label>
            <input id="title" name="title" required maxLength={120} placeholder="e.g. Chief Engineer for LNG Carrier"
              className="w-full px-4 py-3 bg-primary border border-white/15 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none" />
          </div>

          {/* Country + City */}
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <label htmlFor="country" className="block text-white font-bold mb-3">Country</label>
              <select id="country" name="country" defaultValue="" style={inputStyle}
                className="w-full px-4 py-3 bg-primary border border-white/15 rounded-lg text-white focus:border-accent focus:outline-none appearance-none">
                <option value="">-- Any / Not specified --</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="city" className="block text-white font-bold mb-3">City / Port (optional)</label>
              <input id="city" name="city" maxLength={80} placeholder="e.g. Rotterdam"
                className="w-full px-4 py-3 bg-primary border border-white/15 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none" />
            </div>
          </div>

          {/* Description */}
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
            <label htmlFor="description" className="block text-white font-bold mb-3">
              Description <span className="text-accent">*</span>
            </label>
            <textarea id="description" name="description" required rows={8}
              placeholder="Describe the role, vessel, requirements, rotation, and anything else candidates should know..."
              className="w-full px-4 py-3 bg-primary border border-white/15 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none resize-y" />
            <p className="text-white/40 text-xs mt-2">Write whatever you want candidates to know — requirements, conditions, certificates, rotation, etc.</p>
          </div>

          {/* Optional: salary + contract */}
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 space-y-4">
            <p className="text-white/60 text-sm font-bold uppercase tracking-wider">Optional details</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="salaryMin" className="block text-white/70 text-xs mb-1">Salary min</label>
                <input id="salaryMin" name="salaryMin" type="number" min="0" placeholder="e.g. 6000"
                  className="w-full px-3 py-2.5 bg-primary border border-white/15 rounded-lg text-white text-sm placeholder-white/30 focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label htmlFor="salaryMax" className="block text-white/70 text-xs mb-1">Salary max</label>
                <input id="salaryMax" name="salaryMax" type="number" min="0" placeholder="e.g. 8000"
                  className="w-full px-3 py-2.5 bg-primary border border-white/15 rounded-lg text-white text-sm placeholder-white/30 focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label htmlFor="salaryCurrency" className="block text-white/70 text-xs mb-1">Currency</label>
                <select id="salaryCurrency" name="salaryCurrency" defaultValue="USD"
                  className="w-full px-3 py-2.5 bg-primary border border-white/15 rounded-lg text-white text-sm focus:border-accent focus:outline-none">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="contractDuration" className="block text-white/70 text-xs mb-1">Contract duration</label>
              <input id="contractDuration" name="contractDuration" maxLength={60} placeholder="e.g. 4 months on / 2 months off"
                className="w-full px-3 py-2.5 bg-primary border border-white/15 rounded-lg text-white text-sm placeholder-white/30 focus:border-accent focus:outline-none" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link href="/jobs/mine" className="text-white/40 hover:text-white/60 text-sm transition">Cancel</Link>
            <button type="submit"
              className="px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition shadow-lg shadow-accent/20">
              Publish Job
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
