import Link from "next/link";

export default function AiProfilePromo() {
  return (
    <section className="aipsec">
      <style>{`
  .aipsec{padding:8px 0 6px}
  .aip-wrap{max-width:1180px;margin:0 auto;padding:0 20px}
  .aip-box{position:relative;overflow:hidden;border:1.5px solid var(--line,rgba(251,191,36,.3));
    border-radius:20px;background:linear-gradient(135deg,rgba(251,191,36,.09),var(--ink,#050716) 60%);
    padding:30px 28px}
  .aip-glow{position:absolute;width:320px;height:320px;top:-160px;right:-100px;border-radius:50%;
    filter:blur(80px);opacity:.35;background:radial-gradient(circle,rgba(251,191,36,.4),transparent 65%);pointer-events:none}
  .aip-in{position:relative;display:flex;align-items:center;gap:26px;flex-wrap:wrap}
  .aip-txt{flex:1;min-width:260px}
  .aip-badge{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:800;
    letter-spacing:.07em;color:var(--gold,#fbbf24);background:rgba(251,191,36,.1);
    border:1px solid rgba(251,191,36,.4);border-radius:999px;padding:5px 13px;margin-bottom:12px}
  .aip-dot{width:6px;height:6px;border-radius:50%;background:var(--grn,#34d399);animation:aipulse 1.6s infinite}
  @keyframes aipulse{0%,100%{opacity:1}50%{opacity:.4}}
  .aip-h2{font-family:var(--disp,var(--font-bricolage),sans-serif);font-weight:800;
    font-size:clamp(1.35rem,3vw,1.85rem);line-height:1.18;letter-spacing:-.01em;margin-bottom:10px}
  .aip-h2 span{color:var(--gold,#fbbf24)}
  .aip-p{font-size:14px;color:var(--tx2,#a8bdd2);line-height:1.65;max-width:52ch;margin-bottom:18px}
  .aip-steps{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:20px}
  .aip-step{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--tx2,#a8bdd2);
    background:rgba(255,255,255,.03);border:1px solid var(--line2,rgba(255,255,255,.08));
    border-radius:999px;padding:6px 13px}
  .aip-step b{color:var(--gold,#fbbf24);font-family:var(--disp,inherit);font-weight:800}
  .aip-cta{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--gold,#fbbf24),var(--gold2,#e0a010));
    color:#0b0e13;border-radius:12px;padding:13px 24px;font-weight:800;font-size:14px;text-decoration:none}
  .aip-cta:hover{transform:translateY(-2px)}
  .aip-note{font-size:11.5px;color:var(--tx3,#6b83a0);margin-top:10px}
  .aip-visual{width:220px;flex-shrink:0;display:flex;flex-direction:column;gap:8px}
  .aip-vrow{display:flex;align-items:center;gap:8px;font-size:11.5px;background:rgba(255,255,255,.03);
    border:1px solid var(--line2,rgba(255,255,255,.08));border-radius:9px;padding:8px 10px;color:var(--tx2,#a8bdd2)}
  .aip-vrow.done{border-color:rgba(52,211,153,.35)}
  .aip-check{width:16px;height:16px;border-radius:50%;background:rgba(52,211,153,.15);color:var(--grn,#34d399);
    display:grid;place-items:center;font-size:10px;flex-shrink:0;font-weight:800}
  @media(max-width:860px){.aip-visual{display:none}}
  @media(max-width:640px){
    .aip-box{padding:22px 18px}
    .aip-h2{font-size:1.3rem}
    .aip-p{font-size:13px}
    .aip-cta{width:100%;justify-content:center}
  }
`}</style>
      <div className="aip-wrap">
        <div className="aip-box">
          <div className="aip-glow"></div>
          <div className="aip-in">
            <div className="aip-txt">
              <div className="aip-badge"><span className="aip-dot"></span>AI POWERED</div>
              <h2 className="aip-h2">
                Build your profile with <span>AI</span> — not a blank form
              </h2>
              <p className="aip-p">
                Upload photos of your certificates, seaman&apos;s book and medical — our AI reads
                them, fills your profile, builds your CV and tracks every expiry date. No typing.
              </p>
              <div className="aip-steps">
                <span className="aip-step"><b>1</b> Upload documents</span>
                <span className="aip-step"><b>2</b> AI reads and fills</span>
                <span className="aip-step"><b>3</b> Profile is ready</span>
              </div>
              <Link href="/signup/crew" className="aip-cta">Try it free ⚓</Link>
              <p className="aip-note">Free to join · takes under 2 minutes</p>
            </div>
            <div className="aip-visual">
              <div className="aip-vrow done"><span className="aip-check">✓</span> STCW certificate</div>
              <div className="aip-vrow done"><span className="aip-check">✓</span> Medical certificate</div>
              <div className="aip-vrow done"><span className="aip-check">✓</span> Seaman&apos;s book</div>
              <div className="aip-vrow"><span className="aip-check">···</span> Profile 85% complete</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
