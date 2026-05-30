export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-light to-primary-dark px-4">
      <div className="text-center max-w-2xl">
        <div className="inline-block mb-6 px-4 py-1.5 bg-accent/10 border border-accent/30 rounded-full">
          <span className="text-accent text-sm font-medium tracking-wide">
            COMING SOON
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Ship<span className="text-accent">Crew</span>Finder
        </h1>

        <p className="text-xl md:text-2xl text-white/80 mb-4 font-light">
          The Global Maritime Career Platform
        </p>

        <p className="text-base md:text-lg text-white/60 mb-12 max-w-xl mx-auto leading-relaxed">
          Connecting seafarers and yacht crew with leading maritime companies
          worldwide. Verified profiles. Direct contact. No middlemen.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-white/80 text-sm">
              <span className="text-accent font-semibold">For Seafarers:</span>{" "}
              Build your verified profile
            </p>
          </div>

          <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-white/80 text-sm">
              <span className="text-accent font-semibold">For Companies:</span>{" "}
              Find verified maritime talent
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm">
            Launching 2026 · Built by maritime professionals
          </p>
        </div>
      </div>
    </main>
  );
}
