import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { uploadCrewCV } from "@/lib/actions/profile";
import Link from "next/link";
import CVUpload from "./cv-upload";

export const metadata = {
  title: "Upload CV — ShipCrewFinder",
};

export default async function CrewStep4Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Mevcut CV kontrolü — edit modunda göster
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  const isShip = profile?.user_type === "seafarer";
  const detailsTable = isShip ? "seafarer_details" : "yacht_details";
  const { data: details } = await supabase
    .from(detailsTable)
    .select("cv_url")
    .eq("id", user.id)
    .maybeSingle();

  const savedCvUrl = (details?.cv_url as string) || null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm font-bold">Step 4 of 5</span>
          <span className="text-white/60 text-sm">80% complete</span>
        </div>
        <div className="h-2 bg-primary-dark border border-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: "80%" }} />
        </div>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
          {savedCvUrl ? "Your CV" : "Upload your CV"}
        </h1>
        <p className="text-white/60 text-lg">
          {savedCvUrl
            ? "You already have a CV on file. Upload a new one to replace it, or continue."
            : "A verified CV helps employers trust your profile and increases your chances of getting hired."}
        </p>
      </div>

      {/* Existing CV notice */}
      {savedCvUrl && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/15 border border-emerald-500/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-white font-bold text-sm">CV on file ✓</div>
                <div className="text-white/50 text-xs">Uploading a new file will replace it</div>
              </div>
            </div>
            
              href={savedCvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-light text-sm font-bold underline underline-offset-2"
            >
              View current CV →
            </a>
          </div>
        </div>
      )}

      {/* Form */}
      <form action={uploadCrewCV} className="space-y-6">
        {/* Upload Area (client component) */}
        <CVUpload />

        {/* Why CV? */}
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
          <h4 className="text-accent font-extrabold text-xs uppercase tracking-wider mb-3">
            Why upload your CV?
          </h4>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Get a verified badge that companies trust</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Stand out from unverified profiles</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Save time — share your full work history instantly</span>
            </li>
          </ul>
        </div>

        {/* Skip option */}
        <p className="text-center text-white/40 text-sm">
          {savedCvUrl ? "Keeping your current CV? You can" : "Don't have a CV ready? You can"}{" "}
          <button
            type="submit"
            className="text-accent hover:text-accent-light font-bold underline underline-offset-2"
          >
            {savedCvUrl ? "continue without changes" : "skip this step"}
          </button>{" "}
          {savedCvUrl ? "." : "and add it later."}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/onboarding/crew/step-3"
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
