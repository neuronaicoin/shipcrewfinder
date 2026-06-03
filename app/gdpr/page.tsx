import Link from "next/link";

export const metadata = {
  title: "GDPR — ShipCrewFinder",
  description: "How ShipCrewFinder complies with the General Data Protection Regulation (GDPR) and your data rights.",
  alternates: { canonical: "https://shipcrewfinder.com/gdpr" },
};

const updated = "June 2026";

export default function GdprPage() {
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
          GDPR Compliance
        </h1>
        <p className="text-white/40 text-sm mb-10">Last updated: {updated}</p>

        <div className="space-y-8 text-white/75 text-sm md:text-base leading-relaxed">
          <section>
            <p>
              ShipCrewFinder respects the data protection rights of users in the European Economic Area (EEA) and the United Kingdom under the General Data Protection Regulation (GDPR) and equivalent laws. This page summarizes how we handle your personal data and the rights you have. It complements our <Link href="/privacy" className="text-accent hover:text-accent-light underline underline-offset-2">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">1. Legal bases for processing</h2>
            <p className="mb-2">We process your personal data on the following legal bases:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><span className="text-white font-bold">Contract</span> — to provide the Platform and the services you sign up for.</li>
              <li><span className="text-white font-bold">Legitimate interests</span> — to operate, secure, and improve the Platform.</li>
              <li><span className="text-white font-bold">Consent</span> — where required, for example for certain analytics or communications.</li>
              <li><span className="text-white font-bold">Legal obligation</span> — where we must process data to comply with the law.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">2. Your rights under GDPR</h2>
            <p className="mb-2">If you are in the EEA or UK, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request deletion of your data (&quot;right to be forgotten&quot;).</li>
              <li>Restrict or object to certain processing.</li>
              <li>Request a copy of your data in a portable format (data portability).</li>
              <li>Withdraw consent at any time, where processing is based on consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">3. Exercising your rights</h2>
            <p>
              You can exercise many of these rights directly through your account — for example, by editing your profile or requesting account deletion. For other requests, you can contact us through the Platform. We will respond within the timeframes required by law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">4. International data transfers</h2>
            <p>
              We use service providers that may process data outside your country. Where data is transferred internationally, we rely on appropriate safeguards, such as standard contractual clauses, to protect it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">5. Data retention</h2>
            <p>
              We retain personal data only as long as necessary to provide the Platform and meet legal obligations. When data is no longer needed, we delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">6. Complaints</h2>
            <p>
              If you believe we have not handled your personal data properly, you have the right to lodge a complaint with your local data protection authority. We would also appreciate the chance to address your concerns directly first.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">7. Contact</h2>
            <p>
              For any data protection requests or questions, you can reach us through the Platform. A dedicated support email address is coming soon.
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 text-sm">
          <Link href="/privacy" className="text-accent hover:text-accent-light font-bold transition">Privacy Policy →</Link>
          <Link href="/terms" className="text-accent hover:text-accent-light font-bold transition">Terms of Service →</Link>
          <Link href="/cookies" className="text-accent hover:text-accent-light font-bold transition">Cookie Policy →</Link>
        </div>
      </div>
    </main>
  );
}
