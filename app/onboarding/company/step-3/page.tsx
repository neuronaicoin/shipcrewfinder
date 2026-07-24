import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { completeCompanyOnboarding } from "@/lib/actions/profile";
import Link from "next/link";

export const metadata = {
  title: "Finish Profile — ShipCrewFinder",
};

export default async function CompanyStep3Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Mevcut değerleri çek — edit modunda dolu göster
  const { data: profile } = await supabase
    .from("profiles")
    .select("phone")
    .eq("id", user.id)
    .single();

  const { data: details } = await supabase
    .from("company_details")
    .select("description, contact_phone")
    .eq("id", user.id)
    .maybeSingle();

  const savedDescription = (details?.description as string) || "";
  const savedPhone =
    (details?.contact_phone as string) || (profile?.phone as string) || "";
  const isEditing = !!(savedDescription || savedPhone);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm font-bold">Step 3 of 3 — Final!</span>
          <span className="text-accent text-sm font-bold">100% complete</span>
        </div>
        <div className="h-2 bg-primary-dark border border-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: "100%" }} />
        </div>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
          Finish your company profile
        </h1>
        <p className="text-white/60 text-lg">
          {isEditing
            ? "Your saved details are filled in — update them or save to finish."
            : "Add the finishing touches to attract top maritime talent."}
        </p>
      </div>

      {/* Form */}
      <form action={completeCompanyOnboarding} className="space-y-5">
        {/* Description */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
          <label htmlFor="description" className="block text-white font-bold mb-3">
            About Your Company <span className="text-white/40 text-sm font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            maxLength={500}
            defaultValue={savedDescription}
            placeholder="Briefly describe your company, fleet, areas of operation, what makes you a great employer..."
            className="w-full px-4 py-3 bg-primary border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition resize-none"
          />
          <p className="text-white/40 text-xs mt-2">Max 500 characters · Candidates will see this on your profile</p>
        </div>

        {/* Contact Phone */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
          <label htmlFor="contactPhone" className="block text-white font-bold mb-3">
            Contact Phone <span className="text-white/40 text-sm font-normal">(optional)</span>
          </label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            defaultValue={savedPhone}
            placeholder="+90 555 123 4567"
            className="w-full px-4 py-3 bg-primary border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
          />
          <p className="text-white/40 text-xs mt-2">
            Include country code (e.g. +90 for Turkey, +44 for UK)
          </p>
        </div>

        {/* Success preview */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/15 border border-emerald-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-emerald-400 font-extrabold text-sm mb-1">
                {isEditing ? "Saving updates your live profile" : "Ready to launch!"}
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">
                {isEditing ? (
                  <>Completing this step saves your changes — your company profile stays <strong className="text-white">public</strong> and visible to crew.</>
                ) : (
                  <>Your company profile will become <strong className="text-white">public</strong> and your <strong className="text-white">first month is completely free</strong> — full access to search and contact verified crew.</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/onboarding/company/step-2"
            className="text-white/40 hover:text-white/60 text-sm transition"
          >
            ← Back
          </Link>
          <button
            type="submit"
            className="px-8 py-3 bg-accent hover:bg-accent-dark text-primary font-extrabold rounded-lg transition shadow-lg shadow-accent/30"
          >
            {isEditing ? "Save Changes ✓" : "Complete Profile 🎉"}
          </button>
        </div>
      </form>
    </div>
  );
}
