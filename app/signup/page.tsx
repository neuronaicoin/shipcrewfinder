import Link from "next/link";

export const metadata = {
  title: "Sign Up — ShipCrewFinder",
  description: "Create your free ShipCrewFinder account. Join as crew or as a company.",
};

const anchorSvg = (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#0b0e13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2.4" />
    <line x1="12" y1="7.4" x2="12" y2="20.5" />
    <line x1="7.5" y1="10.4" x2="16.5" y2="10.4" />
    <path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7" />
    <path d="M4.5 14.8l-1.6-1.2M4.5 14.8l2-.4" />
    <path d="M19.5 14.8l1.6-1.2M19.5 14.8l-2-.4" />
  </svg>
);

export default function SignupChoicePage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "#0d1030" }}
    >
      {/* Aurora background */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 560, height: 560, top: -180, right: -80, borderRadius: "50%",
          filter: "blur(90px)", opacity: 0.5,
          background: "radial-gradient(circle, rgba(251,191,36,.28), transparent 65%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 480, height: 480, bottom: -200, left: -120, borderRadius: "50%",
          filter: "blur(90px)", opacity: 0.4,
          background: "radial-gradient(circle, rgba(37,99,235,.33), transparent 65%)",
        }}
      />

      <div className="relative w-full max-w-4xl">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-10">
          <span
            className="grid place-items-center"
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(145deg,#fbbf24,#e0a010)",
            }}
          >
            {anchorSvg}
          </span>
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
            className="group relative overflow-hidden border-2 border-white/15 hover:border-accent/60 rounded-3xl p-8 md:p-10 transition-all duration-300"
            style={{ background: "linear-gradient(165deg,#141845,#050716)" }}
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
            className="group relative overflow-hidden border-2 border-white/15 hover:border-accent/60 rounded-3xl p-8 md:p-10 transition-all duration-300"
            style={{ background: "linear-gradient(165deg,#141845,#050716)" }}
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

        {/* Back */}
        <p className="text-center mt-4">
          <Link href="/" className="text-white/40 hover:text-white/60 text-sm transition">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </main>
  );
}
