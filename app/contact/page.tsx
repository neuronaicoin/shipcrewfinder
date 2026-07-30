import Link from "next/link";
import { sendContactMessage } from "@/lib/actions/contact-form";

export const metadata = {
  title: "Contact Us — ShipCrewFinder",
  description:
    "Get in touch with the ShipCrewFinder team. Questions, feedback or partnership ideas — we read every message.",
  alternates: { canonical: "https://shipcrewfinder.com/contact" },
};

export default async function ContactPage({
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
  body.light{
    --navy:#f2f4fb;--navy2:#ffffff;--ink:#ffffff;
    --tx:#0e1730;--tx2:#2e3c5e;--tx3:#57678a;
    --line:rgba(224,160,16,.4);--line2:rgba(15,25,60,.12);
  }
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:640px;margin:0 auto;padding:0 20px}
  .top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 0}
  .logo{display:flex;align-items:center;gap:9px;text-decoration:none;color:var(--tx)}
  .logo .ic{width:34px;height:34px;border-radius:9px;background:linear-gradient(145deg,var(--gold),var(--gold2));display:grid;place-items:center}
  .logo b{font-family:var(--disp);font-size:17px;font-weight:700}
  .logo b span{color:var(--gold)}
  .back{color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600}
  .back:hover{color:var(--gold)}
  .hero{position:relative;padding:26px 0 10px;overflow:hidden}
  .aur{position:absolute;width:420px;height:420px;top:-240px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.4;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  h1{font-family:var(--disp);font-size:clamp(1.7rem,4vw,2.4rem);font-weight:800;letter-spacing:-.02em;line-height:1.15}
  .sub{font-size:14px;color:var(--tx2);margin-top:8px;line-height:1.6}
  section{padding:22px 0 60px}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:20px;padding:28px 26px}
  .banner{border-radius:13px;padding:14px 17px;font-size:13.5px;margin-bottom:18px;border:1px solid;line-height:1.6}
  .banner.ok{color:var(--grn);border-color:rgba(52,211,153,.35);background:rgba(52,211,153,.08)}
  .banner.err{color:#f87171;border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
  label{display:block;font-size:11.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--tx2);margin:0 0 7px}
  .field{margin-bottom:16px}
  input,textarea{width:100%;background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:11px;padding:12px 15px;font-family:var(--body);font-size:14px;outline:none;transition:.15s}
  body.light input,body.light textarea{background:#f4f6fc}
  input:focus,textarea:focus{border-color:var(--gold)}
  textarea{min-height:150px;resize:vertical}
  .hp{position:absolute;left:-9999px;opacity:0;height:0;overflow:hidden}
  .send{width:100%;display:inline-flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border:none;border-radius:12px;padding:14px;font-weight:800;font-size:14.5px;cursor:pointer;font-family:var(--body);transition:.18s;box-shadow:0 4px 20px rgba(251,191,36,.25)}
  .send:hover{transform:translateY(-2px)}
  .note{font-size:11.5px;color:var(--tx3);text-align:center;margin-top:12px;line-height:1.5}
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
          <Link href="/" className="back">← Back to home</Link>
        </div>
      </div>

      <div className="hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <h1>Contact us ⚓</h1>
          <p className="sub">
            Questions, feedback, partnership ideas — or just to say hello from your ship.
            We read every message and reply within 24–48 hours.
          </p>
        </div>
      </div>

      <section>
        <div className="wrap">
          {sent ? (
            <div className="banner ok">
              ✅ <b>Your message has been sent successfully.</b> Thank you — we&apos;ll get back
              to you at the email address you provided, usually within 24–48 hours.
            </div>
          ) : null}
          {error ? (
            <div className="banner err">
              Something went wrong — please check your name, email and message, then try again.
            </div>
          ) : null}

          <div className="card">
            <form action={sendContactMessage}>
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" type="text" required maxLength={120} placeholder="e.g. John Smith" />
              </div>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" required maxLength={200} placeholder="you@example.com" />
              </div>
              <div className="field">
                <label htmlFor="message">Your message</label>
                <textarea id="message" name="message" required maxLength={4000} placeholder="How can we help?" />
              </div>

              {/* bal küpü — insanlar görmez, botlar doldurur */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="company_website">Company website</label>
                <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <button type="submit" className="send">Send message ⚓</button>
              <p className="note">
                We&apos;ll only use your email to reply to this message. No spam, no lists.
              </p>
            </form>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/">Home</Link> · <Link href="/jobs">Jobs</Link> · <Link href="/salary">Salary Index</Link>
        </div>
      </footer>
    </>
  );
}
