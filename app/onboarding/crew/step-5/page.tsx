import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { completeCrewOnboarding } from "@/lib/actions/profile";
import Link from "next/link";

export const metadata = {
  title: "Availability — ShipCrewFinder",
};

export default async function CrewStep5Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const availabilityOptions = [
    {
      value: "0-1",
      title: "Available Soon",
      subtitle: "Within 1 month",
      description: "Ready to start a new contract",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      value: "1-3",
      title: "Soon",
      subtitle: "1-3 months",
      description: "Finishing current commitments",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      value: "3+",
      title: "Later",
      subtitle: "3+ months",
      description: "Open to opportunities for the future",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm font-bold">Step 5 of 5 — Final!</span>
          <span className="text-accent text-sm font-bold">100% complete</span>
        </div>
        <div className="h-2 bg-primary-dark border border-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: "100%" }} />
        </div>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
          When can you start?
        </h1>
        <p className="text-white/60 text-lg">
          Almost done! Set your availability and contact preferences.
        </p>
      </div>

      {/* Form */}
      <form action={completeCrewOnboarding} className="space-y-6">
        {/* Availability */}
        <div>
          <label className="block text-white font-bold mb-3">
            Availability <span className="text-accent">*</span>
          </label>
          <div className="space-y-3">
            {availabilityOptions.map((option) => (
              <label key={option.value} className="block cursor-pointer group">
                <input
                  type="radio"
                  name="availability"
                  value={option.value}
                  required
                  className="peer sr-only"
                />
                <div className="bg-primary-dark border-2 border-white/10 hover:border-white/20 peer-checked:border-accent peer-checked:bg-accent/5 rounded-2xl p-5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center text-accent">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 mb-1">
                        <h3 className="font-display text-lg font-bold text-white">
                          {option.title}
                        </h3>
                        <span className="text-accent font-bold text-xs">
                          {option.subtitle}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm">{option.description}</p>
                    </div>
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-white/30 peer-checked:border-accent peer-checked:bg-accent flex items-center justify-center">
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
        </div>

        {/* Contact Info */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-white font-bold mb-2">Contact Information</h3>
            <p className="text-white/50 text-sm">
              Companies will see this when they unlock your profile. WhatsApp makes communication faster.
            </p>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-white/70 text-xs font-bold uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+90 555 123 4567"
              className="w-full px-4 py-3 bg-primary border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
            />
            <p className="text-white/40 text-xs mt-1.5">
              Include country code (e.g. +90 for Turkey, +63 for Philippines)
            </p>
          </div>

          {/* WhatsApp */}
          <div>
            <label htmlFor="whatsapp" className="block text-white/70 text-xs font-bold uppercase tracking-wider mb-2">
              WhatsApp Number{" "}
              <span className="text-white/40 normal-case font-normal">(optional)</span>
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              placeholder="Leave empty if same as phone"
              className="w-full px-4 py-3 bg-primary border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
            />
            <p className="text-white/40 text-xs mt-1.5">
              Most maritime professionals prefer WhatsApp for quick communication
            </p>
          </div>
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
              <h4 className="text-emerald-400 font-extrabold text-sm mb-1">Almost there!</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                After this step, your profile becomes <strong className="text-white">public</strong> and discoverable by verified maritime companies worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/onboarding/crew/step-4"
            className="text-white/40 hover:text-white/60 text-sm transition"
          >
            ← Back
          </Link>
          <button
            type="submit"
            className="px-8 py-3 bg-accent hover:bg-accent-dark text-primary font-extrabold rounded-lg transition shadow-lg shadow-accent/30"
          >
            Complete Profile 🎉
          </button>
        </div>
      </form>
    </div>
  );
}
