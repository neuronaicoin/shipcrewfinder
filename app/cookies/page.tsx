import Link from "next/link";

export const metadata = {
  title: "Cookie Policy — ShipCrewFinder",
  description: "How ShipCrewFinder uses cookies and similar technologies.",
  alternates: { canonical: "https://shipcrewfinder.com/cookies" },
};

const updated = "June 2026";

export default function CookiesPage() {
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
          <Link href="/" className="text-white/70 hover:text-white text-sm font-medium transition">Home</Link>
        </div>
      </header>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
          Cookie Policy
        </h1>
        <p className="text-white/40 text-sm mb-10">Last updated: {updated}</p>

        <div className="space-y-8 text-white/75 text-sm md:text-base leading-relaxed">
          <section>
            <p>
              This Cookie Policy explains how ShipCrewFinder uses cookies and similar technologies when you visit our Platform. It should be read together with our <Link href="/privacy" className="text-accent hover:text-accent-light underline underline-offset-2">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">1. What are cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help the site function properly, remember your preferences, and understand how the site is used.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">2. Types of cookies we use</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><span className="text-white font-bold">Essential cookies</span> — required for the Platform to work, including keeping you signed in and securing your session. These cannot be turned off.</li>
              <li><span className="text-white font-bold">Analytics cookies</span> — help us understand how visitors use the Platform so we can improve it. We use analytics tools such as Google Analytics for this purpose.</li>
              <li><span className="text-white font-bold">Preference cookies</span> — remember choices you make to give you a better experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">3. Third-party cookies</h2>
            <p>
              Some cookies are set by third-party services we use, such as our analytics provider and our payment processor. These providers have their own privacy and cookie policies governing how they handle data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">4. Managing cookies</h2>
            <p>
              Most browsers let you control cookies through their settings — you can block or delete them. Please note that disabling essential cookies may affect how the Platform works, including your ability to sign in.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">5. Changes to this policy</h2>
            <p>
              We may update this Cookie Policy from time to time. The &quot;Last updated&quot; date above reflects the latest revision.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">6. Contact</h2>
            <p>
              If you have questions about our use of cookies, you can reach us through the Platform. A dedicated support email address is coming soon.
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 text-sm">
          <Link href="/privacy" className="text-accent hover:text-accent-light font-bold transition">Privacy Policy →</Link>
          <Link href="/terms" className="text-accent hover:text-accent-light font-bold transition">Terms of Service →</Link>
          <Link href="/gdpr" className="text-accent hover:text-accent-light font-bold transition">GDPR →</Link>
        </div>
      </div>
    </main>
  );
}
