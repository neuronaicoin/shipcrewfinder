import type { MetadataRoute } from "next";
import { allPosts } from "@/app/data/blog";
import { SHIP_RANKS } from "@/lib/constants/ranks";
import { SALARY_DATA, VESSELS } from "@/lib/data/salary";
import { PORTS } from "@/lib/data/ports";
import { RANK_CONTEXTS } from "@/lib/data/rank-context";
import { NATIONALITIES } from "@/lib/data/nationalities";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://shipcrewfinder.com";
  const lastModified = new Date();
  // Real dates for blog content: newest post date for the index, each post's own date below.
  const postModified = (p: (typeof allPosts)[number]) => {
    const extra = p as typeof p & { dateModified?: string; updated?: string };
    const d = new Date(extra.dateModified || extra.updated || p.date);
    return Number.isNaN(d.getTime()) ? new Date(p.date) : d;
  };
  const latestPost = allPosts.length
    ? new Date(Math.max(...allPosts.map((p) => postModified(p).getTime())))
    : lastModified;
  // Statik sayfalar (sadece gerçekten var olanlar)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/signup/crew`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/signup/company`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/deck`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/messroom`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/vessels`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/vessel-tracker`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/career-path`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: latestPost,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/gdpr`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
  // Blog yazıları (otomatik — her yeni yazı buraya kendiliğinden gelir)
  const blogPages: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: postModified(post),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  // Crew Toolkit: hub + every live tool page under app/tools/<slug>.
  // Keep in sync when a tool folder is added (each must have a page.tsx).
  const TOOL_SLUGS = [
    "bmp5", "bwm", "cargo", "certificates", "cii-calculator", "claims", "colregs",
    "distance-eta", "documents", "draft-survey", "draft-survey-pro", "emergency",
    "enclosed-space", "fatigue", "flags", "heavy-weather", "ice-navigation", "imdg",
    "interpolation-table", "ism", "isps", "itf", "lashing", "maintenance", "medical",
    "mlc", "oil-record-book", "port-documentation", "ports", "psc", "solas",
    "stability", "tide", "unit-converter", "vetting", "visa",
  ];
  const toolPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/tools`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...TOOL_SLUGS.map((t) => ({
      url: `${baseUrl}/tools/${t}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
  // Rank sayfaları (programatik SEO)
  const slugify = (r: string) => r.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const rankPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/crew`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...Object.values(SHIP_RANKS).flat().map((r) => ({
      url: `${baseUrl}/crew/${slugify(r as string)}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
  // Rank × gemi tipi kombo sayfaları (programatik SEO — sadece maaş verisi olan ranklar)
  const comboPages: MetadataRoute.Sitemap = Object.values(SHIP_RANKS)
    .flat()
    .filter((r) => SALARY_DATA.some((s) => norm(s.rank) === norm(r as string)))
    .flatMap((r) =>
      VESSELS.map((v) => ({
        url: `${baseUrl}/crew/${slugify(r as string)}/${v.key}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    );
  // Port × rütbe sayfaları (programatik SEO — 48 sayfa: 8 liman × 6 rütbe)
  const portRankPages: MetadataRoute.Sitemap = PORTS.flatMap((p) =>
    RANK_CONTEXTS.map((r) => ({
      url: `${baseUrl}/ports/${p.slug}/${r.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    }))
  );
  // Salary Index sayfaları (programatik SEO)
  const salaryPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/salary`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/salary-check`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/salary/tools`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    ...SALARY_DATA.map((r) => ({
      url: `${baseUrl}/salary/${r.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...NATIONALITIES.map((n) => ({
      url: `${baseUrl}/salary/for/${n.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
  // Gemi + şirket sayfaları (dinamik — sea_contracts'tan; hata olursa boş, sitemap kırılmaz)
  let vesselPages: MetadataRoute.Sitemap = [];
  let companyPages: MetadataRoute.Sitemap = [];
  let jobPages: MetadataRoute.Sitemap = [];
  let careersPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const [{ data: vData }, { data: cData }, { data: jData }, { data: kData }] = await Promise.all([
      supabase.rpc("get_vessel_index"),
      supabase.rpc("get_worked_company_index"),
      supabase.from("jobs").select("id, created_at").eq("status", "active").limit(5000),
      supabase.from("company_details").select("id, careers_slug").not("careers_slug", "is", null).limit(5000),
    ]);
    const vessels = (Array.isArray(vData) ? vData : []) as { slug: string }[];
    const companies = (Array.isArray(cData) ? cData : []) as { slug: string }[];
    vesselPages = vessels.map((v) => ({
      url: `${baseUrl}/vessel/${v.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
    companyPages = companies.map((c) => ({
      url: `${baseUrl}/company/${c.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
    // Active job ads (inactive ones are noindex on the page itself).
    jobPages = ((jData || []) as { id: string; created_at: string | null }[]).map((j) => ({
      url: `${baseUrl}/jobs/${j.id}`,
      lastModified: j.created_at ? new Date(j.created_at) : lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
    // White-label careers pages, only for companies whose profile is not hidden (the page 404s otherwise).
    const careerRows = ((kData || []) as { id: string; careers_slug: string | null }[]).filter((k) => k.careers_slug);
    if (careerRows.length) {
      const { data: visRows } = await supabase
        .from("profiles")
        .select("id, visibility")
        .in("id", careerRows.map((k) => k.id));
      const visible = new Set(
        ((visRows || []) as { id: string; visibility: string | null }[])
          .filter((r) => r.visibility !== "hidden")
          .map((r) => r.id)
      );
      careersPages = careerRows
        .filter((k) => visible.has(k.id))
        .map((k) => ({
          url: `${baseUrl}/careers/${k.careers_slug}`,
          lastModified,
          changeFrequency: "weekly" as const,
          priority: 0.5,
        }));
    }
  } catch {
    // Supabase erişilemezse dinamik kısımlar atlanır
  }
  return [
    ...staticPages,
    ...toolPages,
    ...rankPages,
    ...comboPages,
    ...portRankPages,
    ...salaryPages,
    ...blogPages,
    ...jobPages,
    ...careersPages,
    ...vesselPages,
    ...companyPages,
  ];
}
