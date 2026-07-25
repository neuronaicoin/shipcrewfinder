import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeckCard, { type DeckPost } from "@/app/components/deck-card";

export const metadata = {
  title: "Crew Board & Company Board — Available Crew & Hiring Companies | ShipCrewFinder",
  description:
    "Live maritime board: verified seafarers available for duty and shipping companies hiring right now. Updated live, worldwide.",
};

export default async function DeckPage() {
  const supabase = await createClient();

  const [{ data }, { data: { user } }] = await Promise.all([
    supabase.rpc("get_deck_feed", { lim: 60 }),
    supabase.auth.getUser(),
  ]);

  const posts = (Array.isArray(data) ? data : []) as DeckPost[];

  // Girişli kullanıcının kendi kart id'leri (Boost göstermek için)
  let myPostIds: string[] = [];
  if (user) {
    const { data: mine } = await supabase
      .from("deck_posts")
      .select("id")
      .eq("user_id", user.id);
    myPostIds = (mine || []).map((r) => r.id as string);
  }

  const crewCount = posts.filter((p) => p.post_type === "crew").length;
  const coCount = posts.length - crewCount;

  return (
    <>
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --navy:#0d1030;--navy2:#141845;--ink:#050716;
    --gold:#fbbf24;--gold2:#e0a010;--line:rgba(251,191,36,.16);--line2:rgba(255,255,255,.08);
    --tx:#eef4fa;--tx2:#a8bdd2;--tx3:#6b83a0;--grn:#34d399;
    --disp:var(--font-bricolage),sans-serif;--body:var(--font-jakarta),sans-serif;
  }
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:1080px;margin:0 auto;padding:0 20px}
  .top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 0;flex-wrap:wrap}
  .logo{display:flex;align-items:center;gap:9px;text-decoration:none;color:var(--tx)}
  .logo .ic{width:32px;height:32px;border-radius:9px;background:linear-gradient(145deg,var(--gold),var(--gold2));display:grid;place-items:center}
  .logo b{font-family:var(--disp);font-size:16px;font-weight:700}
  .logo b span{color:var(--gold)}
  .topcta{display:inline-flex;align-items:center;gap:7px;border-radius:11px;font-weight:700;font-size:12.5px;padding:9px 15px;color:var(--tx);border:1px solid var(--line2);text-decoration:none;transition:.18s}
  .topcta:hover{border-color:var(--gold);color:var(--gold)}
  .bhero{position:relative;padding:26px 0 18px;overflow:hidden}
  .aur{position:absolute;width:460px;height:460px;top:-260px;left:50%;transform:translateX(-50%);border-radius:50%;filter:blur(90px);opacity:.4;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  h1{font-family:var(--disp);font-size:clamp(1.5rem,3.8vw,2.3rem);font-weight:800;letter-spacing:-.02em;line-height:1.15;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
  .dklive{width:11px;height:11px;border-radius:50%;background:var(--grn);flex-shrink:0;box-shadow:0 0 0 0 rgba(52,211,153,.55);animation:dkpulse 1.6s infinite}
  @keyframes dkpulse{0%{box-shadow:0 0 0 0 rgba(52,211,153,.55)}70%{box-shadow:0 0 0 10px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
  .bsub{font-size:13.5px;color:var(--tx2);margin-top:8px}
  .bsub b{color:var(--gold)}
  .bstats{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}
  .bstat{font-size:11px;font-weight:800;letter-spacing:.05em;border-radius:999px;padding:5px 13px;border:1px solid}
  .bstat.g{color:var(--gold);border-color:rgba(251,191,36,.4);background:rgba(251,191,36,.08)}
  .bstat.b{color:#60a5fa;border-color:rgba(96,165,250,.4);background:rgba(96,165,250,.08)}
  section{padding:16px 0 50px}
  .dkgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(255px,1fr));gap:12px}
  @media(max-width:600px){.dkgrid{grid-template-columns:1fr}}
  .dkcard{border-radius:15px;padding:0 15px 14px;background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);display:flex;flex-direction:column;overflow:hidden}
  .dk-crew{border-color:rgba(251,191,36,.4)}
  .dk-co{border-color:rgba(96,165,250,.4)}
  .dk-strip{margin:0 -15px 11px;padding:8px 13px;font-size:9.5px;font-weight:800;letter-spacing:.08em;display:flex;justify-content:space-between;align-items:center}
  .dk-strip-crew{background:linear-gradient(90deg,rgba(251,191,36,.28),rgba(251,191,36,.07));color:var(--gold);border-bottom:1px solid rgba(251,191,36,.3)}
  .dk-strip-co{background:linear-gradient(90deg,rgba(96,165,250,.28),rgba(96,165,250,.06));color:#60a5fa;border-bottom:1px solid rgba(96,165,250,.3)}
  .dk-days{opacity:.85;font-weight:700}
  .dk-head{display:flex;gap:10px;align-items:center;margin-bottom:7px}
  .dk-ava{width:40px;height:40px;border-radius:11px;display:grid;place-items:center;font-family:var(--disp);font-weight:800;font-size:15px;flex-shrink:0}
  .dk-ava-crew{background:rgba(251,191,36,.14);color:var(--gold);border:1px solid rgba(251,191,36,.35)}
  .dk-ava-co{background:rgba(96,165,250,.13);color:#60a5fa;border:1px solid rgba(96,165,250,.35);font-size:17px}
  .dk-name{font-family:var(--disp);font-weight:800;font-size:14.5px;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .dk-vf{color:var(--grn);font-size:11px}
  .dk-role{font-size:10.5px;font-weight:800;letter-spacing:.05em;color:var(--gold);margin-top:2px}
  .dk-role-co{color:#60a5fa}
  .dk-meta{font-size:11px;color:var(--tx2);line-height:1.5;margin-bottom:4px}
  .dk-av{color:var(--grn);font-weight:700}
  .dk-sal{font-size:11.5px;color:var(--grn);font-weight:800;margin-bottom:4px}
  .dk-note{font-size:10.5px;color:var(--tx3);font-style:italic;line-height:1.45;margin-bottom:5px}
  .dk-contact{display:flex;flex-direction:column;gap:2px;font-size:10.5px;color:var(--tx2);margin:4px 0 10px;word-break:break-all}
  .dk-hiddenc{color:var(--tx3);font-style:italic}
  .dk-btns{margin-top:auto;display:flex;gap:6px}
  .dk-btn{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:5px;border-radius:9px;font-weight:800;font-size:11.5px;text-decoration:none;padding:8px 10px;transition:.15s}
  .dk-btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .dk-btn-gold:hover{transform:translateY(-1px)}
  .dk-btn-blue{background:linear-gradient(135deg,#60a5fa,#3b82f6);color:#071022}
  .dk-btn-blue:hover{transform:translateY(-1px)}
  .dk-owner{margin-top:9px;border-top:1px dashed var(--line2);padding-top:8px}
  .dk-boost{width:100%;background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.4);color:var(--gold);border-radius:9px;padding:7px 0;font-weight:800;font-size:11.5px;cursor:pointer;font-family:var(--body)}
  .dk-boost:hover{background:rgba(251,191,36,.18)}
  .dk-boosted{display:block;text-align:center;font-size:10.5px;color:var(--tx3)}
  .empty{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1.5px dashed rgba(251,191,36,.4);border-radius:18px;padding:38px 24px;text-align:center}
  .empty b{font-family:var(--disp);font-size:16px;display:block;margin-bottom:8px}
  .empty p{font-size:13px;color:var(--tx2);line-height:1.65;max-width:46ch;margin:0 auto 16px}
  .ebtns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
  .ebtn{display:inline-flex;align-items:center;gap:7px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-radius:11px;padding:11px 19px;font-weight:800;font-size:13px;text-decoration:none}
  .ebtn.ghost{background:transparent;color:var(--tx);border:1px solid var(--line2)}
  .postcta{margin-top:22px;background:linear-gradient(160deg,var(--navy2),var(--ink));border:1.5px solid var(--line);border-radius:16px;padding:16px 20px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap}
  .postcta p{font-size:12.5px;color:var(--tx2);line-height:1.6}
  .postcta b{color:var(--tx);font-family:var(--disp);display:block;font-size:13.5px;margin-bottom:2px}
  footer{border-top:1px solid var(--line2);padding:26px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <div className="wrap">
        <div className="top">
          <Link href="/" className="logo">
            <span className="ic">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0b0e13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2.4"/><line x1="12" y1="7.4" x2="12" y2="20.5"/><line x1="7.5" y1="10.4" x2="16.5" y2="10.4"/><path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7"/><path d="M4.5 14.8l-1.6-1.2M4.5 14.8l2-.4"/><path d="M19.5 14.8l1.6-1.2M19.5 14.8l-2-.4"/></svg>
            </span>
            <b>Ship<span>Crew</span>Finder</b>
          </Link>
          {user ? (
            <Link href="/dashboard" className="topcta">My dashboard →</Link>
          ) : (
            <Link href="/signup" className="topcta">Join free →</Link>
          )}
        </div>
      </div>

      <div className="bhero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <h1><span className="dklive"></span>Crew Board <span style={{ color: "var(--tx3)", fontWeight: 600 }}>&amp;</span> <span style={{ color: "var(--gold)" }}>Company Board</span></h1>
          <p className="bsub">Available crew · hiring companies — <b>live right now</b>. Every post stays up for 30 days.</p>
          <div className="bstats">
            <span className="bstat g">⚓ {crewCount} crew available</span>
            <span className="bstat b">🏢 {coCount} companies hiring</span>
          </div>
        </div>
      </div>

      <section>
        <div className="wrap">
          {posts.length === 0 ? (
            <div className="empty">
              <b>The board is warming up ⚓</b>
              <p>Be the first on the board — post your CV or your open position and it stays on the main page for 30 days, seen by every visitor.</p>
              <div className="ebtns">
                <Link href={user ? "/dashboard" : "/signup/crew"} className="ebtn">⚓ Post my CV</Link>
                <Link href={user ? "/jobs/mine" : "/signup/company"} className="ebtn ghost">📋 Post a job</Link>
              </div>
            </div>
          ) : (
            <div className="dkgrid">
              {posts.map((p) => (
                <DeckCard key={p.id} post={p} isOwner={myPostIds.includes(p.id)} backTo="/deck" />
              ))}
            </div>
          )}

          <div className="postcta">
            <div style={{ minWidth: 0 }}>
              <b>Get on the board — one tap.</b>
              <p>Crew: post your CV from your dashboard. Companies: post any active job. Live for 30 days, boost to the top once a day.</p>
            </div>
            <Link href={user ? "/dashboard" : "/signup"} className="ebtn">{user ? "Go to dashboard →" : "Join free →"}</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <Link href="/">ShipCrewFinder</Link> · <Link href="/jobs">Browse jobs</Link> · <Link href="/salary">Salary Index</Link>
        </div>
      </footer>
    </>
  );
}
