// lib/eca-marpol-areas.ts
//
// ÖNEMLİ: Bu koordinatlar YAKLAŞIKTIR — basitleştirilmiş poligonlar,
// resmi IMO/EPA shapefile'larından değil. Sadece haritada görsel referans
// içindir. Gerçek yakıt geçişi / uyum kararları için resmi seyir
// haritalarına ve güncel IMO sirkülerlerine bakılmalıdır.
//
// Kapsanan alanlar (basit, büyük deniz havzaları — kıyı-buffer'lı
// karmaşık ECA'lar (Kuzey Amerika, Karayip) resmi veri olmadan
// eklenmedi, çünkü hatalı çizilirse yanıltıcı olur).

export type AreaFeature = {
  type: "Feature";
  properties: {
    name: string;
    category: "ECA_SECA" | "MARPOL_SPECIAL";
    sulfurLimit?: string;
    color: string;
  };
  geometry: {
    type: "Polygon";
    coordinates: number[][][]; // [ [ [lon,lat], ... ] ]
  };
};

export type AreaCollection = {
  type: "FeatureCollection";
  features: AreaFeature[];
};

export const ECA_SECA_AREAS: AreaCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Baltic Sea SECA",
        category: "ECA_SECA",
        sulfurLimit: "0.10% S",
        color: "#34d399",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [9.4, 54.0], [12.0, 54.6], [14.5, 54.0], [19.0, 54.3],
            [21.0, 55.2], [23.5, 59.5], [28.5, 60.2], [30.3, 60.0],
            [28.0, 65.9], [20.0, 65.5], [17.0, 62.5], [11.0, 58.0],
            [9.4, 54.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "North Sea SECA (incl. English Channel)",
        category: "ECA_SECA",
        sulfurLimit: "0.10% S",
        color: "#34d399",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-5.5, 48.5], [-1.5, 49.7], [2.0, 51.0], [4.2, 51.4],
            [8.9, 55.0], [8.0, 58.0], [5.0, 61.0], [-1.0, 61.5],
            [-4.5, 58.5], [-6.0, 54.0], [-5.5, 48.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Mediterranean Sea SECA (effective May 2025)",
        category: "ECA_SECA",
        sulfurLimit: "0.10% S",
        color: "#34d399",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-5.5, 35.9], [3.0, 43.5], [9.5, 44.3], [15.0, 45.8],
            [19.5, 40.0], [26.5, 40.5], [30.0, 36.0], [35.5, 31.5],
            [32.0, 31.2], [25.0, 34.5], [18.0, 33.0], [11.0, 33.5],
            [3.0, 36.0], [-5.5, 35.9],
          ],
        ],
      },
    },
  ],
};

// MARPOL Ek I "Special Area" olarak tanımlı denizler — burada da yalnızca
// büyük, göreceli basit havzalar var; kıyı-buffer'lı karmaşık alanlar yok.
export const MARPOL_SPECIAL_AREAS: AreaCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Mediterranean Sea (MARPOL Special Area)",
        category: "MARPOL_SPECIAL",
        color: "#f87171",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-5.5, 35.9], [3.0, 43.5], [9.5, 44.3], [15.0, 45.8],
            [19.5, 40.0], [26.5, 40.5], [30.0, 36.0], [35.5, 31.5],
            [32.0, 31.2], [25.0, 34.5], [18.0, 33.0], [11.0, 33.5],
            [3.0, 36.0], [-5.5, 35.9],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Black Sea (MARPOL Special Area)",
        category: "MARPOL_SPECIAL",
        color: "#f87171",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [27.5, 41.2], [29.5, 41.0], [35.0, 42.0], [41.5, 41.0],
            [41.5, 44.5], [37.0, 46.5], [30.5, 46.6], [27.5, 44.5],
            [27.5, 41.2],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Red Sea (MARPOL Special Area)",
        category: "MARPOL_SPECIAL",
        color: "#f87171",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [32.5, 29.9], [34.5, 27.7], [36.5, 24.0], [38.0, 18.0],
            [40.0, 14.0], [43.5, 12.5], [43.0, 11.0], [40.5, 13.5],
            [37.5, 16.5], [35.5, 22.0], [33.0, 27.5], [32.5, 29.9],
          ],
        ],
      },
    },
  ],
};
