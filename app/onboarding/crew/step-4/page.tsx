import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { uploadCrewCV } from "@/lib/actions/profile";
import Link from "next/link";

export const metadata = {
  title: "Upload CV — ShipCrewFinder",
};

export default async function CrewStep4Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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
          Upload your CV
        </h1>
        <p className="text-white/60 text-lg">
          A verified CV helps employers trust your profile and increases your chances of getting hired.
        </p>
      </div>

      {/* Form */}
      <form action={uploadCrewCV} className="space-y-6">
        {/* Upload Area */}
        <div className="bg-primary-dark border-2 border-dashed border-white/15 hover:border-accent/50 rounded-2xl p-8 md:p-10 transition group">
          <label htmlFor="cv" className="block cursor-pointer text-center">
            {/* Upload Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 border border-accent/30 rounded-2xl mb-4 group-hover:bg-accent/20 transition">
              <svg
                className="w-8 h-8 text-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>

            <h3 className="font-display text-xl font-bold text-white mb-2">
              Drop your CV here, or click to browse
            </h3>
            <p className="text-white/60 text-sm mb-4">
              PDF format only · Maximum 5MB
            </p>

            <div className="inline-block px-5 py-2.5 bg-accent/15 border border-accent/30 rounded-lg text-accent font-bold text-sm hover:bg-accent/25 transition">
              Choose File
            </div>

            <input
              id="cv"
              name="cv"
              type="file"
              accept="application/pdf"
              className="sr-only"
            />
          </label>
        </div>

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
          Don't have a CV ready? You can{" "}
          <button
            type="submit"
            className="text-accent hover:text-accent-light font-bold underline underline-offset-2"
          >
            skip this step
          </button>{" "}
          and add it later.
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
