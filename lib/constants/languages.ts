// ============================================
// LANGUAGES
// Used in: Crew profile (language skills)
// ============================================

export interface Language {
  code: string; // ISO 639-1
  name: string;
  native: string; // Native name
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", native: "English" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "nl", name: "Dutch", native: "Nederlands" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "uk", name: "Ukrainian", native: "Українська" },
  { code: "pl", name: "Polish", native: "Polski" },
  { code: "ro", name: "Romanian", native: "Română" },
  { code: "bg", name: "Bulgarian", native: "Български" },
  { code: "hr", name: "Croatian", native: "Hrvatski" },
  { code: "sr", name: "Serbian", native: "Српски" },
  { code: "el", name: "Greek", native: "Ελληνικά" },
  { code: "tr", name: "Turkish", native: "Türkçe" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "he", name: "Hebrew", native: "עברית" },
  { code: "fa", name: "Persian", native: "فارسی" },
  { code: "ur", name: "Urdu", native: "اردو" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "ne", name: "Nepali", native: "नेपाली" },
  { code: "si", name: "Sinhala", native: "සිංහල" },
  { code: "my", name: "Burmese", native: "မြန်မာ" },
  { code: "th", name: "Thai", native: "ไทย" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu" },
  { code: "tl", name: "Tagalog", native: "Tagalog" },
  { code: "zh", name: "Chinese (Mandarin)", native: "中文" },
  { code: "yue", name: "Chinese (Cantonese)", native: "粵語" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "sv", name: "Swedish", native: "Svenska" },
  { code: "no", name: "Norwegian", native: "Norsk" },
  { code: "da", name: "Danish", native: "Dansk" },
  { code: "fi", name: "Finnish", native: "Suomi" },
  { code: "is", name: "Icelandic", native: "Íslenska" },
  { code: "et", name: "Estonian", native: "Eesti" },
  { code: "lv", name: "Latvian", native: "Latviešu" },
  { code: "lt", name: "Lithuanian", native: "Lietuvių" },
  { code: "cs", name: "Czech", native: "Čeština" },
  { code: "sk", name: "Slovak", native: "Slovenčina" },
  { code: "hu", name: "Hungarian", native: "Magyar" },
  { code: "sl", name: "Slovenian", native: "Slovenščina" },
  { code: "mk", name: "Macedonian", native: "Македонски" },
  { code: "sq", name: "Albanian", native: "Shqip" },
  { code: "bs", name: "Bosnian", native: "Bosanski" },
  { code: "mt", name: "Maltese", native: "Malti" },
  { code: "ka", name: "Georgian", native: "ქართული" },
  { code: "hy", name: "Armenian", native: "Հայերեն" },
  { code: "az", name: "Azerbaijani", native: "Azərbaycanca" },
  { code: "kk", name: "Kazakh", native: "Қазақша" },
  { code: "uz", name: "Uzbek", native: "Oʻzbekcha" },
  { code: "sw", name: "Swahili", native: "Kiswahili" },
  { code: "am", name: "Amharic", native: "አማርኛ" },
  { code: "so", name: "Somali", native: "Soomaali" },
  { code: "ha", name: "Hausa", native: "Hausa" },
  { code: "yo", name: "Yoruba", native: "Yorùbá" },
  { code: "zu", name: "Zulu", native: "isiZulu" },
  { code: "af", name: "Afrikaans", native: "Afrikaans" },
];

// English proficiency levels (industry standard for maritime jobs)
export const ENGLISH_LEVELS = [
  { value: "basic", label: "Basic" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "fluent", label: "Fluent" },
  { value: "native", label: "Native" },
];

// Most common languages first (in dropdown order)
export const POPULAR_LANGUAGES = ["en", "es", "fr", "de", "ru", "uk", "tr", "ar", "zh", "hi", "tl", "ru"];

// Helper: Get language by code
export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}

// Helper: Get sorted list with popular languages first
export function getSortedLanguages(): Language[] {
  const popular = POPULAR_LANGUAGES
    .map((code) => LANGUAGES.find((l) => l.code === code))
    .filter((l): l is Language => l !== undefined);
  const rest = LANGUAGES.filter(
    (l) => !POPULAR_LANGUAGES.includes(l.code)
  ).sort((a, b) => a.name.localeCompare(b.name));
  return [...popular, ...rest];
}
