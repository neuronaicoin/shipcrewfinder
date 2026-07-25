import Link from "next/link";
import { boostDeckPost } from "@/lib/actions/deck";

export type DeckPost = {
  id: string;
  post_type: "crew" | "company";
  note: string | null;
  show_contact: boolean;
  created_at: string;
  expires_at: string;
  boosted_at: string;
  full_name: string | null;
  country: string | null;
  email: string | null;
  phone: string | null;
  cv_share_code: string | null;
  rank: string | null;
  availability: string | null;
  years_experience: number | null;
  company_name: string | null;
  headquarters_country: string | null;
  job_id: string | null;
  job_title: string | null;
  job_position: string | null;
  job_country: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
};

const DAY_MS = 24 * 3600 * 1000;

const rankInitials = (rank: string | null) => {
  if (!rank) return "⚓";
  const r = rank.toUpperCase();
  if (r.includes("CHIEF ENGINEER")) return "CE";
  if (r.includes("2ND ENGINEER") || r.includes("SECOND ENGINEER")) return "2E";
  if (r.includes("3RD ENGINEER") || r.includes("THIRD ENGINEER")) return "3E";
  if (r.includes("CHIEF OFFICER") || r.includes("CHIEF MATE")) return "CO";
  if (r.includes("2ND OFFICER") || r.includes("SECOND OFFICER")) return "2O";
  if (r.includes("3RD OFFICER") || r.includes("THIRD OFFICER")) return "3O";
  if (r.includes("MASTER") || r.includes("CAPTAIN")) return "MK";
  if (r.includes("ETO") || r.includes("ELECTRO")) return "ET";
  if (r.includes("BOSUN")) return "BS";
  if (r.includes("COOK")) return "CK";
  const parts = r.split(/\s+/);
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).slice(0, 2);
};

export default function DeckCard({
  post,
  isOwner,
  backTo,
}: {
  post: DeckPost;
  isOwner: boolean;
  backTo: string;
}) {
  const isCrew = post.post_type === "crew";

  const daysLeft = Math.max(0, Math.ceil((new Date(post.expires_at).getTime() - Date.now()) / DAY_MS));
  const canBoost = isOwner && Date.now() - new Date(post.boosted_at).getTime() >= DAY_MS;

  const availLabel = (() => {
    const a = post.availability;
    if (a === "immediate") return "Available now";
    if (a === "1-3_months") return "Available in 1–3m";
    if (a === "3+_months") return "Available in 3+m";
    return null;
  })();

  const expLabel = (() => {
    const n = post.years_experience;
    if (n === null || n === undefined) return null;
    if (n <= 1) return "0–1 yrs";
    if (n <= 3) return "1–3 yrs";
    return "3+ yrs";
  })();

  const salary =
    post.salary_min || post.salary_max
      ? (post.salary_currency || "USD") + " " + (post.salary_min || "?") + (post.salary_max ? "–" + post.salary_max : "") + "/mo"
      : null;

  return (
    <div className={"dkcard " + (isCrew ? "dk-crew" : "dk-co")}>
      <div className={"dk-strip " + (isCrew ? "dk-strip-crew" : "dk-strip-co")}>
        <span>{isCrew ? "⚓ AVAILABLE CREW" : "🏢 COMPANY — HIRING"}</span>
        <span className="dk-days">⏳ {daysLeft}d left</span>
      </div>

      {isCrew ? (
        <>
          <div className="dk-head">
            <div className="dk-ava dk-ava-crew">{rankInitials(post.rank)}</div>
            <div style={{ minWidth: 0 }}>
              <div className="dk-name">{post.full_name || "Verified crew"} <span className="dk-vf">✓</span></div>
              <div className="dk-role">{(post.rank || "SEAFARER").toUpperCase()}</div>
            </div>
          </div>
          <div className="dk-meta">
            {expLabel ? expLabel + " at sea" : null}
            {expLabel && availLabel ? " · " : null}
            {availLabel ? <span className="dk-av">{availLabel}</span> : null}
          </div>
          {post.note ? <div className="dk-note">&ldquo;{post.note}&rdquo;</div> : null}
          <div className="dk-contact">
            {post.show_contact && (post.phone || post.email) ? (
              <>
                {post.phone ? <span>📱 {post.phone}</span> : null}
                {post.email ? <span>✉ {post.email}</span> : null}
              </>
            ) : (
              <span className="dk-hiddenc">Contact via ShipCrewFinder</span>
            )}
          </div>
          <div className="dk-btns">
            {post.cv_share_code ? (
              <a href={"/cv/share/" + post.cv_share_code} target="_blank" rel="noopener noreferrer" className="dk-btn dk-btn-gold">View CV →</a>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div className="dk-head">
            <div className="dk-ava dk-ava-co">🏢</div>
            <div style={{ minWidth: 0 }}>
              <div className="dk-name">{post.company_name || "Verified company"}</div>
              <div className="dk-role dk-role-co">NEEDS: {(post.job_position || "CREW").toUpperCase()}</div>
            </div>
          </div>
          <div className="dk-meta">
            {post.job_title}
            {post.job_country ? " · " + post.job_country : null}
          </div>
          {salary ? <div className="dk-sal">{salary}</div> : null}
          <div className="dk-contact">
            {post.phone || post.email ? (
              <>
                {post.email ? <span>✉ {post.email}</span> : null}
                {post.phone ? <span>📱 {post.phone}</span> : null}
              </>
            ) : (
              <span className="dk-hiddenc">Apply via ShipCrewFinder</span>
            )}
          </div>
          <div className="dk-btns">
            {post.job_id ? (
              <Link href={"/jobs/" + post.job_id} className="dk-btn dk-btn-blue">Apply →</Link>
            ) : null}
          </div>
        </>
      )}

      {isOwner ? (
        <div className="dk-owner">
          {canBoost ? (
            <form action={boostDeckPost}>
              <input type="hidden" name="postId" value={post.id} />
              <input type="hidden" name="backTo" value={backTo} />
              <button type="submit" className="dk-boost">⬆️ Boost to top</button>
            </form>
          ) : (
            <span className="dk-boosted">⬆️ Boosted — next boost tomorrow</span>
          )}
        </div>
      ) : null}
    </div>
  );
}
