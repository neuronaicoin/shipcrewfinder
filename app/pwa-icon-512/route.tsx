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
          borderRadius: 96,
          fontSize: 320,
        }}
      >
        ⚓
      </div>
    ),
    { width: 512, height: 512 }
  );
}
