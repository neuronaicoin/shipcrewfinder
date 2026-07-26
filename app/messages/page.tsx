import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";

export const metadata = {
  title: "Messages — ShipCrewFinder",
};

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const err = sp.err;

  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!user) redirect("/login");

  const [{ data: profile }, { count: unreadCount }, { data: convs }] = await Promise.all([
    supabase.from("profiles").select("user_type").eq("id", user.id).single(),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false),
    supabase
      .from("conversations")
      .select("id, p1, p2, last_message_at, last_message_preview")
      .or("p1.eq." + user.id + ",p2.eq." + user.id)
      .order("last_message_at", { ascending: false })
      .limit(50),
  ]);

  const convList = convs || [];
  const otherIds = convList.map((c) => (c.p1 === user.id ? (c.p2 as string) : (c.p1 as string)));

  // Karşı tarafların profilleri + rank/şirket bilgisi + okunmamış sayıları
  let others: Record<string, { name: string; sub: string; type: string }> = {};
  let unreadMap: Record<string, number> = {};

  if (otherIds.length > 0) {
    const [{ data: profs }, { data: sds }, { data: cds }, { data: unreadMsgs }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, user_type").in("id", otherIds),
      supabase.from("seafarer_details").select("id, rank").in("id", otherIds),
      supabase.from("company_details").select("id, company_name").in("id", otherIds),
      supabase
        .from("messages")
        .select("conversation_id, sender_id, read_at")
        .in("conversation_id", convList.map((c) => c.id as string))
        .is("read_at", null),
    ]);

    const rankMap: Record<string, string> = {};
    (sds || []).forEach((r) => { rankMap[r.id as string] = (r.rank as string) || ""; });
    const coMap: Record<string, string> = {};
    (cds || []).forEach((r) => { coMap[r.id as string] = (r.company_name as string) || ""; });

    (profs || []).forEach((p) => {
      const id = p.id as string;
      const t = (p.user_type as string) || "";
      others[id] = {
        name: t === "company" ? (coMap[id] || (p.full_name as string) || "Company") : ((p.full_name as string) || "Crew member"),
        sub: t === "company" ? "🏢 Company" : "⚓ " + (rankMap[id] || "Crew"),
        type: t,
      };
    });

    (unreadMsgs || []).forEach((m) => {
      if (m.sender_id !== user.id) {
        const cid = m.conversation_id as string;
        unreadMap[cid] = (unreadMap[cid] || 0) + 1;
      }
    });
  }

  const fmtTime = (d: string) => {
    const t = new Date(d);
    const diff = Date.now() - t.getTime();
    if (diff < 3600000) return Math.max(1, Math.round(diff / 60000)) + "m ago";
    if (diff < 86400000) return Math.round(diff / 3600000) + "h ago";
    return t.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

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
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:760px;margin:0 auto;padding:0 20px}
  .m-hero{position:relative;padding:34px 0 16px;overflow:hidden}
  .aur{position:absolute;width:420px;height:420px;top:-230px;right:-110px;border-radius:50%;filter:blur(90px);opacity:.4;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:14px}
  .back:hover{color:var(--gold)}
  h1{font-family:var(--disp);font-size:clamp(1.6rem,4vw,2.3rem);font-weight:800;letter-spacing:-.02em;line-height:1.1;margin-bottom:6px}
  .sub{font-size:13px;color:var(--tx2)}
  .ttl24{display:inline-flex;align-items:center;gap:7px;margin-top:12px;font-size:11.5px;font-weight:700;color:var(--gold);background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.3);border-radius:999px;padding:6px 14px}
  section{padding:16px 0 46px}
  .banner{border-radius:13px;padding:13px 17px;font-size:13px;margin-bottom:14px;border:1px solid;color:#f87171;border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
  .clist{display:flex;flex-direction:column;gap:9px}
  .crow{display:flex;align-items:center;gap:13px;background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:15px;padding:14px 16px;text-decoration:none;color:var(--tx);transition:.18s;position:relative}
  .crow:hover{border-color:var(--gold);transform:translateY(-1px)}
  .cava{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;font-family:var(--disp);font-weight:800;font-size:16px;flex-shrink:0}
  .cava.crew{background:rgba(251,191,36,.13);color:var(--gold);border:1px solid rgba(251,191,36,.35)}
  .cava.co{background:rgba(96,165,250,.12);color:var(--blu);border:1px solid rgba(96,165,250,.35);font-size:18px}
  .cmain{min-width:0;flex:1}
  .cname{font-family:var(--disp);font-weight:800;font-size:14.5px;display:flex;align-items:center;gap:8px}
  .csub{font-size:10.5px;color:var(--tx3);font-weight:700;letter-spacing:.04em;margin-top:1px}
  .cprev{font-size:12px;color:var(--tx2);margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .cmeta{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0}
  .ctime{font-size:10.5px;color:var(--tx3);white-space:nowrap}
  .cunread{min-width:22px;height:22px;border-radius:999px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;font-size:11px;font-weight:800;display:grid;place-items:center;padding:0 6px}
  .empty{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1.5px dashed rgba(251,191,36,.4);border-radius:18px;padding:38px 24px;text-align:center}
  .empty b{font-family:var(--disp);font-size:16px;display:block;margin-bottom:8px}
  .empty p{font-size:13px;color:var(--tx2);line-height:1.65;max-width:46ch;margin:0 auto 16px}
  .ebtn{display:inline-flex;align-items:center;gap:7px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-radius:11px;padding:11px 19px;font-weight:800;font-size:13px;text-decoration:none}
  footer{border-top:1px solid var(--line2);padding:26px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader
        isLoggedIn={true}
        userType={(profile?.user_type as "seafarer" | "yacht" | "company" | null) || null}
        unreadCount={unreadCount || 0}
        active={null}
      />

      <div className="m-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/dashboard" className="back">← Back to dashboard</Link>
          <h1>💬 <span style={{ color: "var(--gold)" }}>Messages</span></h1>
          <p className="sub">Direct conversations — crew and companies, no middleman.</p>
          <div className="ttl24">💨 Messages auto-delete after 24 hours — save important details</div>
        </div>
      </div>

      <section>
        <div className="wrap">
          {err === "link" ? <div className="banner">🚫 Links and email addresses are not allowed in messages.</div> : null}
          {err === "notfound" ? <div className="banner">User not found.</div> : null}
          {err === "failed" ? <div className="banner">Something went wrong — please try again.</div> : null}

          {convList.length === 0 ? (
            <div className="empty">
              <b>No conversations yet 💬</b>
              <p>Start one from the Crew Board — open any card and tap Message. Every conversation lives for 24 hours, then vanishes.</p>
              <Link href="/deck" className="ebtn">Open Crew Board →</Link>
            </div>
          ) : (
            <div className="clist">
              {convList.map((c) => {
                const otherId = c.p1 === user.id ? (c.p2 as string) : (c.p1 as string);
                const o = others[otherId] || { name: "Member", sub: "⚓ Crew", type: "seafarer" };
                const unread = unreadMap[c.id as string] || 0;
                const isCo = o.type === "company";
                const initials = isCo ? "🏢" : o.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <Link key={c.id as string} href={"/messages/" + (c.id as string)} className="crow">
                    <span className={"cava " + (isCo ? "co" : "crew")}>{initials}</span>
                    <span className="cmain">
                      <span className="cname">{o.name}</span>
                      <span className="csub" style={{ display: "block" }}>{o.sub}</span>
                      <span className="cprev" style={{ display: "block" }}>{(c.last_message_preview as string) || "…"}</span>
                    </span>
                    <span className="cmeta">
                      <span className="ctime">{fmtTime(c.last_message_at as string)}</span>
                      {unread > 0 ? <span className="cunread">{unread}</span> : null}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="wrap">
          <Link href="/dashboard">Dashboard</Link> · <Link href="/deck">Crew Board</Link> · <Link href="/jobs">Jobs</Link>
        </div>
      </footer>
    </>
  );
}
