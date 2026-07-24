import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShipCrewFinder — Maritime Jobs & Crew",
    short_name: "ShipCrewFinder",
    description:
      "Verified maritime crew and companies. Direct contact, zero commission.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d1030",
    theme_color: "#0d1030",
    orientation: "portrait",
    icons: [
      {
        src: "/pwa-icon-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
