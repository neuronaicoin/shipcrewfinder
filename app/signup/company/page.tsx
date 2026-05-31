"use client";

import Link from "next/link";
import { useState } from "react";
import { signupCompany } from "@/lib/actions/auth";

export default function SignupCompanyPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await signupCompany(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

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

      <div className="relative w-full max-w-md">
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

        {/* Heading */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1.5 bg-accent/15 border border-accent/30 rounded-full mb-4">
            <span className="text-accent text-xs font-extrabold tracking-wider uppercase">For Companies</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            Create company account
          </h1>
          <p className="text-white/60 text-sm">
            3 free profile views · No credit card required
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 md:p-8">
          <form action={handleSubmit} className="space-y-4">
            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-white/70 text-xs font-bold uppercase tracking-wider mb-2">
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                minLength={2}
                placeholder="Acme Shipping Ltd."
                className="w-full px-4 py-3 bg-primary border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
              />
            </div>

            {/* Contact Person */}
            <div>
              <label htmlFor="contactName" className="block text-white/70 text-xs font-bold uppercase tracking-wider mb-2">
                Contact Person
              </label>
              <input
                id="contactName"
                name="contactName"
                type="text"
                required
                minLength={2}
                placeholder="Your full name"
                className="w-full px-4 py-3 bg-primary border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-white/70 text-xs font-bold uppercase tracking-wider mb-2">
                Work Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className="w-full px-4 py-3 bg-primary border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
              />
              <p className="text-white/40 text-xs mt-1.5">Use your company email for faster verification</p>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-white/70 text-xs font-bold uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 bg-primary border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Company Account"}
            </button>

            {/* Terms */}
            <p className="text-white/40 text-xs text-center leading-relaxed">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-accent hover:underline">Terms</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
            </p>
          </form>
        </div>

        {/* Already have account */}
        <p className="text-center text-white/60 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:text-accent-light font-bold transition">
            Log in
          </Link>
        </p>

        {/* Back */}
        <p className="text-center mt-4">
          <Link href="/signup" className="text-white/40 hover:text-white/60 text-sm transition">
            ← Wrong account type?
          </Link>
        </p>
      </div>
    </main>
  );
}
