// Tek gerçek kaynak: hangi paket neye erişebilir.
// "founding" = eski/mevcut şirketler, Polar canlıya geçene kadar Pro-eşdeğeri sayılıyor.
// Fleet Crew Manager İSTİSNA: founding dahil, sadece GERÇEK "fleet" planı erişebilir —
// bu yepyeni bir özellik, geriye dönük ücretsiz erişim verilmiyor.

export type CompanyPlan = "pro" | "fleet" | "founding" | "free" | null | undefined;

export type PlanAccess = {
  canSearchCrew: boolean; // /candidate/[id] detay görebilir mi
  cvViewLimit: number | null; // null = sınırsız
  canPostJob: boolean;
  jobPostLimit: number | null; // null = sınırsız
  canUseRadar: boolean; // Rotation Radar'daki isimleri görebilir mi
  canUseFleetManager: boolean; // Fleet Crew Manager — sadece gerçek Fleet planı
  label: string;
};

export function getPlanAccess(plan: CompanyPlan): PlanAccess {
  const p = plan || "free";

  if (p === "fleet") {
    return {
      canSearchCrew: true,
      cvViewLimit: null,
      canPostJob: true,
      jobPostLimit: null,
      canUseRadar: true,
      canUseFleetManager: true,
      label: "Fleet",
    };
  }

  if (p === "pro" || p === "founding") {
    return {
      canSearchCrew: true,
      cvViewLimit: 100,
      canPostJob: true,
      jobPostLimit: 10,
      canUseRadar: true,
      canUseFleetManager: false,
      label: p === "founding" ? "Founding" : "Pro",
    };
  }

  // "free" — ödeme yok, deneme bitmiş veya paket hiç seçilmemiş
  return {
    canSearchCrew: false,
    cvViewLimit: 0,
    canPostJob: false,
    jobPostLimit: 0,
    canUseRadar: false,
    canUseFleetManager: false,
    label: "Free",
  };
}
