// @ts-nocheck
"use client";

import { useEffect } from "react";
import SearchWizard from "./search-wizard";
import LiveRosterFeed from "./LiveRosterFeed";

export default function HomeContent({ deckSlot }: { deckSlot?: React.ReactNode }) {
  useEffect(() => {
const __T=[];
const _si=window.setInterval.bind(window), _st=window.setTimeout.bind(window);
const setInterval=(f,t)=>{const h=_si(f,t);__T.push({t:'i',h});return h;};
const setTimeout=(f,t)=>{const h=_st(f,t);__T.push({t:'t',h});return h;};

const ham=document.getElementById('ham'), mnav=document.getElementById('mnav');
if(ham){ ham.onclick=()=>mnav.classList.toggle('open');
  mnav.querySelectorAll('a').forEach(a=>a.onclick=()=>mnav.classList.remove('open')); }

const PROFILES=[
  {i:'CE',r:'Chief Engineer',l:'Unlimited · Motor · 12 yrs at sea',a:'● Available from Sep 2026',c:'STCW III/2 · COC ✓',v:'Bulk · Tanker · Container',x:'C/E — 82,000 DWT Bulk'},
  {i:'MK',r:'Master',l:'Unlimited · 15 yrs at sea',a:'● Available from Aug 2026',c:'STCW II/2 · COC ✓',v:'Bulk · General Cargo',x:'Master — 58,000 DWT Bulk'},
  {i:'CO',r:'Chief Officer',l:'Unlimited · 9 yrs at sea',a:'● Available now',c:'STCW II/2 · GMDSS ✓',v:'Container · Ro-Ro',x:'C/O — 6,800 TEU Container'},
  {i:'2E',r:'2nd Engineer',l:'Motor · 7 yrs at sea',a:'● Available from Oct 2026',c:'STCW III/2 ✓',v:'Tanker · LPG',x:'2/E — 49,900 DWT Tanker'},
  {i:'ET',r:'ETO',l:'High voltage · 6 yrs at sea',a:'● Available now',c:'STCW III/6 · HV ✓',v:'Container · LNG',x:'ETO — 14,000 TEU Container'}
];
const VIEWS=[
  {n:'3 companies viewed this profile',s:'this week · via Profile Analytics'},
  {n:'5 companies viewed this profile',s:'this week · via Profile Analytics'},
  {n:'2 new messages from companies',s:'this week · direct contact'},
  {n:'4 companies viewed this profile',s:'this week · via Profile Analytics'},
  {n:'Shortlisted by 2 companies',s:'this week · via Profile Analytics'}
];
let pIdx=0;
const pdots=document.getElementById('pdots');
if(pdots){
  PROFILES.forEach((_,k)=>{const d=document.createElement('span');if(k===0)d.className='on';pdots.appendChild(d);});
  const rotateCard=()=>{
    const f=document.getElementById('pc-fade');
    f.classList.add('out');
    setTimeout(()=>{
      pIdx=(pIdx+1)%PROFILES.length;
      const p=PROFILES[pIdx];
      const w=VIEWS[pIdx];
      document.getElementById('pc-init').textContent=p.i;
      document.getElementById('pc-rankname').textContent=p.r;
      document.getElementById('pc-line').textContent=p.l;
      document.getElementById('pc-avail').textContent=p.a;
      document.getElementById('pc-cert').textContent=p.c;
      document.getElementById('pc-ves').textContent=p.v;
      document.getElementById('pc-last').textContent=p.x;
      const vn=document.getElementById('fc-n'), vs=document.getElementById('fc-s');
      if(vn){vn.textContent=w.n; vs.textContent=w.s;}
      [...pdots.children].forEach((d,k)=>d.classList.toggle('on',k===pIdx));
      f.classList.remove('out');
    },320);
  };
  setTimeout(()=>{ rotateCard(); setInterval(rotateCard,6000); },3000);
}

const io=new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

const tbtn=document.getElementById('theme-btn');
const applyTheme=t=>{
  document.body.classList.toggle('light', t==='light');
  if(tbtn) tbtn.textContent = t==='light' ? '☀️' : '🌙';
};
let scfTheme='light';
try{ scfTheme=localStorage.getItem('scf_theme')||'light'; }catch(e){}
applyTheme(scfTheme);
if(tbtn) tbtn.onclick=()=>{
  scfTheme = scfTheme==='light' ? 'dark' : 'light';
  try{ localStorage.setItem('scf_theme',scfTheme); }catch(e){}
  applyTheme(scfTheme);
};

const HERO_LINES=[
  'No agency. No cut.',
  'Build your profile with AI.',
  'Post your CV on the main page.',
  'Your maritime CV, built in minutes.',
  'Sea time & licence renewal, tracked.',
  'Certificates with expiry alerts.',
  'Hire verified crew — directly.',
  'Post a job. Crew get alerted.',
  'Talk live in The Mess Room.',
  'Know your salary. 15 ranks.',
  'Upload documents — AI reads them.',
  'Zero commission. Ever.'
];
let hIdx=0;
const hRot=document.getElementById('hero-rot');
if(hRot){
  setInterval(()=>{
    hRot.classList.add('out');
    setTimeout(()=>{
      hIdx=(hIdx+1)%HERO_LINES.length;
      hRot.textContent=HERO_LINES[hIdx];
      hRot.classList.remove('out');
    },350);
  },4600);
}

let deferredPrompt=null;
const pwaBtn=document.getElementById('pwa-install');
window.addEventListener('beforeinstallprompt',(e)=>{
  e.preventDefault();
  deferredPrompt=e;
  let dis=false;
  try{ dis=localStorage.getItem('scf_pwa_dis')==='1'; }catch(err){}
  if(pwaBtn && !dis) pwaBtn.style.display='flex';
});
if(pwaBtn){
  pwaBtn.onclick=async()=>{
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt=null;
    pwaBtn.style.display='none';
    try{ localStorage.setItem('scf_pwa_dis','1'); }catch(err){}
  };
}
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
const standalone=window.matchMedia('(display-mode: standalone)').matches || navigator.standalone===true;
const iosTip=document.getElementById('ios-tip');
let iosDis=false;
try{ iosDis=localStorage.getItem('scf_ios_tip')==='1'; }catch(e){}
if(iosTip && isIOS && !standalone && !iosDis){
  iosTip.style.display='flex';
  const x=document.getElementById('ios-tip-x');
  if(x) x.onclick=()=>{
    iosTip.style.display='none';
    try{ localStorage.setItem('scf_ios_tip','1'); }catch(e){}
  };
}

const EXIT_TIPS=[
  {ic:'💰',t:'Leaving without checking your salary?',s:'Free, 10 seconds, no signup — see if you\'re below or above market rate.',href:'/salary-check',btn:'Check now'},
  {ic:'⏰',t:'Forgot to set up document reminders?',s:'Passport, STCW, medical — free alerts before anything expires.',href:'/signup/crew',btn:'Set up free'},
  {ic:'⚓',t:'Your profile could be live in 2 minutes',s:'Companies contact you directly — no agency, no commission, ever.',href:'/signup/crew',btn:'Join free'},
  {ic:'📊',t:'See what 15 ranks actually earn in 2026',s:'Real, current salary ranges by rank and vessel type.',href:'/salary',btn:'View index'},
  {ic:'🔍',t:'Still looking for your next contract?',s:'Browse open positions from verified shipping companies.',href:'/jobs',btn:'See jobs'},
  {ic:'🎁',t:'Crew membership is $0 — forever',s:'No trial, no card, no catch. Just a free, verified profile.',href:'/signup/crew',btn:'Get started'},
  {ic:'💬',t:'Talk to other seafarers right now',s:'The Mess Room — live 24/7 crew chat, no signup needed to look.',href:'/messroom',btn:'Take a look'},
  {ic:'🏢',t:'Hiring? Post your first job free',s:'Reach verified, available crew directly — no agency fees.',href:'/signup/company',btn:'Post a job'},
  {ic:'📄',t:'Your CV, built in 2 minutes',s:'Auto-generated from your profile — downloadable, shareable.',href:'/signup/crew',btn:'Build mine'},
  {ic:'⚡',t:'Companies are searching right now',s:'A finished profile appears on our homepage automatically.',href:'/signup/crew',btn:'Finish mine'},
];
let exitShown = false;
try{ exitShown = sessionStorage.getItem('scf_exit_shown') === '1'; }catch(e){}
const exitCard = document.getElementById('exit-intent');
if(exitCard && !exitShown){
  const tip = EXIT_TIPS[Math.floor(Math.random()*EXIT_TIPS.length)];
  const fillCard=()=>{
    document.getElementById('exit-ic').textContent=tip.ic;
    document.getElementById('exit-t').textContent=tip.t;
    document.getElementById('exit-s').textContent=tip.s;
    const a=document.getElementById('exit-btn');
    a.textContent=tip.btn; a.href=tip.href;
  };
  const trigger=()=>{
    if(exitShown) return;
    fillCard();
    exitCard.style.display='flex';
    exitShown=true;
    try{ sessionStorage.setItem('scf_exit_shown','1'); }catch(err){}
  };
  if(!isIOS && !/android/i.test(navigator.userAgent)){
    const onMouseLeave=(e)=>{ if(e.clientY <= 0){ trigger(); document.removeEventListener('mouseleave', onMouseLeave); } };
    document.addEventListener('mouseleave', onMouseLeave);
  }
  let lastY=window.scrollY, upStreak=0;
  const onScroll=()=>{
    const y=window.scrollY;
    if(y < lastY && y < 120){ upStreak++; if(upStreak>4){ trigger(); window.removeEventListener('scroll', onScroll); } }
    else { upStreak=0; }
    lastY=y;
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  const exitX=document.getElementById('exit-intent-x');
  if(exitX) exitX.onclick=()=>{ exitCard.style.display='none'; };
}

const linkShareBtn=document.getElementById('link-share-btn');
if(linkShareBtn){
  linkShareBtn.onclick=async()=>{
    const url='https://shipcrewfinder.com';
    try{
      await navigator.clipboard.writeText(url);
      linkShareBtn.textContent='Copied! ✓';
      setTimeout(()=>{ linkShareBtn.textContent='Copy Link'; },2200);
    }catch(e){
      window.prompt('Copy this link:', url);
    }
  };
}

const a2hsBtn=document.getElementById('a2hs-btn');
const a2hsHint=document.getElementById('a2hs-hint');
const a2hsWrap=document.getElementById('a2hs');
if(a2hsWrap && standalone){ a2hsWrap.style.display='none'; }
if(a2hsBtn){
  a2hsBtn.onclick=async()=>{
    if(deferredPrompt){
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt=null;
      return;
    }
    if(isIOS){
      if(iosTip) iosTip.style.display='flex';
      if(a2hsHint){ a2hsHint.textContent='iPhone: tap the Share button below, then "Add to Home Screen".'; a2hsHint.style.display='block'; }
      return;
    }
    if(a2hsHint){ a2hsHint.textContent='Open your browser menu (⋮) and choose "Add to Home screen" / "Install app".'; a2hsHint.style.display='block'; }
  };
}

    return () => {
      __T.forEach(x => x.t === 'i' ? clearInterval(x.h) : clearTimeout(x.h));
      if (typeof io !== 'undefined' && io.disconnect) io.disconnect();
    };
  }, []);
  return (
    <>
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --navy:#0d1030;--navy2:#141845;--navy3:#1b2158;--ink:#050716;
    --gold:#fbbf24;--gold2:#e0a010;--line:rgba(251,191,36,.16);--line2:rgba(255,255,255,.08);
    --tx:#eef4fa;--tx2:#a8bdd2;--tx3:#6b83a0;
    --disp:var(--font-bricolage),sans-serif;--body:var(--font-jakarta),sans-serif;
    --grn:#34d399;
  }
  html{scroll-behavior:smooth}
  body.light{
    --navy:#f2f4fb;--navy2:#ffffff;--navy3:#e9edf8;--deep:#e6eaf5;--ink:#ffffff;
    --tx:#0e1730;--tx2:#2e3c5e;--tx3:#57678a;
    --line:rgba(224,160,16,.4);--line2:rgba(15,25,60,.12);
  }
  body.light .top{background:rgba(255,255,255,.88)}
  body.light .mnav{background:rgba(255,255,255,.97)}
  body.light .pcard,body.light .price{box-shadow:0 24px 55px rgba(20,30,70,.16)}
  body.light .aur1{opacity:.4}
  body.light .aur2{opacity:.3}
  body.light .marq{background:rgba(255,255,255,.55)}
  body.light nav a{background:rgba(255,255,255,.6)}
  body.light .rep-pre{background:#ffffff}
  body.light .pwa-chip{background:#ffffff;box-shadow:0 14px 30px rgba(20,30,70,.2)}
  body.light .feat{background:#f7f9fe;border-color:rgba(15,25,60,.13)}
  body.light .pc-row{background:#f3f6fc;border-color:rgba(15,25,60,.13)}
  body.light .pc-row span{color:#57678a}
  body.light .pc-row b{color:#0e1730}
  body.light details{background:#f7f9fe;border-color:rgba(15,25,60,.13)}
  body.light .marq-in span{background:#ffffff;border-color:rgba(15,25,60,.15);color:#2e3c5e}
  body.light .step{background:#ffffff;border-color:rgba(15,25,60,.13)}
  body.light .path{background:#ffffff;border-color:rgba(224,160,16,.55)}
  body.light .path:hover{box-shadow:0 14px 30px rgba(224,160,16,.22)}
  body.light .path.co{border-color:rgba(59,130,246,.55)}
  body.light .path.co:hover{box-shadow:0 14px 30px rgba(59,130,246,.22)}
  body.light .trybox{background:#ffffff}
  body.light .psteps li{color:#2e3c5e}
  body.light .cplan{background:#ffffff;border-color:rgba(15,25,60,.13)}
  body.light .cplan.hot{border-color:var(--gold)}
  body.light .price{background:#ffffff}
  body.light .plist li{color:#1c2846}
  body.light .founder{background:rgba(224,160,16,.07)}
  body.light .fcard{background:rgba(52,211,153,.08)}
  body.light .hint{color:#6a7a9c}
  body.light .avatar{background:linear-gradient(145deg,#dfe7f6,#c9d6ee);color:#8a6a1e}
  body.light .pcard{background:linear-gradient(165deg,#ffffff,#f2f5fc)}
  body.light .salstrip{background:#ffffff;border-color:rgba(15,25,60,.14)}
  body.light{--tx2:#25334f;--tx3:#4a5b7d}
  body.light .hero p.sub{color:#25334f}
  body.light .path{background:linear-gradient(165deg,#fffdf4,#ffffff);box-shadow:0 12px 30px rgba(224,160,16,.2)}
  body.light .path.co{background:linear-gradient(165deg,#f3f8ff,#ffffff);box-shadow:0 12px 30px rgba(59,130,246,.18)}
  body.light .path b{color:#0e1730}
  body.light .path span{color:#3d4c6b}
  body.light .psteps li{color:#33425f}
  body.light .wis-card{background:#ffffff;border-color:rgba(15,25,60,.13)}
  body.light .wis-card p{color:#33425f}
  body.light #try [class*="bg-primary"]{background:#ffffff !important}
  body.light #try [class*="text-white"]{color:#1c2a4d !important}
  body.light #try [class*="border-white"]{border-color:rgba(15,25,60,.16) !important}
  body.light #try [class*="bg-white"]{background:#eef2fa !important}
  body.light #try [class*="bg-accent"]{background:#fbbf24 !important}
  body.light #try [class*="bg-accent"] *, body.light #try .text-primary{color:#0b0e13 !important}
  body.light #try select, body.light #try input{background:#f4f6fc !important;color:#14203f !important;border-color:rgba(15,25,60,.18) !important}

  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:1180px;margin:0 auto;padding:0 20px}



  .top{position:sticky;top:0;z-index:50;background:rgba(10,37,64,.85);backdrop-filter:blur(14px);
    border-bottom:1px solid var(--line2)}
  .top-in{display:flex;align-items:center;justify-content:space-between;height:66px}
  .logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--tx)}
  .logo-ic{width:38px;height:38px;border-radius:10px;background:linear-gradient(145deg,var(--gold),var(--gold2));
    display:grid;place-items:center;color:var(--ink);font-family:var(--disp);font-weight:800;font-size:19px}
  .logo b{font-family:var(--disp);font-size:18px;font-weight:700}
  .logo b span{color:var(--gold)}
  nav{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
  @media(max-width:1440px){ nav{gap:5px} nav a{font-size:12px;padding:6px 10px} }
  @media(max-width:1180px){ nav{gap:4px} nav a{font-size:11.5px;padding:6px 8px} }
  nav a{color:var(--tx2);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;
    border:1px solid var(--line2);border-radius:10px;padding:7px 12px;background:rgba(255,255,255,.02);white-space:nowrap}
  nav a:hover{color:var(--gold);border-color:var(--gold);background:rgba(251,191,36,.07)}
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
  .ham{display:none;place-items:center;width:42px;height:42px;border:1px solid var(--line2);border-radius:10px;
    background:rgba(255,255,255,.03);cursor:pointer;color:var(--tx);font-size:19px}
  @media(max-width:860px){ nav{display:none} .ham{display:grid} .top-cta .btn-ghost{padding:9px 13px;font-size:13px} }
  .mnav{display:none;flex-direction:column;gap:8px;padding:12px 20px 16px;border-top:1px solid var(--line2);
    background:rgba(7,26,48,.97)}
  .mnav.open{display:flex}
  .mnav a{color:var(--tx2);text-decoration:none;font-size:14.5px;font-weight:600;
    border:1px solid var(--line2);border-radius:10px;padding:12px 16px;background:rgba(255,255,255,.02)}
  .mnav a:active{color:var(--gold);border-color:var(--gold)}
  .hero{position:relative;padding:72px 0 60px;overflow:hidden}
  .aur{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;opacity:.55}
  .aur1{width:560px;height:560px;top:-180px;right:-80px;background:radial-gradient(circle,rgba(251,191,36,.30),transparent 65%);animation:drift1 14s ease-in-out infinite alternate}
  .aur2{width:480px;height:480px;bottom:-200px;left:-120px;background:radial-gradient(circle,rgba(37,99,235,.33),transparent 65%);animation:drift2 18s ease-in-out infinite alternate}
  @keyframes drift1{to{transform:translate(-60px,50px) scale(1.15)}}
  @keyframes drift2{to{transform:translate(70px,-40px) scale(1.1)}}
  .hero::before{content:'';position:absolute;top:-30%;left:50%;transform:translateX(-50%);
    width:1200px;height:800px;background:radial-gradient(ellipse,rgba(251,191,36,.1),transparent 60%);pointer-events:none}
  .hero-in{position:relative;display:grid;grid-template-columns:1.15fr .85fr;gap:48px;align-items:center}
  .badge{display:inline-flex;align-items:center;gap:11px;background:var(--gold);
    border:2px solid var(--gold);border-radius:26px;padding:11px 22px;font-size:15.5px;font-weight:800;
    letter-spacing:.01em;color:#0b0e13;margin-bottom:24px;box-shadow:0 0 24px rgba(251,191,36,.5);
    animation:badgeglow 2.2s ease-in-out infinite}
  @keyframes badgeglow{0%,100%{box-shadow:0 0 24px rgba(251,191,36,.5)}50%{box-shadow:0 0 38px rgba(251,191,36,.75)}}
  .badge .d{width:9px;height:9px;border-radius:50%;background:#065f46;animation:pulse 1.6s infinite;flex-shrink:0}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
  h1{font-family:var(--disp);font-size:clamp(2.3rem,5.4vw,3.9rem);font-weight:800;line-height:1.06;
    letter-spacing:-.03em;margin-bottom:18px}
  h1 .g{color:var(--gold)}
  .hero-rot{display:inline-block;transition:opacity .35s ease, transform .35s ease}
  .hero-rot.out{opacity:0;transform:translateY(-10px)}
  .hero p.sub{font-size:16.5px;color:var(--tx2);line-height:1.65;max-width:52ch;margin-bottom:30px}
  .paths{display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:560px}
  .path{display:block;background:linear-gradient(160deg,var(--navy2),var(--navy));
    border:2px solid rgba(251,191,36,.55);border-radius:17px;padding:22px 20px;text-decoration:none;color:var(--tx);
    transition:.2s;position:relative;overflow:hidden;box-shadow:0 0 22px rgba(251,191,36,.18)}
  .path::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--gold),transparent)}
  .path:hover{transform:translateY(-3px);border-color:var(--gold);box-shadow:0 10px 34px rgba(251,191,36,.22)}
  .path .pi{font-size:28px;margin-bottom:9px}
  .path b{display:block;font-family:var(--disp);font-size:18px;font-weight:800;margin-bottom:6px}
  .path span{font-size:12.5px;color:var(--tx3);line-height:1.5;display:block}
  .path .go{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-radius:10px;padding:9px 15px;font-weight:800;font-size:12.5px;margin-top:12px}
  .path.co{border-color:rgba(96,165,250,.6);box-shadow:0 0 22px rgba(96,165,250,.2)}
  .path.co::before{background:linear-gradient(90deg,#60a5fa,transparent)}
  .path.co:hover{border-color:#60a5fa;box-shadow:0 10px 34px rgba(96,165,250,.25)}
  .path.co .go{background:linear-gradient(135deg,#60a5fa,#3b82f6);color:#071022}
  .path.co .psteps li::before{background:rgba(96,165,250,.16);color:#60a5fa}
  .psteps{list-style:none;counter-reset:ps;margin:4px 0 2px;display:flex;flex-direction:column;gap:6px}
  .psteps li{counter-increment:ps;font-size:12.5px;color:var(--tx2);display:flex;gap:9px;align-items:center}
  .psteps li::before{content:counter(ps);width:19px;height:19px;border-radius:6px;flex-shrink:0;
    background:rgba(251,191,36,.14);color:var(--gold);font-weight:700;font-size:10.5px;display:grid;place-items:center}
  .psteps em{font-style:normal;color:var(--tx3);font-size:11px}
  .hero-note{margin-top:18px;font-size:12.5px;color:var(--tx3)}
  .hero-note b{color:var(--grn)}
  .hero-vis{position:relative;perspective:1100px}
  .pcard{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid rgba(251,191,36,.22);
    border-radius:22px;padding:24px;box-shadow:0 34px 70px rgba(0,0,0,.5);position:relative;max-width:380px;
    margin-left:auto;overflow:hidden;animation:cardTilt 9s ease-in-out infinite alternate;transform-style:preserve-3d}
  @keyframes cardTilt{0%{transform:rotateY(-5deg) rotateX(2deg)}100%{transform:rotateY(4deg) rotateX(-2deg)}}
  .pcard::after{content:'';position:absolute;top:0;bottom:0;width:60%;left:-80%;
    background:linear-gradient(100deg,transparent,rgba(255,255,255,.08),transparent);
    animation:shine 5.5s ease-in-out infinite}
  @keyframes shine{0%,55%{left:-80%}85%,100%{left:130%}}
  .pc-fade{transition:opacity .3s ease, transform .3s ease}
  .pc-fade.out{opacity:0;transform:translateY(-8px)}
  .pdots{display:flex;gap:6px;justify-content:center;margin-top:12px}
  .pdots span{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.18);transition:.3s}
  .pdots span.on{background:var(--gold);transform:scale(1.25)}
  .sample-note{text-align:center;font-size:9.5px;color:var(--tx3);margin-top:8px;letter-spacing:.05em;opacity:.75}
  .pcard::before{content:'';position:absolute;inset:0;border-radius:20px;pointer-events:none;
    background:radial-gradient(ellipse at 80% 0%,rgba(251,191,36,.12),transparent 55%)}
  .pc-top{display:flex;gap:14px;align-items:center;margin-bottom:15px}
  .avatar{width:56px;height:56px;border-radius:16px;background:linear-gradient(145deg,#2a4a70,#16324f);
    display:grid;place-items:center;font-family:var(--disp);font-weight:800;font-size:21px;color:var(--gold)}
  .pc-name{font-family:var(--disp);font-weight:700;font-size:17px}
  .pc-rank{font-size:12.5px;color:var(--tx3);margin-top:2px}
  .vbadge{display:inline-flex;align-items:center;gap:5px;background:rgba(52,211,153,.12);color:var(--grn);
    border:1px solid rgba(52,211,153,.3);border-radius:8px;padding:3px 9px;font-size:10.5px;font-weight:700;margin-top:6px}
  .pc-rows{display:flex;flex-direction:column;gap:8px;margin-bottom:13px}
  .pc-row{display:flex;justify-content:space-between;font-size:12.5px;padding:9px 12px;
    background:rgba(255,255,255,.03);border:1px solid var(--line2);border-radius:10px}
  .pc-row span{color:var(--tx3)}
  .pc-row b{font-weight:600}
  .pc-row b.av{color:var(--grn)}
  .fcard{display:flex;gap:10px;align-items:center;background:rgba(52,211,153,.07);
    border:1px solid rgba(52,211,153,.25);border-radius:12px;padding:10px 13px;font-size:12px;margin-bottom:13px}
  .fcard .ic{width:30px;height:30px;border-radius:9px;background:rgba(52,211,153,.14);display:grid;place-items:center;font-size:14px;flex-shrink:0;animation:blink 2.6s ease-in-out infinite}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.55}}
  .fcard b{display:block;font-size:12px;line-height:1.3}
  .fcard span{color:var(--tx3);font-size:10.5px}
  .pc-cta{width:100%;text-align:center;font-size:13px}
  .marq{border-top:1px solid var(--line2);border-bottom:1px solid var(--line2);padding:16px 0;overflow:hidden;
    background:rgba(7,26,48,.5)}
  .marq-in{display:flex;white-space:nowrap;animation:scroll 55s linear infinite;width:max-content;gap:14px}
  .marq-in span{font-family:var(--disp);font-weight:700;font-size:13.5px;color:var(--tx2);
    border:1px solid var(--line2);border-radius:11px;padding:9px 18px;background:rgba(255,255,255,.025);
    display:inline-flex;align-items:center;gap:8px}
  .marq-in span::before{content:'⚓';font-size:11px;opacity:.55}
  @keyframes scroll{to{transform:translateX(-50%)}}
  .trybox{border:1.5px solid var(--line);border-radius:20px;padding:26px 24px;background:linear-gradient(160deg,rgba(251,191,36,.07),var(--ink));box-shadow:0 0 22px rgba(251,191,36,.12)}
  .try-sub{font-size:13px;color:var(--tx2);margin-bottom:20px}
  .salstrip{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;
    background:linear-gradient(160deg,var(--navy2),var(--ink));border:1.5px solid var(--line);border-radius:16px;
    padding:16px 22px;margin:34px auto 0;max-width:1140px}
  .salstrip .ss-l{display:flex;align-items:center;gap:14px;flex-wrap:wrap;font-size:13px}
  .salstrip .ss-t{font-family:var(--disp);font-weight:800;font-size:13.5px;color:var(--gold);white-space:nowrap}
  .salstrip .ss-i{color:var(--tx2);white-space:nowrap}
  .salstrip .ss-i b{color:var(--grn);font-weight:700}
  .salstrip a{color:var(--gold);font-weight:700;font-size:13px;text-decoration:none;white-space:nowrap}
  .salstrip a:hover{text-decoration:underline}
  section{padding:76px 0}
  .sec-tag{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
    color:var(--gold);margin-bottom:12px}
  h2{font-family:var(--disp);font-size:clamp(1.7rem,3.8vw,2.5rem);font-weight:800;letter-spacing:-.02em;
    line-height:1.12;margin-bottom:14px}
  .sec-sub{font-size:15px;color:var(--tx2);line-height:1.65;max-width:58ch;margin-bottom:40px}
  .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  .step{background:linear-gradient(160deg,var(--navy2),var(--navy));border:1px solid var(--line2);
    border-radius:18px;padding:26px;position:relative}
  .step .num{font-family:var(--disp);font-weight:800;font-size:15px;color:var(--ink);
    width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--gold),var(--gold2));
    display:grid;place-items:center;margin-bottom:16px}
  .step h3{font-family:var(--disp);font-size:18px;font-weight:700;margin-bottom:9px}
  .step p{font-size:13.5px;color:var(--tx2);line-height:1.6}
  .split{display:grid;grid-template-columns:1.05fr .95fr;gap:44px;align-items:start}
  .feats{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-top:26px}
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
  .cplans{display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:860px;align-items:stretch}
  .cplan{background:linear-gradient(165deg,var(--navy2),var(--navy));border:1px solid var(--line2);
    border-radius:20px;padding:28px;position:relative;display:flex;flex-direction:column}
  .cplan .plist{flex:1}
  .cplan.hot{border:1.5px solid var(--gold);box-shadow:0 20px 50px rgba(0,0,0,.35)}
  .hot-tag{position:absolute;top:-12px;left:24px;background:linear-gradient(135deg,var(--gold),var(--gold2));
    color:var(--ink);font-size:10.5px;font-weight:800;letter-spacing:.08em;border-radius:7px;padding:4px 11px}
  .cplan h3{font-family:var(--disp);font-size:20px;font-weight:800;margin-bottom:4px}
  .cplan .cfor{font-size:12.5px;color:var(--tx3);margin-bottom:16px}
  .why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .founder{margin-top:34px;background:rgba(251,191,36,.06);border:1px solid var(--line);border-radius:16px;
    padding:22px 26px;display:flex;gap:16px;align-items:center;flex-wrap:wrap}
  .founder .fi{font-size:28px}
  .founder b{font-family:var(--disp);font-size:16px;display:block;margin-bottom:4px}
  .founder p{font-size:13px;color:var(--tx2);line-height:1.6;max-width:64ch}
  .faq{max-width:760px}
  details{background:rgba(255,255,255,.03);border:1px solid var(--line2);border-radius:14px;
    margin-bottom:11px;overflow:hidden}
  summary{cursor:pointer;padding:17px 20px;font-weight:700;font-size:14.5px;list-style:none;
    display:flex;justify-content:space-between;align-items:center;gap:14px}
  summary::-webkit-details-marker{display:none}
  summary::after{content:'+';font-family:var(--disp);color:var(--gold);font-size:20px;font-weight:700;transition:.2s}
  details[open] summary::after{transform:rotate(45deg)}
  details p{padding:0 20px 17px;font-size:13.5px;color:var(--tx2);line-height:1.65}
  .final{background:linear-gradient(160deg,var(--navy3),var(--navy));border-top:1px solid var(--line2);
    text-align:center;padding:84px 0}
  .final h2{margin-bottom:12px}
  .final .sec-sub{margin:0 auto 32px}
  .cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
  .final .note{margin-top:18px;font-size:12.5px;color:var(--tx3)}
  footer{border-top:1px solid var(--line2);padding:52px 0;background:var(--ink)}
  .foot-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:30px}
  .foot-brand p{font-size:13px;color:var(--tx3);line-height:1.6;margin-top:12px;max-width:32ch}
  footer h4{font-family:var(--disp);font-size:13.5px;font-weight:700;margin-bottom:14px}
  footer ul{list-style:none;display:flex;flex-direction:column;gap:9px}
  footer ul a{color:var(--tx3);text-decoration:none;font-size:13px}
  footer ul a:hover{color:var(--gold)}
  .foot-btm{margin-top:38px;padding-top:20px;border-top:1px solid var(--line2);font-size:12px;color:var(--tx3);
    display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}
  .pwa-chip{position:fixed;z-index:90;left:12px;right:12px;bottom:calc(76px + env(safe-area-inset-bottom));
    display:none;align-items:center;gap:12px;background:var(--navy2);border:1.5px solid var(--line);
    border-radius:16px;padding:12px 14px;box-shadow:0 18px 44px rgba(0,0,0,.5);max-width:440px;margin:0 auto}
  .pwa-chip .pic{width:38px;height:38px;border-radius:11px;background:linear-gradient(145deg,var(--gold),var(--gold2));
    display:grid;place-items:center;font-size:19px;flex-shrink:0}
  .pwa-chip b{display:block;font-size:13px;font-family:var(--disp)}
  .pwa-chip span{font-size:11px;color:var(--tx3);line-height:1.4}
  .pwa-chip .px{margin-left:auto;background:none;border:none;color:var(--tx3);font-size:18px;cursor:pointer;padding:4px;flex-shrink:0}
  #pwa-install{cursor:pointer}
  .exit-card{position:fixed;z-index:95;left:20px;right:20px;bottom:calc(76px + env(safe-area-inset-bottom));
    display:none;align-items:center;gap:14px;background:linear-gradient(160deg,var(--navy2),var(--ink));
    border:1.5px solid var(--line);border-radius:18px;padding:16px 18px;box-shadow:0 22px 50px rgba(0,0,0,.55);
    max-width:460px;margin:0 auto}
  .exit-card .ec-ic{width:42px;height:42px;border-radius:12px;background:rgba(52,211,153,.14);
    display:grid;place-items:center;font-size:20px;flex-shrink:0}
  .exit-card b{display:block;font-size:13.5px;font-family:var(--disp)}
  .exit-card span{font-size:11.5px;color:var(--tx3);line-height:1.4}
  .exit-card .ec-btn{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;
    border:none;border-radius:10px;padding:10px 16px;font-weight:800;font-size:12.5px;cursor:pointer;
    text-decoration:none;white-space:nowrap;font-family:var(--body)}
  .exit-card .ec-x{background:none;border:none;color:var(--tx3);font-size:17px;cursor:pointer;padding:2px;flex-shrink:0}
  .wis{padding:38px 0 4px}
  .wis h2{margin-bottom:8px}
  .wis .sec-sub{margin-bottom:22px}
  .wisg{display:grid;grid-template-columns:repeat(3,1fr);gap:13px}
  @media(max-width:820px){.wisg{grid-template-columns:1fr}}
  .wis-card{background:rgba(255,255,255,.03);border:1px solid var(--line2);border-radius:16px;padding:20px}
  .wis-card .wi{font-size:24px;margin-bottom:9px}
  .wis-card b{display:block;font-family:var(--disp);font-size:15px;font-weight:800;margin-bottom:6px}
  .wis-card p{font-size:13px;color:var(--tx2);line-height:1.6}
  .wis-link{text-decoration:none;color:inherit;transition:.2s;cursor:pointer}
  .wis-link:hover{transform:translateY(-3px);border-color:rgba(251,191,36,.5);box-shadow:0 10px 28px rgba(251,191,36,.15)}
  .wis-go{display:inline-block;margin-top:12px;font-family:var(--disp);font-weight:800;font-size:12.5px;color:var(--gold)}
  .wis-go.wis-static{color:var(--grn)}
  .a2hs{margin:22px 0 0;display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:space-between;border:1.5px solid var(--line);border-radius:16px;padding:14px 18px;background:linear-gradient(160deg,rgba(251,191,36,.08),var(--ink));box-shadow:0 0 18px rgba(251,191,36,.12);max-width:560px}
  .a2hs .ai{display:flex;gap:12px;align-items:center;min-width:0;flex:1}
  .a2hs .aic{width:40px;height:40px;border-radius:12px;background:linear-gradient(145deg,var(--gold),var(--gold2));display:grid;place-items:center;font-size:19px;flex-shrink:0}
  .a2hs b{font-family:var(--disp);font-size:14px;display:block}
  .a2hs p{font-size:11.5px;color:var(--tx2);margin-top:2px;line-height:1.4}
  .a2hs-btn{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border:none;border-radius:11px;padding:11px 20px;font-weight:800;font-size:13px;cursor:pointer;font-family:var(--body);white-space:nowrap}
  .a2hs-btn:hover{transform:translateY(-1px)}
  .a2hs-hint{display:none;width:100%;font-size:11px;color:var(--gold);background:rgba(251,191,36,.07);border:1px dashed rgba(251,191,36,.35);border-radius:9px;padding:8px 11px;line-height:1.5}
  body.light .a2hs{background:#ffffff}
  .rv{opacity:0;transform:translateY(22px);transition:opacity .6s ease,transform .6s ease}
  .rv.in{opacity:1;transform:none}
  @media(max-width:960px){
    .hero-in{grid-template-columns:1fr;gap:32px}
    .hero-vis{max-width:380px;width:100%;margin:0 auto}
    .pcard{margin:0 auto;animation:none;transform:none}
    .split{grid-template-columns:1fr}
  }
  @media(max-width:860px){ .steps{grid-template-columns:1fr} .why-grid{grid-template-columns:1fr 1fr} }
  @media(max-width:820px){ .cplans{grid-template-columns:1fr} .foot-grid{grid-template-columns:1fr 1fr} }
  @media(max-width:640px){
    .top-in{height:56px}
    .top-cta .btn-gold{display:none}
    .logo-ic{width:32px;height:32px}
    .logo b{font-size:16px}
    .hero{padding:30px 0 30px}
    section{padding:44px 0}
    .final{padding:56px 0}
    h1{margin-bottom:12px}
    .hero p.sub{font-size:14.5px;margin-bottom:20px}
    .badge{margin-bottom:14px;font-size:10.5px;padding:6px 12px}
    .sec-sub{margin-bottom:24px}
    .pcard{padding:18px;max-width:100%}
    .salstrip{padding:13px 15px;margin-top:20px}
    .founder{padding:18px 20px}
    .price{padding:24px 18px}
    .cplan{padding:24px 18px}
    .paths{grid-template-columns:1fr 1fr;gap:10px;max-width:100%}
    .path{padding:13px 12px}
    .path .pi{font-size:19px;margin-bottom:5px}
    .path b{font-size:13.5px;margin-bottom:4px}
    .psteps li{font-size:10.5px;gap:6px}
    .psteps li::before{width:15px;height:15px;font-size:9px;border-radius:5px}
    .psteps em{display:none}
    .path .go{font-size:11px;margin-top:7px;padding:8px 11px}
    .hero-note{font-size:11px;margin-top:14px}
    .a2hs{padding:12px 13px;gap:10px}
    .a2hs b{font-size:13px}
    .a2hs-btn{padding:10px 16px;font-size:12.5px}
    .hero-vis{display:none}
    .trybox{padding:18px 14px}
  }
  @media(max-width:560px){ .feats{grid-template-columns:1fr} .why-grid{grid-template-columns:1fr} }
`}</style>
      <header className="top">
  <div className="wrap top-in">
    <a className="logo" href="/"><span className="logo-ic"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#0b0e13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2.4"/><line x1="12" y1="7.4" x2="12" y2="20.5"/><line x1="7.5" y1="10.4" x2="16.5" y2="10.4"/><path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7"/><path d="M4.5 14.8l-1.6-1.2M4.5 14.8l2-.4"/><path d="M19.5 14.8l1.6-1.2M19.5 14.8l-2-.4"/></svg></span><b>Ship<span>Crew</span>Finder</b></a>
    <nav>
      <a href="#crew">For Crew</a>
      <a href="#companies">For Companies</a>
      <a href="#how">How it works</a>
      <a href="/salary">Salary Index</a>
      <a href="/tools">Crew Toolkit</a>
      <a href="#faq">FAQ</a>
      <a href="/blog">Blog</a>
    </nav>
    <div className="top-cta">
      <a className="btn btn-ghost" href="/login" style={{borderColor:"var(--gold)",color:"var(--gold)",fontWeight:800}}>Login</a>
      <a className="btn btn-gold" href="/signup">Sign Up Free</a>
      <button className="btn btn-ghost" id="theme-btn" aria-label="Theme" style={{padding:"10px 13px",fontSize:"16px",lineHeight:"1"}}>🌙</button>
      <button className="ham" id="ham" aria-label="Menu">☰</button>
    </div>
  </div>
  <div className="mnav" id="mnav">
    <a href="#crew">For Crew</a>
    <a href="#companies">For Companies</a>
    <a href="#how">How it works</a>
    <a href="/salary">Salary Index</a>
    <a href="/tools">Crew Toolkit</a>
    <a href="/salary-check">Check My Salary</a>
    <a href="/signup/crew">Document Reminders</a>
    <a href="#faq">FAQ</a>
    <a href="/blog">Blog</a>
    <a href="/login">Login</a>
    <a href="/signup">Sign Up Free</a>
  </div>
</header>

<section className="hero">
  <div className="aur aur1"></div>
  <div className="aur aur2"></div>
  <div className="wrap hero-in">
    <div>
      <div className="badge"><span className="d"></span>NEW — BUILD YOUR PROFILE WITH AI</div>
      <h1>Your next contract.<br/><span className="g hero-rot" id="hero-rot">No agency. No cut.</span></h1>
      <div style={{marginBottom:22}}><LiveRosterFeed /></div>
      <p className="sub">ShipCrewFinder connects verified seafarers with shipping companies — directly. No middlemen taking a slice of your salary. No agencies filtering your messages.</p>
      <div className="paths">
        <a className="path" href="/signup/crew">
          <div className="pi">⚓</div>
          <b>I'm Crew — find your next contract</b>
          <ol className="psteps">
            <li>Create profile <em>(2 min)</em></li>
            <li>Upload CV {"&"} certificates</li>
            <li>Companies contact you</li>
          </ol>
          <span className="go">Start free month →</span>
        </a>
        <a className="path co" href="/signup/company">
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
      <div className="hero-note"><b>✓</b> Cancel anytime  ·  <b>✓</b> 0% commission — ever  ·  <b>✓</b> Verified profiles only</div>
      <div className="a2hs" id="a2hs">
        <div className="ai">
          <span className="aic">📲</span>
          <span style={{minWidth:0}}>
            <b>Use ShipCrewFinder like an app</b>
            <p>Add it to your home screen — one tap, full screen, works at sea.</p>
          </span>
        </div>
        <button type="button" className="a2hs-btn" id="a2hs-btn">Install ⚓</button>
        <span className="a2hs-hint" id="a2hs-hint"></span>
      </div>

      <div className="a2hs" id="link-share">
        <div className="ai">
          <span className="aic">🔗</span>
          <span style={{minWidth:0}}>
            <b>Send this site to your ship friend</b>
            <p>Copy the link — send it on WhatsApp, Telegram, anywhere.</p>
          </span>
        </div>
        <button type="button" className="a2hs-btn" id="link-share-btn">Copy Link</button>
      </div>
    </div>
    <div className="hero-vis">
      <div className="pcard">
        <div className="pc-fade" id="pc-fade">
        <div className="pc-top">
          <div className="avatar" id="pc-init">CE</div>
          <div>
            <div className="pc-name" id="pc-rankname">Chief Engineer</div>
            <div className="pc-rank" id="pc-line">Unlimited · Motor · 12 yrs at sea</div>
            <div className="vbadge">✓ VERIFIED PROFILE</div>
          </div>
        </div>
        <div className="pc-rows">
          <div className="pc-row"><span>Availability</span><b className="av" id="pc-avail">● Available from Sep 2026</b></div>
          <div className="pc-row"><span>Certificates</span><b id="pc-cert">STCW III/2 · COC ✓</b></div>
          <div className="pc-row"><span>Vessel experience</span><b id="pc-ves">Bulk · Tanker · Container</b></div>
          <div className="pc-row"><span>Last contract</span><b id="pc-last">C/E — 82,000 DWT Bulk</b></div>
        </div>
        <div className="fcard">
          <div className="ic">👁</div>
          <div><b id="fc-n">3 companies viewed this profile</b><span id="fc-s">this week · via Profile Analytics</span></div>
        </div>
        </div>
        <a className="btn btn-gold pc-cta" href="/signup/company">Contact directly →</a>
        <div className="pdots" id="pdots"></div>
        <div className="sample-note">EXAMPLE — real verified profiles rotate here as members join</div>
      </div>
    </div>
  </div>
</section>

<div className="wrap" style={{padding:"0 0 20px"}}>
  <div style={{background:"linear-gradient(135deg,rgba(251,191,36,.12),rgba(251,191,36,.04))",border:"1px solid rgba(251,191,36,.3)",borderRadius:"16px",padding:"16px 18px",display:"flex",alignItems:"center",gap:"14px",flexWrap:"wrap"}}>
    <span style={{background:"var(--gold)",color:"var(--ink)",fontSize:"10.5px",fontWeight:800,padding:"4px 10px",borderRadius:"6px",letterSpacing:".02em",whiteSpace:"nowrap"}}>NEW</span>
    <div style={{flex:"1 1 220px"}}>
      <b style={{fontSize:"14px",display:"block",marginBottom:"2px"}}>Oil Record Book &amp; Draft Survey Calculator are live</b>
      <span style={{fontSize:"12.5px",color:"var(--tx2)"}}>Auto-generated MARPOL codes. Verified cargo formulas. Try both free — no signup.</span>
    </div>
    <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
      <a href="/tools/oil-record-book" style={{background:"var(--gold)",color:"var(--ink)",fontSize:"12.5px",fontWeight:700,padding:"9px 14px",borderRadius:"9px",textDecoration:"none",whiteSpace:"nowrap"}}>⚓ Oil Record Book</a>
      <a href="/tools/draft-survey-pro" style={{background:"transparent",border:"1px solid rgba(251,191,36,.4)",color:"var(--gold)",fontSize:"12.5px",fontWeight:700,padding:"9px 14px",borderRadius:"9px",textDecoration:"none",whiteSpace:"nowrap"}}>📐 Draft Survey</a>
    </div>
  </div>
</div>

<section id="try" style={{padding:"30px 0 6px"}}>
  <div className="wrap">
    <div className="trybox rv">
      <div className="sec-tag">🔍 Search now</div>
      <h2 style={{marginBottom:"6px"}}>Find crew — or find your next job</h2>
      <p className="try-sub">Search 15 ranks and open positions worldwide — two taps.</p>
      <SearchWizard />
    </div>
  </div>
</section>

{deckSlot}

<section className="wis">
  <div className="wrap">
    <div className="sec-tag rv">Try it right now — no signup needed</div>
    <h2 className="rv">Free tools, live today</h2>
    <p className="sec-sub rv">Not ready to commit? Try these first — no account required.</p>
    <div className="wisg">
      <a href="/salary-check" className="wis-card wis-link rv">
        <div className="wi">💰</div>
        <b>Check your salary — instantly</b>
        <p>See if you're below, at, or above the 2026 market rate for your rank and vessel type. 10 seconds, no signup.</p>
        <span className="wis-go">Try it free →</span>
      </a>
      <a href="/signup/crew" className="wis-card wis-link rv">
        <div className="wi">⏰</div>
        <b>Never miss a document renewal</b>
        <p>Passport, STCW, medical certificate — add your dates once and we email you before they expire. Free forever.</p>
        <span className="wis-go">Set up free →</span>
      </a>
      <div className="wis-card rv">
        <div className="wi">⚡</div>
        <b>Your profile goes live instantly</b>
        <p>Finish your profile and it appears on our homepage automatically — no extra step. Companies can see you the same day.</p>
        <span className="wis-go wis-static">Included, always</span>
      </div>
      <a href="/tools/oil-record-book" className="wis-card wis-link rv">
        <div className="wi">⚓</div>
        <b>Oil Record Book — Part I</b>
        <p>MARPOL Annex I compliant logging for Engine Department — 24 operations, auto-generated codes, PDF export. Free trial, no signup.</p>
        <span className="wis-go">Try it free →</span>
      </a>
      <a href="/tools/draft-survey-pro" className="wis-card wis-link rv">
        <div className="wi">📐</div>
        <b>Draft Survey Calculator</b>
        <p>Full quadratic-mean cargo calculation using your own vessel's hydrostatic table — verified formulas, signable report. Free trial, no signup.</p>
        <span className="wis-go">Try it free →</span>
      </a>
    </div>
  </div>
</section>

<div className="marq" style={{marginTop:"44px"}}>
  <div className="marq-in">
    <span>MASTER</span><span>CHIEF ENGINEER</span><span>CHIEF OFFICER</span><span>2ND ENGINEER</span><span>2ND OFFICER</span><span>3RD ENGINEER</span><span>ETO</span><span>BOSUN</span><span>AB</span><span>OS</span><span>OILER</span><span>FITTER</span><span>COOK</span><span>MESSMAN</span><span>PUMPMAN</span><span>ELECTRICIAN</span>
    <span>MASTER</span><span>CHIEF ENGINEER</span><span>CHIEF OFFICER</span><span>2ND ENGINEER</span><span>2ND OFFICER</span><span>3RD ENGINEER</span><span>ETO</span><span>BOSUN</span><span>AB</span><span>OS</span><span>OILER</span><span>FITTER</span><span>COOK</span><span>MESSMAN</span><span>PUMPMAN</span><span>ELECTRICIAN</span>
  </div>
</div>

<div className="wrap">
  <div className="salstrip rv">
    <div className="ss-l">
      <span className="ss-t">💰 2026 SALARY INDEX</span>
      <span className="ss-i">Master <b>$9–12k</b></span>
      <span className="ss-i">Chief Engineer <b>$8.5–11.5k</b></span>
      <span className="ss-i">2nd Engineer <b>$6–8k</b></span>
    </div>
    <a href="/salary">See all 15 ranks →</a>
  </div>
</div>

<section id="how" style={{paddingTop:"56px"}}>
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
      <div className="free-strip" style={{fontSize:"14px",padding:"11px 18px"}}>🎁 100% FREE — NO CATCH, NO CARD</div>
      <div className="pnum" style={{color:"var(--grn)"}}>$0 <small>forever</small></div>
      <div className="pper">Free while we grow — always will be for early members</div>
      <div className="pwhy">We're building the crew pool first. Every feature below is unlocked, free, for every seafarer who joins now. No trial, no expiry, no surprise charge.</div>
      <ul className="plist">
        <li>Verified profile badge</li>
        <li>Stealth mode — invisible to your employer</li>
        <li>Profile analytics {"&"} view insights</li>
        <li>Direct messaging with companies</li>
        <li>Priority placement in search results</li>
        <li>Block specific companies</li>
      </ul>
      <a className="btn btn-gold btn-lg" href="/signup/crew" style={{width:"100%"}}>Start free month →</a>
      <div className="pfoot">Always free for crew — no trial, no expiry, no card required.</div>
    </div>
  </div>
</section>

<section id="companies">
  <div className="wrap">
    <div className="sec-tag rv">For Companies</div>
    <h2 className="rv">Hire verified crew — without agency fees</h2>
    <p className="sec-sub rv">Every profile is document-checked before it goes live. Try the full platform free for a month, see the crew pool for yourself — then decide.</p>
        <div className="cplans">
      <div className="cplan rv">
        <h3>Pro</h3>
        <div className="cfor">For active fleets {"&"} crewing departments</div>
        <div className="free-strip">🎁 FIRST MONTH FREE</div>
        <div className="pnum">$199.90 <small>/ month</small></div>
        <div className="pper">after your free month · cancel anytime</div>
        <ul className="plist">
          <li>100 full CV views / month</li>
          <li>Post up to 10 job listings</li>
          <li>Fleet Crew Manager — 1 vessel included</li>
          <li>Advanced search — rank, vessel type, availability</li>
          <li>Direct messaging with crew</li>
          <li>Save {"&"} shortlist candidates</li>
          <li>Verified company badge</li>
        </ul>
        <a className="btn btn-ghost" href="/signup/company?plan=pro" style={{width:"100%",borderColor:"var(--gold)",color:"var(--gold)"}}>Start free month →</a>
      </div>
      <div className="cplan hot rv">
        <div className="hot-tag">MOST POPULAR</div>
        <h3>Fleet</h3>
        <div className="cfor">For large fleets, managers {"&"} crewing agencies</div>
        <div className="free-strip">🎁 FIRST MONTH FREE</div>
        <div className="pnum">$249.90 <small>/ month</small></div>
        <div className="pper">after your free month · cancel anytime</div>
        <ul className="plist">
          <li>Everything in Pro</li>
          <li><b style={{color:"var(--gold)"}}>Unlimited full CV views</b></li>
          <li>Unlimited job listings</li>
          <li><b style={{color:"var(--gold)"}}>Fleet Crew Manager — unlimited vessels</b></li>
          <li>Multiple user seats for your team</li>
          <li>Bulk shortlist {"&"} export</li>
          <li>Priority support {"&"} onboarding</li>
          <li>API / ATS integration</li>
        </ul>
        <a className="btn btn-gold" href="/signup/company?plan=fleet" style={{width:"100%"}}>Start free month →</a>
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
        <b>Built by seafarers, for seafarers.</b>
        <p>No recruiters in between, no commission — verified crew and companies, direct contact. Every feature here exists because we needed it ourselves at sea.</p>
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
      <details className="rv"><summary>Is the first month really free for companies?</summary><p>Yes — companies get a full month with all Pro/Fleet features unlocked, no charge. Cancel any time during the free month and you pay nothing at all. Crew membership works differently — it's free forever, not just for a trial month (see below).</p></details>
      <details className="rv"><summary>Is crew membership really free — no hidden cost later?</summary><p>Yes. Right now, while we build the crew pool, every feature is free for seafarers — no trial period, no card required, no surprise charge. We may introduce paid tiers in the future once the platform has scaled, but any account created now keeps its free access.</p></details>
      <details className="rv"><summary>How does profile verification work?</summary><p>After you upload your CV and certificates (STCW, COC, medical), our team manually reviews the documents before your profile goes live. Verified profiles carry a visible badge that companies can trust.</p></details>
      <details className="rv"><summary>Can my current employer see that I'm looking?</summary><p>Not if you don't want them to. Stealth Mode hides your profile from specific companies you choose — including your current employer. You stay invisible to them while staying visible to everyone else.</p></details>
      <details className="rv"><summary>Do you take any commission from my salary or the placement?</summary><p>Never. Zero commission, from either side, ever. Companies pay a flat subscription; crew pay nothing at all. Your salary is between you and your employer — as it should be.</p></details>
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
        <a className="logo" href="/"><span className="logo-ic"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#0b0e13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2.4"/><line x1="12" y1="7.4" x2="12" y2="20.5"/><line x1="7.5" y1="10.4" x2="16.5" y2="10.4"/><path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7"/><path d="M4.5 14.8l-1.6-1.2M4.5 14.8l2-.4"/><path d="M19.5 14.8l1.6-1.2M19.5 14.8l-2-.4"/></svg></span><b>Ship<span>Crew</span>Finder</b></a>
        <p>The verified maritime career platform. Direct contact. Zero commission. Built at sea.</p>
      </div>
      <div>
        <h4>Product</h4>
        <ul>
          <li><a href="/signup/crew">For Crew</a></li>
          <li><a href="/signup/company">For Companies</a></li>
          <li><a href="#companies">Pricing</a></li>
          <li><a href="#how">How it works</a></li>
          <li><a href="/salary">Salary Index</a></li>
          <li><a href="/blog/complete-guide-seafarer-career-2026">Career Guide 2026</a></li>
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

{/* PWA: Android kurulum çipi */}
<div className="pwa-chip" id="pwa-install">
  <div className="pic">⚓</div>
  <div><b>Install ShipCrewFinder</b><span>Add to your home screen — works like an app</span></div>
</div>

{/* PWA: iOS yönlendirme çipi */}
<div className="pwa-chip" id="ios-tip">
  <div className="pic">⚓</div>
  <div><b>Add to Home Screen</b><span>Tap Share <span style={{fontSize:"13px"}}>⎋</span> then "Add to Home Screen" — opens like an app</span></div>
  <button className="px" id="ios-tip-x" aria-label="Close">✕</button>
</div>

{/* Exit-intent: dürüst, çeşitlenen hatırlatma */}
<div className="exit-card" id="exit-intent">
  <div className="ec-ic" id="exit-ic">💰</div>
  <div style={{flex:1,minWidth:0}}>
    <b id="exit-t">Leaving without checking your salary?</b>
    <span id="exit-s">Free, 10 seconds, no signup — see if you&apos;re below or above market rate.</span>
  </div>
  <a href="/salary-check" className="ec-btn" id="exit-btn">Check now</a>
  <button className="ec-x" id="exit-intent-x" aria-label="Close">✕</button>
</div>
    </>
  );
}
