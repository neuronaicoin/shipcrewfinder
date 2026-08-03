import { createClient } from "@/lib/supabase/server";

type LiveEvent = { type: string; text: string };
type LiveData = {
  crew_total: number;
  company_total: number;
  crew_week: number;
  countries_count: number;
  events: LiveEvent[];
};

export default async function LiveActivityStrip() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_live_activity");
  const d = (data as LiveData) || {
    crew_total: 0,
    company_total: 0,
    crew_week: 0,
    countries_count: 0,
    events: [],
  };

  const fallbackEvents: LiveEvent[] = [
    { type: "info", text: "New verified profiles join every day" },
  ];
  const events = d.events && d.events.length > 0 ? d.events : fallbackEvents;
  const jobEvent: LiveEvent = {
    type: "job",
    text: `${d.company_total} compan${d.company_total === 1 ? "y is" : "ies are"} actively hiring`,
  };
  const allEvents = [...events, jobEvent];
  // Kesintisiz döngü için listeyi ikiye katla (CSS marquee deseni)
  const loop = [...allEvents, ...allEvents];

  return (
    <section className="lasec">
      <style>{`
  .lasec{padding:14px 0 0}
  .la-wrap{max-width:1180px;margin:0 auto;padding:0 20px}
  .la-ticker{border:1px solid var(--line2,rgba(255,255,255,.08));border-radius:14px;background:rgba(255,255,255,.02);
    padding:12px 0;overflow:hidden;position:relative}
  .la-dot{width:8px;height:8px;border-radius:50%;background:var(--grn,#34d399);flex-shrink:0;
    box-shadow:0 0 0 0 rgba(52,211,153,.55);animation:lapulse 1.6s infinite;margin:0 14px}
  @keyframes lapulse{0%{box-shadow:0 0 0 0 rgba(52,211,153,.55)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
  .la-row{display:flex;align-items:center;white-space:nowrap}
  .la-track{display:flex;align-items:center;white-space:nowrap;animation:lascroll 32s linear infinite;width:max-content}
  .la-track:hover{animation-play-state:paused}
  @keyframes lascroll{to{transform:translateX(-50%)}}
  .la-item{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--tx2,#a8bdd2);padding:0 22px;
    border-right:1px solid var(--line2,rgba(255,255,255,.08))}
  .la-item b{color:var(--tx,#eef4fa);font-weight:700}
  .la-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}
  .la-stat{background:rgba(255,255,255,.03);border:1px solid var(--line2,rgba(255,255,255,.08));border-radius:12px;
    padding:12px 10px;text-align:center}
  .la-stat .n{font-family:var(--disp,var(--font-bricolage),sans-serif);font-weight:800;font-size:22px;color:var(--gold,#fbbf24)}
  .la-stat .l{font-size:11px;color:var(--tx3,#6b83a0);margin-top:2px}
  @media(max-width:640px){
    .la-item{font-size:12px;padding:0 16px}
    .la-stat .n{font-size:19px}
    .la-stat .l{font-size:10px}
  }
`}</style>
      <div className="la-wrap">
        <div className="la-ticker">
          <div className="la-row">
            <span className="la-dot"></span>
            <div style={{ overflow: "hidden", width: "100%" }}>
              <div className="la-track">
                {loop.map((e, i) => (
                  <span className="la-item" key={i}>
                    {e.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="la-stats">
          <div className="la-stat">
            <div className="n">{d.crew_week}</div>
            <div className="l">seafarers this week</div>
          </div>
          <div className="la-stat">
            <div className="n">🌍</div>
            <div className="l">Worldwide</div>
          </div>
          <div className="la-stat">
            <div className="n">{d.company_total}</div>
            <div className="l">companies hiring</div>
          </div>
        </div>
      </div>
    </section>
  );
}
