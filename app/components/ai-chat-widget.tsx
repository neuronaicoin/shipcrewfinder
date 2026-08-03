"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { sendChatMessage, type ChatTurn } from "@/lib/actions/ai-chat";

type ChatMessage = ChatTurn & { action?: "signup" | "login" | "none" };

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, busy]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const nextHistory: ChatTurn[] = [...messages.map((m) => ({ role: m.role, text: m.text })), { role: "user", text }];
    setMessages((prev) => [...prev, { role: "user", text }]);
    setBusy(true);
    try {
      const result = await sendChatMessage(nextHistory.slice(0, -1), text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: result.reply, action: result.suggestAction },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong — please try again.", action: "none" },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <style>{`
  .aicw-fab{position:fixed;right:18px;bottom:18px;z-index:200;width:58px;height:58px;border-radius:50%;
    background:linear-gradient(135deg,var(--gold,#fbbf24),var(--gold2,#e0a010));border:none;cursor:pointer;
    display:grid;place-items:center;font-size:24px;box-shadow:0 8px 26px rgba(251,191,36,.35);
    animation:aicwpulse 2.4s ease-in-out infinite}
  @keyframes aicwpulse{0%,100%{box-shadow:0 8px 26px rgba(251,191,36,.35)}50%{box-shadow:0 8px 34px rgba(251,191,36,.55)}}
  .aicw-fab.hide{display:none}
  .aicw-panel{position:fixed;z-index:201;right:18px;bottom:18px;width:360px;max-width:calc(100vw - 24px);
    height:520px;max-height:calc(100vh - 36px);background:linear-gradient(165deg,var(--navy2,#141845),var(--ink,#050716));
    border:1.5px solid var(--line,rgba(251,191,36,.16));border-radius:18px;display:flex;flex-direction:column;
    overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5)}
  .aicw-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;
    border-bottom:1px solid var(--line2,rgba(255,255,255,.08));flex-shrink:0}
  .aicw-htitle{display:flex;align-items:center;gap:9px}
  .aicw-htitle .ic{width:30px;height:30px;border-radius:9px;background:linear-gradient(145deg,var(--gold,#fbbf24),var(--gold2,#e0a010));
    display:grid;place-items:center;font-size:14px;flex-shrink:0}
  .aicw-htitle b{font-family:var(--disp,var(--font-bricolage),sans-serif);font-size:14.5px;font-weight:800;color:var(--tx,#eef4fa)}
  .aicw-htitle span{display:block;font-size:10.5px;color:var(--grn,#34d399);font-weight:600}
  .aicw-close{background:none;border:none;color:var(--tx3,#6b83a0);font-size:18px;cursor:pointer;padding:4px 8px}
  .aicw-close:hover{color:var(--tx,#eef4fa)}
  .aicw-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
  .aicw-empty{text-align:center;padding:20px 10px;color:var(--tx3,#6b83a0);font-size:12.5px;line-height:1.7}
  .aicw-empty b{display:block;color:var(--tx2,#a8bdd2);font-size:13.5px;margin-bottom:4px;font-family:var(--disp,inherit)}
  .aicw-msg{max-width:85%;padding:10px 13px;border-radius:13px;font-size:13px;line-height:1.55}
  .aicw-msg.user{align-self:flex-end;background:linear-gradient(135deg,var(--gold,#fbbf24),var(--gold2,#e0a010));
    color:#0b0e13;border-bottom-right-radius:4px}
  .aicw-msg.assistant{align-self:flex-start;background:rgba(255,255,255,.05);color:var(--tx2,#a8bdd2);
    border:1px solid var(--line2,rgba(255,255,255,.08));border-bottom-left-radius:4px}
  .aicw-cta{display:inline-flex;margin-top:9px;background:var(--gold,#fbbf24);color:#0b0e13;text-decoration:none;
    border-radius:9px;padding:7px 13px;font-weight:800;font-size:12px}
  .aicw-typing{align-self:flex-start;display:flex;gap:4px;padding:12px 14px}
  .aicw-typing span{width:6px;height:6px;border-radius:50%;background:var(--tx3,#6b83a0);animation:aicwdot 1.2s infinite}
  .aicw-typing span:nth-child(2){animation-delay:.2s}
  .aicw-typing span:nth-child(3){animation-delay:.4s}
  @keyframes aicwdot{0%,60%,100%{opacity:.3}30%{opacity:1}}
  .aicw-foot{display:flex;gap:8px;padding:12px;border-top:1px solid var(--line2,rgba(255,255,255,.08));flex-shrink:0}
  .aicw-input{flex:1;background:var(--navy,#0d1030);border:1px solid var(--line2,rgba(255,255,255,.08));
    color:var(--tx,#eef4fa);border-radius:10px;padding:10px 13px;font-size:13px;outline:none;font-family:inherit}
  .aicw-input:focus{border-color:var(--gold,#fbbf24)}
  .aicw-send{background:linear-gradient(135deg,var(--gold,#fbbf24),var(--gold2,#e0a010));border:none;
    color:#0b0e13;border-radius:10px;padding:0 16px;font-weight:800;font-size:13px;cursor:pointer;flex-shrink:0}
  .aicw-send:disabled{opacity:.5;cursor:not-allowed}
  @media(max-width:640px){
    .aicw-panel{right:0;bottom:0;left:0;width:100%;max-width:100%;height:78vh;max-height:78vh;
      border-radius:18px 18px 0 0;border-left:none;border-right:none;border-bottom:none}
    .aicw-fab{right:14px;bottom:14px;width:54px;height:54px}
  }
`}</style>

      <button
        type="button"
        className={"aicw-fab" + (open ? " hide" : "")}
        onClick={() => setOpen(true)}
        aria-label="Open AI assistant"
      >
        ⚓
      </button>

      {open ? (
        <div className="aicw-panel">
          <div className="aicw-head">
            <div className="aicw-htitle">
              <span className="ic">⚓</span>
              <div>
                <b>Ask ShipCrewFinder</b>
                <span>● AI assistant — any language</span>
              </div>
            </div>
            <button type="button" className="aicw-close" onClick={() => setOpen(false)} aria-label="Close">
              ✕
            </button>
          </div>

          <div className="aicw-body" ref={bodyRef}>
            {messages.length === 0 ? (
              <div className="aicw-empty">
                <b>Ask me anything ⚓</b>
                Salaries, how the platform works, how to join — in any language.
              </div>
            ) : null}
            {messages.map((m, i) => (
              <div key={i} className={"aicw-msg " + m.role}>
                {m.text}
                {m.role === "assistant" && m.action === "signup" ? (
                  <Link href="/signup" className="aicw-cta">Create free account →</Link>
                ) : null}
                {m.role === "assistant" && m.action === "login" ? (
                  <Link href="/login" className="aicw-cta">Log in →</Link>
                ) : null}
              </div>
            ))}
            {busy ? (
              <div className="aicw-typing">
                <span></span><span></span><span></span>
              </div>
            ) : null}
          </div>

          <div className="aicw-foot">
            <input
              className="aicw-input"
              type="text"
              placeholder="Type your question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              disabled={busy}
            />
            <button type="button" className="aicw-send" onClick={send} disabled={busy || !input.trim()}>
              →
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
