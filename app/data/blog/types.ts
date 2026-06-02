export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogSection {
  heading?: string;        // H2 başlık (opsiyonel — giriş paragrafları için boş bırakılır)
  paragraphs: string[];    // bu bölümün paragrafları
}

export interface BlogPost {
  slug: string;            // URL: /blog/[slug]
  title: string;           // H1 + meta title
  description: string;     // meta description (150-160 karakter)
  category: string;        // ör. "Industry Trends"
  author: string;          // "Maritime industry professional"
  date: string;            // ISO: "2026-06-02"
  readingMinutes: number;  // tahmini okuma süresi
  heroImage: string;       // Unsplash URL
  heroAlt: string;         // görsel alt metni (SEO + erişilebilirlik)
  excerpt: string;         // liste sayfasındaki kısa özet
  intro: string[];         // giriş paragrafları (başlıksız)
  sections: BlogSection[]; // gövde bölümleri
  faqs: FAQItem[];         // FAQPage schema için SSS
  keywords: string[];      // meta keywords
}

export interface BlogIndexEntry {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readingMinutes: number;
  heroImage: string;
  heroAlt: string;
  excerpt: string;
}
