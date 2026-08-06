// Tek gerçek kaynak: hangi paket neye erişebilir.
// "founding" = eski/mevcut şirketler, Polar canlıya geçene kadar Pro-eşdeğeri sayılıyor.
// Fleet Crew Manager: HERKES 1 gemi kullanabilir (deneme amaçlı) — 2. gemi için gerçek Fleet planı şart.

export type CompanyPlan = "pro" | "fleet" | "founding" | "free" | null | undefined;

export type PlanAccess = {
  canSearchCrew: boolean;
  cvViewLimit: number | null;
  canPostJob: boolean;
  jobPostLimit: number | null;
  canUseRadar: boolean;
  vesselLimit: number | null; // null = sınırsız gemi, sayı = o kadar gemiye kadar ücretsiz
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
      vesselLimit: null,
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
      vesselLimit: 1,
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
    vesselLimit: 1,
    label: "Free",
  };
}
