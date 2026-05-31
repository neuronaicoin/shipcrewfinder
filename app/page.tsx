import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* ========================================
          HEADER (Sticky Navigation)
      ======================================== */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-primary/85 border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2 14 Q10 6, 20 14 T38 14" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
              <path d="M2 20 Q10 12, 20 20 T38 20" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              <path d="M2 26 Q10 18, 20 26 T38 26" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-white font-bold text-lg tracking-tight">
              Ship<span className="text-accent">Crew</span>Finder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/for-crew" className="text-white/70 hover:text-white text-sm font-medium transition">For Crew</Link>
            <Link href="/for-companies" className="text-white/70 hover:text-white text-sm font-medium transition">For Companies</Link>
            <Link href="/pricing" className="text-white/70 hover:text-white text-sm font-medium transition">Pricing</Link>
            <Link href="/blog" className="text-white/70 hover:text-white text-sm font-medium transition">Blog</Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-white/70 hover:text-white text-sm font-medium transition">
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-accent hover:bg-accent-dark text-primary font-semibold text-sm rounded-lg transition shadow-lg shadow-accent/20"
            >
              Sign Up Free
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* ========================================
            HERO SECTION
        ======================================== */}
        <section className="relative overflow-hidden">
          {/* Background image (desktop only for performance) */}
          <div className="absolute inset-0 hidden md:block">
            <Image
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&q=70&auto=format&fm=webp"
              alt=""
              fill
              className="object-cover opacity-15"
              priority
              sizes="100vw"
            />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark md:bg-gradient-to-br md:from-primary/95 md:via-primary/85 md:to-primary-dark/95" />

          {/* Decorative grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/30 rounded-full mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-accent text-xs font-semibold tracking-wider uppercase">Verified Maritime Platform</span>
            </div>

            {/* H1 - SEO critical */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight max-w-5xl leading-[1.05]">
              The Global<br />
              <span className="text-accent">Maritime Career</span><br />
              Platform
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed">
              Verified profiles. Direct contact. No middlemen. Connect seafarers and yacht crew with leading maritime companies worldwide.
            </p>

            {/* 2 CTA Cards (Main entry points) */}
            <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-3xl">
              {/* Crew CTA */}
              <Link
                href="/signup/crew"
                className="group relative overflow-hidden bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-accent/40 rounded-2xl p-6 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/10 group-hover:to-transparent transition-all duration-500" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-accent/15 border border-accent/20 rounded-lg flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-accent" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="5" r="2.5" />
                        <path d="M12 7.5v13M6 13h12M6 13c0 4 3 7 6 7s6-3 6-7" />
                      </svg>
                    </div>
                    <span className="text-white/50 text-xs uppercase tracking-wider font-bold">For Crew</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">I'm Looking for Work</h2>
                  <p className="text-white/60 text-sm mb-4 leading-relaxed">Seafarer or yacht crew? Build a verified profile and get contacted directly by employers.</p>
                  <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                    Get started
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Company CTA */}
              <Link
                href="/signup/company"
                className="group relative overflow-hidden bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-accent/40 rounded-2xl p-6 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/10 group-hover:to-transparent transition-all duration-500" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-accent/15 border border-accent/20 rounded-lg flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-accent" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
                      </svg>
                    </div>
                    <span className="text-white/50 text-xs uppercase tracking-wider font-bold">For Companies</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">I'm Hiring</h2>
                  <p className="text-white/60 text-sm mb-4 leading-relaxed">Find verified maritime talent worldwide. Browse profiles or post job openings directly.</p>
                  <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                    Get started
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Trust signals row */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-white/50 text-sm">
              {["Free 7-day trial", "No credit card required", "Cancel anytime"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================
            TRUST BAR (Stats)
        ======================================== */}
        <section className="bg-primary-darker border-y border-white/10 py-12 md:py-14" aria-label="Platform statistics">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "2.25M+", label: "Maritime workers worldwide" },
                { value: "100+", label: "Countries covered" },
                { value: "50K+", label: "Active vessels globally" },
                { value: "24/7", label: "Verified support" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent mb-1 tracking-tight">{stat.value}</div>
                  <div className="text-white/60 text-xs md:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================
            HOW IT WORKS (3 Steps)
        ======================================== */}
        <section className="py-20 md:py-28 bg-primary" aria-labelledby="how-it-works-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <div className="text-accent text-sm font-bold tracking-wider uppercase mb-3">How it works</div>
              <h2 id="how-it-works-title" className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                Three steps to your<br />next opportunity
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">From signup to your next contract, the process is simple and transparent.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                { num: "01", title: "Sign up free", text: "Create your account in 60 seconds. No credit card required. Premium features free for 7 days." },
                { num: "02", title: "Build verified profile", text: "Upload your CV and certificates. AI verification gives you a trusted badge that employers value." },
                { num: "03", title: "Get hired directly", text: "Companies contact you directly. No agencies. No commission. Negotiate your contract face-to-face." },
              ].map((step) => (
                <div key={step.num} className="relative">
                  <div className="text-6xl md:text-7xl font-bold text-accent/15 mb-4 tracking-tighter">{step.num}</div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================
            FOR CREW SECTION
        ======================================== */}
        <section className="py-20 md:py-28 bg-primary-dark relative overflow-hidden" aria-labelledby="for-crew-title">
          {/* Subtle accent glow */}
          <div className="absolute top-1/2 -left-32 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <div className="text-accent text-sm font-bold tracking-wider uppercase mb-3">For Crew</div>
                <h2 id="for-crew-title" className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                  Take control of your<br />maritime career
                </h2>
                <p className="text-white/70 text-lg mb-10 leading-relaxed">
                  Whether you're a Master Mariner, AB, ETO, Chief Stewardess on a luxury yacht, or starting your maritime journey — ShipCrewFinder gives you the tools to be found by the right companies.
                </p>

                <div className="space-y-5">
                  {[
                    { title: "Verified Member Badge", text: "CV and certificates checked. Stand out from unverified profiles instantly." },
                    { title: "Stealth Mode", text: "Hide your profile from your current employer. Search for jobs without risk." },
                    { title: "Direct Contact", text: "Companies reach out to you. No middlemen, no commission cuts." },
                    { title: "Profile Analytics", text: "See which companies viewed your profile, when, and from where." },
                  ].map((feature, i) => (
                    <div key={feature.title} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-accent/15 border border-accent/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-accent" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                        <p className="text-white/60 text-sm leading-relaxed">{feature.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/signup/crew"
                  className="inline-flex items-center gap-2 mt-10 px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-semibold rounded-lg transition shadow-lg shadow-accent/20"
                >
                  Join as Crew — Free Trial
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" />
                  </svg>
                </Link>
              </div>

              {/* Pricing card */}
              <div className="relative lg:sticky lg:top-24">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/30 via-accent/0 to-accent/0 rounded-2xl blur-xl" />
                <div className="relative bg-primary border border-white/10 rounded-2xl p-8 lg:p-10">
                  <div className="inline-block px-3 py-1 bg-accent/15 border border-accent/30 rounded-full text-accent text-xs font-bold tracking-wide mb-6">
                    CREW PLAN
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl md:text-6xl font-bold text-white tracking-tight">$9.90</span>
                    <span className="text-white/60">/ month</span>
                  </div>
                  <p className="text-white/60 text-sm mb-8">Free 7-day trial · Cancel anytime</p>

                  <ul className="space-y-3 mb-8">
                    {[
                      "Verified profile badge",
                      "Stealth mode (hide from employer)",
                      "Profile analytics & insights",
                      "Block specific companies",
                      "Direct messaging with employers",
                      "Priority placement in search",
                    ].map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-white/80">
                        <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/signup/crew"
                    className="block text-center px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-semibold rounded-lg transition"
                  >
                    Start Free Trial
                  </Link>

                  <p className="text-center text-white/40 text-xs mt-4">Cancel anytime. No questions asked.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
            FOR COMPANIES SECTION
        ======================================== */}
        <section className="py-20 md:py-28 bg-primary relative overflow-hidden" aria-labelledby="for-companies-title">
          {/* Subtle accent glow */}
          <div className="absolute top-1/2 -right-32 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-accent text-sm font-bold tracking-wider uppercase mb-3">For Companies</div>
              <h2 id="for-companies-title" className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                Find verified maritime talent
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Browse verified profiles, post job openings, and contact candidates directly. Start with 3 free profile views.
              </p>
            </div>

            {/* 3 Pricing Tiers */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Starter */}
              <div className="relative bg-primary-dark border border-white/10 rounded-2xl p-8 hover:border-white/20 transition">
                <div className="text-white/50 text-xs uppercase tracking-wider font-bold mb-3">Starter</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-white tracking-tight">$49</span>
                  <span className="text-white/60 text-sm">/ month</span>
                </div>
                <p className="text-white/60 text-sm mb-8">For small operators getting started</p>

                <ul className="space-y-3 mb-8">
                  {["10 profile views / month", "Post 2 job listings", "Basic search filters", "Email support"].map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-white/80">
                      <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup/company?plan=starter"
                  className="block text-center px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-lg transition border border-white/10"
                >
                  Choose Starter
                </Link>
              </div>

              {/* Pro - Featured */}
              <div className="relative bg-primary-dark border-2 border-accent rounded-2xl p-8 transform md:scale-105 shadow-2xl shadow-accent/10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-primary text-xs font-bold tracking-wide rounded-full">
                  MOST POPULAR
                </div>
                <div className="text-accent text-xs uppercase tracking-wider font-bold mb-3">Pro</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-white tracking-tight">$99</span>
                  <span className="text-white/60 text-sm">/ month</span>
                </div>
                <p className="text-white/60 text-sm mb-8">For active hiring teams</p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited profile views",
                    "Post 10 job listings",
                    "Advanced search & filters",
                    "Save & shortlist candidates",
                    "Priority support",
                    "Verified company badge",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-white/80">
                      <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup/company?plan=pro"
                  className="block text-center px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-semibold rounded-lg transition shadow-lg shadow-accent/20"
                >
                  Choose Pro
                </Link>
              </div>

              {/* Enterprise */}
              <div className="relative bg-primary-dark border border-white/10 rounded-2xl p-8 hover:border-white/20 transition">
                <div className="text-white/50 text-xs uppercase tracking-wider font-bold mb-3">Enterprise</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-white tracking-tight">$299</span>
                  <span className="text-white/60 text-sm">/ month</span>
                </div>
                <p className="text-white/60 text-sm mb-8">For large fleets and agencies</p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Everything in Pro",
                    "Unlimited job listings",
                    "Dedicated account manager",
                    "Custom integrations (ATS)",
                    "Bulk profile export",
                    "API access",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-white/80">
                      <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup/company?plan=enterprise"
                  className="block text-center px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-lg transition border border-white/10"
                >
                  Choose Enterprise
                </Link>
              </div>
            </div>

            {/* Free tier note */}
            <p className="text-center text-white/50 text-sm mt-8">
              Not ready to commit? <Link href="/signup/company" className="text-accent hover:text-accent-light font-medium">Start with 3 free profile views</Link>
            </p>
          </div>
        </section>

        {/* ========================================
            WHY VERIFIED (Trust Section)
        ======================================== */}
        <section className="py-20 md:py-28 bg-primary-dark" aria-labelledby="why-verified-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-accent text-sm font-bold tracking-wider uppercase mb-3">Why ShipCrewFinder</div>
              <h2 id="why-verified-title" className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                Built by maritime professionals,<br />for maritime professionals
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                We've worked on ships. We know the industry. That's why every feature is designed with real maritime experience in mind.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 1l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
                    </svg>
                  ),
                  title: "Verified Profiles Only",
                  text: "Every profile is checked. CVs, certificates, ENG1, STCW — all verified before activation."
                },
                {
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s-8-4-8-12c0-4 3-7 8-7s8 3 8 7c0 8-8 12-8 12z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  ),
                  title: "Global Reach",
                  text: "Connecting talent across 100+ countries. From Singapore to Rotterdam, Houston to Dubai."
                },
                {
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  ),
                  title: "Privacy First",
                  text: "Stealth mode keeps your job search private. Block companies. Control who sees what."
                },
                {
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                  ),
                  title: "No Commission Fees",
                  text: "Direct connection between you and employers. No agencies taking a cut from your salary."
                },
                {
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                  ),
                  title: "Direct Messaging",
                  text: "Talk directly to employers or crew. No third parties filtering or delaying communication."
                },
                {
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  ),
                  title: "Real-Time Availability",
                  text: "Always-current availability dates. No outdated profiles or wasted outreach."
                },
              ].map((feature) => (
                <div key={feature.title} className="bg-primary border border-white/5 rounded-xl p-6 hover:border-accent/30 transition group">
                  <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center text-accent mb-4 group-hover:bg-accent/20 transition">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================
            FINAL CTA
        ======================================== */}
        <section className="py-20 md:py-28 bg-primary relative overflow-hidden">
          {/* Decorative accent */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
              Ready to set sail<br />
              <span className="text-accent">on your next career?</span>
            </h2>
            <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of seafarers, yacht crew, and maritime companies building the future of crew recruitment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/signup/crew"
                className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition shadow-lg shadow-accent/30"
              >
                Join as Crew — Free Trial
              </Link>
              <Link
                href="/signup/company"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg transition border border-white/20"
              >
                Hire Talent — 3 Free Views
              </Link>
            </div>

            <p className="text-white/40 text-sm mt-8">No credit card required · Cancel anytime · Trusted by maritime professionals worldwide</p>
          </div>
        </section>
      </main>

      {/* ========================================
          FOOTER
      ======================================== */}
      <footer className="bg-primary-darker border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand column */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M2 14 Q10 6, 20 14 T38 14" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
                  <path d="M2 20 Q10 12, 20 20 T38 20" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                  <path d="M2 26 Q10 18, 20 26 T38 26" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <span className="text-white font-bold text-lg tracking-tight">
                  Ship<span className="text-accent">Crew</span>Finder
                </span>
              </Link>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                The global maritime career platform. Verified profiles. Direct contact. No middlemen.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Product</h4>
              <ul className="space-y-3">
                {[
                  { label: "For Crew", href: "/for-crew" },
                  { label: "For Companies", href: "/for-companies" },
                  { label: "Pricing", href: "/pricing" },
                  { label: "How it works", href: "/how-it-works" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/60 hover:text-accent text-sm transition">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Company</h4>
              <ul className="space-y-3">
                {[
                  { label: "About", href: "/about" },
                  { label: "Blog", href: "/blog" },
                  { label: "Contact", href: "/contact" },
                  { label: "Careers", href: "/careers" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/60 hover:text-accent text-sm transition">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Cookie Policy", href: "/cookies" },
                  { label: "GDPR", href: "/gdpr" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/60 hover:text-accent text-sm transition">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} ShipCrewFinder. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent transition" aria-label="LinkedIn">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent transition" aria-label="Twitter / X">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
