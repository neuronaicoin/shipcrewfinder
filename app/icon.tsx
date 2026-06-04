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
          background: "#0a2540",
          borderRadius: 12,
        }}
      >
        <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 14 Q10 6, 20 14 T38 14" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
          <path d="M2 20 Q10 12, 20 20 T38 20" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <path d="M2 26 Q10 18, 20 26 T38 26" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
