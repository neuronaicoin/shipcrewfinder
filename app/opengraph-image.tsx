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
          background: "linear-gradient(135deg, #0a2540 0%, #0d2d4d 50%, #081d33 100%)",
          position: "relative",
        }}
      >
        {/* Wave logo */}
        <svg width="160" height="160" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 14 Q10 6, 20 14 T38 14" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
          <path d="M2 20 Q10 12, 20 20 T38 20" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <path d="M2 26 Q10 18, 20 26 T38 26" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        </svg>

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 800,
            marginTop: 40,
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
            color: "rgba(255,255,255,0.7)",
            fontSize: 30,
            marginTop: 20,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          The Global Maritime Career Platform
        </div>

        {/* Accent line */}
        <div
          style={{
            width: 120,
            height: 5,
            background: "#fbbf24",
            borderRadius: 3,
            marginTop: 36,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
