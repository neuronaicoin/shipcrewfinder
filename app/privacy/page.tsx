import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — ShipCrewFinder",
  description: "How ShipCrewFinder collects, uses, and protects your personal data.",
  alternates: { canonical: "https://shipcrewfinder.com/privacy" },
};

const updated = "June 2026";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-white/40 text-sm mb-10">Last updated: {updated}</p>

        <div className="space-y-8 text-white/75 text-sm md:text-base leading-relaxed">
          <section>
            <p>
              This Privacy Policy explains how ShipCrewFinder (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, and protects your personal data when you use our website and services (the &quot;Platform&quot;). By using ShipCrewFinder, you agree to the practices described here.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">1. Information we collect</h2>
            <p className="mb-2">We collect information you provide and information generated through your use of the Platform, including:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Account details such as your name, email address, and password.</li>
              <li>Profile information such as rank or position, experience, nationality, languages, availability, certificates, and CV (for crew), or company details (for companies).</li>
              <li>Usage data such as pages visited, searches, and interactions, collected through analytics tools.</li>
              <li>Technical data such as IP address, browser type, and device information.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">2. How we use your information</h2>
            <p className="mb-2">We use your information to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Create and manage your account and profile.</li>
              <li>Connect crew with companies and enable the core features of the Platform.</li>
              <li>Process subscriptions and payments through our payment provider.</li>
              <li>Improve, secure, and maintain the Platform.</li>
              <li>Communicate with you about your account and service updates.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">3. Profile visibility and control</h2>
            <p>
              You control how your profile is shown. Crew profiles can be public, private (stealth), or hidden. In stealth mode, your professional details may be visible to companies while your identity and contact information remain hidden until you choose to share them by accepting a connection request.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">4. Sharing your information</h2>
            <p>
              We do not sell your personal data. We share information only as needed to operate the Platform — for example, with service providers that host our infrastructure, process payments, or provide analytics. These providers are bound to protect your data. We may also disclose information if required by law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">5. Data retention</h2>
            <p>
              We keep your personal data for as long as your account is active or as needed to provide the Platform. You may request deletion of your account and associated data at any time, subject to legal obligations that may require us to retain certain information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">6. Your rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct, delete, or restrict the processing of your personal data, and to object to certain processing. You can exercise many of these directly through your account settings, or by contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">7. Security</h2>
            <p>
              We use reasonable technical and organizational measures to protect your data. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">8. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will revise the &quot;Last updated&quot; date above. Significant changes may be communicated through the Platform.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">9. Contact</h2>
            <p>
              For any questions about this Privacy Policy or your data, you can reach us through the Platform. A dedicated support email address is coming soon.
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 text-sm">
          <Link href="/terms" className="text-accent hover:text-accent-light font-bold transition">Terms of Service →</Link>
          <Link href="/cookies" className="text-accent hover:text-accent-light font-bold transition">Cookie Policy →</Link>
          <Link href="/gdpr" className="text-accent hover:text-accent-light font-bold transition">GDPR →</Link>
        </div>
      </div>
    </main>
  );
}
