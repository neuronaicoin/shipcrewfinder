'use client';
import Link from 'next/link';

interface FlagInfo { name: string; flag: string; type: string; notes: string; endorsement: string; }

const FLAGS: FlagInfo[] = [
  { name: 'Panama', flag: '🇵🇦', type: 'Open Registry', notes: 'The world\'s largest ship registry by tonnage. Well-established endorsement process with a large network of recognized organizations handling documentation worldwide.', endorsement: 'Endorsement of your national CoC is required — your issuing country must be on the IMO STCW White List, which covers most major maritime training nations.' },
  { name: 'Liberia', flag: '🇱🇷', type: 'Open Registry', notes: 'One of the largest and longest-established open registries, generally regarded as a well-run, professionally administered flag with a strong compliance record.', endorsement: 'Endorsement processed through Liberian Registry-authorized offices worldwide; documentation requirements are broadly similar to other major open registries.' },
  { name: 'Marshall Islands', flag: '🇲🇭', type: 'Open Registry', notes: 'A major open registry with a strong reputation for regulatory quality, widely used across bulk, tanker and container sectors.', endorsement: 'Endorsement handled through an established international network of registry offices.' },
  { name: 'Bahamas', flag: '🇧🇸', type: 'Open Registry', notes: 'A long-established open registry with a strong presence in the cruise and passenger ship sector alongside general merchant shipping.', endorsement: 'Endorsement process broadly similar to other major open registries — CoC issuing state must be on the STCW White List.' },
  { name: 'Malta', flag: '🇲🇹', type: 'EU / National Registry', notes: 'A major EU flag, offering the regulatory framework and market access advantages of EU membership, popular with European-owned tonnage.', endorsement: 'EU flag rules apply — endorsement and recognition of qualifications follow EU maritime recognition procedures alongside IMO STCW requirements.' },
  { name: 'Cyprus', flag: '🇨🇾', type: 'EU / National Registry', notes: 'Another significant EU flag with a substantial international shipping presence, particularly popular with Greek-owned tonnage.', endorsement: 'EU maritime qualification recognition rules apply, alongside standard STCW endorsement requirements.' },
  { name: 'Singapore', flag: '🇸🇬', type: 'National Registry', notes: 'A major registry closely tied to Singapore\'s role as the world\'s largest maritime services hub, with a strong regulatory reputation.', endorsement: 'Endorsement handled through the Maritime and Port Authority of Singapore (MPA), with well-documented, efficient processing.' },
  { name: 'Hong Kong', flag: '🇭🇰', type: 'National Registry', notes: 'A major, fast-growing registry with a strong reputation for efficient administration and a significant share of the world bulk and container fleet.', endorsement: 'Endorsement processed through the Hong Kong Marine Department.' },
  { name: 'UK / Red Ensign Group', flag: '🇬🇧', type: 'National Registry', notes: 'The UK flag and associated Red Ensign Group registries (Isle of Man, Bermuda, Cayman Islands and others) offer varying characteristics but share a British regulatory heritage.', endorsement: 'Endorsement through the UK Maritime and Coastguard Agency (MCA) or the relevant Red Ensign territory\'s administration.' },
  { name: 'Norway (NIS)', flag: '🇳🇴', type: 'International Registry', notes: 'The Norwegian International Ship Register offers Norwegian flag benefits with international registry flexibility, popular with Norwegian-linked owners.', endorsement: 'Endorsement processed through the Norwegian Maritime Authority.' },
];

export default function FlagsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .fl-wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
        .fl-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .fl-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .fl-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:14px}
        .fl-warn{background:rgba(232,184,90,.08);border:1px solid rgba(232,184,90,.3);border-radius:10px;padding:12px 14px;font-size:12px;color:#e8c87a;line-height:1.5;margin-bottom:16px}
        .fl-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:16px 18px;margin-bottom:12px}
        .fl-head{display:flex;align-items:center;gap:10px;margin-bottom:10px}
        .fl-flag{font-size:24px}
        .fl-name{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:15px}
        .fl-type{font-size:10.5px;color:#fbbf24;background:rgba(251,191,36,.1);padding:2px 8px;border-radius:6px;font-weight:700;margin-left:auto}
        .fl-notes{font-size:12.5px;color:#a8bdd2;line-height:1.6;margin-bottom:8px}
        .fl-endorse{font-size:12px;color:#7db8ea;line-height:1.6;background:rgba(90,166,232,.05);border-left:2px solid rgba(90,166,232,.4);padding:8px 10px;border-radius:4px}
      `}</style>

      <div className="fl-wrap">
        <Link href="/tools" className="fl-back">← All Tools</Link>
        <div className="fl-title">Flag State Comparison</div>
        <p className="fl-sub">
          Major flag states and how CoC endorsement typically works for each — general reference, not a ranking.
        </p>
        <div className="fl-warn">
          ⚠ <b>General reference only.</b> Endorsement processes, fees and processing times change and vary by your specific nationality and CoC-issuing country. Always confirm current requirements directly with the flag administration or your manning agent before relying on this for a specific job.
        </div>

        {FLAGS.map((f) => (
          <div className="fl-card" key={f.name}>
            <div className="fl-head">
              <span className="fl-flag">{f.flag}</span>
              <span className="fl-name">{f.name}</span>
              <span className="fl-type">{f.type}</span>
            </div>
            <p className="fl-notes">{f.notes}</p>
            <div className="fl-endorse">🎓 {f.endorsement}</div>
          </div>
        ))}

        <div style={{ marginTop: 8, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Bricolage Grotesque',system-ui,sans-serif", fontWeight: 800, fontSize: 13, color: '#fbbf24', marginBottom: 6 }}>What Actually Matters for You</div>
          <p style={{ fontSize: 12, color: '#a8bdd2', lineHeight: 1.7 }}>For almost every major flag, the critical question is the same: is your CoC-issuing country on the IMO STCW White List? If yes, endorsement is typically a documentation and fee process rather than a substantive barrier. Processing time and cost vary more by which country issued your original certificate than by which flag you\'re joining.</p>
        </div>

        <div style={{ background: 'linear-gradient(160deg,rgba(251,191,36,.08),#050716)', border: '1.5px solid rgba(251,191,36,.2)', borderRadius: 16, padding: 20 }}>
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
