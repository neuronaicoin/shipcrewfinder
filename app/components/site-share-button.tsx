"use client";

import { useState, useRef, useEffect } from "react";

export default function SiteShareButton() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const shareUrl = "https://shipcrewfinder.com";
  const shareText = "ShipCrewFinder — verified seafarers connect directly with shipping companies. No agency, no commission, 100% free for crew.";

  const doShare = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title: "ShipCrewFinder", text: shareText, url: shareUrl });
        return;
      } catch {
        // kullanıcı iptal etti veya desteklenmiyor — yedek menüye düş
      }
    }
    setMenuOpen((v) => !v);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", shareUrl);
    }
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const waLink = "https://wa.me/?text=" + encodeURIComponent(shareText + "\n" + shareUrl);
  const tgLink = "https://t.me/share/url?url=" + encodeURIComponent(shareUrl) + "&text=" + encodeURIComponent(shareText);
  const fbLink = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(shareUrl);

  return (
    <div ref={wrapRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={doShare}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          background: "rgba(255,255,255,.04)",
          border: "1px solid var(--line2)",
          color: "var(--tx2)",
          borderRadius: 10,
          padding: "9px 15px",
          fontWeight: 700,
          fontSize: 12.5,
          cursor: "pointer",
          fontFamily: "var(--body)",
          whiteSpace: "nowrap",
        }}
      >
        📤 <span className="ssb-label">Share with a friend</span>
      </button>

      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 60,
            background: "var(--navy2)",
            border: "1px solid var(--line2)",
            borderRadius: 14,
            padding: 10,
            boxShadow: "0 18px 40px rgba(0,0,0,.5)",
            minWidth: 200,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <a href={waLink} target="_blank" rel="noopener noreferrer" style={menuItemStyle}>
            <span style={{ color: "#25d366" }}>●</span> WhatsApp
          </a>
          <a href={tgLink} target="_blank" rel="noopener noreferrer" style={menuItemStyle}>
            <span style={{ color: "#2aabee" }}>●</span> Telegram
          </a>
          <a href={fbLink} target="_blank" rel="noopener noreferrer" style={menuItemStyle}>
            <span style={{ color: "#1877f2" }}>●</span> Facebook
          </a>
          <button type="button" onClick={copyLink} style={{ ...menuItemStyle, border: "none", width: "100%", textAlign: "left", cursor: "pointer", background: "transparent" }}>
            <span style={{ color: "var(--gold)" }}>●</span> {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 9,
  padding: "9px 12px",
  borderRadius: 9,
  fontSize: 13,
  fontWeight: 600,
  color: "var(--tx)",
  textDecoration: "none",
  fontFamily: "var(--body)",
};
