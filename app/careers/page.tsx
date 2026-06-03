import Link from "next/link";

export const metadata = {
  title: "Careers — ShipCrewFinder",
  description:
    "Interested in joining the team behind ShipCrewFinder? Learn about working with us as we build the future of maritime recruitment.",
  alternates: { canonical: "https://shipcrewfinder.com/careers" },
};

export default function CareersPage() {
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
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-white/70 hover:text-white text-sm font-medium transition">Login</Link>
            <Link href="/signup" className="px-4 py-2 bg-accent hover:bg-accent-dark text-primary font-bold text-sm rounded-lg transition shadow-lg shadow-accent/20">
              Sign Up Free
            </Link>
          </div>
        </div>
      </header>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="inline-block px-4 py-1.5 bg-accent/15 border border-accent/30 rounded-full mb-4">
          <span className="text-accent text-xs font-extrabold tracking-wider uppercase">Careers</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Work with us
        </h1>

        <div className="space-y-5 text-white/75 text-base md:text-lg leading-relaxed">
          <p>
            ShipCrewFinder is an early-stage, fast-growing platform on a mission to make maritime hiring direct, fair, and fast. We are a small team that moves quickly and cares deeply about the people who keep ships running.
          </p>
          <p>
            We do not have open positions listed right now, but we are always interested in connecting with talented people who share our vision — whether you come from the maritime world, software, design, growth, or operations.
          </p>
        </div>

        <div className="mt-10 bg-primary-dark border border-white/10 rounded-2xl p-6 md:p-8">
          <h2 className="font-display text-xl font-bold text-white mb-3">No open roles — for now</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-2">
            We are not actively hiring at the moment, but that changes as we grow. If you are excited about what we are building and think you could help, we would love to hear from you when the time is right.
          </p>
          <p className="text-white/60 text-sm leading-relaxed">
            Check back here for future openings, or follow our journey as the platform expands.
          </p>
        </div>

        <div className="mt-12 bg-primary-dark border border-accent/20 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-3">
            In the meantime
          </h2>
          <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
            The best way to support us is to join the platform and help build a better maritime industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup/crew" className="px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition shadow-lg shadow-accent/20">
              Join as Crew
            </Link>
            <Link href="/signup/company" className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg transition border border-white/10">
              Hire Crew
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
