import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export const FACTS = [
  {
    tag: "MOST SEAFARERS DON'T KNOW THIS",
    text: "Unpaid for 2 months? Your ship legally counts as ABANDONED — and the ship's insurance must pay up to 4 months of your wages.",
    foot: "MLC 2006 · Standard A2.5.2",
  },
  {
    tag: "KNOW YOUR RIGHTS",
    text: "Recruitment fees are ILLEGAL. No agency can charge you for getting a job at sea. Ever.",
    foot: "MLC 2006 · Regulation 1.4",
  },
  {
    tag: "WAR ZONE RIGHTS",
    text: "In a designated warlike area you can legally REFUSE to sail — and be sent home at the company's cost. Plus double pay if you go.",
    foot: "ITF / IBF agreements",
  },
  {
    tag: "FREE HELP, ALWAYS",
    text: "ITF inspectors help ANY seafarer for FREE — union member or not. Wages, contracts, repatriation.",
    foot: "itfseafarers.org",
  },
  {
    tag: "CONTRACT RED FLAG",
    text: "Your contract must state wages in NUMBERS. \"As per company scale\" is a blank cheque — signed by you.",
    foot: "Read before you sign",
  },
] as const;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const iRaw = parseInt(sp.get("i") || "1", 10);
  const i = isNaN(iRaw) ? 0 : Math.max(0, Math.min(FACTS.length - 1, iRaw - 1));
  const f = FACTS[i];

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
            bottom: -200,
            right: -140,
            width: 600,
            height: 600,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(251,191,36,0.18), rgba(251,191,36,0) 65%)",
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
              fontSize: 19,
              fontWeight: 800,
              color: "#f87171",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: 999,
              padding: "10px 22px",
              letterSpacing: 1,
            }}
          >
            ⚠️ {f.tag}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            paddingRight: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 54,
              fontWeight: 800,
              color: "#eef4fa",
              lineHeight: 1.25,
              textShadow: "0 2px 30px rgba(0,0,0,0.4)",
            }}
          >
            {f.text}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", fontSize: 24, color: "#a8bdd2", fontWeight: 700 }}>
            {f.foot}
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#fbbf24" }}>
            shipcrewfinder.com/blog
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
