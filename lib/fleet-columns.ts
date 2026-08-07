// Sunucu aksiyonu DEĞİL — hem actions dosyası hem sayfa bileşenleri tarafından
// paylaşılan, saf yardımcı fonksiyon. "use server" dosyalarına konulamaz.

export const FIXED_COLUMNS: { key: string; label: string }[] = [
  { key: "name", label: "Surname and Name" },
  { key: "sex", label: "Sex" },
  { key: "rank", label: "Rank" },
  { key: "nationality", label: "Nationality" },
  { key: "dob", label: "Date of Birth" },
  { key: "join_date", label: "Join Date" },
  { key: "passport_no", label: "Passport No" },
  { key: "passport_exp", label: "Passport Exp" },
  { key: "seaman_no", label: "Seaman Book No" },
  { key: "seaman_exp", label: "Seaman Book Exp" },
  { key: "health_exp", label: "Health Exp" },
  { key: "visa_exp", label: "Visa Exp" },
];

export type EffectiveColumn = { key: string; label: string; custom: boolean };

export function getEffectiveColumns(
  columnOrder: string[],
  columnLabels: Record<string, string>,
  customColumns: string[]
): EffectiveColumn[] {
  const seen = new Set<string>();
  const result: EffectiveColumn[] = [];

  const order =
    columnOrder && columnOrder.length > 0
      ? columnOrder
      : [...FIXED_COLUMNS.map((c) => c.key), ...customColumns];

  order.forEach((key) => {
    if (seen.has(key)) return;
    const fixed = FIXED_COLUMNS.find((c) => c.key === key);
    if (fixed) {
      seen.add(key);
      result.push({ key, label: columnLabels[key] || fixed.label, custom: false });
    } else if (customColumns.includes(key)) {
      seen.add(key);
      result.push({ key, label: columnLabels[key] || key, custom: true });
    }
  });

  // Sırada olmayan (yeni eklenmiş) sütunları sona ekle
  FIXED_COLUMNS.forEach((c) => {
    if (!seen.has(c.key)) {
      seen.add(c.key);
      result.push({ key: c.key, label: columnLabels[c.key] || c.label, custom: false });
    }
  });
  customColumns.forEach((name) => {
    if (!seen.has(name)) {
      seen.add(name);
      result.push({ key: name, label: columnLabels[name] || name, custom: true });
    }
  });

  return result;
}
