import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ShipCrewFinder — Global Maritime Career Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d1030 0%, #141845 55%, #050716 100%)",
          position: "relative",
        }}
      >
        {/* Altın parıltı */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -120,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "radial-gradient(circle, rgba(251,191,36,0.22), transparent 65%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260,
            left: -140,
            width: 560,
            height: 560,
            borderRadius: 560,
            background: "radial-gradient(circle, rgba(37,99,235,0.25), transparent 65%)",
            display: "flex",
          }}
        />

        {/* Altın kutuda çapa logo */}
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 36,
            background: "linear-gradient(145deg, #fbbf24, #e0a010)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 24px 60px rgba(251,191,36,0.35)",
          }}
        >
          <svg width="92" height="92" viewBox="0 0 24 24" fill="none" stroke="#0b0e13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="2.4" />
            <line x1="12" y1="7.4" x2="12" y2="20.5" />
            <line x1="7.5" y1="10.4" x2="16.5" y2="10.4" />
            <path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7" />
            <path d="M4.5 14.8l-1.6-1.2M4.5 14.8l2-.4" />
            <path d="M19.5 14.8l1.6-1.2M19.5 14.8l-2-.4" />
          </svg>
        </div>

        {/* Marka adı */}
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            marginTop: 38,
            letterSpacing: "-0.03em",
          }}
        >
          <span style={{ color: "#ffffff" }}>Ship</span>
          <span style={{ color: "#fbbf24" }}>Crew</span>
          <span style={{ color: "#ffffff" }}>Finder</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            color: "rgba(238,244,250,0.8)",
            fontSize: 30,
            marginTop: 18,
            textAlign: "center",
            maxWidth: 860,
            display: "flex",
          }}
        >
          The Global Maritime Career Platform
        </div>

        {/* Alt şerit: değer önerileri */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 42,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#fbbf24",
              fontSize: 22,
              fontWeight: 700,
              border: "2px solid rgba(251,191,36,0.5)",
              borderRadius: 999,
              padding: "10px 26px",
              background: "rgba(251,191,36,0.08)",
            }}
          >
            0% commission — ever
          </div>
          <div
            style={{
              display: "flex",
              color: "#34d399",
              fontSize: 22,
              fontWeight: 700,
              border: "2px solid rgba(52,211,153,0.5)",
              borderRadius: 999,
              padding: "10px 26px",
              background: "rgba(52,211,153,0.08)",
            }}
          >
            ✓ Verified profiles
          </div>
          <div
            style={{
              display: "flex",
              color: "#60a5fa",
              fontSize: 22,
              fontWeight: 700,
              border: "2px solid rgba(96,165,250,0.5)",
              borderRadius: 999,
              padding: "10px 26px",
              background: "rgba(96,165,250,0.08)",
            }}
          >
            Direct contact
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
