import type { BlogIndexEntry, BlogPost } from "./types";
// Her yeni yazıyı buraya import et + posts dizisine ekle
import whySeafarerApplicationsGetRejected from "./why-seafarer-applications-get-rejected";
import bimcoSeafarerWorkforceReport2026 from "./bimco-seafarer-workforce-report-2026";
import maritimeHiringTrends2026 from "./maritime-hiring-trends-2026";
import seafarerSalaries2026 from "./seafarer-salaries-2026";
import maritimeCvGuide from "./maritime-cv-guide";
import stcwCertificatesExplained from "./stcw-certificates-explained";
import stealthJobSearchSeafarers from "./stealth-job-search-seafarers";
import shipCrewVsYachtCrew from "./ship-crew-vs-yacht-crew";
import howToGetAJobOnAShip from "./how-to-get-a-job-on-a-ship";
import seafarerSalaryByRank from "./seafarer-salary-by-rank";
import seafarerContractLengthRotation from "./seafarer-contract-length-rotation";
import howToBecomeYachtCrew from "./how-to-become-yacht-crew";
import tankerVsCargoShipJobs from "./tanker-vs-cargo-ship-jobs";
// Tüm yazıların tam içeriği (tek yazı sayfası bundan okur)
export const allPosts: BlogPost[] = [
  whySeafarerApplicationsGetRejected,
  bimcoSeafarerWorkforceReport2026,
  tankerVsCargoShipJobs,
  howToBecomeYachtCrew,
  seafarerContractLengthRotation,
  seafarerSalaryByRank,
  howToGetAJobOnAShip,
  maritimeHiringTrends2026,
  seafarerSalaries2026,
  maritimeCvGuide,
  stcwCertificatesExplained,
  stealthJobSearchSeafarers,
  shipCrewVsYachtCrew,
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
