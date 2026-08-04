import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

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
  if (u === "CO") return "mr-co";
  if (u.includes("CHIEF ENGINEER") || u.includes("MASTER") || u.includes("CAPTAIN")) return "mr-top";
  if (u.includes("ENGINEER") || u.includes("OFFICER") || u.includes("MATE") || u.includes("ETO")) return "mr-off";
  return "mr-rat";
};

export default async function MessRoomBox() {
  const supabase = await createClient();

  // Günlük tohum mesajı (günde 1 kez üretir; atılmışsa anında döner)
  await supabase.rpc("post_daily_brief");

  const [{ data: feedData }, { data: countData }] = await Promise.all([
    supabase.rpc("get_mess_feed", { lim: 6 }),
    supabase.rpc("get_mess_count_today"),
  ]);

  const msgs = (Array.isArray(feedData) ? feedData : []) as MessMsg[];
  const todayCount = (countData as number) || 0;

  return (
    <section className="mrsec">
      <style>{`
  .mrsec{padding:0 0 34px}
  .mrbox{border:1.5px solid var(--line);border-radius:18px;overflow:hidden;background:linear-gradient(165deg,var(--navy2),var(--ink));box-shadow:0 0 22px rgba(251,191,36,.1)}
  .mrhead{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:13px 18px;border-bottom:1px solid var(--line2)}
  .mrhead h2{font-family:var(--disp);font-size:clamp(1.05rem,2.4vw,1.35rem);font-weight:800;letter-spacing:-.01em;display:flex;align-items:center;gap:10px}
  .mrlive{width:10px;height:10px;border-radius:50%;background:var(--grn);flex-shrink:0;box-shadow:0 0 0 0 rgba(52,211,153,.55);animation:mrpulse 1.6s infinite}
  @keyframes mrpulse{0%{box-shadow:0 0 0 0 rgba(52,211,153,.55)}70%{box-shadow:0 0 0 9px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
  .mrsub{font-size:11px;color:var(--tx3);margin-top:2px}
  .mrfire{font-size:11px;font-weight:800;color:var(--gold);background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.3);border-radius:999px;padding:5px 12px;white-space:nowrap}
  .mrfeed{padding:12px 18px;display:flex;flex-direction:column;gap:9px;min-height:120px}
  .mrrow{display:flex;gap:8px;align-items:flex-start;font-size:12.5px;line-height:1.5}
  .mrrow.sys{background:rgba(255,255,255,.03);border:1px dashed var(--line2);border-radius:10px;padding:7px 9px}
  .mrbadge{flex-shrink:0;font-size:9px;font-weight:800;letter-spacing:.04em;border-radius:6px;padding:3px 7px;border:1px solid;margin-top:1px;min-width:34px;text-align:center}
  .mr-top{color:var(--gold);border-color:rgba(251,191,36,.4);background:rgba(251,191,36,.09)}
  .mr-off{color:#60a5fa;border-color:rgba(96,165,250,.4);background:rgba(96,165,250,.09)}
  .mr-rat{color:var(--tx2);border-color:var(--line2);background:rgba(255,255,255,.04)}
  .mr-co{color:#60a5fa;border-color:rgba(96,165,250,.4);background:rgba(96,165,250,.09)}
  .mr-sys{color:var(--tx3);border-color:var(--line2);background:rgba(255,255,255,.05)}
  .mrname{font-weight:800;font-family:var(--disp)}
  .mrname.sysn{color:var(--tx3);font-size:12px}
  .mrvf{color:var(--grn);font-size:10px}
  .mrtext{color:var(--tx2)}
  .mrempty{margin:auto;text-align:center;font-size:12.5px;color:var(--tx3);line-height:1.7;padding:14px 0}
  .mrlock{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:12px 18px;border-top:1px solid var(--line2);background:rgba(251,191,36,.04)}
  .mrlock p{font-size:12px;color:var(--tx2)}
  .mrlock p b{color:var(--tx);font-family:var(--disp)}
  .mrjoin{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-radius:10px;padding:9px 16px;font-weight:800;font-size:12.5px;text-decoration:none;white-space:nowrap}
  .mrstrip{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 18px;background:rgba(255,255,255,.02);border-top:1px solid var(--line2);font-size:10.5px;color:var(--tx3)}
  .mrstrip a{color:var(--gold);font-weight:800;text-decoration:none;white-space:nowrap}
  .mrstrip a:hover{text-decoration:underline}
`}</style>

      <div className="wrap">
        <div className="mrbox">
          <div className="mrhead">
            <div>
              <h2><span className="mrlive"></span>💬 Chat Room</h2>
              <div className="mrsub">live crew chat, open 24/7</div>
            </div>
            <span className="mrfire">🔥 {todayCount} message{todayCount === 1 ? "" : "s"} today</span>
          </div>

          <div className="mrfeed">
            {msgs.length === 0 ? (
              <div className="mrempty">
                The chat room is quiet right now ☕<br />
                Members are talking rank changes, ports and contracts — join and say hello.
              </div>
            ) : (
              msgs.map((m) => (
                <div key={m.id} className={"mrrow " + (m.is_system ? "sys" : "")}>
                  <span className={"mrbadge " + rankClass(m.rank_label)}>{rankShort(m.rank_label)}</span>
                  <p style={{ margin: 0, minWidth: 0 }}>
                    {m.is_system ? (
                      <span className="mrname sysn">{m.display_name}</span>
                    ) : (
                      <>
                        <span className="mrname">{m.display_name}</span> <span className="mrvf">✓</span>
                      </>
                    )}{" "}
                    <span className="mrtext">— {m.body}</span>
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="mrlock">
            <p><b>Join free to talk</b> — names unlock, chat opens, companies and crew in one room.</p>
            <Link href="/signup" className="mrjoin">Join free ⚓</Link>
          </div>

          <div className="mrstrip">
            <span>💨 Messages vanish after 24h · Links &amp; emails blocked</span>
            <Link href="/messroom">Open full room →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
