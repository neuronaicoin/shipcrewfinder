import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #fbbf24, #e0a010)",
          borderRadius: 36,
          fontSize: 118,
        }}
      >
        ⚓
      </div>
    ),
    { width: 192, height: 192 }
  );
}
