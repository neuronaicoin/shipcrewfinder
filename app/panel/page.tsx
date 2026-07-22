// @ts-nocheck
"use client";

import { useEffect, useState } from "react";

const DAYS30 = 30 * 24 * 60 * 60 * 1000;
const G = "#fbbf24", NV = "#0d1030", NV2 = "#141845";

export default function AdminPanel() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState("");
  const [urls, setUrls] = useState("");
  const [pingMsg, setPingMsg] = useState("");

  const fetchStats = async (k) => {
    setErr("");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/admin_stats`,
      {
        method: "POST",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ admin_key: k }),
      }
    );
    if (!res.ok) { setErr("Şifre yanlış ya da bağlantı hatası."); return false; }
    setStats(await res.json());
    return true;
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("scf_admin") || "null");
      if (saved && Date.now() - saved.ts < DAYS30) {
        setAuthed(true);
        fetchStats(saved.key);
        setKey(saved.key);
      }
    } catch (e) {}
  }, []);

  const login = async () => {
    if (await fetchStats(key)) {
      localStorage.setItem("scf_admin", JSON.stringify({ key, ts: Date.now() }));
      setAuthed(true);
    }
  };

  const pingIndexNow = async () => {
    const list = urls.split("\n").map((u) => u.trim()).filter(Boolean);
    if (!list.length) { setPingMsg("URL gir."); return; }
    try {
      await fetch("https://api.indexnow.org/indexnow", {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: "shipcrewfinder.com",
          key: "scfindexnow2026key",
          keyLocation: "https://shipcrewfinder.com/scfindexnow2026key.txt",
          urlList: list,
        }),
      });
      setPingMsg(`✓ ${list.length} URL bildirildi (Bing/Yandex + IndexNow ortakları).`);
    } catch (e) { setPingMsg("Gönderilemedi: " + e.message); }
  };

  const card = { background: NV2, border: "1px solid rgba(251,191,36,.18)", borderRadius: 16, padding: 20 };
  const h = { color: G, fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 };
  const big = { fontSize: 36, fontWeight: 800, color: "#fff" };

  if (!authed) return (
    <main style={{ minHeight: "100vh", background: NV, display: "grid", placeItems: "center", fontFamily: "system-ui" }}>
      <div style={{ ...card, width: 320 }}>
        <div style={h}>⚓ SCF Admin</div>
        <input type="password" value={key} onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()} placeholder="Admin şifresi"
          style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #2a3670", background: NV, color: "#fff", marginBottom: 10 }} />
        <button onClick={login} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: G, fontWeight: 800, cursor: "pointer" }}>Giriş</button>
        {err && <div style={{ color: "#f87171", fontSize: 13, marginTop: 10 }}>{err}</div>}
      </div>
    </main>
  );

  const s = stats;
  const maxDay = s ? Math.max(1, ...s.signups_30d.map((d) => d.crew + d.company)) : 1;
  const last7 = s ? s.signups_30d.slice(-7) : [];
  const sum = (arr, f) => arr.reduce((a, x) => a + (x[f] || 0), 0);

  return (
    <main style={{ minHeight: "100vh", background: NV, padding: 24, fontFamily: "system-ui", color: "#dfe6f5" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h1 style={{ color: "#fff", fontSize: 22 }}>⚓ ShipCrewFinder — Admin</h1>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="https://analytics.google.com" target="_blank" style={{ color: G, fontSize: 13 }}>📈 Google Analytics</a>
            <a href="https://search.google.com/search-console" target="_blank" style={{ color: G, fontSize: 13 }}>🔍 Search Console</a>
            <button onClick={() => { localStorage.removeItem("scf_admin"); location.reload(); }}
              style={{ background: "none", border: "1px solid #2a3670", color: "#8fa0c8", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>Çıkış</button>
          </div>
        </div>

        {!s ? <div>Yükleniyor…</div> : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 14 }}>
              <div style={card}><div style={h}>Toplam Crew</div><div style={big}>{s.total_crew}</div></div>
              <div style={card}><div style={h}>Toplam Şirket</div><div style={big}>{s.total_company}</div></div>
              <div style={card}><div style={h}>Son 7 gün üye</div><div style={big}>{sum(last7, "crew") + sum(last7, "company")}</div>
                <div style={{ fontSize: 12, color: "#8fa0c8" }}>{sum(last7, "crew")} crew · {sum(last7, "company")} şirket</div></div>
              <div style={card}><div style={h}>Son 30 gün üye</div><div style={big}>{sum(s.signups_30d, "crew") + sum(s.signups_30d, "company")}</div>
                <div style={{ fontSize: 12, color: "#8fa0c8" }}>{sum(s.signups_30d, "crew")} crew · {sum(s.signups_30d, "company")} şirket</div></div>
              <div style={card}><div style={h}>Açık ilan</div><div style={big}>{s.jobs_active}</div></div>
              <div style={card}><div style={h}>Toplam başvuru</div><div style={big}>{s.applications}</div></div>
            </div>

            <div style={{ ...card, marginBottom: 14 }}>
              <div style={h}>Günlük yeni üye — son 30 gün (altın: crew · mavi: şirket)</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 120 }}>
                {s.signups_30d.map((d) => (
                  <div key={d.d} title={`${d.d}: ${d.crew} crew, ${d.company} şirket`}
                    style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
                    <div style={{ background: "#4f6ef7", height: `${(d.company / maxDay) * 100}%` }} />
                    <div style={{ background: G, height: `${(d.crew / maxDay) * 100}%` }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div style={card}>
                <div style={h}>Crew ülke dağılımı (top 10)</div>
                {s.crew_countries.map((c) => (
                  <div key={c.c} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,.06)", fontSize: 14 }}>
                    <span>{c.c}</span><b style={{ color: G }}>{c.n}</b>
                  </div>
                ))}
              </div>
              <div style={card}>
                <div style={h}>Bu ay CV kredisi kullanımı</div>
                {s.views_month.length === 0 && <div style={{ fontSize: 13, color: "#8fa0c8" }}>Bu ay henüz görüntüleme yok.</div>}
                {s.views_month.map((v) => (
                  <div key={v.company} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,.06)", fontSize: 14 }}>
                    <span>{v.company}</span><b style={{ color: G }}>{v.n}/100</b>
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={h}>🔔 Arama motorlarına bildir (IndexNow — Bing/Yandex+)</div>
              <textarea value={urls} onChange={(e) => setUrls(e.target.value)} rows={3}
                placeholder={"https://shipcrewfinder.com/blog/yeni-yazi\n(her satıra bir URL)"}
                style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #2a3670", background: NV, color: "#fff", fontSize: 13 }} />
              <button onClick={pingIndexNow} style={{ marginTop: 8, padding: "10px 18px", borderRadius: 10, border: "none", background: G, fontWeight: 800, cursor: "pointer" }}>Bildir</button>
              {pingMsg && <div style={{ fontSize: 13, marginTop: 8, color: "#34d399" }}>{pingMsg}</div>}
              <div style={{ fontSize: 12, color: "#8fa0c8", marginTop: 8 }}>Google ping'i 2023'te kapattı — Google için: Search Console → URL inspection → Request indexing. Sitemap'in zaten otomatik taranıyor.</div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
