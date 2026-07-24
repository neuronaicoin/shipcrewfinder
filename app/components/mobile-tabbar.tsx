"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const APP_AREAS = [
  "/dashboard",
  "/onboarding",
  "/profile",
  "/browse",
  "/candidate",
  "/jobs/mine",
  "/jobs/new",
  "/panel",
];

export default function MobileTabBar() {
  const pathname = usePathname() || "/";

  const inApp = APP_AREAS.some((p) => pathname.startsWith(p));

  const tabs = inApp
    ? [
        { href: "/dashboard", icon: "🏠", label: "Home" },
        { href: "/jobs", icon: "💼", label: "Jobs" },
        { href: "/salary", icon: "💰", label: "Salary" },
        { href: "/profile/me", icon: "👤", label: "Profile" },
      ]
    : [
        { href: "/signup/crew", icon: "⚓", label: "Join Crew" },
        { href: "/signup/company", icon: "🏢", label: "Hire" },
        { href: "/#try", icon: "🔍", label: "Find Crew" },
        { href: "/jobs", icon: "💼", label: "Jobs" },
      ];

  const isActive = (href: string) => {
    const clean = href.replace("/#try", "/");
    if (clean === "/") return pathname === "/";
    return pathname === clean || pathname.startsWith(clean + "/");
  };

  return (
    <>
      <style>{`
  .gtabs{position:fixed;bottom:0;left:0;right:0;z-index:80;display:none;
    background:rgba(7,10,32,.96);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
    border-top:1px solid rgba(255,255,255,.08);
    padding:6px 4px calc(6px + env(safe-area-inset-bottom))}
  body.light .gtabs{background:rgba(255,255,255,.95);border-top-color:rgba(15,25,60,.12)}
  .gtabs-in{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;max-width:520px;margin:0 auto}
  .gtab{display:flex;flex-direction:column;align-items:center;gap:3px;text-decoration:none;
    color:#6b83a0;font-size:10px;font-weight:700;letter-spacing:.02em;padding:7px 2px;border-radius:12px;transition:.15s;
    font-family:var(--font-jakarta),sans-serif}
  body.light .gtab{color:#57678a}
  .gtab .gi{font-size:19px;line-height:1}
  .gtab:active{background:rgba(255,255,255,.06)}
  .gtab.on{color:#fbbf24}
  body.light .gtab.on{color:#b8860b}
  @media(max-width:640px){
    .gtabs{display:block}
    body{padding-bottom:calc(64px + env(safe-area-inset-bottom))}
  }
  /* PWA standalone: iOS durum çubuğu header'a binmesin */
  @media(display-mode: standalone){
    header{padding-top:env(safe-area-inset-top)}
  }
`}</style>
      <div className="gtabs">
        <div className="gtabs-in">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={"gtab" + (isActive(t.href) ? " on" : "")}
            >
              <span className="gi">{t.icon}</span>
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
