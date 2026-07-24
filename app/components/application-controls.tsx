"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateApplicationStatus, saveApplicationNote } from "@/lib/actions/applications";

const STATUSES = [
  { value: "new", label: "🆕 New" },
  { value: "contacted", label: "💬 Contacted" },
  { value: "shortlisted", label: "⭐ Shortlisted" },
  { value: "hired", label: "✅ Hired" },
  { value: "rejected", label: "✕ Rejected" },
];

export default function ApplicationControls({
  applicationId,
  status,
  note,
}: {
  applicationId: string;
  status: string;
  note: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [noteOpen, setNoteOpen] = useState(!!note);
  const [noteText, setNoteText] = useState(note || "");
  const [noteMsg, setNoteMsg] = useState<string | null>(null);

  const changeStatus = (value: string) => {
    startTransition(async () => {
      const res = await updateApplicationStatus(applicationId, value);
      if (res.ok) router.refresh();
    });
  };

  const saveNote = () => {
    startTransition(async () => {
      const res = await saveApplicationNote(applicationId, noteText);
      setNoteMsg(res.ok ? "✓ Saved" : res.error || "Failed");
      setTimeout(() => setNoteMsg(null), 2200);
      if (res.ok) router.refresh();
    });
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <select
          value={status}
          disabled={pending}
          onChange={(e) => changeStatus(e.target.value)}
          style={{
            background: "var(--navy)",
            border: "1px solid var(--line2)",
            color: "var(--tx)",
            borderRadius: 10,
            padding: "8px 11px",
            fontFamily: "var(--body)",
            fontSize: 12.5,
            fontWeight: 600,
            outline: "none",
            cursor: pending ? "wait" : "pointer",
          }}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setNoteOpen(!noteOpen)}
          style={{
            background: "none",
            border: "1px solid var(--line2)",
            color: "var(--tx3)",
            borderRadius: 10,
            padding: "8px 12px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "var(--body)",
          }}
        >
          {note ? "📝 Note" : "+ Note"}
        </button>

        {pending ? (
          <span style={{ fontSize: 11.5, color: "var(--tx3)" }}>Saving…</span>
        ) : null}
      </div>

      {noteOpen ? (
        <div style={{ marginTop: 9 }}>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            maxLength={500}
            rows={2}
            placeholder="Private note — only your company sees this. e.g. Strong tanker exp, call after 15 Aug."
            style={{
              width: "100%",
              background: "var(--navy)",
              border: "1px solid var(--line2)",
              color: "var(--tx)",
              borderRadius: 10,
              padding: "9px 12px",
              fontFamily: "var(--body)",
              fontSize: 12.5,
              lineHeight: 1.5,
              outline: "none",
              resize: "vertical",
            }}
          />
          <div style={{ display: "flex", gap: 9, alignItems: "center", marginTop: 6 }}>
            <button
              type="button"
              onClick={saveNote}
              disabled={pending}
              style={{
                background: "linear-gradient(135deg,#fbbf24,#e0a010)",
                color: "#0b0e13",
                border: "none",
                borderRadius: 9,
                padding: "7px 15px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--body)",
              }}
            >
              Save note
            </button>
            {noteMsg ? (
              <span style={{ fontSize: 11.5, color: noteMsg.startsWith("✓") ? "#34d399" : "#f87171", fontWeight: 600 }}>
                {noteMsg}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
