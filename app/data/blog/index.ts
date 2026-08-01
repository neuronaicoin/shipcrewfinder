import type { BlogIndexEntry, BlogPost } from "./types";
// Her yeni yazıyı buraya import et + posts dizisine ekle
import seafarerMentalHealthSignsSupport from "./seafarer-mental-health-signs-support";
import howToReadSeafarerJobPostingLikeRecruiter from "./how-to-read-seafarer-job-posting-like-recruiter";
import portStateControlInspectionsDetention2026 from "./port-state-control-inspections-detention-2026";
import yachtCrewVsMerchantNavySalary from "./yacht-crew-vs-merchant-navy-salary";
import lngDualFuelCareersHighestPaying2026 from "./lng-dual-fuel-careers-highest-paying-2026";
import howToNegotiateSeafarerSalary from "./how-to-negotiate-seafarer-salary";
import firstContractCadetGuide from "./first-contract-cadet-guide";
import warRiskBonusSeafarerPay2026 from "./war-risk-bonus-seafarer-pay-2026";
import seafarerRecruitmentFeesIllegalMlc2006 from "./seafarer-recruitment-fees-illegal-mlc-2006";
import stcwCertificateExpiryRenewalChecklist from "./stcw-certificate-expiry-renewal-checklist";
import chiefEngineerVsMasterSalary from "./chief-engineer-vs-master-salary";
import howToGetSeafarerJobWithoutAgency from "./how-to-get-seafarer-job-without-agency";
import seafarerSalaryGuide2026RankVesselType from "./seafarer-salary-guide-2026-rank-vessel-type";
import crewingDepartmentKpis from "./crewing-department-kpis-metrics-guide";
import crewRetentionWhySeafarersDontReturn from "./crew-retention-why-seafarers-dont-return";
import howToFindQualifiedShipCrew from "./how-to-find-qualified-ship-crew-hiring-guide";
import fakeSeafarerJobOffersScams from "./fake-seafarer-job-offers-recruitment-scams";
import howToReadSeaRedFlags from "./how-to-read-seafarer-employment-agreement-red-flags";
import whatDoesTheItfActuallyDo from "./what-does-the-itf-actually-do-for-seafarers";
import seafarerWagesNotPaidAbandonment from "./seafarer-wages-not-paid-ship-abandonment-guide";
import blackSeaAttacksSeafarerRights from "./black-sea-attacks-seafarer-rights-compensation";
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
  seafarerMentalHealthSignsSupport,
  howToReadSeafarerJobPostingLikeRecruiter,
  portStateControlInspectionsDetention2026,
  yachtCrewVsMerchantNavySalary,
  lngDualFuelCareersHighestPaying2026,
  howToNegotiateSeafarerSalary,
  firstContractCadetGuide,
  warRiskBonusSeafarerPay2026,
  seafarerRecruitmentFeesIllegalMlc2006,
  stcwCertificateExpiryRenewalChecklist,
  chiefEngineerVsMasterSalary,
  howToGetSeafarerJobWithoutAgency,
  seafarerSalaryGuide2026RankVesselType,
  crewingDepartmentKpis,
  crewRetentionWhySeafarersDontReturn,
  howToFindQualifiedShipCrew,
  fakeSeafarerJobOffersScams,
  howToReadSeaRedFlags,
  whatDoesTheItfActuallyDo,
  seafarerWagesNotPaidAbandonment,
  blackSeaAttacksSeafarerRights,
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
