'use client';
import { useState, useEffect, useRef } from 'react';

export default function LiveRosterFeed() {
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(true);
  const ranksRef = useRef<string[]>([]);
  const idxRef = useRef(0);

  useEffect(() => {
    fetch('/api/live-roster')
      .then((r) => r.json())
      .then((d) => { ranksRef.current = d.ranks || []; })
      .catch(() => { ranksRef.current = []; });
  }, []);

  useEffect(() => {
    const rotate = () => {
      const ranks = ranksRef.current;
      if (ranks.length === 0) return; // veri gelene kadar hicbir sey gosterme
      setVisible(false);
      setTimeout(() => {
        const rank = ranks[idxRef.current % ranks.length];
        idxRef.current++;
        setText(`⚓ ${rank} joined ShipCrewFinder`);
        setVisible(true);
      }, 300);
    };
    const iv = setInterval(rotate, 15000);
    const timeout = setTimeout(rotate, 1500); // ilk veri gelsin diye kisa bekleme
    return () => { clearInterval(iv); clearTimeout(timeout); };
  }, []);

  if (!text) return null;

  return (
    <div
      className="lrf-pill"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        background: '#fbbf24',
        border: '2px solid #fbbf24',
        borderRadius: 999,
        padding: '10px 22px',
        boxShadow: '0 4px 18px rgba(251,191,36,.4)',
        opacity: visible ? 1 : 0,
        transition: 'opacity .3s ease',
        flexWrap: 'wrap',
        maxWidth: '92vw',
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#0b0e13',
          flexShrink: 0,
          animation: 'lrfPulse 1.6s infinite',
        }}
      />
      <span
        className="lrf-text"
        style={{
          fontFamily: "var(--font-jakarta), sans-serif",
          fontSize: 15,
          fontWeight: 800,
          color: '#0b0e13',
          letterSpacing: '.3px',
          textAlign: 'center',
          lineHeight: 1.4,
        }}
      >
        {text}
      </span>
      <style>{`
        @keyframes lrfPulse {
          0% { box-shadow: 0 0 0 0 rgba(11,14,19,.55); }
          70% { box-shadow: 0 0 0 6px rgba(11,14,19,0); }
          100% { box-shadow: 0 0 0 0 rgba(11,14,19,0); }
        }
        @media (max-width: 640px) {
          .lrf-pill { padding: 8px 16px !important; gap: 7px !important; border-radius: 16px !important; max-width: 94vw !important; }
          .lrf-text { font-size: 12px !important; }
        }
        @media (max-width: 380px) {
          .lrf-text { font-size: 11px !important; }
        }
      `}</style>
    </div>
  );
}
