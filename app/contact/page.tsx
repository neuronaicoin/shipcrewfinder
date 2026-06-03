import Link from "next/link";

export const metadata = {
  title: "Contact — ShipCrewFinder",
  description:
    "Get in touch with the ShipCrewFinder team. We're here to help seafarers, yacht crew, and maritime companies.",
  alternates: { canonical: "https://shipcrewfinder.com/contact" },
};

export default function ContactPage() {
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
          <span className="text-accent text-xs font-extrabold tracking-wider uppercase">Contact</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Get in touch
        </h1>

        <div className="space-y-5 text-white/75 text-base md:text-lg leading-relaxed mb-10">
          <p>
            Have a question, some feedback, or need help with your account? We are here for seafarers, yacht crew, and maritime companies alike.
          </p>
          <p>
            The fastest way to get support is from inside your account. Once you are signed in, you can reach us directly and we will get back to you as soon as we can.
          </p>
        </div>

        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="font-display text-xl font-bold text-white mb-4">How to reach us</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 bg-accent/15 border border-accent/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16v16H4z" /><path d="m4 4 8 8 8-8" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">Email support</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Our dedicated support email is coming soon. In the meantime, please reach out from within your account after signing in.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 bg-accent/15 border border-accent/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">In-app support</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Sign in to your dashboard to manage your profile and get help with anything you need.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary-dark border border-accent/20 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-3">
            New to ShipCrewFinder?
          </h2>
          <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
            Create a free account to get started — it only takes a minute.
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
