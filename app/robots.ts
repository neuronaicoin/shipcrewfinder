import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/onboarding",
          "/onboarding/*",
          "/login",
          "/auth/*",
          "/api/*",
        ],
      },
    ],
    sitemap: "https://shipcrewfinder.com/sitemap.xml",
    host: "https://shipcrewfinder.com",
  };
}
