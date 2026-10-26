import type { MetadataRoute } from "next";

// Private, user-specific and form pages. They also carry a noindex robots meta.
// Share pages (/s/*, /cv/share/*) are NOT disallowed: social crawlers must be able
// to read their Open Graph cards; they are kept out of the index via noindex instead.
const PRIVATE_PATHS = [
  "/api/",
  "/auth/",
  "/dashboard",
  "/onboarding",
  "/login",
  "/forgot-password",
  "/update-password",
  "/unsubscribe",
  "/messages",
  "/profile/",
  "/requests",
  "/panel",
  "/fleet",
  "/vault",
  "/upgrade",
  "/browse",
  "/candidate/",
  "/radar",
  "/jobs/new",
  "/jobs/mine",
  "/jobs/*/edit",
  "/jobs/*/applications",
];

// AI search and assistant crawlers we explicitly welcome (ChatGPT, Perplexity,
// Claude, Google AI, Apple Intelligence, Bing/Copilot). A bot with its own group
// ignores the "*" group, so each gets the same private-path rules.
const AI_AND_SEARCH_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: AI_AND_SEARCH_BOTS, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow: PRIVATE_PATHS },
    ],
    sitemap: "https://shipcrewfinder.com/sitemap.xml",
    host: "https://shipcrewfinder.com",
  };
}
