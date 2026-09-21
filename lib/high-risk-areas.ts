// lib/high-risk-areas.ts
//
// ÖNEMLİ: Bu SADECE tarihsel/genel farkındalık amaçlıdır — gerçek zamanlı
// tehdit istihbaratı DEĞİLDİR. Risk seviyeleri zamanla değişir. Gerçek
// seyir/güvenlik kararları için UKMTO (ukmto.org) ve IMB Piracy Reporting
// Centre (icc-ccs.org) gibi güncel, resmi kaynaklara bakılmalıdır.
//
// Koordinatlar basitleştirilmiş yaklaşık poligonlardır.

export type RiskArea = {
  type: "Feature";
  properties: { name: string; note: string; color: string };
  geometry: { type: "Polygon"; coordinates: number[][][] };
};

export type RiskAreaCollection = { type: "FeatureCollection"; features: RiskArea[] };

export const HIGH_RISK_AREAS: RiskAreaCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Gulf of Aden / Somali Basin",
        note: "Historically high piracy risk area — check UKMTO VRA before transit.",
        color: "#fb923c",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [43.0, 10.5], [51.0, 12.5], [56.0, 14.0], [60.0, 10.0],
            [62.0, 4.0], [55.0, -2.0], [48.0, 2.0], [43.5, 6.0],
            [43.0, 10.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Gulf of Guinea",
        note: "Elevated kidnap/robbery risk historically — check regional advisories.",
        color: "#fb923c",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-5.0, 5.5], [2.0, 5.5], [8.5, 4.0], [9.5, 0.0],
            [6.0, -3.0], [0.0, -1.0], [-5.0, 2.0], [-5.0, 5.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Singapore / Malacca Strait",
        note: "Historically elevated petty theft / robbery risk in anchorage areas.",
        color: "#fbbf24",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [98.5, 6.5], [103.0, 5.0], [104.5, 1.5], [103.5, 0.5],
            [100.0, 2.5], [97.5, 4.5], [98.5, 6.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Sulu-Celebes Sea",
        note: "Historically elevated kidnap-for-ransom risk in this area.",
        color: "#fbbf24",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [118.0, 8.0], [124.0, 8.0], [125.5, 4.5], [121.0, 3.0],
            [117.5, 5.0], [118.0, 8.0],
          ],
        ],
      },
    },
  ],
};
