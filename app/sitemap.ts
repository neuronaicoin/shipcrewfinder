import type { MetadataRoute } from "next";
import { blogIndex } from "@/app/data/blog";
import { SHIP_RANKS } from "@/lib/constants/ranks";
import { SALARY_DATA, VESSELS } from "@/lib/data/salary";
import { NATIONALITIES } from "@/lib/data/nationalities";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://shipcrewfinder.com";
  const lastModified = new Date();
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
      url: `${baseUrl}/login`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
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
      url: `${baseUrl}/blog`,
      lastModified,
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
  const blogPages: MetadataRoute.Sitemap = blogIndex.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
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
  try {
    const supabase = await createClient();
    const [{ data: vData }, { data: cData }] = await Promise.all([
      supabase.rpc("get_vessel_index"),
      supabase.rpc("get_worked_company_index"),
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
  } catch {
    // Supabase erişilemezse dinamik kısımlar atlanır
  }
  return [...staticPages, ...rankPages, ...comboPages, ...salaryPages, ...blogPages, ...vesselPages, ...companyPages];
}
