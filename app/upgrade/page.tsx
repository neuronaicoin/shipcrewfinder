import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SiteHeader from "@/app/components/site-header";
import Link from "next/link";
import { getPlanAccess } from "@/lib/plan-access";
import { requestUpgrade } from "@/lib/actions/upgrade-request";

export const metadata = {
  title: "Upgrade Your Plan — ShipCrewFinder",
};

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const requested = sp.requested;

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!user) redirect("/login");

  const [{ data: me }, { count: unreadCount }] = await Promise.all([
    supabase.from("profiles").select("user_type, plan").eq("id", user.id).single(),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false),
  ]);

  if (!me || me.user_type !== "company") redirect("/dashboard");

  const currentPlan = (me.plan as string) || "free";
  const access = getPlanAccess(currentPlan as never);

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
  .wrap{max-width:960px;margin:0 auto;padding:0 20px}
  .up-hero{position:relative;padding:38px 0 20px;overflow:hidden}
  .aur{position:absolute;width:460px;height:460px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.45;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;margin-bottom:16px}
  .back:hover{color:var(--gold)}
  h1{font-family:var(--disp);font-size:clamp(1.8rem,4.4vw,2.6rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:10px}
  .sub{font-size:14.5px;color:var(--tx2);max-width:60ch}
  .curplan{display:inline-flex;align-items:center;gap:8px;margin-top:14px;font-size:12.5px;font-weight:700;color:var(--gold);background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.3);border-radius:999px;padding:6px 14px}
  section{padding:22px 0 50px}
  .banner{border-radius:13px;padding:16px 19px;font-size:13.5px;margin-bottom:22px;border:1.5px solid;line-height:1.6}
  .banner.ok{color:var(--grn);border-color:rgba(52,211,153,.35);background:rgba(52,211,153,.08)}
  .cplans{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  @media(max-width:760px){.cplans{grid-template-columns:1fr}}
  .cplan{background:linear-gradient(165deg,var(--navy2),var(--navy));border:1px solid var(--line2);border-radius:20px;padding:28px;position:relative}
  .cplan.hot{border:1.5px solid var(--gold);box-shadow:0 20px 50px rgba(0,0,0,.35)}
  .hot-tag{position:absolute;top:-12px;left:24px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--ink);font-size:10.5px;font-weight:800;letter-spacing:.08em;border-radius:7px;padding:4px 11px}
  .cplan h2{font-family:var(--disp);font-size:20px;font-weight:800;margin-bottom:4px}
  .cfor{font-size:12.5px;color:var(--tx3);margin-bottom:16px}
  .free-strip{display:inline-flex;align-items:center;gap:8px;background:rgba(52,211,153,.12);color:var(--grn);border:1px solid rgba(52,211,153,.3);border-radius:10px;padding:8px 14px;font-size:13px;font-weight:700;margin-bottom:14px}
  .pnum{font-family:var(--disp);font-weight:800;font-size:38px;letter-spacing:-.02em}
  .pnum small{font-size:15px;color:var(--tx3);font-weight:600}
  .pper{font-size:12.5px;color:var(--tx3);margin-bottom:18px}
  .plist{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:22px}
  .plist li{font-size:13.5px;display:flex;gap:10px;align-items:flex-start}
  .plist li::before{content:'✓';color:var(--grn);font-weight:800;flex-shrink:0}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:12px 20px;font-family:var(--body);width:100%}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-gold:hover{transform:translateY(-2px)}
  .btn-ghost{color:var(--tx);border:1px solid var(--line2);background:transparent}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
  .btn-done{background:rgba(52,211,153,.12);color:var(--grn);border:1.5px solid rgba(52,211,153,.4);cursor:default}
  .note{text-align:center;font-size:12px;color:var(--tx3);margin-top:26px;line-height:1.6}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader
        isLoggedIn={true}
        userType="company"
        unreadCount={unreadCount || 0}
        active={null}
      />
      <div className="up-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/dashboard" className="back">← Back to dashboard</Link>
          <h1>Hire verified crew — <span style={{ color: "var(--gold)" }}>without agency fees</span></h1>
          <p className="sub">
            Every profile is document-checked before it goes live. Try the full platform free for a month, see the crew pool for yourself — then decide.
          </p>
          <div className="curplan">● Current plan: {access.label}</div>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {requested ? (
            <div className="banner ok">
              ✅ <b>Request received.</b> We&apos;ll send payment details (bank transfer) to your
              account email within 24 hours. Once payment is confirmed, your{" "}
              {requested === "fleet" ? "Fleet" : "Pro"} plan is activated the same day.
            </div>
          ) : null}

          <div className="cplans">
            <div className="cplan hot">
              <div className="hot-tag">MOST POPULAR</div>
              <h2>Pro</h2>
              <div className="cfor">For active fleets & crewing departments</div>
              <div className="free-strip">🎁 FIRST MONTH FREE</div>
              <div className="pnum">$299.90 <small>/ month</small></div>
              <div className="pper">after your free month · cancel anytime</div>
              <ul className="plist">
                <li><b style={{ color: "var(--gold)" }}>100 full CV views / month</b></li>
                <li>Post up to 10 job listings</li>
                <li>Advanced search — rank, vessel type, availability</li>
                <li>Direct messaging with crew</li>
                <li>Save & shortlist candidates</li>
                <li>Verified company badge</li>
              </ul>
              {requested === "pro" ? (
                <span className="btn btn-done">✓ Request sent — check your email</span>
              ) : (
                <form action={requestUpgrade}>
                  <input type="hidden" name="plan" value="pro" />
                  <button type="submit" className="btn btn-gold">Request payment details →</button>
                </form>
              )}
            </div>

            <div className="cplan">
              <h2>Fleet</h2>
              <div className="cfor">For large fleets, managers & crewing agencies</div>
              <div className="free-strip">🎁 FIRST MONTH FREE</div>
              <div className="pnum">$499.90 <small>/ month</small></div>
              <div className="pper">after your free month · cancel anytime</div>
              <ul className="plist">
                <li>Everything in Pro</li>
                <li><b style={{ color: "var(--gold)" }}>Unlimited full CV views</b></li>
                <li>Unlimited job listings</li>
                <li>Multiple user seats for your team</li>
                <li>Bulk shortlist & export</li>
                <li>Priority support & onboarding</li>
                <li>API / ATS integration</li>
              </ul>
              {requested === "fleet" ? (
                <span className="btn btn-done">✓ Request sent — check your email</span>
              ) : (
                <form action={requestUpgrade}>
                  <input type="hidden" name="plan" value="fleet" />
                  <button type="submit" className="btn btn-ghost" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>Request payment details →</button>
                </form>
              )}
            </div>
          </div>

          <p className="note">
            We use secure bank transfer for payments. After requesting, our team sends transfer
            details to your registered email — plans activate within 24 hours of confirmed payment.
          </p>
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/dashboard">Dashboard</Link> · <Link href="/contact">Contact</Link>
        </div>
      </footer>
    </>
  );
}
