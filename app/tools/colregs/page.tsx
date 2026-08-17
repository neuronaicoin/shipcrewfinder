'use client';
import { useState } from 'react';
import Link from 'next/link';

type SectionKey = 'lookout' | 'steering' | 'lights' | 'sound';

interface Item { rule: string; title: string; body: string[]; }
interface Sec { key: SectionKey; name: string; items: Item[]; }

const SECTIONS: Sec[] = [
  {
    key: 'lookout', name: 'Look-Out, Speed & Risk of Collision',
    items: [
      { rule: 'Rule 5', title: 'Look-Out', body: ['Every vessel must maintain a proper look-out by sight and hearing, as well as by all available means appropriate to the circumstances — including radar and AIS where fitted — to make a full appraisal of the situation and risk of collision.'] },
      { rule: 'Rule 6', title: 'Safe Speed', body: ['Every vessel must proceed at all times at a safe speed, allowing proper and effective action to avoid collision and to be stopped within a distance appropriate to the prevailing circumstances and conditions.', 'Factors to consider include visibility, traffic density, manoeuvrability, background lights at night, wind/sea/current, draft in relation to depth, and radar characteristics if fitted.'] },
      { rule: 'Rule 7', title: 'Risk of Collision', body: ['Risk of collision must be deemed to exist if the compass bearing of an approaching vessel does not appreciably change — this is the classic "steady bearing, decreasing range" indicator.', 'Assumptions must never be made on the basis of scanty information, especially scanty radar information.'] },
      { rule: 'Rule 8', title: 'Action to Avoid Collision', body: ['Any action to avoid collision must be positive, made in ample time, and with due regard to good seamanship.', 'Alterations of course and/or speed should be large enough to be readily apparent to the other vessel, avoiding a succession of small changes.'] },
    ],
  },
  {
    key: 'steering', name: 'Steering & Sailing Rules',
    items: [
      { rule: 'Rule 9', title: 'Narrow Channels', body: ['A vessel proceeding along a narrow channel or fairway must keep as near to the outer limit of the channel on her starboard side as is safe and practicable.', 'A vessel must not impede the passage of a vessel that can only navigate safely within the channel, and must not cross a channel if this would impede such a vessel.'] },
      { rule: 'Rule 10', title: 'Traffic Separation Schemes', body: ['Vessels using a Traffic Separation Scheme must proceed in the appropriate lane in the general direction of traffic flow, and avoid crossing traffic lanes except as nearly as practicable at right angles.', 'A vessel not using a TSS must avoid it by as wide a margin as practicable.'] },
      { rule: 'Rule 13', title: 'Overtaking', body: ['A vessel overtaking any other must keep out of the way of the vessel being overtaken. A vessel is deemed to be overtaking when coming up from a direction more than 22.5 degrees abaft the other vessel\u2019s beam.', 'This rule applies until the overtaking vessel is finally past and clear — the overtaking vessel remains the give-way vessel throughout, even if the relative positions later change.'] },
      { rule: 'Rule 14', title: 'Head-On Situation', body: ['When two power-driven vessels are meeting on reciprocal or nearly reciprocal courses so as to involve risk of collision, each must alter course to starboard so that each passes on the port side of the other.'] },
      { rule: 'Rule 15', title: 'Crossing Situation', body: ['When two power-driven vessels are crossing so as to involve risk of collision, the vessel which has the other on her own starboard side must keep out of the way — in short: the vessel seeing the other on her starboard bow is the give-way vessel.'] },
      { rule: 'Rule 16', title: 'Action by Give-Way Vessel', body: ['The give-way vessel must take early and substantial action to keep well clear.'] },
      { rule: 'Rule 17', title: 'Action by Stand-On Vessel', body: ['The stand-on vessel should generally keep her course and speed, but may take action to avoid collision as soon as it becomes apparent that the give-way vessel is not taking appropriate action — and must take action if collision cannot be avoided by the give-way vessel alone.'] },
      { rule: 'Rule 18', title: 'Responsibilities Between Vessels', body: ['A general hierarchy applies: power-driven vessels underway must generally keep out of the way of vessels not under command, vessels restricted in their ability to manoeuvre, vessels engaged in fishing, and sailing vessels — subject to the specific rules for narrow channels, TSS, and overtaking.'] },
      { rule: 'Rule 19', title: 'Conduct in Restricted Visibility', body: ['In or near restricted visibility, every vessel must proceed at a safe speed adapted to the circumstances, with engines ready for immediate manoeuvre.', 'A vessel detecting another only by radar should determine if a close-quarters situation is developing, and take avoiding action in ample time — avoiding an alteration of course toward a vessel forward of the beam (other than when overtaking), and avoiding an alteration toward a vessel abeam or abaft the beam.'] },
    ],
  },
  {
    key: 'lights', name: 'Lights & Shapes (Overview)',
    items: [
      { rule: 'Rule 21', title: 'Definitions', body: ['Masthead light: white light over the fore-and-aft centreline, visible over an arc from right ahead to 22.5° abaft the beam on each side.', 'Sidelights: green (starboard) and red (port), each visible from right ahead to 22.5° abaft the beam on their respective side.', 'Sternlight: white light as near the stern as practicable, visible over the arc astern not covered by the masthead light.', 'All-round light: shows an unbroken light over 360°.'] },
      { rule: 'Rule 23', title: 'Power-Driven Vessels Underway', body: ['A power-driven vessel underway must exhibit a masthead light forward, a second masthead light abaft and higher than the forward one (if 50m or more in length), sidelights, and a sternlight.'] },
      { rule: 'Rule 30', title: 'Anchored Vessels', body: ['A vessel at anchor must exhibit an all-round white light (or, if 50m+ in length, two) where it can best be seen, plus a black ball shape by day.'] },
    ],
  },
  {
    key: 'sound', name: 'Sound & Light Signals',
    items: [
      { rule: 'Rule 34', title: 'Manoeuvring and Warning Signals', body: ['One short blast: "I am altering my course to starboard."', 'Two short blasts: "I am altering my course to port."', 'Three short blasts: "I am operating astern propulsion."', 'Five or more short and rapid blasts: the danger/doubt signal — used when in doubt about the other vessel\u2019s actions or intentions, or to draw attention.'] },
      { rule: 'Rule 35', title: 'Sound Signals in Restricted Visibility', body: ['A power-driven vessel underway and making way sounds one prolonged blast at intervals of not more than 2 minutes.', 'A power-driven vessel underway but stopped, making no way, sounds two prolonged blasts in succession at intervals of not more than 2 minutes.', 'A vessel at anchor rings a bell rapidly for about 5 seconds at intervals of not more than 1 minute (and, if 100m+ in length, also sounds a gong).'] },
    ],
  },
];

export default function ColregsPage() {
  const [tab, setTab] = useState<SectionKey>('lookout');
  const active = SECTIONS.find((s) => s.key === tab)!;

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .cr-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .cr-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .cr-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .cr-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .cr-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .cr-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
        .cr-tab{background:transparent;color:#6b83a0;border:1px solid rgba(255,255,255,.12);padding:9px 14px;font-size:12px;font-weight:700;cursor:pointer;border-radius:9px;font-family:inherit}
        .cr-tab.active{background:#fbbf24;color:#0b0e13;border-color:#fbbf24}
        .cr-item{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px;margin-bottom:10px}
        .cr-item-head{display:flex;align-items:baseline;gap:8px;margin-bottom:8px}
        .cr-rule{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;color:#fbbf24;font-size:12.5px}
        .cr-item-title{font-weight:700;font-size:13.5px}
        .cr-p{font-size:12.5px;color:#a8bdd2;line-height:1.6;margin-bottom:6px}
      `}</style>

      <div className="cr-wrap">
        <Link href="/tools" className="cr-back">← All Tools</Link>
        <div className="cr-title">COLREGs Quick Reference</div>
        <p className="cr-sub">
          International Regulations for Preventing Collisions at Sea — the rules that matter most on watch: look-out, risk of collision, steering rules, lights, and sound signals.
        </p>
        <div className="cr-warn">
          ⚠ <b>Quick reference only.</b> This does not replace the full text of the COLREGs or your bridge procedures. Always consult the official convention text and your company&apos;s SMS for complete rules and local variations.
        </div>

        <div className="cr-tabs">
          {SECTIONS.map((s) => (
            <button key={s.key} className={`cr-tab ${tab === s.key ? 'active' : ''}`} onClick={() => setTab(s.key)}>{s.name}</button>
          ))}
        </div>

        {active.items.map((item) => (
          <div className="cr-item" key={item.rule}>
            <div className="cr-item-head">
              <span className="cr-rule">{item.rule}</span>
              <span className="cr-item-title">{item.title}</span>
            </div>
            {item.body.map((p, i) => <p className="cr-p" key={i}>{p}</p>)}
          </div>
        ))}

        <div style={{ marginTop: 16, background: 'linear-gradient(160deg,rgba(251,191,36,.08),#050716)', border: '1.5px solid rgba(251,191,36,.2)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontFamily: "'Bricolage Grotesque',system-ui,sans-serif", fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Built for verified crew and companies</div>
          <p style={{ fontSize: 12, color: '#a8bdd2', marginBottom: 14 }}>Free tools for everyone — plus a verified profile that gets you found directly.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/signup/crew" style={{ flex: '1 1 140px', textAlign: 'center', padding: '11px 16px', borderRadius: 11, fontWeight: 700, fontSize: 13, textDecoration: 'none', background: 'linear-gradient(135deg,#fbbf24,#e0a010)', color: '#0b0e13' }}>⚓ I&apos;m Crew — Join Free</Link>
            <Link href="/signup/company" style={{ flex: '1 1 140px', textAlign: 'center', padding: '11px 16px', borderRadius: 11, fontWeight: 700, fontSize: 13, textDecoration: 'none', color: '#eef4fa', border: '1px solid rgba(255,255,255,.14)' }}>🏢 Hiring? Find Crew</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
