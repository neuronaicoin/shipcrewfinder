import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/password-reset";

export const metadata = { title: "Forgot Password — ShipCrewFinder" };

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const sent = sp.sent === "1";
  const error = sp.error === "1";

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
  body{font-family:var(--body);background:var(--navy);color:var(--tx);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
  .card{max-width:420px;width:100%;background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:22px;padding:34px 30px}
  .logo{display:flex;align-items:center;gap:9px;text-decoration:none;color:var(--tx);margin-bottom:22px;justify-content:center}
  .logo .ic{width:36px;height:36px;border-radius:10px;background:linear-gradient(145deg,var(--gold),var(--gold2));display:grid;place-items:center}
  .logo b{font-family:var(--disp);font-size:18px;font-weight:700}
  .logo b span{color:var(--gold)}
  h1{font-family:var(--disp);font-size:24px;font-weight:800;text-align:center;margin-bottom:8px}
  .sub{font-size:13.5px;color:var(--tx2);text-align:center;margin-bottom:26px;line-height:1.6}
  label{display:block;font-size:11.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--tx2);margin-bottom:7px}
  input{width:100%;background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:11px;padding:12px 15px;font-size:14px;outline:none;margin-bottom:18px}
  input:focus{border-color:var(--gold)}
  .btn{width:100%;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border:none;border-radius:11px;padding:13px;font-weight:800;font-size:14.5px;cursor:pointer}
  .banner{border-radius:11px;padding:13px 15px;font-size:13px;margin-bottom:18px;border:1px solid;line-height:1.55}
  .banner.ok{color:var(--grn);border-color:rgba(52,211,153,.35);background:rgba(52,211,153,.08)}
  .banner.err{color:#f87171;border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
  .back{display:block;text-align:center;margin-top:18px;color:var(--tx3);text-decoration:none;font-size:13px}
  .back:hover{color:var(--gold)}
`}</style>
      <div className="card">
        <Link href="/" className="logo">
          <span className="ic">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#0b0e13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2.4"/><line x1="12" y1="7.4" x2="12" y2="20.5"/><line x1="7.5" y1="10.4" x2="16.5" y2="10.4"/><path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7"/><path d="M4.5 14.8l-1.6-1.2M4.5 14.8l2-.4"/><path d="M19.5 14.8l1.6-1.2M19.5 14.8l-2-.4"/></svg>
          </span>
          <b>Ship<span>Crew</span>Finder</b>
        </Link>
        <h1>Forgot your password?</h1>
        <p className="sub">Enter your email and we&apos;ll send you a link to reset it.</p>

        {sent ? (
          <div className="banner ok">
            ✅ If an account exists for that email, a reset link has been sent. Check your
            inbox (and spam folder) — it should arrive within a minute.
          </div>
        ) : null}
        {error ? (
          <div className="banner err">Please enter a valid email address.</div>
        ) : null}

        {!sent ? (
          <form action={requestPasswordReset}>
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" required placeholder="you@example.com" />
            <button type="submit" className="btn">Send reset link ⚓</button>
          </form>
        ) : null}

        <Link href="/login" className="back">← Back to login</Link>
      </div>
    </>
  );
}
