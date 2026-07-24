"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { login } from "@/lib/actions/auth";

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

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let remembered = "";
    try {
      remembered = localStorage.getItem("scf_login_email") || "";
    } catch {}
    if (remembered) {
      setSavedEmail(remembered);
      passwordRef.current?.focus();
    } else {
      emailRef.current?.focus();
    }
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const email = (formData.get("email") as string) || "";
    try {
      localStorage.setItem("scf_login_email", email);
    } catch {}

    const result = await login(formData);

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
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            Welcome back
          </h1>
          <p className="text-white/60 text-sm">
            Log in to your ShipCrewFinder account
          </p>
        </div>

        {/* Form Card */}
        <div
          className="border border-white/10 rounded-2xl p-6 md:p-8"
          style={{ background: "linear-gradient(165deg,#141845,#050716)" }}
        >
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
                ref={emailRef}
                defaultValue={savedEmail}
                key={savedEmail}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
                style={{ background: "#0d1030" }}
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
                ref={passwordRef}
                autoComplete="current-password"
                placeholder="Your password"
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
              className="w-full px-6 py-3 text-primary font-bold rounded-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg,#fbbf24,#e0a010)",
                color: "#0b0e13",
                boxShadow: "0 4px 20px rgba(251,191,36,.25)",
              }}
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
