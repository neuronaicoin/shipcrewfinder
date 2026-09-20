import Link from "next/link";

export default function VesselTrackerPromo() {
  return (
    <section className="vtpsec">
      <style>{`
  .vtpsec{padding:8px 0 6px}
  .vtp-wrap{max-width:1180px;margin:0 auto;padding:0 20px}
  .vtp-box{position:relative;overflow:hidden;border:1.5px solid var(--line,rgba(251,191,36,.3));
    border-radius:20px;background:linear-gradient(135deg,rgba(251,191,36,.09),var(--ink,#050716) 60%);
    padding:26px 26px}
  .vtp-in{position:relative;display:flex;align-items:center;gap:22px;flex-wrap:wrap;justify-content:space-between}
  .vtp-txt{flex:1;min-width:240px}
  .vtp-badge{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:800;
    letter-spacing:.07em;color:var(--gold,#fbbf24);background:rgba(251,191,36,.1);
    border:1px solid rgba(251,191,36,.4);border-radius:999px;padding:5px 13px;margin-bottom:10px}
  .vtp-dot{width:6px;height:6px;border-radius:50%;background:var(--grn,#34d399);animation:vtpulse 1.6s infinite}
  @keyframes vtpulse{0%,100%{opacity:1}50%{opacity:.4}}
  .vtp-h2{font-family:var(--disp,var(--font-bricolage),sans-serif);font-weight:800;
    font-size:clamp(1.2rem,2.6vw,1.55rem);line-height:1.2;letter-spacing:-.01em;margin-bottom:6px}
  .vtp-h2 span{color:var(--gold,#fbbf24)}
  .vtp-p{font-size:13.5px;color:var(--tx2,#a8bdd2);line-height:1.6;max-width:50ch}
  .vtp-cta{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--gold,#fbbf24),var(--gold2,#e0a010));
    color:#0b0e13;border-radius:12px;padding:13px 22px;font-weight:800;font-size:14px;text-decoration:none;white-space:nowrap}
  .vtp-cta:hover{transform:translateY(-2px)}
  @media(max-width:640px){
    .vtp-box{padding:20px 18px}
    .vtp-h2{font-size:1.15rem}
    .vtp-p{font-size:12.5px}
    .vtp-cta{width:100%;justify-content:center}
  }
      `}</style>
      <div className="vtp-wrap">
        <div className="vtp-box">
          <div className="vtp-in">
            <div className="vtp-txt">
              <div className="vtp-badge"><span className="vtp-dot"></span>LIVE AIS</div>
              <h2 className="vtp-h2">
                Track any vessel <span>live</span> — real-time on the map
              </h2>
              <p className="vtp-p">
                Search a ship by name and see its current position, speed and course, updating
                in real time. Free, no login needed.
              </p>
            </div>
            <Link href="/vessel-tracker" className="vtp-cta">🚢 Track a Vessel →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
