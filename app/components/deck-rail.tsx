import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeckCard, { type DeckPost } from "@/app/components/deck-card";

export default async function DeckRail() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_deck_feed", { lim: 12 });
  const posts = (Array.isArray(data) ? data : []) as DeckPost[];

  return (
    <section className="dksec">
      <style>{`
  .dksec{padding:6px 0 34px}
  .dkhead{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:14px}
  .dkhead h2{font-family:var(--disp);font-size:clamp(1.15rem,2.6vw,1.5rem);font-weight:800;letter-spacing:-.01em;display:flex;align-items:center;gap:10px}
  .dklive{width:10px;height:10px;border-radius:50%;background:var(--grn);flex-shrink:0;box-shadow:0 0 0 0 rgba(52,211,153,.55);animation:dkpulse 1.6s infinite}
  @keyframes dkpulse{0%{box-shadow:0 0 0 0 rgba(52,211,153,.55)}70%{box-shadow:0 0 0 9px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
  .dkhead p{font-size:12px;color:var(--tx3);margin-top:3px}
  .dkall{font-size:12.5px;font-weight:700;color:var(--gold);text-decoration:none;white-space:nowrap}
  .dkall:hover{text-decoration:underline}
  .dkwrapx{position:relative}
  .dkrail{display:flex;gap:11px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding:2px 2px 10px;scrollbar-width:thin}
  .dkrail::-webkit-scrollbar{height:5px}
  .dkrail::-webkit-scrollbar-thumb{background:rgba(251,191,36,.25);border-radius:99px}
  .dkfade{position:absolute;right:0;top:0;bottom:10px;width:52px;background:linear-gradient(90deg,transparent,var(--navy));pointer-events:none}
  .dkswipe{display:none;align-items:center;justify-content:flex-end;gap:6px;font-size:11px;font-weight:700;color:var(--gold);margin-top:2px}
  .dkswipe .ar{display:inline-block;animation:dkslide 1.4s ease-in-out infinite}
  @keyframes dkslide{0%,100%{transform:translateX(0)}50%{transform:translateX(6px)}}
  @media(max-width:640px){.dkswipe{display:flex}}
  .dkcard{flex:0 0 252px;scroll-snap-align:start;border-radius:15px;padding:0 15px 14px;background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);display:flex;flex-direction:column;overflow:hidden}
  @media(min-width:900px){.dkcard{flex-basis:268px}}
  @media(max-width:640px){.dkcard{flex-basis:232px}}
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
  .dk-ex{font-size:8.5px;font-weight:800;letter-spacing:.06em;color:var(--tx3);border:1px dashed var(--line2);border-radius:999px;padding:2px 8px;align-self:flex-start;margin-bottom:6px}
  .dkcta{flex:0 0 210px;scroll-snap-align:start;border:1.5px dashed rgba(251,191,36,.4);border-radius:15px;padding:16px 15px;display:flex;flex-direction:column;justify-content:center;gap:9px;text-align:center}
  .dkcta b{font-family:var(--disp);font-size:13.5px;line-height:1.35}
  .dkcta p{font-size:10.5px;color:var(--tx3);line-height:1.5}
  .dkcta a{display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-radius:9px;padding:8px 12px;font-weight:800;font-size:11.5px;text-decoration:none}
`}</style>

      <div className="wrap">
        <div className="dkhead">
          <div>
            <h2><span className="dklive"></span>Crew Board <span style={{ color: "var(--tx3)", fontWeight: 600 }}>&amp;</span> <span style={{ color: "var(--gold)" }}>Company Board</span></h2>
            <p>Available crew · hiring companies — live right now</p>
          </div>
          <Link href="/deck" className="dkall">View all →</Link>
        </div>

        <div className="dkwrapx">
          <div className="dkrail">
            {posts.map((p) => (
              <DeckCard key={p.id} post={p} isOwner={false} backTo="/" />
            ))}

            {posts.length === 0 ? (
              <>
                <div className="dkcard dk-crew">
                  <div className="dk-strip dk-strip-crew"><span>⚓ AVAILABLE CREW</span><span className="dk-days">⏳ 30d left</span></div>
                  <span className="dk-ex">EXAMPLE</span>
                  <div className="dk-head">
                    <div className="dk-ava dk-ava-crew">CE</div>
                    <div><div className="dk-name">Chief Engineer <span className="dk-vf">✓</span></div><div className="dk-role">C/E — UNLIMITED</div></div>
                  </div>
                  <div className="dk-meta">3+ yrs at sea · <span className="dk-av">Available now</span></div>
                  <div className="dk-contact"><span className="dk-hiddenc">Contact via ShipCrewFinder</span></div>
                  <div className="dk-btns"><Link href="/signup/crew" className="dk-btn dk-btn-gold">Post yours →</Link></div>
                </div>
                <div className="dkcard dk-co">
                  <div className="dk-strip dk-strip-co"><span>🏢 COMPANY — HIRING</span><span className="dk-days">⏳ 30d left</span></div>
                  <span className="dk-ex">EXAMPLE</span>
                  <div className="dk-head">
                    <div className="dk-ava dk-ava-co">🏢</div>
                    <div><div className="dk-name">Shipping Company</div><div className="dk-role dk-role-co">NEEDS: 2ND ENGINEER</div></div>
                  </div>
                  <div className="dk-meta">Bulk carrier · Worldwide</div>
                  <div className="dk-sal">USD 7,000–8,500/mo</div>
                  <div className="dk-contact"><span className="dk-hiddenc">Apply via ShipCrewFinder</span></div>
                  <div className="dk-btns"><Link href="/signup/company" className="dk-btn dk-btn-blue">Post a job →</Link></div>
                </div>
              </>
            ) : null}

            <div className="dkcta">
              <b>Your CV or vacancy here — one tap.</b>
              <p>Live on the main page for 30 days. Boost back to the top once a day.</p>
              <Link href="/signup">Join free →</Link>
            </div>
          </div>
          <div className="dkfade"></div>
        </div>
        <div className="dkswipe"><span>Swipe</span><span className="ar">→</span></div>
      </div>
    </section>
  );
}
