import Link from "next/link";

export const metadata = {
  title: "Terms of Service — ShipCrewFinder",
  description: "The terms and conditions for using the ShipCrewFinder platform.",
  alternates: { canonical: "https://shipcrewfinder.com/terms" },
};

const updated = "June 2026";

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-white/40 text-sm mb-10">Last updated: {updated}</p>

        <div className="space-y-8 text-white/75 text-sm md:text-base leading-relaxed">
          <section>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of the ShipCrewFinder platform (the &quot;Platform&quot;). By creating an account or using the Platform, you agree to these Terms. If you do not agree, please do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">1. Eligibility and accounts</h2>
            <p>
              You must be at least 18 years old to use the Platform. You are responsible for the accuracy of the information you provide and for keeping your account credentials secure. You are responsible for all activity that occurs under your account.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">2. The service</h2>
            <p>
              ShipCrewFinder is a platform that connects seafarers and yacht crew with maritime companies. We provide the tools for crew to build profiles and for companies to search, post jobs, and contact crew. We do not act as an employer, recruitment agency, or party to any employment relationship formed between users.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">3. User responsibilities</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Provide false, misleading, or fraudulent information, including fake credentials or certificates.</li>
              <li>Use the Platform for any unlawful purpose or to harass, abuse, or harm others.</li>
              <li>Attempt to access accounts, data, or systems you are not authorized to access.</li>
              <li>Scrape, copy, or misuse data or content from the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">4. Subscriptions and payments</h2>
            <p>
              Certain features require a paid subscription. Prices and plan details are shown on the Platform. Payments are processed by our third-party payment provider. Subscriptions renew according to the plan you choose, and you may cancel at any time; cancellation stops future charges but does not retroactively refund the current period unless required by law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">5. Verification</h2>
            <p>
              We may offer profile or document verification features. While we aim to support trust on the Platform, we do not guarantee the accuracy of any user&apos;s information or credentials. Users are responsible for conducting their own due diligence before entering into any agreement.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">6. Content and intellectual property</h2>
            <p>
              You retain ownership of the content you submit, but you grant us a license to host and display it as needed to operate the Platform. The Platform itself, including its design, code, and branding, is owned by ShipCrewFinder and may not be copied or reused without permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">7. Disclaimers</h2>
            <p>
              The Platform is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that you will find employment or suitable crew, that the Platform will be uninterrupted or error-free, or that any user&apos;s information is accurate.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">8. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, ShipCrewFinder shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform, including any employment relationship or dispute between users.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">9. Termination</h2>
            <p>
              We may suspend or terminate your account if you violate these Terms or misuse the Platform. You may close your account at any time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">10. Changes to these Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the Platform after changes take effect constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-white mb-3">11. Contact</h2>
            <p>
              For questions about these Terms, you can reach us through the Platform. A dedicated support email address is coming soon.
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 text-sm">
          <Link href="/privacy" className="text-accent hover:text-accent-light font-bold transition">Privacy Policy →</Link>
          <Link href="/cookies" className="text-accent hover:text-accent-light font-bold transition">Cookie Policy →</Link>
          <Link href="/gdpr" className="text-accent hover:text-accent-light font-bold transition">GDPR →</Link>
        </div>
      </div>
    </main>
  );
}
