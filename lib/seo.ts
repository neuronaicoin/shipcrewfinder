import type { Metadata } from "next";

export const SITE_URL = "https://shipcrewfinder.com";
export const SITE_NAME = "ShipCrewFinder";

/** Robots value for private, user-specific or form pages. */
export const NOINDEX: Metadata["robots"] = { index: false, follow: true };

type PageMetaInput = {
  title: string;
  description?: string;
  /** Relative path, e.g. "/jobs". Used for canonical + og:url. */
  path?: string;
  noindex?: boolean;
  ogType?: "website" | "article";
};

/**
 * Builds page metadata with a relative canonical and page-specific
 * Open Graph / Twitter tags (so pages never inherit the homepage's og:title/og:url).
 */
export function pageMeta({ title, description, path, noindex, ogType = "website" }: PageMetaInput): Metadata {
  const m: Metadata = { title };
  if (description) m.description = description;
  if (path) m.alternates = { canonical: path };
  if (noindex) {
    m.robots = NOINDEX;
    return m;
  }
  m.openGraph = {
    title,
    ...(description ? { description } : {}),
    ...(path ? { url: path } : {}),
    type: ogType,
    siteName: SITE_NAME,
    locale: "en_US",
  };
  m.twitter = {
    card: "summary_large_image",
    site: "@shipcrewfinder",
    title,
    ...(description ? { description } : {}),
  };
  return m;
}

/** Safe JSON-LD serialisation for <script type="application/ld+json">. */
export function jsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

/** Appends " | ShipCrewFinder" when the result stays within 60 characters. */
export function withBrand(core: string, max = 60): string {
  const branded = `${core} | ${SITE_NAME}`;
  return branded.length <= max ? branded : core;
}
