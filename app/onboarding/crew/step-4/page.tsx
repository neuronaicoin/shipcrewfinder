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

  const savedCvUrl = (details?.cv_url as string) || "";
  const hasCv = savedCvUrl.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm font-bold">Step 4 of 5</span>
          <span className="text-white/60 text-sm">80% complete</span>
        </div>
        <div className="h-2 bg-primary-dark border border-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: "80%" }} />
        </div>
      </div>

      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
          {hasCv ? "Your CV" : "Upload your CV"}
        </h1>
        <p className="text-white/60 text-lg">
          {hasCv
            ? "You already have a CV on file. Upload a new one to replace it, or continue."
            : "A verified CV helps employers trust your profile and increases your chances of getting hired."}
        </p>
      </div>

      {hasCv ? (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 mb-6">
          <div className="text-white font-bold text-sm mb-1">CV on file ✓</div>
          <div className="text-white/50 text-xs mb-3">Uploading a new file below will replace your current CV.</div>
          <a href={savedCvUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-light text-sm font-bold underline underline-offset-2">View current CV</a>
        </div>
      ) : null}

      <form action={uploadCrewCV} className="space-y-6">
        <CVUpload />

        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
          <h4 className="text-accent font-extrabold text-xs uppercase tracking-wider mb-3">
            Why upload your CV?
          </h4>
          <ul className="space-y-2 text-white/70 text-sm">
            <li>✓ Get a verified badge that companies trust</li>
            <li>✓ Stand out from unverified profiles</li>
            <li>✓ Save time — share your full work history instantly</li>
          </ul>
        </div>

        <p className="text-center text-white/40 text-sm">
          {hasCv ? "Keeping your current CV? You can " : "Don't have a CV ready? You can "}
          <button type="submit" className="text-accent hover:text-accent-light font-bold underline underline-offset-2">
            {hasCv ? "continue without changes" : "skip this step"}
          </button>
          {hasCv ? "." : " and add it later."}
        </p>

        <div className="flex items-center justify-between pt-2">
          <Link href="/onboarding/crew/step-3" className="text-white/40 hover:text-white/60 text-sm transition">
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
