"use client";

import Link from "next/link";
import { useState } from "react";
import { login } from "@/lib/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await login(formData);

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
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            Welcome back
          </h1>
          <p className="text-white/60 text-sm">
            Log in to your ShipCrewFinder account
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 md:p-8">
          <form action={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-white/70 text-xs font-bold uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-primary border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-white/70 text-xs font-bold uppercase tracking-wider">
                  Password
                </label>
                <Link href="/forgot-password" className="text-accent hover:text-accent-light text-xs font-bold transition">
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Your password"
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
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>

        {/* Sign up link */}
        <p className="text-center text-white/60 text-sm mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-accent hover:text-accent-light font-bold transition">
            Sign up free
          </Link>
        </p>

        {/* Back */}
        <p className="text-center mt-4">
          <Link href="/" className="text-white/40 hover:text-white/60 text-sm transition">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </main>
  );
}
