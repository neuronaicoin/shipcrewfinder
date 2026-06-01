import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import { acceptRequest, rejectRequest, blockCompany } from "@/lib/actions/contact";
import NotificationBell from "@/app/components/notification-bell";
import Link from "next/link";

export const metadata = {
  title: "Connection Requests — ShipCrewFinder",
};

export default async function RequestsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (!me || me.user_type === "company") redirect("/dashboard");

  // Unread notification count
  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  // Companies this user blocked (to hide their requests)
  const { data: blockedRows } = await supabase
    .from("blocked_companies")
    .select("company_id")
    .eq("user_id", user.id);
  const blockedIds = (blockedRows || []).map((r) => r.company_id as string);

  const { data: requests } = await supabase
    .from("contact_requests")
    .select("id, from_company_id, message, status, created_at")
    .eq("to_user_id", user.id)
    .order("created_at", { ascending: false });

  const allRequests = (requests || []).filter(
    (r) => !blockedIds.includes(r.from_company_id as string)
  );

  const companyIds = [...new Set(allRequests.map((r) => r.from_company_id as string))];
  const companyMap: Record<string, string> = {};
  if (companyIds.length > 0) {
    const { data: companies } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", companyIds);
    (companies || []).forEach((c) => {
      companyMap[c.id as string] = (c.full_name as string) || "A company";
    });
  }

  const pending = allRequests.filter((r) => r.status === "pending");
  const history = allRequests.filter((r) => r.status !== "pending");

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const statusBadge = (status: string) => {
    if (status === "accepted")
      return "bg-emerald-500/15 border-emerald-500/30 text-emerald-400";
    if (status === "rejected")
      return "bg-red-500/15 border-red-500/30 text-red-400";
    return "bg-white/5 border-white/15 text-white/50";
  };

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
            <NotificationBell count={unreadCount || 0} />
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-lg transition border border-white/10"
            >
              Dashboard
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-lg transition border border-white/10"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Connection Requests
          </h1>
          <p className="text-white/60 text-lg">
            Companies that want to connect with you. Accept to share your full profile.
          </p>
        </div>

        <h2 className="font-display text-xl font-bold text-white mb-4">
          Pending {pending.length > 0 && `(${pending.length})`}
        </h2>

        {pending.length === 0 ? (
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-8 text-center mb-10">
            <p className="text-white/50 text-sm">No pending requests right now.</p>
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            {pending.map((r) => {
              const companyName = companyMap[r.from_company_id as string] || "A company";
              return (
                <div
                  key={r.id as string}
                  className="bg-primary-dark border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
                      <span className="font-display text-lg font-bold text-accent">
                        {companyName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg font-bold text-white">
                        {companyName}
                      </h3>
                      <p className="text-white/40 text-xs">{fmtDate(r.created_at as string)}</p>
                      {r.message && (
                        <p className="text-white/70 text-sm mt-2 leading-relaxed">
                          “{r.message as string}”
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <form action={acceptRequest}>
                      <input type="hidden" name="requestId" value={r.id as string} />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-accent hover:bg-accent-dark text-primary font-bold text-sm rounded-lg transition"
                      >
                        Accept
                      </button>
                    </form>
                    <form action={rejectRequest}>
                      <input type="hidden" name="requestId" value={r.id as string} />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-bold text-sm rounded-lg transition border border-white/10"
                      >
                        Reject
                      </button>
                    </form>
                    <form action={blockCompany}>
                      <input type="hidden" name="companyId" value={r.from_company_id as string} />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-sm rounded-lg transition border border-red-500/20"
                      >
                        Block
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {history.length > 0 && (
          <>
            <h2 className="font-display text-xl font-bold text-white mb-4">
              History
            </h2>
            <div className="space-y-3">
              {history.map((r) => {
                const companyName = companyMap[r.from_company_id as string] || "A company";
                return (
                  <div
                    key={r.id as string}
                    className="bg-primary-dark border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">{companyName}</p>
                      <p className="text-white/40 text-xs">{fmtDate(r.created_at as string)}</p>
                    </div>
                    <span
                      className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${statusBadge(
                        r.status as string
                      )}`}
                    >
                      {r.status as string}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
