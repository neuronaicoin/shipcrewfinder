"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  isLoggedIn: boolean;
  userType?: "seafarer" | "yacht" | "company" | null;
  unreadCount?: number;
  active?: "jobs" | "salary" | "browse" | "dashboard" | "blog" | null;
};

const anchorSvg = (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#0b0e13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2.4" />
    <line x1="12" y1="7.4" x2="12" y2="20.5" />
    <line x1="7.5" y1="10.4" x2="16.5" y2="10.4" />
    <path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7" />
    <path d="M4.5 14.8l-1.6-1.2M4.5 14.8l2-.4" />
    <path d="M19.5 14.8l1.6-1.2M19.5 14.8l-2-.4" />
  </svg>
);

export default function SiteHeader({
  isLoggedIn,
  userType = null,
  unreadCount = 0,
  active = null,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    let saved: "dark" | "light" = "dark";
    try {
      saved = (localStorage.getItem("scf_theme") as "dark" | "light") || "dark";
    } catch {}
    setTheme(saved);
    document.body.classList.toggle("light", saved === "light");
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      localStorage.setItem("scf_theme", next);
    } catch {}
    document.body.classList.toggle("light", next === "light");
  }

  const isCompany = userType === "company";

  const navLinks = [
    { href: "/jobs", label: "Jobs", key: "jobs" },
    { href: "/salary", label: "Salary Index", key: "salary" },
    ...(isCompany ? [{ href: "/browse", label: "Search Crew", key: "browse" }] : []),
    { href: "/blog", label: "Blog", key: "blog" },
  ];

  return (
    <>
      <style>{`
  .scf-top{position:sticky;top:0;z-index:50;background:rgba(10,37,64,.85);backdrop-filter:blur(14px);border-bottom:1px solid var(--line2,rgba(255,255,255,.08))}
  body.light .scf-top{background:rgba(255,255,255,.88)}
  .scf-top-in{max-width:1180px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:66px;gap:10px}
  .scf-logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--tx,#eef4fa)}
  .scf-logo-ic{width:38px;height:38px;border-radius:10px;background:linear-gradient(145deg,#fbbf24,#e0a010);display:grid;place-items:center;flex-shrink:0}
  .scf-logo b{font-family:var(--disp,var(--font-bricolage),sans-serif);font-size:18px;font-weight:700;white-space:nowrap}
  .scf-logo b span{color:#fbbf24}
  .scf-nav{display:flex;gap:8px}
  .scf-nav a{color:var(--tx2,#a8bdd2);text-decoration:none;font-size:13.5px;font-weight:600;transition:.18s;border:1px solid var(--line2,rgba(255,255,255,.08));border-radius:10px;padding:8px 15px;background:rgba(255,255,255,.02)}
  body.light .scf-nav a{background:rgba(255,255,255,.6)}
  .scf-nav a:hover,.scf-nav a.on{color:#fbbf24;border-color:#fbbf24;background:rgba(251,191,36,.07)}
  .scf-cta{display:flex;gap:9px;align-items:center}
  .scf-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:10px 17px;font-family:inherit;white-space:nowrap}
  .scf-btn-ghost{color:var(--tx,#eef4fa);background:transparent;border:1px solid var(--line2,rgba(255,255,255,.08))}
  .scf-btn-ghost:hover{border-color:#fbbf24;color:#fbbf24}
  .scf-btn-gold{background:linear-gradient(135deg,#fbbf24,#e0a010);color:#0b0e13;box-shadow:0 4px 20px rgba(251,191,36,.25)}
  .scf-btn-gold:hover{transform:translateY(-2px)}
  .scf-bell{position:relative;display:inline-flex}
  .scf-bell .dot{position:absolute;top:-4px;right:-4px;min-width:17px;height:17px;border-radius:99px;background:#ef4444;color:#fff;font-size:10px;font-weight:800;display:grid;place-items:center;padding:0 4px}
  .scf-ham{display:none;place-items:center;width:42px;height:42px;border:1px solid var(--line2,rgba(255,255,255,.08));border-radius:10px;background:rgba(255,255,255,.03);cursor:pointer;color:var(--tx,#eef4fa);font-size:19px}
  .scf-mnav{display:none;flex-direction:column;gap:8px;padding:12px 20px 16px;border-top:1px solid var(--line2,rgba(255,255,255,.08));background:rgba(7,26,48,.97)}
  body.light .scf-mnav{background:rgba(255,255,255,.97)}
  .scf-mnav.open{display:flex}
  .scf-mnav a{color:var(--tx2,#a8bdd2);text-decoration:none;font-size:14.5px;font-weight:600;border:1px solid var(--line2,rgba(255,255,255,.08));border-radius:10px;padding:12px 16px;background:rgba(255,255,255,.02)}
  .scf-mnav a:active{color:#fbbf24;border-color:#fbbf24}
  @media(max-width:900px){
    .scf-nav{display:none}
    .scf-cta .scf-btn-ghost.hide-m{display:none}
    .scf-ham{display:grid}
  }
`}</style>

      <header className="scf-top">
        <div className="scf-top-in">
          <Link className="scf-logo" href="/">
            <span className="scf-logo-ic">{anchorSvg}</span>
            <b>Ship<span>Crew</span>Finder</b>
          </Link>

          <nav className="scf-nav">
            {navLinks.map((l) => (
              <Link key={l.key} href={l.href} className={active === l.key ? "on" : ""}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="scf-cta">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="scf-btn scf-btn-ghost scf-bell" aria-label="Notifications">
                  🔔
                  {unreadCount > 0 && <span className="dot">{unreadCount > 99 ? "99+" : unreadCount}</span>}
                </Link>
                <Link href="/dashboard" className="scf-btn scf-btn-gold">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="scf-btn scf-btn-ghost hide-m">Login</Link>
                <Link href="/signup" className="scf-btn scf-btn-gold">Sign Up Free</Link>
              </>
            )}
            <button
              className="scf-btn scf-btn-ghost"
              onClick={toggleTheme}
              aria-label="Theme"
              style={{ padding: "9px 12px", fontSize: 15, lineHeight: 1 }}
            >
              {theme === "light" ? "☀️" : "🌙"}
            </button>
            <button className="scf-ham" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              ☰
            </button>
          </div>
        </div>

        <div className={`scf-mnav ${menuOpen ? "open" : ""}`}>
          {navLinks.map((l) => (
            <Link key={l.key} href={l.href} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
              Dashboard {unreadCount > 0 ? `(${unreadCount})` : ""}
            </Link>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      </header>
    </>
  );
}
