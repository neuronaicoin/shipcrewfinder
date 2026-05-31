import Link from "next/link";

export const metadata = {
  title: "Sign Up — ShipCrewFinder",
  description: "Create your free ShipCrewFinder account. Join as crew or as a company.",
};

export default function SignupChoicePage() {
  return (
    <main className="min-h-screen bg-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background gradient + grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-4xl">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-10">
          <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 14 Q10 6, 20 14 T38 14" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
            <path d="M2 20 Q10 12, 20 20 T38 20" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <path d="M2 26 Q10 18, 20 26 T38 26" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="text-white font-display font-bold text-lg tracking-tight">
            Ship<span className="text-accent">Crew</span>Finder
          </span>
        </Link>

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            How will you use<br />ShipCrewFinder?
          </h1>
          <p className="text-white/60 text-lg">
            Choose your account type to get started
          </p>
        </div>

        {/* 2 Big Choices */}
        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* Crew */}
          <Link
            href="/signup/crew"
            className="group relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] hover:from-white/[0.08] hover:to-white/[0.04] border-2 border-white/15 hover:border-accent/60 rounded-3xl p-8 md:p-10 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/15 group-hover:to-transparent transition-all duration-500" />
            <div className="relative">
              <div className="inline-block px-4 py-1.5 bg-accent/15 border border-accent/30 rounded-full mb-5">
                <span className="text-accent text-xs uppercase tracking-wider font-extrabold">For Crew</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight leading-tight">
                I'm Looking<br />for Work
              </h2>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                Seafarer or yacht crew? Build a verified profile and get contacted directly.
              </p>
              <div className="flex items-center gap-2 text-accent font-bold text-sm">
                Continue as Crew
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Company */}
          <Link
            href="/signup/company"
            className="group relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] hover:from-white/[0.08] hover:to-white/[0.04] border-2 border-white/15 hover:border-accent/60 rounded-3xl p-8 md:p-10 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/15 group-hover:to-transparent transition-all duration-500" />
            <div className="relative">
              <div className="inline-block px-4 py-1.5 bg-accent/15 border border-accent/30 rounded-full mb-5">
                <span className="text-accent text-xs uppercase tracking-wider font-extrabold">For Companies</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight leading-tight">
                We Are<br />Hiring
              </h2>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                Find verified maritime talent worldwide. Browse profiles or post job openings.
              </p>
              <div className="flex items-center gap-2 text-accent font-bold text-sm">
                Continue as Company
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Already have account */}
        <p className="text-center text-white/60 text-sm mt-10">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:text-accent-light font-bold transition">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
