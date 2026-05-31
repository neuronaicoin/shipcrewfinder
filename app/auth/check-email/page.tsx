import Link from "next/link";

export const metadata = {
  title: "Check Your Email — ShipCrewFinder",
  description: "Confirm your email to activate your ShipCrewFinder account.",
};

export default function CheckEmailPage() {
  return (
    <main className="min-h-screen bg-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 14 Q10 6, 20 14 T38 14" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
            <path d="M2 20 Q10 12, 20 20 T38 20" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <path d="M2 26 Q10 18, 20 26 T38 26" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="text-white font-display font-bold text-lg tracking-tight">
            Ship<span className="text-accent">Crew</span>Finder
          </span>
        </Link>

        {/* Email Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/15 border-2 border-accent/30 rounded-2xl mb-6">
          <svg className="w-10 h-10 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          Check your email
        </h1>
        <p className="text-white/70 text-lg mb-8 leading-relaxed">
          We've sent a confirmation link to your email address. Click the link to activate your account and complete your profile.
        </p>

        {/* Info Card */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 text-left space-y-4 mb-8">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-accent/15 border border-accent/30 rounded-full flex items-center justify-center text-accent text-xs font-bold mt-0.5">
              1
            </div>
            <p className="text-white/80 text-sm">
              <span className="font-bold text-white">Open your inbox</span> and find the email from ShipCrewFinder
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-accent/15 border border-accent/30 rounded-full flex items-center justify-center text-accent text-xs font-bold mt-0.5">
              2
            </div>
            <p className="text-white/80 text-sm">
              <span className="font-bold text-white">Click the confirmation link</span> in the email
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-accent/15 border border-accent/30 rounded-full flex items-center justify-center text-accent text-xs font-bold mt-0.5">
              3
            </div>
            <p className="text-white/80 text-sm">
              <span className="font-bold text-white">Complete your profile</span> to start receiving offers
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <p className="text-white/60 text-sm">
            <span className="font-bold text-white/80">Didn't receive the email?</span>
            <br />
            Check your spam folder or wait a few minutes — emails can take up to 5 minutes to arrive.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition shadow-lg shadow-accent/20"
          >
            I've confirmed — Log in
          </Link>
          <Link
            href="/"
            className="block text-white/60 hover:text-white text-sm transition"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
