"use client";

import { useState, useRef, useTransition } from "react";
import { smartUploadDocuments } from "@/lib/actions/smart-upload";

export default function SmartUploadBox() {
  const [files, setFiles] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const arr = Array.from(incoming).slice(0, 30 - files.length);
    setFiles((prev) => [...prev, ...arr].slice(0, 30));
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = () => {
    if (files.length === 0 || isPending) return;
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    startTransition(() => {
      smartUploadDocuments(fd);
    });
  };

  return (
    <div className="subox">
      <style>{`
  .subox{border:1.5px solid var(--line,rgba(251,191,36,.16));border-radius:16px;
    background:linear-gradient(160deg,rgba(251,191,36,.06),var(--ink,#050716));padding:20px 18px;margin-bottom:22px}
  .su-head{display:flex;align-items:center;gap:10px;margin-bottom:6px}
  .su-badge{font-size:10px;font-weight:800;letter-spacing:.07em;color:var(--gold,#fbbf24);
    background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.35);border-radius:999px;padding:3px 10px}
  .su-title{font-family:var(--disp,var(--font-bricolage),sans-serif);font-weight:800;font-size:17px}
  .su-sub{font-size:12.5px;color:var(--tx2,#a8bdd2);margin:6px 0 16px;line-height:1.55}
  .su-drop{border:1.5px dashed var(--line,rgba(251,191,36,.3));border-radius:13px;padding:26px 14px;
    text-align:center;cursor:pointer;transition:.15s}
  .su-drop:hover,.su-drop.over{border-color:var(--gold,#fbbf24);background:rgba(251,191,36,.04)}
  .su-drop-ic{font-size:26px;margin-bottom:8px}
  .su-drop b{display:block;font-size:13.5px;color:var(--tx,#eef4fa)}
  .su-drop span{display:block;font-size:11.5px;color:var(--tx3,#6b83a0);margin-top:4px}
  .su-list{display:flex;flex-direction:column;gap:7px;margin:14px 0}
  .su-item{display:flex;align-items:center;gap:9px;font-size:12.5px;background:rgba(255,255,255,.03);
    border:1px solid var(--line2,rgba(255,255,255,.08));border-radius:9px;padding:8px 11px}
  .su-item span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--tx2,#a8bdd2)}
  .su-x{background:none;border:none;color:var(--tx3,#6b83a0);cursor:pointer;font-size:15px;padding:2px 5px;flex-shrink:0}
  .su-x:hover{color:#f87171}
  .su-btn{width:100%;background:linear-gradient(135deg,var(--gold,#fbbf24),var(--gold2,#e0a010));
    color:#0b0e13;border:none;border-radius:11px;padding:13px;font-weight:800;font-size:13.5px;
    cursor:pointer;font-family:inherit;margin-top:4px}
  .su-btn:disabled{opacity:.55;cursor:not-allowed}
  .su-wait{display:flex;align-items:center;gap:10px;justify-content:center;padding:10px 0;font-size:12.5px;color:var(--gold,#fbbf24)}
  .su-spin{width:16px;height:16px;border:2px solid rgba(251,191,36,.25);border-top-color:var(--gold,#fbbf24);
    border-radius:50%;animation:suspin .8s linear infinite;flex-shrink:0}
  @keyframes suspin{to{transform:rotate(360deg)}}
  .su-note{font-size:11px;color:var(--tx3,#6b83a0);text-align:center;margin-top:10px;line-height:1.5}
  @media(max-width:640px){
    .subox{padding:16px 13px}
    .su-drop{padding:20px 10px}
    .su-title{font-size:15.5px}
  }
`}</style>

      <div className="su-head">
        <span className="su-badge">AI POWERED</span>
      </div>
      <div className="su-title">Smart document upload</div>
      <p className="su-sub">
        Upload your certificates, seaman&apos;s book, medical certificate or passport — up to 30
        files, PDF or photo. We&apos;ll read them and fill your vault and profile automatically.
      </p>

      {isPending ? (
        <div className="su-wait">
          <span className="su-spin"></span>
          Reading your documents — this can take a minute for many files, please stay on this page…
        </div>
      ) : (
        <>
          <div
            className={"su-drop" + (dragOver ? " over" : "")}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
          >
            <div className="su-drop-ic">📎</div>
            <b>Tap to choose files, or drag them here</b>
            <span>PDF, JPG or PNG · up to 30 files · max 8MB each</span>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              multiple
              hidden
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {files.length > 0 ? (
            <div className="su-list">
              {files.map((f, i) => (
                <div className="su-item" key={i}>
                  <span>{f.name}</span>
                  <button type="button" className="su-x" onClick={() => removeFile(i)} aria-label="Remove">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          <button type="button" className="su-btn" disabled={files.length === 0} onClick={submit}>
            {files.length === 0
              ? "Choose files to start"
              : `Read ${files.length} document${files.length === 1 ? "" : "s"} with AI →`}
          </button>
        </>
      )}

      <p className="su-note">1 batch upload per day · your documents stay private, visible only to you</p>
    </div>
  );
}
