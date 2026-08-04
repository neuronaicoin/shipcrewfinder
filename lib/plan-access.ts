// Tek gerçek kaynak: hangi paket neye erişebilir.
// "founding" = eski/mevcut şirketler, Polar canlıya geçene kadar Pro-eşdeğeri sayılıyor.
// Polar hazır olduğunda burada TEK satır değişecek: founding'i "free" yap, yeter.

export type CompanyPlan = "pro" | "fleet" | "founding" | "free" | null | undefined;

export type PlanAccess = {
  canSearchCrew: boolean; // /candidate/[id] detay görebilir mi
  cvViewLimit: number | null; // null = sınırsız
  canPostJob: boolean;
  jobPostLimit: number | null; // null = sınırsız
  canUseRadar: boolean; // Rotation Radar'daki isimleri görebilir mi
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
    label: "Free",
  };
}
