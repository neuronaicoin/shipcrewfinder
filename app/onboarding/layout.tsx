import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/lib/actions/auth";

const anchorSvg = (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#0b0e13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2.4" />
    <line x1="12" y1="7.4" x2="12" y2="20.5" />
    <line x1="7.5" y1="10.4" x2="16.5" y2="10.4" />
    <path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7" />
    <path d="M4.5 14.8l-1.6-1.2M4.5 14.8l2-.4" />
    <path d="M19.5 14.8l1.6-1.2M19.5 14.8l-2-.4" />
  </svg>
);

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  if (!user) {
    redirect("/login");
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "#0d1030" }}
    >
      {/* Aurora background */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 520, height: 520, top: -200, right: -100, borderRadius: "50%",
          filter: "blur(90px)", opacity: 0.45,
          background: "radial-gradient(circle, rgba(251,191,36,.28), transparent 65%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 460, height: 460, bottom: -220, left: -140, borderRadius: "50%",
          filter: "blur(90px)", opacity: 0.35,
          background: "radial-gradient(circle, rgba(37,99,235,.33), transparent 65%)",
        }}
      />

      {/* Header */}
      <header
        className="relative border-b border-white/10 backdrop-blur-md"
        style={{ background: "rgba(13,16,48,.88)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span
              className="grid place-items-center"
              style={{
                width: 34, height: 34, borderRadius: 9,
                background: "linear-gradient(145deg,#fbbf24,#e0a010)",
              }}
            >
              {anchorSvg}
            </span>
            <span className="text-white font-display font-bold text-lg tracking-tight">
              Ship<span className="text-accent">Crew</span>Finder
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-white/60 hover:text-accent text-sm font-medium transition"
            >
              ← Dashboard
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="px-3 py-1.5 text-white/60 hover:text-white text-sm font-medium transition"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}
