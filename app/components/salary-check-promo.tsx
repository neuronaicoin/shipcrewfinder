import Link from "next/link";

export default function SalaryCheckPromo() {
  return (
    <section className="scpsec">
      <style>{`
  .scpsec{padding:8px 0 6px}
  .scp-wrap{max-width:1180px;margin:0 auto;padding:0 20px}
  .scp-box{position:relative;overflow:hidden;border:1.5px solid rgba(52,211,153,.3);
    border-radius:20px;background:linear-gradient(135deg,rgba(52,211,153,.09),var(--ink,#050716) 60%);
    padding:30px 28px}
  .scp-glow{position:absolute;width:320px;height:320px;top:-160px;right:-100px;border-radius:50%;
    filter:blur(80px);opacity:.35;background:radial-gradient(circle,rgba(52,211,153,.4),transparent 65%);pointer-events:none}
  .scp-in{position:relative;display:flex;align-items:center;gap:26px;flex-wrap:wrap}
  .scp-txt{flex:1;min-width:260px}
  .scp-badge{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:800;
    letter-spacing:.07em;color:#34d399;background:rgba(52,211,153,.1);
    border:1px solid rgba(52,211,153,.4);border-radius:999px;padding:5px 13px;margin-bottom:12px}
  .scp-h2{font-family:var(--disp,var(--font-bricolage),sans-serif);font-weight:800;
    font-size:clamp(1.35rem,3vw,1.85rem);line-height:1.18;letter-spacing:-.01em;margin-bottom:10px}
  .scp-h2 span{color:var(--gold,#fbbf24)}
  .scp-p{font-size:14px;color:var(--tx2,#a8bdd2);line-height:1.65;max-width:52ch;margin-bottom:18px}
  .scp-cta{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--gold,#fbbf24),var(--gold2,#e0a010));
    color:#0b0e13;border-radius:12px;padding:13px 24px;font-weight:800;font-size:14px;text-decoration:none}
  .scp-cta:hover{transform:translateY(-2px)}
  .scp-note{font-size:11.5px;color:var(--tx3,#6b83a0);margin-top:10px}
  .scp-visual{width:220px;flex-shrink:0}
  .scp-gauge{height:12px;border-radius:999px;background:linear-gradient(90deg,#f87171,#fbbf24,#34d399);position:relative;margin-bottom:10px}
  .scp-marker{position:absolute;top:-6px;left:68%;width:4px;height:24px;background:#fff;border-radius:4px;box-shadow:0 0 0 3px rgba(255,255,255,.2)}
  .scp-vlabel{font-size:11px;color:var(--tx3,#6b83a0);text-align:center;font-weight:700}
  .scp-vresult{font-family:var(--disp,inherit);font-weight:800;font-size:14px;color:#34d399;text-align:center;margin-top:4px}
  @media(max-width:860px){.scp-visual{display:none}}
  @media(max-width:640px){
    .scp-box{padding:22px 18px}
    .scp-h2{font-size:1.3rem}
    .scp-p{font-size:13px}
    .scp-cta{width:100%;justify-content:center}
  }
`}</style>
      <div className="scp-wrap">
        <div className="scp-box">
          <div className="scp-glow"></div>
          <div className="scp-in">
            <div className="scp-txt">
              <div className="scp-badge">💰 FREE · ANONYMOUS · 10 SECONDS</div>
              <h2 className="scp-h2">
                How does your <span>salary</span> compare?
              </h2>
              <p className="scp-p">
                Enter your rank, vessel type and monthly wage — see instantly if you&apos;re below, at, or above the 2026 market rate. No signup required.
              </p>
              <Link href="/salary-check" className="scp-cta">Check My Salary →</Link>
              <p className="scp-note">Based on real, updated 2026 salary ranges</p>
            </div>
            <div className="scp-visual">
              <div className="scp-gauge">
                <div className="scp-marker"></div>
              </div>
              <div className="scp-vlabel">$4,200 — $9,500</div>
              <div className="scp-vresult">Upper Third of Range</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
