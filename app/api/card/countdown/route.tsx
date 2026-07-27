import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const daysRaw = parseInt(sp.get("d") || "0", 10);
  const days = isNaN(daysRaw) ? 0 : Math.max(0, Math.min(999, daysRaw));
  const rank = (sp.get("r") || "SEAFARER").slice(0, 28).toUpperCase();
  const pctRaw = parseInt(sp.get("p") || "-1", 10);
  const pct = isNaN(pctRaw) || pctRaw < 0 ? null : Math.min(100, pctRaw);

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
            right: -120,
            width: 560,
            height: 560,
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
              fontWeight: 700,
              color: "#fbbf24",
              background: "rgba(251,191,36,0.09)",
              border: "1px solid rgba(251,191,36,0.35)",
              borderRadius: 999,
              padding: "10px 22px",
            }}
          >
            CONTRACT COUNTDOWN
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 34 }}>
          <div
            style={{
              display: "flex",
              fontSize: 210,
              fontWeight: 800,
              color: "#fbbf24",
              lineHeight: 1,
              textShadow: "0 0 60px rgba(251,191,36,0.35)",
            }}
          >
            {String(days)}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontWeight: 800,
              color: "#eef4fa",
              letterSpacing: 6,
              marginTop: 4,
            }}
          >
            DAYS TO SIGN-OFF
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 26,
              fontWeight: 700,
              color: "#a8bdd2",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
              padding: "10px 26px",
            }}
          >
            {rank}
          </div>

          {pct !== null ? (
            <div
              style={{
                display: "flex",
                width: 720,
                height: 20,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 999,
                marginTop: 30,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: `${(720 * pct) / 100}px`,
                  height: 20,
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #e0a010, #fbbf24)",
                }}
              />
            </div>
          ) : null}
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
