import Link from "next/link";

export default function DocumentReminderPromo() {
  return (
    <section className="dersec">
      <style>{`
  .dersec{padding:8px 0 6px}
  .der-wrap{max-width:1180px;margin:0 auto;padding:0 20px}
  .der-box{position:relative;overflow:hidden;border:1.5px solid rgba(239,68,68,.28);
    border-radius:20px;background:linear-gradient(135deg,rgba(239,68,68,.08),var(--ink,#050716) 60%);
    padding:30px 28px}
  .der-glow{position:absolute;width:320px;height:320px;top:-160px;right:-100px;border-radius:50%;
    filter:blur(80px);opacity:.3;background:radial-gradient(circle,rgba(239,68,68,.35),transparent 65%);pointer-events:none}
  .der-in{position:relative;display:flex;align-items:center;gap:26px;flex-wrap:wrap}
  .der-txt{flex:1;min-width:260px}
  .der-badge{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:800;
    letter-spacing:.07em;color:#f87171;background:rgba(239,68,68,.1);
    border:1px solid rgba(239,68,68,.4);border-radius:999px;padding:5px 13px;margin-bottom:12px}
  .der-h2{font-family:var(--disp,var(--font-bricolage),sans-serif);font-weight:800;
    font-size:clamp(1.35rem,3vw,1.85rem);line-height:1.18;letter-spacing:-.01em;margin-bottom:10px}
  .der-h2 span{color:var(--gold,#fbbf24)}
  .der-p{font-size:14px;color:var(--tx2,#a8bdd2);line-height:1.65;max-width:52ch;margin-bottom:18px}
  .der-steps{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:20px}
  .der-step{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--tx2,#a8bdd2);
    background:rgba(255,255,255,.03);border:1px solid var(--line2,rgba(255,255,255,.08));
    border-radius:999px;padding:6px 13px}
  .der-cta{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--gold,#fbbf24),var(--gold2,#e0a010));
    color:#0b0e13;border-radius:12px;padding:13px 24px;font-weight:800;font-size:14px;text-decoration:none}
  .der-cta:hover{transform:translateY(-2px)}
  .der-note{font-size:11.5px;color:var(--tx3,#6b83a0);margin-top:10px}
  .der-visual{width:220px;flex-shrink:0;display:flex;flex-direction:column;gap:8px}
  .der-vrow{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11.5px;background:rgba(255,255,255,.03);
    border:1px solid var(--line2,rgba(255,255,255,.08));border-radius:9px;padding:8px 10px;color:var(--tx2,#a8bdd2)}
  .der-vrow.warn{border-color:rgba(251,191,36,.35)}
  .der-vpill{font-size:10px;font-weight:800;padding:2px 8px;border-radius:999px}
  .der-vpill.warn{background:rgba(251,191,36,.15);color:#fbbf24}
  .der-vpill.ok{background:rgba(52,211,153,.15);color:#34d399}
  @media(max-width:860px){.der-visual{display:none}}
  @media(max-width:640px){
    .der-box{padding:22px 18px}
    .der-h2{font-size:1.3rem}
    .der-p{font-size:13px}
    .der-cta{width:100%;justify-content:center}
  }
`}</style>
      <div className="der-wrap">
        <div className="der-box">
          <div className="der-glow"></div>
          <div className="der-in">
            <div className="der-txt">
              <div className="der-badge">⏰ DOCUMENT EXPIRY REMINDER</div>
              <h2 className="der-h2">
                Never miss a <span>document renewal</span> again
              </h2>
              <p className="der-p">
                Passport, seaman&apos;s book, STCW, medical certificate — add your expiry dates and we&apos;ll email you before they lapse. Free, no extra signup.
              </p>
              <div className="der-steps">
                <span className="der-step">⚓ Add your dates</span>
                <span className="der-step">📧 We email you first</span>
                <span className="der-step">✓ Never caught off guard</span>
              </div>
              <Link href="/signup/crew" className="der-cta">Set Up Reminders →</Link>
              <p className="der-note">Free forever · takes under a minute</p>
            </div>
            <div className="der-visual">
              <div className="der-vrow warn">
                <span>Passport</span>
                <span className="der-vpill warn">58 days</span>
              </div>
              <div className="der-vrow">
                <span>STCW</span>
                <span className="der-vpill ok">OK</span>
              </div>
              <div className="der-vrow">
                <span>Medical Cert.</span>
                <span className="der-vpill ok">OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
