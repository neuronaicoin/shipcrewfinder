import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(150deg, #ffd34d, #fbbf24 55%, #e0a010)",
          borderRadius: 14,
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#0b0e13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2.4" />
          <line x1="12" y1="7.4" x2="12" y2="20.5" />
          <line x1="7.5" y1="10.4" x2="16.5" y2="10.4" />
          <path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7" />
          <path d="M4.5 14.8l-1.6-1.2M4.5 14.8l2-.4" />
          <path d="M19.5 14.8l1.6-1.2M19.5 14.8l-2-.4" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
