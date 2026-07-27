import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const rank = (sp.get("r") || "CHIEF ENGINEER").slice(0, 28).toUpperCase();
  const salary = (sp.get("s") || "$8,500 – $11,500").slice(0, 24);
  const vessel = (sp.get("v") || "per month · international fleet").slice(0, 44);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(160deg, #141845 0%, #0d1030 55%, #050716 100%)",
          padding: "56px 64px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            left: -120,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(52,211,153,0.16), rgba(52,211,153,0) 65%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(145deg, #fbbf24, #e0a010)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            ⚓
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#eef4fa" }}>
            Ship<span style={{ color: "#fbbf24" }}>Crew</span>Finder
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              fontSize: 20,
              fontWeight: 700,
              color: "#34d399",
              background: "rgba(52,211,153,0.09)",
              border: "1px solid rgba(52,211,153,0.35)",
              borderRadius: 999,
              padding: "10px 22px",
            }}
          >
            💰 2026 SALARY INDEX
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 44 }}>
          <div
            style={{
              display: "flex",
              fontSize: 52,
              fontWeight: 800,
              color: "#eef4fa",
              letterSpacing: 3,
            }}
          >
            {rank}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 130,
              fontWeight: 800,
              color: "#34d399",
              lineHeight: 1.05,
              marginTop: 12,
              textShadow: "0 0 60px rgba(52,211,153,0.3)",
            }}
          >
            {salary}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#a8bdd2", marginTop: 14 }}>
            {vessel}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", fontSize: 22, color: "#6b83a0" }}>
            Know your worth · 15 ranks benchmarked
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#fbbf24" }}>
            shipcrewfinder.com/salary
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
