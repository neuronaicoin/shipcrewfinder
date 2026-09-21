// Her deploy'da bir kez çalışır: tüm site URL'lerini IndexNow'a bildirir
// (Bing + Yandex + IndexNow ortakları — ChatGPT aramasının ana kaynağı Bing'dir)
//
// NOT: AIS canlı gemi takibi kaldırıldı (Voyage Planner'a odaklanmak için) —
// bu dosya artık sadece IndexNow bildirimini yapıyor.

export async function register() {
  if (process.env.NEXT_RUNTIME && process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NODE_ENV !== "production") return;

  try {
    const base = "https://shipcrewfinder.com";

    const { blogIndex } = await import("@/app/data/blog");
    const { SHIP_RANKS } = await import("@/lib/constants/ranks");
    const { SALARY_DATA, VESSELS } = await import("@/lib/data/salary");
    const { NATIONALITIES } = await import("@/lib/data/nationalities");

    const slugify = (s: string) =>
      s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

    const urls = new Set<string>();

    [
      "", "/jobs", "/salary", "/salary/tools", "/blog", "/blog/rss.xml", "/deck", "/messroom",
      "/vessels", "/companies", "/signup", "/signup/crew", "/signup/company",
      "/about", "/contact", "/llms-full.txt",
    ].forEach((p) => urls.add(base + p));

    blogIndex.forEach((p) => urls.add(base + "/blog/" + p.slug));

    const allRanks = Object.values(SHIP_RANKS).flat() as string[];
    allRanks.forEach((r) => {
      urls.add(base + "/crew/" + slugify(r));
    });

    allRanks
      .filter((r) => SALARY_DATA.some((s) => norm(s.rank) === norm(r)))
      .forEach((r) => {
        VESSELS.forEach((v) => {
          urls.add(base + "/crew/" + slugify(r) + "/" + v.key);
        });
      });

    SALARY_DATA.forEach((r) => urls.add(base + "/salary/" + r.slug));
    NATIONALITIES.forEach((n) => urls.add(base + "/salary/for/" + n.slug));

    const urlList = Array.from(urls).slice(0, 500);

    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "shipcrewfinder.com",
        key: "scfindexnow2026key",
        keyLocation: "https://shipcrewfinder.com/scfindexnow2026key.txt",
        urlList,
      }),
    });

    console.log("[IndexNow] " + urlList.length + " URL bildirildi ✓");
  } catch (e) {
    console.log("[IndexNow] bildirim atlandı:", (e as Error).message);
  }
}
