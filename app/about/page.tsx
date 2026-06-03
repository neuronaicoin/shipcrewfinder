import Link from "next/link";

export const metadata = {
  title: "About — ShipCrewFinder",
  description:
    "ShipCrewFinder is a global maritime career platform built by maritime professionals to connect verified seafarers and yacht crew directly with companies.",
  alternates: { canonical: "https://shipcrewfinder.com/about" },
};

export default function AboutPage() {
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
          <span className="text-accent text-xs font-extrabold tracking-wider uppercase">About Us</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Built by maritime professionals
        </h1>

        <div className="space-y-5 text-white/75 text-base md:text-lg leading-relaxed">
          <p>
            ShipCrewFinder is a global maritime career platform connecting verified seafarers and yacht crew directly with the companies that need them — without agencies, middlemen, or commission cuts.
          </p>
          <p>
            We started ShipCrewFinder because we have lived the problem. We have worked on ships, sailed long contracts, waited on slow agencies, and watched good crew lose opportunities to outdated processes. We know how the industry actually works, and we knew it could work better.
          </p>
          <p>
            The idea is simple: give crew a verified profile they control, give companies a fast and direct way to find the right people, and remove everything in between. No commission taken from your salary. No third party deciding who gets seen. Just direct, transparent connections.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-10">
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
            <h2 className="font-display text-lg font-bold text-white mb-2">Our mission</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              To make maritime hiring direct, fair, and fast — for both crew and companies, anywhere in the world.
            </p>
          </div>
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
            <h2 className="font-display text-lg font-bold text-white mb-2">What we value</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Verified profiles, privacy by default, and zero commission. Trust is the foundation of everything we build.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-primary-dark border border-accent/20 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-3">
            Join the platform
          </h2>
          <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
            Whether you are looking for your next contract or hiring crew for your fleet, ShipCrewFinder is built for you.
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
