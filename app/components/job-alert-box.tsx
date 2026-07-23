import Link from "next/link";
import { toggleJobAlert } from "@/lib/actions/job-alerts";

type Props = {
  rank: string;
  isActive: boolean;
  isLoggedIn: boolean;
  isCompany: boolean;
  redirectTo: string;
};

export default function JobAlertBox({
  rank,
  isActive,
  isLoggedIn,
  isCompany,
  redirectTo,
}: Props) {
  if (!rank || isCompany) return null;

  if (!isLoggedIn) {
    return (
      <div className="mb-8 bg-primary-dark border border-accent/25 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="text-white font-bold">
            Get notified about new {rank} jobs
          </div>
          <div className="text-white/50 text-sm mt-1">
            Create a free account and we&apos;ll email you the moment a matching
            position is posted.
          </div>
        </div>
        <Link
          href="/signup/crew"
          className="px-5 py-3 bg-accent hover:bg-accent-dark text-primary font-bold text-sm rounded-lg transition text-center whitespace-nowrap"
        >
          Sign Up Free
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`mb-8 bg-primary-dark border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${
        isActive ? "border-emerald-500/30" : "border-accent/25"
      }`}
    >
      <div className="flex-1">
        <div className="text-white font-bold flex items-center gap-2">
          {isActive ? (
            <>
              <span className="text-emerald-400">●</span>
              Alert active for {rank}
            </>
          ) : (
            <>Get alerts for {rank} jobs</>
          )}
        </div>
        <div className="text-white/50 text-sm mt-1">
          {isActive
            ? "You will be emailed as soon as a new matching position is posted."
            : "Be the first to know — we email you instantly when a new position opens."}
        </div>
      </div>

      <form action={toggleJobAlert}>
        <input type="hidden" name="rank" value={rank} />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <button
          type="submit"
          className={`w-full sm:w-auto px-5 py-3 font-bold text-sm rounded-lg transition whitespace-nowrap ${
            isActive
              ? "bg-white/5 hover:bg-white/10 text-white/70 border border-white/15"
              : "bg-accent hover:bg-accent-dark text-primary"
          }`}
        >
          {isActive ? "Turn off alert" : "🔔 Create alert"}
        </button>
      </form>
    </div>
  );
}
