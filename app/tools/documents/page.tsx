'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type DocType = 'NOR' | 'SOF' | 'LOP' | 'LOI' | 'NAGO' | 'MR' | 'NOT';

const DOC_TYPES: { key: DocType; name: string; icon: string; desc: string }[] = [
  { key: 'NOR', name: 'Notice of Readiness', icon: '📋', desc: 'Tendered by master to charterer/receiver to commence laytime.' },
  { key: 'SOF', name: 'Statement of Facts', icon: '📊', desc: 'Chronological record of port operations.' },
  { key: 'LOP', name: 'Letter of Protest', icon: '⚠️', desc: '14 protest scenarios — delay, damage, short delivery, and more.' },
  { key: 'LOI', name: 'Letter of Indemnity', icon: '🤝', desc: 'Indemnity for cargo release without B/L, change of destination.' },
  { key: 'NAGO', name: 'Notice of Apparent Good Order', icon: '✅', desc: 'Receiver/agent acknowledgment of cargo condition.' },
  { key: 'MR', name: "Mate's Receipt", icon: '📝', desc: 'Acknowledgment of cargo received on board, before B/L.' },
  { key: 'NOT', name: 'Notice of Tender', icon: '📨', desc: 'Notice tendering cargo for loading/discharge per CP terms.' },
];

type ProtestType =
  | 'general' | 'delay_cargo_ops' | 'weather_delay' | 'short_landed' | 'cargo_damage'
  | 'cargo_contamination' | 'stevedore_damage' | 'unsafe_berth' | 'port_congestion'
  | 'nor_rejection' | 'bunker_short' | 'document_delay' | 'berth_nomination' | 'bl_delay'
  | 'hold_hatch_damage' | 'provisions_short' | 'general_damage';

const PROTEST_TYPES: { key: ProtestType; label: string }[] = [
  { key: 'general', label: 'General / Other' },
  { key: 'delay_cargo_ops', label: 'Delay in Cargo Operations (shore-caused)' },
  { key: 'weather_delay', label: 'Weather Delay' },
  { key: 'short_landed', label: 'Short-Landed Cargo' },
  { key: 'cargo_damage', label: 'Cargo Damage on Receipt' },
  { key: 'cargo_contamination', label: 'Cargo Contamination' },
  { key: 'stevedore_damage', label: 'Stevedore Damage to Vessel' },
  { key: 'unsafe_berth', label: 'Unsafe Berth' },
  { key: 'port_congestion', label: 'Delay Due to Port Congestion' },
  { key: 'nor_rejection', label: 'NOR Rejection / Non-Acceptance' },
  { key: 'bunker_short', label: 'Short / Off-Spec Bunker Delivery' },
  { key: 'document_delay', label: 'Delay in Document Processing / Customs' },
  { key: 'berth_nomination', label: "Charterer's Failure to Nominate Berth" },
  { key: 'bl_delay', label: 'Delay in Issuing Bills of Lading' },
  { key: 'hold_hatch_damage', label: 'Hold / Hatch Cover Structural Damage' },
  { key: 'provisions_short', label: 'Fresh Water / Provisions Short Delivery' },
  { key: 'general_damage', label: 'General Damage Claim' },
];

const PROTEST_TEXT: Record<ProtestType, (details: string) => string> = {
  general: (d) => d || '[State the nature of the protest, with facts, dates and times]',
  delay_cargo_ops: (d) =>
    `Cargo operations were delayed due to reasons within the control of the terminal/shore facility, resulting in a stoppage/reduction of the agreed rate of loading/discharging.\n\n${d || '[State specific dates, times and duration of delay]'}\n\nThis delay is not attributable to the vessel, her master, officers or crew.`,
  weather_delay: (d) =>
    `Cargo operations were suspended due to adverse weather conditions rendering it unsafe or impracticable to continue loading/discharging.\n\n${d || '[State weather conditions, times of stoppage and resumption]'}\n\nThis delay falls outside the vessel's control and is a weather working day exception under the Charter Party.`,
  short_landed: (d) =>
    `Upon completion of discharge, the quantity of cargo landed was found to be short of the Bill of Lading quantity.\n\n${d || '[State B/L quantity, quantity actually landed, and the shortage in MT/units]'}\n\nThe Master reserves all rights in respect of this shortage, which is protested without admission of liability.`,
  cargo_damage: (d) =>
    `Upon receipt/discharge, the cargo was found to be damaged.\n\n${d || '[Describe the nature and extent of damage, quantity affected, and how/when discovered]'}\n\nThis protest is issued to preserve the Owners' position pending further survey and investigation.`,
  cargo_contamination: (d) =>
    `The cargo received/loaded was found to be contaminated or not conforming to its declared specification.\n\n${d || '[Describe the contamination, when discovered, and any sampling/testing carried out]'}\n\nThe Master reserves all rights arising from this contamination.`,
  stevedore_damage: (d) =>
    `During cargo operations, damage was caused to the vessel, her equipment, or fittings by stevedores or shore personnel.\n\n${d || '[Describe the damage, location on board, and circumstances of occurrence]'}\n\nOwners reserve the right to claim full repair costs and any consequential losses or delay arising from this damage.`,
  unsafe_berth: (d) =>
    `The berth nominated and/or provided was not safe for the vessel to approach, lie at, or depart from in the ordinary course of operations.\n\n${d || '[Describe the unsafe condition — insufficient depth, exposure, poor fendering, etc.]'}\n\nThis protest is made without prejudice to the Owners' rights arising from breach of the safe berth warranty.`,
  port_congestion: (d) =>
    `The vessel experienced delay due to congestion at the port, resulting in a wait for berth beyond a reasonable time.\n\n${d || '[State time of arrival, time of berthing, and reason for the wait]'}\n\nThis delay is protested and time is claimed to count as laytime or time on demurrage in accordance with the Charter Party.`,
  nor_rejection: (d) =>
    `Notice of Readiness tendered by the Master was rejected or not accepted by the Charterer's/Receiver's representative, despite the vessel being in all respects ready.\n\n${d || '[State time NOR was tendered, reason given for rejection, and vessel readiness status]'}\n\nThe Master maintains that the vessel was, in fact, ready in all respects at the time of tender, and reserves all rights regarding the commencement of laytime.`,
  bunker_short: (d) =>
    `Bunkers received at this port were found to be short in quantity and/or not conforming to the specification ordered/contracted.\n\n${d || '[State quantity ordered vs. received, and/or quality parameters not met]'}\n\nSamples have been retained on board for testing. All rights against the supplier are reserved.`,
  document_delay: (d) =>
    `The vessel experienced delay due to the time taken for processing of cargo/port documentation or customs clearance, beyond what could reasonably be expected.\n\n${d || '[State which documents/clearance were delayed and the resulting time lost]'}\n\nThis delay is not attributable to the vessel and time is protested accordingly.`,
  berth_nomination: (d) =>
    `The Charterer failed to nominate a berth within the time required under the Charter Party, resulting in delay to the vessel.\n\n${d || '[State when nomination was due and when it was actually made, if at all]'}\n\nThe Master reserves all rights arising from this failure to nominate.`,
  bl_delay: (d) =>
    `Bills of Lading were not issued/presented for signature within a reasonable time following completion of loading.\n\n${d || '[State completion time of loading and time B/Ls were presented]'}\n\nThis delay is protested and all consequential losses, including any resulting delay to the vessel, are reserved.`,
  hold_hatch_damage: (d) =>
    `During cargo operations, damage was caused to the vessel's cargo hold(s) and/or hatch cover(s).\n\n${d || '[Describe the damage, hold number, and circumstances of occurrence]'}\n\nOwners reserve the right to claim full repair costs and any resulting delay to the vessel's onward employment or next survey.`,
  provisions_short: (d) =>
    `Fresh water and/or provisions ordered for this port call were delivered short of the quantity/quality contracted.\n\n${d || '[State quantity/quality ordered vs. actually delivered]'}\n\nThe Master reserves all rights against the supplier arising from this shortage.`,
  general_damage: (d) =>
    `Damage was sustained during this port call/voyage under the following circumstances.\n\n${d || '[Describe the nature, extent and cause of the damage, and when it was discovered]'}\n\nThis protest is issued to preserve the Owners' position pending full survey and investigation, without admission as to cause or liability.`,
};

export default function DocumentsPage() {
  const [docType, setDocType] = useState<DocType>('NOR');
  const [protestType, setProtestType] = useState<ProtestType>('general');
  const [protestDetails, setProtestDetails] = useState('');

  const [vesselName, setVesselName] = useState('');
  const [imo, setImo] = useState('');
  const [port, setPort] = useState('');
  const [berth, setBerth] = useState('');
  const [master, setMaster] = useState('');
  const [docDate, setDocDate] = useState('');
  const [docTime, setDocTime] = useState('');
  const [recipient, setRecipient] = useState('');
  const [reference, setReference] = useState('');
  const [freeField1, setFreeField1] = useState('');
  const [freeField2, setFreeField2] = useState('');

  const dt = docDate ? new Date(docDate + (docTime ? `T${docTime}` : 'T12:00')).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' }) : '[DATE / TIME]';
  const ref = reference || `REF/${(vesselName || 'VESSEL').replace(/\s+/g, '')}/${new Date().getFullYear()}`;

  function generate(): string {
    const header = `M/V "${vesselName || '[VESSEL NAME]'}"\n${imo ? `IMO: ${imo}` : ''}\nReference: ${ref}\nDate: ${dt}\nPort: ${port || '[PORT]'}${berth ? `, Berth: ${berth}` : ''}\n`;

    switch (docType) {
      case 'NOR':
        return `${header}\nNOTICE OF READINESS\n═══════════════════════════════\n\nTo: ${recipient || '[CHARTERER / RECEIVER]'}\n\nDear Sirs,\n\nThe above-named vessel under my command has arrived at ${port || '[PORT]'} on ${dt} and is in all respects ready to commence ${freeField1 || 'loading/discharging'} of ${freeField2 || '[QUANTITY / CARGO]'}.\n\nThis Notice is tendered without prejudice to any rights under the Charter Party.\n\nYours faithfully,\n____________________\n${master || 'Master'}, M/V "${vesselName || '[VESSEL NAME]'}"\n\nACKNOWLEDGMENT:\nReceived by: _______________  Date/Time: _______________  Signature: _______________`;

      case 'SOF':
        return `${header}\nSTATEMENT OF FACTS\n═══════════════════════════════\n\nCargo: ${freeField2 || '[QUANTITY / TYPE]'}\n\nCHRONOLOGY OF EVENTS:\n${freeField1 || '[Add events in chronological order — DD-MM-YYYY HH:MM followed by event]'}\n\nThe above is a true record of events.\n\nMaster: ____________________          Charterer's Rep: ____________________\n${master || 'Master'}, M/V "${vesselName || '[VESSEL NAME]'}"`;

      case 'LOP': {
        const protestBody = PROTEST_TEXT[protestType](protestDetails);
        const label = PROTEST_TYPES.find((p) => p.key === protestType)?.label || 'General';
        return `${header}\nLETTER OF PROTEST — ${label.toUpperCase()}\n═══════════════════════════════\n\nTo: ${recipient || '[ADDRESSEE]'}\n\nDear Sirs,\n\nThe Master of the above-named vessel hereby PROTESTS as follows:\n\n${protestBody}\n\nThe Master reserves all rights of the Owners under the Charter Party and applicable law. This protest is issued without prejudice to any further protest or claim that may be made, including but not limited to claims for demurrage, off-hire, damages, costs and consequential losses.\n\nWe require your written acknowledgment of receipt.\n\nYours faithfully,\n____________________\n${master || 'Master'}, M/V "${vesselName || '[VESSEL NAME]'}"\n\nACKNOWLEDGMENT (without prejudice):\nReceived by: _______________  Date/Time: _______________  Signature: _______________\n[ ] Received but contents NOT accepted   [ ] Received and acknowledged`;
      }

      case 'LOI':
        return `${header}\nLETTER OF INDEMNITY\n═══════════════════════════════\n\nTo: The Master and Owners of M/V "${vesselName || '[VESSEL NAME]'}"\n\nDear Sirs,\n\nWe, ${recipient || '[CHARTERER / SHIPPER]'}, hereby request you to:\n\n${freeField1 || '[State purpose — e.g. deliver cargo without original B/L, discharge at alternative port]'}\n\nIn consideration of you complying with the above request, we hereby agree to indemnify you against all consequences, liabilities, costs and expenses arising therefrom.\n\nThis indemnity shall be governed by English law and subject to the exclusive jurisdiction of the English High Court.\n\nYours faithfully,\n____________________\nFor and on behalf of ${recipient || '[COMPANY]'}`;

      case 'NAGO':
        return `${header}\nNOTICE OF APPARENT GOOD ORDER\n═══════════════════════════════\n\nThis is to certify that the cargo of ${freeField2 || '[QUANTITY / TYPE]'} has been received from M/V "${vesselName || '[VESSEL NAME]'}" in apparent good order and condition, save as noted below:\n\n${freeField1 || '[Note any exceptions, or state "No exceptions noted"]'}\n\nReceived by: ____________________  Date/Time: ____________________  Signature: ____________________`;

      case 'MR':
        return `${header}\nMATE'S RECEIPT\n═══════════════════════════════\n\nReceived on board M/V "${vesselName || '[VESSEL NAME]'}" the following cargo, in apparent good order and condition unless otherwise noted:\n\n${freeField2 || '[Quantity / description of cargo]'}\n\nExceptions/Remarks: ${freeField1 || 'None'}\n\nChief/2nd Officer: ____________________  Date/Time: ____________________`;

      case 'NOT':
        return `${header}\nNOTICE OF TENDER\n═══════════════════════════════\n\nTo: ${recipient || '[CHARTERER / RECEIVER]'}\n\nDear Sirs,\n\nIn accordance with the Charter Party terms, we hereby tender ${freeField2 || '[QUANTITY / CARGO]'} for ${freeField1 || 'loading/discharge'} at ${port || '[PORT]'}.\n\nYours faithfully,\n____________________\n${master || 'Master'}, M/V "${vesselName || '[VESSEL NAME]'}"`;

      default:
        return '';
    }
  }

  const generatedText = generate();

  const [saved, setSaved] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('scf-documents-draft');
      if (raw) {
        const d = JSON.parse(raw);
        setDocType(d.docType || 'NOR'); setProtestType(d.protestType || 'general');
        setProtestDetails(d.protestDetails || ''); setVesselName(d.vesselName || '');
        setImo(d.imo || ''); setPort(d.port || ''); setBerth(d.berth || '');
        setMaster(d.master || ''); setDocDate(d.docDate || ''); setDocTime(d.docTime || '');
        setRecipient(d.recipient || ''); setReference(d.reference || '');
        setFreeField1(d.freeField1 || ''); setFreeField2(d.freeField2 || '');
      }
    } catch { /* ignore */ }
  }, []);

  function handleSaveDraft() {
    try {
      localStorage.setItem('scf-documents-draft', JSON.stringify({
        docType, protestType, protestDetails, vesselName, imo, port, berth, master,
        docDate, docTime, recipient, reference, freeField1, freeField2,
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { /* ignore */ }
  }

  function copyText() {
    navigator.clipboard?.writeText(generatedText).catch(() => {});
  }

  async function loadJsPdf(): Promise<any> {
    if ((window as any).jspdf) return (window as any).jspdf;
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load PDF library'));
      document.body.appendChild(script);
    });
    return (window as any).jspdf;
  }

  async function generatePdfBlob(): Promise<Blob> {
    const { jsPDF } = await loadJsPdf();
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 48;
    const maxWidth = 595 - margin * 2;
    const lines = doc.splitTextToSize(generatedText, maxWidth);
    doc.setFont('Courier', 'normal');
    doc.setFontSize(10);
    let y = margin;
    const lineHeight = 13;
    for (const line of lines) {
      if (y > 780) { doc.addPage(); y = margin; }
      doc.text(line, margin, y);
      y += lineHeight;
    }
    return doc.output('blob');
  }

  async function handleDownloadPdf() {
    setPdfBusy(true);
    try {
      const blob = await generatePdfBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${docType}-${(vesselName || 'vessel').replace(/\s+/g, '')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* ignore */ }
    setPdfBusy(false);
  }

  async function handleSharePdf() {
    setPdfBusy(true);
    try {
      const blob = await generatePdfBlob();
      const fileName = `${docType}-${(vesselName || 'vessel').replace(/\s+/g, '')}.pdf`;
      const file = new File([blob], fileName, { type: 'application/pdf' });
      if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({ files: [file], title: fileName });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch { /* ignore */ }
    setPdfBusy(false);
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0d1030', color: '#eef4fa' }}>
      <style>{`
        *{box-sizing:border-box}
        .dg-wrap{max-width:760px;margin:0 auto;padding:28px 18px 60px}
        .dg-back{color:#a8bdd2;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:20px}
        .dg-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:24px;font-weight:800;margin-bottom:6px;letter-spacing:-.02em}
        .dg-sub{color:#a8bdd2;font-size:13px;line-height:1.6;margin-bottom:20px}
        .dg-doctype-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-bottom:16px}
        .dg-doctype-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px;cursor:pointer;text-align:center}
        .dg-doctype-card.active{border-color:#fbbf24;background:rgba(251,191,36,.08)}
        .dg-doctype-icon{font-size:20px;margin-bottom:4px}
        .dg-doctype-name{font-size:11.5px;font-weight:700}
        .dg-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:14px}
        .dg-label{font-size:11px;color:#6b83a0;text-transform:uppercase;letter-spacing:.06em;font-weight:700;display:block;margin-bottom:10px}
        .dg-field-label{font-size:11px;color:#6b83a0;display:block;margin-bottom:4px}
        .dg-inp,.dg-sel,.dg-txt{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:9px 11px;color:#eef4fa;font-size:13px;font-family:inherit}
        .dg-sel option{background:#141845;color:#eef4fa}
        .dg-txt{resize:vertical;min-height:80px;font-family:monospace;font-size:12px}
        .dg-inp:focus,.dg-sel:focus,.dg-txt:focus{outline:none;border-color:#fbbf24}
        .dg-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
        .dg-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px}
        .dg-output{background:#050716;border:1px solid rgba(251,191,36,.25);border-radius:14px;padding:16px;white-space:pre-wrap;font-family:monospace;font-size:11.5px;line-height:1.6;color:#eef4fa;max-height:500px;overflow-y:auto}
        .dg-copy{background:linear-gradient(135deg,#fbbf24,#e0a010);color:#0b0e13;border:none;border-radius:9px;padding:9px 18px;font-weight:700;font-size:12.5px;cursor:pointer;margin-bottom:10px}
        @media(max-width:560px){ .dg-row2,.dg-row3{grid-template-columns:1fr} }
      `}</style>

      <div className="dg-wrap">
        <Link href="/tools" className="dg-back">← All Tools</Link>
        <div className="dg-title">Documents Generator</div>
        <p className="dg-sub">
          NOR, SOF, LOI and more — plus 14 Letter of Protest scenarios covering the most common disputes at sea. Fill in details, copy the result. Nothing is saved.
        </p>

        <div className="dg-doctype-grid">
          {DOC_TYPES.map((d) => (
            <div key={d.key} className={`dg-doctype-card ${docType === d.key ? 'active' : ''}`} onClick={() => setDocType(d.key)}>
              <div className="dg-doctype-icon">{d.icon}</div>
              <div className="dg-doctype-name">{d.name}</div>
            </div>
          ))}
        </div>

        <div className="dg-card">
          <span className="dg-label">Vessel &amp; document details</span>
          <div className="dg-row3">
            <div>
              <span className="dg-field-label">Vessel name</span>
              <input className="dg-inp" value={vesselName} onChange={(e) => setVesselName(e.target.value)} />
            </div>
            <div>
              <span className="dg-field-label">IMO</span>
              <input className="dg-inp" value={imo} onChange={(e) => setImo(e.target.value)} />
            </div>
            <div>
              <span className="dg-field-label">Master</span>
              <input className="dg-inp" value={master} onChange={(e) => setMaster(e.target.value)} />
            </div>
          </div>
          <div className="dg-row3">
            <div>
              <span className="dg-field-label">Port</span>
              <input className="dg-inp" value={port} onChange={(e) => setPort(e.target.value)} />
            </div>
            <div>
              <span className="dg-field-label">Berth</span>
              <input className="dg-inp" value={berth} onChange={(e) => setBerth(e.target.value)} />
            </div>
            <div>
              <span className="dg-field-label">Reference no.</span>
              <input className="dg-inp" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="auto if blank" />
            </div>
          </div>
          <div className="dg-row2" style={{ marginBottom: 0 }}>
            <div>
              <span className="dg-field-label">Date</span>
              <input className="dg-inp" type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} />
            </div>
            <div>
              <span className="dg-field-label">Time</span>
              <input className="dg-inp" type="time" value={docTime} onChange={(e) => setDocTime(e.target.value)} />
            </div>
          </div>
        </div>

        {docType === 'LOP' ? (
          <div className="dg-card">
            <span className="dg-label">Protest scenario</span>
            <select className="dg-sel" value={protestType} onChange={(e) => setProtestType(e.target.value as ProtestType)} style={{ marginBottom: 10 }}>
              {PROTEST_TYPES.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
            <span className="dg-field-label">Addressee</span>
            <input className="dg-inp" style={{ marginBottom: 10 }} value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Charterers / Receivers / Terminal" />
            <span className="dg-field-label">Specific details (dates, quantities, facts)</span>
            <textarea className="dg-txt" value={protestDetails} onChange={(e) => setProtestDetails(e.target.value)} placeholder="Add the specific facts for this protest..." />
          </div>
        ) : (
          <div className="dg-card">
            <span className="dg-label">Content</span>
            {(docType === 'NOR' || docType === 'NOT') && (
              <>
                <span className="dg-field-label">Operation / cargo type</span>
                <input className="dg-inp" style={{ marginBottom: 10 }} value={freeField1} onChange={(e) => setFreeField1(e.target.value)} placeholder="e.g. loading" />
              </>
            )}
            {docType === 'LOI' && (
              <>
                <span className="dg-field-label">Requesting party</span>
                <input className="dg-inp" style={{ marginBottom: 10 }} value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. ABC Shipping Ltd" />
                <span className="dg-field-label">Purpose of indemnity</span>
                <textarea className="dg-txt" style={{ marginBottom: 10 }} value={freeField1} onChange={(e) => setFreeField1(e.target.value)} />
              </>
            )}
            {(docType === 'NAGO' || docType === 'MR') && (
              <>
                <span className="dg-field-label">Exceptions / remarks</span>
                <textarea className="dg-txt" style={{ marginBottom: 10 }} value={freeField1} onChange={(e) => setFreeField1(e.target.value)} />
              </>
            )}
            {docType === 'SOF' && (
              <>
                <span className="dg-field-label">Chronology of events</span>
                <textarea className="dg-txt" style={{ marginBottom: 10, minHeight: 140 }} value={freeField1} onChange={(e) => setFreeField1(e.target.value)} placeholder="DD-MM-YYYY HH:MM   Event..." />
              </>
            )}
            <span className="dg-field-label">Quantity / cargo type</span>
            <input className="dg-inp" value={freeField2} onChange={(e) => setFreeField2(e.target.value)} placeholder="e.g. 25,000 MT Iron Ore" />
          </div>
        )}

        <div className="dg-card">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <button className="dg-copy" onClick={copyText}>📋 Copy</button>
            <button onClick={handleSaveDraft} style={{ background: saved ? 'rgba(52,211,153,.15)' : 'rgba(255,255,255,.06)', border: `1px solid ${saved ? 'rgba(52,211,153,.4)' : 'rgba(255,255,255,.15)'}`, color: saved ? '#34d399' : '#eef4fa', borderRadius: 9, padding: '9px 16px', fontWeight: 700, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit' }}>
              {saved ? '✓ Saved' : '💾 Save Draft'}
            </button>
            <button onClick={handleDownloadPdf} disabled={pdfBusy} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.15)', color: '#eef4fa', borderRadius: 9, padding: '9px 16px', fontWeight: 700, fontSize: 12.5, cursor: pdfBusy ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: pdfBusy ? 0.6 : 1 }}>
              📄 {pdfBusy ? 'Working...' : 'Download PDF'}
            </button>
            <button onClick={handleSharePdf} disabled={pdfBusy} style={{ background: 'linear-gradient(135deg,#fbbf24,#e0a010)', color: '#0b0e13', border: 'none', borderRadius: 9, padding: '9px 16px', fontWeight: 700, fontSize: 12.5, cursor: pdfBusy ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: pdfBusy ? 0.6 : 1 }}>
              📤 {pdfBusy ? 'Working...' : 'Share PDF'}
            </button>
          </div>
          <div className="dg-output">{generatedText}</div>
        </div>

        <div style={{ marginTop: 24, background: 'linear-gradient(160deg,rgba(251,191,36,.08),#050716)', border: '1.5px solid rgba(251,191,36,.2)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontFamily: "'Bricolage Grotesque',system-ui,sans-serif", fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Built for verified crew and companies</div>
          <p style={{ fontSize: 12, color: '#a8bdd2', marginBottom: 14 }}>Free tools for everyone — plus a verified profile that gets you found directly.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/signup/crew" style={{ flex: '1 1 140px', textAlign: 'center', padding: '11px 16px', borderRadius: 11, fontWeight: 700, fontSize: 13, textDecoration: 'none', background: 'linear-gradient(135deg,#fbbf24,#e0a010)', color: '#0b0e13' }}>⚓ I&apos;m Crew — Join Free</Link>
            <Link href="/signup/company" style={{ flex: '1 1 140px', textAlign: 'center', padding: '11px 16px', borderRadius: 11, fontWeight: 700, fontSize: 13, textDecoration: 'none', color: '#eef4fa', border: '1px solid rgba(255,255,255,.14)' }}>🏢 Hiring? Find Crew</Link>
          </div>
        </div>

        <p style={{ fontSize: 11, color: '#4a5568', lineHeight: 1.6, marginTop: 12 }}>
          These are standard, general-purpose templates — always review against your vessel&apos;s specific Charter Party terms and, for significant claims, seek advice from Owners/P&amp;I before issuing.
        </p>
      </div>
    </main>
  );
}
