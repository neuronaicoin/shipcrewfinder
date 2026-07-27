import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const years = (sp.get("y") || "0").slice(0, 5);
  const vessels = (sp.get("v") || "0").slice(0, 4);
  const rank = (sp.get("r") || "SEAFARER").slice(0, 28).toUpperCase();
  const dwt = (sp.get("d") || "").slice(0, 18);

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
            top: -160,
            right: -140,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(251,191,36,0.22), rgba(251,191,36,0) 65%)",
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
              fontWeight: 800,
              color: "#34d399",
              background: "rgba(52,211,153,0.09)",
              border: "1px solid rgba(52,211,153,0.35)",
              borderRadius: 999,
              padding: "10px 22px",
            }}
          >
            ✓ VERIFIED SEA SERVICE
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 26 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 190,
                fontWeight: 800,
                color: "#fbbf24",
                lineHeight: 1,
                textShadow: "0 0 60px rgba(251,191,36,0.35)",
              }}
            >
              {years}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 52,
                fontWeight: 800,
                color: "#eef4fa",
                letterSpacing: 4,
              }}
            >
              YEARS AT SEA
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 34, flexWrap: "wrap", justifyContent: "center" }}>
            <div
              style={{
                display: "flex",
                fontSize: 27,
                fontWeight: 700,
                color: "#eef4fa",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 14,
                padding: "12px 26px",
              }}
            >
              {rank}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 27,
                fontWeight: 700,
                color: "#a8bdd2",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 14,
                padding: "12px 26px",
              }}
            >
              🚢 {vessels} vessels
            </div>
            {dwt ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 27,
                  fontWeight: 700,
                  color: "#a8bdd2",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 14,
                  padding: "12px 26px",
                }}
              >
                ⚙️ up to {dwt} DWT
              </div>
            ) : null}
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
            Built at sea. Works at sea.
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#fbbf24" }}>
            shipcrewfinder.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
