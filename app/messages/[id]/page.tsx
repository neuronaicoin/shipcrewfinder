import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { sendMessage } from "@/lib/actions/messages";
import ChatRefresh from "@/app/components/chat-refresh";

export const metadata = {
  title: "Conversation — ShipCrewFinder",
};

export default async function ConversationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const err = sp.err;

  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!user) redirect("/login");

  // Konuşma + katılım kontrolü
  const { data: conv } = await supabase
    .from("conversations")
    .select("id, p1, p2")
    .eq("id", id)
    .maybeSingle();

  if (!conv || (conv.p1 !== user.id && conv.p2 !== user.id)) notFound();

  const otherId = conv.p1 === user.id ? (conv.p2 as string) : (conv.p1 as string);

  // Karşı taraf bilgisi + mesajlar (son 24 saat — RLS zaten filtreler)
  const [{ data: otherProf }, { data: sd }, { data: cd }, { data: msgs }] = await Promise.all([
    supabase.from("profiles").select("full_name, user_type").eq("id", otherId).maybeSingle(),
    supabase.from("seafarer_details").select("rank").eq("id", otherId).maybeSingle(),
    supabase.from("company_details").select("company_name").eq("id", otherId).maybeSingle(),
    supabase
      .from("messages")
      .select("id, sender_id, body, created_at")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true })
      .limit(200),
  ]);

  const isCo = (otherProf?.user_type as string) === "company";
  const otherName = isCo
    ? ((cd?.company_name as string) || (otherProf?.full_name as string) || "Company")
    : ((otherProf?.full_name as string) || "Crew member");
  const otherSub = isCo ? "🏢 Company" : "⚓ " + ((sd?.rank as string) || "Crew");

  const messages = msgs || [];

  // Karşı tarafın mesajlarını okundu işaretle
  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", id)
    .neq("sender_id", user.id)
    .is("read_at", null);

  const fmtT = (d: string) =>
    new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  const initials = isCo ? "🏢" : otherName.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

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
  body.light{
    --navy:#f2f4fb;--navy2:#ffffff;--ink:#ffffff;
    --tx:#0e1730;--tx2:#2e3c5e;--tx3:#57678a;
    --line:rgba(224,160,16,.4);--line2:rgba(15,25,60,.12);
  }
  html,body{height:100%}
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .chat{max-width:720px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;padding:0 14px}
  .chead{display:flex;align-items:center;gap:12px;padding:14px 4px;border-bottom:1px solid var(--line2);flex-shrink:0}
  .cback{color:var(--tx3);text-decoration:none;font-size:19px;padding:6px 10px 6px 0;flex-shrink:0}
  .cback:hover{color:var(--gold)}
  .cava{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;font-family:var(--disp);font-weight:800;font-size:15px;flex-shrink:0}
  .cava.crew{background:rgba(251,191,36,.13);color:var(--gold);border:1px solid rgba(251,191,36,.35)}
  .cava.co{background:rgba(96,165,250,.12);color:var(--blu);border:1px solid rgba(96,165,250,.35);font-size:17px}
  .cname{font-family:var(--disp);font-weight:800;font-size:15px}
  .csub{font-size:10.5px;color:var(--tx3);font-weight:700;letter-spacing:.04em;margin-top:1px}
  .ttl{margin-left:auto;font-size:10px;color:var(--gold);background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.3);border-radius:999px;padding:4px 10px;font-weight:700;white-space:nowrap}
  .cbody{flex:1;overflow-y:auto;padding:16px 2px;display:flex;flex-direction:column;gap:9px}
  .bub{max-width:78%;border-radius:15px;padding:10px 14px;font-size:13.5px;line-height:1.55;word-break:break-word}
  .bub .t{display:block;font-size:9.5px;opacity:.6;margin-top:4px;text-align:right}
  .bub.me{align-self:flex-end;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-bottom-right-radius:5px}
  .bub.them{align-self:flex-start;background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-bottom-left-radius:5px}
  .cempty{margin:auto;text-align:center;font-size:13px;color:var(--tx3);line-height:1.7;max-width:40ch}
  .cempty b{color:var(--tx);font-family:var(--disp)}
  .cerr{flex-shrink:0;margin:0 0 8px;border-radius:11px;padding:10px 14px;font-size:12.5px;color:#f87171;border:1px solid rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
  .cform{flex-shrink:0;display:flex;gap:8px;padding:10px 0 14px;border-top:1px solid var(--line2)}
  .cinput{flex:1;background:var(--navy2);border:1px solid var(--line2);color:var(--tx);border-radius:12px;padding:12px 15px;font-family:var(--body);font-size:14px;outline:none}
  .cinput:focus{border-color:var(--gold)}
  .csend{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border:none;border-radius:12px;padding:12px 20px;font-weight:800;font-size:13.5px;cursor:pointer;font-family:var(--body);white-space:nowrap}
  .csend:hover{transform:translateY(-1px)}
  .cnote{flex-shrink:0;text-align:center;font-size:10px;color:var(--tx3);padding-bottom:10px}
`}</style>

      <div className="chat">
        <div className="chead">
          <Link href="/messages" className="cback">←</Link>
          <span className={"cava " + (isCo ? "co" : "crew")}>{initials}</span>
          <div style={{ minWidth: 0 }}>
            <div className="cname">{otherName}</div>
            <div className="csub">{otherSub}</div>
          </div>
          <span className="ttl">💨 24h</span>
        </div>

        {err === "link" ? <div className="cerr" style={{ marginTop: 8 }}>🚫 Links and email addresses are not allowed.</div> : null}

        <div className="cbody" id="chat-scroll">
          {messages.length === 0 ? (
            <div className="cempty">
              <b>Say hello ⚓</b><br />
              This is a direct line — no agency in between. Messages vanish after 24 hours, so exchange what matters.
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id as string} className={"bub " + (m.sender_id === user.id ? "me" : "them")}>
                {m.body as string}
                <span className="t">{fmtT(m.created_at as string)}</span>
              </div>
            ))
          )}
        </div>

        <form action={sendMessage} className="cform">
          <input type="hidden" name="conversationId" value={id} />
          <input className="cinput" name="body" type="text" maxLength={2000} placeholder="Write a message…" autoComplete="off" required />
          <button type="submit" className="csend">Send ⚓</button>
        </form>
        <div className="cnote">💨 Messages auto-delete after 24 hours · Links &amp; emails are blocked</div>

        <ChatRefresh messageCount={messages.length} />
      </div>
    </>
  );
}
