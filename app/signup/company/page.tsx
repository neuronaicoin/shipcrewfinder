"use client";

import Link from "next/link";
import { useState } from "react";
import { signupCompany } from "@/lib/actions/auth";

const anchorSvg = (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#0b0e13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2.4" />
    <line x1="12" y1="7.4" x2="12" y2="20.5" />
    <line x1="7.5" y1="10.4" x2="16.5" y2="10.4" />
    <path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7" />
    <path d="M4.5 14.8l-1.6-1.2M4.5 14.8l2-.4" />
    <path d="M19.5 14.8l1.6-1.2M19.5 14.8l-2-.4" />
  </svg>
);

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
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "#0d1030" }}
    >
      {/* Aurora background */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 520, height: 520, top: -180, right: -100, borderRadius: "50%",
          filter: "blur(90px)", opacity: 0.5,
          background: "radial-gradient(circle, rgba(251,191,36,.28), transparent 65%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 460, height: 460, bottom: -200, left: -120, borderRadius: "50%",
          filter: "blur(90px)", opacity: 0.4,
          background: "radial-gradient(circle, rgba(37,99,235,.33), transparent 65%)",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <span
            className="grid place-items-center"
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(145deg,#fbbf24,#e0a010)",
            }}
          >
            {anchorSvg}
          </span>
          <span className="text-white font-display font-bold text-lg tracking-tight">
            Ship<span className="text-accent">Crew</span>Finder
          </span>
        </Link>

        {/* Heading */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1.5 bg-accent/15 border border-accent/30 rounded-full mb-4">
            <span className="text-accent text-xs font-extrabold tracking-wider uppercase">🏢 For Companies</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            Create company account
          </h1>
          <p className="text-white/60 text-sm">
            First month completely free · No credit card required
          </p>
        </div>

        {/* Form Card */}
        <div
          className="border border-white/10 rounded-2xl p-6 md:p-8"
          style={{ background: "linear-gradient(165deg,#141845,#050716)" }}
        >
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
                autoComplete="organization"
                placeholder="Ocean Shipping Ltd."
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
                style={{ background: "#0d1030" }}
              />
            </div>

            {/* Contact Name */}
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
                autoComplete="name"
                placeholder="Jane Doe"
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
                style={{ background: "#0d1030" }}
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
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
                style={{ background: "#0d1030" }}
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
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
                style={{ background: "#0d1030" }}
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
              className="w-full px-6 py-3 font-bold rounded-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg,#fbbf24,#e0a010)",
                color: "#0b0e13",
                boxShadow: "0 4px 20px rgba(251,191,36,.25)",
              }}
            >
              {loading ? "Creating account..." : "Start Free Month →"}
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
