"use client";

import { useEffect } from "react";
import SearchWizard from "./search-wizard";

export default function HomeContent() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --navy:#0a2540;--navy2:#0e2d4d;--navy3:#123a5f;--ink:#071a30;
    --gold:#fbbf24;--gold2:#e0a010;--line:rgba(251,191,36,.16);--line2:rgba(255,255,255,.08);
    --tx:#eef4fa;--tx2:#a8bdd2;--tx3:#6b83a0;
    --disp:var(--font-bricolage),sans-serif;--body:var(--font-jakarta),sans-serif;
    --grn:#34d399;
  }
  html{scroll-behavior:smooth}
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:1180px;margin:0 auto;padding:0 20px}

  /* ── topbar ── */
  .top{position:sticky;top:0;z-index:50;background:rgba(10,37,64,.85);backdrop-filter:blur(14px);
    border-bottom:1px solid var(--line2)}
  .top-in{display:flex;align-items:center;justify-content:space-between;height:66px}
  .logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--tx)}
  .logo-ic{width:38px;height:38px;border-radius:10px;background:linear-gradient(145deg,var(--gold),var(--gold2));
    display:grid;place-items:center;color:var(--ink);font-family:var(--disp);font-weight:800;font-size:19px}
  .logo b{font-family:var(--disp);font-size:18px;font-weight:700}
  .logo b span{color:var(--gold)}
  nav{display:flex;gap:26px}
  nav a{color:var(--tx2);text-decoration:none;font-size:14px;font-weight:500;transition:.15s}
  nav a:hover{color:var(--gold)}
  .top-cta{display:flex;gap:10px;align-items:center}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;
    font-family:var(--body);font-weight:700;font-size:14px;text-decoration:none;cursor:pointer;
    transition:.18s;border:none;padding:11px 20px}
  .btn-ghost{color:var(--tx);background:transparent;border:1px solid var(--line2)}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--ink);
    box-shadow:0 4px 20px rgba(251,191,36,.25)}
  .btn-gold:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(251,191,36,.4)}
  .btn-lg{padding:15px 28px;font-size:15.5px;border-radius:13px}
  @media(max-width:860px){ nav{display:none} .top-cta .btn-ghost{display:none} }

  /* ── hero ── */
  .hero{position:relative;padding:72px 0 60px;overflow:hidden}
  .hero::before{content:'';position:absolute;top:-30%;left:50%;transform:translateX(-50%);
    width:1200px;height:800px;background:radial-gradient(ellipse,rgba(251,191,36,.1),transparent 60%);pointer-events:none}
  .hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(251,191,36,.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(251,191,36,.04) 1px,transparent 1px);background-size:56px 56px;
    mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,#000,transparent);pointer-events:none}
  .hero-in{position:relative;display:grid;grid-template-columns:1.15fr .85fr;gap:48px;align-items:center}
  @media(max-width:960px){ .hero-in{grid-template-columns:1fr} .hero-vis{display:none} }
  .badge{display:inline-flex;align-items:center;gap:9px;background:rgba(251,191,36,.09);
    border:1px solid var(--line);border-radius:22px;padding:7px 16px;font-size:12.5px;font-weight:600;
    color:var(--gold);margin-bottom:22px}
  .badge .d{width:7px;height:7px;border-radius:50%;background:var(--grn);animation:pulse 1.6s infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
  h1{font-family:var(--disp);font-size:clamp(2.3rem,5.4vw,3.9rem);font-weight:800;line-height:1.06;
    letter-spacing:-.03em;margin-bottom:18px}
  h1 .g{color:var(--gold)}
  .hero p.sub{font-size:16.5px;color:var(--tx2);line-height:1.65;max-width:52ch;margin-bottom:30px}
  .paths{display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:560px}
  @media(max-width:560px){ .paths{grid-template-columns:1fr} }
  .path{display:block;background:linear-gradient(160deg,var(--navy2),var(--navy));border:1.5px solid var(--line2);
    border-radius:16px;padding:20px;text-decoration:none;color:var(--tx);transition:.2s;position:relative;overflow:hidden}
  .path::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold),transparent)}
  .path:hover{transform:translateY(-3px);border-color:var(--gold);box-shadow:0 14px 34px rgba(0,0,0,.35)}
  .path .pi{font-size:24px;margin-bottom:8px}
  .path b{display:block;font-family:var(--disp);font-size:17px;font-weight:700;margin-bottom:5px}
  .path span{font-size:12.5px;color:var(--tx3);line-height:1.5;display:block}
  .path .go{color:var(--gold);font-weight:700;font-size:13px;margin-top:10px;display:inline-block}
  .psteps{list-style:none;counter-reset:ps;margin:4px 0 2px;display:flex;flex-direction:column;gap:6px}
  .psteps li{counter-increment:ps;font-size:12.5px;color:var(--tx2);display:flex;gap:9px;align-items:center}
  .psteps li::before{content:counter(ps);width:19px;height:19px;border-radius:6px;flex-shrink:0;
    background:rgba(251,191,36,.14);color:var(--gold);font-weight:700;font-size:10.5px;display:grid;place-items:center}
  .psteps em{font-style:normal;color:var(--tx3);font-size:11px}
  .hero-note{margin-top:18px;font-size:12.5px;color:var(--tx3)}
  .hero-note b{color:var(--grn)}

  /* hero visual: profile mock */
  .hero-vis{position:relative}
  .pcard{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);
    border-radius:20px;padding:24px;box-shadow:0 30px 60px rgba(0,0,0,.45);position:relative;max-width:360px;margin-left:auto}
  .pcard::before{content:'';position:absolute;inset:0;border-radius:20px;pointer-events:none;
    background:radial-gradient(ellipse at 80% 0%,rgba(251,191,36,.12),transparent 55%)}
  .pc-top{display:flex;gap:14px;align-items:center;margin-bottom:16px}
  .avatar{width:58px;height:58px;border-radius:16px;background:linear-gradient(145deg,#2a4a70,#16324f);
    display:grid;place-items:center;font-family:var(--disp);font-weight:800;font-size:22px;color:var(--gold)}
  .pc-name{font-family:var(--disp);font-weight:700;font-size:17px}
  .pc-rank{font-size:12.5px;color:var(--tx3);margin-top:2px}
  .vbadge{display:inline-flex;align-items:center;gap:5px;background:rgba(52,211,153,.12);color:var(--grn);
    border:1px solid rgba(52,211,153,.3);border-radius:8px;padding:3px 9px;font-size:10.5px;font-weight:700;margin-top:6px}
  .pc-rows{display:flex;flex-direction:column;gap:9px;margin-bottom:16px}
  .pc-row{display:flex;justify-content:space-between;font-size:12.5px;padding:9px 12px;
    background:rgba(255,255,255,.03);border:1px solid var(--line2);border-radius:10px}
  .pc-row span{color:var(--tx3)}
  .pc-row b{font-weight:600}
  .pc-row b.av{color:var(--grn)}
  .pc-cta{width:100%;text-align:center;font-size:13px}
  .fcard{position:absolute;bottom:-22px;left:-14px;background:var(--navy2);border:1px solid var(--line);
    border-radius:14px;padding:13px 16px;box-shadow:0 18px 40px rgba(0,0,0,.4);font-size:12px;
    display:flex;gap:10px;align-items:center;animation:float 4s ease-in-out infinite}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .fcard .ic{width:32px;height:32px;border-radius:9px;background:rgba(251,191,36,.14);display:grid;place-items:center;font-size:15px}
  .fcard b{display:block;font-size:12.5px}
  .fcard span{color:var(--tx3);font-size:11px}

  /* ── rank marquee ── */
  .marq{border-top:1px solid var(--line2);border-bottom:1px solid var(--line2);padding:16px 0;overflow:hidden;
    background:rgba(7,26,48,.5)}
  .marq-in{display:flex;gap:38px;white-space:nowrap;animation:scroll 30s linear infinite;width:max-content}
  .marq-in span{font-family:var(--disp);font-weight:700;font-size:14.5px;color:var(--tx3);display:flex;align-items:center;gap:38px}
  .marq-in span::after{content:'·';color:var(--gold)}
  @keyframes scroll{to{transform:translateX(-50%)}}

  /* ── sections ── */
  section{padding:76px 0}
  .sec-tag{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
    color:var(--gold);margin-bottom:12px}
  h2{font-family:var(--disp);font-size:clamp(1.7rem,3.8vw,2.5rem);font-weight:800;letter-spacing:-.02em;
    line-height:1.12;margin-bottom:14px}
  .sec-sub{font-size:15px;color:var(--tx2);line-height:1.65;max-width:58ch;margin-bottom:40px}

  /* how it works */
  .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  @media(max-width:860px){ .steps{grid-template-columns:1fr} }
  .step{background:linear-gradient(160deg,var(--navy2),var(--navy));border:1px solid var(--line2);
    border-radius:18px;padding:26px;position:relative}
  .step .num{font-family:var(--disp);font-weight:800;font-size:15px;color:var(--ink);
    width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--gold),var(--gold2));
    display:grid;place-items:center;margin-bottom:16px}
  .step h3{font-family:var(--disp);font-size:18px;font-weight:700;margin-bottom:9px}
  .step p{font-size:13.5px;color:var(--tx2);line-height:1.6}

  /* crew section */
  .split{display:grid;grid-template-columns:1.05fr .95fr;gap:44px;align-items:start}
  @media(max-width:960px){ .split{grid-template-columns:1fr} }
  .feats{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-top:26px}
  @media(max-width:560px){ .feats{grid-template-columns:1fr} }
  .feat{background:rgba(255,255,255,.03);border:1px solid var(--line2);border-radius:14px;padding:17px}
  .feat .fi{font-size:20px;margin-bottom:8px}
  .feat b{display:block;font-size:14px;font-family:var(--disp);font-weight:700;margin-bottom:5px}
  .feat p{font-size:12.5px;color:var(--tx2);line-height:1.55}

  .price{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1.5px solid var(--line);
    border-radius:22px;padding:30px;position:relative;overflow:hidden}
  .price::before{content:'';position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(ellipse at 50% 0%,rgba(251,191,36,.12),transparent 55%)}
  .price .plabel{font-size:11.5px;font-weight:700;letter-spacing:.12em;color:var(--gold);margin-bottom:14px}
  .free-strip{display:inline-flex;align-items:center;gap:8px;background:rgba(52,211,153,.12);color:var(--grn);
    border:1px solid rgba(52,211,153,.3);border-radius:10px;padding:8px 14px;font-size:13px;font-weight:700;margin-bottom:14px}
  .pnum{font-family:var(--disp);font-weight:800;font-size:44px;letter-spacing:-.02em}
  .pnum small{font-size:16px;color:var(--tx3);font-weight:600}
  .pper{font-size:13px;color:var(--tx3);margin-bottom:6px}
  .pwhy{font-size:12.5px;color:var(--tx2);line-height:1.6;border-left:3px solid var(--gold);
    padding-left:12px;margin:16px 0 20px}
  .plist{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:22px}
  .plist li{font-size:13.5px;display:flex;gap:10px;align-items:flex-start}
  .plist li::before{content:'✓';color:var(--grn);font-weight:800;flex-shrink:0}
  .pfoot{font-size:11.5px;color:var(--tx3);text-align:center;margin-top:12px}

  /* companies */
  .searchbox{background:linear-gradient(160deg,var(--navy2),var(--ink));border:1.5px solid var(--line);
    border-radius:18px;padding:20px 22px;margin-bottom:26px;max-width:860px}
  .sb-head{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:14px;font-size:15px}
  .sb-head b{font-family:var(--disp)}
  .sb-head span{font-size:11.5px;color:var(--tx3)}
  .sb-row{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:10px}
  @media(max-width:820px){ .sb-row{grid-template-columns:1fr 1fr} }
  @media(max-width:540px){ .sb-row{grid-template-columns:1fr} }
  .sb-sel{background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:11px;
    padding:12px 13px;font-family:var(--body);font-size:13.5px;font-weight:500;outline:none;cursor:pointer}
  .sb-sel:focus{border-color:var(--gold)}
  .cplans{display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:860px}
  @media(max-width:820px){ .cplans{grid-template-columns:1fr} }
  .cplan{background:linear-gradient(165deg,var(--navy2),var(--navy));border:1px solid var(--line2);
    border-radius:20px;padding:28px;position:relative}
  .cplan.hot{border:1.5px solid var(--gold);box-shadow:0 20px 50px rgba(0,0,0,.35)}
  .hot-tag{position:absolute;top:-12px;left:24px;background:linear-gradient(135deg,var(--gold),var(--gold2));
    color:var(--ink);font-size:10.5px;font-weight:800;letter-spacing:.08em;border-radius:7px;padding:4px 11px}
  .cplan h3{font-family:var(--disp);font-size:20px;font-weight:800;margin-bottom:4px}
  .cplan .cfor{font-size:12.5px;color:var(--tx3);margin-bottom:16px}

  /* why */
  .why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  @media(max-width:860px){ .why-grid{grid-template-columns:1fr 1fr} }
  @media(max-width:560px){ .why-grid{grid-template-columns:1fr} }
  .founder{margin-top:34px;background:rgba(251,191,36,.06);border:1px solid var(--line);border-radius:16px;
    padding:22px 26px;display:flex;gap:16px;align-items:center;flex-wrap:wrap}
  .founder .fi{font-size:28px}
  .founder b{font-family:var(--disp);font-size:15.5px;display:block;margin-bottom:4px}
  .founder p{font-size:13px;color:var(--tx2);line-height:1.6;max-width:64ch}

  /* FAQ */
  .faq{max-width:760px}
  details{background:rgba(255,255,255,.03);border:1px solid var(--line2);border-radius:14px;
    margin-bottom:11px;overflow:hidden}
  summary{cursor:pointer;padding:17px 20px;font-weight:700;font-size:14.5px;list-style:none;
    display:flex;justify-content:space-between;align-items:center;gap:14px}
  summary::-webkit-details-marker{display:none}
  summary::after{content:'+';font-family:var(--disp);color:var(--gold);font-size:20px;font-weight:700;transition:.2s}
  details[open] summary::after{transform:rotate(45deg)}
  details p{padding:0 20px 17px;font-size:13.5px;color:var(--tx2);line-height:1.65}

  /* final CTA */
  .final{background:linear-gradient(160deg,var(--navy3),var(--navy));border-top:1px solid var(--line2);
    text-align:center;padding:84px 0}
  .final h2{margin-bottom:12px}
  .final .sec-sub{margin:0 auto 32px}
  .cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
  .final .note{margin-top:18px;font-size:12.5px;color:var(--tx3)}

  /* footer */
  footer{border-top:1px solid var(--line2);padding:52px 0 90px;background:var(--ink)}
  .foot-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:30px}
  @media(max-width:820px){ .foot-grid{grid-template-columns:1fr 1fr} }
  .foot-brand p{font-size:13px;color:var(--tx3);line-height:1.6;margin-top:12px;max-width:32ch}
  footer h4{font-family:var(--disp);font-size:13.5px;font-weight:700;margin-bottom:14px}
  footer ul{list-style:none;display:flex;flex-direction:column;gap:9px}
  footer ul a{color:var(--tx3);text-decoration:none;font-size:13px}
  footer ul a:hover{color:var(--gold)}
  .foot-btm{margin-top:38px;padding-top:20px;border-top:1px solid var(--line2);font-size:12px;color:var(--tx3);
    display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}

  /* mobile sticky CTA */
  .mbar{position:fixed;bottom:0;left:0;right:0;z-index:60;display:none;gap:10px;padding:12px 14px;
    background:rgba(7,26,48,.94);backdrop-filter:blur(12px);border-top:1px solid var(--line2)}
  .mbar .btn{flex:1;padding:13px 8px;font-size:13.5px}
  @media(max-width:640px){ .mbar{display:flex} footer{padding-bottom:120px} }

  /* reveal */
  .rv{opacity:0;transform:translateY(22px);transition:opacity .6s ease,transform .6s ease}
  .rv.in{opacity:1;transform:none}
`}</style>
<header className="top">
  <div className="wrap top-in">
    <a className="logo" href="/"><span className="logo-ic">⚓</span><b>Ship<span>Crew</span>Finder</b></a>
    <nav>
      <a href="#crew">For Crew</a>
      <a href="#companies">For Companies</a>
      <a href="#how">How it works</a>
      <a href="#faq">FAQ</a>
      <a href="/blog">Blog</a>
    </nav>
    <div className="top-cta">
      <a className="btn btn-ghost" href="/login">Login</a>
      <a className="btn btn-gold" href="/signup">Sign Up Free</a>
    </div>
  </div>
</header>

<section className="hero">
  <div className="hero-grid"></div>
  <div className="wrap hero-in">
    <div>
      <div className="badge"><span className="d"></span>VERIFIED MARITIME PLATFORM · FOUNDING MEMBERS OPEN</div>
      <h1>Your next contract.<br/><span className="g">No agency. No cut.</span></h1>
      <p className="sub">ShipCrewFinder connects verified seafarers with shipping companies — directly. No middlemen taking a slice of your salary. No agencies filtering your messages.</p>
      <div className="paths">
        <a className="path" href="/signup/crew">
          <div className="pi">⚓</div>
          <b>I'm Crew — get found</b>
          <ol className="psteps">
            <li>Create profile <em>(2 min)</em></li>
            <li>Upload CV {"&"} certificates</li>
            <li>Companies contact you</li>
          </ol>
          <span className="go">Start free month →</span>
        </a>
        <a className="path" href="/signup/company">
          <div className="pi">🏢</div>
          <b>I'm Hiring — find crew</b>
          <ol className="psteps">
            <li>Create company account</li>
            <li>Search by rank {"&"} availability</li>
            <li>Message crew directly</li>
          </ol>
          <span className="go">Start free month →</span>
        </a>
      </div>
      <div className="hero-note"><b>✓</b> Cancel anytime  ·  <b>✓</b> 0% commission — ever  ·  <b>✓</b> Verified profiles only</div>
    </div>
    <div className="hero-vis">
      <div className="pcard">
        <div className="pc-top">
          <div className="avatar">ME</div>
          <div>
            <div className="pc-name">Chief Engineer</div>
            <div className="pc-rank">Unlimited · Motor · 12 yrs at sea</div>
            <div className="vbadge">✓ VERIFIED PROFILE</div>
          </div>
        </div>
        <div className="pc-rows">
          <div className="pc-row"><span>Availability</span><b className="av">● Available from Sep 2026</b></div>
          <div className="pc-row"><span>Certificates</span><b>STCW III/2 · COC ✓</b></div>
          <div className="pc-row"><span>Vessel experience</span><b>Bulk · Tanker · Container</b></div>
          <div className="pc-row"><span>Last contract</span><b>C/E — 82,000 DWT Bulk</b></div>
        </div>
        <a className="btn btn-gold pc-cta" href="/signup/company">Contact directly →</a>
      </div>
      <div className="fcard">
        <div className="ic">👁</div>
        <div><b>3 companies viewed your profile</b><span>this week · via Profile Analytics</span></div>
      </div>
    </div>
  </div>
</section>

<div className="marq">
  <div className="marq-in">
    <span>MASTER</span><span>CHIEF ENGINEER</span><span>CHIEF OFFICER</span><span>2ND ENGINEER</span><span>2ND OFFICER</span><span>3RD ENGINEER</span><span>ETO</span><span>BOSUN</span><span>AB</span><span>OS</span><span>OILER</span><span>FITTER</span><span>COOK</span><span>MESSMAN</span><span>PUMPMAN</span><span>ELECTRICIAN</span>
    <span>MASTER</span><span>CHIEF ENGINEER</span><span>CHIEF OFFICER</span><span>2ND ENGINEER</span><span>2ND OFFICER</span><span>3RD ENGINEER</span><span>ETO</span><span>BOSUN</span><span>AB</span><span>OS</span><span>OILER</span><span>FITTER</span><span>COOK</span><span>MESSMAN</span><span>PUMPMAN</span><span>ELECTRICIAN</span>
  </div>
</div>

<section id="search" style={{paddingBottom:"20px"}}>
  <div className="wrap">
    <div style={{maxWidth:"640px",margin:"0 auto"}}>
      <SearchWizard />
    </div>
  </div>
</section>

<section id="how" style={{paddingTop:"40px"}}>
  <div className="wrap">
    <div className="sec-tag rv">How it works</div>
    <h2 className="rv">Three steps to your next opportunity</h2>
    <p className="sec-sub rv">From signup to contract — simple, transparent, and fully in your control.</p>
    <div className="steps">
      <div className="step rv">
        <div className="num">01</div>
        <h3>Sign up free</h3>
        <p>Create your account in 60 seconds. Crew and companies both start with a full free month — no credit card needed to look around.</p>
      </div>
      <div className="step rv">
        <div className="num">02</div>
        <h3>Get verified</h3>
        <p>Upload your CV and certificates (STCW, COC, medical). Our team reviews every profile before activation — no fake profiles, no noise.</p>
      </div>
      <div className="step rv">
        <div className="num">03</div>
        <h3>Connect directly</h3>
        <p>Companies message crew directly. Crew reply directly. No agency in the middle, no commission taken from your salary — ever.</p>
      </div>
    </div>
  </div>
</section>

<section id="crew" style={{background:"rgba(7,26,48,.45)"}}>
  <div className="wrap split">
    <div>
      <div className="sec-tag rv">For Crew</div>
      <h2 className="rv">Take control of your maritime career</h2>
      <p className="sec-sub rv">Master, Chief Engineer, ETO, AB or Cook — build a profile that gets found by the right companies, on your terms.</p>
      <div className="feats">
        <div className="feat rv"><div className="fi">🛡️</div><b>Verified badge</b><p>Certificates reviewed by our team. Stand out instantly from unverified noise.</p></div>
        <div className="feat rv"><div className="fi">🥷</div><b>Stealth Mode</b><p>Hide your profile from your current employer. Search without risk.</p></div>
        <div className="feat rv"><div className="fi">📊</div><b>Profile Analytics</b><p>See which companies viewed your profile — and when.</p></div>
        <div className="feat rv"><div className="fi">💬</div><b>Direct messaging</b><p>Talk to employers directly. Negotiate your own contract.</p></div>
      </div>
    </div>
    <div className="price rv">
      <div className="plabel">CREW MEMBERSHIP</div>
      <div className="free-strip">🎁 FIRST MONTH COMPLETELY FREE</div>
      <div className="pnum">$2.99 <small>/ 3 months</small></div>
      <div className="pper">after your free month · that's less than a coffee — for a quarter</div>
      <div className="pwhy">Why not fully free? The symbolic fee keeps bots, fake profiles and time-wasters out — so companies take every profile here seriously. Your visibility is worth more on a clean platform.</div>
      <ul className="plist">
        <li>Verified profile badge</li>
        <li>Stealth mode — invisible to your employer</li>
        <li>Profile analytics {"&"} view insights</li>
        <li>Direct messaging with companies</li>
        <li>Priority placement in search results</li>
        <li>Block specific companies</li>
      </ul>
      <a className="btn btn-gold btn-lg" href="/signup/crew" style={{width:"100%"}}>Start free month →</a>
      <div className="pfoot">Cancel anytime during the free month — pay nothing.</div>
    </div>
  </div>
</section>

<section id="companies">
  <div className="wrap">
    <div className="sec-tag rv">For Companies</div>
    <h2 className="rv">Hire verified crew — without agency fees</h2>
    <p className="sec-sub rv">Every profile is document-checked before it goes live. Try the full platform free for a month, see the crew pool for yourself — then decide.</p>
    <div className="cplans">
      <div className="cplan hot rv">
        <div className="hot-tag">MOST POPULAR</div>
        <h3>Pro</h3>
        <div className="cfor">For active fleets {"&"} crewing departments</div>
        <div className="free-strip">🎁 FIRST MONTH FREE</div>
        <div className="pnum">$299.90 <small>/ month</small></div>
        <div className="pper">after your free month · cancel anytime</div>
        <ul className="plist">
          <li><b style={{color:"var(--gold)"}}>100 full CV views / month</b></li>
          <li>Post up to 10 job listings</li>
          <li>Advanced search — rank, vessel type, availability</li>
          <li>Direct messaging with crew</li>
          <li>Save {"&"} shortlist candidates</li>
          <li>Verified company badge</li>
        </ul>
        <a className="btn btn-gold" href="/signup/company?plan=pro" style={{width:"100%"}}>Start free month →</a>
      </div>
      <div className="cplan rv">
        <h3>Fleet</h3>
        <div className="cfor">For large fleets, managers {"&"} crewing agencies</div>
        <div className="free-strip">🎁 FIRST MONTH FREE</div>
        <div className="pnum">$499.90 <small>/ month</small></div>
        <div className="pper">after your free month · cancel anytime</div>
        <ul className="plist">
          <li>Everything in Pro</li>
          <li><b style={{color:"var(--gold)"}}>Unlimited full CV views</b></li>
          <li>Unlimited job listings</li>
          <li>Multiple user seats for your team</li>
          <li>Bulk shortlist {"&"} export</li>
          <li>Priority support {"&"} onboarding</li>
          <li>API / ATS integration</li>
        </ul>
        <a className="btn btn-ghost" href="/signup/company?plan=fleet" style={{width:"100%",borderColor:"var(--gold)",color:"var(--gold)"}}>Start free month →</a>
      </div>
    </div>
  </div>
</section>

<section style={{background:"rgba(7,26,48,.45)"}}>
  <div className="wrap">
    <div className="sec-tag rv">Why ShipCrewFinder</div>
    <h2 className="rv">Built by maritime professionals,<br/>for maritime professionals</h2>
    <p className="sec-sub rv">We've stood watches, signed articles and lived the contract cycle. Every feature exists because we needed it ourselves.</p>
    <div className="why-grid">
      <div className="feat rv"><div className="fi">✅</div><b>Verified profiles only</b><p>CV, STCW, COC, medical — reviewed before any profile goes live.</p></div>
      <div className="feat rv"><div className="fi">🚫</div><b>0% commission, ever</b><p>No agency cut from your salary. No hidden placement fees for companies.</p></div>
      <div className="feat rv"><div className="fi">🥷</div><b>Privacy first</b><p>Stealth mode, company blocking, full control over who sees you.</p></div>
      <div className="feat rv"><div className="fi">🌍</div><b>Global by design</b><p>From Singapore to Rotterdam, Houston to Piraeus — one platform.</p></div>
      <div className="feat rv"><div className="fi">💬</div><b>Direct contact</b><p>No third party filtering messages or delaying your next contract.</p></div>
      <div className="feat rv"><div className="fi">📅</div><b>Real availability</b><p>Current availability dates on every profile. No dead profiles, no wasted outreach.</p></div>
    </div>
    <div className="founder rv">
      <div className="fi">⚓</div>
      <div>
        <b>A note from the founder</b>
        <p>I've spent over a decade in engine rooms across bulk carriers and tankers. I watched agencies take their cut from every contract while adding delay, noise and zero transparency. ShipCrewFinder is the platform I wished existed — direct, verified, and honest.</p>
      </div>
    </div>
  </div>
</section>

<section id="faq">
  <div className="wrap">
    <div className="sec-tag rv">FAQ</div>
    <h2 className="rv">Questions, answered straight</h2>
    <p className="sec-sub rv">No fine print surprises. Here's how it actually works.</p>
    <div className="faq">
      <details className="rv"><summary>Is the first month really free?</summary><p>Yes — both crew and companies get a full month with all features unlocked, no charge. Cancel any time during the free month and you pay nothing at all.</p></details>
      <details className="rv"><summary>Why does crew membership cost $2.99 when other job boards are free?</summary><p>Free platforms fill up with bots, duplicate accounts and abandoned profiles — and companies stop trusting them. A symbolic $2.99 per 3 months keeps the pool clean and serious, which means the companies contacting you are serious too. It's less than one coffee, once a quarter.</p></details>
      <details className="rv"><summary>How does profile verification work?</summary><p>After you upload your CV and certificates (STCW, COC, medical), our team manually reviews the documents before your profile goes live. Verified profiles carry a visible badge that companies can trust.</p></details>
      <details className="rv"><summary>Can my current employer see that I'm looking?</summary><p>Not if you don't want them to. Stealth Mode hides your profile from specific companies you choose — including your current employer. You stay invisible to them while staying visible to everyone else.</p></details>
      <details className="rv"><summary>Do you take any commission from my salary or the placement?</summary><p>Never. Zero commission, from either side, ever. Companies pay a flat subscription; crew pay a symbolic membership. Your salary is between you and your employer — as it should be.</p></details>
      <details className="rv"><summary>How do companies contact crew?</summary><p>Directly, through the platform's messaging. No agency relaying messages, no delays, no filtering. You negotiate your own contract, face to face.</p></details>
      <details className="rv"><summary>Can I cancel anytime?</summary><p>Yes — one click, no questions, no retention calls. If you cancel during a free month you pay nothing; if you cancel later, your access simply runs to the end of the paid period.</p></details>
    </div>
  </div>
</section>

<section className="final">
  <div className="wrap">
    <h2 className="rv">Ready for a contract<br/><span style={{color:"var(--gold)"}}>without the middleman?</span></h2>
    <p className="sec-sub rv">Join the founding members building the cleanest crew platform at sea.</p>
    <div className="cta-row rv">
      <a className="btn btn-gold btn-lg" href="/signup/crew">⚓ Join as Crew — free month</a>
      <a className="btn btn-ghost btn-lg" href="/signup/company">🏢 Hire Crew — free month</a>
    </div>
    <div className="note">Cancel anytime · 0% commission, ever · Verified profiles only</div>
  </div>
</section>

<footer>
  <div className="wrap">
    <div className="foot-grid">
      <div className="foot-brand">
        <a className="logo" href="/"><span className="logo-ic">⚓</span><b>Ship<span>Crew</span>Finder</b></a>
        <p>The verified maritime career platform. Direct contact. Zero commission. Built at sea.</p>
      </div>
      <div>
        <h4>Product</h4>
        <ul>
          <li><a href="/signup/crew">For Crew</a></li>
          <li><a href="/signup/company">For Companies</a></li>
          <li><a href="#companies">Pricing</a></li>
          <li><a href="#how">How it works</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="/about">About</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4>Legal</h4>
        <ul>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
          <li><a href="/cookies">Cookie Policy</a></li>
          <li><a href="/gdpr">GDPR</a></li>
        </ul>
      </div>
    </div>
    <div className="foot-btm">
      <span>© 2026 ShipCrewFinder. All rights reserved.</span>
      <span>Made by maritime professionals ⚓</span>
    </div>
  </div>
</footer>

<div className="mbar">
  <a className="btn btn-gold" href="/signup/crew">⚓ Join as Crew</a>
  <a className="btn btn-ghost" href="/signup/company">🏢 Hire Crew</a>
</div>
    </>
  );
}
