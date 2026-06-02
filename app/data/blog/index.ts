import type { BlogIndexEntry, BlogPost } from "./types";

// Her yeni yazıyı buraya import et + posts dizisine ekle
import maritimeHiringTrends2026 from "./maritime-hiring-trends-2026";
import seafarerSalaries2026 from "./seafarer-salaries-2026";
import maritimeCvGuide from "./maritime-cv-guide";
import stcwCertificatesExplained from "./stcw-certificates-explained";

// Tüm yazıların tam içeriği (tek yazı sayfası bundan okur)
export const allPosts: BlogPost[] = [
  maritimeHiringTrends2026,
  seafarerSalaries2026,
  maritimeCvGuide,
  stcwCertificatesExplained,
];

// Tarihe göre yeniden eskiye sıralı
const sortedPosts = [...allPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

// Liste sayfası için hafif özetler
export const blogIndex: BlogIndexEntry[] = sortedPosts.map((p) => ({
  slug: p.slug,
  title: p.title,
  description: p.description,
  category: p.category,
  date: p.date,
  readingMinutes: p.readingMinutes,
  heroImage: p.heroImage,
  heroAlt: p.heroAlt,
  excerpt: p.excerpt,
}));

// Slug ile tek yazı bulma
export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}

// Statik üretim için tüm slug'lar
export function getAllSlugs(): string[] {
  return allPosts.map((p) => p.slug);
}
