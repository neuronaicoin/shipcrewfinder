import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import Script from "next/script";
import MobileTabBar from "@/app/components/mobile-tabbar";
import AiChatWidget from "@/app/components/ai-chat-widget";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d1030",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://shipcrewfinder.com"),
  title: "ShipCrewFinder — Global Maritime Career Platform",
  description:
    "Verified seafarers and shipping companies, connected directly. Jobs, CV builder, sea time tracker, live crew chat — 0% commission, ever.",
  keywords: [
    "seafarer jobs",
    "yacht crew jobs",
    "maritime careers",
    "ship crew recruitment",
    "global seafarer platform",
  ],
  authors: [{ name: "ShipCrewFinder" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ShipCrewFinder",
  },
  verification: {
    other: {
      "msvalidate.01": "9CB03E8E93C7289160D5677D71AB3ACB",
    },
  },
  openGraph: {
    title: "ShipCrewFinder — Global Maritime Career Platform",
    description:
      "Verified seafarers and shipping companies, connected directly. Jobs, CV builder, sea time tracker, live crew chat — 0% commission, ever.",
    url: "/",
    type: "website",
    locale: "en_US",
    siteName: "ShipCrewFinder",
    images: [
      {
        url: "/opengraph-image?v=2",
        width: 1200,
        height: 630,
        alt: "ShipCrewFinder — Global Maritime Career Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@shipcrewfinder",
    title: "ShipCrewFinder — Global Maritime Career Platform",
    description: "Verified seafarers and shipping companies, connected directly. 0% commission, ever.",
    images: ["/opengraph-image?v=2"],
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://shipcrewfinder.com/#organization",
  name: "ShipCrewFinder",
  url: "https://shipcrewfinder.com",
  logo: {
    "@type": "ImageObject",
    url: "https://shipcrewfinder.com/apple-icon.png",
    width: 180,
    height: 180,
  },
  image: "https://shipcrewfinder.com/opengraph-image?v=2",
  description:
    "ShipCrewFinder is a verified global maritime career platform connecting seafarers and shipping companies directly — with zero commission.",
  slogan: "Your next contract. No agency. No cut.",
  foundingDate: "2026",
  knowsAbout: [
    "maritime recruitment",
    "seafarer jobs",
    "ship crew management",
    "seafarer salaries",
    "STCW certification",
  ],
  sameAs: [
    "https://x.com/shipcrewfinder",
    "https://www.tiktok.com/@shipcrewfinder",
    "https://www.crunchbase.com/organization/shipcrewfinder",
    "https://www.instagram.com/shipcrewfinder/",
    "https://www.facebook.com/profile.php?id=61592830344116",
  ],
};

const siteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://shipcrewfinder.com/#website",
  name: "ShipCrewFinder",
  alternateName: "Ship Crew Finder",
  url: "https://shipcrewfinder.com",
  publisher: { "@id": "https://shipcrewfinder.com/#organization" },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://shipcrewfinder.com/jobs?rank={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${bricolage.variable} font-sans`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('scf_theme')==='light'){document.body.classList.add('light')}}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        {children}
        <MobileTabBar />
        <AiChatWidget />

        {/* Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8NLPGN4146"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8NLPGN4146');
          `}
        </Script>

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1260266079472196');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1260266079472196&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
