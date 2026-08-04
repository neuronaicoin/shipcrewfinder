import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { sendMessRoomMessage } from "@/lib/actions/messroom";
import { startConversation } from "@/lib/actions/messages";
import MessRoomClient from "@/app/components/messroom-client";

export const metadata = {
  title: "Chat Room — Live Crew Chat | ShipCrewFinder",
  description:
    "The ShipCrewFinder Chat Room: live 24/7 chat for verified seafarers and shipping companies. Messages vanish after 24 hours. No links, no spam — just crew talk.",
};

type MessMsg = {
  id: string;
  body: string;
  created_at: string;
  user_id: string | null;
  is_system: boolean;
  display_name: string;
  handle: string | null;
  user_type: string;
  rank_label: string;
};

const rankShort = (r: string) => {
  const u = (r || "").toUpperCase();
  if (u === "SCF") return "SCF";
  if (u === "GUEST") return "👤";
  if (u === "CO") return "🏢";
  if (u.includes("CHIEF ENGINEER")) return "C/E";
  if (u.includes("2ND ENGINEER") || u.includes("SECOND ENGINEER")) return "2/E";
  if (u.includes("3RD ENGINEER") || u.includes("THIRD ENGINEER")) return "3/E";
  if (u.includes("CHIEF OFFICER") || u.includes("CHIEF MATE")) return "C/O";
  if (u.includes("2ND OFFICER") || u.includes("SECOND OFFICER")) return "2/O";
  if (u.includes("3RD OFFICER") || u.includes("THIRD OFFICER")) return "3/O";
  if (u.includes("MASTER") || u.includes("CAPTAIN")) return "MSTR";
  if (u.includes("ETO") || u.includes("ELECTRO")) return "ETO";
  if (u.includes("BOSUN")) return "BSN";
  if (u.includes("COOK")) return "CK";
  if (u === "CREW") return "⚓";
  return u.split(/\s+/).map((w) => w[0]).join("").slice(0, 3);
};

const rankClass = (r: string) => {
  const u = (r || "").toUpperCase();
  if (u === "SCF") return "mr-sys";
  if (u === "GUEST") return "mr-rat";
  if (u === "CO") return "mr-co";
  if (u.includes("CHIEF ENGINEER") || u.includes("MASTER") || u.includes("CAPTAIN")) return "mr-top";
  if (u.includes("ENGINEER") || u.includes("OFFICER") || u.includes("MATE") || u.includes("ETO")) return "mr-off";
  return "mr-rat";
};

export default async function MessRoomPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const mess = sp.mess;

  const supabase = await createClient();

  // Günlük tohum mesajı (günde 2 kez üretir; atılmışsa anında döner)
  await supabase.rpc("post_daily_brief");

  const [{ data: { session } }, { data: feedData }, { data: countData }] = await Promise.all([
    supabase.auth.getSession(),
    supabase.rpc("get_mess_feed", { lim: 40 }),
    supabase.rpc("get_mess_count_today"),
  ]);

  const user = session?.user ?? null;

  const msgs = (Array.isArray(feedData) ? feedData : []) as MessMsg[];
  const todayCount = (countData as number) || 0;

  // Girişli kullanıcının kendi handle'ı
  let myHandle: string | null = null;
  if (user) {
    const { data: me } = await supabase.from("profiles").select("handle").eq("id", user.id).maybeSingle();
    myHandle = (me?.handle as string) || null;
  }

  const fmtT = (d: string) =>
    new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <>
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --navy:#0d1030;--navy2:#141845;--ink:#050716;
    --gold:#fbbf24;--gold2:#e0a010;--line:rgba(251,191,36,.16);--line2:rgba(255,255,255,.08);
    --tx:#eef4fa;--tx2:#a8bdd2;--tx3:#6b83a0;--grn:#34d399;--blu:#60a5fa;
    --disp:var(--font-bricolage),sans-serif;--body:var(--font-jakarta),sans-serif;
  }
  html,body{height:100%}
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .room{max-width:760px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;padding:0 14px}
  .rhead{display:flex;align-items:center;gap:12px;padding:13px 2px;border-bottom:1px solid var(--line2);flex-shrink:0}
  .rback{color:var(--tx3);text-decoration:none;font-size:19px;padding:6px 10px 6px 0;flex-shrink:0}
  .rback:hover{color:var(--gold)}
  .rlive{width:10px;height:10px;border-radius:50%;background:var(--grn);flex-shrink:0;box-shadow:0 0 0 0 rgba(52,211,153,.55);animation:mrpulse 1.6s infinite}
  @keyframes mrpulse{0%{box-shadow:0 0 0 0 rgba(52,211,153,.55)}70%{box-shadow:0 0 0 9px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
  .rtitle{font-family:var(--disp);font-weight:800;font-size:16px;line-height:1.2}
  .rsub{font-size:10px;color:var(--tx3);margin-top:1px}
  .rfire{margin-left:auto;font-size:10.5px;font-weight:800;color:var(--gold);background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.3);border-radius:999px;padding:4px 11px;white-space:nowrap;flex-shrink:0}
  .rbody{flex:1;overflow-y:auto;padding:14px 2px;display:flex;flex-direction:column;gap:10px}
  .mrow{display:flex;gap:9px;align-items:flex-start;font-size:13px;line-height:1.55}
  .mbadge{flex-shrink:0;font-size:9px;font-weight:800;letter-spacing:.04em;border-radius:6px;padding:3px 7px;border:1px solid;margin-top:2px;min-width:36px;text-align:center}
  .mr-top{color:var(--gold);border-color:rgba(251,191,36,.4);background:rgba(251,191,36,.09)}
  .mr-off{color:var(--blu);border-color:rgba(96,165,250,.4);background:rgba(96,165,250,.09)}
  .mr-rat{color:var(--tx2);border-color:var(--line2);background:rgba(255,255,255,.04)}
  .mr-co{color:var(--blu);border-color:rgba(96,165,250,.4);background:rgba(96,165,250,.09)}
  .mr-sys{color:var(--tx3);border-color:var(--line2);background:rgba(255,255,255,.05)}
  .msys-row{background:rgba(255,255,255,.03);border:1px dashed var(--line2);border-radius:12px;padding:9px 11px}
  .mmain{min-width:0;flex:1}
  .mtop{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
  .mname{font-weight:800;font-family:var(--disp);background:none;border:none;color:var(--tx);cursor:pointer;font-size:13px;padding:0;text-decoration:underline dotted;text-underline-offset:3px}
  .mname:hover{color:var(--gold)}
  .mname-sys{font-weight:800;font-family:var(--disp);font-size:12.5px;color:var(--tx3)}
  .mvf{color:var(--grn);font-size:10px}
  .mtime{font-size:9.5px;color:var(--tx3)}
  .mdm{background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.35);color:var(--grn);border-radius:7px;font-size:10px;font-weight:800;padding:2px 8px;cursor:pointer;font-family:var(--body)}
  .mdm:hover{background:rgba(52,211,153,.18)}
  .mtext{color:var(--tx2);margin-top:2px;word-break:break-word}
  .rempty{margin:auto;text-align:center;font-size:13px;color:var(--tx3);line-height:1.7;max-width:42ch}
  .rempty b{color:var(--tx);font-family:var(--disp)}
  .rerr{flex-shrink:0;margin:8px 0 0;border-radius:11px;padding:10px 14px;font-size:12.5px;border:1px solid}
  .rerr.bad{color:#f87171;border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
  .rerr.slow{color:var(--gold);border-color:rgba(251,191,36,.3);background:rgba(251,191,36,.07)}
  .rform{flex-shrink:0;display:flex;gap:8px;padding:10px 0 6px;border-top:1px solid var(--line2)}
  .rinput{flex:1;background:var(--navy2);border:1px solid var(--line2);color:var(--tx);border-radius:12px;padding:12px 15px;font-family:var(--body);font-size:14px;outline:none}
  .rinput:focus{border-color:var(--gold)}
  .rsend{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border:none;border-radius:12px;padding:12px 18px;font-weight:800;font-size:13.5px;cursor:pointer;font-family:var(--body);white-space:nowrap}
  .rsend:hover{transform:translateY(-1px)}
  .rlock{flex-shrink:0;display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:12px 0;border-top:1px solid var(--line2)}
  .rlock p{font-size:12.5px;color:var(--tx2)}
  .rlock p b{color:var(--tx);font-family:var(--disp)}
  .rjoin{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-radius:10px;padding:10px 17px;font-weight:800;font-size:12.5px;text-decoration:none;white-space:nowrap}
  .rnote{flex-shrink:0;text-align:center;font-size:10px;color:var(--tx3);padding:0 0 10px}
  .glimit{flex-shrink:0;display:flex;flex-direction:column;gap:10px;padding:14px 15px;border-top:1px solid var(--line2);
    background:rgba(251,191,36,.06);border-radius:13px 13px 0 0;margin-top:6px}
  .glimit p{font-size:12.5px;color:var(--tx2);line-height:1.5}
  .glimit p b{color:var(--gold);font-family:var(--disp)}
  .glimit-row{display:flex;gap:9px;flex-wrap:wrap}
  .gbtn{flex:1;text-align:center;border-radius:10px;padding:10px 14px;font-weight:800;font-size:12.5px;text-decoration:none;white-space:nowrap}
  .gbtn.gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .gbtn.ghost{border:1px solid var(--line2);color:var(--tx)}
  .gnote{flex-shrink:0;text-align:center;font-size:10px;color:var(--tx3);padding:8px 0 4px}
`}</style>

      <div className="room">
        <div className="rhead">
          <Link href={user ? "/dashboard" : "/"} className="rback">←</Link>
          <span className="rlive"></span>
          <div style={{ minWidth: 0 }}>
            <div className="rtitle">💬 Chat Room</div>
            <div className="rsub">live crew chat, open 24/7 {myHandle ? "· you are @" + myHandle : ""}</div>
          </div>
          <span className="rfire">🔥 {todayCount} today</span>
        </div>

        {mess === "link" ? <div className="rerr bad">🚫 Links, emails and phone numbers are not allowed in the Chat Room.</div> : null}
        {mess === "slow" ? <div className="rerr slow">⏳ Easy sailor — one message every 10 seconds.</div> : null}
        {mess === "failed" ? <div className="rerr bad">Something went wrong — try again.</div> : null}

        <div className="rbody" id="mess-scroll">
          {msgs.length === 0 ? (
            <div className="rempty">
              <b>The chat room is quiet ☕</b><br />
              Grab a seat — rank talk, port gossip, contract news. Be the one who starts it.
            </div>
          ) : (
            msgs.map((m) => (
              <div key={m.id} className={"mrow " + (m.is_system ? "msys-row" : "")}>
                <span className={"mbadge " + rankClass(m.rank_label)}>{rankShort(m.rank_label)}</span>
                <div className="mmain">
                  <div className="mtop">
                    {m.is_system ? (
                      <span className="mname-sys">{m.display_name}</span>
                    ) : user && m.handle ? (
                      <button type="button" className="mname" data-handle={m.handle}>{m.display_name}</button>
                    ) : (
                      <span className="mname" style={{ textDecoration: "none", cursor: "default" }}>{m.display_name}</span>
                    )}
                    {m.is_system ? null : <span className="mvf">✓</span>}
                    <span className="mtime">{fmtT(m.created_at)}</span>
                    {!m.is_system && user && m.user_id && m.user_id !== user.id ? (
                      <form action={startConversation} style={{ display: "inline" }}>
                        <input type="hidden" name="toUserId" value={m.user_id} />
                        <button type="submit" className="mdm">💬 DM</button>
                      </form>
                    ) : null}
                  </div>
                  <div className="mtext">{m.body}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {user ? (
          <>
            <form action={sendMessRoomMessage} className="rform">
              <input type="hidden" name="backTo" value="/messroom" />
              <input className="rinput" id="mess-input" name="body" type="text" maxLength={300} placeholder="Say something to the crew… (tap a name to @mention)" autoComplete="off" required />
              <button type="submit" className="rsend">Send ⚓</button>
            </form>
            <div className="rnote">💨 Messages vanish after 24h · Links, emails &amp; phone numbers blocked · 1 message / 10s</div>
          </>
        ) : mess === "guestlimit" ? (
          <div className="glimit">
            <p><b>You've used today's 3 free messages.</b> Join free to keep chatting — unlimited messages, full names unlock, DM any member.</p>
            <div className="glimit-row">
              <Link href="/signup" className="gbtn gold">Create free account →</Link>
              <Link href="/login" className="gbtn ghost">Log in</Link>
            </div>
          </div>
        ) : (
          <>
            <form action={sendMessRoomMessage} className="rform">
              <input type="hidden" name="backTo" value="/messroom" />
              <input className="rinput" id="mess-input" name="body" type="text" maxLength={300} placeholder="Say something as a guest…" autoComplete="off" required />
              <button type="submit" className="rsend">Send ⚓</button>
            </form>
            <div className="gnote">👤 You're chatting as a guest — 3 free messages today · <Link href="/signup" style={{ color: "var(--gold)" }}>Join free</Link> for unlimited access</div>
          </>
        )}

        <MessRoomClient messageCount={msgs.length} />
      </div>
    </>
  );
}
